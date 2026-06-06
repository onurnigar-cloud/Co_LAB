-- Co_LAB v2.2 Supabase Schema

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'visitor' check (role in ('admin', 'teacher', 'visitor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  area text not null,
  class_level text,
  title text not null,
  slug text unique not null,
  summary text,
  source_book_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null check (source_type in ('google_drive', 'upload', 'external_url')),
  drive_file_id text,
  drive_url text,
  file_type text,
  checksum text,
  page_count integer,
  visibility text not null default 'admin' check (visibility in ('admin', 'teacher', 'public')),
  admin_only boolean not null default true,
  created_at timestamptz not null default now(),
  last_processed_at timestamptz
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  area text,
  topic_id uuid references public.topics(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  visibility text not null default 'draft' check (visibility in ('public', 'teacher', 'admin', 'draft', 'archived')),
  visitor_direct_source_access boolean not null default false,
  served_through text not null default 'topic_card_or_template',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'hidden', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_bank (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  area text not null,
  class_level text,
  topic_id uuid references public.topics(id) on delete set null,
  topic_title text,
  difficulty text not null default 'Orta',
  question_type text not null,
  stem text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text,
  explanation text,
  visitor_show_answer boolean not null default false,
  approval_status text not null default 'draft' check (approval_status in ('draft', 'approved', 'rejected', 'needs_review')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.answer_keys (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete cascade,
  related_material_id uuid references public.materials(id) on delete set null,
  start_page integer,
  end_page integer,
  answer_data jsonb not null default '{}'::jsonb,
  visibility text not null default 'admin' check (visibility in ('admin')),
  visitor_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.presentations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  title text not null,
  area text,
  slide_count integer,
  pptx_url text,
  google_slides_url text,
  coverage_status text not null default 'pending' check (coverage_status in ('pending', 'complete', 'missing_concepts')),
  approval_status text not null default 'draft' check (approval_status in ('draft', 'approved', 'rejected', 'needs_review')),
  visibility text not null default 'draft' check (visibility in ('public', 'teacher', 'admin', 'draft')),
  version text not null default '0.1',
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete set null,
  source_id uuid references public.sources(id) on delete set null,
  activity_type text not null,
  title text not null,
  content_json jsonb not null default '{}'::jsonb,
  print_template text,
  visibility text not null default 'draft' check (visibility in ('public', 'teacher', 'admin', 'draft')),
  approval_status text not null default 'draft' check (approval_status in ('draft', 'approved', 'rejected', 'needs_review')),
  created_at timestamptz not null default now()
);

create table if not exists public.three_d_models (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete set null,
  title text not null,
  provider text not null default 'Sketchfab',
  page_url text,
  embed_url text,
  purpose text,
  teacher_note text,
  visibility text not null default 'public' check (visibility in ('public', 'teacher', 'admin', 'draft')),
  created_at timestamptz not null default now()
);

create table if not exists public.map_tasks (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete set null,
  place_name text not null,
  google_maps_url text,
  street_view_url text,
  observation_question text,
  student_task text,
  visibility text not null default 'public' check (visibility in ('public', 'teacher', 'admin', 'draft')),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_library (
  id uuid primary key default gen_random_uuid(),
  content_type text not null,
  title text not null,
  area text,
  topic_id uuid references public.topics(id) on delete set null,
  topic_title text,
  source_id uuid references public.sources(id) on delete set null,
  difficulty text,
  version text not null default '1.0',
  status text not null default 'draft' check (status in ('draft', 'approved', 'rejected', 'needs_review', 'published')),
  visitor_visible boolean not null default false,
  reuse_rule text,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  request_type text not null,
  request_payload jsonb not null default '{}'::jsonb,
  source_id uuid references public.sources(id) on delete set null,
  input_hash text,
  archive_match_status text,
  decision text,
  status text not null default 'queued' check (status in ('queued', 'processing', 'completed', 'failed', 'review')),
  result_id uuid,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.semantic_index (
  id uuid primary key default gen_random_uuid(),
  item_type text not null,
  item_id uuid not null,
  embedding jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace view public.public_questions as
select
  id,
  area,
  class_level,
  topic_id,
  topic_title,
  difficulty,
  question_type,
  stem,
  options,
  approval_status
from public.question_bank
where approval_status = 'approved';

create or replace view public.public_presentations as
select
  id,
  topic_id,
  title,
  area,
  slide_count,
  pptx_url,
  google_slides_url,
  version
from public.presentations
where visibility = 'public' and approval_status = 'approved';

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;
