-- Co_LAB v2.3 Admin Role Bootstrap Example
-- Bu dosyayı auth kullanıcısı oluşturulduktan sonra çalıştırın.
-- E-posta adresini gerekirse değiştirin.

update public.profiles
set role = 'admin'
where email = 'onur.nigar@tfl.k12.tr';
