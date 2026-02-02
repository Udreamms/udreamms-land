"use client";

import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppSection() {
  return (
    <section id="app-section" className="bg-[#D1113D] py-24 relative overflow-hidden">
      {/* Background patterns can be added here later if needed */}
      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center text-center">

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mb-8">
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter text-white">
              Descarga
            </h2>
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
              <img
                src="/assets/logo-icon.png"
                alt="Udreamms Logo"
                className="w-12 h-12 md:w-20 md:h-20 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Flogo_white.png?alt=media";
                }}
              />
            </div>
            <h2 className="text-5xl md:text-8xl font-medium tracking-tighter text-white">
              Udreamms
            </h2>
          </div>

          <h2 className="text-5xl md:text-8xl font-medium tracking-tighter text-white mb-10">
            para comenzar
          </h2>

          <p className="text-xl md:text-2xl text-white/90 font-medium mb-12 max-w-2xl">
            Utilizada por cientos de estudiantes en Estados Unidos
          </p>

          <Button className="rounded-full bg-white text-slate-900 hover:bg-white/90 font-medium px-12 py-8 text-xl shadow-2xl transition-all border-none flex items-center gap-3">
            <Smartphone className="w-6 h-6" />
            Descargar Udreamms App
          </Button>
        </div>
      </div>
    </section>
  );
}
