import { Star, Volume2 } from "lucide-react";

export default function BookHero() {
  return (
    <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden font-sans bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        >
          <source
            src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/hero-book.mp4?alt=media&token=96cc9cab-3486-4934-93d5-52d2a1921572"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/70 z-10" />
        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050507] to-transparent z-10" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center text-center space-y-8 w-full max-w-6xl mx-auto px-4 pt-28 pb-16 md:pt-40 md:pb-24">
        {/* Título Principal */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white leading-[1.08] max-w-5xl">
          Obten la guia completa para obtener tu visa de estudiante y estudiar en Estados Unidos paso a paso
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-2xl font-medium tracking-tight bg-gradient-to-r from-[#c084fc] to-[#f472b6] bg-clip-text text-transparent leading-snug pt-2 max-w-4xl">
          Sin cometer errores que pueden retrasar o poner en riesgo tu proceso
        </p>

        {/* Calificaciones / Rating */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-2">
          {/* Logo Brand */}
          <span className="text-white font-bold text-lg tracking-wide uppercase">
            Udreamms
          </span>

          <span className="hidden sm:inline text-slate-600">|</span>

          {/* Stars */}
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-sm mr-1">5.0</span>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-slate-400 text-xs ml-1">(178)</span>
          </div>

          <span className="hidden sm:inline text-slate-600">|</span>

          {/* Alumnos Asesorados */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Volume2 className="w-3 h-3 text-purple-400" />
            </div>
            <span className="text-slate-300 text-xs font-semibold">
              Mas de 500 estudiantes asesorados
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

