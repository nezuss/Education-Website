import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { enrollToCourse } from "../../services/courseService";
import { useCourses } from "../../hooks/useCourses";
import { PageHeader, Panel } from "../shared/PageComponents";
import "../PlatformPages.css";

export default function CheckoutPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { courses } = useCourses();
    const course = courseId ? courses.find((item) => item.id === courseId) : undefined;
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!course) {
        return <PageHeader title="Курс не знайдено" />;
    }

    async function handlePay(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!course) return;
        setError("");
        setLoading(true);

        try {
            const redirectUrl = await enrollToCourse(course.id);
            if (redirectUrl && (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://"))) {
                window.location.assign(redirectUrl);
            } else {
                navigate(`/success?course_id=${encodeURIComponent(course.id)}`);
            }
        } catch (e) {
            const err = e as { status?: number; message?: string };
            if (err.status === 401) {
                navigate("/login");
                return;
            }
            setError(err.message ?? "Не вдалося ініціалізувати оплату курсу");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <PageHeader
                title="Оформлення та оплата курсу"
                description="Безпечна оплата банківською карткою через платіжну систему Stripe."
            />
            <section className="form-panel">
                <Panel>
                    <h2>{course.title}</h2>
                    <p style={{ margin: "8px 0" }}>{course.description}</p>
                    <p style={{ fontSize: "20px", marginTop: "12px" }}>
                        До сплати: <strong>{course.price.toLocaleString("uk-UA")} грн</strong>
                    </p>

                    <form onSubmit={handlePay} style={{ marginTop: "24px" }}>
                        <label>
                            Спосіб оплати
                            <select defaultValue="card">
                                <option value="card">💳 Банківська картка (Stripe Checkout)</option>
                            </select>
                        </label>

                        {error && <p role="alert" style={{ color: "#d32f2f" }}>{error}</p>}

                        <button type="submit" disabled={loading}>
                            {loading ? "Перенаправлення на оплату..." : `Оплатити ${course.price.toLocaleString("uk-UA")} грн`}
                        </button>
                    </form>
                </Panel>
            </section>
        </>
    );
}
