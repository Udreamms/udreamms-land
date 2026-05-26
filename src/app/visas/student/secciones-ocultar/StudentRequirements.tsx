import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileCheck,
    Book,
    Banknote,
    GraduationCap,
    History,
    FileText,
    CheckCircle
} from "lucide-react";

const requirements = [
    {
        title: "Pasaporte Vigente",
        description: "Debe tener una validez mínima de 6 meses más allá de tu periodo de estancia en los Estados Unidos.",
        icon: Book,
    },
    {
        title: "Formulario I-20",
        description: "Certificado de elegibilidad emitido por una institución educativa autorizada por el SEVP (Udreamms te ayuda a obtenerlo).",
        icon: FileCheck,
    },
    {
        title: "Pago de SEVIS I-901",
        description: "Comprobante de pago del sistema de información para estudiantes e intercambistas.",
        icon: Banknote,
    },
    {
        title: "Formulario DS-160",
        description: "Confirmación del llenado del formulario de solicitud de visa no inmigrante en línea ante la embajada.",
        icon: FileText,
    },
    {
        title: "Solvencia Económica",
        description: "Extractos bancarios o patrocinio que demuestren fondos para cubrir matrícula y costo de vida.",
        icon: Banknote,
    },
    {
        title: "Historial Académico",
        description: "Títulos previos, certificados de notas o diplomas que respalden tu perfil como estudiante.",
        icon: GraduationCap,
    },
    {
        title: "Lazos con tu País",
        description: "Documentación que demuestre fuertes razones para regresar tras finalizar tus estudios.",
        icon: History,
    },
    {
        title: "Recibo de Tasa de Visa",
        description: "Comprobante de pago de los derechos de solicitud de la visa (MRV).",
        icon: Banknote,
    },
    {
        title: "Fotos para Visa",
        description: "Fotografías que cumplan con los requisitos específicos de la embajada americana.",
        icon: FileText,
    },
    {
        title: "Carta de Aceptación",
        description: "Documento oficial de la escuela que confirma que has sido admitido para estudiar.",
        icon: CheckCircle,
    }
];

export default function StudentRequirements() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const maxScrollLeft = scrollWidth - clientWidth;
            const progress = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * 100 : 0;
            setScrollProgress(progress);
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            const maxScrollLeft = scrollWidth - clientWidth;
            const scrollLeft = (value / 100) * maxScrollLeft;
            scrollRef.current.scrollLeft = scrollLeft;
        }
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
            handleScroll(); // Set initial progress
            return () => currentRef.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <section className="py-24 bg-white overflow-hidden" id="requisitos-estudiante">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-black mb-4 block">
                        Prepárate con éxito
                    </span>
                    <h2 className="text-4xl md:text-6xl font-medium tracking-tighter leading-[1.1] text-slate-900 mb-6">
                        Requisitos para tu<br />
                        <span className="text-slate-400">Visa de Estudiante F-1</span>
                    </h2>
                    <p className="text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
                        Para asegurar tu proceso, es fundamental contar con la documentación correcta. Aquí te detallamos lo que necesitarás para tu aplicación.
                    </p>
                </div>

                {/* Requirements Horizontal Scrolling - Automatic & Interactive */}
                <div className="relative group">
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto no-scrollbar gap-10 pb-20 snap-x cursor-grab active:cursor-grabbing px-4"
                    >
                        {requirements.map((req, index) => {
                            const Icon = req.icon;
                            const shapes = [
                                "rounded-full",
                                "rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%]",
                                "rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%]",
                                "rounded-[30%_70%_70%_30%_/_50%_50%_50%_50%]",
                                "rounded-[50%_50%_20%_80%_/_20%_80%_50%_50%]",
                                "rounded-[80%_20%_50%_50%_/_50%_50%_20%_80%]"
                            ];
                            const shape = shapes[index % shapes.length];

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.15 }}
                                    className={`group flex-shrink-0 w-[300px] md:w-[380px] aspect-square p-6 md:p-12 snap-center transition-all duration-700 ${shape} hover:scale-[1.05] shadow-xl hover:shadow-2xl bg-white border-2 border-slate-200 flex flex-col justify-center items-center text-center`}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-slate-100 transition-colors duration-500">
                                        <Icon size={36} strokeWidth={1.5} className="text-black" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">
                                        {req.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium px-4">
                                        {req.description}
                                    </p>
                                    <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        <span>Verificado Udreamms</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Navigation Instruction & Interactive Slider */}
                    <div className="flex flex-col items-center gap-6 mt-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <span className="text-[11px] font-bold uppercase tracking-[0.4em] italic mb-1">Desliza para explorar</span>
                        </div>

                        <div className="relative w-64 h-2 group/slider">
                            {/* Visual Track */}
                            <div className="absolute inset-0 bg-slate-100 rounded-full" />

                            {/* Progress Fill */}
                            <div
                                className="absolute inset-y-0 left-0 bg-black rounded-full transition-all duration-100"
                                style={{ width: `${scrollProgress}%` }}
                            />

                            {/* Hidden Interactive Input */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={scrollProgress}
                                onChange={handleSliderChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-20"
                            />

                            {/* Draggable Handle Decoration */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow-md pointer-events-none z-10"
                                style={{ left: `calc(${scrollProgress}% - 8px)` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Call to Action Box - Centered and clean */}
                <div className="mt-16 bg-white rounded-[2.5rem] p-6 md:p-12 border border-slate-100 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">¿Dudas con los documentos?</h4>
                        <p className="text-slate-500 font-medium max-w-2xl">Nuestros expertos revisan cada archivo para garantizar tu aprobación.</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
