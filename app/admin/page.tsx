import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { db } from "@/lib/data";
import { searchAiArchive, decideArchiveAction } from "@/lib/aiArchive";
import { requireAdmin } from "@/lib/auth/admin";
import { SourceProcessor } from "@/components/admin/sources/SourceProcessor";
import { QuestionExtractor } from "@/components/admin/questions/QuestionExtractor";
import { QuestionDraftReviewPanel } from "@/components/admin/questions/QuestionDraftReviewPanel";
import { PresentationGeneratorPanel } from "@/components/admin/presentations/PresentationGeneratorPanel";
import { WebVisualSearchPanel } from "@/components/admin/visuals/WebVisualSearchPanel";
import { SlideVisualAttachPanel } from "@/components/admin/visuals/SlideVisualAttachPanel";
import { SlidePreviewEditorPanel } from "@/components/admin/presentations/preview/SlidePreviewEditorPanel";
import { PresentationPublishPanel } from "@/components/admin/presentations/publish/PresentationPublishPanel";
import { PublicationQualityPanel } from "@/components/admin/presentations/quality/PublicationQualityPanel";
import { AdminMainDashboardPanel } from "@/components/admin/dashboard/AdminMainDashboardPanel";
import { SketchfabModelManagerPanel } from "@/components/admin/threeD/SketchfabModelManagerPanel";

export default async function AdminPage() {
  const auth = await requireAdmin();
  const archiveMatches = searchAiArchive({
    area: "10. Sınıf",
    topic: "Türkiye’de Yer Şekilleri",
    contentType: "Test",
  });

  const archiveDecision = decideArchiveAction(archiveMatches);

  return (
    <div className="adminLayout">
      <AdminSidebar />

      <main className="adminMain">
        {auth.envMissing && (
          <section className="section">
            <div className="panel">
              <h2>Supabase yapılandırması eksik</h2>
              <p>Admin route koruması için `.env.local` içinde Supabase değerleri tanımlanmalıdır. Bu uyarı yalnızca geliştirme/kurulum aşaması içindir.</p>
              <div className="notice">NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ve SUPABASE_SECRET_KEY değerlerini girin.</div>
            </div>
          </section>
        )}

        <section id="dashboard" className="section">
          <AdminMainDashboardPanel />
        </section>
        <section id="dashboard" className="section">
          <div className="sectionHead">
            <h2>Admin Genel Bakış</h2>
            <p>Kaynaklar, soru havuzu, AI arşiv ve yayın durumları burada takip edilir.</p>
          </div>

          <div className="grid3">
            <article className="card">
              <h3>Kaynak Materyaller</h3>
              <p>{db.materials.length} kayıt</p>
            </article>
            <article className="card">
              <h3>Onaylı Sorular</h3>
              <p>{db.questionBank.length} soru</p>
            </article>
            <article className="card">
              <h3>AI Arşiv</h3>
              <p>{db.aiLibrary.length} içerik</p>
            </article>
          </div>
        </section>

        <section id="archive" className="section">
          <div className="sectionHead">
            <h2>AI Kütüphane / Arşiv</h2>
            <p>AI yeni üretim yapmadan önce arşivde aynı veya benzer içerik arar.</p>
          </div>

          <div className="grid2">
            <div className="panel">
              <h3>Örnek arşiv kararı</h3>
              <p>{archiveDecision.message}</p>
              <div className="tagRow">
                <span className="tag">{archiveDecision.action}</span>
                <span className="tag tagDraft">Admin kontrolü gerekir</span>
              </div>
            </div>

            <div className="panel">
              <h3>Eşleşen İçerikler</h3>
              <div className="list">
                {archiveMatches.map((item: any) => (
                  <article className="card" key={item.id}>
                    <h3>{item.title}</h3>
                    <p>{item.area} · {item.topic} · {item.contentType}</p>
                    <div className="tagRow">
                      <span className="tag">{item.status}</span>
                      <span className="tag">Sürüm {item.version}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="sources" className="section">
          <div className="sectionHead">
            <h2>Kaynak PDF / Drive</h2>
            <p>Ziyaretçiye kaynak link verilmez. Backend dosyayı indirir, parmak izi çıkarır, metni parçalar ve admin/AI işlemleri için saklar.</p>
          </div>

          <SourceProcessor />
        </section>

        <section id="questions" className="section">
          <div className="sectionHead">
            <h2>AI Soru Havuzu</h2>
            <p>Kaynak PDF metninden sorular çıkarılır, doğru cevaplar admin alanında tutulur ve sorular onay bekleyen taslaklara kaydedilir.</p>
          </div>

          <QuestionExtractor />

          <div style={{ marginTop: 24 }}>
            <QuestionDraftReviewPanel />
          </div>

          <div className="sectionHead" style={{ marginTop: 36 }}>
            <h2>Mevcut Onaylı Sorular</h2>
            <p>Bu sorular ziyaretçi test oluşturucuda cevap anahtarı olmadan kullanılabilir.</p>
          </div>

          <div className="grid2">
            {db.questionBank.map((q: any) => (
              <article className="card" key={q.id}>
                <h3>{q.topic}</h3>
                <p>{q.stem}</p>
                <div className="tagRow">
                  <span className="tag">{q.area}</span>
                  <span className="tag">{q.difficulty}</span>
                  <span className="tag tagAdmin">Cevap gizli</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="three-d-models" className="section">
          <SketchfabModelManagerPanel />
        </section>

        <section id="presentations" className="section">
          <div className="sectionHead">
            <h2>AI Sunum Üretici</h2>
            <p>Kaynak PDF/chunk metninden kavram atlamadan, kapsam kontrollü ve admin onaylı sunum taslağı üretir.</p>
          </div>

          <PresentationGeneratorPanel />

          <div style={{ marginTop: 24 }}>
            <WebVisualSearchPanel />
          </div>

          <div style={{ marginTop: 24 }}>
            <SlideVisualAttachPanel />
          </div>

          <div style={{ marginTop: 24 }}>
            <SlidePreviewEditorPanel />
          </div>

          <div style={{ marginTop: 24 }}>
            <PresentationPublishPanel />
          </div>

          <div style={{ marginTop: 24 }}>
            <PublicationQualityPanel />
          </div>
        </section>

        <section id="security" className="section">
          <div className="sectionHead">
            <h2>Cevap Anahtarı Güvenliği</h2>
            <p>Cevap anahtarı ziyaretçi tarafında hiçbir koşulda gösterilmez.</p>
          </div>

          <div className="panel">
            <div className="notice noticeDanger">
              Eğer cevap anahtarı PDF’nin arka sayfalarındaysa kaynak PDF ziyaretçiye açılmaz. Sorular soru havuzuna aktarılır ve cevap anahtarı admin alanında kalır.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
