"use client";

import { useCallback, useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CryptoCheckoutPanel from "@/components/payments/CryptoCheckoutPanel";
import {
  normalizeStudentPlanParam,
  type StudentVisaPlanId,
} from "@/components/payments/visa-plan-types";
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
  LimitedTimeTag,
} from "@/components/payments/instructions-payment-ui";

type PlanId = StudentVisaPlanId;
type PaymentMethod = 'crypto' | 'card' | null;

const PLANS_WITH_CRYPTO: PlanId[] = ['esencial', 'pro'];

const planDetails: Record<PlanId, {
  card: string; crypto: string | null;
  title: string; subtitle: string;
  icon: typeof Plane; stripeLink: string;
}> = {
  esencial: {
    card: "$380", crypto: "$299.99",
    title: "Plan Esencial", subtitle: "Visa estudiantil básica",
    icon: Plane,
    stripeLink: "https://buy.stripe.com/6oU14n84zcnoalQci7enS0F"
  },
  pro: {
    card: "$550", crypto: "$449.99",
    title: "Plan Pro", subtitle: "Visa con acompañamiento",
    icon: Star,
    stripeLink: "https://buy.stripe.com/fZuaEX1GbcnoeC64PFenS0G"
  },
  elite: {
    card: "$3,250", crypto: null,
    title: "Plan Elite", subtitle: "Gestión completa premium",
    icon: Trophy,
    stripeLink: "https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H"
  },
  allinclusive: {
    card: "$13,000", crypto: null,
    title: "Plan All-Inclusive", subtitle: "Experiencia total garantizada",
    icon: GraduationCap,
    stripeLink: "https://buy.stripe.com/bJeeVddoTafgeC695VenS0I"
  }
};

function createCheckoutSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

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
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [approvedOrder, setApprovedOrder] = useState<{ requestId: string; email: string } | null>(null);

  const planParam = searchParams.get("plan") || "";

  useEffect(() => {
    const planVal = normalizeStudentPlanParam(planParam);
    if (planVal) {
      setSelectedPlan(planVal);
      setPaymentMethod(null);
    }
  }, [planParam]);

  const ensureCheckoutSession = useCallback(() => {
    setCheckoutSessionId((current) => current ?? createCheckoutSessionId());
  }, []);

  const handlePlanSelect = (plan: PlanId) => {
    setSelectedPlan(plan);
    setPaymentMethod(null);
    setCheckoutSessionId(null);
    setPaymentApproved(false);
    setApprovedOrder(null);
  };

  const handleCryptoPaymentSuccess = useCallback((details: { requestId: string; email: string }) => {
    setPaymentApproved(true);
    setApprovedOrder(details);
  }, []);

  const checkoutPlanId = useMemo(() => selectedPlan, [selectedPlan]);
  const supportsCrypto = selectedPlan ? PLANS_WITH_CRYPTO.includes(selectedPlan) : false;
  const activePlan = selectedPlan ? planDetails[selectedPlan] : null;

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

        </div>

        {/* ── Step 1: Select Plan ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-24 md:mb-32 w-full px-4 sm:px-6 lg:px-10">
          <div className="max-w-[1550px] mx-auto w-full">
            <StepHeader number="1" label="Confirma tu Plan" />

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 w-full"
            >
              {(Object.entries(planDetails) as [PlanId, typeof planDetails[PlanId]][]).map(([id, plan]) => {
                const isSelected = selectedPlan === id;
                const Icon = plan.icon;
                const cardClass = `${s.planCardCentered} h-[250px] px-6 py-8 ${isSelected ? s.planCardSelected : s.planCardDefault}`;

                return (
                  <motion.button
                    key={id}
                    variants={fadeInUp}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlanSelect(id)}
                    className={cardClass}
                  >
                    <div className="flex flex-col items-center justify-between h-full w-full py-1 text-center">
                      <Icon className="w-8 h-8 text-white shrink-0" strokeWidth={1.5} />
                      <div>
                        <h3 className="text-lg font-medium text-white leading-tight">{plan.title}</h3>
                        <p className="text-xs text-slate-400 font-normal mt-1">{plan.subtitle}</p>
                      </div>

                      <div className="text-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-normal block mb-0.5">Desde</span>
                        <span className="text-3xl md:text-4xl font-normal text-white tracking-tight">{plan.card}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Step 2: Payment Method ── */}
        <AnimatePresence mode="wait">
          {selectedPlan && activePlan && (
            <motion.div
              key="payment-method-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-24 md:mb-32 w-full px-4 sm:px-6 lg:px-10"
            >
              <div className="max-w-[1550px] mx-auto w-full">
                <StepHeader number="2" label="Elige tu Método de Pago" />

                {supportsCrypto ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setPaymentMethod('crypto');
                        setPaymentApproved(false);
                        setApprovedOrder(null);
                        ensureCheckoutSession();
                      }}
                      className={`${s.paymentCardCentered} h-[250px] px-6 py-8 overflow-hidden ${paymentMethod === 'crypto' ? s.paymentCardSelected : s.paymentCardDefault}`}
                    >
                      <LimitedTimeTag />
                      <div className="flex flex-col items-center justify-between h-full w-full py-1 text-center">
                        <Wallet className="w-8 h-8 text-white shrink-0" strokeWidth={1.5} />
                        <div>
                          <h3 className="text-lg font-medium text-white leading-tight">Pagar con Crypto</h3>
                          <p className="text-xs text-slate-400 mt-1">USDC · USDT · SOL · LXR</p>
                        </div>

                        <div className="text-center flex items-baseline justify-center gap-2">
                          <span className="text-3xl md:text-4xl font-normal text-white tracking-tight">{activePlan.crypto}</span>
                          <span className="text-xs text-slate-500 line-through font-normal">{activePlan.card}</span>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setPaymentMethod('card'); setPaymentApproved(false); setApprovedOrder(null); }}
                      className={`${s.paymentCardCentered} h-[250px] px-6 py-8 ${paymentMethod === 'card' ? s.paymentCardSelected : s.paymentCardDefault}`}
                    >
                      <div className="flex flex-col items-center justify-between h-full w-full py-1 text-center">
                        <CreditCard className="w-8 h-8 text-white shrink-0" strokeWidth={1.5} />
                        <div>
                          <h3 className="text-lg font-medium text-white leading-tight">Pagar con Tarjeta</h3>
                          <p className="text-xs text-slate-400 mt-1">Visa · Mastercard · AMEX</p>
                        </div>

                        <div className="text-center">
                          <span className="text-3xl md:text-4xl font-normal text-white tracking-tight">{activePlan.card}</span>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                ) : (
                  <div className="w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${s.paymentCardCentered} h-[250px] px-6 py-8 ${s.paymentCardSelected}`}
                    >
                      <div className="flex flex-col items-center justify-between h-full w-full py-1 text-center">
                        <CreditCard className="w-8 h-8 text-white shrink-0" strokeWidth={1.5} />
                        <div>
                          <h3 className="text-base font-medium text-white leading-tight">Pagar con Tarjeta</h3>
                          <p className="text-xs text-slate-400 mt-1">Visa · Mastercard · AMEX</p>
                        </div>

                        <div className="text-center">
                          <span className="text-3xl md:text-4xl font-normal text-white tracking-tight">{activePlan.card}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={s.container}>

          {/* ── Payment Approved ── */}
          <AnimatePresence mode="wait">
            {paymentApproved && selectedPlan && approvedOrder && (
              <motion.div
                key="payment-success"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mb-20"
              >
                <div className="ring-1 ring-white/10 rounded-[2rem] bg-black p-8 md:p-12 text-center">
                  <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-4" strokeWidth={1.5} />
                  <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 tracking-tight">
                    ¡Pago aprobado!
                  </h2>
                  <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6 font-normal">
                    Tu transacción en Solana fue confirmada. Hemos registrado tu solicitud para el {planDetails[selectedPlan].title}.
                  </p>
                  <div className="text-left max-w-md mx-auto mb-6 border-t border-white/5 pt-6">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Número de orden</p>
                    <p className="text-sm font-mono text-slate-300 break-all">{approvedOrder.requestId}</p>
                    {approvedOrder.email && (
                      <p className="text-sm text-slate-500 mt-2">Comprobante enviado a: <span className="text-slate-300">{approvedOrder.email}</span></p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center text-slate-400 text-sm font-normal">
                    <div className="flex items-center gap-2">
                      <Mail className={s.iconSm} strokeWidth={1.5} />
                      Revisa tu correo para el comprobante oficial de Udreamms.
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className={s.iconSm} strokeWidth={1.5} />
                      Un asesor VIP te contactará en menos de 24 horas.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Step 3: Instructions & Summary ── */}
        <AnimatePresence mode="wait">
          {paymentMethod && selectedPlan && activePlan && !paymentApproved && (
            <motion.div
              key="instructions-step"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              className="mb-16 w-full px-4 sm:px-6 lg:px-10"
            >
              <div className="max-w-[1550px] mx-auto w-full">
                <StepHeader number="3" label="Sigue Estas Instrucciones y Completa tu Pago" />

                <div className="flex flex-col items-center justify-center text-center gap-2 mb-8 pb-2">
                  {paymentMethod === 'crypto'
                    ? <Wallet className={s.icon} strokeWidth={1.5} />
                    : <CreditCard className={s.icon} strokeWidth={1.5} />}
                  <div>
                    <h3 className="text-lg md:text-xl font-medium text-white tracking-tight">
                      Pago vía {paymentMethod === 'crypto' ? 'Criptomonedas' : 'Tarjeta (Stripe)'}
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm font-normal mt-0.5">Sigue estos pasos para completar tu solicitud de forma exitosa.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                  {/* Left Column: Instructions */}
                  <div className="space-y-6">
                    {paymentMethod === 'crypto' ? (
                      <div className="space-y-6">
                        <InstructionGroup icon={Smartphone} title="1. En tu Celular">
                          <StepItem number="1" title="Descarga Phantom Wallet"
                            description={<>Abre App Store o Google Play y descarga <strong className="text-white">Phantom</strong>. Crea una nueva billetera.</>} />
                          <StepItem number="2" title="Recarga tu Cuenta"
                            description={<>Fondea tu cuenta con <strong className="text-white">USDC, USDT, SOL o LXR</strong>.<br /><span className="text-xs text-slate-500 mt-1 block">Contrato LXR: <code className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs text-slate-300 font-mono">7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth</code></span></>} />
                        </InstructionGroup>

                        <InstructionGroup icon={Monitor} title="2. En la Tarjeta a la Derecha">
                          <StepItem number="3" title="Completa los Datos"
                            description={<>Ingresa tu nombre y correo en el panel resumen. Se generará tu código QR automático para escanear.</>} />
                        </InstructionGroup>

                        <InstructionGroup icon={Smartphone} title="3. Escanea y Paga">
                          <StepItem number="4" title="Confirmación rápida"
                            description={<>En tu billetera selecciona <strong className="text-white">"Enviar"</strong>, escanea el QR y confirma el pago. Espera unos segundos para ver la pantalla verde de aprobación.</>} />
                        </InstructionGroup>

                        <InstructionGroup icon={CheckCircle2} title="4. Siguientes Pasos">
                          <StepItem number="5" title="Comprobante Inmediato"
                            description="Recibirás tu número de orden y comprobante oficial. Un asesor VIP te contactará en menos de 24h." />
                        </InstructionGroup>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <InstructionGroup icon={Monitor} title="1. Pasarela de Pago">
                          <StepItem number="1" title="Haz clic en Pagar Plan"
                            description={<>Haz clic en el botón <strong className="text-white">"Pagar {activePlan.title} ({activePlan.card})"</strong> situado en la tarjeta de resumen a la derecha.</>} />
                          <StepItem number="2" title="Ingresa tus Datos en Stripe"
                            description={<>Serás redirigido a Stripe para ingresar los datos de tu tarjeta de débito o crédito de manera 100% encriptada y segura.</>} />
                        </InstructionGroup>

                        <InstructionGroup icon={CheckCircle2} title="2. Confirmación Inmediata">
                          <StepItem number="3" title="Procesamiento y Factura"
                            description={<>Al completarse el pago recibirás la factura oficial de Stripe y tu comprobante oficial de Udreamms.</>} />
                          <StepItem number="4" title="Contacto Asesor VIP"
                            description={<>Un asesor de Udreamms se comunicará contigo vía WhatsApp o correo en menos de 24 horas para dar inicio a tu proceso de visa.</>} />
                        </InstructionGroup>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Payment Box Summary */}
                  <div className="lg:sticky lg:top-28">
                    <div className="bg-transparent border border-white/10 rounded-3xl p-8 md:p-12 py-16 md:py-20 shadow-2xl backdrop-blur-md space-y-12 min-h-[580px] flex flex-col justify-between">
                      <div className="flex items-center justify-between pb-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-1">Resumen de Pedido</p>
                          <h4 className="text-lg md:text-xl font-medium text-white">{activePlan.title}</h4>
                          <p className="text-xs text-slate-400 font-normal">{activePlan.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total</p>
                          <p className="text-2xl md:text-3xl font-medium text-white tracking-tight">
                            {paymentMethod === 'crypto' ? activePlan.crypto : activePlan.card}
                          </p>
                          {paymentMethod === 'crypto' && (
                            <p className="text-xs text-slate-500 line-through">{activePlan.card}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Método de pago:</span>
                          <span className="text-slate-200 font-medium flex items-center gap-1.5">
                            {paymentMethod === 'crypto' ? (
                              <><Wallet className="w-3.5 h-3.5 text-white" /> Criptomonedas</>
                            ) : (
                              <><CreditCard className="w-3.5 h-3.5 text-white" /> Tarjeta (Stripe)</>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Soporte e inicio:</span>
                          <span className="text-slate-200 font-medium">Asesor VIP en &lt; 24h</span>
                        </div>
                      </div>

                      {paymentMethod === 'card' ? (
                        <div className="space-y-3 pt-2">
                          <a
                            href={activePlan.stripeLink}
                            target="_blank"
                            rel="noreferrer"
                            className={s.ctaPrimary}
                          >
                            <span>Pagar {activePlan.title} ({activePlan.card})</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </a>
                          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            Procesado de forma 100% segura por Stripe
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-2">
                          <a
                            href={`/crypto-pay?plan=${selectedPlan}`}
                            className={s.ctaPrimary}
                          >
                            <span>Pagar {activePlan.title} ({activePlan.crypto})</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </a>
                          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
                            Procesado de forma 100% segura en la red Solana
                          </p>
                        </div>
                      )}

                      <div className="pt-4 text-center">
                        <p className="text-xs text-slate-400 mb-3 font-normal">¿Tienes dudas antes de pagar?</p>
                        <div className="flex justify-center gap-2">
                          <a
                            href="https://wa.me/13858882799?text=Hola%2C%20tengo%20dudas%20con%20mi%20pago"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                          </a>
                          <a
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=payments@udreamms.com"
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" /> Correo
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
