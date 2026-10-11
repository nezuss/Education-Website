import { request } from "./apiClient";

export async function requestCollection<T>(path: string, emptyMessage: string, authenticated = true): Promise<T[]> {
  try {
    const items = await request<T[]>(path, {}, authenticated);
    if (!Array.isArray(items)) throw new Error("Сервер не повернув коректний список. Дані поки недоступні.");
    return items;
  }
  catch (reason) {
    const error = reason as Error & { status?: number };
    if (error.status === 404 && error.message === emptyMessage) return [];
    throw reason;
  }
}
