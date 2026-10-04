import { useId } from "react";
import type { CurriculumDraft } from "../../services/curriculumService";
import type { CreateMaterialPayload } from "../../services/adminService";
import type { CreateQuestionDTO } from "../../services/learningService";

const newQuestion = (): CreateQuestionDTO => ({ text: "", answers: [{ text: "", isCorrect: true }, { text: "", isCorrect: false }] });
const types = { Text: "Текст", Video: "Відео", Link: "Посилання", File: "Файл", Assignment: "Завдання", Test: "Тест" };

export default function MaterialFields({ draft, onChange, editing }: { draft: CurriculumDraft; onChange: (draft: CurriculumDraft) => void; editing: boolean }) {
  const id = useId();
  const data = draft.material;
  const update = (fields: Partial<CreateMaterialPayload>) => onChange({ ...draft, file: undefined, material: { ...data, ...fields } });
  const questions = data.questions || [];
  const updateQuestion = (index: number, question: CreateQuestionDTO) => update({ questions: questions.map((q, i) => i === index ? question : q) });
  return <>
    <label>Тип матеріалу<select className="admin-modal-select" disabled={editing} value={data.type} onChange={event => {
      const type = event.target.value as CreateMaterialPayload["type"];
      onChange({ ...draft, file: undefined, material: { type, ...(type === "Test" ? { questions: [newQuestion()] } : {}) } });
    }}>{Object.entries(types).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    {data.type === "Text" && <label>Текст<textarea required rows={6} className="admin-modal-textarea" value={data.content || ""} onChange={event => update({ content: event.target.value })} /></label>}
    {data.type === "Video" && <label>Адреса відео<input required type="url" className="admin-modal-input" value={data.videoUrl || ""} onChange={event => update({ videoUrl: event.target.value })} /></label>}
    {data.type === "Link" && <><label>Назва посилання<input required className="admin-modal-input" value={data.linkTitle || ""} onChange={event => update({ linkTitle: event.target.value })} /></label><label>Адреса посилання<input required type="url" className="admin-modal-input" value={data.url || ""} onChange={event => update({ url: event.target.value })} /></label></>}
    {data.type === "File" && <><label>Адреса файлу<input required={!draft.file} disabled={Boolean(draft.file)} type="url" className="admin-modal-input" value={data.fileUrl || ""} onChange={event => update({ fileUrl: event.target.value })} /></label>
      {!editing && <label>Або завантажити файл<input type="file" onChange={event => onChange({ ...draft, file: event.target.files?.[0] })} /></label>}
      {draft.file && <p>Обрано: {draft.file.name}. Завантаження відбудеться після збереження.</p>}
    </>}
    {data.type === "Assignment" && <><label>Опис завдання<textarea required rows={5} className="admin-modal-textarea" value={data.description || ""} onChange={event => update({ description: event.target.value })} /></label><label>Термін здачі (UTC)<input required type="datetime-local" className="admin-modal-input" value={data.deadline?.slice(0, 16) || ""} onChange={event => update({ deadline: event.target.value ? event.target.value + ":00Z" : "" })} /></label></>}
    {data.type === "Test" && <div className="curriculum-quiz">{questions.map((question, qi) => <fieldset key={qi} className="curriculum-question"><legend>Питання {qi + 1}</legend><label>Текст питання<input required className="admin-modal-input" value={question.text} onChange={event => updateQuestion(qi, { ...question, text: event.target.value })} /></label>
      <p>Позначте одну правильну відповідь.</p>
      {question.answers.map((answer, ai) => <div key={ai} className="curriculum-answer"><input type="radio" aria-label={`Правильна відповідь ${ai + 1} до питання ${qi + 1}`} name={`${id}-question-${qi}`} checked={answer.isCorrect} onChange={() => updateQuestion(qi, { ...question, answers: question.answers.map((a, i) => ({ ...a, isCorrect: i === ai })) })} /><input required aria-label={`Відповідь ${ai + 1} до питання ${qi + 1}`} className="admin-modal-input" value={answer.text} onChange={event => updateQuestion(qi, { ...question, answers: question.answers.map((a, i) => i === ai ? { ...a, text: event.target.value } : a) })} /><button type="button" disabled={question.answers.length <= 2} onClick={() => updateQuestion(qi, { ...question, answers: question.answers.filter((_, i) => i !== ai) })}>Прибрати</button></div>)}
      <div className="curriculum-actions"><button type="button" onClick={() => updateQuestion(qi, { ...question, answers: [...question.answers, { text: "", isCorrect: false }] })}>+ Відповідь</button><button type="button" disabled={questions.length <= 1} onClick={() => update({ questions: questions.filter((_, i) => i !== qi) })}>Прибрати питання</button></div>
    </fieldset>)}<button type="button" onClick={() => update({ questions: [...questions, newQuestion()] })}>+ Питання</button></div>}
  </>;
}
