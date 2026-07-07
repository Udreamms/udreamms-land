export default function PurchaseCard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 font-sans text-white" id="buy-now">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full font-sans text-center">

          {/* Column 1: Características */}
          <div className="flex flex-col items-center space-y-3 text-slate-300 text-xs md:text-sm text-center">
            <p className="font-semibold text-white">• Aprende el proceso completo de la visa F1.</p>
            <p className="font-semibold text-white">• Evita los errores más comunes en el DS-160 y la entrevista.</p>
            <p className="font-semibold text-white">• Descarga la guía al instante y empieza hoy mismo.</p>
          </div>

          {/* Column 2: Descripción */}
          <div className="flex flex-col items-center space-y-3 text-slate-400 text-xs md:text-sm text-center">
            <p className="font-semibold text-slate-200 text-sm md:text-base leading-snug">
              Más de 120 páginas de estrategias, ejemplos y recursos prácticos
            </p>
            <p className="leading-relaxed">
              Obtén acceso inmediato a la guía completa y comienza hoy mismo a preparar tu proceso para estudiar en Estados Unidos con mayor claridad y confianza.
            </p>
          </div>

          {/* Column 3: Testimonial */}
          <div className="flex flex-row items-center gap-4 text-left justify-center mx-auto max-w-sm">
            {/* Avatar Column */}
            <div className="relative w-16 h-16 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Carlos M. - Visa F1 Aprobada"
                className="w-full h-full rounded-full object-cover border-2 border-slate-800 shadow-md"
              />
              {/* Colombia flag badge */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border border-slate-800 shadow-sm overflow-hidden bg-white flex items-center justify-center">
                <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
                  <rect width="3" height="1" fill="#fcd116" />
                  <rect width="3" height="0.5" y="1" fill="#003893" />
                  <rect width="3" height="0.5" y="1.5" fill="#ce1126" />
                </svg>
              </div>
            </div>

            {/* Quote Column */}
            <div className="flex-1 flex flex-col">
              <p className="italic text-xs text-slate-300 leading-relaxed">
                "Antes de leer la guía no sabía por dónde empezar. Gracias a Udreamms entendí cada paso del proceso y llegué mucho más preparado a mi entrevista."
              </p>
              <div className="mt-2">
                <span className="block font-bold text-white text-xs">— Carlos M.</span>
                <span className="block text-[10px] text-blue-400 font-semibold mt-0.5">Visa F1 Aprobada – 2024</span>
              </div>
            </div>
          </div>

        </div>

    </div>
  );
}
