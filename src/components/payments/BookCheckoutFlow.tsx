'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import CryptoCheckoutPanel from '@/components/payments/CryptoCheckoutPanel';
import BookPaymentSuccess from '@/components/payments/BookPaymentSuccess';

export interface BookFormData {
  nombre: string;
  apellido: string;
  email: string;
}

type PaymentMethod = 'crypto' | 'card' | null;

function createCheckoutSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

interface BookCheckoutFlowProps {
  formData: BookFormData;
  autoStart?: boolean;
  onReset?: () => void;
}

export default function BookCheckoutFlow({ formData, autoStart = false, onReset }: BookCheckoutFlowProps) {
  const [started, setStarted] = useState(autoStart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [approvedEmail, setApprovedEmail] = useState('');
  const [approvedMethod, setApprovedMethod] = useState<'crypto' | 'card'>('crypto');
  const [stripeRedirecting, setStripeRedirecting] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const stripeReturnHandled = useRef(false);

  const fullName = useMemo(
    () => `${formData.nombre} ${formData.apellido}`.trim(),
    [formData.nombre, formData.apellido]
  );
  const email = formData.email.trim();

  const ensureCheckoutSession = useCallback(() => {
    setCheckoutSessionId((current) => current ?? createCheckoutSessionId());
  }, []);

  const handleCryptoSuccess = useCallback(
    (details: { requestId: string; email: string }) => {
      setPaymentApproved(true);
      setApprovedEmail(details.email || email);
      setApprovedMethod('crypto');
    },
    [email]
  );

  const confirmStripeSession = useCallback(async (sessionId: string) => {
    const response = await fetch('/api/payments/stripe/confirm-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.error || 'No se pudo confirmar el pago.');
    }
    setPaymentApproved(true);
    setApprovedEmail(data.email || email);
    setApprovedMethod('card');
  }, [email]);

  const handleStartStripeCheckout = useCallback(async () => {
    if (!email.includes('@')) return;
    setStripeRedirecting(true);
    setStripeError(null);
    try {
      const origin = window.location.origin;
      const successUrl = `${origin}/visas/student/book?stripe=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/visas/student/book?stripe=cancelled`;

      const response = await fetch('/api/payments/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          itemIds: ['libro-estudiante'],
          successUrl,
          cancelUrl,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo iniciar el pago en Stripe.');
      }
      window.location.href = data.url;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar el pago.';
      setStripeError(message);
      setStripeRedirecting(false);
    }
  }, [email]);

  useEffect(() => {
    if (!started || paymentApproved || stripeReturnHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (params.get('stripe') !== 'success' || !sessionId) return;

    stripeReturnHandled.current = true;
    setPaymentMethod('card');

    void (async () => {
      try {
        await confirmStripeSession(sessionId);
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'No se pudo confirmar el pago.';
        setStripeError(message);
      }
    })();
  }, [started, paymentApproved, confirmStripeSession]);

  if (paymentApproved) {
    return (
      <BookPaymentSuccess
        email={approvedEmail || email}
        paymentMethod={approvedMethod}
      />
    );
  }

  if (!started) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 space-y-6"
    >
      <div className="text-center space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-500">Paso final</p>
        <h3 className="text-lg md:text-xl font-semibold text-white">Elige cómo quieres pagar $29.99 USD</h3>
        <p className="text-xs text-slate-400">
          Usaremos <span className="text-slate-300">{email}</span> para desbloquear tu libro en el portal.
        </p>
      </div>

      {!paymentMethod ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('crypto');
              ensureCheckoutSession();
            }}
            className="rounded-2xl border border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all p-5 text-left space-y-3"
          >
            <Wallet className="w-6 h-6 text-purple-400" />
            <div>
              <p className="font-semibold text-white">Pagar con Crypto</p>
              <p className="text-xs text-slate-400 mt-1">USDC · USDT · SOL · LXR</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className="rounded-2xl border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all p-5 text-left space-y-3"
          >
            <CreditCard className="w-6 h-6 text-blue-400" />
            <div>
              <p className="font-semibold text-white">Pagar con Tarjeta</p>
              <p className="text-xs text-slate-400 mt-1">Stripe · Visa · Mastercard · Amex</p>
            </div>
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={paymentMethod}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                Método:{' '}
                <span className="text-white font-medium">
                  {paymentMethod === 'crypto' ? 'Criptomonedas' : 'Tarjeta (Stripe)'}
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod(null);
                  setStripeError(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Cambiar método
              </button>
            </div>

            {paymentMethod === 'crypto' && checkoutSessionId ? (
              <CryptoCheckoutPanel
                planId="libro-estudiante"
                sessionId={checkoutSessionId}
                onSuccess={handleCryptoSuccess}
                compact
                className="w-full"
                initialEmail={email}
                initialFullName={fullName}
              />
            ) : null}

            {paymentMethod === 'card' ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 space-y-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>
                      1. Haz clic en <strong className="text-white">Pagar en Stripe</strong> y completa el pago de $29.99 USD.
                    </p>
                    <p>
                      2. Usa el correo <strong className="text-white">{email}</strong> en Stripe (ya está prellenado).
                    </p>
                    <p>
                      3. Al volver, confirmamos automáticamente y desbloqueamos tu libro en el portal.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleStartStripeCheckout()}
                  disabled={stripeRedirecting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black hover:bg-white/90 transition-all font-semibold py-3.5 px-5 text-sm disabled:opacity-60"
                >
                  {stripeRedirecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  {stripeRedirecting ? 'Redirigiendo a Stripe...' : 'Pagar $29.99 en Stripe'}
                  {!stripeRedirecting ? <ArrowRight className="w-4 h-4" /> : null}
                </button>

                {stripeError ? (
                  <p className="text-xs text-amber-400/90 text-center leading-relaxed">{stripeError}</p>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      )}

      {onReset ? (
        <div className="text-center">
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Editar mis datos
          </button>
        </div>
      ) : null}
    </motion.div>
  );
}
