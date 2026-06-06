 "use client";

import { FormEvent, useState } from "react";

type ProcessResult = {
  ok?: boolean;
  fileId?: string;
  metadata?: {
    name?: string;
    mimeType?: string;
    size?: string;
    modifiedTime?: string;
  };
  processing?: {
    checksum?: string;
    pageCount?: number | null;
    textLength?: number;
    chunkCount?: number;
    chunksInserted?: number;
  };
  securityNote?: string;
  error?: string;
};

export function SourceProcessor() {
  const [title, setTitle] = useState("10. Sınıf Coğrafya Ders Notu");
  const [driveUrlOrId, setDriveUrlOrId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [result, setResult] = useState<ProcessResult | null>(null);

  async function callEndpoint(endpoint: string) {
    setStatus("loading");
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          driveUrlOrId,
          fileType: "pdf"
        })
      });

      const data = await response.json();
      setResult(data);
      setStatus(response.ok ? "success" : "error");
    } catch (error) {
      setStatus("error");
      setResult({
        error: error instanceof Error ? error.message : "İşlem sırasında hata oluştu."
      });
    }
  }

  async function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await callEndpoint("/api/admin/sources/preview");
  }

  async function handleProcess() {
    await callEndpoint("/api/admin/sources/process");
  }

  return (
    <div className="grid2">
      <form className="panel" onSubmit={handlePreview}>
        <h3>Kaynak PDF / Google Drive İşleme</h3>
        <p>Kaynak dosya backend tarafından okunur; ziyaretçiye Drive linki veya ham PDF verilmez.</p>

        <div className="formGrid">
          <label className="full">
            Kaynak Başlığı
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="full">
            Google Drive Linki veya Dosya ID
            <input
              value={driveUrlOrId}
              onChange={(event) => setDriveUrlOrId(event.target.value)}
              placeholder="https://drive.google.com/file/d/.../view"
              required
            />
          </label>
        </div>

        <div className="actions">
          <button className="btnLight" type="submit" disabled={status === "loading"}>
            Metadata Önizle
          </button>
          <button className="btnPrimary" type="button" disabled={status === "loading"} onClick={handleProcess}>
            PDF’yi Backend’de İşle
          </button>
        </div>

        <div className="notice">
          İşlenen kaynak `sources` tablosuna admin-only kaydedilir. PDF metni `source_chunks` yapısına parçalanır.
        </div>
      </form>

      <div className="panel">
        <h3>İşlem Sonucu</h3>

        {status === "idle" && (
          <div className="notice">Henüz işlem yapılmadı.</div>
        )}

        {status === "loading" && (
          <div className="notice">Kaynak işleniyor...</div>
        )}

        {result?.error && (
          <div className="notice noticeDanger">{result.error}</div>
        )}

        {result && !result.error && (
          <div className="list">
            <div className="card">
              <h3>{result.metadata?.name || "Kaynak Dosya"}</h3>
              <p>File ID: {result.fileId}</p>
              <div className="tagRow">
                <span className="tag tagAdmin">Kaynak gizli</span>
                <span className="tag">Backend işleme</span>
              </div>
            </div>

            {result.processing && (
              <div className="card">
                <h3>PDF Parmak İzi</h3>
                <p>Checksum: {result.processing.checksum}</p>
                <p>Sayfa: {result.processing.pageCount ?? "Okunamadı"}</p>
                <p>Metin uzunluğu: {result.processing.textLength}</p>
                <p>Chunk sayısı: {result.processing.chunkCount}</p>
              </div>
            )}

            {result.securityNote && (
              <div className="notice">{result.securityNote}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
