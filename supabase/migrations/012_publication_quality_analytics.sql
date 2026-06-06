-- Co_LAB v3.5 Publication Quality, Version History and Download Analytics

alter table public.presentation_publications
add column if not exists quality_status text not null default 'needs_review'
check (quality_status in ('needs_review', 'approved', 'warning', 'failed'));

alter table public.presentation_publications
add column if not exists quality_score integer not null default 0
check (quality_score between 0 and 100);

alter table public.presentation_publications
add column if not exists quality_note text;

alter table public.presentation_publications
add column if not exists last_quality_review_at timestamptz;

alter table public.presentation_publications
add column if not exists parent_publication_id uuid references public.presentation_publications(id) on delete set null;

create table if not exists public.presentation_quality_checks (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid references public.presentation_publications(id) on delete cascade,
  checklist jsonb not null default '{}'::jsonb,
  score integer not null default 0 check (score between 0 and 100),
  status text not null default 'needs_review'
    check (status in ('needs_review', 'approved', 'warning', 'failed')),
  reviewer_note text,
  created_at timestamptz not null default now()
);

alter table public.presentation_quality_checks enable row level security;

create policy "admin_all_presentation_quality_checks"
on public.presentation_quality_checks for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table if not exists public.presentation_download_events (
  id uuid primary key default gen_random_uuid(),
  publication_id uuid references public.presentation_publications(id) on delete cascade,
  user_agent text,
  referrer text,
  downloaded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.presentation_download_events enable row level security;

create policy "admin_all_presentation_download_events"
on public.presentation_download_events for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Public kullanıcı insert yapmaz. Download event backend admin client ile yazılır.

create or replace view public.presentation_publication_stats as
select
  p.id,
  p.title,
  p.area,
  p.topic_title,
  p.version,
  p.visibility,
  p.publication_status,
  p.quality_status,
  p.quality_score,
  p.published_at,
  p.updated_at,
  p.slide_count,
  coalesce(count(d.id), 0)::integer as download_count,
  max(d.downloaded_at) as last_downloaded_at
from public.presentation_publications p
left join public.presentation_download_events d
  on d.publication_id = p.id
group by
  p.id,
  p.title,
  p.area,
  p.topic_title,
  p.version,
  p.visibility,
  p.publication_status,
  p.quality_status,
  p.quality_score,
  p.published_at,
  p.updated_at,
  p.slide_count;

create or replace view public.public_presentation_download_counts as
select
  p.id as publication_id,
  coalesce(count(d.id), 0)::integer as download_count
from public.presentation_publications p
left join public.presentation_download_events d
  on d.publication_id = p.id
where p.visibility = 'public'
  and p.publication_status = 'published'
group by p.id;

-- Bu view yalnızca yayınlanmış public sunumlar için toplam indirme sayısı verir.
-- Admin olmayan kullanıcı ham download event kayıtlarını göremez.
