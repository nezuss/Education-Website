import { getMaterials } from "./learningService";
import { getStudentFeedbackContexts, getSubmissionContext, type SubmissionContext } from "./studentFeedbackContextService";
import type { Submission } from "./submissionService";

export interface SubmissionLearningContext extends SubmissionContext {
  materialTitle?: string;
  description?: string;
  materialError?: string;
}

export async function getSubmissionLearningContext(
  item: Pick<Submission, "relatedMaterialId" | "type" | "courseId" | "courseTitle" | "lessonId" | "lessonTitle">,
): Promise<SubmissionLearningContext> {
  const materialId = typeof item.relatedMaterialId === "string" ? item.relatedMaterialId.trim() : "";
  if (!materialId) throw new Error("У роботі відсутній ідентифікатор навчального матеріалу.");

  const { contexts } = await getStudentFeedbackContexts([materialId]);
  const context = contexts.get(materialId) || getSubmissionContext(item);
  if (!context) throw new Error("Не вдалося однозначно визначити курс, модуль і урок для цієї роботи.");
  if (item.type !== "Assignment") return context;

  try {
    const materials = await getMaterials(context.lessonId);
    if (!Array.isArray(materials)) throw new Error("Сервер не повернув список матеріалів уроку.");
    const material = materials.find(value => value !== null && typeof value === "object"
      && typeof value.id === "string" && value.id.trim() === materialId && value.type === "Assignment");
    if (!material) throw new Error("Завдання не знайдено серед матеріалів уроку.");

    return {
      ...context,
      ...(typeof material.title === "string" && material.title.trim() ? { materialTitle: material.title.trim() } : {}),
      ...(typeof material.description === "string" ? { description: material.description } : {}),
    };
  } catch {
    return { ...context, materialError: "Не вдалося завантажити опис завдання." };
  }
}
