'use client';

import { useMemo, useState } from 'react';
import { Wallet, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QrTokenPayment from './QrTokenPayment';
import BillingForm, { BillingData } from './BillingForm';
import { VISA_PLAN_CATALOG_USD } from '@/lib/payments/payment-config';
import type { VisaPlanId } from './CryptoCheckoutModal';

const PLAN_TITLES: Record<VisaPlanId, string> = {
  basico: 'Plan Básico',
  premium: 'Plan Premium',
  vip: 'Experiencia VIP',
};

export interface CryptoCheckoutPanelProps {
  planId: VisaPlanId;
  sessionId: string;
  onSuccess: (details: { requestId: string; email: string }) => void;
  className?: string;
}

export default function CryptoCheckoutPanel({
  planId,
  sessionId,
  onSuccess,
  className = '',
}: CryptoCheckoutPanelProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isBillingValid, setIsBillingValid] = useState(false);

  const priceUSD = useMemo(() => VISA_PLAN_CATALOG_USD[planId] ?? 0, [planId]);
  const planTitle = PLAN_TITLES[planId];

  const handlePaymentSuccess = (details: { requestId: string }) => {
    onSuccess({
      requestId: details.requestId,
      email: billingData?.email || '',
    });
  };

  return (
    <div
      className={`rounded-2xl md:rounded-[2rem] border border-slate-100 bg-white text-slate-900 overflow-hidden shadow-lg shadow-slate-200/40 ${className}`}
    >
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-100 p-6 lg:p-8">
          <div className="max-w-[560px] w-full mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Udreamms Visa</p>
                <p className="text-lg font-bold text-slate-900">{planTitle}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Datos de contacto</h3>
              <BillingForm onDataChange={setBillingData} onValidChange={setIsBillingValid} />
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-1.5">Total a pagar (crypto)</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
                USD {priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>

              <div className="space-y-2 rounded-xl bg-slate-50/80 border border-slate-100 p-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-600">{planTitle}</span>
                  <span className="text-xs font-semibold text-slate-900">
                    USD {priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-bold text-slate-900">Total</span>
                  <span className="text-sm font-bold text-blue-600">
                    USD {priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-6 lg:p-8 bg-slate-50/40">
          <div className="max-w-[560px] w-full mx-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Método de pago</h3>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                  Solana Pay + Phantom
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generamos un código QR único vinculado a tu solicitud. Al confirmar el pago en mainnet,
                  Udreamms lo verifica automáticamente.
                </p>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-500 mb-3">Selecciona tu token</p>
            <Tabs defaultValue="usdc" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 rounded-xl p-1 mb-4 h-10 shadow-sm">
                <TabsTrigger
                  value="usdc"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-600"
                >
                  USDC
                </TabsTrigger>
                <TabsTrigger
                  value="usdt"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-600"
                >
                  USDT
                </TabsTrigger>
                <TabsTrigger
                  value="sol"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-600"
                >
                  SOL
                </TabsTrigger>
                <TabsTrigger
                  value="lxr"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-600"
                >
                  LXR
                </TabsTrigger>
              </TabsList>

              {(['usdc', 'usdt', 'sol', 'lxr'] as const).map((method) => (
                <TabsContent key={method} value={method}>
                  <QrTokenPayment
                    plan={planId}
                    priceUSD={priceUSD}
                    paymentMethod={method}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    onSuccess={handlePaymentSuccess}
                    sessionId={sessionId}
                    billingData={billingData}
                    isBillingValid={isBillingValid}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
