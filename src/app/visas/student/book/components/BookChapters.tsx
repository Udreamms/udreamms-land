import { Map, CheckSquare, ShieldCheck } from "lucide-react";

export default function BookChapters() {
  return (
    <section className="w-full bg-black py-24 md:py-32 px-4 md:px-8 lg:px-12 font-sans relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col font-sans">

        {/* Section Header */}
        <div className="text-center md:text-left flex flex-col space-y-4 font-sans">
          <span className="text-sm font-bold tracking-wider text-blue-400 uppercase font-sans">
            CONTENIDO EXCLUSIVO
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
            Cuando obtengas este libro, esto es lo que encontrarás...
          </h2>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed font-sans w-full">
            Dentro del libro de <strong className="text-blue-400 font-bold">Udreamms</strong> te compartiremos links oficiales y el proceso paso a paso para ayudarte a obtener tu visa de estudiante.
          </p>

          <div className="w-20 h-[3px] bg-blue-600 rounded-full my-2" />

          <h3 className="text-xl md:text-2xl font-bold text-white font-sans pt-2">
            Aquí te compartimos algunos puntos de lo que encontrarás dentro de este libro:
          </h3>
        </div>

        {/* Chapter 1 Card */}
        <div className="w-full bg-slate-900/40 border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl mt-10 font-sans">
          <span className="text-blue-400 font-bold text-sm tracking-wider uppercase font-sans">
            Capítulo 1
          </span>
          <h4 className="text-2xl md:text-3xl font-extrabold text-white mt-2 font-sans">
            Los 5 primeros pasos para obtener tu visa de estudiante F1
          </h4>

          {/* Questions / Points */}
          <div className="mt-8 space-y-8 font-sans">

            {/* Point 1 */}
            <div className="flex flex-col font-sans">
              <div className="flex items-start gap-3 font-sans">
                <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 mt-2.5" />
                <h5 className="text-lg md:text-xl font-bold text-white font-sans">
                  ¿Cómo encontrar una institución acreditada para emitir una visa F1?
                </h5>
              </div>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed mt-2 pl-5 font-sans">
                El primer paso esencial para obtener tu visa de estudiante F1 es elegir una escuela autorizada por el gobierno de EE.UU. para emitir el Formulario I-20, el documento indispensable para iniciar tu solicitud de visa.
              </p>
            </div>

            {/* Point 2 */}
            <div className="flex flex-col font-sans">
              <div className="flex items-start gap-3 font-sans">
                <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-pink-500 mt-2.5" />
                <h5 className="text-lg md:text-xl font-bold text-pink-400 font-sans">
                  ¿Cómo aplicar correctamente a la escuela?
                </h5>
              </div>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed mt-2 pl-5 font-sans">
                Una vez que hayas elegido la escuela ideal para ti, es hora de aplicar. Este paso es crucial: un error mínimo puede retrasar todo tu proceso.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
