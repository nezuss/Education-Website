import UiIcon from "../../components/ui/Icon/UiIcon";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { checkPaymentStatus } from "../../services/accountingService";
import "../../styles/CheckoutPage.css";

export default function SuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const courseId = searchParams.get("course_id");

    const [status, setStatus] = useState<"loading" | "success" | "error">(sessionId && courseId ? "loading" : "error");
    const [message, setMessage] = useState(sessionId && courseId ? "" : "Немає даних для підтвердження платежу.");
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!sessionId || !courseId) return;

        let active = true;
        checkPaymentStatus({ sessionId, courceId: courseId })
            .then(() => {
                if (!active) return;
                setStatus("success");
            })
            .catch((err: Error) => {
                if (!active) return;
                setMessage(err.message || "Не вдалося підтвердити платіж.");
                setStatus("error");
            });
        return () => { active = false; };
    }, [sessionId, courseId, attempt]);

    return (
        <div className="checkout-page-root">
            <div className="checkout-order-card" style={{ maxWidth: "680px", textAlign: "center", padding: "48px 40px" }}>
                {status === "loading" && (
                    <div>
                        <div style={{ fontSize: "36px", marginBottom: "16px" }}><UiIcon name="loading" size={36} /></div>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "var(--color-brand-dark)", marginBottom: "12px" }}>
                            Підтвердження платежу...
                        </h2>
                        <p style={{ color: "var(--color-brand-soft)", fontSize: "15px" }}>
                            Зачекайте, ми перевіряємо статус транзакції в платіжній системі.
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div>
                        <div style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "50%",
                            background: "rgba(19, 73, 44, 0.1)",
                            color: "var(--color-brand-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            fontSize: "36px"
                        }}>
                            <UiIcon name="check" size={36} />
                        </div>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", color: "var(--color-brand-dark)", marginBottom: "12px" }}>
                            Оплату успішно завершено!
                        </h2>
                        <p style={{ color: "#44584e", fontSize: "15px", lineHeight: "1.5", marginBottom: "32px", maxWidth: "520px", margin: "0 auto 32px" }}>
                            Курс успішно активовано у вашому кабінеті студента. Всі матеріали, лекції та практичні воркшопи вже відкриті для навчання.
                        </p>

                        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                            <Link 
                                to={`/student/learning/${courseId}`} 
                                className="checkout-pay-btn" 
                                style={{ padding: "14px 28px", textDecoration: "none" }}
                            >
                                <span>Перейти до навчання</span>
                                <span><UiIcon name="arrow" /></span>
                            </Link>
                            <Link 
                                to="/student/courses" 
                                className="order-change-plan-btn"
                                style={{ padding: "14px 24px", borderRadius: "9999px", textDecoration: "none", fontSize: "14px" }}
                            >
                                Мої курси
                            </Link>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div>
                        <div style={{ fontSize: "40px", marginBottom: "16px" }}><UiIcon name="warning" size={40} /></div>
                        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "#d32f2f", marginBottom: "12px" }}>
                            Помилка обробки оплати
                        </h2>
                        <p style={{ color: "#4b5f54", fontSize: "14px", marginBottom: "28px" }}>{message}</p>
                        {sessionId && courseId && <button type="button" className="checkout-pay-btn" onClick={() => { setStatus("loading"); setMessage(""); setAttempt(attempt + 1); }}>Перевірити платіж ще раз</button>}
                        <Link to="/student/courses" className="order-change-plan-btn">Мої курси</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
