"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "./_components/HeroSection";
import ValuePropsSection from "./_components/ValuePropsSection";
import BenefitsSection from "./_components/BenefitsSection";
import SuccessVideoSection from "./_components/SuccessVideoSection";
import BuyCtaSection from "./_components/BuyCtaSection";
import BasicPlanShowcase from "./_components/BasicPlanShowcase";
import PremiumPlanShowcase from "./_components/PremiumPlanShowcase";
import VipPlanShowcase from "./_components/VipPlanShowcase";
import StatsSection from "./_components/StatsSection";
import DestinationsShowcase from "./_components/DestinationsShowcase";
import WhyUdreammsSection from "./_components/WhyUdreammsSection";


import PlansSection from "./_components/PlansSection";

export default function TouristVisaPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <Header />
      <HeroSection />

      {/* 1. The Offer (Restored Overview) */}
      <PlansSection />

      {/* 2. Value Reinforcement (Moved here as requested) */}
      <ValuePropsSection />
      <BenefitsSection />

      {/* 3. Deep Dives (Information Only) */}
      <BasicPlanShowcase />
      <PremiumPlanShowcase />
      <VipPlanShowcase />
      <StatsSection />
      <DestinationsShowcase />

      {/* 5. Social Proof & Evidence */}
      <SuccessVideoSection />
      <WhyUdreammsSection />

      

      {/* 7. Direct Purchase CTA */}
      <BuyCtaSection />

      <Footer />
    </div>
  );
}
