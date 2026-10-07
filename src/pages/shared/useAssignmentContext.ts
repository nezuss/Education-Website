import { useEffect, useState } from "react";
import { getAssignmentContext } from "../../services/learningService";

export type AssignmentContext = { courseId?: string; courseTitle?: string; assignmentTitle?: string; deadline?: string; description?: string };
export default function useAssignmentContext(assignmentId?: string) {
  const [result, setResult] = useState<{ id?: string; context?: AssignmentContext; error: string }>({ error: "" });
  useEffect(() => {
    let active = true;
    if (!assignmentId) return () => { active = false; };
    getAssignmentContext(assignmentId).then(context => { if (active) setResult({ id: assignmentId, context, error: "" }); }).catch((reason: Error) => { if (active) setResult({ id: assignmentId, error: reason.message }); });
    return () => { active = false; };
  }, [assignmentId]);
  return assignmentId && result.id !== assignmentId ? { context: undefined, error: "", loading: true }
    : { context: result.context, error: assignmentId ? result.error : "Завдання не знайдено.", loading: false };
}
