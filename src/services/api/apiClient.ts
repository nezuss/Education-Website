import type { ApiError, ApiResponse } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://nexylva.pp.ua/api";

export async function request<T>(path: string, options: RequestInit = {}, authenticated = true, credentialError = false) {
    const token = localStorage.getItem("token");
    const headers = new Headers(options.headers);

    if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (token && authenticated) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (!authenticated) headers.delete("Authorization");
    const cleanBase = apiBaseUrl.replace(/\/+$/, "");
    let cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (cleanBase.endsWith("/api")) {
        if (cleanPath.startsWith("/api/")) {
            cleanPath = cleanPath.slice(4);
        }
    }

    const pathBase = (import.meta.env.VITE_API_PATH_BASE ?? "").replace(/\/+$/, "");
    const url = `${cleanBase}${pathBase}${cleanPath}`;

    const response = await fetch(url, { ...options, headers });
    const text = await response.text();
    let body: ApiResponse<T> | ApiError | undefined;
    try {
        body = text ? JSON.parse(text) : undefined;
    } catch {
        body = undefined;
    }

    if (!response.ok) {
        const problem = body as ApiError | undefined;
        const wrongCredentials = credentialError && problem?.message === "Credentials are wrong";
        if (response.status === 401 && authenticated && !wrongCredentials) {
            localStorage.removeItem("token");
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("auth:unauthorized"));
                const publicPaths = ["/login", "/registration", "/confirm-email", "/", "/courses", "/not-found", "/about", "/journal", "/community", "/portfolio", "/contacts", "/faq", "/forgot-password", "/reset-password", "/change-password", "/cancel"];
                const currentPath = window.location.pathname;
                const isPublic = publicPaths.some((p) => (p === "/" ? currentPath === "/" : currentPath.startsWith(p)));
                if (!isPublic && !currentPath.startsWith("/login")) {
                    const returnUrl = encodeURIComponent(currentPath + window.location.search);
                    window.location.href = `/login?from=${returnUrl}`;
                }
            }
        }

        const message =
            problem?.message ||
            (problem?.errors && Object.values(problem.errors).flat().join(" ")) ||
            problem?.title ||
            (response.status === 401
                ? "Необхідна авторизація для доступу (401 Unauthorized)"
                : `Сталася помилка запиту (HTTP ${response.status})`);
        throw Object.assign(new Error(message), { status: response.status });
    }

    if (response.status === 204) return undefined as T;
    if (!body || typeof body !== "object" || !("data" in body)) throw Object.assign(new Error("Сервер повернув відповідь у невідомому форматі"), { status: response.status });
    return (body as ApiResponse<T>).data;
}
