import LandingHero from "../../components/landing/LandingHero";
import PopularDirections from "../../components/landing/PopularDirections";
import PopularCourses from "../../components/landing/PopularCourses";
import CommunitySection from "../../components/landing/CommunitySection";
import PlatformValues from "../../components/landing/PlatformValues";
import CtaSubscribeBanner from "../../components/landing/CtaSubscribeBanner";

export default function HomePage() {
    return (
        <div className="home-page-content">
            
            <LandingHero />

            <PopularDirections />

            <PopularCourses />

            <CommunitySection />

            <PlatformValues />

            <CtaSubscribeBanner />
        </div>
    );
}
