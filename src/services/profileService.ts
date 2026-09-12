import { request } from "./api/apiClient";

export type UserProfile = {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    role?: string;
    permissions?: string[];
};

export function parseJwtPayload(token: string): Partial<UserProfile> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return {
            id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? payload.sub ?? payload.id,
            username: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ?? payload.name ?? payload.unique_name,
            email: payload.email ?? payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
            role: payload.role ?? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? "None",
        };
    } catch {
        return null;
    }
}

export async function getProfile(): Promise<UserProfile> {
    const token = localStorage.getItem("token");
    const parsed = token ? parseJwtPayload(token) : null;

    try {
        const profile = await request<UserProfile>("/profile");
        return {
            ...profile,
            id: profile?.id ?? parsed?.id,
            username: profile?.username ?? parsed?.username,
            email: profile?.email ?? parsed?.email,
            role: profile?.role ?? parsed?.role ?? "None",
        };
    } catch {
        if (parsed?.username || parsed?.email) {
            return {
                id: parsed.id,
                username: parsed.username,
                email: parsed.email,
                role: parsed.role ?? "None",
            };
        }
        throw new Error("Не вдалося завантажити профіль");
    }
}

export async function getProfileById(id: string): Promise<UserProfile> {
    return request<UserProfile>(`/profile/${encodeURIComponent(id)}`);
}
