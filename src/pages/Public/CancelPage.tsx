import { Link } from "react-router-dom";
import "../../styles/CheckoutPage.css";

export default function CancelPage() {
    return (
        <div className="checkout-page-root">
            <div className="checkout-order-card" style={{ maxWidth: "620px", textAlign: "center", padding: "48px 40px" }}>
                <div style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    background: "rgba(178, 144, 116, 0.15)",
                    color: "#b29074",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    fontSize: "30px"
                }}>
                    ✕
                </div>

                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "26px", color: "var(--color-brand-dark)", marginBottom: "12px" }}>
                    Оплату було скасовано
                </h2>
                <p style={{ color: "#44584e", fontSize: "15px", lineHeight: "1.5", marginBottom: "32px" }}>
                    Кошти з вашого рахунку списані не були. Ви можете повернутися до каталогу курсів або спробувати повторити оплату пізніше.
                </p>

                <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link 
                        to="/courses" 
                        className="checkout-pay-btn"
                        style={{ padding: "14px 28px", textDecoration: "none" }}
                    >
                        <span>Каталог курсів</span>
                        <span>→</span>
                    </Link>
                    <Link 
                        to="/" 
                        className="order-change-plan-btn"
                        style={{ padding: "14px 24px", borderRadius: "9999px", textDecoration: "none", fontSize: "14px" }}
                    >
                        На головну
                    </Link>
                </div>
            </div>
        </div>
    );
}
