-- Co_LAB v2.9 AI Presentation Drafts

create table if not exists public.presentation_drafts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  source_title text,
  area text,
  topic_title text not null,
  presentation_type text not null default 'Ayrıntılı ders anlatım sunumu',
  presentation_title text not null,
  source_summary text,
  main_concepts jsonb not null default '[]'::jsonb,
  sub_concepts jsonb not null default '[]'::jsonb,
  coverage_checklist jsonb not null default '[]'::jsonb,
  missing_concepts jsonb not null default '[]'::jsonb,
  suggested_slide_count integer,
  slides jsonb not null default '[]'::jsonb,
  overall_coverage_status text not null default 'needs_review'
    check (overall_coverage_status in ('complete', 'missing_concepts', 'needs_review')),
  admin_review_note text,
  approval_status text not null default 'needs_review'
    check (approval_status in ('needs_review', 'approved', 'rejected')),
  visibility text not null default 'admin'
    check (visibility in ('admin', 'teacher', 'public', 'draft')),
  version text not null default '0.1',
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table public.presentation_drafts enable row level security;

create policy "admin_all_presentation_drafts"
on public.presentation_drafts for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create index if not exists presentation_drafts_topic_idx
on public.presentation_drafts(topic_title);

create index if not exists presentation_drafts_status_idx
on public.presentation_drafts(approval_status);

create or replace function public.approve_presentation_draft(draft_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  draft_record public.presentation_drafts%rowtype;
  new_presentation_id uuid;
begin
  if not public.is_admin() then
    raise exception 'admin privilege required';
  end if;

  select * into draft_record
  from public.presentation_drafts
  where id = draft_id;

  if draft_record.id is null then
    raise exception 'presentation draft not found';
  end if;

  insert into public.presentations (
    source_id,
    title,
    area,
    slide_count,
    coverage_status,
    approval_status,
    visibility,
    version,
    approved_at
  )
  values (
    draft_record.source_id,
    draft_record.presentation_title,
    draft_record.area,
    draft_record.suggested_slide_count,
    case
      when draft_record.overall_coverage_status = 'complete' then 'complete'
      else 'missing_concepts'
    end,
    'approved',
    'draft',
    draft_record.version,
    now()
  )
  returning id into new_presentation_id;

  update public.presentation_drafts
  set approval_status = 'approved',
      approved_at = now()
  where id = draft_id;

  return new_presentation_id;
end;
$$;
