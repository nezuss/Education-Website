import type { ApiError, ApiResponse } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5056/api";

export async function request<T>(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${apiBaseUrl}${path}`, { ...options, headers });
    const body = await response.json() as ApiResponse<T> | ApiError;

    if (!response.ok) {
        throw Object.assign(new Error(body.message || "Сталася помилка запиту"), { status: response.status });
    }

    return (body as ApiResponse<T>).data;
}
