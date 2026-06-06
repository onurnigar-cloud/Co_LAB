-- Co_LAB v3.4 Presentation Publishing and Visitor Download

create table if not exists public.presentation_publications (
  id uuid primary key default gen_random_uuid(),
  presentation_draft_id uuid references public.presentation_drafts(id) on delete set null,
  presentation_id uuid references public.presentations(id) on delete set null,
  title text not null,
  area text,
  topic_title text,
  description text,
  slide_count integer,
  version text not null default '1.0',
  file_bucket text not null default 'presentation-exports',
  file_path text not null,
  file_size_bytes integer,
  mime_type text not null default 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  visibility text not null default 'public'
    check (visibility in ('public', 'teacher', 'hidden')),
  publication_status text not null default 'published'
    check (publication_status in ('published', 'hidden', 'archived')),
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.presentation_publications enable row level security;

create policy "public_can_read_published_presentations"
on public.presentation_publications for select
to anon, authenticated
using (visibility = 'public' and publication_status = 'published');

create policy "admin_all_presentation_publications"
on public.presentation_publications for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create index if not exists presentation_publications_area_idx
on public.presentation_publications(area);

create index if not exists presentation_publications_topic_idx
on public.presentation_publications(topic_title);

create index if not exists presentation_publications_status_idx
on public.presentation_publications(publication_status, visibility);

-- Supabase Storage kurulumu:
-- Dashboard > Storage bölümünde "presentation-exports" isimli bucket oluşturun.
-- Öneri: bucket private olsun. Public download endpoint kısa süreli signed URL üretsin.
