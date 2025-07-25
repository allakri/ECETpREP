
-- Create the profiles table to store user data
-- This table is linked to the auth.users table via the user's ID
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone_number TEXT,
  branch TEXT,
  college TEXT,
  year_of_study TEXT,
  avg_score DOUBLE PRECISION DEFAULT 0,
  tests_taken INTEGER DEFAULT 0,
  study_activities TEXT[] DEFAULT ARRAY[]::TEXT[],
  exam_score_history JSONB[] DEFAULT ARRAY[]::JSONB[],
  current_streak INTEGER DEFAULT 0,
  last_month_streak INTEGER DEFAULT 0,
  highest_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for the profiles table
-- This ensures that users can only access their own data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-running the script
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

-- Create policies for RLS
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile." ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Function to create a new user profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone_number, branch, college, year_of_study)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'year_of_study'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set the search_path for the function to enhance security
ALTER FUNCTION public.handle_new_user() SET search_path = public;


-- Trigger to execute the handle_new_user function after a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Secure RPC function for updating a user's profile information
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_id UUID,
    full_name TEXT,
    phone_number TEXT,
    branch TEXT,
    college TEXT,
    year_of_study TEXT
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET
    name = full_name,
    phone_number = phone_number,
    branch = branch,
    college = college,
    year_of_study = year_of_study,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set the search_path for the function to enhance security
ALTER FUNCTION public.update_user_profile(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) SET search_path = public;


-- Secure RPC function for updating a user's exam progress
CREATE OR REPLACE FUNCTION public.update_user_progress(
    user_id UUID,
    new_avg_score DOUBLE PRECISION,
    new_tests_taken INTEGER,
    new_exam_score_history JSONB[],
    new_study_activities TEXT[]
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET
    avg_score = new_avg_score,
    tests_taken = new_tests_taken,
    exam_score_history = new_exam_score_history,
    study_activities = new_study_activities,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set the search_path for the function to enhance security
ALTER FUNCTION public.update_user_progress(UUID, DOUBLE PRECISION, INTEGER, JSONB[], TEXT[]) SET search_path = public;
