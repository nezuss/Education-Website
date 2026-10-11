import { useRef, useState, type ReactNode } from "react";
import { getSubmissionFile } from "../../services/submissionService";
import "../../styles/SubmissionDownload.css";

export default function SubmissionDownload({ id, className = "", children }: { id: string; className?: string; children: ReactNode }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const downloading = useRef(false);
  async function download() {
    if (downloading.current) return;
    downloading.current = true; setBusy(true); setError("");
    let objectUrl: string | undefined;
    try {
      const { blob, fileName } = await getSubmissionFile(id);
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl; link.download = fileName;
      document.body.append(link); link.click(); link.remove();
    } catch (reason) {
      const status = (reason as { status?: number })?.status;
      setError(status === 404 ? "Файл роботи поки недоступний." : status === 403 ? "Немає доступу до файлу роботи." : reason instanceof Error ? reason.message : "Не вдалося завантажити файл роботи.");
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      downloading.current = false; setBusy(false);
    }
  }
  return <span className="submission-download"><button type="button" className={`submission-download-button ${className}`} disabled={busy} aria-busy={busy} onClick={() => void download()}>{busy ? "Завантаження…" : children}</button>{error && <span className="submission-download-error" role="alert">{error}</span>}</span>;
}
