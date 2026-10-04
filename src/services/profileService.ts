import { request } from "./api/apiClient";
export type UserProfile = { id?: string; username?: string; name?: string; email?: string; role?: string; permissions?: string[] };
export function parseJwtPayload(token: string): Partial<UserProfile> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const encoded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(encoded), c => c.charCodeAt(0))));
        return {
            id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? payload.sub ?? payload.id,
            username: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? payload.name ?? payload.unique_name,
            email: payload.email ?? payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
            role: payload.roleName ?? payload.role ?? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? "None",
        };
    } catch { return null; }
}
export async function getProfile(): Promise<UserProfile> {
    const token = localStorage.getItem("token");
    const parsed = token ? parseJwtPayload(token) : null;
    const profile = await request<UserProfile>("/profile");
    return { ...profile, id: profile?.id ?? parsed?.id, email: profile?.email ?? parsed?.email, role: profile?.role ?? parsed?.role ?? "None" };
}
export async function getProfileById(id: string): Promise<UserProfile> {
    return request<UserProfile>("/profile/" + encodeURIComponent(id));
}
export async function getProfileStats(): Promise<{ cources: unknown[]; submissions: unknown[] }> {
    const data = await request<{ cources: unknown[]; submissions: unknown[] }>("/profile/stats");
    if (!data || !Array.isArray(data.cources) || !Array.isArray(data.submissions)) throw new Error("Сервер не повернув статистику профілю.");
    return data;
}
