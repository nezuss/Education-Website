import LandingHero from "../../components/landing/LandingHero";
import PopularDirections from "../../components/landing/PopularDirections";
import PopularCourses from "../../components/landing/PopularCourses";
import CommunitySection from "../../components/landing/CommunitySection";
import PlatformValues from "../../components/landing/PlatformValues";
import CtaSubscribeBanner from "../../components/landing/CtaSubscribeBanner";

export default function HomePage() {
    return (
        <div className="home-page-content">
            {/* 1. Hero Section: Next-Gen Eco-Tech Education */}
            <LandingHero />

            {/* 2. Popular Directions & Why NEXYLVA Card */}
            <PopularDirections />

            {/* 3. Popular Courses with Ratings & Badges */}
            <PopularCourses />

            {/* 4. Community Stats, Movement Banner & Eco-Journal */}
            <CommunitySection />

            {/* 5. Platform Values Proposition Row */}
            <PlatformValues />

            {/* 6. CTA Ready to take the step? & Newsletter Subscription */}
            <CtaSubscribeBanner />
        </div>
    );
}
