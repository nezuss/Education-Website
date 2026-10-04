import { request } from "./apiClient";

export async function requestCollection<T>(path: string, emptyMessage: string): Promise<T[]> {
  try { return (await request<T[]>(path)) ?? []; }
  catch (reason) {
    const error = reason as Error & { status?: number };
    if (error.status === 404 && error.message === emptyMessage) return [];
    throw reason;
  }
}
