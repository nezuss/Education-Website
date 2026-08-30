import { request } from "./api/apiClient";

export type UserProfile = { id?: string; username?: string; name?: string; email?: string; role?: string; permissions?: string[] };
export const getProfile = () => request<UserProfile>("/profile");
