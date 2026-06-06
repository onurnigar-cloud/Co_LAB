 "use client";

import { useEffect, useMemo, useState } from "react";

type DashboardSummary = {
  topicCount: number;
  averageCoverageScore: number;
  completeTopicCount: number;
  partialTopicCount: number;
  criticalMissingTopicCount: number;
  totalQuestions: number;
  totalPresentations: number;
  totalActivities: number;
  total3dModels: number;
  totalMapTasks: number;
};

type AreaSummary = {
  area: string;
  topic_count: number;
  average_coverage_score: number;
  complete_topic_count: number;
  partial_topic_count: number;
  critical_missing_topic_count: number;
  total_questions: number;
  total_presentations: number;
  total_activities: number;
  total_3d_models: number;
  total_map_tasks: number;
};

type TopicCoverage = {
  area: string;
  class_level?: string | null;
  topic_title: string;
  approved_question_count: number;
  published_presentation_count: number;
  approved_activity_count: number;
  public_3d_model_count: number;
  public_map_task_count: number;
  coverage_status: "complete" | "partial" | "critical_missing";
  coverage_score: number;
};

type Priority = TopicCoverage & {
  suggested_action: string;
};

export function AdminMainDashboardPanel() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [areaSummary, setAreaSummary] = useState<AreaSummary[]>([]);
  const [topicCoverage, setTopicCoverage] = useState<TopicCoverage[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [areaFilter, setAreaFilter] = useState("Tümü");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    setStatus("loading");
    setMessage("");

    try {
      const [statsRes, prioritiesRes] = await Promise.all([
        fetch("/api/admin/dashboard/content-stats"),
        fetch(`/api/admin/dashboard/production-priorities?area=${encodeURIComponent(areaFilter)}&limit=50`),
      ]);

      const statsData = await statsRes.json();
      const prioritiesData = await prioritiesRes.json();

      if (!statsRes.ok) throw new Error(statsData.error || "İçerik istatistikleri alınamadı.");
      if (!prioritiesRes.ok) throw new Error(prioritiesData.error || "Üretim öncelikleri alınamadı.");

      setSummary(statsData.result.summary);
      setAreaSummary(statsData.result.areaSummary || []);
      setTopicCoverage(statsData.result.topicCoverage || []);
      setPriorities(prioritiesData.priorities || []);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Dashboard yükleme hatası.");
    }
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const areaOptions = useMemo(() => {
    const values = Array.from(new Set(areaSummary.map((row) => row.area).filter(Boolean)));
    return ["Tümü", ...values];
  }, [areaSummary]);

  const filteredCoverage = useMemo(() => {
    if (areaFilter === "Tümü") return topicCoverage;
    return topicCoverage.filter((row) => row.area === areaFilter);
  }, [areaFilter, topicCoverage]);

  const criticalTopics = filteredCoverage.filter((row) => row.coverage_status === "critical_missing").slice(0, 8);
  const partialTopics = filteredCoverage.filter((row) => row.coverage_status === "partial").slice(0, 8);

  function scoreClass(score: number) {
    if (score >= 80) return "coverageScore good";
    if (score >= 50) return "coverageScore mid";
    return "coverageScore bad";
  }

  return (
    <div className="panel">
      <h2>Co_LAB Admin Ana Paneli</h2>
      <p>Sınıf/konu bazlı içerik kapsamını, eksik alanları ve üretim önceliklerini buradan izleyin.</p>

      <div className="formGrid">
        <label>
          Alan filtresi
          <select value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}>
            {areaOptions.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="actions">
        <button className="btnLight" onClick={loadDashboard} disabled={status === "loading"}>
          Paneli Yenile
        </button>
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      {summary && (
        <div className="adminHealthGrid">
          <div className="adminHealthCard primary">
            <strong>{summary.averageCoverageScore}</strong>
            <span>Genel kapsam puanı</span>
          </div>
          <div className="adminHealthCard">
            <strong>{summary.topicCount}</strong>
            <span>Yayındaki konu</span>
          </div>
          <div className="adminHealthCard good">
            <strong>{summary.completeTopicCount}</strong>
            <span>Tamam konu</span>
          </div>
          <div className="adminHealthCard mid">
            <strong>{summary.partialTopicCount}</strong>
            <span>Kısmi konu</span>
          </div>
          <div className="adminHealthCard bad">
            <strong>{summary.criticalMissingTopicCount}</strong>
            <span>Kritik eksik</span>
          </div>
        </div>
      )}

      {summary && (
        <div className="contentTypeGrid">
          <div>
            <strong>{summary.totalQuestions}</strong>
            <span>Onaylı soru</span>
          </div>
          <div>
            <strong>{summary.totalPresentations}</strong>
            <span>Yayın sunum</span>
          </div>
          <div>
            <strong>{summary.totalActivities}</strong>
            <span>Etkinlik</span>
          </div>
          <div>
            <strong>{summary.total3dModels}</strong>
            <span>3D model</span>
          </div>
          <div>
            <strong>{summary.totalMapTasks}</strong>
            <span>Harita görevi</span>
          </div>
        </div>
      )}

      <div className="dashboardGrid2">
        <div className="card">
          <h3>Alan Bazlı Kapsam</h3>
          <div className="areaCoverageList">
            {areaSummary.map((row) => (
              <div className="areaCoverageRow" key={row.area}>
                <div>
                  <strong>{row.area}</strong>
                  <span>{row.topic_count} konu · {row.total_questions} soru · {row.total_presentations} sunum</span>
                </div>
                <div className={scoreClass(Number(row.average_coverage_score || 0))}>
                  {row.average_coverage_score ?? 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Üretim Öncelikleri</h3>
          <div className="priorityList">
            {priorities.length === 0 && (
              <div className="notice">Bu seçim için üretim önceliği bulunamadı.</div>
            )}
            {priorities.slice(0, 8).map((item) => (
              <div className="priorityItem" key={`${item.area}-${item.topic_title}`}>
                <div>
                  <strong>{item.topic_title}</strong>
                  <span>{item.area} · Puan: {item.coverage_score}</span>
                </div>
                <em>{item.suggested_action}</em>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboardGrid2">
        <div className="card">
          <h3>Kritik Eksikler</h3>
          <div className="coverageTopicList">
            {criticalTopics.length === 0 && (
              <div className="notice">Kritik eksik konu yok.</div>
            )}
            {criticalTopics.map((topic) => (
              <div className="coverageTopicRow critical" key={`${topic.area}-${topic.topic_title}`}>
                <div>
                  <strong>{topic.topic_title}</strong>
                  <span>{topic.area}</span>
                </div>
                <div className="miniCounts">
                  <span>Soru {topic.approved_question_count}</span>
                  <span>Sunum {topic.published_presentation_count}</span>
                  <span>Etkinlik {topic.approved_activity_count}</span>
                  <span>3D {topic.public_3d_model_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Kısmi Tamamlananlar</h3>
          <div className="coverageTopicList">
            {partialTopics.length === 0 && (
              <div className="notice">Kısmi tamamlanan konu yok.</div>
            )}
            {partialTopics.map((topic) => (
              <div className="coverageTopicRow partial" key={`${topic.area}-${topic.topic_title}`}>
                <div>
                  <strong>{topic.topic_title}</strong>
                  <span>{topic.area} · Kapsam {topic.coverage_score}</span>
                </div>
                <div className="miniCounts">
                  <span>Soru {topic.approved_question_count}</span>
                  <span>Sunum {topic.published_presentation_count}</span>
                  <span>Etkinlik {topic.approved_activity_count}</span>
                  <span>Harita {topic.public_map_task_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="notice">
        Kapsam puanı; soru havuzu, yayın sunum, etkinlik, 3D model ve harita/Street View görevlerinin birlikte bulunmasına göre hesaplanır.
      </div>
    </div>
  );
}
