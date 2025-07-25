-- Create a table for public profiles
create table
  profiles (
    id uuid not null references auth.users on delete cascade,
    full_name text,
    phone_number text,
    branch text,
    college text,
    year_of_study text,
    avg_score double precision default 0,
    tests_taken integer default 0,
    study_activities text[],
    exam_score_history jsonb,
    current_streak integer default 0,
    last_month_streak integer default 0,
    highest_streak integer default 0,
    primary key (id)
  );

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for
select
  using (true);

create policy "Users can insert their own profile." on profiles for insert
with
  check (auth.uid () = id);

create policy "Users can update own profile." on profiles for
update
  using (auth.uid () = id);

-- This trigger automatically creates a profile for new users.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone_number, branch, college, year_of_study, avg_score, tests_taken, exam_score_history, study_activities)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'year_of_study',
    0,
    0,
    '[]'::jsonb,
    '{}'
  );
  return new;
end;
$$ language plpgsql security definer;


create trigger on_auth_user_created
after insert on auth.users for each row
execute procedure public.handle_new_user();


-- Function to update user profile
create or replace function update_user_profile(user_id uuid, full_name text, phone_number text, branch text, college text, year_of_study text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update profiles
  set
    full_name = update_user_profile.full_name,
    phone_number = update_user_profile.phone_number,
    branch = update_user_profile.branch,
    college = update_user_profile.college,
    year_of_study = update_user_profile.year_of_study
  where
    id = user_id;
end;
$$;


-- Function to update user progress
create or replace function update_user_progress(user_id uuid, new_avg_score double precision, new_tests_taken integer, new_exam_score_history jsonb, new_study_activities text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update profiles
  set
    avg_score = new_avg_score,
    tests_taken = new_tests_taken,
    exam_score_history = new_exam_score_history,
    study_activities = new_study_activities
  where
    id = user_id;
end;
$$;


grant execute on function public.update_user_profile(uuid,text,text,text,text,text) to authenticated;
grant execute on function public.update_user_progress(uuid,double precision,integer,jsonb,text[]) to authenticated;
