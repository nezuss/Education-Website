import { request } from "./api/apiClient";

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
