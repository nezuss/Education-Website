import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { enrollToCourse, getCourses } from "../../services/courseService";
import "../../styles/CheckoutPage.css";

interface PlanConfig {
    key: "basic" | "pro" | "vip";
    title: string;
    price: number;
    features: string[];
}

const PLANS: Record<string, PlanConfig> = {
    basic: {
        key: "basic",
        title: "Basic (Базовий)",
        price: 11900,
        features: ["Онлайн-доступ до лекцій", "Доступ на 6 місяців", "Самостійна практика"]
    },
    pro: {
        key: "pro",
        title: "PRO (Популярний)",
        price: 19900,
        features: ["Онлайн", "Доступ на 12 місяців", "Менторська перевірка ДЗ", "Сертифікат"]
    },
    vip: {
        key: "vip",
        title: "Mentorship (VIP)",
        price: 34900,
        features: ["Індивідуальний менторинг", "Доступ назавжди", "Кар'єрна консультація", "Пріоритетна підтримка"]
    }
};

const DEFAULT_COURSE_NAMES: Record<string, string> = {
    "lca-eco-design": "LCA & Еко-проєктування",
    "circular-economy": "Циркулярний дизайн та матеріали",
    "eco-materials": "Біоматеріали та інновації",
    "green-architecture": "Стала архітектура та біомімікрія"
};

