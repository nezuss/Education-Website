import { NavLink, Outlet } from "react-router-dom";
import "./AppShell.css";

const navigation = [
    { to: "/", label: "Головна" },
    { to: "/courses", label: "Курси" },
    { to: "/student", label: "Студент" },
    { to: "/mentor", label: "Ментор" },
    { to: "/admin", label: "Адміністрування" },
];

export default function AppShell() {
    return <div className="app-shell"><header className="site-header"><NavLink className="brand" to="/">NEXYLVA</NavLink><nav aria-label="Основна навігація">{navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"}>{item.label}</NavLink>)}</nav><NavLink className="header-login" to="/login">Увійти</NavLink></header><main className="page-container"><Outlet /></main></div>;
}
