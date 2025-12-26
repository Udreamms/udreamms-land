"use client";

interface CtaSectionProps {
  onStartQuote: () => void;
}

export default function CtaSection({ onStartQuote }: CtaSectionProps) {
  return (
    <section className="py-20 bg-black">
      <div className="container px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para comenzar tu aventura?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Miles de estudiantes ya están viviendo su sueño americano. ¡Tú puedes ser el siguiente!
        </p>
        <button
          onClick={onStartQuote}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-primary text-white rounded-lg shadow-[var(--shadow-elevated)] hover:scale-105 transition-all"
        >
          Solicitar Cotización Ahora
        </button>
      </div>
    </section>
  );
}
