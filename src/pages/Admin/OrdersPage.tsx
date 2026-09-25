import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminPortal.css";

interface OrderItem {
  id: string;
  orderNumber: string;
  studentName: string;
  studentEmail: string;
  avatar: string;
  courseName: string;
  plan: string;
  dateStr: string;
  amount: string;
  method: string;
  status: "success" | "pending" | "refund" | "error";
  statusText: string;
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const orders: OrderItem[] = [
    {
      id: "1",
      orderNumber: "#NX-1048",
      studentName: "Анна Коваль",
      studentEmail: "anna@nexylva.ua",
      avatar: "/about/team_1.webp",
      courseName: "LCA & Еко-проєктування",
      plan: "PRO",
      dateStr: "17 серпня • 18:42",
      amount: "₴ 19 900",
      method: "Картка",
      status: "success",
      statusText: "Успішно"
    },
    {
      id: "2",
      orderNumber: "#NX-1047",
      studentName: "Марія Іванова",
      studentEmail: "m.ivanova@nexylva.ua",
      avatar: "/about/team_2.webp",
      courseName: "Zero-Waste Пакування",
      plan: "Standard",
      dateStr: "16 серпня • 14:10",
      amount: "₴ 12 500",
      method: "Apple Pay",
      status: "success",
      statusText: "Успішно"
    },
    {
      id: "3",
      orderNumber: "#NX-1046",
      studentName: "Олексій Бондар",
      studentEmail: "o.bondar@nexylva.ua",
      avatar: "/about/team_3.webp",
      courseName: "Циркулярний брендинг",
      plan: "PRO",
      dateStr: "15 серпня • 11:25",
      amount: "₴ 19 900",
      method: "Картка",
      status: "pending",
      statusText: "Очікує"
    },
    {
      id: "4",
      orderNumber: "#NX-1045",
      studentName: "Наталія Савчук",
      studentEmail: "n.savchuk@nexylva.ua",
      avatar: "/about/team_4.webp",
      courseName: "LCA & Еко-проєктування",
      plan: "Standard",
      dateStr: "14 серпня • 09:40",
      amount: "₴ 12 500",
      method: "Google Pay",
      status: "refund",
      statusText: "Повернення"
    }
  ];

