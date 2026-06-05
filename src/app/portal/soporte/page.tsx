'use client';

import React from "react";
import { MessageSquare, Calendar, ArrowRight } from "lucide-react";

export default function SoportePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Hablar con un Experto</h2>
        <p className="text-sm text-white/50">Canal preferencial de soporte y videollamadas con tu mentor asignado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* WhatsApp Support */}
        <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.03)] transition-all">
          <div className="space-y-4">
            <MessageSquare className="w-6 h-6 text-white" />
            <h3 className="text-xl font-normal">Soporte por WhatsApp</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Comunícate por texto en tiempo real con tu mentor asignado para resolver dudas de papelería, pagos, o para notificar la fecha de tus entrevistas de forma prioritaria.
            </p>
          </div>

          <a 
            href="https://wa.me/13854162224?text=Hola%2C%20necesito%20soporte%20con%20mi%20portal%20Udreamms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] text-white text-xs font-normal tracking-widest uppercase items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            Iniciar Chat WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Schedule Call */}
        <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.03)] transition-all">
          <div className="space-y-4">
            <Calendar className="w-6 h-6 text-white" />
            <h3 className="text-xl font-normal">Agendar Videollamada</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Programa tus simulacros de entrevista consular presenciales o llamadas de orientación técnica con nuestro equipo. Selecciona la fecha y el horario que mejor te convenga.
            </p>
          </div>

          <a 
            href="https://calendar.app.google/uAhHFp3YC2T1PbGU6"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] text-white text-xs font-normal tracking-widest uppercase items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            Agendar Videocita
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
