
-- Create the user profiles table
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
  exam_score_history JSONB DEFAULT '[]'::jsonb,
  current_streak INTEGER DEFAULT 0,
  last_month_streak INTEGER DEFAULT 0,
  highest_streak INTEGER DEFAULT 0
);

-- Set up Row Level Security (RLS)
-- Drop policies if they exist
DROP POLICY IF EXISTS "Users can see their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

-- Create policies
CREATE POLICY "Users can see their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Enable RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Function to handle new user creation
--
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

--
-- Trigger to call handle_new_user on new user sign-up
--
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


--
-- RPC function to update a user's profile details
--
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
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    name = full_name,
    phone_number = phone_number,
    branch = branch,
    college = college,
    year_of_study = year_of_study
  WHERE id = user_id;
END;
$$;

--
-- RPC function to update a user's exam progress
--
CREATE OR REPLACE FUNCTION public.update_user_progress(
    user_id UUID,
    new_avg_score DOUBLE PRECISION,
    new_tests_taken INTEGER,
    new_exam_score_history JSONB,
    new_study_activities TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    avg_score = new_avg_score,
    tests_taken = new_tests_taken,
    exam_score_history = new_exam_score_history,
    study_activities = new_study_activities
  WHERE id = user_id;
END;
$$;
