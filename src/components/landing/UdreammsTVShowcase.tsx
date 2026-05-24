"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function UdreammsTVShowcase() {
    const controls = useAnimation();

    const startAirHockeyBounces = () => {
        controls.start({
            x: [0, -400, -900, -500, 80, -200, -950, -800, 0],
            y: [0, -180, 50, 180, 0, 180, -100, -180, 0],
            rotate: [0, 360],
            transition: {
                repeat: Infinity,
                duration: 10,
                ease: "linear"
            }
        });
    };

    // Iniciar la animación infinita de hockey de aire al montar el componente
    useEffect(() => {
        startAirHockeyBounces();
    }, []);

    return (
        <section className="relative w-full min-h-[600px] md:min-h-[850px] lg:min-h-[950px] bg-black overflow-hidden flex items-center z-10">
            
            {/* Animación del Fondo de la Sección (Llega desde el lado derecho y cubre el fondo) */}
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ 
                    type: "spring", 
                    damping: 24, 
                    stiffness: 50, 
                    duration: 1.5 
                }}
                className="absolute inset-0 z-0 w-full h-full"
            >
                {/* Imagen de Fondo con Efecto de Pantalla de TV Analógica (Apagándose y prendiéndose de forma errática) */}
                <motion.img 
                    src="/udreamms-tv.png" 
                    alt="Udreamms TV Background" 
                    animate={{
                        opacity: [0.9, 0.3, 0.95, 0.1, 0.9, 0.2, 0.85, 0.95, 0.3, 0.9],
                        scale: [1, 1.002, 0.998, 1.001, 1]
                    }}
                    transition={{
                        opacity: {
                            repeat: Infinity,
                            duration: 2.5,
                            ease: "linear"
                        },
                        scale: {
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "easeInOut"
                        }
                    }}
                    className="w-full h-full object-contain object-center md:object-right"
                />
                
                {/* Degradado suave a la izquierda para asegurar legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
            </motion.div>

            {/* Contenido de la Sección */}
            <div className="container max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                    
                    {/* Left Column: Texts */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        {/* Animación de los Textos desde el lado izquierdo (Flujo perfecto sin empujar palabras) */}
                        <motion.div
                            initial={{ x: "-150px", opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ 
                                delay: 0.4, 
                                type: "spring", 
                                damping: 18, 
                                stiffness: 60, 
                                duration: 1.2 
                            }}
                            className="flex flex-col gap-1"
                        >
                            {/* Badge premium (Arriba y más pequeño) */}
                            <span className="w-fit inline-block bg-[#D31245] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-lg shadow-[#D31245]/20 animate-pulse">
                                PRÓXIMAMENTE • PLATAFORMA DE STREAMING
                            </span>

                            {/* Título Principal */}
                            <h2 className="text-4xl md:text-[5.5rem] lg:text-[6.5rem] font-bold text-white tracking-tighter leading-none select-none">
                                UDREAMMS
                            </h2>
                            
                            {/* Subtítulos y Copia Premium de Acompañamiento (Perfectamente pegados) */}
                            <div className="max-w-2xl mt-4 md:mt-6">
                                
                                <h3 className="text-xl md:text-3xl font-light text-slate-300 tracking-wide mb-6">
                                    El canal de entretenimiento y educación definitiva para triunfar en USA
                                </h3>
                                
                                <p className="text-base text-slate-400 font-light leading-relaxed mb-8 max-w-xl">
                                    Accede a series exclusivas, entrevistas con cónsules, testimonios de éxito sin editar y guías en vivo sobre la vida estudiantil y laboral en Estados Unidos. Todo el contenido audiovisual de Udreamms unificado en una sola plataforma.
                                </p>
                                
                                {/* CTA Glassmorphic Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-fit flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-full text-base font-normal tracking-wide transition-all shadow-xl shadow-black/30"
                                >
                                    Udreamms TV
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Interactive TV Icon (Fully responsive) */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end relative h-[240px] md:h-[450px] lg:h-auto">
                        <motion.div
                            initial={{ scale: 0.8, rotate: -5, opacity: 0, x: 200 }}
                            whileInView={{ scale: 1, rotate: 0, opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            animate={controls}
                            drag
                            dragConstraints={{ left: -1000, right: 100, top: -200, bottom: 200 }}
                            dragElastic={0.2}
                            onDragEnd={() => {
                                // Al soltar el cursor, reactivamos de inmediato y de forma fluida el bucle de rebotes infinitos!
                                startAirHockeyBounces();
                            }}
                            whileDrag={{ scale: 1.15, cursor: "grabbing" }}
                            className="relative lg:absolute lg:right-0 lg:-top-64 w-56 h-56 md:w-[28rem] md:h-[28rem] lg:w-[40rem] lg:h-[40rem] flex items-center justify-center shrink-0 z-20 cursor-grab select-none pointer-events-auto"
                        >
                            <img 
                                src="/tv.png" 
                                alt="TV Icon" 
                                className="w-full h-full object-contain filter brightness-0 invert drop-shadow-[0_0_35px_rgba(255,255,255,0.6)] pointer-events-none"
                            />
                        </motion.div>
                    </div>

                </div>
            </div>
            
        </section>
    );
}
