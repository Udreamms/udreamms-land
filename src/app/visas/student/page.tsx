"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "./_components/HeroSection";
import ValuePropsSection from "./_components/ValuePropsSection";
import StageDetails from "@/components/landing/StageDetails";
import Roadmap from "@/components/landing/Roadmap";
import SuccessStoriesSection from "./_components/SuccessStoriesSection";
import FinalAdventureCTA from "./_components/FinalAdventureCTA";
import CalculatorSection from "./_components/CalculatorSection";
import PlansSection from "./_components/PlansSection";
import StatsBar from "./_components/StatsBar";
import BookPromoSection from "./_components/BookPromoSection";
import { UpsellModal } from "./_components/UpsellModal";

function StudentVisaContent() {
  const searchParams = useSearchParams();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (searchParams.get('calculator') === 'true' || (typeof window !== 'undefined' && window.location.hash === '#calculator-section')) {
      setShowCalculator(true);
      setTimeout(() => {
        document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [searchParams]);

  const handleStartQuote = () => {
    setShowCalculator(true);
    setTimeout(() => {
      document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleQuoteComplete = (total: number) => {
    setTotalPrice(total);
    setShowUpsell(true);
  };

  const handleAppClick = () => {
    document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <HeroSection />
      <PlansSection />
      <ValuePropsSection />
      <StageDetails />
      <Roadmap />
      <BookPromoSection />
      <StatsBar />
      <SuccessStoriesSection />
      <FinalAdventureCTA />

      <Footer />

      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        total={totalPrice}
      />
    </>
  );
}

export default function StudentVisaPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <StudentVisaContent />
      </Suspense>
    </div>
  );
}
