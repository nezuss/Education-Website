import type { ApiError, ApiResponse } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://nexylva.pp.ua/api";

async function requestResponse(path: string, options: RequestInit, authenticated: boolean, credentialError: boolean) {
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
    if (!response.ok) {
        const problem = await readBody(response) as ApiError | undefined;
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

    return response;
}

async function readBody(response: Response): Promise<unknown> {
    const text = await response.text();
    try { return text ? JSON.parse(text) : undefined; }
    catch { return undefined; }
}

export async function request<T>(path: string, options: RequestInit = {}, authenticated = true, credentialError = false) {
    const response = await requestResponse(path, options, authenticated, credentialError);
    if (response.status === 204) return undefined as T;
    const body = await readBody(response);
    if (!body || typeof body !== "object" || !("data" in body)) throw Object.assign(new Error("Сервер повернув відповідь у невідомому форматі"), { status: response.status });
    return (body as ApiResponse<T>).data;
}

export async function requestFile(path: string, fallbackName: string) {
    const response = await requestResponse(path, { redirect: "error" }, true, false);
    const type = response.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
    if (response.status === 204 || type === "text/html" || type === "application/json" || type?.endsWith("+json")) {
        throw new Error("Сервер не повернув файл роботи.");
    }
    const blob = await response.blob();
    if (!blob.size) throw new Error("Файл роботи порожній або недоступний.");
    const disposition = response.headers.get("Content-Disposition") || "";
    let name = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    if (name) { try { name = decodeURIComponent(name); } catch { name = undefined; } }
    name ||= disposition.match(/filename="([^"]+)"|filename=([^;]+)/i)?.slice(1).find(Boolean)?.trim();
    const extension: Record<string, string> = {
        "application/pdf": ".pdf", "application/zip": ".zip", "application/x-zip-compressed": ".zip",
        "application/x-rar-compressed": ".rar", "application/vnd.rar": ".rar", "application/x-7z-compressed": ".7z",
        "application/x-tar": ".tar", "application/gzip": ".gz", "application/x-gzip": ".gz", "application/x-compressed": ".tgz",
        "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp", "text/plain": ".txt",
        "application/msword": ".doc", "application/vnd.ms-excel": ".xls", "application/vnd.ms-powerpoint": ".ppt",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
    };
    const baseName = name?.split(/[\\/]/).pop();
    const safeName = baseName && Array.from(baseName, char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127 || '<>:"|?*'.includes(char) ? "_" : char).join("").replace(/[. ]+$/, "");
    return { blob, fileName: safeName || `${fallbackName}${extension[type || ""] || ".bin"}` };
}
