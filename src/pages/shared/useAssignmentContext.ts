import { useEffect, useState } from "react";
import { getAssignmentContext, getAssignmentStatus, type AssignmentContext } from "../../services/assignmentService";
import type { SubmissionStatus } from "../../services/learningService";
import { getStudentSubmissions } from "../../services/submissionService";

export type { AssignmentContext } from "../../services/assignmentService";
export default function useAssignmentContext(assignmentId?: string) {
  const [result, setResult] = useState<{ id?: string; context?: AssignmentContext; status?: SubmissionStatus; statusError?: string; attempts?: number; error: string }>({ error: "" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    if (!assignmentId) return () => { active = false; };
    getAssignmentContext(assignmentId).then(async context => {
      const [status, history] = await Promise.allSettled([getAssignmentStatus(assignmentId), getStudentSubmissions()]);
      if (active) setResult({ id: assignmentId, context, error: "", status: status.status === "fulfilled" ? status.value : undefined,
        statusError: status.status === "rejected" ? status.reason instanceof Error ? status.reason.message : "Статус поки недоступний." : undefined,
        attempts: history.status === "fulfilled" ? history.value.filter(item => item.relatedMaterialId === assignmentId).length : undefined });
    }).catch((reason: Error) => { if (active) setResult({ id: assignmentId, error: reason.message }); });
    return () => { active = false; };
  }, [assignmentId, attempt]);
  const reload = () => { setResult({ error: "" }); setAttempt(value => value + 1); };
  return assignmentId && result.id !== assignmentId ? { context: undefined, status: undefined, statusError: undefined, attempts: undefined, error: "", loading: true, reload }
    : { ...result, error: assignmentId ? result.error : "Завдання не знайдено.", loading: false, reload };
}
