import { useRef, useState } from "react";
import { completeLesson, type LessonCompletionResult } from "../../services/learningService";

export default function LessonCompletion({ lessonId, courseId, onCompleted }: { lessonId: string; courseId?: string; onCompleted: () => void }) {
  const sending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<LessonCompletionResult>();
  const [error, setError] = useState("");
  async function finish() {
    if (sending.current || receipt || !courseId) return;
    sending.current = true; setBusy(true); setError("");
    try {
      const saved = await completeLesson(lessonId, courseId);
      setReceipt(saved); onCompleted();
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Не вдалося завершити урок.";
      setError(/^Complete all tests and assignments of this lesson first \(\d+ not completed or not reviewed yet\)$/.test(message)
        ? "Спочатку завершіть усі тести й завдання уроку та дочекайтеся їх перевірки."
        : message);
    } finally { sending.current = false; setBusy(false); }
  }
  return <div className="lp-completion">
    <button type="button" className="lp-button" disabled={busy || !!receipt || !courseId} onClick={finish}>{busy ? "Завершення…" : receipt ? "Урок завершено" : "Завершити урок"}</button>
    {receipt ? <p role="status" className="lp-disabled-note">{receipt.alreadyCompleted ? "Сервер підтвердив: урок уже завершено." : "Завершення уроку збережено на сервері."}</p> : <p className="lp-disabled-note">Для завершення потрібні перевірені тести й завдання з оцінкою вище нуля.</p>}
    {error && <p role="alert" className="request-error">{error}</p>}
  </div>;
}
