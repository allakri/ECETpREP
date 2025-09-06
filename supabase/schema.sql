-- Create the 'profiles' table to store user data.
-- This table is linked to the authentication users table.
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    phone_number TEXT,
    branch TEXT,
    college TEXT,
    year_of_study TEXT,
    avg_score REAL DEFAULT 0,
    tests_taken INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create the 'tests' table to store exam results for each user.
CREATE TABLE public.tests (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    examName TEXT,
    score REAL,
    date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;


-- Function to create a new profile when a new user signs up in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone_number, branch, college, year_of_study)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'year_of_study'
  );
  RETURN new;
END;
$$;

-- Trigger to execute the handle_new_user function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- POLICIES for Row-Level Security

-- 1. Profiles Table Policies
-- Users can view their own profile.
CREATE POLICY "Allow individual user access to their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Users can update their own profile.
CREATE POLICY "Allow individual user to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Tests Table Policies
-- Users can view their own test results.
CREATE POLICY "Allow individual user to view their own tests" ON public.tests FOR SELECT USING (auth.uid() = user_id);
-- Users can insert new test results for themselves.
CREATE POLICY "Allow individual user to create tests for themselves" ON public.tests FOR INSERT WITH CHECK (auth.uid() = user_id);
