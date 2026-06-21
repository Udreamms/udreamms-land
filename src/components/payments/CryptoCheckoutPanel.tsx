'use client';

import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import BillingForm, { BillingData } from './BillingForm';
import CryptoPaymentTabs from './CryptoPaymentTabs';
import { PLAN_DISPLAY_TITLES, VISA_PLAN_CATALOG_USD } from '@/lib/payments/payment-config';
import type { VisaPlanId } from './visa-plan-types';

export interface CryptoCheckoutPanelProps {
  planId: VisaPlanId;
  sessionId: string;
  onSuccess: (details: { requestId: string; email: string }) => void;
  className?: string;
  compact?: boolean;
}

export default function CryptoCheckoutPanel({
  planId,
  sessionId,
  onSuccess,
  className = '',
  compact = false,
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

  const priceFormatted = priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div
      className={`rounded-2xl ring-1 ring-white/10 text-white overflow-visible ${compact ? 'md:rounded-3xl' : 'md:rounded-[2rem]'} ${className}`}
    >
      <div className={`flex flex-col ${compact ? 'md:flex-row' : 'lg:flex-row'}`}>
        <div className={`w-full ${compact ? 'md:w-1/2 p-4 md:p-5 border-b md:border-b-0 md:border-r border-white/5' : 'lg:w-1/2 border-b lg:border-b-0 lg:border-r border-white/5 p-6 lg:p-8'}`}>
          <div className={`w-full mx-auto ${compact ? 'max-w-none' : 'max-w-[560px]'}`}>
            <div className={`flex items-center gap-3 ${compact ? 'mb-4' : 'mb-6'}`}>
              <div className={`rounded-2xl bg-white/5 flex items-center justify-center shrink-0 ${compact ? 'w-8 h-8' : 'w-10 h-10'}`}>
                <Wallet className={`text-blue-400 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </div>
              <div>
                <p className={`font-bold uppercase tracking-wider text-blue-400 ${compact ? 'text-[10px]' : 'text-xs'}`}>Udreamms Visa</p>
                <p className={`font-medium text-white ${compact ? 'text-sm' : 'text-lg'}`}>{planTitle}</p>
              </div>
            </div>

            <div className={compact ? 'mb-4' : 'mb-8'}>
              <h3 className={`font-medium text-white ${compact ? 'text-sm mb-3' : 'text-lg mb-4'}`}>Información de contacto</h3>
              <BillingForm onDataChange={setBillingData} onValidChange={setIsBillingValid} />
            </div>

            <div className={`border-t border-white/10 ${compact ? 'pt-4' : 'pt-6'}`}>
              <p className="text-xs font-medium text-slate-500 mb-1.5">Total a pagar (crypto)</p>
              <h2 className={`font-medium tracking-tight text-white ${compact ? 'text-2xl mb-4' : 'text-3xl mb-6'}`}>
                USD {priceFormatted}
              </h2>

              <div className="space-y-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-xs font-medium text-slate-400">{planTitle}</span>
                  <span className="text-xs font-medium text-slate-200">USD {priceFormatted}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-white">Total</span>
                  <span className="text-sm font-medium text-blue-400">USD {priceFormatted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`w-full ${compact ? 'md:w-1/2 p-4 md:p-5' : 'lg:w-1/2 p-6 lg:p-8'}`}>
          <div className={`w-full mx-auto ${compact ? 'max-w-none' : 'max-w-[560px]'}`}>
            <h3 className={`font-medium text-white ${compact ? 'text-sm mb-3' : 'text-lg mb-4'}`}>Método de pago</h3>

            <div className={`flex flex-col items-center text-center ${compact ? 'mb-4' : 'mb-6'}`}>
              <img
                src="/images/phantom-logo.png"
                alt="Phantom Wallet"
                className={`w-auto mx-auto ${compact ? 'h-8 mb-3' : 'h-10 md:h-14 mb-5'}`}
              />
              <p className={`text-slate-400 leading-relaxed max-w-sm mx-auto ${compact ? 'text-xs' : 'text-sm'}`}>
                Descarga esta app en Play Store o App Store, recarga tu cuenta y escanea el siguiente código para pagar.
              </p>
            </div>

            <p className="text-xs font-medium text-slate-500 mb-3">Selecciona tu token</p>
            <CryptoPaymentTabs
              plan={planId}
              priceUSD={priceUSD}
              sessionId={sessionId}
              billingData={billingData}
              isBillingValid={isBillingValid}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              onSuccess={handlePaymentSuccess}
              compact={compact}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
