import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { canSubmitAssignment, getAssignmentStatus } from "../../services/assignmentService";
import { submitTest, type Material, type TestQuestion } from "../../services/learningService";
import { submissionGrade, type Submission } from "../../services/submissionService";
import RequestError from "./RequestError";
import useRemoteData from "./useRemoteData";

function quizQuestions(value: unknown): TestQuestion[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const nonblank = (text: unknown): text is string => typeof text === "string" && !!text.trim();
  const questionIds = new Set<string>();
  const answerIds = new Set<string>();
  for (const question of value) {
    if (!question || typeof question !== "object" || !nonblank(question.id) || !nonblank(question.text)
      || questionIds.has(question.id) || !Array.isArray(question.answers) || !question.answers.length) return undefined;
    questionIds.add(question.id);
    for (const answer of question.answers) {
      if (!answer || typeof answer !== "object" || !nonblank(answer.id) || !nonblank(answer.text) || answerIds.has(answer.id)) return undefined;
      answerIds.add(answer.id);
    }
  }
  return value;
}

function submittedQuizAnswers(value: unknown, questions?: TestQuestion[]): Map<string, string> | undefined {
  if (!Array.isArray(value) || !value.length || !questions?.length) return undefined;
  const questionsById = new Map(questions.map(question => [question.id, question]));
  const selected = new Map<string, string>();
  for (const choice of value) {
    if (!choice || typeof choice !== "object" || typeof choice.questionId !== "string" || !choice.questionId.trim()
      || typeof choice.answerId !== "string" || !choice.answerId.trim() || selected.has(choice.questionId)) return undefined;
    const question = questionsById.get(choice.questionId);
    if (!question || !question.answers.some(answer => answer.id === choice.answerId)) return undefined;
    selected.set(choice.questionId, choice.answerId);
  }
  return selected;
}

export default function LessonQuiz({ material, onSubmitted }: { material: Material; onSubmitted?: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [receipt, setReceipt] = useState<Submission>();
  const [posted, setPosted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  const load = useCallback(() => getAssignmentStatus(material.id), [material.id]);
  const remote = useRemoteData(load);
  const allowed = canSubmitAssignment(remote.data);
  const submitted = sent || Boolean(remote.data?.isSubmitted && !allowed);
  const validQuestions = quizQuestions(material.questions);
  const validMaterial = typeof material.id === "string" && !!material.id.trim() && material.type === "Test";
  const selectable = validMaterial && !!validQuestions && allowed && !busy && !submitted && !posted;
  const questions = validQuestions ?? [];
  const complete = questions.length > 0 && questions.every(question => question.answers.some(answer => answer.id === answers[question.id]));
  const confirmedSubmission = receipt ?? (submitted && remote.data?.submission?.relatedMaterialId === material.id && remote.data.submission.type === "Test" ? remote.data.submission : undefined);
  const savedAnswers = submitted ? submittedQuizAnswers(confirmedSubmission?.answers, validQuestions) : undefined;
  const result = confirmedSubmission?.status === "Reviewed" ? confirmedSubmission : undefined;
  const grade = submissionGrade(result?.rate, result?.type);
  const feedback = typeof result?.feedback === "string" ? result.feedback.trim() : "";
  async function submit() {
    if (!selectable || !complete || sending.current) return;
    sending.current = true;
    setBusy(true); setError("");
    try {
      const saved = await submitTest(material.id, questions.map(question => ({ questionId: question.id, answerId: answers[question.id] })));
      setReceipt(saved); setSent(true); onSubmitted?.();
    }
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
    {submitted && !savedAnswers && <p role="status">Надіслані відповіді поки недоступні.</p>}
    {result && <div className="lp-quiz-result" role="status"><h3>Результат перевірки</h3><p>Оцінка: {grade !== undefined ? `${grade} / 12` : "Дані поки недоступні"}</p>{feedback && <p>{feedback}</p>}<Link to={`/student/submissions/${encodeURIComponent(result.id)}`} className="lp-button">Переглянути результат<UiIcon name="arrow" /></Link></div>}
    {posted && !submitted && <div role="status"><p>Запит прийнято сервером. Підтвердження надсилання тесту поки недоступне.</p><button type="button" className="lp-button" disabled={remote.loading} onClick={remote.reload}>Оновити статус<UiIcon name="loading" /></button></div>}
    {(!validMaterial || !validQuestions) ? <p role="alert">Дані тесту поки недоступні. Спробуйте оновити матеріали уроку.</p> : !questions.length && <p>Запитання до тесту ще не додано.</p>}
    <form onSubmit={event => { event.preventDefault(); void submit(); }}>{questions.map((question, index) => <fieldset key={question.id} disabled={!selectable}><legend>{index + 1}. {question.text}</legend>{question.answers.map(answer => <label key={answer.id}><input type="radio" name={`${material.id}-${question.id}`} value={answer.id} checked={(submitted ? savedAnswers?.get(question.id) : answers[question.id]) === answer.id} onChange={() => setAnswers(previous => ({ ...previous, [question.id]: answer.id }))} /><span>{answer.text}</span></label>)}</fieldset>)}{error && <p role="alert" className="lp-quiz-error">{error}</p>}{!submitted && !posted && questions.length > 0 && <button type="submit" className="lp-button" disabled={!selectable || !complete}>{busy ? "Надсилання…" : "Завершити тест"}<UiIcon name="arrow" /></button>}</form>
  </section>;
}
