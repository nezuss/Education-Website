import { request } from "./api/apiClient";
import { getRoleDisplayName } from "./roleNames";
export type AdminUser = {
    id: string;
    username: string;
    email: string;
    roleId?: string;
    roleName?: string;
    isEmailConfirmed?: boolean;
    createdAt?: string;
    enrolledCourcesId?: string[];
};
function readUser(value: unknown): AdminUser {
    if (!value || typeof value !== "object")
        throw new Error("Некоректні дані користувача.");
    const user = value as Record<string, unknown>;
    if (typeof user.id !== "string" || !user.id)
        throw new Error("ID користувача не надано.");
    const roleId = typeof user.roleId === "string" ? user.roleId : undefined;
    const roleName = getRoleDisplayName(roleId, typeof user.roleName === "string" ? user.roleName : undefined);
    return { id: user.id, username: typeof user.username === "string" ? user.username : "", email: typeof user.email === "string" ? user.email : "", roleId, roleName, isEmailConfirmed: typeof user.isEmailConfirmed === "boolean" ? user.isEmailConfirmed : undefined, createdAt: typeof user.createdAt === "string" ? user.createdAt : undefined, enrolledCourcesId: Array.isArray(user.enrolledCourcesId) ? user.enrolledCourcesId.filter((id): id is string => typeof id === "string") : undefined };
}
export async function getAdminUsers(): Promise<AdminUser[]> {
    const data = await request<unknown>("/admin/users/get-all", { method: "POST" });
    if (!Array.isArray(data))
        throw new Error("Список користувачів не надано.");
    return data.map(readUser);
}
export async function getAdminUser(id: string) { return readUser(await request(`/admin/users/get/${encodeURIComponent(id)}`, { method: "POST" })); }
export function createAdminUser(data: {
    username: string;
    email: string;
    password: string;
}) { return request("/admin/users/create", { method: "POST", body: JSON.stringify(data) }); }
export function deleteAdminUser(id: string) { return request(`/admin/users/delete/${encodeURIComponent(id)}`, { method: "POST" }); }
export function updateAdminUser(data: { id: string; username?: string; email?: string; password?: string }) {
    return request<string>("/admin/users/update", { method: "POST", body: JSON.stringify(data) });
}
