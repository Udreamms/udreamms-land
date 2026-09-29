'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tv, Play, Radio, Calendar, Sparkles, Clock, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreamingSession {
  id: string;
  title: string;
  speaker: string;
  category: string;
  status: 'en_vivo' | 'programado' | 'grabado';
  date: string;
  time?: string;
  description: string;
}

const sessions: StreamingSession[] = [
  {
    id: 'stream-1',
    title: 'Adaptación y Primeros Días en EE.UU.: Vivienda, Transporte y Clima',
    speaker: 'Valentina & Equipo uDreamms',
    category: 'Vida en EE.UU.',
    status: 'grabado',
    date: 'Disponible ahora',
    description: 'Guía detallada de llegada: opciones de alojamiento estudiantil, transporte público, cómo moverte sin vehículo y qué ropa comprar.',
  },
  {
    id: 'stream-2',
    title: 'Apertura de Cuenta Bancaria y Línea Telefónica sin SSN',
    speaker: 'Asesor Legal uDreamms',
    category: 'Trámites Iniciales',
    status: 'grabado',
    date: 'Disponible ahora',
    description: 'Paso a paso para abrir cuenta de ahorros, tarjeta de débito y contratar un plan de datos móvil al aterrizar.',
  },
  {
    id: 'stream-3',
    title: 'Q&A en Vivo: Preguntas Frecuentes sobre Escuela, I-20 y Leyes F-1',
    speaker: 'Mentores uDreamms',
    category: 'En Vivo Mensual',
    status: 'programado',
    date: 'Próximo Jueves',
    time: '7:00 PM (Hora de Utah / MST)',
    description: 'Sesión interactiva en streaming con nuestros directores para resolver dudas sobre asistencia, mantenimiento de estatus legal y consejos de estudio.',
  },
  {
    id: 'stream-4',
    title: 'Networking estudiantil y Oportunidades en el Campus',
    speaker: 'Estudiantes uDreamms en Utah',
    category: 'Comunidad',
    status: 'grabado',
    date: 'Disponible ahora',
    description: 'Conoce la experiencia de otros estudiantes que ya están en Salt Lake City y Provo cumpliendo su meta.',
  },
];

export default function AdaptacionStreamingPage() {
  const [activeSession, setActiveSession] = useState<StreamingSession>(sessions[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full min-w-0 space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 w-full">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Streaming & Mentorías de Adaptación</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Adaptación Streaming
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1 max-w-2xl font-normal">
            Talleres en vivo, transmisiones de orientación y sesiones grabadas para adaptarte exitosamente a la vida en Estados Unidos.
          </p>
        </div>

        <a
          href="https://wa.me/13854162224?text=Hola%2C%20quisiera%20agendar%20o%20hacer%20una%20pregunta%20para%20la%20sesion%20de%20Adaptacion%20Streaming"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="h-10 px-5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-medium flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <MessageSquare className="w-4 h-4" />
            <span>Enviar preguntas al mentor</span>
          </Button>
        </a>
      </div>

      {/* Main Stream Player Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full min-w-0">
        <div className="lg:col-span-8 bg-[#0b0e1b] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[460px]">
          {/* Top badges */}
          <div className="flex items-center justify-between gap-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {activeSession.category}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              {activeSession.date}
            </span>
          </div>

          {/* Central Play / Action */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
              aria-label="Reproducir streaming"
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-slate-900 text-slate-900 ml-1 group-hover:scale-105 transition-transform" />
            </button>
          </div>

          {/* Atmosphere effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Bottom Stream Details */}
          <div className="relative z-10 pt-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight leading-snug">
              {activeSession.title}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 font-normal">
              Presentado por: <span className="text-white font-medium">{activeSession.speaker}</span>
            </p>
          </div>
        </div>

        {/* Right Schedule / Session list */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 min-w-0">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                SESIONES DISPONIBLES
              </h3>
              <Tv className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">
              {sessions.map((sess) => {
                const isSelected = activeSession.id === sess.id;
                return (
                  <div
                    key={sess.id}
                    onClick={() => {
                      setActiveSession(sess);
                      setIsPlaying(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400/20'
                        : 'bg-slate-50/60 hover:bg-slate-100/70 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-rose-600">
                        {sess.category}
                      </span>
                      {sess.status === 'programado' ? (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                          En Vivo Próximamente
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500">
                          Grabado
                        </span>
                      )}
                    </div>
                    <h4 className={`text-xs leading-snug line-clamp-2 ${isSelected ? 'font-semibold text-slate-900' : 'font-normal text-slate-700'}`}>
                      {sess.title}
                    </h4>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              💡 Todas las mentorías quedan grabadas en tu portal para que puedas consultarlas en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
