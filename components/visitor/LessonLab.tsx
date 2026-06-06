 "use client";

import { useMemo, useState } from "react";
import type { AreaKey, Topic, ThreeDModel } from "@/types/colab";

type Props = {
  topics: Record<string, Topic[]>;
};

export function LessonLab({ topics }: Props) {
  const areaKeys = Object.keys(topics) as AreaKey[];
  const [activeArea, setActiveArea] = useState<AreaKey>("10");
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  const activeTopic = useMemo(() => {
    return topics[activeArea]?.[activeIndex] ?? topics[activeArea]?.[0];
  }, [topics, activeArea, activeIndex]);

  function changeArea(area: AreaKey) {
    setActiveArea(area);
    setActiveIndex(0);
    setActiveModelIndex(0);
  }

  function selectTopic(index: number) {
    setActiveIndex(index);
    setActiveModelIndex(0);
  }

  const models = activeTopic?.models ?? [];
  const activeModel: ThreeDModel | undefined = models[activeModelIndex];

  return (
    <div className="lessonLab" id="derslik">
      <aside className="panel">
        <h3>Derslik seçimi</h3>
        <div className="tabs">
          {areaKeys.map((area) => (
            <button
              key={area}
              className={`chip ${activeArea === area ? "active" : ""}`}
              onClick={() => changeArea(area)}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="list">
          {topics[activeArea]?.map((topic, index) => (
            <button
              key={topic.id}
              className={`lessonItem ${index === activeIndex ? "active" : ""}`}
              onClick={() => selectTopic(index)}
            >
              <strong>{topic.title}</strong>
              <span>{topic.tags.join(" · ")}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="panel">
        <h2>{activeTopic?.title}</h2>
        <div className="tagRow">
          {activeTopic?.tags.map((tag) => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
        <p>{activeTopic?.summary}</p>

        <div className="workspaceGrid">
          <div className="tool">
            <h4>Sunum</h4>
            <p>Ayrıntılı ders anlatım sunumu. Ziyaretçiye AI bilgisi gösterilmez.</p>
            <div className="actions">
              <button className="btnLight">PPTX İndir</button>
              <button className="btnLight">Google Slides</button>
            </div>
          </div>

          <div className="tool">
            <h4>Harita</h4>
            <p>Seçilen konuya bağlı harita alanı.</p>
            <iframe className="mapEmbed" src={activeTopic?.mapUrl} />
          </div>

          <div className="tool" style={{ gridColumn: "span 2" }}>
            <h4>Akıllı 3D Tahta</h4>
            <p>Konuya bağlı 3D içerikler kontrol edilir.</p>

            {models.length === 0 && (
              <div className="notice">Bu konuya henüz 3D model bağlanmadı. Admin panelinden Sketchfab modeli eklenebilir.</div>
            )}

            {models.length > 1 && (
              <div className="list">
                {models.map((model, index) => (
                  <button
                    key={model.title}
                    className={`modelChoice ${index === activeModelIndex ? "active" : ""}`}
                    onClick={() => setActiveModelIndex(index)}
                  >
                    <strong>{model.title}</strong>
                    <span>{model.purpose}</span>
                  </button>
                ))}
              </div>
            )}

            {activeModel?.provider === "Sketchfab" && activeModel.embed ? (
              <iframe
                className="sketchfabFrame"
                title={activeModel.title}
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={activeModel.embed}
              />
            ) : activeModel ? (
              <div className="notice">
                <strong>{activeModel.title}</strong><br />
                {activeModel.purpose}<br />
                Bu model planlandı; Sketchfab bağlantısı admin panelinden eklenecek.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
