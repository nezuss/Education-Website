import { request } from "./api/apiClient";

type SignInData = {
    email: string;
    password: string;
};

type SignUpData = SignInData & {
    username: string;
};

export type SignUpResult = {
    id?: string;
    email?: string;
    username?: string;
    isEmailConfirmed?: boolean;
};

export function isTokenExpired(token: string): boolean {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return true;
        const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))));
        if (!payload.exp) return false;
        return Date.now() >= payload.exp * 1000;
    } catch {
        return true;
    }
}

export function getValidToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
    if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        return null;
    }
    return token;
}

export async function signIn(data: SignInData) {
    const token = await request<string>("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(data),
    }, false);

    localStorage.setItem("token", token);
    return token;
}

export async function signInWithGoogle(idToken: string) {
    const token = await request<string>("/auth/google-sign-in", {
        method: "POST",
        body: JSON.stringify({ idToken }),
    }, false);

    localStorage.setItem("token", token);
    return token;
}

export async function signUp(data: SignUpData): Promise<SignUpResult | undefined> {
    return request<SignUpResult>("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function requestPasswordReset(email: string) {
    return request<string>("/account/management/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export async function changePassword(resetToken: string, password: string) {
    return request<string>("/account/management/reset-password", {
        method: "POST",
        body: JSON.stringify({ resetToken, password }),
    });
}

export async function confirmEmail(code: string) {
    await request(`/auth/confirm-email/${encodeURIComponent(code)}`, { method: "POST" });
}

export async function signOut() {
    try {
        await request("/auth/sign-out", { method: "POST" });
    } finally {
        localStorage.removeItem("token");
        if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth:unauthorized"));
        }
    }
}
