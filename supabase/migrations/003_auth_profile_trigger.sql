-- Co_LAB v2.3 Auth Profile Trigger and Admin Bootstrap Notes

-- Yeni auth kullanıcısı oluştuğunda profiles tablosuna otomatik kayıt açar.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'visitor'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- İlk admin ataması:
-- 1. Supabase Auth üzerinden admin kullanıcısını oluşturun.
-- 2. Kullanıcı oluşturulduktan sonra aşağıdaki UPDATE komutunu kendi e-postanızla çalıştırın.
--
-- update public.profiles
-- set role = 'admin'
-- where email = 'onur.nigar@tfl.k12.tr';
