import Hero from "@/components/landing-page/hero-section";
import LandingContent from "@/components/landing-page/landing-content";
import LandingFooter from "@/components/landing-page/landing-footer";
import LandingMotion from "@/components/landing-page/landing-motion";
import "./landing.css";
import "./landing-animations.css";

export const metadata = {
  title: "BulkMailer | A personal touch in every email",
  description:
    "Create personalized email templates, manage campaigns, and follow sending progress in one simple BulkMailer workspace.",
};

export default function Home() {
  return (
    <LandingMotion><div className="landing-page">
      <Hero />
      <main>
        <LandingContent />
      </main>
      <LandingFooter />
    </div></LandingMotion>
  );
}
