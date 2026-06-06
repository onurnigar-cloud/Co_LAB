 "use client";

import { useEffect, useMemo, useState } from "react";
import { PrintableTestSheet } from "./print/PrintableTestSheet";

type TopicOption = {
  area: string;
  topic: string;
  questionCount: number;
};

type PublicQuestion = {
  id: string;
  area: string;
  classLevel?: string | null;
  topic: string;
  difficulty: string;
  questionType: string;
  stem: string;
  options: string[];
  visitorShowAnswer: false;
};

function normalizeOptions(options: unknown): string[] {
  if (Array.isArray(options)) return options.map(String);
  return [];
}

export function BackendTestBuilder() {
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [area, setArea] = useState("10. Sınıf");
  const [topic, setTopic] = useState("Türkiye’de Yer Şekilleri");
  const [difficulty, setDifficulty] = useState("Tümü");
  const [questionType, setQuestionType] = useState("Tümü");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadTopics() {
    try {
      const res = await fetch("/api/public/test/topics");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Konu listesi alınamadı.");

      const items: TopicOption[] = data.topics || [];
      setTopics(items);

      const first = items[0];
      if (first) {
        setArea(first.area);
        setTopic(first.topic);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Konu listesi yüklenirken hata oluştu.");
    }
  }

  useEffect(() => {
    loadTopics();
  }, []);

  const areaOptions = useMemo(() => {
    const values = Array.from(new Set(topics.map((item) => item.area)));
    return values.length ? values : ["9. Sınıf", "10. Sınıf", "TYT", "AYT"];
  }, [topics]);

  const topicOptions = useMemo(() => {
    return topics.filter((item) => item.area === area);
  }, [topics, area]);

  useEffect(() => {
    const first = topicOptions[0];
    if (first && !topicOptions.some((item) => item.topic === topic)) {
      setTopic(first.topic);
    }
  }, [area, topic, topicOptions]);

  async function generateTest() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/public/test/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          area,
          topic,
          difficulty,
          questionType,
          count
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Test oluşturulamadı.");

      setQuestions((data.questions || []).map((q: any) => ({
        ...q,
        options: normalizeOptions(q.options),
        visitorShowAnswer: false
      })));
      setStatus("success");

      if (!data.questions?.length) {
        setMessage("Bu seçim için onaylı soru bulunamadı.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Test oluşturma hatası.");
    }
  }

  async function printTest() {
    if (questions.length === 0) {
      await generateTest();
      setTimeout(() => window.print(), 250);
      return;
    }

    window.print();
  }

  return (
    <div className="testBuilderShell" id="testolustur">
      <div className="panel noPrint">
        <h3>Backend Test Oluşturucu</h3>
        <p>Testler onaylı soru havuzundan gelir. Kaynak PDF, Drive dosyası ve cevap anahtarı ziyaretçiye gösterilmez.</p>

        <div className="formGrid">
          <label>
            Alan / Sınıf
            <select value={area} onChange={(event) => setArea(event.target.value)}>
              {areaOptions.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>

          <label>
            Konu
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              {topicOptions.length === 0 && <option>{topic}</option>}
              {topicOptions.map((item) => (
                <option key={`${item.area}-${item.topic}`} value={item.topic}>
                  {item.topic} ({item.questionCount})
                </option>
              ))}
            </select>
          </label>

          <label>
            Soru Sayısı
            <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </select>
          </label>

          <label>
            Zorluk
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              <option>Tümü</option>
              <option>Kolay</option>
              <option>Orta</option>
              <option>Zor</option>
            </select>
          </label>

          <label>
            Soru Tipi
            <select value={questionType} onChange={(event) => setQuestionType(event.target.value)}>
              <option>Tümü</option>
              <option>Çoktan seçmeli</option>
              <option>Açık uçlu</option>
              <option>Doğru yanlış</option>
              <option>Eşleştirme</option>
              <option>Kısa cevap</option>
            </select>
          </label>
        </div>

        <div className="actions">
          <button className="btnPrimary" onClick={generateTest} disabled={status === "loading"}>
            {status === "loading" ? "Test hazırlanıyor..." : "Testi Oluştur"}
          </button>
          <button className="btnLight" onClick={printTest}>
            Yazdır / PDF Al
          </button>
        </div>

        <div className="notice">
          Public API yalnızca soru kökü ve seçenekleri döndürür. Doğru cevap ve açıklama admin alanında kalır.
        </div>

        {message && (
          <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
        )}
      </div>

      <PrintableTestSheet
        area={area}
        topic={topic}
        difficulty={difficulty}
        questionType={questionType}
        questions={questions}
      />
    </div>
  );
}
