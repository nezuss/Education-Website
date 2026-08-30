import { request } from "./api/apiClient";

type SignInData = {
    email: string;
    password: string;
};

type SignUpData = SignInData & {
    username: string;
};

export async function signIn(data: SignInData) {
    const token = await request<string>("/auth/sign-in", {
        method: "POST",
        body: JSON.stringify(data),
    });

    localStorage.setItem("token", token);
}

export async function signUp(data: SignUpData) {
    await request("/auth/sign-up", {
        method: "POST",
        body: JSON.stringify(data),
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
    }
}
