"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import {
  CheckCircle2, CreditCard, Wallet, Plane, Star, Trophy,
  ArrowRight, ShieldCheck, MessageCircle, Mail,
  Smartphone, Monitor, Lock, Zap, GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  instructionsPageClass as s,
  StepHeader,
  InstructionGroup,
  StepItem,
} from "@/components/payments/instructions-payment-ui";

type PlanId = 'esencial' | 'pro' | 'elite' | 'allinclusive';
type PaymentMethod = 'crypto' | 'card' | null;

const planDetails: Record<PlanId, {
  normal: string; crypto: string; title: string; subtitle: string;
  icon: typeof Plane; stripeLink: string;
}> = {
  esencial: {
    normal: "$494", crypto: "$380",
    title: "Plan Esencial", subtitle: "Visa estudiantil básica",
    icon: Plane,
    stripeLink: "https://buy.stripe.com/00w4gzdoT734alQeqfenS0x"
  },
  pro: {
    normal: "$1,700", crypto: "$850",
    title: "Plan Pro", subtitle: "Visa con acompañamiento",
    icon: Star,
    stripeLink: "https://buy.stripe.com/00wdR93Ojafgdy2ci7enS0y"
  },
  elite: {
    normal: "$3,250", crypto: "$2,500",
    title: "Plan Elite", subtitle: "Gestión completa premium",
    icon: Trophy,
    stripeLink: "https://buy.stripe.com/bJe3cvfx1cnoeC6fujenS0z"
  },
  allinclusive: {
    normal: "$13,000", crypto: "$10,000",
    title: "Plan All-Inclusive", subtitle: "Experiencia total garantizada",
    icon: GraduationCap,
    stripeLink: "https://buy.stripe.com/bJe3cvfx1cnoeC6fujenS0z"
  }
};

const fadeInUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
};

