"use client";

import { Suspense } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "./_components/HeroSection";
import ValuePropsSection from "./_components/ValuePropsSection";
import StageDetails from "@/components/landing/StageDetails";
import Roadmap from "@/components/landing/Roadmap";
import SuccessStoriesSection from "./_components/SuccessStoriesSection";
import FinalAdventureCTA from "./_components/FinalAdventureCTA";
import PlansSection from "./_components/PlansSection";
import StatsBar from "./_components/StatsBar";
import BookPromoSection from "./_components/BookPromoSection";
function StudentVisaContent() {
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
