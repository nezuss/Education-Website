import { request } from "./api/apiClient";

export type Promocode = { promocode: string; discount: number | null; willExpireAt: string };
export type PromocodeData = { promocode: string; discount: number; willExpireAt: string };
export async function getPromocodes() {
  const data = await request<Promocode[]>("/admin/promocode/get-all", { method: "POST" });
  if (!Array.isArray(data)) throw new Error("Список промокодів не надано.");
  return data;
}
export const createPromocode = (data: PromocodeData) => request<string>("/admin/promocode/create", { method: "POST", body: JSON.stringify(data) });
export const updatePromocode = (data: PromocodeData) => request<string>("/admin/promocode/update", { method: "POST", body: JSON.stringify(data) });
export const deletePromocode = (promocode: string) => request<string>("/admin/promocode/delete", { method: "POST", body: JSON.stringify({ promocode }) });