export default function CheckoutPage() {
    const { courseId = "lca-eco-design" } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const planParam = searchParams.get("plan")?.toLowerCase();
    const initialPlan = (planParam && PLANS[planParam]) ? planParam : "pro";

    const [selectedPlanKey, setSelectedPlanKey] = useState<string>(initialPlan);
    const [courseTitle, setCourseTitle] = useState<string>(
        DEFAULT_COURSE_NAMES[courseId] || "Курс"
    );
    const [promoInput, setPromoInput] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
    const [promoMessage, setPromoMessage] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "apple" | "stripe">("card");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [planModalOpen, setPlanModalOpen] = useState(false);

    useEffect(() => {
        if (!courseId) return;
        getCourses()
            .then((courses) => {
                const found = courses.find((c) => c.id === courseId || c.title.toLowerCase().includes(courseId.toLowerCase()));
                if (found) {
                    setCourseTitle(found.title);
                }
            })
            .catch(() => {});
    }, [courseId]);

    const activePlan = PLANS[selectedPlanKey] || PLANS.pro;

    const finalPrice = useMemo(() => {
        return Math.round(activePlan.price * (1 - appliedDiscount));
    }, [activePlan.price, appliedDiscount]);

    function handleApplyPromo() {
        if (!promoInput.trim()) return;
        const normalized = promoInput.trim().toUpperCase();
        if (normalized === "ECO2026" || normalized === "NEXYLVA" || normalized === "STUDENT") {
            setAppliedDiscount(0.1);
            setPromoMessage(`✓ Промокод ${normalized} застосовано (-10%)`);
        } else {
            setAppliedDiscount(0);
            setPromoMessage("Промокод недійсний або застарілий");
        }
    }

    async function handlePaySubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const redirectUrl = await enrollToCourse(courseId);
            if (redirectUrl && (redirectUrl.startsWith("http://") || redirectUrl.startsWith("https://"))) {
                window.location.assign(redirectUrl);
            } else {
                navigate(`/success?course_id=${encodeURIComponent(courseId)}&plan=${selectedPlanKey}`);
            }
        } catch (err: unknown) {
            const apiErr = err as { status?: number; message?: string };
            if (apiErr?.status === 401) {
                navigate(`/login?redirect=/checkout/${courseId}?plan=${selectedPlanKey}`);
                return;
            }
            setError(apiErr?.message || "Не вдалося оформити замовлення. Спробуйте ще раз або оберіть інший спосіб оплати.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="checkout-page-root">
            <div className="checkout-two-cards-grid">
                <div className="checkout-order-card">
                    <h2 className="order-card-title">Деталі замовлення</h2>

                    <div className="order-card-content-grid">
                        <div>
                            <h3 className="order-course-title">{courseTitle}</h3>

                            <div className="order-plan-row">
                                <span className="order-plan-name">{activePlan.title}</span>
                                <button 
                                    type="button" 
                                    className="order-change-plan-btn"
                                    onClick={() => setPlanModalOpen(true)}
                                >
                                    Змінити
                                </button>
                            </div>

                            <div className="order-features-heading">Що входить:</div>
                            <ul className="order-features-list">
                                {activePlan.features.map((feat, idx) => (
                                    <li key={idx}>• {feat}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="order-graphic-box">
                            <img 
                                src="/courses/checkout-graphic.webp" 
                                alt="Еко-глобус зі зв'язками" 
                                className="order-graphic-img"
                            />
                        </div>
                    </div>
                </div>

                <div className="checkout-summary-card">
                    <div className="promo-row">
                        <input 
                            type="text" 
                            className="promo-input" 
                            placeholder="Промокод: ..."
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                        />
                        <button 
                            type="button" 
                            className="promo-apply-btn"
                            onClick={handleApplyPromo}
                        >
                            Застосувати
                        </button>
                    </div>

                    {promoMessage && (
                        <div className="promo-message-success">{promoMessage}</div>
                    )}

                    <div className="price-subtotal-row">
                        <span className="subtotal-label">Ціна:</span>
                        <span className="subtotal-val">{activePlan.price.toLocaleString("uk-UA")} грн</span>
                    </div>

                    <div className="total-due-row">
                        <span className="total-label">Разом до сплати:</span>
                        <span className="total-val">{finalPrice.toLocaleString("uk-UA")} грн</span>
                    </div>

                    <div className="payment-method-selector">
                        <label className="method-option-label">
                            <input 
                                type="radio" 
                                name="payMethod" 
                                value="card" 
                                checked={paymentMethod === "card"}
                                onChange={() => setPaymentMethod("card")}
                            />
                            <span>💳 Банківська картка (Visa / Mastercard)</span>
                        </label>
                        <label className="method-option-label">
                            <input 
                                type="radio" 
                                name="payMethod" 
                                value="stripe" 
                                checked={paymentMethod === "stripe"}
                                onChange={() => setPaymentMethod("stripe")}
                            />
                            <span>🔒 Stripe Checkout</span>
                        </label>
                    </div>

                    <button 
                        type="button" 
                        className="checkout-pay-btn"
                        onClick={handlePaySubmit}
                        disabled={loading}
                    >
                        <span>{loading ? "Обробка платежу..." : "Перейти до оплати"}</span>
                        {!loading && <span>→</span>}
                    </button>

                    {error && (
                        <div className="checkout-error-box">{error}</div>
                    )}
                </div>
            </div>

            {planModalOpen && (
                <div className="landing-modal-overlay" onClick={() => setPlanModalOpen(false)}>
                    <div className="landing-modal-content plan-switch-dialog" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="modal-close-btn" 
                            style={{ color: "#0A2D1B", background: "rgba(10, 45, 27, 0.08)" }}
                            onClick={() => setPlanModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h3 className="plan-switch-title">
                            Оберіть тариф навчання
                        </h3>
                        <div className="plan-switch-list">
                            {Object.values(PLANS).map((p) => (
                                <div 
                                    key={p.key}
                                    onClick={() => { setSelectedPlanKey(p.key); setPlanModalOpen(false); }}
                                    className={`plan-switch-item ${selectedPlanKey === p.key ? 'selected' : ''}`}
                                >
                                    <div>
                                        <div className="plan-item-title">{p.title}</div>
                                        <div className="plan-item-sub">{p.features.join(" • ")}</div>
                                    </div>
                                    <div className="plan-item-price">
                                        {p.price.toLocaleString("uk-UA")} грн
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