function InstructionsContent() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

  const planParam = searchParams.get("plan") || "";

  useEffect(() => {
    const planVal = planParam.toLowerCase().replace("-", "") as PlanId;
    if (planVal && planDetails[planVal]) {
      setSelectedPlan(planVal);
    }
  }, [planParam]);

  const handlePlanSelect = (plan: PlanId) => {
    setSelectedPlan(plan);
    setPaymentMethod(null);
  };

  return (
    <div className={s.root}>
      <Header />

      <main className={s.main}>
        <div className={s.container}>

          <motion.div
            initial="hidden" animate="visible" variants={fadeInUp}
            className="text-center mb-16 md:mb-20"
          >
            <p className={s.eyebrow}>Visa de Estudiante · Proceso de Pago</p>
            <h1 className={s.h1}>
              Tu Futuro{" "}
              <span className={s.h1Accent}>Comienza Aquí</span>
            </h1>
            <p className={s.lead}>
              Has dado el primer paso hacia tu sueño americano. Sigue las instrucciones a continuación para asegurar tu plan de visa de estudiante.
            </p>
          </motion.div>

          {/* ── Step 1: Select Plan ── */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-20">
            <StepHeader number="1" label="Confirma tu Plan" />

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {(Object.entries(planDetails) as [PlanId, typeof planDetails[PlanId]][]).map(([id, plan]) => {
                const isSelected = selectedPlan === id;
                const Icon = plan.icon;
                return (
                  <motion.button
                    key={id}
                    variants={fadeInUp}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlanSelect(id)}
                    className={`${s.planCard} h-full flex flex-col ${isSelected ? s.planCardSelected : s.planCardDefault}`}
                  >
                    <Icon className={`${s.icon} mb-3`} strokeWidth={1.5} />
                    <h3 className="text-base font-medium mb-1 text-white leading-tight">{plan.title}</h3>
                    <p className="text-slate-500 text-xs font-normal mb-4 flex-1">{plan.subtitle}</p>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Desde</p>
                      <p className="text-xl font-medium text-white tracking-tighter">{plan.crypto}</p>
                    </div>
                    <span className={`mt-3 flex items-center gap-1.5 text-xs font-normal ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                      {isSelected && <CheckCircle2 className={s.iconSm} strokeWidth={1.5} />}
                      {isSelected ? 'Seleccionado' : 'Seleccionar'}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>

          {/* ── Step 2: Payment Method ── */}
          <AnimatePresence mode="wait">
            {selectedPlan && (
              <motion.div
                key="payment-method-step"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-20"
              >
                <StepHeader number="2" label="Elige tu Método de Pago" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('crypto')}
                    className={`${s.paymentCard} ${paymentMethod === 'crypto' ? s.paymentCardSelected : s.paymentCardDefault}`}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                      <Zap className={s.iconSm} strokeWidth={1.5} /> 30% descuento
                    </p>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Wallet className={s.icon} strokeWidth={1.5} />
                      <h3 className="text-xl font-medium text-white">Pagar con Crypto</h3>
                      {paymentMethod === 'crypto' && <CheckCircle2 className={`${s.icon} ml-auto`} strokeWidth={1.5} />}
                    </div>
                    <p className="text-slate-500 text-sm mb-4 font-normal">USDC · USDT · SOL · LXR</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total a pagar hoy</p>
                    <p className="text-3xl font-medium text-white tracking-tighter">{planDetails[selectedPlan].crypto}</p>
                    <p className="text-slate-500 text-xs mt-1 line-through">{planDetails[selectedPlan].normal}</p>
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('card')}
                    className={`${s.paymentCard} ${paymentMethod === 'card' ? s.paymentCardSelected : s.paymentCardDefault}`}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                      <ShieldCheck className={s.iconSm} strokeWidth={1.5} /> Pago seguro Stripe
                    </p>
                    <div className="flex items-center gap-2.5 mb-4">
                      <CreditCard className={s.icon} strokeWidth={1.5} />
                      <h3 className="text-xl font-medium text-white">Pagar con Tarjeta</h3>
                      {paymentMethod === 'card' && <CheckCircle2 className={`${s.icon} ml-auto`} strokeWidth={1.5} />}
                    </div>
                    <p className="text-slate-500 text-sm mb-4 font-normal">Visa · Mastercard · American Express</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total a pagar hoy</p>
                    <p className="text-3xl font-medium text-white tracking-tighter">{planDetails[selectedPlan].normal}</p>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Step 3: Instructions ── */}
          <AnimatePresence mode="wait">
            {paymentMethod && selectedPlan && (
              <motion.div
                key="instructions-step"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              >
                <StepHeader number="3" label="Sigue Estas Instrucciones" />

                <div className={s.instructionsWrap}>
                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                      {paymentMethod === 'crypto'
                        ? <Wallet className={s.icon} strokeWidth={1.5} />
                        : <CreditCard className={s.icon} strokeWidth={1.5} />}
                      <div>
                        <h3 className="text-xl font-medium text-white tracking-tight">
                          Pago vía {paymentMethod === 'crypto' ? 'Criptomonedas' : 'Tarjeta (Stripe)'}
                        </h3>
                        <p className="text-slate-400 text-sm font-normal mt-1">Sigue estos pasos para completar tu solicitud.</p>
                      </div>
                    </div>

                    {paymentMethod === 'crypto' ? (
                      <div className="space-y-8">
                        <InstructionGroup icon={Smartphone} title="1. En tu Celular">
                          <StepItem number="1" title="Descarga Phantom Wallet"
                            description={<>Abre la App Store o Google Play y descarga <strong className="text-white">Phantom</strong> (el ícono morado con un fantasma). Crea una nueva billetera o cuenta.</>} />
                          <StepItem number="2" title="Recarga tu Cuenta"
                            description={<>Fondea tu cuenta con la criptomoneda de tu preferencia (<strong className="text-white">USDC, USDT, SOL o LXR</strong>).<br /><span className="text-sm text-slate-500 mt-1 block">Si no encuentras LXR, usa el contrato: <code className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-xs text-slate-300 font-mono">7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth</code></span></>} />
                        </InstructionGroup>

                        <InstructionGroup icon={Monitor} title="2. En esta Página">
                          <StepItem number="3" title="Genera tu Código QR"
                            description={<>Haz clic en el botón de abajo <strong className="text-white">"Proceder al Pago Seguramente"</strong>. Llena tus datos, elige la moneda y se generará un código QR.</>} />
                        </InstructionGroup>

                        <InstructionGroup icon={Smartphone} title="3. De vuelta en tu Celular">
                          <StepItem number="4" title="Escanea y Paga"
                            description={<>En tu billetera, selecciona la moneda y busca el botón <strong className="text-white">"Enviar"</strong>. Usa la opción de escanear, escanea el QR y realiza tu pago. <strong className="text-white">Espera 5 segundos</strong> hasta la pantalla verde de "pago aprobado".</>} />
                        </InstructionGroup>

                        <InstructionGroup icon={CheckCircle2} title="4. Siguientes Pasos">
                          <StepItem number="5" title="Revisa tu correo electrónico"
                            description="Recibirás un comprobante digital oficial de Udreamms con tu número de orden." />
                          <StepItem number="6" title="Contacto Inmediato"
                            description="Un asesor VIP se comunicará contigo por WhatsApp o correo en menos de 24 horas para comenzar la auditoría." />
                        </InstructionGroup>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <InstructionGroup icon={Monitor} title="1. En esta Página">
                          <StepItem number="1" title="Ir a la Pasarela Segura"
                            description={<>Haz clic en el botón de abajo <strong className="text-white">"Proceder al Pago Seguramente"</strong>. Serás redirigido a la plataforma encriptada de Stripe.</>} />
                          <StepItem number="2" title="Ingresa tus Datos"
                            description={<>Completa el formulario con la información de tu <strong className="text-white">tarjeta de crédito o débito</strong>. Tu pago es procesado bajo los más altos estándares de seguridad bancaria.</>} />
                        </InstructionGroup>

                        <InstructionGroup icon={CheckCircle2} title="2. Confirmación Inmediata">
                          <StepItem number="3" title="Procesamiento Exitoso"
                            description={<>Una vez que Stripe apruebe la transacción, verás una pantalla de confirmación. <strong className="text-white">No cierres la ventana</strong> hasta que se haya completado el proceso.</>} />
                        </InstructionGroup>

                        <InstructionGroup icon={Smartphone} title="3. Siguientes Pasos">
                          <StepItem number="4" title="Revisa tu correo electrónico"
                            description="Recibirás automáticamente la factura de Stripe y tu comprobante digital oficial de Udreamms." />
                          <StepItem number="5" title="Contacto Inmediato"
                            description="Un asesor VIP se comunicará contigo por WhatsApp o correo en menos de 24 horas para comenzar la auditoría y proceso formal." />
                        </InstructionGroup>
                      </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                      {paymentMethod === 'card' && selectedPlan ? (
                        <a href={planDetails[selectedPlan].stripeLink} target="_blank" rel="noreferrer" className={s.ctaPrimary}>
                          <Lock className={s.icon} strokeWidth={1.5} />
                          Proceder al Pago Seguramente
                          <ArrowRight className={s.icon} strokeWidth={1.5} />
                        </a>
                      ) : (
                        <button type="button" className={s.ctaPrimary}>
                          <Wallet className={s.icon} strokeWidth={1.5} />
                          Generar Código QR
                          <ArrowRight className={s.icon} strokeWidth={1.5} />
                        </button>
                      )}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <p className="font-medium text-white mb-1">¿Tienes alguna duda con el pago?</p>
                        <p className="text-sm text-slate-400 font-normal">Nuestro equipo está listo para ayudarte.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <a href="https://wa.me/16507840581" target="_blank" rel="noreferrer" className={s.ctaPrimary}>
                          <MessageCircle className={s.iconSm} strokeWidth={1.5} /> WhatsApp
                        </a>
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=payments@udreamms.com" target="_blank" rel="noreferrer" className={s.ctaPrimary}>
                          <Mail className={s.iconSm} strokeWidth={1.5} /> Correo
                        </a>
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

export default function InstructionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <InstructionsContent />
    </Suspense>
  );
}
