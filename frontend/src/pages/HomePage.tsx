import { useRef, useEffect } from "react";
import { HeroSection } from "../components/HeroSection";
import { StatsSection } from "../components/StatsSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { PricingSection } from "../components/PricingSection";
import { FAQSection } from "../components/FAQSection";
import { VideoVaultSection } from "../components/VideoVaultSection";
import { ContactSection } from "../components/ContactSection";
import { useNavigate } from "react-router-dom";

interface HomePageProps {
  onLogin: () => void;
}

export function HomePage({ onLogin }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const videoVaultRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToSection = (section: string) => {
    let ref;
    switch (section) {
      case "trading":
        ref = heroRef;
        break;
      case "account-insights":
        ref = statsRef;
        break;
      case "features":
        ref = featuresRef;
        break;
      case "pricing":
        ref = pricingRef;
        break;
      case "video-vault":
        ref = videoVaultRef;
        break;
      case "support":
        ref = contactRef;
        break;
      default:
        return;
    }
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Handle initial page load with hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      scrollToSection(hash);
    }

    // Handle hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      if (newHash) {
        scrollToSection(newHash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <div ref={heroRef} id="trading">
        <HeroSection onLogin={onLogin} />
      </div>
      <div ref={statsRef} id="account-insights">
        <StatsSection />
      </div>
      <div ref={featuresRef} id="features">
        <FeaturesSection />
      </div>
      <div ref={pricingRef} id="pricing">
        <PricingSection />
      </div>
      <div id="faq">
        <FAQSection />
      </div>
      <div ref={videoVaultRef} id="video-vault">
        <VideoVaultSection />
      </div>
      <div ref={contactRef} id="support">
        <ContactSection />
      </div>
    </div>
  );
}
