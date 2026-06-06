-- Co_LAB v2.6 Question Draft Review Helpers

-- Draft güncelleme için temel alanları güvenli şekilde düzenlenebilir tutar.
create or replace function public.update_question_draft(
  draft_id uuid,
  new_stem text,
  new_options jsonb,
  new_correct_answer text,
  new_explanation text,
  new_area text,
  new_class_level text,
  new_topic_title text,
  new_difficulty text,
  new_question_type text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin privilege required';
  end if;

  update public.question_extraction_drafts
  set
    stem = new_stem,
    options = coalesce(new_options, '[]'::jsonb),
    correct_answer = new_correct_answer,
    explanation = new_explanation,
    area = new_area,
    class_level = new_class_level,
    topic_title = new_topic_title,
    difficulty = new_difficulty,
    question_type = new_question_type,
    needs_review = false
  where id = draft_id
    and approval_status = 'needs_review';

  return draft_id;
end;
$$;

create or replace function public.reject_question_draft(draft_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin privilege required';
  end if;

  update public.question_extraction_drafts
  set approval_status = 'rejected'
  where id = draft_id
    and approval_status = 'needs_review';

  return draft_id;
end;
$$;

create or replace function public.bulk_approve_question_drafts(draft_ids uuid[])
returns table(approved_draft_id uuid, question_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  did uuid;
  qid uuid;
begin
  if not public.is_admin() then
    raise exception 'admin privilege required';
  end if;

  foreach did in array draft_ids loop
    qid := public.approve_question_draft(did);
    approved_draft_id := did;
    question_id := qid;
    return next;
  end loop;
end;
$$;
