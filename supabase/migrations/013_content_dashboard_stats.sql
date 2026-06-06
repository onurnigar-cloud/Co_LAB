-- Co_LAB v3.6 Content Statistics and Admin Main Dashboard

create or replace view public.content_topic_coverage as
select
  t.id as topic_id,
  t.area,
  t.class_level,
  t.title as topic_title,
  t.slug,
  t.status as topic_status,

  coalesce(q.question_count, 0)::integer as approved_question_count,
  coalesce(p.presentation_count, 0)::integer as published_presentation_count,
  coalesce(a.activity_count, 0)::integer as approved_activity_count,
  coalesce(m.model_count, 0)::integer as public_3d_model_count,
  coalesce(mt.map_task_count, 0)::integer as public_map_task_count,

  case
    when coalesce(q.question_count, 0) >= 10
      and coalesce(p.presentation_count, 0) >= 1
      and coalesce(a.activity_count, 0) >= 1
      and coalesce(m.model_count, 0) >= 1
    then 'complete'
    when coalesce(q.question_count, 0) = 0
      or coalesce(p.presentation_count, 0) = 0
    then 'critical_missing'
    else 'partial'
  end as coverage_status,

  (
    case when coalesce(q.question_count, 0) >= 10 then 25 else least(coalesce(q.question_count, 0) * 2, 24) end
    + case when coalesce(p.presentation_count, 0) >= 1 then 25 else 0 end
    + case when coalesce(a.activity_count, 0) >= 1 then 20 else 0 end
    + case when coalesce(m.model_count, 0) >= 1 then 15 else 0 end
    + case when coalesce(mt.map_task_count, 0) >= 1 then 15 else 0 end
  )::integer as coverage_score

from public.topics t
left join (
  select topic_title, area, count(*) as question_count
  from public.question_bank
  where approval_status = 'approved'
  group by topic_title, area
) q
  on q.topic_title = t.title
  and q.area = t.area
left join (
  select topic_title, area, count(*) as presentation_count
  from public.presentation_publications
  where visibility = 'public'
    and publication_status = 'published'
  group by topic_title, area
) p
  on p.topic_title = t.title
  and p.area = t.area
left join (
  select t2.title as topic_title, t2.area, count(a.id) as activity_count
  from public.activities a
  join public.topics t2 on t2.id = a.topic_id
  where a.visibility = 'public'
    and a.approval_status = 'approved'
  group by t2.title, t2.area
) a
  on a.topic_title = t.title
  and a.area = t.area
left join (
  select t2.title as topic_title, t2.area, count(m.id) as model_count
  from public.three_d_models m
  join public.topics t2 on t2.id = m.topic_id
  where m.visibility = 'public'
  group by t2.title, t2.area
) m
  on m.topic_title = t.title
  and m.area = t.area
left join (
  select t2.title as topic_title, t2.area, count(mt.id) as map_task_count
  from public.map_tasks mt
  join public.topics t2 on t2.id = mt.topic_id
  where mt.visibility = 'public'
  group by t2.title, t2.area
) mt
  on mt.topic_title = t.title
  and mt.area = t.area
where t.status = 'published';

create or replace view public.content_area_summary as
select
  area,
  count(*)::integer as topic_count,
  avg(coverage_score)::integer as average_coverage_score,
  count(*) filter (where coverage_status = 'complete')::integer as complete_topic_count,
  count(*) filter (where coverage_status = 'partial')::integer as partial_topic_count,
  count(*) filter (where coverage_status = 'critical_missing')::integer as critical_missing_topic_count,
  sum(approved_question_count)::integer as total_questions,
  sum(published_presentation_count)::integer as total_presentations,
  sum(approved_activity_count)::integer as total_activities,
  sum(public_3d_model_count)::integer as total_3d_models,
  sum(public_map_task_count)::integer as total_map_tasks
from public.content_topic_coverage
group by area
order by area;

create or replace view public.content_production_priorities as
select
  topic_id,
  area,
  class_level,
  topic_title,
  slug,
  approved_question_count,
  published_presentation_count,
  approved_activity_count,
  public_3d_model_count,
  public_map_task_count,
  coverage_status,
  coverage_score,
  case
    when published_presentation_count = 0 then 'Öncelik 1: Sunum üret'
    when approved_question_count < 10 then 'Öncelik 2: Test/soru havuzu güçlendir'
    when approved_activity_count = 0 then 'Öncelik 3: Etkinlik üret'
    when public_3d_model_count = 0 then 'Öncelik 4: 3D model bağla'
    when public_map_task_count = 0 then 'Öncelik 5: Harita/Street View görevi ekle'
    else 'Kapsam yeterli'
  end as suggested_action
from public.content_topic_coverage
where coverage_status <> 'complete'
order by
  case coverage_status
    when 'critical_missing' then 1
    when 'partial' then 2
    else 3
  end,
  coverage_score asc,
  area asc,
  topic_title asc;

-- Not:
-- Bu view'ler admin dashboard için kullanılır.
-- Public kullanıcıya ham üretim/süreç bilgisi verilmez.
