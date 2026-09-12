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

    const cleanBase = apiBaseUrl.replace(/\/+$/, "");
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    let url: string;
    if (cleanBase.endsWith("/api") && cleanPath.startsWith("/api/")) {
        url = `${cleanBase}${cleanPath.slice(4)}`;
    } else if (!cleanBase.endsWith("/api") && !cleanPath.startsWith("/api/")) {
        url = `${cleanBase}/api${cleanPath}`;
    } else {
        url = `${cleanBase}${cleanPath}`;
    }

    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    let body: ApiResponse<T> | ApiError | undefined;
    try {
        body = text ? JSON.parse(text) : undefined;
    } catch {
        body = undefined;
    }

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem("token");
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("auth:unauthorized"));
                const publicPaths = ["/login", "/registration", "/confirm-email", "/", "/courses", "/not-found"];
                const currentPath = window.location.pathname;
                const isPublic = publicPaths.some((p) => (p === "/" ? currentPath === "/" : currentPath.startsWith(p)));
                if (!isPublic && !currentPath.startsWith("/login")) {
                    const returnUrl = encodeURIComponent(currentPath + window.location.search);
                    window.location.href = `/login?from=${returnUrl}`;
                }
            }
        }

        const message =
            body?.message ||
            (response.status === 401
                ? "Необхідна авторизація для доступу (401 Unauthorized)"
                : "Сталася помилка запиту");
        throw Object.assign(new Error(message), { status: response.status });
    }

    return (body as ApiResponse<T>)?.data;
}
