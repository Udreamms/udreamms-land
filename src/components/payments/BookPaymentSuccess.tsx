'use client';

import Link from 'next/link';
import { CheckCircle2, LogIn, Mail } from 'lucide-react';

interface BookPaymentSuccessProps {
  email: string;
  paymentMethod: 'crypto' | 'card';
}

export default function BookPaymentSuccess({ email, paymentMethod }: BookPaymentSuccessProps) {
  const loginHref = `/login?mode=login&email=${encodeURIComponent(email)}`;

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 md:p-8 text-center space-y-5">
      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" strokeWidth={1.5} />
      <div className="space-y-2">
        <h3 className="text-xl md:text-2xl font-semibold text-white">¡Pago confirmado!</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          {paymentMethod === 'crypto'
            ? 'Tu pago en Solana fue verificado correctamente.'
            : 'Tu pago con tarjeta fue registrado correctamente.'}
          {' '}Ya desbloqueamos tu libro digital para el correo que usaste al pagar.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 inline-flex items-center gap-2 text-sm text-slate-300">
        <Mail className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          Accede con: <strong className="text-white">{email}</strong>
        </span>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <p className="text-sm text-slate-400 leading-relaxed">
          Ingresa a nuestro portal con el mismo correo electrónico que usaste para realizar el pago.
          Allí podrás leer y descargar tu libro digital de inmediato.
        </p>
        <Link
          href={loginHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black hover:bg-white/90 transition-all font-semibold py-4 px-6 text-sm"
        >
          <LogIn className="w-4 h-4" />
          Ir al portal con mi correo
        </Link>
        <p className="text-[11px] text-slate-500">
          Si aún no tienes cuenta, regístrate con el mismo correo: <span className="text-slate-400">{email}</span>
        </p>
      </div>
    </div>
  );
}
