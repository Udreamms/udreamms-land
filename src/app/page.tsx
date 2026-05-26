"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import ChooseYourPath from "@/components/landing/ChooseYourPath";
import Stats from "@/components/landing/Stats";
import UdreammsAppShowcase from "@/components/landing/UdreammsAppShowcase";
/* Secciones ocultas — importar desde @/frontend/modules/marketing/home/secciones-ocultar/ */
// import Services from "@/frontend/modules/marketing/home/secciones-ocultar/Services";
// import ExperienceSection from "@/frontend/modules/marketing/home/secciones-ocultar/ExperienceSection";
// import WhyChooseUs from "@/frontend/modules/marketing/home/secciones-ocultar/WhyChooseUs";
// import JoinOurStudents from "@/frontend/modules/marketing/home/secciones-ocultar/JoinOurStudents";
// import YouTubeSubscription from "@/frontend/modules/marketing/home/secciones-ocultar/YouTubeSubscription";
import FAQsSection from "@/components/landing/FAQsSection";
import TouristShowcase from "@/components/landing/TouristShowcase";
import StudentShowcase from "@/components/landing/StudentShowcase";
import MentorshipShowcase from "@/components/landing/MentorshipShowcase";
import FreeTrainingShowcase from "@/components/landing/FreeTrainingShowcase";
import UdreammsTVShowcase from "@/components/landing/UdreammsTVShowcase";
export default function Home() {
  const handleStartQuote = () => {
    window.location.href = "/visas/student#calculator-section";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <Hero onStartQuote={handleStartQuote} />

        {/* Bloque superior: espacio entre secciones en blanco */}
        <div className="flex flex-col gap-20 md:gap-28 lg:gap-36 bg-white [&>section]:scroll-mt-28">
          <ChooseYourPath />
          <StudentShowcase />
          <TouristShowcase />
          <MentorshipShowcase />
          <FreeTrainingShowcase />
        </div>

        {/* Desde Udreamms TV: fondo y espacios negros */}
        <div className="flex flex-col gap-20 md:gap-28 lg:gap-36 bg-black [&>section]:scroll-mt-28">
          <UdreammsTVShowcase />
          <Stats />
          <UdreammsAppShowcase />
          <FAQsSection />
        </div>
      </main>

      <div className="bg-black pt-20 md:pt-28 lg:pt-36">
        <Footer />
      </div>
    </div>
  );
}
