
-- Create the profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone_number text,
  branch text,
  college text,
  year_of_study text,
  avg_score float8 default 0,
  tests_taken integer default 0,
  current_streak integer default 0,
  last_month_streak integer default 0,
  highest_streak integer default 0,
  study_activities text[] default array[]::text[],
  exam_score_history jsonb default '[]'::jsonb
);

-- Drop existing policies if they exist to prevent errors on re-run
drop policy if exists "Users can view their own profile." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;

-- Set up Row Level Security (RLS)
-- Users can view their own profile
create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);


-- Function to create a profile for a new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone_number, branch, college, year_of_study)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'year_of_study'
  );
  return new;
end;
$$;

-- Trigger to call handle_new_user on new user sign-up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Function to update a user's profile details
create or replace function public.update_user_profile(
    user_id uuid,
    full_name text,
    phone_number text,
    branch text,
    college text,
    year_of_study text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    name = full_name,
    phone_number = phone_number,
    branch = branch,
    college = college,
    year_of_study = year_of_study
  where id = user_id;
end;
$$;


-- Function to update a user's progress after an exam
create or replace function public.update_user_progress(
    user_id uuid,
    new_avg_score float8,
    new_tests_taken integer,
    new_exam_score_history jsonb,
    new_study_activities text[]
)
returns void
language plpgsql
-- No longer needs security definer with the corrected RLS policy
set search_path = public
as $$
begin
  update public.profiles
  set
    avg_score = new_avg_score,
    tests_taken = new_tests_taken,
    exam_score_history = new_exam_score_history,
    study_activities = new_study_activities
    -- In the future, streak logic will be updated here as well
  where id = user_id;
end;
$$;
