import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHash } from "@/lib/scroll";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PartnersSection from "@/components/PartnersSection";
import CertificatesSection from "@/components/CertificatesSection";
import CtaBanner from "@/components/CtaBanner";
import CalculatorsSection from "@/components/CalculatorsSection";
import ReviewsSection from "@/components/ReviewsSection";
import GallerySection from "@/components/GallerySection";

import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const Index = () => {
  const location = useLocation();

  // When arriving from a sub-page with a hash (e.g. "/#reviews"), scroll to the
  // matching section once the page has mounted.
  useEffect(() => {
    if (location.hash) scrollToHash(location.hash);
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PartnersSection />
      <CertificatesSection />
      <CtaBanner />
      <CalculatorsSection />
      <ReviewsSection />
      <GallerySection />
      
      <ContactSection />
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
