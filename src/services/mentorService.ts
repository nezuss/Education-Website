import { request } from "./api/apiClient";
import { submissionCollection, type Submission } from "./submissionService";

export type MentorCourse = { courceId: string; studentsCount: number; notRatedSubmissionsCount: number };
type Student = { id: string; courceId: string; username: string; email: string };
type SubmissionGroup = { student: Student; submissions: Submission[] };
export type MentorSubmission = Submission & { student: Student };

export const getMentorCourses = () => submissionCollection<MentorCourse>("/mentor/courses", ["You don't have any assigned cources"]);

export async function getMentorSubmissions(): Promise<MentorSubmission[]> {
    const groups = await submissionCollection<SubmissionGroup>("/mentor/submissions", ["You don't have any assigned cources", "You don't have any submissions"]);
    return groups.flatMap(group => group.submissions.map(submission => ({ ...submission, student: group.student })))
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export const saveSubmissionFeedback = (id: string, feedback: string) => request<Submission>(`/submissions/${encodeURIComponent(id)}/feedback`, {
    method: "POST", body: JSON.stringify({ feedback }),
});

export const requestSubmissionRevision = (id: string, message: string) => request<Submission>(`/submissions/${encodeURIComponent(id)}/request-revision`, {
    method: "POST", body: JSON.stringify({ message }),
});

export type RateSubmissionData = {
    submissionId: string;
    rate: number;
};

export async function rateSubmission(data: RateSubmissionData) {
    return request<string>("/api/cource/rate", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
