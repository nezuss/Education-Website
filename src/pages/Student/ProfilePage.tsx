import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, type UserProfile } from "../../services/profileService";
import { getEnrolledCourses } from "../../services/courseService";
import type { Course } from "../../types/course";
import "../../styles/StudentDashboard.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"general" | "security" | "certs">("general");

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => undefined),
      getEnrolledCourses().catch(() => [] as Course[]),
    ]).then(([prof, enrolled]) => {
      if (prof) setProfile(prof);
      if (enrolled) setCourses(enrolled);
    });
  }, []);

  return (
    <div className="std-dash">
      
      <div style={{ fontSize: "14px", color: "var(--color-brand-soft)", display: "flex", gap: "8px" }}>
        <Link to="/student" style={{ color: "var(--color-brand-soft)", textDecoration: "none" }}>Головна</Link>
        <span>&gt;</span>
        <span style={{ color: "var(--color-brand-dark)", fontWeight: 500 }}>Профіль студента</span>
      </div>

      <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", boxShadow: "0 4px 16px rgba(10, 45, 27, 0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <img
            src="/student/student_avatar.webp"
            alt="Student Avatar"
            style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", border: "4px solid var(--color-brand-primary)" }}
          />
          <div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
              <span className="std-chip">PRO STUDENT</span>
              <span style={{ fontSize: "12px", color: "var(--color-brand-soft)" }}>На платформі з 2026</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "28px", fontWeight: 700, color: "var(--color-brand-dark)", margin: "0 0 6px 0" }}>
              {profile?.username || profile?.name || "Анна Ковальчук"}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-brand-soft)", margin: 0 }}>
              {profile?.email || "anna.koval@gmail.com"} • Sustainable &amp; Circular Design
            </p>
          </div>
        </div>

        <button
          type="button"
          className="std-continue-btn"
          style={{ background: "var(--color-bg-sand)", color: "var(--color-brand-dark)" }}
          onClick={() => alert("Зміни збережено!")}
        >
          <span>Редагувати профіль</span>
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="button"
          className={`std-chip ${activeTab === "general" ? "active" : ""}`}
          style={{
            cursor: "pointer",
            border: "none",
            padding: "10px 20px",
            fontSize: "14px",
            background: activeTab === "general" ? "var(--color-brand-dark)" : "#FFFFFF",
            color: activeTab === "general" ? "#FFFFFF" : "var(--color-brand-dark)"
          }}
          onClick={() => setActiveTab("general")}
        >
          Особисті дані
        </button>
        <button
          type="button"
          className={`std-chip ${activeTab === "certs" ? "active" : ""}`}
          style={{
            cursor: "pointer",
            border: "none",
            padding: "10px 20px",
            fontSize: "14px",
            background: activeTab === "certs" ? "var(--color-brand-dark)" : "#FFFFFF",
            color: activeTab === "certs" ? "#FFFFFF" : "var(--color-brand-dark)"
          }}
          onClick={() => setActiveTab("certs")}
        >
          Сертифікати та нагороди
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "24px" }}>
        
        <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "36px", boxShadow: "0 4px 16px rgba(10, 45, 27, 0.04)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
            Інформація про користувача
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-brand-dark)", marginBottom: "6px" }}>
                Ім’я та прізвище
              </label>
              <input
                type="text"
                className="contacts-input"
                defaultValue={profile?.username || "Анна Ковальчук"}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-brand-dark)", marginBottom: "6px" }}>
                Email адреса
              </label>
              <input
                type="email"
                className="contacts-input"
                defaultValue={profile?.email || "anna.koval@gmail.com"}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-brand-dark)", marginBottom: "6px" }}>
              Номер телефону
            </label>
            <input
              type="text"
              className="contacts-input"
              defaultValue="+380 97 123 45 67"
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--color-brand-dark)", marginBottom: "6px" }}>
              Про себе / Напрям
            </label>
            <textarea
              className="contacts-input contacts-textarea"
              defaultValue="Досліджую циркулярні матеріали, LCA та біополімери у промисловому пакуванні. Працюю над дипломним проєктом для бренду косметики."
              style={{ width: "100%", boxSizing: "border-box" }}
            />
          </div>

          <button type="button" className="std-continue-btn" onClick={() => alert("Дані оновлено!")}>
            <span>Зберегти зміни</span>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "var(--color-bg-sand)", borderRadius: "24px", padding: "32px" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--color-brand-dark)", marginBottom: "16px" }}>
              Навчальні досягнення
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", paddingBottom: "8px", borderBottom: "1px solid rgba(140, 109, 83, 0.2)" }}>
                <span>Активні курси</span>
                <strong>{courses.length > 0 ? courses.length : 2}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", paddingBottom: "8px", borderBottom: "1px solid rgba(140, 109, 83, 0.2)" }}>
                <span>Здані проєкти</span>
                <strong>3</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", paddingBottom: "8px", borderBottom: "1px solid rgba(140, 109, 83, 0.2)" }}>
                <span>Сертифікати</span>
                <strong>1</strong>
              </div>
            </div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 16px rgba(10, 45, 27, 0.04)" }}>
            <span className="std-badge-tag">[ ОФІЦІЙНИЙ СЕРТИФІКАТ ]</span>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, margin: "6px 0 8px 0" }}>
              Sustainable Design Fundamentals
            </h4>
            <p style={{ fontSize: "13px", color: "var(--color-brand-soft)", margin: "0 0 16px 0" }}>
              Видано 14 липня 2026. Сертифікат засвідчує успішне проходження програми та захист курсової роботи.
            </p>
            <a
              href="#download"
              onClick={(e) => { e.preventDefault(); alert("Завантаження сертифікату PDF..."); }}
              style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-brand-primary)", textDecoration: "underline" }}
            >
              Завантажити PDF (A4) &darr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
