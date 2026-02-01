"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "./_components/HeroSection";
import ValuePropsSection from "./_components/ValuePropsSection";
import SystemGapSection from "./_components/SystemGapSection";
import BenefitsSection from "./_components/BenefitsSection";
import AgitationSection from "./_components/AgitationSection";
import SuccessVideoSection from "./_components/SuccessVideoSection";
import SolutionSection from "./_components/SolutionSection";
import SocialProofSection from "./_components/SocialProofSection";
import GuaranteeSection from "./_components/GuaranteeSection";
import FAQSection from "./_components/FAQSection";
import ScarcitySection from "./_components/ScarcitySection";
import QuizSection from "./_components/QuizSection";

import PlansSection from "./_components/PlansSection";

export default function TouristVisaPage() {
  return (
    <div className="min-h-screen bg-cloud font-sans">
      <Header />
      <HeroSection />
      <PlansSection />
      <SystemGapSection />
      <ValuePropsSection />
      <BenefitsSection />
      <AgitationSection />
      <SuccessVideoSection />
      <SolutionSection />
      <SocialProofSection />
      <GuaranteeSection />
      <FAQSection />
      <ScarcitySection />
      <QuizSection />
      <Footer />
    </div>
  );
}
