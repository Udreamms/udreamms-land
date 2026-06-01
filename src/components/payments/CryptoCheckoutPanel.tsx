'use client';

import { useMemo, useState } from 'react';
import { Wallet, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QrTokenPayment from './QrTokenPayment';
import BillingForm, { BillingData } from './BillingForm';
import { PLAN_DISPLAY_TITLES, VISA_PLAN_CATALOG_USD } from '@/lib/payments/payment-config';
import type { VisaPlanId } from './visa-plan-types';

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
  const planTitle = PLAN_DISPLAY_TITLES[planId] ?? planId;

  const handlePaymentSuccess = (details: { requestId: string }) => {
    onSuccess({
      requestId: details.requestId,
      email: billingData?.email || '',
    });
  };

  return (
    <div
      className={`rounded-2xl md:rounded-[2rem] ring-1 ring-white/10 text-white overflow-hidden ${className}`}
    >
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-white/5 p-6 lg:p-8">
          <div className="max-w-[560px] w-full mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Udreamms Visa</p>
                <p className="text-lg font-medium text-white">{planTitle}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Datos de contacto</h3>
              <BillingForm onDataChange={setBillingData} onValidChange={setIsBillingValid} />
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-xs font-medium text-slate-500 mb-1.5">Total a pagar (crypto)</p>
              <h2 className="text-3xl font-medium tracking-tight text-white mb-6">
                USD {priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h2>

              <div className="space-y-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-xs font-medium text-slate-400">{planTitle}</span>
                  <span className="text-xs font-medium text-slate-200">
                    USD {priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-white">Total</span>
                  <span className="text-sm font-medium text-blue-400">
                    USD {priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-6 lg:p-8">
          <div className="max-w-[560px] w-full mx-auto">
            <h3 className="text-lg font-medium text-white mb-4">Método de pago</h3>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                  Solana Pay + Phantom
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generamos un código QR único vinculado a tu solicitud. Al confirmar el pago en mainnet,
                  Udreamms lo verifica automáticamente.
                </p>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-500 mb-3">Selecciona tu token</p>
            <Tabs defaultValue="usdc" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 rounded-xl p-1 mb-4 h-10">
                <TabsTrigger
                  value="usdc"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-400"
                >
                  USDC
                </TabsTrigger>
                <TabsTrigger
                  value="usdt"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-400"
                >
                  USDT
                </TabsTrigger>
                <TabsTrigger
                  value="sol"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-400"
                >
                  SOL
                </TabsTrigger>
                <TabsTrigger
                  value="lxr"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs font-bold rounded-lg text-slate-400"
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
