import { request } from "./api/apiClient";

export type PaymentAmounts = { originalAmountMinor: number; discountAmountMinor: number; totalAmountMinor: number; currency: string };
export type PaymentQuote = PaymentAmounts & { courseId: string; courseTitle: string; promocode: string | null; discountPercent: number };
export type CheckoutResult = PaymentAmounts & { orderId: string; status: string; isEnrolled: boolean; checkoutUrl: string | null };

function validateAmounts(value: PaymentAmounts) {
  if (!value || ![value.originalAmountMinor, value.discountAmountMinor, value.totalAmountMinor].every(n => Number.isSafeInteger(n) && n >= 0)
    || value.discountAmountMinor > value.originalAmountMinor || value.originalAmountMinor - value.discountAmountMinor !== value.totalAmountMinor
    || typeof value.currency !== "string" || value.currency.toLowerCase() !== "uah") throw new Error("Сервер повернув некоректну суму замовлення.");
}
export function formatPaymentAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("uk-UA", { style: "currency", currency: currency.toUpperCase() }).format(amountMinor / 100);
}
export async function getPaymentQuote(courseId: string, promocode?: string): Promise<PaymentQuote> {
  const result = await request<PaymentQuote>("/payments/quote", { method: "POST", body: JSON.stringify({ courseId, ...(promocode?.trim() ? { promocode: promocode.trim() } : {}) }) });
  validateAmounts(result);
  if (result.courseId !== courseId || typeof result.discountPercent !== "number" || result.discountPercent < 0 || result.discountPercent > 100
    || (result.promocode ?? "") !== (promocode?.trim() ?? "")) throw new Error("Сервер не підтвердив розрахунок для цього курсу та промокоду.");
  return result;
}
export function validateCheckoutResult(result: CheckoutResult): CheckoutResult {
  validateAmounts(result);
  if (typeof result.orderId !== "string" || !result.orderId.trim() || typeof result.isEnrolled !== "boolean") throw new Error("Сервер не підтвердив замовлення.");
  if (result.isEnrolled) {
    if (result.status !== "Paid" || result.totalAmountMinor !== 0 || result.checkoutUrl) throw new Error("Сервер не підтвердив зарахування на курс.");
  } else {
    let url: URL;
    try { url = new URL(result.checkoutUrl ?? ""); } catch { throw new Error("Сервер не повернув посилання для оплати."); }
    if (result.status !== "Pending" || result.totalAmountMinor <= 0 || url.protocol !== "https:" || url.hostname !== "checkout.stripe.com" || url.username || url.password) throw new Error("Сервер повернув некоректне посилання для оплати.");
  }
  return result;
}
