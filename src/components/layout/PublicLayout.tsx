import { Outlet } from "react-router-dom";
import LandingHeader from "../landing/LandingHeader";
import LandingFooter from "../landing/LandingFooter";
import "../../styles/LandingPage.css";

export default function PublicLayout() {
    return (
        <div className="landing-page-root">
            <LandingHeader />
            <main className="public-layout-main">
                <Outlet />
            </main>
            <LandingFooter />
        </div>
    );
}
