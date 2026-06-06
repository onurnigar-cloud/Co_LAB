 "use client";

import { FormEvent, useState } from "react";

type ExtractedQuestion = {
  stem: string;
  options: string[];
  correctAnswer: string | null;
  explanation: string | null;
  area: string;
  classLevel: string | null;
  topicTitle: string;
  difficulty: string;
  questionType: string;
  confidence: number;
  needsReview: boolean;
};

type ExtractionResponse = {
  ok?: boolean;
  error?: string;
  result?: {
    sourceSummary: string;
    detectedTopics: string[];
    embeddedAnswerKeyDetected: boolean;
    answerKeyStartHint: string | null;
    questions: ExtractedQuestion[];
  };
  saved?: {
    inserted: number;
    drafts?: Array<any>;
    localOnly?: boolean;
  };
  security?: {
    visitorShowAnswer: boolean;
    sourcePdfVisibleToVisitor: boolean;
    note: string;
  };
};

export function QuestionExtractor() {
  const [sourceTitle, setSourceTitle] = useState("TYT / 9 ve 10. Sınıf Uyumlu Coğrafya Testi");
  const [sourceId, setSourceId] = useState("");
  const [areaHint, setAreaHint] = useState("TYT");
  const [topicHint, setTopicHint] = useState("Harita Bilgisi");
  const [manualText, setManualText] = useState("");
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [response, setResponse] = useState<ExtractionResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setResponse(null);

    try {
      const res = await fetch("/api/admin/questions/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sourceTitle,
          sourceId: sourceId || undefined,
          areaHint,
          topicHint,
          manualText: manualText || undefined,
          maxQuestions
        })
      });

      const data = await res.json();
      setResponse(data);
      setStatus(res.ok ? "success" : "error");
    } catch (error) {
      setStatus("error");
      setResponse({
        ok: false,
        error: error instanceof Error ? error.message : "AI soru çıkarma isteği sırasında hata oluştu."
      });
    }
  }

  return (
    <div className="grid2">
      <form className="panel" onSubmit={handleSubmit}>
        <h3>AI Soru Çıkarma</h3>
        <p>PDF metni veya `source_chunks` kaynağı üzerinden sorular çıkarılır. Sonuçlar doğrudan yayına alınmaz; admin kontrol taslağına düşer.</p>

        <div className="formGrid">
          <label className="full">
            Kaynak Başlığı
            <input value={sourceTitle} onChange={(event) => setSourceTitle(event.target.value)} />
          </label>

          <label>
            Source ID
            <input value={sourceId} onChange={(event) => setSourceId(event.target.value)} placeholder="Supabase source id" />
          </label>

          <label>
            Maksimum Soru
            <select value={maxQuestions} onChange={(event) => setMaxQuestions(Number(event.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </label>

          <label>
            Alan İpucu
            <select value={areaHint} onChange={(event) => setAreaHint(event.target.value)}>
              <option>9. Sınıf</option>
              <option>10. Sınıf</option>
              <option>11. Sınıf</option>
              <option>12. Sınıf</option>
              <option>TYT</option>
              <option>AYT</option>
            </select>
          </label>

          <label>
            Konu İpucu
            <input value={topicHint} onChange={(event) => setTopicHint(event.target.value)} />
          </label>

          <label className="full">
            Manuel Test Metni / Deneme Alanı
            <textarea
              value={manualText}
              onChange={(event) => setManualText(event.target.value)}
              placeholder="sourceId yoksa test etmek için soru metni buraya yapıştırılabilir."
              rows={8}
            />
          </label>
        </div>

        <div className="actions">
          <button className="btnPrimary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "AI işliyor..." : "Soruları Çıkar"}
          </button>
        </div>

        <div className="notice">
          Doğru cevaplar admin alanında tutulur. Ziyaretçi test çıktısına cevap anahtarı eklenmez.
        </div>
      </form>

      <div className="panel">
        <h3>AI Çıktısı / Admin Kontrol</h3>

        {status === "idle" && (
          <div className="notice">Henüz soru çıkarma işlemi yapılmadı.</div>
        )}

        {status === "loading" && (
          <div className="notice">AI, kaynak metni inceliyor ve soruları yapılandırıyor...</div>
        )}

        {response?.error && (
          <div className="notice noticeDanger">{response.error}</div>
        )}

        {response?.result && (
          <div className="list">
            <div className="card">
              <h3>Kaynak Özeti</h3>
              <p>{response.result.sourceSummary}</p>
              <div className="tagRow">
                <span className="tag">{response.result.detectedTopics.join(", ") || "Konu yok"}</span>
                <span className={response.result.embeddedAnswerKeyDetected ? "tag tagAdmin" : "tag tagPublic"}>
                  {response.result.embeddedAnswerKeyDetected ? "Cevap anahtarı tespit edildi" : "Cevap anahtarı tespit edilmedi"}
                </span>
              </div>
            </div>

            {response.result.questions.map((question, index) => (
              <div className="card" key={`${question.stem}-${index}`}>
                <h3>{index + 1}. {question.topicTitle}</h3>
                <p>{question.stem}</p>

                {question.options.length > 0 && (
                  <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
                    {question.options.map((option, optionIndex) => (
                      <span key={option}>{String.fromCharCode(65 + optionIndex)}) {option}</span>
                    ))}
                  </div>
                )}

                <div className="tagRow">
                  <span className="tag">{question.area}</span>
                  <span className="tag">{question.difficulty}</span>
                  <span className="tag">{question.questionType}</span>
                  <span className={question.correctAnswer ? "tag tagAdmin" : "tag tagDraft"}>
                    Cevap: {question.correctAnswer || "Kontrol gerekli"}
                  </span>
                  <span className={question.needsReview ? "tag tagDraft" : "tag tagPublic"}>
                    {question.needsReview ? "Admin kontrol gerekli" : "Güven yüksek"}
                  </span>
                </div>
              </div>
            ))}

            {response.security && (
              <div className="notice">{response.security.note}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
