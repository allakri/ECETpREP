-- Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  phone_number text,
  branch text,
  college text,
  year_of_study text,
  -- Progress tracking fields
  avg_score double precision DEFAULT 0,
  tests_taken integer DEFAULT 0,
  study_activities date[] DEFAULT ARRAY[]::date[],
  exam_score_history jsonb DEFAULT '[]'::jsonb,
  current_streak integer DEFAULT 0,
  last_month_streak integer DEFAULT 0,
  highest_streak integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- Row Level Security (RLS) for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles Table
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Function to handle new user registration
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
  RETURN new;
END;
$$;

-- Trigger to call handle_new_user on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RPC for updating user profile securely
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_id uuid,
    full_name text,
    phone_number text,
    branch text,
    college text,
    year_of_study text
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

-- RPC for updating user progress securely
CREATE OR REPLACE FUNCTION public.update_user_progress(
    user_id uuid,
    new_avg_score double precision,
    new_tests_taken integer,
    new_exam_score_history jsonb,
    new_study_activities date[]
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
    updated_at = now()
  WHERE id = user_id;
END;
$$;
