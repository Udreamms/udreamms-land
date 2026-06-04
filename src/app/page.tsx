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
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24 bg-white [&>section]:scroll-mt-28">
          <ChooseYourPath />
          <StudentShowcase />
          <TouristShowcase />
          
          <div className="w-full flex justify-center px-6">
            <a href="https://wa.me/13858882799?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-black text-black rounded-full hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3 text-base md:text-lg font-medium">
              <span>¡Quiero Vivir y Estudiar en Usa!</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
            </a>
          </div>

          <MentorshipShowcase />
          <FreeTrainingShowcase />
        </div>

        {/* Desde Udreamms TV: fondo y espacios negros */}
        <div className="flex flex-col gap-16 md:gap-20 lg:gap-24 bg-black [&>section]:scroll-mt-28">
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
