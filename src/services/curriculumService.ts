import { createModule, createLesson, assignModuleToCourse, assignLessonToModule, assignMaterialToLesson } from "./learningService";
import { createMaterial, uploadMaterial, type CreateMaterialPayload } from "./adminService";

export type CurriculumKind = "module" | "lesson" | "material";
export type CurriculumDraft = { title: string; description: string; material: CreateMaterialPayload; file?: File };
export type PendingCurriculumItem = { id: string; kind: CurriculumKind; parentId: string };

export async function createCurriculumItem(kind: CurriculumKind, draft: CurriculumDraft): Promise<string> {
  const item = kind === "module" ? await createModule({ title: draft.title.trim(), description: draft.description.trim() })
    : kind === "lesson" ? await createLesson({ title: draft.title.trim(), description: draft.description.trim() })
    : draft.file ? (await uploadMaterial(draft.file)).material : await createMaterial(draft.material);
  if (!item?.id) throw new Error("Сервер не повернув ID створеного запису. Перевірте дані перед повторним створенням.");
  return item.id;
}

export async function attachCurriculumItem(item: PendingCurriculumItem) {
  if (item.kind === "module") return assignModuleToCourse(item.parentId, item.id);
  if (item.kind === "lesson") return assignLessonToModule(item.parentId, item.id);
  return assignMaterialToLesson(item.parentId, item.id);
}

export function validateMaterial(data: CreateMaterialPayload) {
  const requireText = (value?: string) => { if (!value?.trim()) throw new Error("Заповніть вміст матеріалу."); };
  const requireUrl = (value?: string) => {
    try { const url = new URL(value || ""); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
    catch { throw new Error("Вкажіть повну адресу http:// або https://."); }
  };
  if (data.type === "Text") requireText(data.content);
  if (data.type === "Video") requireUrl(data.videoUrl);
  if (data.type === "File") requireUrl(data.fileUrl);
  if (data.type === "Link") { requireUrl(data.url); requireText(data.linkTitle); }
  if (data.type === "Assignment") {
    requireText(data.description);
    if (!data.deadline || !Number.isFinite(Date.parse(data.deadline))) throw new Error("Вкажіть термін здачі завдання.");
  }
  if (data.type === "Test") {
    if (!data.questions?.length || data.questions.some(q => !q.text.trim() || q.answers.length < 2 || q.answers.some(a => !a.text.trim()) || q.answers.filter(a => a.isCorrect).length !== 1)) {
      throw new Error("Кожне питання має містити текст, щонайменше дві відповіді та одну правильну відповідь.");
    }
  }
}
