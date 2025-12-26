"use client";

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden relative">
      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      
      {/* Floating Geometric Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-glow/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            ROADMAP UDREAMMS 2025
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            El camino para cumplir tu sueño de estudiar y vivir en USA
          </p>
        </div>

        {/* Desktop Roadmap */}
        <div className="hidden md:block max-w-7xl mx-auto relative" style={{ height: '900px' }}>

          {/* Curved Path SVG - Main Ascending Diagonal */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            style={{ pointerEvents: 'none' }}
            viewBox="0 0 1200 900"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(348, 83%, 42%)" stopOpacity="0.6" />
                <stop offset="25%" stopColor="hsl(348, 100%, 58%)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(348, 83%, 42%)" stopOpacity="0.7" />
                <stop offset="75%" stopColor="hsl(348, 100%, 58%)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(348, 83%, 42%)" stopOpacity="0.9" />
              </linearGradient>
              <filter id="pathGlow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main diagonal ascending path with multiple curves */}
            <path
              d="M 150 800 
                 C 200 770, 250 750, 300 720
                 S 380 670, 450 640
                 C 520 600, 580 560, 650 520
                 S 740 460, 800 420
                 C 860 370, 920 320, 970 260
                 S 1040 180, 1080 120"
              fill="none"
              stroke="url(#pathGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#pathGlow)"
            />
            
            {/* Dotted overlay for tech effect */}
            <path
              d="M 150 800 
                 C 200 770, 250 750, 300 720
                 S 380 670, 450 640
                 C 520 600, 580 560, 650 520
                 S 740 460, 800 420
                 C 860 370, 920 320, 970 260
                 S 1040 180, 1080 120"
              fill="none"
              stroke="hsl(348, 100%, 58%)"
              strokeWidth="3"
              strokeDasharray="8,12"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Dotted Vertical Lines connecting to stages */}
            <line x1="150" y1="150" x2="150" y2="800" stroke="hsla(348, 83%, 42%, 0.2)" strokeWidth="2" strokeDasharray="5,10" />
            <line x1="350" y1="250" x2="350" y2="750" stroke="hsla(348, 83%, 42%, 0.2)" strokeWidth="2" strokeDasharray="5,10" />
            <line x1="550" y1="350" x2="550" y2="700" stroke="hsla(348, 83%, 42%, 0.2)" strokeWidth="2" strokeDasharray="5,10" />
            <line x1="750" y1="450" x2="750" y2="650" stroke="hsla(348, 83%, 42%, 0.2)" strokeWidth="2" strokeDasharray="5,10" />
            <line x1="950" y1="200" x2="950" y2="550" stroke="hsla(348, 83%, 42%, 0.2)" strokeWidth="2" strokeDasharray="5,10" />
          </svg>

          {/* Etapa 1 - Bottom Left (START) */}
          <div className="absolute z-20 animate-fade-in" style={{ left: '170px', top: '700px', width: '200px', animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-br from-primary via-primary-glow to-primary p-4 rounded-xl shadow-2xl border-2 border-primary/50 hover:scale-105 transition-all">
              <h4 className="text-white font-bold text-base mb-1">Etapa 1</h4>
              <p className="text-white/90 text-sm">Preparándote para tu gran aventura</p>
            </div>
            {/* Decorative Code Bars */}
            <div className="mt-3 space-y-1.5 pl-2">
              <div className="h-1.5 bg-yellow-400 rounded-full shadow-lg" style={{ width: '45%' }}></div>
              <div className="h-1.5 bg-green-400 rounded-full shadow-lg" style={{ width: '65%' }}></div>
              <div className="h-1.5 bg-blue-400 rounded-full shadow-lg" style={{ width: '55%' }}></div>
            </div>
          </div>

          {/* Etapa 2 */}
          <div className="absolute z-20 animate-fade-in" style={{ left: '370px', top: '590px', width: '200px', animationDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-primary via-primary-glow to-primary p-4 rounded-xl shadow-2xl border-2 border-primary/50 hover:scale-105 transition-all">
              <h4 className="text-white font-bold text-base mb-1">Etapa 2</h4>
              <p className="text-white/90 text-sm">Iniciando tu proceso migratorio</p>
            </div>
          </div>

          {/* Etapa 3 - Following diagonal path */}
          <div className="absolute z-20 animate-fade-in" style={{ left: '570px', top: '480px', width: '200px', animationDelay: '0.3s' }}>
            <div className="bg-gradient-to-br from-primary via-primary-glow to-primary p-4 rounded-xl shadow-2xl border-2 border-primary/50 hover:scale-105 transition-all">
              <h4 className="text-white font-bold text-base mb-1">Etapa 3</h4>
              <p className="text-white/90 text-sm">Organizando tu viaje a Estados Unidos</p>
            </div>
            {/* Decorative Code Bars */}
            <div className="mt-3 space-y-1.5 pl-2">
              <div className="h-1.5 bg-purple-400 rounded-full shadow-lg" style={{ width: '60%' }}></div>
              <div className="h-1.5 bg-pink-400 rounded-full shadow-lg" style={{ width: '50%' }}></div>
              <div className="h-1.5 bg-orange-400 rounded-full shadow-lg" style={{ width: '70%' }}></div>
            </div>
          </div>

          {/* Etapa 4 */}
          <div className="absolute z-20 animate-fade-in" style={{ left: '730px', top: '360px', width: '200px', animationDelay: '0.4s' }}>
            <div className="bg-gradient-to-br from-primary via-primary-glow to-primary p-4 rounded-xl shadow-2xl border-2 border-primary/50 hover:scale-105 transition-all">
              <h4 className="text-white font-bold text-base mb-1">Etapa 4</h4>
              <p className="text-white/90 text-sm">Tus primeros días en Estados Unidos</p>
            </div>
            {/* Decorative Code Bars */}
            <div className="mt-3 space-y-1.5 pl-2">
              <div className="h-1.5 bg-cyan-400 rounded-full shadow-lg" style={{ width: '55%' }}></div>
              <div className="h-1.5 bg-yellow-400 rounded-full shadow-lg" style={{ width: '45%' }}></div>
            </div>
          </div>

          {/* META FINAL - Following diagonal path - BIGGER */}
          <div className="absolute z-20 animate-fade-in" style={{ left: '900px', top: '100px', width: '280px', animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-br from-primary via-primary-glow to-primary p-6 rounded-2xl shadow-[0_20px_60px_-10px_hsl(348_83%_42%/0.8)] border-4 border-primary/60 text-center transform hover:scale-110 transition-all">
              <div className="text-6xl mb-3">🎯</div>
              <h3 className="text-white font-bold text-2xl mb-2">META FINAL</h3>
              <p className="text-white font-bold text-lg">Estudiar y Vivir en USA</p>
            </div>
          </div>

          {/* Start Indicator - Centered Bottom */}
          <div className="absolute z-20 left-1/2 -translate-x-1/2" style={{ bottom: '30px' }}>
            <button
              onClick={() => document.getElementById('stage-details')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-glow rounded-full text-white font-bold text-xl shadow-[0_0_30px_hsl(348_83%_42%/0.8)] animate-pulse border-2 border-primary/50 hover:scale-105 transition-all cursor-pointer"
            >
              <span>COMIENZA AQUÍ</span>
            </button>
          </div>
        </div>

        {/* Mobile Version */}
        <div className="block md:hidden space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-glow rounded-full text-white font-bold shadow-lg">
              <span>👇 Tu camino paso a paso</span>
            </div>
          </div>

          {[
            { num: '01', title: 'Etapa 1: ¡Aun no califico!', desc: 'Preparándote para tu gran aventura' },
            { num: '02', title: 'Etapa 2: ¡Tengo todo para comenzar!', desc: 'Iniciando tu proceso migratorio' },
            { num: '03', title: 'Etapa 3: Visa Aprobada', desc: 'Organizando tu viaje a Estados Unidos' },
            { num: '04', title: 'Etapa 4: ¡Llegamos a USA!', desc: 'Tus primeros días en Estados Unidos' },
          ].map((step, idx) => (
            <div key={idx} className="bg-gradient-to-r from-primary to-primary-glow p-6 rounded-2xl shadow-xl animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <span className="text-2xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-white/90">{step.desc}</p>
            </div>
          ))}

          {/* META FINAL - Mobile Version - Destacado */}
          <div className="bg-gradient-to-r from-primary to-primary-glow p-10 rounded-3xl text-center shadow-2xl border-4 border-primary/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-7xl mb-4">🎯</div>
            <h3 className="text-4xl font-bold text-white mb-3">
              META FINAL
            </h3>
            <p className="text-2xl text-white font-bold">
              Estudiar y Vivir en USA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
