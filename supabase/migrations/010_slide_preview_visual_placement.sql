-- Co_LAB v3.3 Slide Preview Editor / Visual Placement

alter table public.presentation_slide_visuals
add column if not exists fit_mode text not null default 'cover'
check (fit_mode in ('cover', 'contain', 'fill'));

alter table public.presentation_slide_visuals
add column if not exists focal_x numeric not null default 0.5;

alter table public.presentation_slide_visuals
add column if not exists focal_y numeric not null default 0.5;

alter table public.presentation_slide_visuals
add column if not exists caption_override text;

alter table public.presentation_slide_visuals
add column if not exists placement_note text;

-- Bu alanlar slayt önizleme ve gelecekteki görsel kırpma/konumlandırma için kullanılır.
