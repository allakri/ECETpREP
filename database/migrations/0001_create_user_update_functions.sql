-- Create the profiles table
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  name text,
  phone_number text,
  branch text,
  college text,
  year_of_study text,
  -- Progress fields
  avg_score float8 not null default 0,
  tests_taken integer not null default 0,
  study_activities text[] not null default '{}',
  exam_score_history jsonb not null default '[]'::jsonb,
  current_streak integer not null default 0,
  last_month_streak integer not null default 0,
  highest_streak integer not null default 0,

  primary key (id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on public.profiles
  for update using (auth.uid() = id);


-- Function to handle new user registration
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

-- Trigger to call the function when a new user signs up
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- RPC function to securely update user profile details
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

-- RPC function to securely update user progress after an exam
create or replace function public.update_user_progress(
    user_id uuid,
    new_avg_score float,
    new_tests_taken integer,
    new_exam_score_history jsonb, -- Corrected data type from jsonb[] to jsonb
    new_study_activities text[]
)
returns void
language plpgsql
security definer
set search_path = public
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

grant execute on function public.update_user_profile(uuid,text,text,text,text,text) to authenticated;
grant execute on function public.update_user_progress(uuid,float,integer,jsonb,text[]) to authenticated;
