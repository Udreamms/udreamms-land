"use client";

import { useCallback, useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import CryptoCheckoutPanel from "@/components/payments/CryptoCheckoutPanel";
import {
  normalizeTouristPlanParam,
  normalizeStudentPlanParam,
  type VisaPlanId,
} from "@/components/payments/visa-plan-types";
import {
  CheckCircle2, ArrowLeft, ShieldCheck, MessageCircle, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PLAN_TITLES: Record<string, string> = {
  basico: "Plan Básico (Turismo)",
  premium: "Plan Premium (Turismo)",
  vip: "Experiencia VIP (Turismo)",
  esencial: "Plan Esencial (Estudiantil)",
  pro: "Plan Pro (Estudiantil)",
  elite: "Plan Elite (Estudiantil)",
  allinclusive: "Plan All-Inclusive (Estudiantil)",
};

function createCheckoutSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function CryptoPayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan") || "basico";

  const resolvedPlanId = useMemo<VisaPlanId>(() => {
    const studentVal = normalizeStudentPlanParam(planParam);
    if (studentVal) return studentVal;
    const touristVal = normalizeTouristPlanParam(planParam);
    if (touristVal) return touristVal;
    return "basico";
  }, [planParam]);

  const [checkoutSessionId, setCheckoutSessionId] = useState<string>('');
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [approvedOrder, setApprovedOrder] = useState<{ requestId: string; email: string } | null>(null);

  useEffect(() => {
    setCheckoutSessionId(createCheckoutSessionId());
  }, []);

  const handleCryptoPaymentSuccess = useCallback((details: { requestId: string; email: string }) => {
    setPaymentApproved(true);
    setApprovedOrder(details);
  }, []);

  const planTitle = PLAN_TITLES[resolvedPlanId] || resolvedPlanId;

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-200" suppressHydrationWarning>
      <Header />

      <main className="pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto w-full">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Volver a las instrucciones
          </button>

          <AnimatePresence mode="wait">
            {paymentApproved && approvedOrder ? (
              <motion.div
                key="payment-success"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <div className="ring-1 ring-white/10 rounded-[2rem] bg-slate-950 p-8 md:p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" strokeWidth={1.5} />
                  <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 tracking-tight">
                    ¡Pago aprobado!
                  </h2>
                  <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6 font-normal">
                    Tu transacción en criptomoneda fue confirmada exitosamente. Hemos registrado tu solicitud para el <strong className="text-white">{planTitle}</strong>.
                  </p>
                  <div className="text-left max-w-md mx-auto mb-6 border-t border-white/10 pt-6">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Número de orden</p>
                    <p className="text-sm font-mono text-slate-300 break-all">{approvedOrder.requestId}</p>
                    {approvedOrder.email && (
                      <p className="text-sm text-slate-500 mt-2">Comprobante enviado a: <span className="text-slate-300">{approvedOrder.email}</span></p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center text-slate-400 text-sm font-normal">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                      Revisa tu correo para la confirmación.
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                      Un asesor VIP te contactará en &lt; 24h.
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="crypto-checkout-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-10">
                  <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">Pasarela de Pago Crypto</p>
                  <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                    Pagar con <span className="font-normal text-white">Criptomonedas</span>
                  </h1>
                </div>

                <CryptoCheckoutPanel
                  planId={resolvedPlanId}
                  sessionId={checkoutSessionId}
                  onSuccess={handleCryptoPaymentSuccess}
                  className="w-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CryptoPayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CryptoPayContent />
    </Suspense>
  );
}
