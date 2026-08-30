import { request } from "./api/apiClient";

export type UsersByRole = { roleName: string; userCount: number };
export const getUsersStats = () => request<UsersByRole[]>("/api/stats/users/get-total-count");
