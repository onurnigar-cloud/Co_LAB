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

type Props = {
  area: string;
  topic: string;
  difficulty: string;
  questionType: string;
  questions: PublicQuestion[];
};

export function PrintableTestSheet({ area, topic, difficulty, questionType, questions }: Props) {
  const today = new Date().toLocaleDateString("tr-TR");

  return (
    <div className="printDocument">
      <section className="printCover">
        <div className="printBrandRow">
          <div>
            <div className="printBrand">Co_LAB</div>
            <div className="printSubBrand">Dijital Coğrafya Öğretim Laboratuvarı</div>
          </div>
          <div className="printBox printScoreBox">
            <strong>Puan</strong>
            <span>____ / 100</span>
          </div>
        </div>

        <div className="printTitleBlock">
          <h1>Coğrafya Çalışma Testi</h1>
          <p>{area} · {topic}</p>
        </div>

        <div className="studentInfoGrid">
          <div>Ad Soyad: ____________________________________</div>
          <div>Sınıf / No: _________________________________</div>
          <div>Tarih: {today}</div>
          <div>Süre: 40 dakika</div>
        </div>

        <div className="coverageBox">
          <strong>Kapsam</strong>
          <span>
            {topic} konusu için {questions.length || "___"} soru. 
            Zorluk: {difficulty === "Tümü" ? "karma" : difficulty}. 
            Soru tipi: {questionType === "Tümü" ? "karma" : questionType}.
          </span>
        </div>

        <div className="instructionBox">
          <strong>Yönerge</strong>
          <ol>
            <li>Soruları dikkatlice okuyunuz.</li>
            <li>Çoktan seçmeli sorularda doğru seçeneği işaretleyiniz.</li>
            <li>Açık uçlu sorularda cevabınızı ayrılan alana yazınız.</li>
            <li>Bu öğrenci çıktısında cevap anahtarı bulunmaz.</li>
          </ol>
        </div>
      </section>

      <section className="questionSection">
        {questions.length === 0 ? (
          <div className="emptyPrintState">
            Bu seçim için henüz test oluşturulmadı.
          </div>
        ) : (
          questions.map((question, index) => (
            <article className="printQuestion" key={question.id}>
              <div className="questionStem">
                <span className="questionNumber">{index + 1}</span>
                <strong>{question.stem}</strong>
              </div>

              {question.options.length > 0 ? (
                <div className="printOptions">
                  {question.options.map((option, optionIndex) => (
                    <div className="printOption" key={`${question.id}-${optionIndex}`}>
                      <span className="optionLetter">{String.fromCharCode(65 + optionIndex)})</span>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="printOpenAnswer">
                  <span>Cevap:</span>
                </div>
              )}

              <div className="printQuestionMeta noPrint">
                <span>{question.difficulty}</span>
                <span>{question.questionType}</span>
                <span>Cevap gizli</span>
              </div>
            </article>
          ))
        )}
      </section>

      <footer className="printFooter">
        <span>Co_LAB öğrenci sürümü</span>
        <span>Cevap anahtarı içermez</span>
      </footer>
    </div>
  );
}
