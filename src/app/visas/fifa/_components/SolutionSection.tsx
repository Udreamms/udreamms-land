"use client";

import { FadeIn } from "./Animations";
import { Radar, Shield, Users } from "lucide-react";

export default function SolutionSection() {
    return (
        <div className="w-full bg-white pt-24 pb-24 my-0 relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <FadeIn className="text-center mb-16">
                    <h2 className="text-sm font-bold text-yellow-600 tracking-[0.2em] uppercase mb-4 animate-pulse">
                        La Experiencia Definitiva
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-black italic text-slate-900 mb-6 leading-none">
                        VIVE EL MUNDIAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">COMO LEYENDA.</span>
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
                        Tu acceso total a la Copa del Mundo. Lujo, comodidad y puertas abiertas donde otros solo ven muros.
                    </p>
                </FadeIn>

                {/* Dynamic FIFA Styled Container */}
                <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
                        {/* Left: Content (Cards) */}
                        <div className="w-full lg:w-1/2 space-y-6">
                            <FadeIn delay={0.1}>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-5 hover:scale-[1.02] transition-transform">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">1. Hospitality VIP</h4>
                                        <p className="text-sm text-slate-600">Acceso a zonas exclusivas en estadios con catering gourmet y bebidas.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-start gap-5 hover:scale-[1.02] transition-transform">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">2. Traslados Privados</h4>
                                        <p className="text-sm text-slate-600">Chofer privado para llevarte del hotel al estadio con total seguridad.</p>
                                    </div>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.3}>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-start gap-5 hover:scale-[1.02] transition-transform">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <Radar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-1">3. Eventos Exclusivos</h4>
                                        <p className="text-sm text-slate-600">Invitaciones a fiestas oficiales y meet & greet con leyendas del fútbol.</p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Right: Image */}
                        <FadeIn className="w-full lg:w-1/2">
                            <div className="relative group overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-all duration-500">
                                <img
                                    src="/assets/generated/visa_success_premium_lounge.png"
                                    alt="Experiencia VIP Mundial"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000&auto=format&fit=crop";
                                    }}
                                />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
