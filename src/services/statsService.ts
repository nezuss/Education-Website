import { request } from "./api/apiClient";

export type UsersByRole = { roleName: string; userCount: number };
export async function getUsersStats(): Promise<UsersByRole[]> {
    const rows = await request<UsersByRole[]>("/api/stats/users/get-total-count");
    const none = rows.find(row => row.roleName === "None")?.userCount ?? 0;
    const unassigned = import.meta.env.VITE_USERS_STATS_NONE_IS_TOTAL === "true"
        ? Math.max(0, none - rows.filter(row => row.roleName !== "None").reduce((sum, row) => sum + row.userCount, 0))
        : none;
    const userCount = unassigned + rows.filter(row => row.roleName === "User").reduce((sum, row) => sum + row.userCount, 0);
    return [...rows.filter(row => row.roleName !== "None" && row.roleName !== "User"), { roleName: "User", userCount }];
}
