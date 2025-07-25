-- Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
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

-- Function to create a profile for a new user
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

-- Drop the trigger if it exists before creating it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Function to update a user's profile information
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

-- Function to update a user's exam progress
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

-- Grant usage on the functions to authenticated users
GRANT EXECUTE ON FUNCTION public.update_user_profile(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_progress(UUID, DOUBLE PRECISION, INTEGER, JSONB[], TEXT[]) TO authenticated;

-- Enable Row Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can insert their own profile (handled by trigger)
-- No explicit insert policy needed as it's handled by the security definer function

-- Policy: Users can update their own profile via RPC
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);
