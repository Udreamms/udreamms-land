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
import StudentMarketing from "./_components/StudentMarketing";
import UdreammsAppPromo from "./_components/UdreammsAppPromo";

// Import components from the main landing directory
import Services from "@/components/landing/Services";
import Roadmap from "@/components/landing/Roadmap";
import StageDetails from "@/components/landing/StageDetails";
import AppSection from "@/components/landing/AppSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import VideoTestimonials from "./_components/VideoTestimonials";
import JoinOurStudents from "@/components/landing/JoinOurStudents";
import Testimonial from "@/components/landing/Testimonial";
import CityPartnerships from "@/components/landing/CityPartnerships";
import CtaSection from "@/components/landing/CtaSection";
import YouTubeSubscription from "@/components/landing/YouTubeSubscription";

export default function StudentVisaPage() {
  const handleStartQuote = () => {
    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAppClick = () => {
    document.getElementById('app-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cloud font-sans">
      <Header />
      <HeroSection />

      {/* Principal flow */}
      <PlansSection />
      <ValuePropsSection />
      <StudentMarketing onStartQuote={handleStartQuote} onAppClick={handleAppClick} />

      <StageDetails />
      <AppSection />
      <VideoTestimonials />
      <UdreammsAppPromo />


      <Footer />
    </div>
  );
}
