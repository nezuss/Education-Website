import { useEffect, useState } from "react";
import { getModules, getLessons, getMaterials, type Module, type Lesson, type Material } from "../../services/learningService";
import { updateModule, updateLesson, updateMaterial, deleteModule, deleteLesson, deleteMaterial, unassignModuleFromCourse, unassignLessonFromModule, unassignMaterialFromLesson } from "../../services/adminService";
import UiIcon from "../../components/ui/Icon/UiIcon";
import { createCurriculumItem, attachCurriculumItem, validateMaterial, type CurriculumDraft, type CurriculumKind, type PendingCurriculumItem } from "../../services/curriculumService";
import MaterialFields from "./MaterialFields";

function persistPending(action: () => void) {
  try { action(); } catch { return; }
}

type Item = Module | Lesson | Material;
const labels = { module: "модуль", lesson: "урок", material: "матеріал" };
const loadItems = (kind: CurriculumKind, id: string): Promise<Item[]> => kind === "module" ? getModules(id) : kind === "lesson" ? getLessons(id) : getMaterials(id);
const emptyDraft = (): CurriculumDraft => ({ title: "", description: "", material: { type: "Text", content: "" } });
type BusyProps = { busyItems?: Record<string, boolean>; onBusyChange?: (key: string, busy: boolean) => void };
function pendingKey(kind: CurriculumKind, parentId: string) { return `nexylva:pending:${kind}:${parentId}`; }
function readPending(kind: CurriculumKind, parentId: string): PendingCurriculumItem | undefined {
  try {
    const value = JSON.parse(sessionStorage.getItem(pendingKey(kind, parentId)) || "null");
    return value?.id && value.kind === kind && value.parentId === parentId ? value : undefined;
  } catch { return undefined; }
}

export default function CourseCurriculumEditor({ courseId, onChange, ...busyProps }: { courseId: string; onChange?: () => void } & BusyProps) {
  return <CurriculumCollection key={courseId} kind="module" parentId={courseId} onChange={onChange} {...busyProps} />;
}

