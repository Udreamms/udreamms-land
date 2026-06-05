"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function UdreammsTVShowcase() {
    const controls = useAnimation();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        if (typeof window !== "undefined") window.addEventListener("resize", checkMobile);
        return () => {
            if (typeof window !== "undefined") window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const resizeTimer = useRef<number | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);
    const tvRef = useRef<any>(null);

    // Calcula límites basados en las dimensiones reales de la sección y el TV
    const startAirHockeyBounces = () => {
        if (typeof window === "undefined") return;
        const sec = sectionRef.current;
        const tv = tvRef.current;
        if (!sec || !tv) return;

        const c = sec.getBoundingClientRect();
        const t = tv.getBoundingClientRect();

        // límites para que el TV no salga del area visible de la sección
        const minX = Math.round(c.left - t.left);
        const maxX = Math.round(c.right - t.right);
        const minY = Math.round(c.top - t.top);
        const maxY = Math.round(c.bottom - t.bottom);

        const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

        // Generar puntos intermedios dentro de los límites con margen
        const marginX = Math.round(Math.min(Math.abs(minX), Math.abs(maxX)) * 0.85);
        const marginY = Math.round(Math.min(Math.abs(minY), Math.abs(maxY)) * 0.6);

        const xs = [
            0,
            clamp(-marginX * 0.6, minX, maxX),
            clamp(marginX * 0.5, minX, maxX),
            clamp(-marginX * 0.3, minX, maxX),
            clamp(marginX * 0.25, minX, maxX),
            0
        ];

        const ys = [
            0,
            clamp(-marginY * 0.9, minY, maxY),
            clamp(marginY * 0.6, minY, maxY),
            clamp(-marginY * 0.4, minY, maxY),
            0
        ];

        controls.start({
            x: xs,
            y: ys,
            rotate: [0, 3, -2, 1, 0],
            transition: {
                repeat: Infinity,
                duration: 30,
                ease: "easeInOut"
            }
        });
    };

    // Iniciar la animación y reiniciarla en resize (debounced)
    useEffect(() => {
        startAirHockeyBounces();
        const onResize = () => {
            if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
            resizeTimer.current = window.setTimeout(() => {
                startAirHockeyBounces();
            }, 150);
        };
        if (typeof window !== "undefined") window.addEventListener("resize", onResize);
        return () => {
            if (typeof window !== "undefined") window.removeEventListener("resize", onResize);
            if (resizeTimer.current) window.clearTimeout(resizeTimer.current);
        };
    }, []);

    const starVariants = {
        initial: {
            left: isMobile ? "50%" : "75%",
            top: isMobile ? "80%" : "35%",
            scale: 0,
            opacity: 0
        },
        animate: {
            left: isMobile 
                ? ["50%", "50%", "72%", "72%"] 
                : ["75%", "75%", "48%", "48%"],
            top: isMobile 
                ? ["80%", "80%", "22%", "22%"] 
                : ["35%", "35%", "35%", "35%"],
            scale: [0, 1.5, 1.0, 0],
            opacity: [0, 1, 1, 0],
            transition: {
                duration: 2.5,
                times: [0, 0.55, 0.85, 1],
                ease: "easeInOut" as const
            }
        }
    };

    const bar1Variants = {
        initial: {
            left: "26%",
            top: "2.5%",
            rotate: 0,
            scale: 1,
            opacity: 1,
            boxShadow: "0 0 10px rgba(124, 58, 237, 0.3)"
        },
        animate: {
            left: ["26%", "46%", "46%", "46%"],
            top: ["2.5%", "12.5%", "12.5%", "12.5%"],
            rotate: [0, 90, 90, 90],
            scale: [1, 1.08, 1.0, 1.0],
            opacity: [1, 1, 1, 1],
            boxShadow: [
                "0 0 15px rgba(124, 58, 237, 0.3)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)"
            ],
            transition: {
                duration: 2.5,
                times: [0, 0.45, 0.55, 1],
                ease: "easeInOut" as const
            }
        }
    };

    const bar2Variants = {
        initial: {
            left: "46%",
            top: "15.5%",
            rotate: 0,
            scale: 1,
            opacity: 1,
            boxShadow: "0 0 10px rgba(124, 58, 237, 0.3)"
        },
        animate: {
            left: ["46%", "46%", "46%", "46%"],
            top: ["15.5%", "12.5%", "12.5%", "12.5%"],
            rotate: [0, 0, 0, 0],
            scale: [1, 1.08, 1.0, 1.0],
            opacity: [1, 1, 1, 1],
            boxShadow: [
                "0 0 15px rgba(124, 58, 237, 0.3)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)"
            ],
            transition: {
                duration: 2.5,
                times: [0, 0.45, 0.55, 1],
                ease: "easeInOut" as const
            }
        }
    };

    const bar3Variants = {
        initial: {
            left: "66%",
            top: "28.5%",
            rotate: 0,
            scale: 1,
            opacity: 1,
            boxShadow: "0 0 10px rgba(124, 58, 237, 0.3)"
        },
        animate: {
            left: ["66%", "46%", "46%", "46%"],
            top: ["28.5%", "12.5%", "12.5%", "12.5%"],
            rotate: [0, 90, 90, 90],
            scale: [1, 1.08, 1.0, 1.0],
            opacity: [1, 1, 1, 1],
            boxShadow: [
                "0 0 15px rgba(124, 58, 237, 0.3)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)",
                "0 0 35px rgba(217, 70, 239, 0.9), 0 0 70px rgba(217, 70, 239, 0.5)"
            ],
            transition: {
                duration: 2.5,
                times: [0, 0.45, 0.55, 1],
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <section ref={sectionRef} className="relative w-full min-h-[600px] md:min-h-[850px] lg:min-h-[950px] bg-black overflow-hidden flex items-center z-10">
            {/* Transición suave hacia el bloque negro inferior */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-28 md:h-40 lg:h-48 bg-gradient-to-b from-transparent via-black/80 to-black"
              aria-hidden
            />

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
                    className="absolute inset-0 w-full h-full object-cover object-center sm:object-center md:object-right lg:object-right z-0"
                />
                
                {/* Degradado suave a la izquierda para asegurar legibilidad del texto */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 md:from-black/80 via-black/40 to-transparent pointer-events-none" />
            </motion.div>

            {/* Contenido de la Sección */}
            <motion.div 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-10% 0px" }}
                className="container max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-24 relative z-20"
            >
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
                            <h2 className="text-4xl md:text-[5.5rem] lg:text-[6.5rem] font-bold text-white tracking-tighter leading-none select-none flex items-center gap-3">
                                UDREAMMS
                                <motion.span
                                    variants={{
                                        initial: { scale: 0, opacity: 0 },
                                        animate: {
                                            scale: 1,
                                            opacity: 1,
                                            transition: {
                                                delay: 2.1,
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 8
                                            }
                                        }
                                    }}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-[#bf5af2] to-[#bf5af2] font-extrabold"
                                    style={{
                                        textShadow: "0 0 20px rgba(191,90,242,0.8)"
                                    }}
                                >
                                    +
                                </motion.span>
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
                                    className="w-fit flex items-center gap-3 bg-white/10 hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] text-white border border-white/20 backdrop-blur-md px-8 py-2.5 rounded-full text-base font-normal tracking-wide transition-all shadow-xl shadow-black/30"
                                >
                                    Udreamms +
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
                            ref={tvRef}
                            drag
                            dragConstraints={{ left: -1000, right: 100, top: -200, bottom: 200 }}
                            dragElastic={0.2}
                            onDragEnd={() => {
                                // Al soltar el cursor, reactivamos de inmediato y de forma fluida el bucle de rebotes infinitos!
                                startAirHockeyBounces();
                            }}
                            whileDrag={{ scale: 1.15, cursor: "grabbing" }}
                            className="relative lg:absolute lg:right-0 lg:-top-64 w-40 h-40 md:w-72 md:h-72 lg:w-[30rem] lg:h-[30rem] flex items-center justify-center shrink-0 z-20 cursor-grab select-none pointer-events-auto"
                        >
                            {/* Background Purple Glow */}
                            <div className="absolute w-[80%] h-[80%] rounded-full bg-[#bf5af2]/20 blur-[100px] pointer-events-none z-0" />
                            
                            {/* 3D Glowing Bars Container */}
                            <motion.div 
                                className="relative w-[75%] h-[75%] pointer-events-none z-10"
                                variants={{
                                    initial: { rotate: 0 },
                                    animate: {
                                        rotate: [0, 360, 360],
                                        transition: {
                                            duration: 2.5,
                                            times: [0, 0.55, 1],
                                            ease: "easeInOut" as const
                                        }
                                    }
                                }}
                                initial="initial"
                                whileInView="animate"
                                viewport={{ once: true }}
                            >
                                
                                {/* Bar 1 (Left -> Horizontal) */}
                                <motion.div 
                                    className="absolute w-[8%] h-[75%] rounded-full bg-gradient-to-b from-[#7c3aed] via-[#d946ef] to-[#6366f1] overflow-hidden border border-fuchsia-500/30"
                                    variants={bar1Variants}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    {/* Glassy Shine Sweep */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/25 to-transparent"
                                        initial={{ y: "-100%" }}
                                        animate={{ y: ["-100%", "100%", "100%"] }}
                                        transition={{
                                            y: {
                                                repeat: Infinity,
                                                duration: 2.5,
                                                ease: "easeInOut",
                                                repeatDelay: 3.5,
                                                delay: 1.0
                                            }
                                        }}
                                    />
                                </motion.div>

                                {/* Bar 2 (Middle -> Vertical) */}
                                <motion.div 
                                    className="absolute w-[8%] h-[75%] rounded-full bg-gradient-to-b from-[#7c3aed] via-[#d946ef] to-[#6366f1] overflow-hidden border border-fuchsia-500/30"
                                    variants={bar2Variants}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    {/* Glassy Shine Sweep */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/25 to-transparent"
                                        initial={{ y: "-100%" }}
                                        animate={{ y: ["-100%", "100%", "100%"] }}
                                        transition={{
                                            y: {
                                                repeat: Infinity,
                                                duration: 2.5,
                                                ease: "easeInOut",
                                                repeatDelay: 3.5,
                                                delay: 1.6
                                            }
                                        }}
                                    />
                                </motion.div>

                                {/* Bar 3 (Right -> Horizontal) */}
                                <motion.div 
                                    className="absolute w-[8%] h-[75%] rounded-full bg-gradient-to-b from-[#7c3aed] via-[#d946ef] to-[#6366f1] overflow-hidden border border-fuchsia-500/30"
                                    variants={bar3Variants}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    {/* Glassy Shine Sweep */}
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/25 to-transparent"
                                        initial={{ y: "-100%" }}
                                        animate={{ y: ["-100%", "100%", "100%"] }}
                                        transition={{
                                            y: {
                                                repeat: Infinity,
                                                duration: 2.5,
                                                ease: "easeInOut",
                                                repeatDelay: 3.5,
                                                delay: 2.2
                                            }
                                        }}
                                    />
                                </motion.div>

                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Shooting Star Flare with Trail */}
                    <motion.div
                        variants={starVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="absolute w-6 h-6 rounded-full bg-white z-50 pointer-events-none flex items-center justify-end"
                        style={{
                            boxShadow: '0 0 20px #fff, 0 0 40px #bf5af2, 0 0 80px #bf5af2'
                        }}
                    >
                        {/* Light tail */}
                        <div className="absolute right-3 w-32 md:w-48 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#d946ef]/60 to-white filter blur-[1.5px]" />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
