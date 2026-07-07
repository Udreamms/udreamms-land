import { ShieldCheck, Target, Users, Clock } from "lucide-react";

export default function BookVideoSection() {
  return (
    <section className="w-full bg-[#050507] pb-16 md:pb-24 pt-4 md:pt-6 px-4 md:px-8 lg:px-12 font-sans border-t border-white/5 flex flex-col items-center justify-center -mt-10 md:-mt-16 relative z-30">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center gap-10">
        {/* Contenedor de Video */}
        <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950">
          {/* Elemento de Video (YouTube Embed) */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Barra Horizontal de Beneficios */}
        <div className="w-full bg-black border border-white/10 rounded-2xl py-6 px-8 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {/* Item 1 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <ShieldCheck className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Información clara y actualizada
              </p>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <Target className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Estrategias que realmente funcionan
              </p>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <Users className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Creado por expertos en procesos F1
              </p>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-3 text-left w-full max-w-[240px]">
              <Clock className="w-8 h-8 text-white shrink-0" />
              <p className="text-white text-xs md:text-sm font-medium leading-tight">
                Acceso inmediato desde cualquier lugar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
