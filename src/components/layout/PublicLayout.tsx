import { Outlet, useLocation } from "react-router-dom";
import LandingHeader from "../landing/LandingHeader";
import LandingFooter from "../landing/LandingFooter";
import "../../styles/LandingPage.css";
import "../../styles/PublicFigma.css";

export default function PublicLayout() {
    const { pathname } = useLocation();
    const usesFigmaLayout = ["/", "/about", "/contacts", "/courses", "/login", "/registration", "/forgot-password", "/change-password", "/reset-password", "/confirm-email"].includes(pathname) || pathname.startsWith("/courses/") || pathname.startsWith("/confirm-email/");
    return (
        <div className={`landing-page-root${usesFigmaLayout ? " public-figma-layout" : ""}`}>
            <LandingHeader />
            <main className="public-layout-main">
                <Outlet />
            </main>
            <LandingFooter />
        </div>
    );
}
