"use client";

import { 
  Plane, 
  FileCheck, 
  GraduationCap, 
  Home,
  Target,
  ChevronRight,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "Fase 1",
    subtitle: "Preparándote para tu gran aventura",
    icon: FileCheck,
    description: "Evaluamos tu perfil, seleccionamos el programa ideal y preparamos tu documentación.",
    color: "text-white",
    bg: "bg-[#D31245]", 
    border: "border-red-500/20",
    lines: "bg-blue-400"
  },
  {
    id: 2,
    title: "Fase 2",
    subtitle: "Iniciando tu proceso migratorio",
    icon: GraduationCap,
    description: "Gestionamos tu admisión escolar y te preparamos para la entrevista consular.",
    color: "text-white",
    bg: "bg-[#D31245]",
    border: "border-red-500/20",
    lines: "bg-purple-400"
  },
  {
    id: 3,
    title: "Fase 3",
    subtitle: "Organizando tu viaje a Estados Unidos",
    icon: Plane,
    description: "Boletos de avión, seguro médico internacional y coordinación de tu llegada.",
    color: "text-white",
    bg: "bg-[#D31245]",
    border: "border-red-500/20",
    lines: "bg-orange-400"
  },
  {
    id: 4,
    title: "Fase 4",
    subtitle: "Tus primeros días en Estados Unidos",
    icon: Home,
    description: "Te recibimos, te ayudamos con tu celular, cuenta bancaria y vivienda.",
    color: "text-white",
    bg: "bg-[#D31245]",
    border: "border-red-500/20",
    lines: "bg-emerald-400"
  }
];

