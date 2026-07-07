import { ShieldCheck, Target, Users, Clock } from "lucide-react";

export default function TestimonialSection() {
  return (
    <>
      {/* Testimonial Section */}
      <div className="w-full px-4 md:px-12 lg:px-20 font-sans pt-6">
        <div className="bg-[#f0f7ff] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 w-full border border-blue-100/50 shadow-sm font-sans text-slate-800">
          {/* Avatar Column */}
          <div className="relative w-24 h-24 shrink-0 font-sans">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80"
              alt="Carlos M. - Visa F1 Aprobada"
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
            />
            {/* Colombia flag badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white flex items-center justify-center">
              <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
                {/* Yellow (top 50%) */}
                <rect width="3" height="1" fill="#fcd116" />
                {/* Blue (middle 25%) */}
                <rect width="3" height="0.5" y="1" fill="#003893" />
                {/* Red (bottom 25%) */}
                <rect width="3" height="0.5" y="1.5" fill="#ce1126" />
              </svg>
            </div>
          </div>

          {/* Quote Column */}
          <div className="flex-1 flex flex-col font-sans text-center md:text-left">
            <div className="relative font-sans">
              <span className="absolute -top-4 -left-3 text-[#3b82f6]/20 text-7xl font-serif leading-none select-none">“</span>
              <p className="italic text-base md:text-lg font-medium text-slate-700 leading-relaxed relative z-10 pl-2">
                Antes de leer la guía no sabía por dónde empezar. Gracias a Udreamms entendí cada paso del proceso y llegué mucho más preparado a mi entrevista.
              </p>
            </div>
            <div className="mt-4 font-sans pl-2">
              <span className="block font-bold text-slate-800 text-sm md:text-base">— Carlos M.</span>
              <span className="block text-xs md:text-sm font-semibold text-blue-600 mt-0.5">Visa F1 Aprobada – 2024</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
