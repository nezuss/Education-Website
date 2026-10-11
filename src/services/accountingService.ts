import { request } from "./api/apiClient";

export type CheckStatusData = {
    sessionId: string;
    courceId: string;
};

export async function checkPaymentStatus(data: CheckStatusData) {
    const result = await request<string>("/account/accounting/check-status", {
        method: "POST",
        body: JSON.stringify({ sessionId: data.sessionId, courceId: data.courceId }),
    });
    if (result !== "Success" && result !== "Already enrolled") throw new Error("Сервер ще не підтвердив оплату. Перевірте статус ще раз.");
    return result;
}
