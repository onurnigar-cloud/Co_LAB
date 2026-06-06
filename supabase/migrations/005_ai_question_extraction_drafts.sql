-- Co_LAB v2.5 AI Question Extraction Drafts

create table if not exists public.question_extraction_drafts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  source_title text,
  area text,
  class_level text,
  topic_title text,
  difficulty text,
  question_type text,
  stem text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text,
  explanation text,
  confidence numeric,
  needs_review boolean not null default true,
  approval_status text not null default 'needs_review' check (approval_status in ('needs_review', 'approved', 'rejected')),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table public.question_extraction_drafts enable row level security;

create policy "admin_all_question_extraction_drafts"
on public.question_extraction_drafts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create index if not exists question_extraction_drafts_source_idx
on public.question_extraction_drafts(source_id);

create index if not exists question_extraction_drafts_status_idx
on public.question_extraction_drafts(approval_status);

-- Approval helper: approved draft -> question_bank
create or replace function public.approve_question_draft(draft_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  draft_record public.question_extraction_drafts%rowtype;
  new_question_id uuid;
begin
  if not public.is_admin() then
    raise exception 'admin privilege required';
  end if;

  select * into draft_record
  from public.question_extraction_drafts
  where id = draft_id;

  if draft_record.id is null then
    raise exception 'draft not found';
  end if;

  insert into public.question_bank (
    source_id,
    area,
    class_level,
    topic_title,
    difficulty,
    question_type,
    stem,
    options,
    correct_answer,
    explanation,
    visitor_show_answer,
    approval_status,
    approved_at
  )
  values (
    draft_record.source_id,
    draft_record.area,
    draft_record.class_level,
    draft_record.topic_title,
    coalesce(draft_record.difficulty, 'Orta'),
    draft_record.question_type,
    draft_record.stem,
    draft_record.options,
    draft_record.correct_answer,
    draft_record.explanation,
    false,
    'approved',
    now()
  )
  returning id into new_question_id;

  update public.question_extraction_drafts
  set approval_status = 'approved',
      approved_at = now()
  where id = draft_id;

  return new_question_id;
end;
$$;