const Confetti = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['#ff0', '#f00', '#0f0', '#00f'];
    const newPieces = [...Array(30)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${2 + Math.random() * 3}s`
    }));
    setPieces(newPieces);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="absolute -top-20 left-0 right-0 h-40 overflow-visible pointer-events-none">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: piece.left,
            top: `50%`,
            backgroundColor: piece.backgroundColor,
            animationDelay: piece.animationDelay,
            animationDuration: piece.animationDuration
          }}
        />
      ))}
    </div>
  );
};

export default function Roadmap() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleStartHere = () => {
    document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="roadmap" className="py-32 bg-black relative overflow-hidden w-full min-h-[600px]">
      
      {/* Fondo estelar sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black opacity-50"></div>
      
      {/* Contenedor con márgenes */}
      <div className="w-full px-4 lg:px-12 relative z-10 h-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-blue-400 font-bold tracking-widest uppercase text-xs mb-6"
          >
            Tu Viaje comienza aquí
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-normal mb-6 text-white tracking-tighter"
          >
            ROADMAP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">2026</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-4"
          >
            El camino para cumplir tu sueño de estudiar y vivir en USA
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white text-base font-medium max-w-2xl mx-auto"
          >
            Tú puedes estar en una de estas fases y puedes empezar en cualquiera de ellas.
          </motion.p>
        </div>

        {/* --- LINEA DE TIEMPO SVG ANIMADA (Desktop) --- */}
        <div className="relative w-full mx-auto hidden lg:block h-[600px]">
          
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            
            {/* Camino Base */}
            <path 
              d="M 100 900 C 200 900, 200 700, 300 700 C 400 700, 400 500, 500 500 C 600 500, 600 300, 700 300 C 800 300, 800 100, 900 100" 
              fill="none" 
              stroke="#333" 
              strokeWidth="4" 
              strokeDasharray="12 12"
            />
            {/* Camino Animado */}
            <path 
              d="M 100 900 C 200 900, 200 700, 300 700 C 400 700, 400 500, 500 500 C 600 500, 600 300, 700 300 C 800 300, 800 100, 900 100" 
              fill="none" 
              stroke="url(#lineGradient)" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="12 12"
              className="animate-dash"
            />
          </svg>

          {/* --- PASOS --- */}
          
          {/* Fase 1 */}
          <div className="absolute left-[10%] top-[90%] -translate-y-1/2 -translate-x-1/2 w-72 z-10" onMouseEnter={() => setActiveStep(1)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[0]} isActive={activeStep === 1} onStart={handleStartHere} />
          </div>

          {/* Fase 2 */}
          <div className="absolute left-[30%] top-[70%] -translate-y-1/2 -translate-x-1/2 w-72 z-10" onMouseEnter={() => setActiveStep(2)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[1]} isActive={activeStep === 2} onStart={handleStartHere} />
          </div>

          {/* Fase 3 */}
          <div className="absolute left-[50%] top-[50%] -translate-y-1/2 -translate-x-1/2 w-72 z-10" onMouseEnter={() => setActiveStep(3)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[2]} isActive={activeStep === 3} onStart={handleStartHere} />
          </div>

           {/* Fase 4 */}
           <div className="absolute left-[70%] top-[30%] -translate-y-1/2 -translate-x-1/2 w-72 z-10" onMouseEnter={() => setActiveStep(4)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[3]} isActive={activeStep === 4} onStart={handleStartHere} />
          </div>

          {/* FASE 5 */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="absolute left-[90%] top-[10%] -translate-y-1/2 -translate-x-1/2 z-20 w-72"
            onMouseEnter={() => setActiveStep(5)} 
            onMouseLeave={() => setActiveStep(null)}
          >
             <div className="relative group cursor-pointer flex flex-col items-center">
                 
                 {/* Serpentinas Encima */}
                 <Confetti />

                 {/* Video posicionado de forma absoluta para no empujar el texto hacia abajo */}
                 <div className="absolute bottom-full mb-4 w-36 h-24 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(155,77,202,0.4)] border border-white/20 transition-transform duration-300 group-hover:scale-105">
                     <video 
                        src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F5.mp4?alt=media&token=86eaddf6-c81d-477f-89b5-a8b2231d48dd"
                        autoPlay muted loop playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                     />
                 </div>
                 
                 {/* Texto Limpio Estilo Fases */}
                 <div className={`
                    relative transition-all duration-300 transform
                    ${activeStep === 5 ? 'scale-105 z-30 opacity-100' : 'scale-100 z-10 opacity-70 hover:opacity-100 hover:scale-105'}
                 `}>
                     <h4 className="text-white font-bold text-lg mb-1 drop-shadow-lg">Fase 5 | USA</h4>
                     <p className="text-gray-300 text-xs font-medium leading-relaxed drop-shadow-md ml-auto">
                        Estudiar y Vivir en USA
                     </p>
                 </div>

                 {/* Líneas decorativas debajo (Azul y Rojo) */}
                 <div className="mt-2 flex flex-col gap-1.5 items-center">
                    <div className="h-1 w-16 rounded-full bg-blue-500 shadow-lg" />
                    <div className="h-1 w-24 rounded-full bg-red-600 opacity-80" />
                    <div className="h-1 w-12 rounded-full bg-blue-400 opacity-60" />
                 </div>

                 {/* Botón flotante "Inicia Aquí" */}
                 <div className={`
                    absolute -bottom-12 left-1/2 -translate-x-1/2
                    transition-all duration-300 pointer-events-auto z-40
                    ${activeStep === 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                 `}>
                    <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartHere();
                        }}
                        className="group flex items-center gap-2 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-full px-4 py-1.5 active:scale-95 transition-all"
                    >
                        <span className="text-xs font-bold">Inicia Aquí</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                    </button>
                 </div>

             </div>
          </motion.div>

          {/* CTA Footer integrado en Roadmap Desktop */}
          <div className="absolute bottom-4 right-12 z-20 flex flex-col items-end text-right">
             <h3 className="text-xl font-medium text-white mb-1">¿Ya identificaste tu fase?</h3>
             <p className="text-xs text-gray-400 mb-3 max-w-sm">Nuestros expertos están listos para impulsarte al siguiente nivel sin importar dónde empieces.</p>
             <Button
               className="rounded-full px-5 py-2 bg-white text-black hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] font-bold text-xs transition-all hover:-translate-y-0.5 active:scale-95"
               onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
             >
               Comienza Ahora
               <ChevronRight className="w-4 h-4 ml-1" />
             </Button>
          </div>

        </div>

        {/* --- VERSION MOVIL --- */}
        <div className="lg:hidden relative pl-8 space-y-12 max-w-3xl mx-auto pb-20">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>
            
            {steps.map((step, index) => (
               <div key={index} className="relative">
                  <div className={`absolute -left-[2.25rem] w-4 h-4 rounded-full border-2 border-black ${step.lines}`}></div>
                  <StepCardMobile step={step} onStart={handleStartHere} />
               </div>
            ))}
            
            {/* Fase 5 Movil */}
            <div className="relative">
               <div className="absolute -left-[2.25rem] w-4 h-4 rounded-full border-2 border-black bg-red-500"></div>
               <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <Confetti />

                      {/* Video */}
                      <div className="w-full aspect-video mb-4 rounded-xl overflow-hidden border border-white/20 shadow-lg">
                         <video 
                            src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/New%20version%2F5.mp4?alt=media&token=86eaddf6-c81d-477f-89b5-a8b2231d48dd"
                            autoPlay muted loop playsInline
                            className="w-full h-full object-cover"
                         />
                      </div>

                      <h3 className="text-lg font-bold text-[#D31245] mb-1">Fase 5 | USA</h3>
                      <p className="text-white font-bold mb-2">Estudiar y Vivir en USA</p>
                      
                      <Button 
                         onClick={handleStartHere}
                         size="sm"
                         className="bg-white/10 hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] text-white border border-white/10 rounded-full w-full justify-between transition-colors"
                      >
                         Inicia Aquí <ChevronRight className="w-4 h-4" />
                      </Button>
                   </div>
               </div>
            </div>

            {/* CTA Footer integrado en Roadmap Mobile */}
            <div className="mt-8 text-center bg-white/5 p-6 rounded-2xl border border-white/10">
               <h3 className="text-lg font-medium text-white mb-2">¿Ya identificaste tu fase?</h3>
               <p className="text-xs text-gray-400 mb-4">Nuestros expertos están listos para impulsarte al siguiente nivel sin importar dónde empieces.</p>
               <Button
                 className="rounded-full px-6 py-2.5 w-full bg-white text-black hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] font-bold text-sm transition-all active:scale-95"
                 onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
               >
                 Comienza Ahora
                 <ChevronRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        .animate-dash {
          animation: dash 40s linear infinite;
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </section>
  );
}

const StepCard = ({ step, isActive, onStart }: { step: any, isActive: boolean, onStart: () => void }) => {
   return (
      <div className="relative group cursor-pointer pl-4">
         {/* Texto Limpio Sin Tarjeta */}
         <div className={`
            relative text-left transition-all duration-300 transform
            ${isActive ? 'scale-105 z-30 opacity-100' : 'scale-100 z-10 opacity-70 hover:opacity-100 hover:scale-105'}
         `}>
            {/* Stage Title */}
            <h4 className="text-white font-bold text-lg mb-1 drop-shadow-lg">{step.title}</h4>
            <p className="text-gray-300 text-xs font-medium max-w-[200px] leading-relaxed drop-shadow-md">{step.subtitle}</p>
         </div>

         {/* Líneas decorativas debajo */}
         <div className="mt-2 flex flex-col gap-1.5">
            <div className={`h-1 w-16 rounded-full ${step.lines} shadow-lg`} />
            <div className={`h-1 w-24 rounded-full ${step.lines} opacity-60`} />
            <div className={`h-1 w-12 rounded-full ${step.lines} opacity-40`} />
         </div>

         {/* Botón flotante "Inicia Aquí" */}
         <div className={`
            absolute -bottom-12 left-0
            transition-all duration-300 pointer-events-auto z-40
            ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
         `}>
            <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onStart();
                }}
                className="group flex items-center gap-2 bg-transparent border border-white/20 hover:border-white/50 text-white rounded-full px-4 py-1.5 active:scale-95 transition-all"
            >
                <span className="text-xs font-bold">Inicia Aquí</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
            </button>
         </div>
      </div>
   );
};

const StepCardMobile = ({ step, onStart }: { step: any, onStart: () => void }) => {
   return (
      <div className="bg-[#1a1a1a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
         <div className="relative z-10">
            <h3 className="text-lg font-bold text-[#D31245] mb-1">{step.title}</h3>
            <p className="text-white font-bold mb-2">{step.subtitle}</p>
            <p className="text-sm text-gray-400 mb-4">{step.description}</p>
            
            <Button 
               onClick={onStart}
               size="sm"
               className="bg-white/10 hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] text-white border border-white/10 rounded-full w-full justify-between transition-colors"
            >
               Inicia Aquí <ChevronRight className="w-4 h-4" />
            </Button>
         </div>
      </div>
   );
};