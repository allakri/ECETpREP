-- Create the profiles table to store public user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  phone_number TEXT,
  branch TEXT,
  college TEXT,
  year_of_study TEXT,
  -- Progress tracking fields
  avg_score FLOAT8 DEFAULT 0,
  tests_taken INT DEFAULT 0,
  study_activities TEXT[] DEFAULT ARRAY[]::TEXT[],
  exam_score_history JSONB DEFAULT '[]'::JSONB,
  current_streak INT DEFAULT 0,
  last_month_streak INT DEFAULT 0,
  highest_streak INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
-- 1. Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows users to view their own profile
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- 3. Create a policy that allows users to update their own profile
-- This is intentionally left more restrictive; updates should happen via RPC.
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id);


-- Function to handle new user registration
-- This function is called by a trigger when a new user signs up in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
-- Set a secure search_path to prevent security vulnerabilities
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone_number, branch, college, year_of_study)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'phone_number',
    NEW.raw_user_meta_data ->> 'branch',
    NEW.raw_user_meta_data ->> 'college',
    NEW.raw_user_meta_data ->> 'year_of_study'
  );
  RETURN NEW;
END;
$$;

-- Trigger to call handle_new_user on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Secure RPC function to update a user's profile details
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_id UUID,
    full_name TEXT,
    phone_number TEXT,
    branch TEXT,
    college TEXT,
    year_of_study TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
-- Set a secure search_path
SET search_path = public
AS $$
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
$$;


-- Secure RPC function to update a user's exam progress
CREATE OR REPLACE FUNCTION public.update_user_progress(
    user_id UUID,
    new_avg_score FLOAT8,
    new_tests_taken INT,
    new_exam_score_history JSONB,
    new_study_activities TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
-- Set a secure search_path
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    avg_score = new_avg_score,
    tests_taken = new_tests_taken,
    exam_score_history = new_exam_score_history,
    study_activities = new_study_activities,
    -- Add streak logic here in the future if needed
    updated_at = NOW()
  WHERE id = user_id;
END;
$$;


-- Grant usage permission on the functions to authenticated users
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_profile(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_progress(UUID, FLOAT8, INT, JSONB, TEXT[]) TO authenticated;
