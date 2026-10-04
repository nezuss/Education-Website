function loadRoleNames(): Readonly<Record<string, string>> {
    try {
        const value: unknown = JSON.parse(import.meta.env.VITE_ROLE_NAMES ?? "{}");
        if (!value || typeof value !== "object" || Array.isArray(value)) return {};
        return Object.fromEntries(Object.entries(value).filter(([id, name]) => id.trim() && typeof name === "string" && name.trim()));
    } catch { return {}; }
}
const roleNames = loadRoleNames();
export function getRoleDisplayName(roleId?: string, roleName?: string): string | undefined {
    if (roleName?.trim()) return roleName === "None" ? "User" : roleName;
    if (!roleId) return "User";
    return roleId && Object.hasOwn(roleNames, roleId) ? roleNames[roleId] : undefined;
}