  const filtered = orders.filter((o) => {
    if (filter === "success" && o.status !== "success") return false;
    if (filter === "pending" && o.status !== "pending") return false;
    if (filter === "refund" && o.status !== "refund") return false;
    if (filter === "error" && o.status !== "error") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.studentName.toLowerCase().includes(q) ||
        o.courseName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="admin-container">
      {/* Breadcrumbs */}
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
        <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>Головна</Link>
        {" > "}
        <span style={{ color: "var(--accent-primary)", fontWeight: 600 }}>Замовлення / Оплати</span>
      </div>

      {/* Header */}
      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">
            Замовлення та оплати
          </h1>
          <p className="admin-header-sub">
            Контролюйте платежі, перевіряйте статуси транзакцій, повернення та фінансову активність платформи.
          </p>
        </div>
        <button
          type="button"
          className="admin-btn-secondary"
          onClick={() => alert("Експорт фінансового звіту розпочато!")}
        >
          Експорт звіту ⤓
        </button>
      </header>

      {/* Overview Cards Row */}
      <section className="admin-stats-row">
        <div className="admin-overview-card">
          <div className="admin-tag">[ ФІНАНСИ ]</div>
          <h2 className="admin-overview-title">Фінансовий огляд</h2>
          <p className="admin-overview-sub">
            Ключові показники оплат за поточний місяць та статуси транзакцій.
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">₴ 481 400</div>
          <div className="admin-stat-label">Дохід за серпень</div>
          <div className="admin-stat-change" style={{ color: "#215A36", fontWeight: 600 }}>+12% до минулого місяця</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">26</div>
          <div className="admin-stat-label">Успішні оплати</div>
          <div className="admin-stat-change">Підтверджені транзакції</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">3</div>
          <div className="admin-stat-label">Очікують</div>
          <div className="admin-stat-change" style={{ color: "#C07C54", fontWeight: 600 }}>Потребують перевірки</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-val">2</div>
          <div className="admin-stat-label">Повернення</div>
          <div className="admin-stat-change">За поточний місяць</div>
        </div>
      </section>

      <div style={{ textAlign: "right", fontSize: "12px", color: "var(--text-secondary)", marginTop: "-16px", marginBottom: "32px" }}>
        32 транзакція за серпень • 3 потребують перевірки
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-filter-pills">
          <button
            type="button"
            className={`admin-pill ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Усі
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "success" ? "active" : ""}`}
            onClick={() => setFilter("success")}
          >
            Успішні
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Очікують
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "refund" ? "active" : ""}`}
            onClick={() => setFilter("refund")}
          >
            Повернення
          </button>
          <button
            type="button"
            className={`admin-pill ${filter === "error" ? "active" : ""}`}
            onClick={() => setFilter("error")}
          >
            Помилки
          </button>
        </div>

        <div className="admin-controls-group">
          <div className="mentor-search-input-wrap">
            <span className="mentor-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Пошук замовлення або студента..."
              className="mentor-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="mentor-select" aria-label="Сортування транзакцій">
            <option>Сортування: Найновіші</option>
            <option>Сортування: За сумою (спадання)</option>
            <option>Сортування: За сумою (зростання)</option>
          </select>
        </div>
      </div>

      {/* Monthly highlight & Statuses breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "28px", marginBottom: "32px" }}>
        <div className="admin-orders-banner">
          <div>
            <div className="admin-tag" style={{ color: "#C2D1C9" }}>[ ПОТОЧНИЙ МІСЯЦЬ ]</div>
            <h2 className="admin-orders-banner-title">Оплати за серпень</h2>
            <p style={{ fontSize: "14px", color: "#AABDB3", margin: 0 }}>
              Поточна сума підтверджених платежів на платформі.
            </p>
          </div>
          <div className="admin-orders-banner-amount">
            ₴ 481 400
          </div>
        </div>

        <div style={{ background: "#E2DAD2", borderRadius: "var(--radius-lg)", padding: "24px 28px", border: "1px solid #C9BDB2" }}>
          <div className="admin-tag" style={{ color: "var(--accent-primary)" }}>[ ПОТРЕБУЄ УВАГИ ]</div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-primary)", margin: "4px 0 16px 0" }}>
            Статуси платежів
          </h3>

          <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Очікують підтвердження</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--accent-warm)" }}>3</span>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Повернення в обробці</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "#C53929" }}>2</span>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 600 }}>Помилки оплати</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text-secondary)" }}>1</span>
          </div>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="admin-table-wrap">
        <div className="admin-table-header" style={{ gridTemplateColumns: "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr 1.2fr 110px" }}>
          <span>Замовлення</span>
          <span>Студент</span>
          <span>Курс / План</span>
          <span>Дата</span>
          <span>Сума</span>
          <span>Спосіб</span>
          <span>Статус</span>
          <span>Дія</span>
        </div>

        {filtered.map((item) => (
          <div key={item.id} className="admin-table-row" style={{ gridTemplateColumns: "1.2fr 2fr 2fr 1.5fr 1.2fr 1.2fr 1.2fr 110px" }}>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: "15px", fontWeight: 700, color: "var(--accent-warm)" }}>
              {item.orderNumber}
            </span>

            <div className="admin-user-cell">
              <img src={item.avatar} alt={item.studentName} className="admin-user-avatar" />
              <div>
                <div className="admin-user-name">{item.studentName}</div>
                <div className="admin-user-email">{item.studentEmail}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{item.courseName}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{item.plan}</div>
            </div>

            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {item.dateStr}
            </div>

            <div style={{ fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700, color: "var(--accent-primary)" }}>
              {item.amount}
            </div>

            <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {item.method}
            </div>

            <div>
              <span className={`admin-status-badge ${item.status === "success" ? "active" : item.status === "pending" ? "pending" : "blocked"}`}>
                {item.statusText}
              </span>
            </div>

            <div>
              <button
                type="button"
                className="admin-row-btn"
                onClick={() => setSelectedOrder(item)}
              >
                <span>Відкрити</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal (Figma 20-01 Order Details) */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px"
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-lg)",
              maxWidth: "600px",
              width: "100%",
              padding: "36px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <span className="admin-tag">[ ІНВОЙС ]</span>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", fontWeight: 700, color: "var(--accent-primary)", margin: "4px 0 0 0" }}>
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <span className={`admin-status-badge ${selectedOrder.status === "success" ? "active" : selectedOrder.status === "pending" ? "pending" : "blocked"}`}>
                {selectedOrder.statusText}
              </span>
            </div>

            <div style={{ background: "#FAF8F5", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Студент</span>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>{selectedOrder.studentName} ({selectedOrder.studentEmail})</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Курс</span>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>{selectedOrder.courseName}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Тарифний план</span>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>{selectedOrder.plan}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Дата та час</span>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{selectedOrder.dateStr}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Спосіб оплати</span>
                <span style={{ fontSize: "14px", fontWeight: 600 }}>{selectedOrder.method}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--accent-border)" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--accent-primary)" }}>Разом до сплати:</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--accent-warm)" }}>{selectedOrder.amount}</span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                style={{ background: "#FCE8E6", color: "#C53929", border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                onClick={() => {
                  alert("Процедуру повернення коштів ініційовано");
                  setSelectedOrder(null);
                }}
              >
                Оформити повернення
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  style={{ background: "#E8E2DA", border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
                  onClick={() => setSelectedOrder(null)}
                >
                  Закрити
                </button>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={() => {
                    alert("Квитанцію завантажено");
                    setSelectedOrder(null);
                  }}
                >
                  Завантажити чек ⤓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
