import { useCallback, useRef, useState } from "react";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { canSubmitAssignment, getAssignmentStatus } from "../../services/assignmentService";
import { submitTest, type Material } from "../../services/learningService";
import RequestError from "./RequestError";
import useRemoteData from "./useRemoteData";

export default function LessonQuiz({ material, onSubmitted }: { material: Material; onSubmitted?: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [posted, setPosted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  const load = useCallback(() => getAssignmentStatus(material.id), [material.id]);
  const remote = useRemoteData(load);
  const allowed = canSubmitAssignment(remote.data);
  const submitted = sent || Boolean(remote.data?.isSubmitted && !allowed);
  const selectable = allowed && !busy && !submitted && !posted;
  const questions = material.questions ?? [];
  const complete = questions.length > 0 && questions.every(question => question.answers.some(answer => answer.id === answers[question.id]));
  async function submit() {
    if (!selectable || !complete || sending.current) return;
    sending.current = true;
    setBusy(true); setError("");
    try { await submitTest(material.id, questions.map(question => ({ questionId: question.id, answerId: answers[question.id] }))); setSent(true); onSubmitted?.(); }
    catch (reason) {
      const responseStatus = (reason as { status?: number })?.status;
      if (responseStatus && responseStatus >= 200 && responseStatus < 300) { setPosted(true); remote.reload(); onSubmitted?.(); }
      else setError(reason instanceof Error ? reason.message : "Не вдалося надіслати тест.");
    }
    finally { sending.current = false; setBusy(false); }
  }
  return <section className="lp-card lp-quiz"><span className="lp-tag">Тестування</span><h2>{material.title || "Перевірте свої знання"}</h2>{material.description && <p>{material.description}</p>}
    {remote.loading && <p role="status">Завантаження статусу тесту…</p>}{remote.error && <RequestError message={remote.error} retry={remote.reload} />}
    {submitted && <p className="lp-quiz-sent" role="status"><UiIcon name="check" />Тест надіслано</p>}
    {posted && !submitted && <div role="status"><p>Запит прийнято сервером. Підтвердження надсилання тесту поки недоступне.</p><button type="button" className="lp-button" disabled={remote.loading} onClick={remote.reload}>Оновити статус<UiIcon name="loading" /></button></div>}
    {!questions.length && <p>Запитання до тесту ще не додано.</p>}
    <form onSubmit={event => { event.preventDefault(); void submit(); }}>{questions.map((question, index) => <fieldset key={question.id} disabled={!selectable}><legend>{index + 1}. {question.text}</legend>{question.answers.map(answer => <label key={answer.id}><input type="radio" name={`${material.id}-${question.id}`} value={answer.id} checked={answers[question.id] === answer.id} onChange={() => setAnswers(previous => ({ ...previous, [question.id]: answer.id }))} /><span>{answer.text}</span></label>)}</fieldset>)}{error && <p role="alert" className="lp-quiz-error">{error}</p>}{!submitted && !posted && questions.length > 0 && <button type="submit" className="lp-button" disabled={!selectable || !complete}>{busy ? "Надсилання…" : "Завершити тест"}<UiIcon name="arrow" /></button>}</form>
  </section>;
}
