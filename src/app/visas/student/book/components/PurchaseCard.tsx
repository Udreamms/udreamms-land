import { User, Mail, Lock } from "lucide-react";

interface PurchaseCardProps {
  formData: {
    nombre: string;
    apellido: string;
    email: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    nombre: string;
    apellido: string;
    email: string;
  }>>;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function PurchaseCard({ formData, setFormData, handleSubmit }: PurchaseCardProps) {
  return (
    <div className="w-full px-4 md:px-12 lg:px-20 font-sans" id="buy-now">
      <div className="bg-black rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-10 w-full font-sans text-white">

        {/* Top Grid: Book Cover & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center font-sans">

          {/* Bloque Izquierdo: Libro */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center font-sans mx-auto w-full">
            {/* Portada Libro */}
            <div className="relative w-28 md:w-36 aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 shadow-lg shrink-0">
              <img
                src="/book-udreamms.jpeg"
                alt="Libro Digital Udreamms - Paso a paso para tu visa"
                className="w-full h-full object-cover scale-110 origin-center"
              />
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
      </div>
    </div>
  );
}
