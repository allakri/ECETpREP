--
-- Create the profiles table
--
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  updated_at timestamp with time zone NULL,
  name character varying NULL,
  phone_number character varying NULL,
  branch character varying NULL,
  college character varying NULL,
  year_of_study character varying NULL,
  avg_score double precision DEFAULT 0,
  tests_taken integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  highest_streak integer DEFAULT 0,
  last_month_streak integer DEFAULT 0,
  study_activities text[] DEFAULT '{}'::text[],
  exam_score_history jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

--
-- Set up Row Level Security (RLS)
--
-- First, drop existing policies if they exist to avoid conflicts.
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;

-- Then, create the policies.
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Finally, enable RLS on the table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Create the handle_new_user function and trigger
-- This function automatically creates a profile entry when a new user signs up.
--
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone_number, branch, college, year_of_study)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'year_of_study'
  );
  return new;
END;
$$;

-- Drop the trigger if it exists before creating it.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- Create the trigger to fire the function after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

--
-- Create the update_user_profile RPC function
-- This allows a user to securely update their profile information.
--
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_id uuid,
    full_name character varying,
    phone_number character varying,
    branch character varying,
    college character varying,
    year_of_study character varying
)
RETURNS void
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
    year_of_study = year_of_study,
    updated_at = now()
  WHERE id = user_id;
END;
$$;

--
-- Create the update_user_progress RPC function
-- This allows the system to securely update a user's exam progress.
--
CREATE OR REPLACE FUNCTION public.update_user_progress(
  user_id uuid,
  new_avg_score double precision,
  new_tests_taken integer,
  new_exam_score_history jsonb,
  new_study_activities text[]
)
RETURNS void
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
    study_activities = new_study_activities,
    -- NOTE: Streak logic can be added here in the future
    updated_at = now()
  WHERE id = user_id;
END;
$$;
