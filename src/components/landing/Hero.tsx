"use client";

interface HeroProps {
  onStartQuote: () => void;
}

export default function Hero({ onStartQuote }: HeroProps) {
  const heroImage = "/assets/hero-statue-liberty.jpg";

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40" />
      </div>
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              ¿Listo para <span className="text-primary drop-shadow-lg">cambiar</span> tu futuro?
            </h1>
            <p className="text-xl md:text-2xl mb-6 leading-relaxed max-w-3xl mx-auto text-white drop-shadow-md">
              Hacemos que el proceso de estudiar y vivir en Estados Unidos sea más fácil
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={onStartQuote}
                className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-primary-foreground overflow-hidden rounded-lg shadow-[var(--shadow-elevated)] transition-all hover:shadow-[var(--shadow-glow)] hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow" />
                <span className="relative">Obtén tu Cotización</span>
              </button>
              <button
                onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold bg-white/10 backdrop-blur text-white rounded-lg border-2 border-white/30 hover:border-white hover:bg-white/20 transition-all hover:scale-105"
              >
                Ver Roadmap
              </button>
            </div>
          </div>

          {/* Quick Links - Compact Grid */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-16">
            <button
              onClick={() => document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 backdrop-blur p-5 rounded-lg shadow-lg border border-white/20 hover:border-white/50 transition-all group text-left cursor-pointer"
            >
              <h3 className="text-lg font-bold mb-1 text-white group-hover:text-primary transition-colors">
                ¿En qué etapa te encuentras?
              </h3>
              <p className="text-sm text-white/80 mb-3">
                Descubre tu camino hacia Estados Unidos
              </p>
              <span className="text-primary font-semibold">Ver Roadmap →</span>
            </button>
            
            <a 
              href="/brochures"
              className="bg-white/10 backdrop-blur p-5 rounded-lg shadow-lg border border-white/20 hover:border-white/50 transition-all group cursor-pointer"
            >
              <h3 className="text-lg font-bold mb-1 text-white group-hover:text-primary transition-colors">
                Descarga Nuestra Guia
              </h3>
              <p className="text-sm text-white/80 mb-3">
                Todo lo que necesitas saber sobre estudiar en USA
              </p>
              <span className="text-primary font-semibold">Gratis →</span>
            </a>
            
            <a 
              href="/destinos"
              className="bg-white/10 backdrop-blur p-5 rounded-lg shadow-lg border border-white/20 hover:border-white/50 transition-all group cursor-pointer"
            >
              <h3 className="text-lg font-bold mb-1 text-white group-hover:text-primary transition-colors">
                Escuelas Aliadas
              </h3>
              <p className="text-sm text-white/80 mb-3">
                Trabajamos con las mejores instituciones
              </p>
              <span className="text-primary font-semibold">Ver mas →</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
