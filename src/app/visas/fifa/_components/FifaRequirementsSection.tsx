"use client";

import { motion } from "framer-motion";
import { CheckCircle, MapPin, Globe, CreditCard, Home, Briefcase, FileText } from "lucide-react";

const requirements = [
    {
        title: "Pasaporte Vigente",
        description: "Debe tener una validez mínima de 6 meses más allá de tu periodo de estancia en el Mundial 2026.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=1000&auto=format&fit=crop",
        cardBg: "bg-[#FFD1E3]", // Pink
        shape: "rounded-full"
    },
    {
        title: "Entradas o Paquetes",
        description: "Confirmación de compra de entradas a partidos o paquete de hospitalidad oficial FIFA.",
        image: "https://images.unsplash.com/photo-1518091043644-c1d445eb951d?q=80&w=1000&auto=format&fit=crop",
        cardBg: "bg-[#D1D1FF]", // Purple
        shape: "rounded-[4rem] rounded-tl-none rounded-br-none"
    },
    {
        title: "Solvencia Económica",
        description: "Pruebas de que posees fondos suficientes para cubrir traslados, alojamiento y consumo durante el torneo.",
        image: "https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=1000&auto=format&fit=crop",
        cardBg: "bg-[#D1EAFF]", // Blue
        shape: "rounded-2xl"
    },
    {
        title: "Lazos con tu País",
        description: "Documentación que demuestre tu arraigo (laboral, familiar o propiedades) para garantizar tu retorno.",
        image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=1000&auto=format&fit=crop",
        cardBg: "bg-[#FFF1D1]", // Orange/Yellow
        shape: "rounded-[3rem] rotate-3"
    },
    {
        title: "Alojamiento Confirmado",
        description: "Reservas de hotel o carta de invitación de familiares/amigos residentes en las ciudades sede.",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000&auto=format&fit=crop",
        cardBg: "bg-[#D1FFD1]", // Green
        shape: "rounded-full scale-90"
    },
    {
        title: "Formulario DS-160",
        description: "Confirmación del formulario de solicitud de visa de turismo (B1/B2) correctamente llenado.",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop",
        cardBg: "bg-[#E2E8F0]", // Slate
        shape: "rounded-3xl"
    }
];

export default function FifaRequirementsSection() {
    return (
        <section className="py-24 bg-white overflow-hidden" id="fan-pass-requirements">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter leading-[1.1] text-black text-center">
                        Requisitos para tu<br />
                        <span className="text-slate-400">Visa FIFA Fan Pass</span>
                    </h2>
                    <div className="md:pl-28">
                        <p className="mt-8 text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
                            Para vivir la emoción del Mundial 2026 sin contratiempos, es fundamental tener tu documentación en regla. Aquí está lo que necesitas.
                        </p>
                    </div>
                </div>

                {/* Requirements Grid (White Cards with subtle borders) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {requirements.map((req, index) => {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col h-[600px] group overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500"
                            >
                                {/* Masked Image Area */}
                                <div className="flex-1 flex items-center justify-center relative mb-10 mt-4 px-4">
                                    <div className={`relative aspect-square w-full max-w-[280px] overflow-hidden ${req.shape} shadow-xl transition-transform duration-700 group-hover:scale-105`}>
                                        <img
                                            src={req.image}
                                            alt={req.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="mt-auto space-y-4">
                                    <h3 className="text-3xl font-medium text-slate-900 leading-tight tracking-tight">
                                        {req.title}
                                    </h3>
                                    <p className="text-slate-700 text-lg font-normal leading-relaxed">
                                        {req.description}
                                    </p>

                                    <div className="pt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-slate-900/40">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        <span>Documento Verificado</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer Box (Gray, No Button) */}
                <div className="mt-24 md:mx-28 bg-slate-50 rounded-[3.5rem] p-10 md:p-16 flex flex-col items-center text-center relative overflow-hidden border border-slate-100">
                    <div className="relative z-10 text-center">
                        <h4 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4 tracking-tighter">¿Dudas con los documentos?</h4>
                        <p className="text-slate-500 text-xl font-normal max-w-xl">Nuestros expertos revisan cada archivo para garantizar que tu Fan Pass esté listo para el inicio del torneo.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
