import UiIcon from "../../components/ui/Icon/UiIcon";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { enrollToCourse, getCourse } from "../../services/courseService";
import { formatPaymentAmount, getPaymentQuote, type PaymentQuote } from "../../services/paymentService";
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
    const [promo, setPromo] = useState("");
    const [appliedPromo, setAppliedPromo] = useState("");
    const [quote, setQuote] = useState<PaymentQuote>();
    const [quoteError, setQuoteError] = useState("");
    const [quoting, setQuoting] = useState(Boolean(courseId));
    const [quoteAttempt, setQuoteAttempt] = useState(0);
    const [enrolled, setEnrolled] = useState(false);
    const sending = useRef(false);
    const quoteCurrent = !!quote && promo.trim() === appliedPromo && !quoting;
    useEffect(() => {
        let active = true;
        if (!courseId) return;
        getPaymentQuote(courseId, appliedPromo).then(value => { if (active) setQuote(value); })
            .catch((reason: Error) => { if (active) setQuoteError(reason.message === "There is no such promocode" ? "Промокод не знайдено." : reason.message === "This promocode has expired" ? "Термін дії промокоду минув." : reason.message); })
            .finally(() => { if (active) setQuoting(false); });
        return () => { active = false; };
    }, [courseId, appliedPromo, quoteAttempt]);
    function applyPromo() {
        if (paying || quoting) return;
        setQuote(undefined); setQuoteError(""); setQuoting(true);
        setAppliedPromo(promo.trim()); setQuoteAttempt(value => value + 1);
    }
    useEffect(() => {
        let active = true;
        if (!courseId) return;
        getCourse(courseId).then((data) => { if (active) setCourse(data); })
            .catch((reason: Error) => { if (active) setError(reason.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [courseId]);
    async function pay() {
        if (!course || !quoteCurrent || sending.current || enrolled) return;
        sending.current = true;
        setPaying(true); setPaymentError("");
        try {
            const result = await enrollToCourse(course.id, appliedPromo);
            if (result.isEnrolled) { setEnrolled(true); setPaying(false); }
            else window.location.assign(result.checkoutUrl!);
        } catch (reason) {
            const status = (reason as { status?: number }).status;
            setPaymentError(status && status >= 500
                ? `Не вдалося відкрити сторінку оплати: платіжний сервіс тимчасово недоступний (HTTP ${status}). Спробуйте пізніше.`
                : `Не вдалося відкрити сторінку оплати. ${(reason as Error).message}`);
            setPaying(false);
            sending.current = false;
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
                <div className="promo-row"><input className="promo-input" aria-label="Промокод" placeholder="Промокод" value={promo} disabled={paying || enrolled} onChange={event => setPromo(event.target.value)} /><button type="button" className="promo-apply-btn" disabled={quoting || paying || enrolled || !courseId} onClick={applyPromo}>{quoting ? "Розрахунок…" : "Застосувати"}</button></div>
                {quoteError && <p role="alert" className="checkout-error-box">{quoteError}</p>}
                {!quoteCurrent && !quoting && !quoteError && <p>Застосуйте промокод, щоб оновити суму.</p>}
                <div className="price-subtotal-row"><span className="subtotal-label">Ціна:</span><span className="subtotal-val">{quoteCurrent ? formatPaymentAmount(quote.originalAmountMinor, quote.currency) : "—"}</span></div>
                {quoteCurrent && quote.discountAmountMinor > 0 && <div className="price-subtotal-row"><span>Знижка{quote.promocode ? ` (${quote.promocode})` : ""}:</span><span>−{formatPaymentAmount(quote.discountAmountMinor, quote.currency)}</span></div>}
                <div className="total-due-row"><span className="total-label">Разом до сплати:</span><span className="total-val">{quoteCurrent ? formatPaymentAmount(quote.totalAmountMinor, quote.currency) : "—"}</span></div>
                <p className="payment-method-selector">Банківська картка · Stripe Checkout</p>
                {enrolled ? <div role="status"><p>Зарахування підтверджено. Курс доступний у вашому кабінеті.</p><Link className="checkout-pay-btn" to={`/student/learning/${encodeURIComponent(courseId!)}`}>Перейти до навчання</Link></div> : <button className="checkout-pay-btn" type="button" disabled={!course || loading || paying || !quoteCurrent} onClick={pay}>{paying ? "Обробка замовлення…" : quoteCurrent && quote.totalAmountMinor === 0 ? "Отримати доступ без оплати" : "Перейти до оплати"} <UiIcon name="arrow" /></button>}
                {error && <div className="checkout-error-box" role="alert">Не вдалося завантажити курс. {error} <Link to="/courses">До каталогу</Link></div>}
                {paymentError && <div className="checkout-error-box" role="alert">{paymentError}</div>}
            </section>
        </div>
    </div>;
}
