-- First, drop the dependent table 'tests'
DROP TABLE IF EXISTS public.tests;

-- Then, drop the 'profiles' table, using CASCADE to handle any other dependencies.
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop the function and trigger if they exist to avoid "already exists" errors.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;


-- Create the 'profiles' table to store user data.
-- This table will be populated by a trigger when a new user signs up.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(255),
  college VARCHAR(255),
  branch VARCHAR(255),
  year_of_study VARCHAR(50),
  avg_score DOUBLE PRECISION DEFAULT 0,
  tests_taken INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- Create the 'tests' table to store individual exam results.
CREATE TABLE public.tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    examName VARCHAR(255) NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.tests IS 'Stores a record for each test taken by a user.';


-- Function to create a new profile when a user signs up in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone_number, college, branch, year_of_study)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'year_of_study'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
COMMENT ON FUNCTION public.handle_new_user IS 'Creates a public profile for a new user.';

-- Trigger to execute the function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Set up Row-Level Security (RLS) for the 'profiles' table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- Set up Row-Level Security (RLS) for the 'tests' table.
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own tests" ON public.tests;
CREATE POLICY "Users can view their own tests" ON public.tests
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tests" ON public.tests;
CREATE POLICY "Users can insert their own tests" ON public.tests
  FOR INSERT WITH CHECK (auth.uid() = user_id);
