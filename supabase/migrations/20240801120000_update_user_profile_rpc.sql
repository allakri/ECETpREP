-- Create the function to update user profiles
create function public.update_user_profile(
    user_id uuid,
    full_name text,
    phone_number text,
    branch text,
    college text,
    year_of_study text,
    avg_score float,
    tests_taken int,
    study_activities text[],
    exam_score_history jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set
    name = full_name,
    phone_number = phone_number,
    branch = branch,
    college = college,
    year_of_study = year_of_study,
    avg_score = avg_score,
    tests_taken = tests_taken,
    study_activities = study_activities,
    exam_score_history = exam_score_history,
    updated_at = now()
  where id = user_id;
end;
$$;

-- Grant execute permission to authenticated users
grant execute
  on function public.update_user_profile(uuid, text, text, text, text, text, float, int, text[], jsonb)
  to authenticated;
