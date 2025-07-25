
-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  phone_number text,
  branch text,
  college text,
  year_of_study text,
  avg_score double precision,
  tests_taken integer,
  study_activities text[],
  exam_score_history jsonb,
  current_streak integer,
  last_month_streak integer,
  highest_streak integer,
  primary key (id)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table public.profiles
  enable row level security;

-- Drop policies if they exist, then create them
drop policy if exists "Users can view their own profile." on public.profiles;
create policy "Users can view their own profile." on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone_number, branch, college, year_of_study, avg_score, tests_taken, study_activities, exam_score_history, current_streak, last_month_streak, highest_streak)
  values (
    new.id, 
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'year_of_study',
    0, 0, '{}', '[]'::jsonb, 0, 0, 0
  );
  return new;
end;
$$;

-- Drop trigger if it exists, then create it
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Secure RPC for updating user profile
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
security definer set search_path = public
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

-- Secure RPC for updating user progress after an exam
create or replace function public.update_user_progress(
    user_id uuid,
    new_avg_score double precision,
    new_tests_taken integer,
    new_exam_score_history jsonb,
    new_study_activities text[]
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set
    avg_score = new_avg_score,
    tests_taken = new_tests_taken,
    exam_score_history = new_exam_score_history,
    study_activities = new_study_activities
  where id = user_id;
end;
$$;
