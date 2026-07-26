"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

export default function UdreammsTVShowcase() {
    const controls = useAnimation();

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

        const minX = Math.round(c.left - t.left);
        const maxX = Math.round(c.right - t.right);
        const minY = Math.round(c.top - t.top);
        const maxY = Math.round(c.bottom - t.bottom);

        const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

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

    return (
        <section ref={sectionRef} className="relative w-full min-h-[400px] md:min-h-[550px] lg:min-h-[650px] bg-black overflow-hidden flex items-center z-10 pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32">
            
            {/* 1. DEGRADADO SUPERIOR (Badge sin borde y con tipografía fina font-light) */}
            <div className="absolute top-0 left-0 right-0 z-30 w-full h-24 md:h-36 lg:h-48 bg-gradient-to-b from-black via-black/95 to-transparent flex items-center justify-center pt-6 md:pt-10 pointer-events-none">
                <span className="w-fit h-fit inline-block bg-white/5 text-white/90 backdrop-blur-md text-[10px] md:text-[12px] font-light uppercase tracking-widest px-6 py-2.5 rounded-full shadow-md pointer-events-auto">
                    PRÓXIMAMENTE • PLATAFORMA DE STREAMING
                </span>
            </div>

            {/* 2. DEGRADADO MÁS PRONUNCIADO EN EL BORDE INFERIOR */}
            <div
                className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 w-full h-24 md:h-36 lg:h-48 bg-gradient-to-t from-black via-black/95 to-transparent"
                aria-hidden
            />

            {/* Imagen de Fondo abarcando el tamaño exacto de TODA la sección completa */}
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
                className="absolute inset-0 z-0 w-full h-full overflow-hidden"
            >
                {/* Imagen de Fondo un poco más grande */}
                <motion.img
                    src="/udreamms-tv.png"
                    alt="Udreamms TV Background"
                    animate={{
                        opacity: [0.9, 0.3, 0.95, 0.1, 0.9, 0.2, 0.85, 0.95, 0.3, 0.9],
                        scale: [0.94, 0.942, 0.938, 0.941, 0.94]
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
                    className="absolute inset-0 w-[94%] h-[94%] my-auto ml-auto -mr-12 md:-mr-24 lg:-mr-36 translate-x-4 md:translate-x-8 object-contain object-right z-0 mix-blend-screen"
                />

                {/* DEGRADADO AÚN MÁS INTENSO Y EXTENSO EN EL LADO IZQUIERDO */}
                <div className="absolute inset-y-0 left-0 w-full md:w-4/5 lg:w-3/4 bg-gradient-to-r from-black via-black via-55% to-transparent z-10 pointer-events-none" />
            </motion.div>

            {/* Contenido de la Sección */}
            <div className="container max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-24 relative z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

                    {/* Left Column: Texts */}
                    <div className="w-full max-w-3xl flex flex-col justify-center">
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
                            {/* Título Principal con Capa Independiente para el Signo + */}
                            <div className="relative inline-block w-fit">
                                <h2 className="text-4xl md:text-[5.5rem] lg:text-[6.5rem] font-bold text-white tracking-tighter leading-none select-none">
                                    UDREAMMS
                                </h2>

                                {/* Capa Independiente para el Signo + (No interfiere con el mensaje) */}
                                <motion.div
                                    initial={{ x: 600, y: -250, opacity: 0, scale: 0.2, rotate: 45 }}
                                    whileInView={{
                                        x: [600, 280, 0],
                                        y: [-250, 180, 0],
                                        opacity: [0, 1, 1],
                                        scale: [0.3, 1.2, 1],
                                        rotate: [45, -25, 0],
                                        scaleY: [1, 0.7, 1],
                                        scaleX: [1, 1.3, 1]
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.4,
                                        duration: 1.6,
                                        times: [0, 0.55, 1],
                                        ease: ["easeIn", "easeOut"]
                                    }}
                                    className="absolute -right-24 md:-right-44 lg:-right-60 -top-12 md:-top-24 lg:-top-32 z-30 pointer-events-auto select-none"
                                >
                                    <motion.span
                                        animate={{
                                            y: [0, -42, 0, -16, 0],
                                            scaleY: [1, 0.86, 1.14, 0.93, 1],
                                            scaleX: [1, 1.14, 0.91, 1.06, 1],
                                            rotate: [0, 6, -4, 2, 0],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 3,
                                            ease: "easeInOut",
                                        }}
                                        drag
                                        dragConstraints={{ left: -300, right: 300, top: -250, bottom: 250 }}
                                        whileDrag={{ scale: 1.3, cursor: "grabbing" }}
                                        className="block font-thin text-white text-[9rem] md:text-[16rem] lg:text-[21rem] leading-none drop-shadow-[0_0_65px_rgba(255,255,255,1)] cursor-grab select-none pointer-events-auto"
                                    >
                                        +
                                    </motion.span>
                                </motion.div>
                            </div>

                            {/* Subtítulos y Copia Premium de Acompañamiento (Perfectamente pegados) */}
                            <div className="max-w-2xl mt-4 md:mt-6">

                                <h3 className="text-xl md:text-3xl font-light text-slate-300 tracking-wide mb-6">
                                    El canal de entretenimiento y educación definitiva para triunfar en USA
                                </h3>

                                <p className="text-base text-slate-400 font-light leading-relaxed mb-8 max-w-xl">
                                    Accede a series exclusivas, entrevistas con cónsules, testimonios de éxito sin editar y guías en vivo sobre la vida estudiantil y laboral en Estados Unidos. Todo el contenido audiovisual de Udreamms unificado en una sola plataforma.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* CTA Button Transparente Ubicado en el Contenedor Principal (Lado Derecho) */}
                <div className="w-full flex justify-end mt-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-12 md:px-16 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/30 backdrop-blur-md rounded-full text-base md:text-lg font-medium tracking-wide transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        Udreamms Streaming
                    </motion.button>
                </div>
            </div>

        </section>
    );
}
