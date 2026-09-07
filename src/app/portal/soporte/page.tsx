'use client';

import React from "react";
import { MessageSquare, Calendar, ArrowRight } from "lucide-react";

export default function SoportePage() {
  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Hablar con un Experto</h2>
        <p className="text-sm text-slate-500">Canal preferencial de soporte y videollamadas con tu mentor asignado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        
        {/* WhatsApp Support */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-2xl transition-all">
          <div className="space-y-4">
            <MessageSquare className="w-8 h-8 text-black" />
            <h3 className="text-xl font-bold text-slate-900">Soporte por WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comunícate por texto en tiempo real con tu mentor asignado para resolver dudas de papelería, pagos, o para notificar la fecha de tus entrevistas de forma prioritaria.
            </p>
          </div>

          <a 
            href="https://wa.me/13854162224?text=Hola%2C%20necesito%20soporte%20con%20mi%20portal%20Udreamms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/20 text-xs font-semibold tracking-widest uppercase items-center justify-center gap-2"
          >
            Iniciar Chat WhatsApp
            <ArrowRight className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* Schedule Call */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-2xl transition-all">
          <div className="space-y-4">
            <Calendar className="w-8 h-8 text-black" />
            <h3 className="text-xl font-bold text-slate-900">Agendar Videollamada</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Programa tus simulacros de entrevista consular presenciales o llamadas de orientación técnica con nuestro equipo. Selecciona la fecha y el horario que mejor te convenga.
            </p>
          </div>

          <a 
            href="https://calendar.app.google/uAhHFp3YC2T1PbGU6"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/20 text-xs font-semibold tracking-widest uppercase items-center justify-center gap-2"
          >
            Agendar Videocita
            <ArrowRight className="w-4 h-4 text-white" />
          </a>
        </div>

      </div>
    </div>
  );
}
