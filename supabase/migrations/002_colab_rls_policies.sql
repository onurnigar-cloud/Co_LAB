-- Co_LAB v2.2 RLS Policies

alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.sources enable row level security;
alter table public.materials enable row level security;
alter table public.question_bank enable row level security;
alter table public.answer_keys enable row level security;
alter table public.presentations enable row level security;
alter table public.activities enable row level security;
alter table public.three_d_models enable row level security;
alter table public.map_tasks enable row level security;
alter table public.ai_library enable row level security;
alter table public.ai_jobs enable row level security;
alter table public.semantic_index enable row level security;

create policy "profiles_select_self_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_all"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_published_topics"
on public.topics for select
to anon, authenticated
using (status = 'published');

create policy "admin_all_topics"
on public.topics for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_sources"
on public.sources for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_public_materials"
on public.materials for select
to anon, authenticated
using (visibility = 'public' and status = 'published');

create policy "admin_all_materials"
on public.materials for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_question_bank"
on public.question_bank for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_answer_keys"
on public.answer_keys for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_public_presentations"
on public.presentations for select
to anon, authenticated
using (visibility = 'public' and approval_status = 'approved');

create policy "admin_all_presentations"
on public.presentations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_public_activities"
on public.activities for select
to anon, authenticated
using (visibility = 'public' and approval_status = 'approved');

create policy "admin_all_activities"
on public.activities for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_public_3d_models"
on public.three_d_models for select
to anon, authenticated
using (visibility = 'public');

create policy "admin_all_3d_models"
on public.three_d_models for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "public_can_read_public_map_tasks"
on public.map_tasks for select
to anon, authenticated
using (visibility = 'public');

create policy "admin_all_map_tasks"
on public.map_tasks for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_ai_library"
on public.ai_library for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_ai_jobs"
on public.ai_jobs for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admin_all_semantic_index"
on public.semantic_index for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
