-- Co_LAB v2.7 Public Test Topic Summary View

create or replace view public.public_question_topics as
select
  area,
  topic_title,
  count(*)::integer as question_count
from public.question_bank
where approval_status = 'approved'
group by area, topic_title
order by area, topic_title;

-- Not:
-- public_questions view zaten doğru cevap alanını dışarıda bırakır.
-- public_question_topics yalnızca konu ve sayı özeti verir.
-- Cevap anahtarı, kaynak PDF ve Drive bilgisi içermez.
