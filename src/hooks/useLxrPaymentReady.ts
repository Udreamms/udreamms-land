'use client';

import { useMemo } from 'react';
import {
  getLxrLaunchLabel,
  getLxrUsdPriceFallback,
  isLxrPaymentsForcedOn,
  LXR_MINT,
} from '@/lib/payments/payment-config';
import { usePriceFromJupiter, type JupiterPriceSource } from './usePriceFromJupiter';

export function useLxrPaymentReady() {
  const forcedOn = useMemo(() => isLxrPaymentsForcedOn(), []);
  const lxrUsdFallback = useMemo(() => getLxrUsdPriceFallback(), []);
  const priceFallbacks = useMemo(
    () => (lxrUsdFallback ? { [LXR_MINT]: lxrUsdFallback } : {}),
    [lxrUsdFallback]
  );

  const { prices, loading, sources } = usePriceFromJupiter([LXR_MINT], 60000, priceFallbacks);
  const usdPrice = prices[LXR_MINT];
  const source = (sources[LXR_MINT] ?? null) as JupiterPriceSource;
  const isLiveOnJupiter = source === 'jupiter-v3' || source === 'jupiter-quote';
  const ready = forcedOn || Boolean(usdPrice && usdPrice > 0);

  return {
    ready,
    loading,
    usdPrice,
    source,
    isLiveOnJupiter,
    launchLabel: getLxrLaunchLabel(),
  };
}
