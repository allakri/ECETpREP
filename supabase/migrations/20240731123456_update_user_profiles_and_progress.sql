-- Drop the trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the handle_new_user function with security best practices
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Recreate the trigger on the auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Recreate the update_user_profile function with security best practices
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

-- Grant execute permission to the authenticated role
GRANT EXECUTE ON FUNCTION public.update_user_profile(UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Recreate the update_user_progress function with security best practices
CREATE OR REPLACE FUNCTION public.update_user_progress(
    user_id UUID,
    new_avg_score FLOAT,
    new_tests_taken INT,
    new_exam_score_history JSONB,
    new_study_activities JSONB
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

-- Grant execute permission to the authenticated role
GRANT EXECUTE ON FUNCTION public.update_user_progress(UUID, FLOAT, INT, JSONB, JSONB) TO authenticated;
