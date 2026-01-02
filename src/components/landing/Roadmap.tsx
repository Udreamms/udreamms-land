"use client";

import { 
  Plane, 
  FileCheck, 
  GraduationCap, 
  MapPin, 
  ChevronRight, 
  Home,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const steps = [
  {
    id: 1,
    title: "Preparación",
    subtitle: "El inicio del sueño",
    icon: FileCheck,
    description: "Evaluamos tu perfil, seleccionamos el programa ideal y preparamos tu documentación.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    id: 2,
    title: "Aplicación",
    subtitle: "Trámite Migratorio",
    icon: GraduationCap,
    description: "Gestionamos tu admisión escolar y te preparamos para la entrevista consular.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20"
  },
  {
    id: 3,
    title: "Logística",
    subtitle: "Todo listo para viajar",
    icon: Plane,
    description: "Boletos de avión, seguro médico internacional y coordinación de tu llegada.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20"
  },
  {
    id: 4,
    title: "Aterrizaje",
    subtitle: "Adaptación en USA",
    icon: Home,
    description: "Te recibimos, te ayudamos con tu celular, cuenta bancaria y vivienda.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  }
];

// Componente de Confeti CSS Simple - Corregido para evitar errores de hidratación
const Confetti = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['#ff0', '#f00', '#0f0', '#00f'];
    const newPieces = [...Array(20)].map((_, i) => ({
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: piece.left,
            top: `-10%`,
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

  return (
    <section id="roadmap" className="py-32 bg-black relative overflow-hidden w-full min-h-[1200px]">
      
      {/* Fondo estelar sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black opacity-50"></div>
      
      <div className="w-full px-4 md:px-10 relative z-10 h-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block py-1 px-4 rounded-full bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase text-xs mb-6"
          >
            Tu Viaje comienza aquí
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tighter"
          >
            ROADMAP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">2026</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            El camino para cumplir tu sueño de estudiar y vivir en USA
          </motion.p>
        </div>

        {/* --- LINEA DE TIEMPO SVG ANIMADA (Desktop) --- */}
        {/* La altura del contenedor SVG (h-[1000px]) debe coincidir con la lógica del viewBox */}
        <div className="relative w-full mx-auto hidden lg:block h-[1000px]">
          
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1400 1000">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            
            {/* LÓGICA DEL CAMINO (ESCALERA SUAVE):
               Start: 10% ancho (140), 85% alto (850) -> Etapa 1
               Mid1:  30% ancho (420), 65% alto (650) -> Etapa 2
               Mid2:  50% ancho (700), 45% alto (450) -> Etapa 3
               Mid3:  70% ancho (980), 25% alto (250) -> Etapa 4
               End:   85% ancho (1190), 5% alto (50) -> Meta (Subida 5% = 50px aprox)
            */}
            
            {/* Camino Base (Gris oscuro punteado) */}
            <path 
              d="M 140 850 C 280 850, 280 650, 420 650 C 560 650, 560 450, 700 450 C 840 450, 840 250, 980 250 C 1085 250, 1085 50, 1190 50" 
              fill="none" 
              stroke="#333" 
              strokeWidth="4" 
              strokeDasharray="12 12"
            />
            {/* Camino Animado (Gradiente) */}
            <path 
              d="M 140 850 C 280 850, 280 650, 420 650 C 560 650, 560 450, 700 450 C 840 450, 840 250, 980 250 C 1085 250, 1085 50, 1190 50" 
              fill="none" 
              stroke="url(#lineGradient)" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="12 12"
              className="animate-dash"
            />
          </svg>

          {/* --- PASOS POSICIONADOS SOBRE LA LÍNEA --- */}
          {/* Nota: Usamos 'translate-y' negativo para centrar el icono sobre el punto de la línea */}
          
          {/* Paso 1: 10% Left, 85% Top */}
          <div className="absolute left-[10%] top-[85%] -translate-y-1/2 -translate-x-1/2 w-64 z-10" onMouseEnter={() => setActiveStep(1)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[0]} isActive={activeStep === 1} position="top" />
          </div>

          {/* Paso 2: 30% Left, 65% Top */}
          <div className="absolute left-[30%] top-[65%] -translate-y-1/2 -translate-x-1/2 w-64 z-10" onMouseEnter={() => setActiveStep(2)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[1]} isActive={activeStep === 2} position="bottom" />
          </div>

          {/* Paso 3: 50% Left, 45% Top */}
          <div className="absolute left-[50%] top-[45%] -translate-y-1/2 -translate-x-1/2 w-64 z-10" onMouseEnter={() => setActiveStep(3)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[2]} isActive={activeStep === 3} position="top" />
          </div>

           {/* Paso 4: 70% Left, 25% Top */}
           <div className="absolute left-[70%] top-[25%] -translate-y-1/2 -translate-x-1/2 w-64 z-10" onMouseEnter={() => setActiveStep(4)} onMouseLeave={() => setActiveStep(null)}>
             <StepCard step={steps[3]} isActive={activeStep === 4} position="bottom" />
          </div>

          {/* META FINAL: 85% Left, 5% Top */}
          {/* Corrección aplicada aquí: top-[5%] (subido desde 10%) */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="absolute left-[85%] top-[5%] -translate-y-1/2 -translate-x-1/2 z-20"
          >
             <div className="relative group cursor-pointer">
                {/* Aura Brillante */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-white to-blue-600 rounded-full blur-[60px] opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                
                <div className="relative w-40 h-40 rounded-full bg-black border-4 border-double border-transparent bg-clip-padding flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.2)] group-hover:scale-110 transition-transform duration-500">
                   {/* Bordes USA */}
                   <div className="absolute inset-0 rounded-full border-4 border-blue-600 opacity-50"></div>
                   <div className="absolute inset-[-4px] rounded-full border-2 border-red-600 opacity-50"></div>
                   
                   <Confetti />
                   <div className="text-center z-10">
                      <div className="flex justify-center mb-1">
                        <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-bounce drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                      </div>
                      <div className="flex justify-center gap-1 mb-2">
                        <div className="w-3 h-1.5 bg-red-600"></div>
                        <div className="w-3 h-1.5 bg-white"></div>
                        <div className="w-3 h-1.5 bg-blue-600"></div>
                      </div>
                      <span className="block text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-0.5">Meta</span>
                      <span className="block text-white font-black text-lg leading-none">VIVIR<br/>EN USA</span>
                   </div>
                </div>
             </div>
          </motion.div>

        </div>

        {/* --- VERSION MOVIL (Sin cambios, ya funcionaba bien verticalmente) --- */}
        <div className="lg:hidden relative pl-8 space-y-12 max-w-3xl mx-auto pb-20">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30"></div>
            
            {steps.map((step, index) => (
               <div key={index} className="relative">
                  <div className={`absolute -left-[2.25rem] w-4 h-4 rounded-full border-2 border-black ${step.bg.replace('/10', '')}`}></div>
                  <StepCardMobile step={step} />
               </div>
            ))}

            <div className="relative pt-8">
               <div className="w-full bg-gradient-to-r from-blue-900/20 via-white/5 to-red-900/20 border border-blue-500/30 p-6 rounded-2xl text-center relative overflow-hidden">
                  <Confetti />
                  <Star className="w-10 h-10 text-yellow-400 mx-auto mb-2 fill-yellow-400" />
                  <h3 className="text-2xl font-black text-white mb-1">¡META CUMPLIDA!</h3>
                  <p className="text-blue-200/80 text-sm">Bienvenido a tu nueva vida en Estados Unidos</p>
               </div>
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

// Componente de Tarjeta Desktop (Ligeramente ajustado para no tapar la línea)
const StepCard = ({ step, isActive, position }: { step: any, isActive: boolean, position: 'top' | 'bottom' }) => {
   return (
      <div className={`
         relative flex flex-col items-center text-center transition-all duration-500 group
         ${isActive ? 'scale-110 z-30' : 'scale-100 z-10 opacity-80 hover:opacity-100'}
      `}>
         {/* Icono con efecto Glassmorphism fuerte para que la línea se vea "detrás" pero borrosa */}
         <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center mb-4 
            shadow-[0_0_30px_rgba(0,0,0,0.8)] 
            border border-white/10 
            bg-black/40 backdrop-blur-xl
            ${step.color}
            ${isActive ? 'ring-2 ring-white/20 bg-black/80' : ''}
            transition-all duration-300
         `}>
            <step.icon className="w-10 h-10 drop-shadow-lg" />
         </div>

         <div className={`
            absolute left-1/2 -translate-x-1/2 w-72 pointer-events-none
            ${position === 'top' ? 'bottom-full pb-6' : 'top-full pt-6'}
         `}>
            <div className={`
                bg-[#0a0a0a] border border-white/10 p-4 rounded-xl shadow-2xl
                transition-all duration-300
                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}>
                <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{step.subtitle}</p>
                <p className="text-sm text-gray-400 leading-snug">{step.description}</p>
            </div>
         </div>
         
         {/* Título flotante siempre visible cuando no está activo */}
         <div className={`
            absolute ${position === 'top' ? '-top-10' : '-bottom-10'} 
            text-sm font-bold text-gray-500 tracking-widest uppercase
            transition-opacity duration-300
            ${isActive ? 'opacity-0' : 'opacity-100'}
         `}>
            {step.title}
         </div>
      </div>
   );
};

const StepCardMobile = ({ step }: { step: any }) => {
   return (
      <div className="bg-[#111] border border-white/5 p-6 rounded-2xl">
         <div className="flex items-center gap-4 mb-3">
            <div className={`p-2 rounded-lg ${step.bg} ${step.color}`}>
               <step.icon className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-white">{step.title}</h3>
               <p className="text-xs text-gray-500 uppercase font-bold">{step.subtitle}</p>
            </div>
         </div>
         <p className="text-sm text-gray-400">{step.description}</p>
      </div>
   );
};