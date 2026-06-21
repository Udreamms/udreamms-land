'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QrTokenPayment from './QrTokenPayment';
import { type BillingData } from './BillingForm';
import { getLxrLaunchLabel } from '@/lib/payments/payment-config';
import { useLxrPaymentReady } from '@/hooks/useLxrPaymentReady';
import type { CryptoPaymentMethod } from '@/lib/payments/payment-config';

const BASE_PAYMENT_METHODS = ['usdc', 'usdt', 'sol'] as const;

interface CryptoPaymentTabsProps {
  plan: string;
  priceUSD: number;
  sessionId: string;
  billingData: BillingData | null;
  isBillingValid: boolean;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  onSuccess: (details: { requestId: string; paymentSignature?: string | null }) => void;
  compact?: boolean;
  accent?: 'blue' | 'purple';
}

export default function CryptoPaymentTabs({
  plan,
  priceUSD,
  sessionId,
  billingData,
  isBillingValid,
  isProcessing,
  setIsProcessing,
  onSuccess,
  compact = false,
  accent = 'blue',
}: CryptoPaymentTabsProps) {
  const { ready: lxrReady } = useLxrPaymentReady();
  const lxrLaunchLabel = getLxrLaunchLabel();
  const activeAccent =
    accent === 'purple'
      ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white'
      : 'data-[state=active]:bg-blue-600 data-[state=active]:text-white';

  const paymentMethods = useMemo(
    () =>
      lxrReady
        ? ([...BASE_PAYMENT_METHODS, 'lxr'] as CryptoPaymentMethod[])
        : ([...BASE_PAYMENT_METHODS] as CryptoPaymentMethod[]),
    [lxrReady]
  );

  return (
    <Tabs defaultValue="usdc" className="w-full">
      <TabsList
        className={`grid w-full bg-white/5 border border-white/10 rounded-xl p-1 mb-4 ${compact ? 'h-9' : 'h-10'} ${paymentMethods.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}
      >
        {paymentMethods.map((method) => (
          <TabsTrigger
            key={method}
            value={method}
            className={`${activeAccent} text-xs font-bold rounded-lg text-slate-400`}
          >
            {method.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>

      {!lxrReady ? (
        <p className="text-xs text-slate-500 text-center mb-4">
          LXR estará disponible en {lxrLaunchLabel}.
        </p>
      ) : null}

      {paymentMethods.map((method) => (
        <TabsContent key={method} value={method}>
          <QrTokenPayment
            plan={plan}
            priceUSD={priceUSD}
            paymentMethod={method}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            onSuccess={onSuccess}
            sessionId={sessionId}
            billingData={billingData}
            isBillingValid={isBillingValid}
            compact={compact}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export type { BillingData };
