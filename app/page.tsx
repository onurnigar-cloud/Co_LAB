import { VisitorHeader } from "@/components/visitor/VisitorHeader";
import { LessonLab } from "@/components/visitor/LessonLab";
import { BackendTestBuilder } from "@/components/visitor/BackendTestBuilder";
import { PublicPresentationLibrary } from "@/components/visitor/presentations/PublicPresentationLibrary";
import { Topic3DBoard } from "@/components/visitor/threeD/Topic3DBoard";
import { getPublicTopics } from "@/lib/data";

export default function HomePage() {
  const topics = getPublicTopics();

  return (
    <>
      <VisitorHeader />

      <main>
        <section className="shell hero">
          <div>
            <div className="eyebrow">Co_LAB_v2.1_nextjs_iskelet</div>
            <h1>Coğrafyayı sınıfta keşfe dönüştür.</h1>
            <p>
              Co_LAB; doküman, sunum, video, 3D model, harita, Street View, çıktı,
              soru havuzu ve AI arşiv sistemini tek öğretim ekosisteminde buluşturur.
            </p>
            <div className="actions">
              <a className="btnPrimary" href="#derslik">Derslik Alanına Git</a>
              <a className="btnSecondary" href="#testolustur">Test Oluştur</a>
            </div>
          </div>

          <aside className="panel">
            <h2>Güvenli içerik akışı</h2>
            <p>
              Kaynak PDF ve cevap anahtarı ziyaretçiye verilmez. Ziyaretçi yalnızca
              admin onaylı, Co_LAB şablonuna yerleştirilmiş içerikleri görür.
            </p>
            <div className="tagRow">
              <span className="tag tagPublic">Yayınlanmış içerik</span>
              <span className="tag">AI arşiv</span>
              <span className="tag tagAdmin">Cevap anahtarı gizli</span>
            </div>
          </aside>
        </section>

        <section className="section">
          <div className="shell sectionHead">
            <h2>Co_LAB modülleri</h2>
            <p>Next.js iskeleti, gerçek backend ve veritabanı entegrasyonu için hazırlandı.</p>
          </div>

          <div className="shell grid3">
            <article className="card">
              <h3>Derslik</h3>
              <p>Konuya göre doküman, video, harita, 3D model, sunum ve çıktı bağlantıları açılır.</p>
            </article>
            <article className="card">
              <h3>Test Oluşturucu</h3>
              <p>Ziyaretçi konu seçer; sistem onaylı soru havuzundan temiz test şablonu üretir.</p>
            </article>
            <article className="card">
              <h3>AI Kütüphane</h3>
              <p>AI aynı işi tekrar üretmeden önce arşivde arama yapar.</p>
            </article>
          </div>
        </section>

        <section className="section">
          <div className="shell sectionHead">
            <h2>Derslik ekranı</h2>
            <p>3D Tahta konuya bağlı çalışır; Sketchfab modeli varsa doğrudan açılır.</p>
          </div>
          <div className="shell">
            <LessonLab topics={topics as any} />
          </div>
        </section>

        <section className="section">
          <div className="shell sectionHead">
            <h2>3D Ders Tahtası</h2>
            <p>Konuya bağlı Sketchfab modelleriyle coğrafi şekilleri üç boyutlu inceleyin.</p>
          </div>
          <div className="shell">
            <Topic3DBoard />
          </div>
        </section>

        <section className="section">
          <div className="shell sectionHead">
            <h2>Sunumlar</h2>
            <p>Yayınlanmış Co_LAB sunumları ziyaretçiye görünür. Kaynak PDF ve AI üretim süreci gösterilmez.</p>
          </div>
          <div className="shell">
            <PublicPresentationLibrary />
          </div>
        </section>

        <section className="section">
          <div className="shell sectionHead">
            <h2>Test Oluşturucu</h2>
            <p>Kaynak PDF’ye doğrudan erişim yoktur. Sorular havuzdan seçilir.</p>
          </div>
          <div className="shell">
            <BackendTestBuilder />
          </div>
        </section>
      </main>
    </>
  );
}
