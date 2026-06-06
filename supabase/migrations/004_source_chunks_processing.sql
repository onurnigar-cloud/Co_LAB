-- Co_LAB v2.4 Source Chunks and Processing Metadata

create table if not exists public.source_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete cascade,
  chunk_index integer not null,
  page_start integer,
  page_end integer,
  text_content text not null,
  token_estimate integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists source_chunks_source_id_idx
on public.source_chunks(source_id);

create index if not exists source_chunks_chunk_index_idx
on public.source_chunks(source_id, chunk_index);

alter table public.source_chunks enable row level security;

create policy "admin_all_source_chunks"
on public.source_chunks for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Kaynak dosyada cevap anahtarı içerme bilgisi tutulur.
alter table public.sources
add column if not exists has_embedded_answer_key boolean not null default false;

alter table public.sources
add column if not exists answer_key_start_page integer;

alter table public.sources
add column if not exists processing_status text not null default 'pending'
check (processing_status in ('pending', 'processing', 'completed', 'failed', 'needs_review'));

alter table public.sources
add column if not exists processing_error text;

-- Güvenlik: source_chunks public değildir. Public view oluşturulmaz.
