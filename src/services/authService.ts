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

export function signOut() {
    localStorage.removeItem("token");
}
