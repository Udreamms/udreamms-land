import { Map, CheckSquare, ShieldCheck, Rocket, Plane } from "lucide-react";

export default function GuideFeatureInfo() {
  return (
    <section className="w-full bg-black py-24 md:py-32 px-4 md:px-8 lg:px-12 font-sans">
      {/* SVG Gradient Definition */}
      <svg className="w-0 h-0 absolute" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="purple-pink-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full px-4 md:px-16 lg:px-[190px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center font-sans">

        {/* Left Column: Info & Bullets */}
        <div className="lg:col-span-7 flex flex-col space-y-6 font-sans">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-xl">
            ¿Y si existiera una guía <br /> que te mostrara exactamente cómo obtener tu visa F1?
          </h2>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl">
            En <strong className="font-extrabold bg-gradient-to-r from-[#c084fc] to-[#f472b6] bg-clip-text text-transparent">Udreamms</strong> transformamos procesos complejos en pasos simples y claros para que cumplas tu sueño de estudiar en Estados Unidos.
          </p>

          {/* Bullet list with icons */}
          <div className="space-y-6 pt-2 max-w-xl">
            {/* Bullet 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <Map className="w-6 h-6" stroke="url(#purple-pink-gradient)" />
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-normal pt-1">
                Hemos acompañado a cientos de estudiantes <strong className="font-bold text-white">en cada etapa de su proceso</strong>.
              </p>
            </div>

            {/* Bullet 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <CheckSquare className="w-6 h-6" stroke="url(#purple-pink-gradient)" />
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-normal pt-1">
                Conocemos los errores más comunes que pueden <strong className="font-bold text-white">poner en riesgo tu visa</strong>.
              </p>
            </div>

            {/* Bullet 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" stroke="url(#purple-pink-gradient)" />
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-normal pt-1">
                Te damos las herramientas, estrategias y ejemplos <strong className="font-bold text-white">que realmente funcionan</strong>.
              </p>
            </div>

            {/* Bullet 4 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <Rocket className="w-6 h-6" stroke="url(#purple-pink-gradient)" />
              </div>
              <p className="text-sm md:text-base text-slate-300 leading-normal pt-1">
                Nuestro objetivo es ayudarte a <strong className="font-bold text-white">avanzar con confianza, seguridad y sin perder tiempo ni dinero</strong>.
              </p>
            </div>
          </div>

          {/* Quote box at bottom */}
          <div className="bg-white/5 rounded-2xl p-4 flex gap-3.5 items-start border border-white/10 mt-4 max-w-xl">
            <span className="bg-gradient-to-r from-[#c084fc] to-[#f472b6] bg-clip-text text-transparent text-4xl font-serif leading-none select-none -mt-1">“</span>
            <p className="font-semibold text-slate-200 text-sm md:text-base leading-relaxed">
              No se trata de suerte. Se trata de estar preparado con la información correcta.
            </p>
          </div>
        </div>

        {/* Right Column: Visual Card */}
        <div className="lg:col-span-5 w-full font-sans">
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col bg-slate-900 font-sans">
            {/* Photo representation */}
            <div className="w-full aspect-square relative">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80"
                alt="Estudiante en camino a estudiar en Estados Unidos"
                className="w-full h-full object-cover"
              />

              {/* Overlay Text on top of the image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 mt-1">
                    <Plane className="w-5 h-5 text-white -rotate-45" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base md:text-lg lg:text-xl font-bold leading-snug text-white">
                      Con la guía correcta, tu sueño está más cerca de lo que crees.
                    </h3>
                    <p className="text-xs md:text-sm text-slate-200 mt-2 font-medium leading-relaxed">
                      Esta guía fue creada para acompañarte paso a paso en tu camino hacia estudiar en Estados Unidos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
