-- Co_LAB v3.7 Sketchfab Model Library and 3D Board

create table if not exists public.sketchfab_model_library (
  id uuid primary key default gen_random_uuid(),
  sketchfab_uid text not null unique,
  source_url text not null,
  embed_url text not null,
  oembed_html text,
  original_title text,
  display_name text not null,
  educational_name text,
  description text,
  thumbnail_url text,
  author_name text,
  author_url text,
  license text,
  license_url text,
  tags jsonb not null default '[]'::jsonb,
  model_status text not null default 'draft'
    check (model_status in ('draft', 'ready', 'hidden', 'archived')),
  visibility text not null default 'admin'
    check (visibility in ('admin', 'teacher', 'public', 'hidden')),
  source_profile_url text default 'https://sketchfab.com/onurnigar/models',
  imported_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sketchfab_model_library enable row level security;

create policy "admin_all_sketchfab_model_library"
on public.sketchfab_model_library for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_public_sketchfab_models"
on public.sketchfab_model_library for select
to anon, authenticated
using (visibility = 'public' and model_status = 'ready');

create table if not exists public.topic_3d_model_links (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete cascade,
  sketchfab_model_id uuid references public.sketchfab_model_library(id) on delete cascade,
  display_order integer not null default 1,
  teacher_note text,
  student_task text,
  board_mode text not null default 'explore'
    check (board_mode in ('explore', 'guided_observation', 'compare', 'assessment')),
  default_for_topic boolean not null default false,
  visibility text not null default 'public'
    check (visibility in ('admin', 'teacher', 'public', 'hidden')),
  created_at timestamptz not null default now(),
  unique(topic_id, sketchfab_model_id)
);

alter table public.topic_3d_model_links enable row level security;

create policy "admin_all_topic_3d_model_links"
on public.topic_3d_model_links for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_public_topic_3d_model_links"
on public.topic_3d_model_links for select
to anon, authenticated
using (visibility = 'public');

create or replace view public.public_topic_3d_models as
select
  l.id as link_id,
  t.id as topic_id,
  t.area,
  t.class_level,
  t.title as topic_title,
  t.slug as topic_slug,
  m.id as model_id,
  m.sketchfab_uid,
  m.source_url,
  m.embed_url,
  m.display_name,
  m.educational_name,
  m.description,
  m.thumbnail_url,
  m.author_name,
  m.license,
  l.display_order,
  l.teacher_note,
  l.student_task,
  l.board_mode,
  l.default_for_topic
from public.topic_3d_model_links l
join public.topics t on t.id = l.topic_id
join public.sketchfab_model_library m on m.id = l.sketchfab_model_id
where l.visibility = 'public'
  and m.visibility = 'public'
  and m.model_status = 'ready'
order by t.area, t.title, l.display_order;

-- v3.6 içerik dashboard'undaki public_3d_model_count, mevcut three_d_models tablosundan geliyordu.
-- v3.7 ile Sketchfab bağlantıları da kullanılacağı için dashboard ileride bu view ile genişletilebilir.
