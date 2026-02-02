"use client";

import { QuoteCalculator } from "./QuoteCalculator";

interface CalculatorSectionProps {
  onComplete: (total: number) => void;
}

export default function CalculatorSection({ onComplete }: CalculatorSectionProps) {
  return (
    <section id="calculator" className="py-20 bg-black">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-medium mb-4 text-white tracking-tight">
            Obtén tu Cotización Personalizada
          </h2>
          <p className="text-lg text-white/80 font-normal max-w-2xl mx-auto">
            Responde algunas preguntas y conoce la inversión exacta para tu futuro
          </p>
        </div>
        <QuoteCalculator onComplete={onComplete} />
      </div>
    </section>
  );
}
