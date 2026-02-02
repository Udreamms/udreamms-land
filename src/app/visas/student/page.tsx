"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "./_components/HeroSection";
import ValuePropsSection from "./_components/ValuePropsSection";
import StageDetails from "@/components/landing/StageDetails";
import AppSection from "@/components/landing/AppSection";
import WhyChooseUs from "./_components/WhyChooseUs";
import JoinOurStudents from "./_components/JoinOurStudents";
import CtaSection from "./_components/CtaSection";
import CalculatorSection from "./_components/CalculatorSection";
import PlansSection from "./_components/PlansSection";
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
      <AppSection />

      <WhyChooseUs />
      <JoinOurStudents />

      <div id="calculator-section">
        {showCalculator ? (
          <CalculatorSection onComplete={handleQuoteComplete} />
        ) : (
          <CtaSection onStartQuote={handleStartQuote} />
        )}
      </div>

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
