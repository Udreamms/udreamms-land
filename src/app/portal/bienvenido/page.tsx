'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ArrowRight, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePortal } from '../PortalContext';
import { Button } from '@/components/ui/button';

interface PhaseCard {
  phase: number;
  title: string;
  subtitle: string;
  videoDuration?: string;
}

const phases: PhaseCard[] = [
  {
    phase: 1,
    title: 'Preparándote para tu gran aventura',
    subtitle: 'Aún no cumples los requisitos: inglés y referidos.',
  },
  {
    phase: 2,
    title: 'Iniciando tu proceso migratorio',
    subtitle: 'Ya tienes tus documentos: aplicación y visa.',
  },
  {
    phase: 3,
    title: 'Organizando tu viaje a EE.UU.',
    subtitle: 'Ya tienes tu visa: llegada, vivienda y más.',
  },
  {
    phase: 4,
    title: 'Tus primeros días en EE.UU.',
    subtitle: 'Ya estás aquí: adaptación y crecimiento.',
  },
];

export default function BienvenidoPage() {
  const { user } = usePortal();
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const [isPlayingMain, setIsPlayingMain] = useState(false);

  const userName = user?.displayName
    ? user.displayName.split(' ')[0]
    : 'Futuro Estudiante';

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          ¡Bienvenido a Udreamms, {userName}!
        </h1>
        <p className="text-slate-500 text-sm md:text-base font-normal">
          Empieza aquí: mira el video de bienvenida y descubre en qué fase de tu viaje te encuentras.
        </p>
      </div>

      {/* Main Grid: Video Player + By Step Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full min-w-0">
        {/* Main Video Box */}
        <div className="lg:col-span-8 bg-[#101426] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[360px] sm:min-h-[440px]">
          {/* Tag */}
          <div className="relative z-10">
            <span className="inline-block bg-[#8b5cf6] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
              VIDEO DE BIENVENIDA
            </span>
          </div>

          {/* Central Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button
              onClick={() => setIsPlayingMain(!isPlayingMain)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
              aria-label="Reproducir video de bienvenida"
            >
              <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-slate-900 text-slate-900 ml-1 group-hover:scale-105 transition-transform" />
            </button>
          </div>

          {/* Background subtle decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Bottom Title */}
          <div className="relative z-10 pt-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight">
              ¿Qué es Udreamms y cómo te acompaña?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-normal">
              Con Valentina · [duración]
            </p>
          </div>
        </div>

        {/* Right Action / Checklist Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
          <div className="space-y-5">
            <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              POR DÓNDE EMPEZAR
            </h3>

            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-sm font-normal text-slate-700 leading-snug">
                  Mira el video de bienvenida.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-sm font-normal text-slate-700 leading-snug">
                  Elige tu fase abajo y mira el video que la explica.
                </p>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-sm font-normal text-slate-700 leading-snug">
                  Sigue tu proceso en Mi proceso o elige tu plan en la tienda.
                </p>
              </li>
            </ol>
          </div>

          <div className="space-y-3 pt-2">
            <Link href="/portal/proceso" className="block w-full">
              <Button className="w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm tracking-wide shadow-md shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2">
                <span>Ir a Mi proceso</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link href="/portal/tienda" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-11 rounded-2xl bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium text-sm tracking-wide hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-slate-500" />
                <span>Ver la tienda</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* The 4 Phases Section */}
      <div className="space-y-4 pt-4 w-full min-w-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Las 4 fases de tu viaje
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-normal">
            Toca una fase para ver el video donde te explico qué hacer en ella.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
          {phases.map((item) => {
            const isSelected = selectedPhase === item.phase;
            return (
              <motion.div
                key={item.phase}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedPhase(item.phase)}
                className={`rounded-3xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-5 sm:p-6 bg-white min-w-0 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                    : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Upper Video Thumbnail Preview */}
                <div className="w-full h-32 rounded-2xl bg-[#eaedf9] flex items-center justify-center mb-5 relative group">
                  <div className="w-11 h-11 rounded-full bg-[#1e2338] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-end">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 block">
                    FASE {item.phase}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
