import UiIcon from "../../components/ui/Icon/UiIcon";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { enrollToCourse, getCourse } from "../../services/courseService";
import type { Course } from "../../types/course";
import "../../styles/CheckoutPage.css";

export default function CheckoutPage() {
    const { courseId } = useParams();
    return <CheckoutDetails key={courseId ?? "missing"} courseId={courseId} />;
}

function CheckoutDetails({ courseId }: { courseId?: string }) {
    const [course, setCourse] = useState<Course>();
    const [loading, setLoading] = useState(Boolean(courseId));
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState(courseId ? "" : "Курс не вказано. Оберіть курс у каталозі.");
    const [paymentError, setPaymentError] = useState("");
    useEffect(() => {
        let active = true;
        if (!courseId) return;
        getCourse(courseId).then((data) => { if (active) setCourse(data); })
            .catch((reason: Error) => { if (active) setError(reason.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [courseId]);
    async function pay() {
        if (!course) return;
        setPaying(true); setPaymentError("");
        try {
            const redirect = await enrollToCourse(course.id);
            if (!redirect || !/^https?:\/\//i.test(redirect)) throw new Error("Сервер не повернув посилання для оплати.");
            window.location.assign(redirect);
        } catch (reason) {
            const status = (reason as { status?: number }).status;
            setPaymentError(status && status >= 500
                ? `Не вдалося відкрити сторінку оплати: платіжний сервіс тимчасово недоступний (HTTP ${status}). Спробуйте пізніше.`
                : `Не вдалося відкрити сторінку оплати. ${(reason as Error).message}`);
            setPaying(false);
        }
    }
    return <div className="checkout-page-root">
        <div className="checkout-two-cards-grid">
            <section className="checkout-order-card">
                <h2 className="order-card-title">Деталі замовлення</h2>
                <div className="order-card-content-grid">
                    <div><h3 className="order-course-title">{loading ? "Завантаження…" : course?.title || "Курс недоступний"}</h3>
                        <p>{course?.description}</p>
                        <ul className="order-features-list">
                            {course?.totalLearningPeriodWeeks != null && <li>Тривалість: {course.totalLearningPeriodWeeks} тижнів</li>}
                            {course && <li>{course.modules.length} модулів</li>}
                        </ul>
                    </div>
                    <div className="order-graphic-box"><img src="/courses/checkout-graphic.webp" alt="" className="order-graphic-img" /></div>
                </div>
            </section>
            <section className="checkout-summary-card">
                <div className="promo-row"><input className="promo-input" aria-label="Промокод" placeholder="Промокоди поки недоступні" disabled /></div>
                <p>Застосування промокодів очікує підключення на сервері.</p>
                <div className="price-subtotal-row"><span className="subtotal-label">Ціна:</span><span className="subtotal-val">{course ? course.price.toLocaleString("uk-UA") + " грн" : "—"}</span></div>
                <div className="total-due-row"><span className="total-label">Разом до сплати:</span><span className="total-val">{course ? course.price.toLocaleString("uk-UA") + " грн" : "—"}</span></div>
                <p className="payment-method-selector">Банківська картка · Stripe Checkout</p>
                <button className="checkout-pay-btn" type="button" disabled={!course || loading || paying} onClick={pay}>{paying ? "Обробка платежу…" : "Перейти до оплати"} <UiIcon name="arrow" /></button>
                {error && <div className="checkout-error-box" role="alert">Не вдалося завантажити курс. {error} <Link to="/courses">До каталогу</Link></div>}
                {paymentError && <div className="checkout-error-box" role="alert">{paymentError}</div>}
            </section>
        </div>
    </div>;
}
