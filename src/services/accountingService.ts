import { request } from "./api/apiClient";

export type CheckStatusData = {
    sessionId: string;
    courceId: string;
};

export async function checkPaymentStatus(data: CheckStatusData) {
    return request<string>("/account/accounting/check-status", {
        method: "POST",
        body: JSON.stringify(data),
    });
}
