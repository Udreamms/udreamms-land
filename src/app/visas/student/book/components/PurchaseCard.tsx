export default function PurchaseCard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 font-sans text-white" id="buy-now">

        {/* Top Grid: Book Cover & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center font-sans">

          {/* Bloque Izquierdo: Libro y Precios */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center font-sans mx-auto w-full">
            <div className="flex flex-row items-center gap-6 justify-center w-full font-sans">
              {/* Portada Libro */}
              <div className="relative w-28 md:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 shadow-lg shrink-0">
                <img
                  src="/book-udreamms.jpeg"
                  alt="Libro Digital Udreamms - Paso a paso para tu visa"
                  className="w-full h-full object-cover scale-110 origin-center"
                />
              </div>

              {/* Precios */}
              <div className="flex flex-col justify-center text-left font-sans">
                <span className="text-xs md:text-sm font-medium text-slate-500 line-through font-sans">
                  Antes $49 USD
                </span>
                <div className="flex items-baseline gap-1 mt-1 font-sans">
                  <span className="text-[10px] font-normal text-slate-400 uppercase font-sans">Hoy solo</span>
                  <span className="text-3xl md:text-4xl font-medium text-white tracking-tight font-sans">
                    $29.99
                  </span>
                  <span className="text-base font-normal text-slate-400 font-sans">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Formulario y CTA */}
          <div className="lg:col-span-7 flex flex-col space-y-4 font-sans">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
              {/* Nombre */}
              <div className="relative md:col-span-1 font-sans">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 font-sans">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  suppressHydrationWarning
                  className="w-full pl-9 pr-3 py-3 bg-transparent border border-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-slate-500 text-white font-sans"
                />
              </div>

              {/* Apellido */}
              <div className="relative md:col-span-1 font-sans">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 font-sans">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Apellido"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  suppressHydrationWarning
                  className="w-full pl-9 pr-3 py-3 bg-transparent border border-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-slate-500 text-white font-sans"
                />
              </div>

              {/* Correo */}
              <div className="relative md:col-span-1 font-sans">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500 font-sans">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  suppressHydrationWarning
                  className="w-full pl-9 pr-3 py-3 bg-transparent border border-white rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-slate-500 text-white font-sans"
                />
              </div>

              {/* Botón de Submit */}
              <div className="md:col-span-3 mt-2 font-sans">
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md text-center tracking-wide text-sm font-sans font-semibold py-4 px-6 rounded-xl"
                >
                  QUIERO MI GUÍA AHORA
                </button>
              </div>
            </form>

            {/* Garantías de confianza */}
            <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs text-slate-400 font-medium pt-2 border-t border-slate-800 font-sans">
              <div className="flex items-center gap-1 font-sans">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-sans">Pago 100% seguro</span>
              </div>
              <span>•</span>
              <span className="font-sans font-medium">Acceso inmediato</span>
              <span>•</span>
              <span className="font-sans font-medium">Descarga digital</span>
            </div>
          </div>
        </div>

        {/* Bottom content: 3 Columns Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full font-sans text-center">

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
