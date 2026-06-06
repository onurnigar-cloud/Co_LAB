-- Co_LAB v3.1 Web Visual Assets and Attribution

create table if not exists public.web_visual_assets (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('wikimedia', 'nasa', 'openverse')),
  query text not null,
  title text not null,
  thumbnail_url text,
  image_url text,
  source_url text,
  creator text,
  license text,
  license_url text,
  attribution_text text not null,
  width integer,
  height integer,
  description text,
  slide_fit_note text,
  approval_status text not null default 'needs_review'
    check (approval_status in ('needs_review', 'approved', 'rejected')),
  approved_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

alter table public.web_visual_assets enable row level security;

create policy "admin_all_web_visual_assets"
on public.web_visual_assets for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create table if not exists public.presentation_slide_visuals (
  id uuid primary key default gen_random_uuid(),
  presentation_draft_id uuid references public.presentation_drafts(id) on delete cascade,
  slide_number integer not null,
  visual_asset_id uuid references public.web_visual_assets(id) on delete set null,
  usage_note text,
  created_at timestamptz not null default now()
);

alter table public.presentation_slide_visuals enable row level security;

create policy "admin_all_presentation_slide_visuals"
on public.presentation_slide_visuals for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create index if not exists web_visual_assets_query_idx
on public.web_visual_assets(query);

create index if not exists presentation_slide_visuals_draft_slide_idx
on public.presentation_slide_visuals(presentation_draft_id, slide_number);

-- Not:
-- Bu tablolar public değildir.
-- Görsel lisans/atıf bilgisi admin tarafından kontrol edilmeden ziyaretçiye açılmaz.
