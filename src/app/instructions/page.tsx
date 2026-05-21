"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { CheckCircle2, CreditCard, Wallet, Plane, Star, Trophy, ArrowRight, ShieldCheck, MessageCircle, Mail, Smartphone, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PlanId = 'basico' | 'premium' | 'vip';
type PaymentMethod = 'crypto' | 'card' | null;

const planDetails: Record<PlanId, { normal: string, crypto: string, title: string, icon: any, color: string, activeClass: string, stripeLink: string }> = {
    basico: { normal: "$494", crypto: "$380", title: "Plan Básico", icon: Plane, color: "text-slate-600", activeClass: "border-slate-900 ring-2 ring-slate-900 bg-slate-50", stripeLink: "https://buy.stripe.com/00w4gzdoT734alQeqfenS0x" },
    premium: { normal: "$4,550", crypto: "$3,500", title: "Plan Premium", icon: Star, color: "text-blue-600", activeClass: "border-blue-600 ring-2 ring-blue-600 bg-blue-50/50", stripeLink: "https://buy.stripe.com/00wdR93Ojafgdy2ci7enS0y" },
    vip: { normal: "$6,500", crypto: "$4,990", title: "Experiencia VIP", icon: Trophy, color: "text-amber-500", activeClass: "border-amber-500 ring-2 ring-amber-500 bg-amber-50/50", stripeLink: "https://buy.stripe.com/bJe3cvfx1cnoeC6fujenS0z" },
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function InstructionsPage() {
    const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

    const handlePlanSelect = (plan: PlanId) => {
        setSelectedPlan(plan);
        setPaymentMethod(null); // Reset payment method when changing plan
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col selection:bg-blue-100">
            <Header />
            <main className="flex-grow pt-32 pb-32">
                <div className="container mx-auto px-6 max-w-5xl">
                    
                    {/* Header Section */}
                    <motion.div 
                        initial="hidden" animate="visible" variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 rounded-2xl mb-6 shadow-sm">
                            <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900">
                            Tu Aventura Comienza Aquí
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                            Has dado el primer paso hacia tu sueño americano. Sigue las instrucciones a continuación para asegurar tu plan.
                        </p>
                    </motion.div>

                    {/* Step 1: Select Plan */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">1</div>
                            <h2 className="text-2xl font-bold text-slate-800">Confirma tu Plan</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(Object.entries(planDetails) as [PlanId, typeof planDetails[PlanId]][]).map(([id, plan]) => {
                                const isSelected = selectedPlan === id;
                                const Icon = plan.icon;
                                return (
                                    <motion.button
                                        key={id}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handlePlanSelect(id)}
                                        className={`relative p-8 rounded-3xl text-left transition-all duration-300 border-2 overflow-hidden group 
                                            ${isSelected ? plan.activeClass : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'}`}
                                    >
                                        <div className="relative z-10">
                                            <Icon className={`w-8 h-8 mb-4 ${isSelected ? plan.color : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`} />
                                            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                                            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                                {isSelected ? 'Plan Seleccionado' : 'Seleccionar'}
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                            </p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Step 2: Select Payment Method */}
                    <AnimatePresence mode="wait">
                        {selectedPlan && (
                            <motion.div
                                key="payment-method-step"
                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="mb-16"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">2</div>
                                    <h2 className="text-2xl font-bold text-slate-800">Elige tu método de pago</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Crypto Option */}
                                    <motion.button
                                        whileHover={{ y: -4, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod('crypto')}
                                        className={`relative overflow-hidden p-8 rounded-3xl text-left transition-all duration-300 border-2
                                            ${paymentMethod === 'crypto' ? 'border-blue-400 ring-4 ring-blue-400/20' : 'border-transparent'}
                                            bg-[#0B1120] text-white shadow-2xl hover:shadow-blue-500/10`}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Wallet className="w-32 h-32 text-blue-300" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-6 tracking-wider uppercase">
                                                30% Descuento Aplicado
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <Wallet className="w-8 h-8 text-blue-400" />
                                                <h3 className="text-2xl font-bold">Pagar con Crypto</h3>
                                            </div>
                                            <div className="mt-8">
                                                <p className="text-slate-400 text-sm mb-1">Total a pagar hoy</p>
                                                <p className="text-4xl font-black text-white tracking-tight">{planDetails[selectedPlan].crypto}</p>
                                            </div>
                                            {paymentMethod === 'crypto' && (
                                                <div className="absolute top-8 right-8 text-blue-400 animate-pulse">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.button>

                                    {/* Card Option */}
                                    <motion.button
                                        whileHover={{ y: -4, scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod('card')}
                                        className={`relative overflow-hidden p-8 rounded-3xl text-left transition-all duration-300 border-2
                                            ${paymentMethod === 'card' ? 'border-indigo-400 ring-4 ring-indigo-400/20' : 'border-transparent'}
                                            bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl hover:shadow-indigo-500/20`}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <CreditCard className="w-32 h-32" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-6 tracking-wider uppercase backdrop-blur-sm">
                                                <ShieldCheck className="w-4 h-4" /> Pago Seguro
                                            </div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <CreditCard className="w-8 h-8 text-indigo-200" />
                                                <h3 className="text-2xl font-bold">Pagar con Tarjeta</h3>
                                            </div>
                                            <div className="mt-8">
                                                <p className="text-indigo-200 text-sm mb-1">Total a pagar hoy</p>
                                                <p className="text-4xl font-black text-white tracking-tight">{planDetails[selectedPlan].normal}</p>
                                            </div>
                                            {paymentMethod === 'card' && (
                                                <div className="absolute top-8 right-8 text-white animate-pulse">
                                                    <CheckCircle2 className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Step 3: Instructions (Dynamic) */}
                    <AnimatePresence mode="wait">
                        {paymentMethod && (
                            <motion.div
                                key="instructions-step"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">3</div>
                                    <h2 className="text-2xl font-bold text-slate-800">Sigue estas instrucciones</h2>
                                </div>

                                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                                    {/* Decorative background shape */}
                                    <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 ${paymentMethod === 'crypto' ? 'bg-blue-400' : 'bg-indigo-500'}`}></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                                            <div className={`p-4 rounded-2xl ${paymentMethod === 'crypto' ? 'bg-[#0B1120] text-blue-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {paymentMethod === 'crypto' ? <Wallet className="w-8 h-8" /> : <CreditCard className="w-8 h-8" />}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900">
                                                    Pago vía {paymentMethod === 'crypto' ? 'Criptomonedas' : 'Tarjeta (Stripe)'}
                                                </h3>
                                                <p className="text-slate-500 font-medium mt-1">Sigue estos pasos cuidadosamente para completar tu solicitud.</p>
                                            </div>
                                        </div>

                                        {paymentMethod === 'crypto' ? (
                                            <div className="space-y-8">
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-blue-500" /> 1. En tu Celular</h4>
                                                    <ol className="space-y-6">
                                                        <StepItem number="1" title="Descarga Phantom Wallet" description={<>Abre la App Store o Google Play en tu teléfono y descarga <strong>Phantom</strong> (el ícono morado con un fantasma). Crea una nueva billetera o cuenta.</>} />
                                                        <StepItem number="2" title="Recarga tu Cuenta" description={<>Fondea tu cuenta con la criptomoneda con la que vas a pagar (<strong>USDC, USDT, SOL o LXR</strong>).<br/><span className="text-sm text-slate-500 mt-1 block">Si no encuentras LXR, usa este contrato: <code className="bg-slate-100 px-2 py-1 rounded text-xs select-all text-slate-800 font-mono">7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth</code></span></>} />
                                                    </ol>
                                                </div>
                                                
                                                <div className="pt-6 border-t border-slate-100">
                                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-500" /> 2. En esta Página</h4>
                                                    <ol className="space-y-6">
                                                        <StepItem number="3" title="Genera tu Código QR" description={<>Haz clic en el botón de abajo <strong>"Proceder al Pago Seguramente"</strong>. Llena tus datos, elige la moneda con la que vas a pagar y se generará un código QR.</>} />
                                                    </ol>
                                                </div>

                                                <div className="pt-6 border-t border-slate-100">
                                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-blue-500" /> 3. De vuelta en tu Celular</h4>
                                                    <ol className="space-y-6">
                                                        <StepItem number="4" title="Escanea y Paga" description={<>En tu billetera, selecciona la moneda que tienes, busca el botón <strong>"Enviar"</strong> y usa la opción de escanear. Escanea el código QR de la pantalla y realiza tu pago. <strong>Espera 5 segundos</strong> hasta que salga la pantalla verde de "pago aprobado".</>} />
                                                    </ol>
                                                </div>

                                                <div className="pt-6 border-t border-slate-100">
                                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> 4. Siguientes Pasos</h4>
                                                    <ol className="space-y-6">
                                                        <StepItem number="5" title="Revisa tu correo electrónico" description="Recibirás un comprobante digital oficial de Udreamms con tu número de orden." />
                                                        <StepItem number="6" title="Contacto Inmediato" description="Un asesor VIP se comunicará contigo por WhatsApp o correo en menos de 24 horas para comenzar la auditoría." />
                                                    </ol>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Monitor className="w-5 h-5 text-indigo-600" /> 1. En esta Página</h4>
                                                    <ol className="space-y-6">
                                                        <StepItem number="1" title="Ir a la Pasarela Segura" description={<>Haz clic en el botón de abajo <strong>"Proceder al Pago Seguramente"</strong>. Serás redirigido a la plataforma encriptada de Stripe.</>} />
                                                        <StepItem number="2" title="Ingresa tus Datos" description={<>Completa el formulario con la información de tu <strong>tarjeta de crédito o débito</strong>. Tu pago es procesado bajo los más altos estándares de seguridad bancaria.</>} />
                                                    </ol>
                                                </div>

                                                <div className="pt-6 border-t border-slate-100">
                                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-600" /> 2. Confirmación Inmediata</h4>
                                                    <ol className="space-y-6">
                                                        <StepItem number="3" title="Procesamiento Exitoso" description={<>Una vez que Stripe apruebe la transacción, verás una pantalla de confirmación. <strong>No cierres la ventana</strong> hasta que se haya completado el proceso.</>} />
                                                    </ol>
                                                </div>

                                                <div className="pt-6 border-t border-slate-100">
                                                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-indigo-600" /> 3. Siguientes Pasos</h4>
                                                    <ol className="space-y-6">
                                                        <StepItem number="4" title="Revisa tu correo electrónico" description="Recibirás automáticamente la factura de Stripe y tu comprobante digital oficial de Udreamms." />
                                                        <StepItem number="5" title="Contacto Inmediato" description="Un asesor VIP se comunicará contigo por WhatsApp o correo en menos de 24 horas para comenzar la auditoría y proceso formal." />
                                                    </ol>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                                            {paymentMethod === 'card' && selectedPlan ? (
                                                <a href={planDetails[selectedPlan].stripeLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-bold text-white shadow-xl hover:scale-105 transition-all bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25">
                                                    Proceder al Pago Seguramente <ArrowRight className="w-5 h-5" />
                                                </a>
                                            ) : (
                                                <button className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-lg font-bold text-white shadow-xl hover:scale-105 transition-all bg-blue-600 hover:bg-blue-700 shadow-blue-600/25">
                                                    Generar Código QR <ArrowRight className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Support Section */}
                                        <div className="mt-12 p-6 md:p-8 bg-slate-50/80 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div className="text-center md:text-left">
                                                <p className="font-bold text-slate-900 text-lg mb-1">¿Tienes alguna duda o inconveniente con el pago?</p>
                                                <p className="text-sm text-slate-500 font-medium">Nuestro equipo de soporte está listo para ayudarte inmediatamente.</p>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                                <a href="https://wa.me/16507840581" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] font-bold hover:bg-[#25D366]/20 transition-colors text-sm w-full sm:w-auto">
                                                    <MessageCircle className="w-5 h-5" /> WhatsApp
                                                </a>
                                                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=payments@udreamms.com" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition-colors text-sm w-full sm:w-auto">
                                                    <Mail className="w-5 h-5" /> Correo
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </main>
            <Footer />
        </div>
    );
}

function StepItem({ number, title, description }: { number: string, title: string, description: React.ReactNode }) {
    return (
        <li className="flex gap-6 group">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-900 font-bold text-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                {number}
            </div>
            <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{title}</h4>
                <p className="text-slate-600 leading-relaxed">{description}</p>
            </div>
        </li>
    );
}
