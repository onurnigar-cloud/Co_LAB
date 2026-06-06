-- Co_LAB v2.2 Seed Data

insert into public.topics (area, class_level, title, slug, summary, source_book_url, status)
values
  ('9. Sınıf', '9', 'Mekânın Aynası: Haritalar', '9-mekanin-aynasi-haritalar', 'Ölçek, yön, lejant ve harita okuryazarlığı.', 'https://tymm.meb.gov.tr/upload/kitap/cografya-9.pdf', 'published'),
  ('10. Sınıf', '10', 'Türkiye’de Yer Şekilleri', '10-turkiyede-yer-sekilleri', 'Türkiye’de dağlar, ovalar, platolar, akarsular ve yer şekillerinin insan faaliyetleriyle ilişkisi incelenir.', 'https://tymm.meb.gov.tr/upload/kitap/cografya-10.pdf', 'published'),
  ('TYT', 'TYT', 'Harita Bilgisi', 'tyt-harita-bilgisi', 'Ölçek, konum, izohips ve harita soruları.', null, 'published')
on conflict (slug) do nothing;

insert into public.sources (title, source_type, drive_file_id, file_type, visibility, admin_only)
values
  ('10. Sınıf Coğrafya Ders Notu', 'google_drive', '1pTPUSO5fSrecf8TV5PHnzWHalWF8INgj', 'pdf', 'admin', true),
  ('AYT / 11 ve 12. Sınıf Uyumlu Coğrafya Testi', 'google_drive', '1f-AY2K5oXxjtvQqVdDvp2xn9tT9EKdQr', 'pdf', 'admin', true);

insert into public.question_bank (
  area, class_level, topic_title, difficulty, question_type, stem, options, correct_answer, visitor_show_answer, approval_status
)
values
  (
    '10. Sınıf',
    '10',
    'Türkiye’de Yer Şekilleri',
    'Orta',
    'Çoktan seçmeli',
    'Türkiye’de kısa mesafelerde yükselti ve yer şekillerinin değişmesi aşağıdakilerden hangisini doğrudan artırır?',
    '["Nüfus artış hızını", "İklim çeşitliliğini", "Denizlerin tuzluluk oranını", "Jeolojik zamanların süresini", "Yerel saat farkını"]'::jsonb,
    'B',
    false,
    'approved'
  ),
  (
    '9. Sınıf',
    '9',
    'Mekânın Aynası: Haritalar',
    'Kolay',
    'Çoktan seçmeli',
    'Haritalarda kullanılan renk, çizgi ve sembollerin anlamını gösteren bölüme ne ad verilir?',
    '["Ölçek", "Lejant", "Koordinat", "Projeksiyon", "Profil"]'::jsonb,
    'B',
    false,
    'approved'
  );

insert into public.presentations (title, area, slide_count, pptx_url, google_slides_url, coverage_status, approval_status, visibility, version)
values
  ('Türkiye’de Yer Şekilleri', '10. Sınıf', 36, '#', '#', 'complete', 'approved', 'public', '1.0');

insert into public.ai_library (content_type, title, area, topic_title, difficulty, version, status, visitor_visible, reuse_rule)
values
  ('Test', 'Türkiye’de Yer Şekilleri 10 Soruluk Orta Düzey Test', '10. Sınıf', 'Türkiye’de Yer Şekilleri', 'Orta', '1.0', 'approved', true, 'Aynı konu ve zorlukta test istenirse arşivden getirilebilir.');
