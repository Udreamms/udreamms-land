"use client";

import { useState, useEffect } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Users, MapPin, Calendar, Check } from "lucide-react";

export default function FifaVisaPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    // Fake countdown to World Cup 2026 roughly
    const targetDate = new Date("2026-06-11T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Deportivo */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <img src="/assets/hero-statue-liberty.jpg" alt="Stadium" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6 animate-pulse">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-yellow-500 font-bold tracking-widest uppercase">FIFA World Cup 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 italic leading-none">
              NO TE QUEDES <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">FUERA DE JUEGO.</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 font-light">
              Las citas consulares se están agotando. Asegura tu visa y tu experiencia mundialista antes de que sea tarde.
            </p>

            <div className="flex gap-4 mb-12">
               <div className="text-center">
                 <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 w-20">
                   <span className="block text-2xl font-bold font-mono">{timeLeft.days}</span>
                   <span className="text-xs text-gray-400">Días</span>
                 </div>
               </div>
               <div className="text-center">
                 <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 w-20">
                   <span className="block text-2xl font-bold font-mono">{timeLeft.hours}</span>
                   <span className="text-xs text-gray-400">Hrs</span>
                 </div>
               </div>
               <div className="text-center">
                 <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 w-20">
                   <span className="block text-2xl font-bold font-mono">{timeLeft.minutes}</span>
                   <span className="text-xs text-gray-400">Min</span>
                 </div>
               </div>
            </div>

            <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black font-bold h-14 px-8 text-lg rounded-full shadow-[0_0_30px_rgba(234,179,8,0.4)] border-none">
              Asegurar mi Viaje al Mundial
            </Button>
          </div>
        </div>
      </section>

      {/* Oferta Irresistible */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">El Pack "Fanático Mundialista"</h2>
            <p className="text-gray-400">Todo lo que necesitas para vivir la pasión sin preocupaciones.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black border border-white/10 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <Calendar className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Trámite de Visa Prioritario</h3>
              <p className="text-gray-400">Gestión acelerada y monitoreo 24/7 para encontrar citas cercanas.</p>
            </div>
            
            <div className="bg-black border border-white/10 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <MapPin className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Guía de Sedes 2026</h3>
              <p className="text-gray-400">Información exclusiva de logística, hoteles y transporte en las ciudades anfitrionas.</p>
            </div>

            <div className="bg-black border border-white/10 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
              <Users className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Comunidad Exclusiva</h3>
              <p className="text-gray-400">Acceso al grupo de WhatsApp "Comunidad Udreamms Mundial" para coordinar con otros fans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 to-black text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">La copa del mundo no espera. Tu visa tampoco.</h2>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 text-sm text-gray-300">
                 <Check className="text-green-500" /> Asesoría experta DS-160
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-300">
                 <Check className="text-green-500" /> Acceso a grupo de comunidad
               </div>
               <div className="flex items-center gap-3 text-sm text-gray-300">
                 <Check className="text-green-500" /> Guía de supervivencia mundialista
               </div>
            </div>
            <a 
              href="https://wa.me/1234567890?text=Hola,%20quiero%20asegurar%20mi%20viaje%20al%20Mundial%202026"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-green-900/20"
            >
              Contactar por WhatsApp Ahora
            </a>
            <p className="mt-4 text-xs text-gray-500">Respuesta típica: menos de 5 minutos</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
