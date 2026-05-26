"use client";

import type { LucideIcon } from "lucide-react";

/** Estilos alineados con /visas/tourist: fondo negro, tipografía ligera, iconos sin contenedor ni color. */
export const instructionsPageClass = {
  root: "min-h-screen bg-black font-sans text-white flex flex-col",
  main: "flex-grow pt-28 pb-24 md:pb-32 relative z-10",
  container: "container mx-auto px-6 max-w-5xl",
  eyebrow:
    "inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 text-slate-300 font-medium text-[10px] uppercase tracking-widest mb-6 border border-white/5",
  h1: "text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white leading-[1.1] mb-4",
  h1Accent: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600",
  lead: "text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal",
  planCard:
    "relative p-6 md:p-8 rounded-[2rem] text-left transition-all duration-300 border-0 ring-1 w-full",
  planCardDefault: "bg-black ring-white/5 hover:ring-white/15",
  planCardSelected: "bg-black ring-slate-500/50 shadow-2xl",
  paymentCard:
    "relative p-6 md:p-8 rounded-[2rem] text-left transition-all duration-300 ring-1 w-full",
  paymentCardDefault: "bg-black ring-white/5 hover:ring-white/15",
  paymentCardSelected: "bg-black ring-slate-500/50",
  instructionsWrap: "pt-4 md:pt-6",
  ctaPrimary:
    "inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-base font-normal text-white border border-white/40 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:scale-[1.03]",
  icon: "w-5 h-5 text-slate-400 shrink-0",
  iconSm: "w-4 h-4 text-slate-400 shrink-0",
} as const;

export function StepHeader({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-800 to-purple-400 text-white font-medium text-sm">
        {number}
      </span>
      <h2 className="text-xl md:text-2xl font-medium tracking-tight text-white">{label}</h2>
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
    <section className="border-b border-white/5 pb-8 last:border-0 last:pb-0">
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
