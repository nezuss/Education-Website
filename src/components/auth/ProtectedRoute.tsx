import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getValidToken } from "../../services/authService";
import { getProfile, parseJwtPayload, type UserProfile } from "../../services/profileService";

interface ProtectedRouteProps {
    allowedRoles?: Array<"None" | "Teacher" | "Admin" | string>;
    children?: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
    const location = useLocation();
    const token = getValidToken();

    const [profile, setProfile] = useState<UserProfile | null>(() => {
        if (!token) return null;
        const parsed = parseJwtPayload(token);
        return parsed ? (parsed as UserProfile) : null;
    });
    const [loading, setLoading] = useState<boolean>(Boolean(token && allowedRoles && allowedRoles.length > 0));

    useEffect(() => {
        if (!token || !allowedRoles || allowedRoles.length === 0) {
            return;
        }

        let isMounted = true;
        getProfile()
            .then((prof) => {
                if (isMounted) {
                    setProfile(prof);
                }
            })
            .catch(() => {
                // If profile fails but token exists, parsed JWT role will still be used
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [token, allowedRoles]);

    if (!token) {
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?from=${returnUrl}`} replace state={{ from: location }} />;
    }

    if (loading) {
        return (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <p>Перевірка прав доступу...</p>
            </div>
        );
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = profile?.role ?? "None";
        const hasAccess = allowedRoles.includes(userRole);

        if (!hasAccess) {
            return (
                <div style={{ maxWidth: "600px", margin: "40px auto", padding: "24px", background: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0", textAlign: "center" }}>
                    <h2 style={{ color: "#c62828" }}>Доступ обмежено</h2>
                    <p style={{ margin: "12px 0", color: "#555" }}>
                        Для перегляду цієї сторінки необхідна роль: <strong>{allowedRoles.join(" або ")}</strong>.
                        Ваша поточна роль: <strong>{userRole}</strong>.
                    </p>
                    <div style={{ marginTop: "20px" }}>
                        <a href="/student" style={{ padding: "8px 16px", background: "#1b4332", color: "#fff", textDecoration: "none", borderRadius: "4px", fontWeight: 600 }}>
                            Повернутися до навчання
                        </a>
                    </div>
                </div>
            );
        }
    }

    return children ? <>{children}</> : <Outlet />;
}
