import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "../../services/authService";
import "./AppShell.css";

const navigation = [
    { to: "/", label: "Головна" },
    { to: "/courses", label: "Курси" },
    { to: "/student", label: "Студент" },
    { to: "/mentor", label: "Ментор" },
    { to: "/admin", label: "Адміністрування" },
];

export default function AppShell() {
    const navigate = useNavigate(); const hasToken = Boolean(localStorage.getItem("token"));
    async function handleSignOut() { await signOut(); navigate("/"); }
    return <div className="app-shell"><header className="site-header"><NavLink className="brand" to="/">NEXYLVA</NavLink><nav aria-label="Основна навігація">{navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === "/"}>{item.label}</NavLink>)}</nav>{hasToken ? <button className="header-login" onClick={handleSignOut}>Вийти</button> : <NavLink className="header-login" to="/login">Увійти</NavLink>}</header><main className="page-container"><Outlet /></main></div>;
}
