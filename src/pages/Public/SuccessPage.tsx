import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { checkPaymentStatus } from "../../services/accountingService";
import { PageHeader, Panel, Success } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function SuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const courseId = searchParams.get("course_id");

    const [status, setStatus] = useState<"loading" | "success" | "error">(sessionId && courseId ? "loading" : "success");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!sessionId || !courseId) return;

        checkPaymentStatus({ sessionId, courceId: courseId })
            .then(() => {
                setStatus("success");
            })
            .catch((err: Error) => {
                setStatus("error");
                setMessage(err.message || "Не вдалося підтвердити статус оплати.");
            });
    }, [sessionId, courseId]);

    return (
        <>
            <PageHeader
                title="Підтвердження оплати"
                description="Обробка вашого платежу та надання доступу до навчальних матеріалів."
            />

            <section className="form-panel">
                <Panel>
                    {status === "loading" && (
                        <div>
                            <h2>Перевірка статусу платежу...</h2>
                            <p style={{ marginTop: "8px" }}>Зачекайте декілька секунд, ми підтверджуємо транзакцію в системі Stripe.</p>
                        </div>
                    )}

                    {status === "success" && (
                        <Success
                            title="Оплату успішно завершено!"
                            text="Курс додано до вашого кабінету. Ви можете одразу приступати до перегляду уроків та завдань."
                            to={courseId ? `/student/learning/${courseId}` : "/student/courses"}
                            label="Перейти до навчання"
                        />
                    )}

                    {status === "error" && (
                        <div>
                            <h2 style={{ color: "#d32f2f" }}>Помилка перевірки оплати</h2>
                            <p style={{ margin: "12px 0" }}>{message}</p>
                            <div className="actions" style={{ marginTop: "16px" }}>
                                <Link className="button-link" to={courseId ? `/checkout/${courseId}` : "/courses"}>
                                    Спробувати знову
                                </Link>
                                <Link className="button-link" to="/student/courses">
                                    До моїх курсів
                                </Link>
                            </div>
                        </div>
                    )}
                </Panel>
            </section>
        </>
    );
}
