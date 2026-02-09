"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HeroSection from "./_components/HeroSection";
import StadiumsShowcase from "./_components/StadiumsShowcase";
import FifaRequirementsSection from "./_components/FifaRequirementsSection";
import ValuePropsSection from "./_components/ValuePropsSection";
import SuccessVideoSection from "./_components/SuccessVideoSection";
import FifaWhyChooseUs from "./_components/FifaWhyChooseUs";
import FifaSuccessStories from "./_components/FifaSuccessStories";
import FifaYouTubeSocial from "./_components/FifaYouTubeSocial";
import FifaBuyCta from "./_components/FifaBuyCta";
import ScarcitySection from "./_components/ScarcitySection";
import PlansSection from "./_components/PlansSection";
import FanPassShowcase from "./_components/FanPassShowcase";
import FanFollowShowcase from "./_components/FanFollowShowcase";
import WorldCupEliteShowcase from "./_components/WorldCupEliteShowcase";
import StatsBar from "./_components/StatsBar";

export default function FifaVisaPage() {
  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Header />
      <HeroSection />
      <PlansSection />
      <ValuePropsSection />
      <FanPassShowcase />
      <FanFollowShowcase />
      <WorldCupEliteShowcase />
      <StatsBar />
      <StadiumsShowcase />
      <FifaRequirementsSection />
      <SuccessVideoSection />
      <FifaWhyChooseUs />
      <FifaSuccessStories />
      <FifaYouTubeSocial />
      <FifaBuyCta />
      <ScarcitySection />
      <Footer />
    </div>
  );
}
