
-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  name text not null,
  phone_number text,
  branch text,
  college text,
  year_of_study text,
  -- New progress fields
  avg_score double precision not null default 0,
  tests_taken integer not null default 0,
  study_activities text[] not null default array[]::text[],
  exam_score_history jsonb[] not null default array[]::jsonb[],
  current_streak integer not null default 0,
  last_month_streak integer not null default 0,
  highest_streak integer not null default 0,
  
  constraint name_length check (char_length(name) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((auth.uid() = id));

create policy "Users can update their own profile." on profiles
  for update using ((auth.uid() = id));

-- This trigger automatically creates a profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone_number, branch, college, year_of_study)
  values (
    new.id, 
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'year_of_study'
  );
  return new;
end;
$$;

-- Drop trigger if it exists, then create it
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- RPC function to securely update a user's profile
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
    year_of_study = year_of_study,
    updated_at = now()
  where id = user_id and auth.uid() = user_id;
end;
$$;

-- Grant execute permission to the function for authenticated users
grant execute on function public.update_user_profile(uuid, text, text, text, text, text) to authenticated;


-- RPC function to securely update a user's exam progress
create or replace function public.update_user_progress(
    user_id uuid,
    new_avg_score double precision,
    new_tests_taken integer,
    new_exam_score_history jsonb[],
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
    study_activities = new_study_activities,
    updated_at = now()
  where id = user_id and auth.uid() = user_id;
end;
$$;

-- Grant execute permission to the function for authenticated users
grant execute on function public.update_user_progress(uuid, double precision, integer, jsonb[], text[]) to authenticated;
