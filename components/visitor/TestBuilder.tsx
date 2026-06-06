 "use client";

import { useMemo, useState } from "react";

type Question = {
  id: string;
  area: string;
  classes: string[];
  topic: string;
  difficulty: string;
  questionType: string;
  stem: string;
  options: string[];
};

type Props = {
  questions: Question[];
};

export function TestBuilder({ questions }: Props) {
  const [area, setArea] = useState("10. Sınıf");
  const [difficulty, setDifficulty] = useState("Tümü");
  const [count, setCount] = useState(5);

  const topics = useMemo(() => {
    return Array.from(new Set(
      questions
        .filter((q) => q.area === area || q.classes.includes(area))
        .map((q) => q.topic)
    ));
  }, [questions, area]);

  const [topic, setTopic] = useState("Türkiye’de Yer Şekilleri");

  const selectedQuestions = questions
    .filter((q) => q.area === area || q.classes.includes(area))
    .filter((q) => !topic || q.topic === topic)
    .filter((q) => difficulty === "Tümü" || q.difficulty === difficulty)
    .slice(0, count);

  return (
    <div className="grid2" id="testolustur">
      <div className="panel">
        <h3>Test Oluşturucu</h3>
        <p>Kaynak PDF ziyaretçiye açılmaz. Sorular onaylı soru havuzundan Co_LAB şablonuna yerleştirilir.</p>

        <div className="formGrid">
          <label>
            Alan / Sınıf
            <select value={area} onChange={(e) => {
              setArea(e.target.value);
              const firstTopic = questions.find(q => q.area === e.target.value || q.classes.includes(e.target.value))?.topic;
              if (firstTopic) setTopic(firstTopic);
            }}>
              <option>9. Sınıf</option>
              <option>10. Sınıf</option>
              <option>11. Sınıf</option>
              <option>12. Sınıf</option>
              <option>TYT</option>
              <option>AYT</option>
            </select>
          </label>

          <label>
            Konu
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>

          <label>
            Soru Sayısı
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </label>

          <label>
            Zorluk
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option>Tümü</option>
              <option>Kolay</option>
              <option>Orta</option>
              <option>Zor</option>
            </select>
          </label>
        </div>

        <div className="notice">
          Cevap anahtarları ve kaynak PDF bağlantıları ziyaretçi çıktısında yer almaz.
        </div>
      </div>

      <div className="panel">
        <h3>Oluşturulan Test</h3>
        <p>{area} · {topic} · {selectedQuestions.length} soru</p>

        <div className="list">
          {selectedQuestions.length === 0 && (
            <div className="notice">Bu seçim için onaylı soru bulunamadı.</div>
          )}

          {selectedQuestions.map((q, index) => (
            <div className="card" key={q.id}>
              <strong>{index + 1}. {q.stem}</strong>
              <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                {q.options.map((option, optIndex) => (
                  <span key={option}>{String.fromCharCode(65 + optIndex)}) {option}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="btnLight" onClick={() => window.print()}>Yazdır / PDF Al</button>
        </div>
      </div>
    </div>
  );
}
