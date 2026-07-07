export default function CtaVideoSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-24 md:py-32 px-4 md:px-8 lg:px-12 font-sans border-b border-slate-100 flex flex-col items-center justify-center text-center">
      <div className="w-full px-4 md:px-16 lg:px-[190px] flex flex-col items-center justify-center font-sans">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-800 leading-snug font-sans w-full max-w-3xl mx-auto">
          Udreamms ha ayudado a cientos de estudiantes <br className="hidden md:inline" /> a iniciar con éxito su camino <br className="hidden md:inline" /> para estudiar en Estados Unidos
        </h2>

        {/* Centered Video */}
        <div className="w-full max-w-4xl mx-auto mt-10">
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-950">
            <div className="relative aspect-video w-full bg-black">
              <video
                src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/3959713-uhd_4096_2160_25fps.mp4?alt=media&token=9f4a5d7e-23f5-40de-bf4c-fa847829a630"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Bottom text overlay on top of video */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6 md:p-8 flex items-center justify-center text-center z-10 pointer-events-none">
                <h3 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-xl">
                  ¿Estás listo <br className="hidden md:inline" /> para iniciar tu proceso?
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Post-video message */}
        <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed w-full max-w-2xl mt-10 font-sans mx-auto text-center">
          Sabemos que hay mucha confusión cuando se trata de estudiar en Estados Unidos. Por eso, en lugar de promesas, te mostramos casos reales de estudiantes que ya empezaron su camino.
        </p>
      </div>
    </section>
  );
}
