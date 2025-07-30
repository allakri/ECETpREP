
-- Enable Row Level Security (RLS) on the 'profiles' table if not already enabled.
-- This is a foundational step to ensure our policies are applied.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts and ensure a clean state.
-- It's safer to recreate them than to try and patch them.
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;


-- Create a policy that allows users to view their OWN profile.
-- The `auth.uid() = id` clause is the standard Supabase pattern for this,
-- ensuring a user can only ever select the row where the 'id' column
-- matches their own authenticated user ID.
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Create a policy that allows users to insert their OWN profile.
-- This is necessary for the initial profile creation upon sign-up.
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create a policy that allows users to update their OWN profile.
-- This is crucial for saving profile changes and progress.
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- We are also recreating the `handle_new_user` function to ensure it's
-- correctly configured to work with these RLS policies.
-- This function runs when a new user signs up in Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER -- Important: Changed from DEFINER to INVOKER to respect RLS
SET search_path = public
AS $$
BEGIN
  -- Insert a new row into the public.profiles table for the new user.
  -- The user's ID is taken from `new.id`, and email from `new.email`.
  -- Default values for user metadata are populated from the `new.raw_user_meta_data`.
  INSERT INTO public.profiles (id, email, name, phone_number, branch, college, year_of_study)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'branch',
    new.raw_user_meta_data ->> 'college',
    new.raw_user_meta_data ->> 'year_of_study'
  );
  RETURN new;
END;
$$;

-- Ensure the trigger that calls the function exists and is configured correctly.
-- This trigger fires after a new user is inserted into the `auth.users` table.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

