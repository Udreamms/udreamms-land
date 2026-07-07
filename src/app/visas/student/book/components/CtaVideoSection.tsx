export default function CtaVideoSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-16 px-4 md:px-8 lg:px-12 font-sans border-b border-slate-100 flex flex-col items-center justify-center text-center">
      <div className="w-full px-4 md:px-16 lg:px-[190px] flex flex-col items-center justify-center font-sans">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-800 leading-snug font-sans w-full">
          Udreamms ha ayudado a cientos de estudiantes a iniciar con éxito su camino para estudiar en Estados Unidos
        </h2>
        <h3 className="text-3xl md:text-5xl font-extrabold text-[#0f2d59] tracking-tight leading-tight mt-6 font-sans w-full">
          ¿Estás listo para iniciar tu proceso?
        </h3>

        {/* Centered Video */}
        <div className="w-full mt-10">
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-950">
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
        </div>

        {/* Post-video message */}
        <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed w-full mt-10 font-sans mx-auto">
          Sabemos que hay mucha confusión cuando se trata de estudiar en Estados Unidos. Por eso, en lugar de promesas, te mostramos casos reales de estudiantes que ya empezaron su camino.
        </p>
      </div>
    </section>
  );
}
