"use client";

import type { LucideIcon } from "lucide-react";

/** Estilos alineados con /visas/tourist: fondo negro, tipografía ligera, iconos sin contenedor ni color. */
export const instructionsPageClass = {
  root: "min-h-screen bg-black font-sans text-white flex flex-col selection:bg-blue-500 selection:text-white",
  main: "flex-grow pt-20 pb-16 relative z-10",
  container: "container mx-auto px-4 sm:px-6 max-w-6xl",
  eyebrow:
    "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-300 font-medium text-[10px] uppercase tracking-widest mb-4 border border-white/5 backdrop-blur-md",
  h1: "text-2xl md:text-3xl lg:text-4xl font-medium tracking-tighter text-white leading-[1.15] mb-3",
  h1Accent: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-600",
  lead: "text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed font-normal",
  planCard:
    "relative p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 border w-full backdrop-blur-md",
  planCardCentered:
    "relative rounded-xl transition-all duration-300 border w-full backdrop-blur-md cursor-pointer flex flex-col justify-center items-center",
  planCardDefault:
    "bg-transparent border-white/10 hover:border-white/30 hover:bg-white/[0.02]",
  planCardSelected:
    "bg-transparent border-white/20 shadow-[0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-md",
  paymentCard:
    "relative p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 border w-full backdrop-blur-md",
  paymentCardCentered:
    "relative rounded-xl transition-all duration-300 border w-full backdrop-blur-md cursor-pointer flex flex-col justify-center items-center",
  paymentCardDefault:
    "bg-transparent border-white/10 hover:border-white/30 hover:bg-white/[0.02]",
  paymentCardSelected:
    "bg-transparent border-white/20 shadow-[0_0_35px_rgba(255,255,255,0.45)] backdrop-blur-md",
  instructionsWrap: "pt-2",
  ctaPrimary:
    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full",
  icon: "w-5 h-5 text-white shrink-0",
  iconSm: "w-4 h-4 text-white shrink-0",
} as const;

export function LimitedTimeTag() {
  return (
    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] text-white text-[9px] font-medium uppercase tracking-widest px-3 py-1 rounded-bl-2xl shadow-lg z-20 pointer-events-none animate-pulse">
      Por tiempo limitado
    </div>
  );
}

export function StepHeader({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <h2 className="text-lg md:text-xl font-medium tracking-tight text-white">
        <span className="text-white font-medium mr-2">{number}.</span>
        {label}
      </h2>
    </div>
  );
}

export function InstructionGroup({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pb-8 last:pb-0">
      <h4 className="text-sm font-medium text-white mb-5 flex items-center gap-2.5 uppercase tracking-widest opacity-80">
        <Icon className={instructionsPageClass.icon} strokeWidth={1.5} />
        {title}
      </h4>
      <ol className="space-y-5">{children}</ol>
    </section>
  );
}

export function StepItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="text-slate-500 font-medium text-sm tabular-nums pt-0.5 w-6 shrink-0">
        {number}
      </span>
      <div>
        <h5 className="text-base font-medium text-white mb-1">{title}</h5>
        <p className="text-slate-400 leading-relaxed text-sm font-normal">{description}</p>
      </div>
    </li>
  );
}