function CurriculumCollection({ kind, parentId, onChange, busyItems, onBusyChange }: { kind: CurriculumKind; parentId: string; onChange?: () => void } & BusyProps) {
  const [collection, setCollection] = useState<{ items: Item[]; loading: boolean; error: string }>({ items: [], loading: true, error: "" });
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState<string>();
  const [draft, setDraft] = useState<CurriculumDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string>();
  const [formOpen, setFormOpen] = useState(() => Boolean(readPending(kind, parentId)));
  const [pending, setPending] = useState<PendingCurriculumItem | undefined>(() => readPending(kind, parentId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [detachId, setDetachId] = useState<string>();
  const key = pendingKey(kind, parentId);
  const otherBusy = Object.entries(busyItems || {}).some(([itemKey, busy]) => itemKey !== key && busy);
  useEffect(() => {
    onBusyChange?.(key, saving || Boolean(pending));
    return () => onBusyChange?.(key, false);
  }, [key, onBusyChange, saving, pending]);
  useEffect(() => {
    let active = true;
    loadItems(kind, parentId).then(items => { if (active) setCollection({ items, loading: false, error: "" }); })
      .catch((reason: Error) => { if (active) setCollection({ items: [], loading: false, error: reason.message }); });
    return () => { active = false; };
  }, [kind, parentId, attempt]);

  function refresh() {
    setCollection({ items: [], loading: true, error: "" });
    setAttempt(value => value + 1);
  }
  function edit(item?: Item) {
    setError(""); setNotice(""); setEditingId(item?.id); setFormOpen(true);
    if (kind !== "material") setDraft({ ...emptyDraft(), title: item?.title || "", description: item?.description || "" });
    else {
      const material = item as Material | undefined;
      setDraft({ ...emptyDraft(), material: material ? {
        type: material.type as CurriculumDraft["material"]["type"], content: material.content, description: material.description,
        fileUrl: material.fileUrl, videoUrl: material.videoUrl, url: material.url, linkTitle: material.title, deadline: material.deadline,
        questions: material.questions?.map(q => ({ text: q.text, answers: q.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect === true })) })),
      } : emptyDraft().material });
    }
  }
  async function save() {
    setSaving(true); setError(""); setNotice("");
    try {
      if (pending) await attachCurriculumItem(pending);
      else {
        if (kind === "material") { if (!draft.file) validateMaterial(draft.material); }
        else if (!draft.title.trim() || !draft.description.trim()) throw new Error("Вкажіть назву та опис.");
        if (editingId) {
          if (kind === "module") await updateModule({ id: editingId, title: draft.title.trim(), description: draft.description.trim() });
          else if (kind === "lesson") await updateLesson({ id: editingId, title: draft.title.trim(), description: draft.description.trim() });
          else await updateMaterial({ id: editingId, ...draft.material });
        } else {
          const id = await createCurriculumItem(kind, draft);
          const created = { id, kind, parentId };
          setPending(created);
          persistPending(() => sessionStorage.setItem(key, JSON.stringify(created)));
          await attachCurriculumItem(created);
        }
      }
      setPending(undefined); setFormOpen(false); setEditingId(undefined); setDraft(emptyDraft());
      persistPending(() => sessionStorage.removeItem(key));
      setNotice("Збережено на сервері."); refresh(); onChange?.();
    } catch (reason) { setError((reason as Error).message); }
    finally { setSaving(false); }
  }
  async function remove(id: string) {
    if (!window.confirm(`Видалити ${labels[kind]} з усіх курсів? Цю дію неможливо скасувати.`)) return;
    setSaving(true); setError(""); setNotice("");
    try {
      if (kind === "module") await deleteModule(id);
      else if (kind === "lesson") await deleteLesson(id);
      else await deleteMaterial(id);
      setExpanded(undefined); setDetachId(undefined); setNotice("Запис видалено на сервері."); refresh(); onChange?.();
    } catch (reason) { setError((reason as Error).message); }
    finally { setSaving(false); }
  }
  async function detach(id: string) {
    setSaving(true); setError(""); setNotice("");
    try {
      if (kind === "module") await unassignModuleFromCourse({ courceId: parentId, moduleId: id });
      else if (kind === "lesson") await unassignLessonFromModule({ moduleId: parentId, lessonId: id });
      else await unassignMaterialFromLesson({ lessonId: parentId, materialId: id });
      setDetachId(undefined); setNotice("Зв’язок прибрано на сервері."); refresh(); onChange?.();
    } catch (reason) { setError((reason as Error).message); }
    finally { setSaving(false); }
  }
  return <div className={`course-modules-editor curriculum-${kind}`} aria-busy={collection.loading || saving}>
    {notice && <p role="status" className="curriculum-notice">{notice}</p>}
    {error && <p role="alert" className="request-error">{error}</p>}
    {pending && <div className="request-error" role="status"><strong>Запис створено, але ще не приєднано.</strong><p>ID: {pending.id}. Повторна спроба приєднає цей запис без повторного створення. Завершіть приєднання перед закриттям редактора.</p></div>}
    {collection.loading ? <p role="status">Завантаження…</p> : collection.error ? <div role="alert" className="request-error"><p>{collection.error}</p><button type="button" onClick={refresh}>Повторити завантаження</button></div>
      : collection.items.length === 0 ? <p>Записів ще немає.</p> : collection.items.map((item, index) => {
        const material = item as Material;
        const quizUnavailable = kind === "material" && material.type === "Test" && (!material.questions?.length || material.questions.some(q => q.answers.some(a => typeof a.isCorrect !== "boolean")));
        const unsupported = kind === "material" && !["Text", "Video", "Link", "File", "Assignment", "Test"].includes(material.type);
        return <div key={item.id} className="course-module-row">
          <div className="curriculum-row-header"><span className="curriculum-number">{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title || (kind === "material" ? material.type : "Без назви")}</strong>{item.description && <p>{item.description}</p>}
            {kind === "module" && <small>{(item as Module).lessonsId?.length ?? "—"} уроків</small>}
            {kind === "lesson" && <small>{(item as Lesson).materialsId?.length ?? "—"} матеріалів</small>}
            {kind === "material" && material.content && <p className="curriculum-text-preview">{material.content}</p>}
          </div></div>
          <div className="curriculum-actions">
            <button type="button" disabled={saving || otherBusy || Boolean(pending) || quizUnavailable || unsupported} onClick={() => edit(item)}>Редагувати {labels[kind]}</button>
            {kind !== "material" && <button type="button" aria-expanded={expanded === item.id} disabled={saving || otherBusy || Boolean(pending)} onClick={() => setExpanded(expanded === item.id ? undefined : item.id)}>{kind === "module" ? "Уроки" : "Матеріали"} <UiIcon name="down" style={{ transform: expanded === item.id ? "rotate(180deg)" : undefined }} /></button>}
            <button type="button" disabled={saving || otherBusy || Boolean(pending)} onClick={() => setDetachId(item.id)}>Прибрати зв’язок</button>
            <button type="button" disabled={saving || otherBusy || Boolean(pending)} onClick={() => void remove(item.id)}>Видалити {labels[kind]}</button>
          </div>
          {quizUnavailable && <p>Редагування тесту недоступне: правильні відповіді не надано.</p>}
          {unsupported && <p>Редагування цього типу матеріалу поки недоступне.</p>}
          {detachId === item.id && <div className="curriculum-confirm"><p>Прибрати {labels[kind]} з {kind === "module" ? "курсу" : kind === "lesson" ? "модуля" : "уроку"}? Сам запис залишиться на сервері.</p><button type="button" disabled={saving} onClick={() => detach(item.id)}>Підтвердити</button><button type="button" disabled={saving} onClick={() => setDetachId(undefined)}>Скасувати</button></div>}
          {expanded === item.id && kind !== "material" && <div className="curriculum-nested"><CurriculumCollection kind={kind === "module" ? "lesson" : "material"} parentId={item.id} onChange={() => { refresh(); onChange?.(); }} busyItems={busyItems} onBusyChange={onBusyChange} /></div>}
        </div>;
      })}
    {formOpen ? <form className="curriculum-form" onSubmit={event => { event.preventDefault(); void save(); }}>
      <h4>{editingId ? "Редагувати" : "Додати"} {labels[kind]}</h4>
      <fieldset disabled={saving || otherBusy || Boolean(pending)}>
        {kind === "material" ? <MaterialFields draft={draft} onChange={setDraft} editing={Boolean(editingId)} /> : <>
          <label>Назва<input required className="admin-modal-input" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label>
          <label>Опис<textarea required className="admin-modal-textarea" value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label>
        </>}
      </fieldset>
      <div className="curriculum-actions"><button type="submit" className="admin-btn-primary" disabled={saving || otherBusy}>{saving ? "Збереження…" : pending ? "Повторити приєднання" : "Зберегти"}</button><button type="button" disabled={saving || otherBusy || Boolean(pending)} onClick={() => { setFormOpen(false); setError(""); }}>Скасувати</button></div>
    </form> : <button type="button" className="admin-btn-primary" disabled={saving || otherBusy || collection.loading || Boolean(collection.error)} onClick={() => edit()}>+ Додати {labels[kind]}</button>}
  </div>;
}
