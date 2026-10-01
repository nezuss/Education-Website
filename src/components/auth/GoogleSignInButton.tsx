import { useEffect, useRef, useState } from "react";

type GoogleCredentialResponse = {
    credential: string;
};

type GoogleIdentity = {
    accounts: {
        id: {
            initialize: (configuration: {
                client_id: string;
                callback: (response: GoogleCredentialResponse) => void;
                auto_select?: boolean;
            }) => void;
            renderButton: (
                parent: HTMLElement,
                options: {
                    type?: "standard" | "icon";
                    theme?: "outline" | "filled_blue" | "filled_black";
                    size?: "large" | "medium" | "small";
                    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
                    shape?: "rectangular" | "pill" | "circle" | "square";
                    logo_alignment?: "left" | "center";
                    width?: number;
                },
            ) => void;
        };
    };
};

declare global {
    interface Window {
        google?: GoogleIdentity;
    }
}

const googleScriptUrl = "https://accounts.google.com/gsi/client";
const fallbackClientId = "205791621031-d7crand7k46h1igl5ul067vtimadp88v.apps.googleusercontent.com";

function loadGoogleIdentityScript(): Promise<void> {
    if (window.google) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${googleScriptUrl}"]`);
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(), { once: true });
            existingScript.addEventListener("error", () => reject(new Error("Не вдалося завантажити Google Sign-In.")), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = googleScriptUrl;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Не вдалося завантажити Google Sign-In."));
        document.head.appendChild(script);
    });
}

type GoogleSignInButtonProps = {
    text?: "signin_with" | "signup_with" | "continue_with";
    onCredential: (idToken: string) => Promise<void>;
    onError: (message: string) => void;
};

export default function GoogleSignInButton({ text = "continue_with", onCredential, onError }: GoogleSignInButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function initializeGoogleSignIn() {
            try {
                await loadGoogleIdentityScript();
                if (!isMounted || !window.google || !containerRef.current) return;

                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || fallbackClientId,
                    auto_select: false,
                    callback: async ({ credential }) => {
                        try {
                            await onCredential(credential);
                        } catch (error) {
                            onError((error as Error)?.message || "Не вдалося виконати вхід через Google.");
                        }
                    },
                });

                containerRef.current.replaceChildren();
                window.google.accounts.id.renderButton(containerRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    text,
                    shape: "rectangular",
                    logo_alignment: "left",
                    width: Math.min(400, Math.max(200, Math.floor(containerRef.current.getBoundingClientRect().width))),
                });
                setIsLoading(false);
            } catch (error) {
                if (isMounted) {
                    setIsLoading(false);
                    onError((error as Error)?.message || "Не вдалося підключити Google Sign-In.");
                }
            }
        }

        void initializeGoogleSignIn();
        return () => {
            isMounted = false;
        };
    }, [onCredential, onError, text]);

    return (
        <div
            ref={containerRef}
            className="nex-google-sign-in"
            aria-busy={isLoading}
            aria-label="Продовжити з Google"
        />
    );
}
