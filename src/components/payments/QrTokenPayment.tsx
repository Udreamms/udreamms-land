'use client';

import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, CheckCircle2, Clock, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePriceFromJupiter } from '@/hooks/usePriceFromJupiter';
import { BillingData } from './BillingForm';
import {
  getPaymentConfig,
  getLxrUsdPriceFallback,
  type CryptoPaymentMethod,
} from '@/lib/payments/payment-config';

interface QrTokenPaymentProps {
  plan: string;
  priceUSD: number;
  paymentMethod: CryptoPaymentMethod;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  onSuccess: (details: { requestId: string; paymentSignature?: string | null }) => void;
  sessionId: string;
  billingData: BillingData | null;
  isBillingValid: boolean;
}

interface PaymentRequestState {
  requestId: string;
  qrUrl: string;
  expiresAt: string;
  reference: string;
  status: 'pending' | 'paid' | 'expired';
  paymentSignature?: string | null;
}

function toUiAndRawAmount(value: number, decimals: number) {
  const fixed = value.toFixed(decimals);
  const [integerPart, decimalPart = ''] = fixed.split('.');
  const uiAmount = fixed.replace(/\.?0+$/, '');
  const rawAmount = `${integerPart}${decimalPart}`.replace(/^0+/, '') || '0';

  return { uiAmount, rawAmount };
}

export default function QrTokenPayment({
  plan,
  priceUSD,
  paymentMethod,
  isProcessing,
  setIsProcessing,
  onSuccess,
  sessionId,
  billingData,
  isBillingValid,
}: QrTokenPaymentProps) {
  const config = useMemo(() => getPaymentConfig(paymentMethod), [paymentMethod]);
  const needsPriceFeed = paymentMethod !== 'usdc' && paymentMethod !== 'usdt';
  const priceMint = paymentMethod === 'sol' ? 'So11111111111111111111111111111111111111112' : config.mint;
  const lxrUsdFallback = useMemo(() => getLxrUsdPriceFallback(), []);
  const priceFallbacks = useMemo(() => {
    if (paymentMethod === 'lxr' && config.mint && lxrUsdFallback) {
      return { [config.mint]: lxrUsdFallback };
    }
    return {};
  }, [config.mint, lxrUsdFallback, paymentMethod]);
  const { prices, loading: loadingPrice, secondsRemaining } = usePriceFromJupiter(
    needsPriceFeed && priceMint ? [priceMint] : [],
    60000,
    priceFallbacks
  );
  const quotedTokenPrice = priceMint ? prices[priceMint] : 1;
  const isStable = paymentMethod === 'usdc' || paymentMethod === 'usdt';
  const paymentAmount = isStable ? priceUSD : quotedTokenPrice ? priceUSD / quotedTokenPrice : null;
  const preciseAmount = paymentAmount ? toUiAndRawAmount(paymentAmount, config.decimals) : null;

  const [paymentRequest, setPaymentRequest] = useState<PaymentRequestState | null>(null);
  const [secondsUntilExpiry, setSecondsUntilExpiry] = useState(0);
  const [lastGenerationKey, setLastGenerationKey] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentRequest?.expiresAt) {
      setSecondsUntilExpiry(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((new Date(paymentRequest.expiresAt).getTime() - Date.now()) / 1000)
      );
      setSecondsUntilExpiry(remaining);
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [paymentRequest?.expiresAt]);

  useEffect(() => {
    if (!paymentRequest?.requestId || paymentRequest.status !== 'pending') {
      return;
    }

    let cancelled = false;

    const pollServerStatus = async () => {
      const params = new URLSearchParams({
        sessionId,
        requestId: paymentRequest.requestId,
      });
      const response = await fetch(`/api/payments/qr/status?${params.toString()}`);
      if (!response.ok) return null;
      return response.json() as Promise<{ status: string; paymentSignature?: string | null }>;
    };

    const pollStatus = async () => {
      try {
        const serverStatus = await pollServerStatus();
        if (serverStatus?.status === 'paid') {
          if (!cancelled) {
            setPaymentRequest((current) =>
              current ? { ...current, status: 'paid', paymentSignature: serverStatus.paymentSignature } : current
            );
            toast.success('Pago confirmado en Solana.');
            onSuccess({
              requestId: paymentRequest.requestId,
              paymentSignature: serverStatus.paymentSignature,
            });
          }
          return;
        }

        if (Date.now() > new Date(paymentRequest.expiresAt).getTime()) {
          const recoverResponse = await fetch('/api/payments/qr/recover', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId,
              requestId: paymentRequest.requestId,
            }),
          });

          if (recoverResponse.ok) {
            const recoverData = await recoverResponse.json();
            if (recoverData.success) {
              if (!cancelled) {
                toast.success('Pago encontrado y confirmado.');
                onSuccess({
                  requestId: paymentRequest.requestId,
                  paymentSignature: recoverData.paymentSignature,
                });
              }
              return;
            }
          }

          if (!cancelled) {
            setPaymentRequest((current) =>
              current ? { ...current, status: 'expired' } : current
            );
            toast.error('Este código QR expiró. Genera uno nuevo para continuar.');
          }
          return;
        }
      } catch (error) {
        console.error('QR payment status polling failed:', error);
      }
    };

    pollStatus();
    const intervalId = window.setInterval(pollStatus, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [onSuccess, paymentRequest, sessionId]);

  const generationKey = useMemo(() => {
    if (!billingData || !isBillingValid || !preciseAmount) {
      return null;
    }

    return JSON.stringify({
      sessionId,
      plan,
      paymentMethod,
      amount: preciseAmount.uiAmount,
      email: billingData.email,
      fullName: billingData.fullName,
      zipCode: billingData.zipCode,
    });
  }, [billingData, isBillingValid, paymentMethod, plan, preciseAmount, sessionId]);

  const handleGenerateQr = async (auto = false) => {
    if (!billingData || !isBillingValid) {
      if (!auto) {
        toast.error('Completa tus datos de facturación primero');
      }
      return;
    }

    if (!sessionId) {
      if (!auto) {
        toast.error('Sesión de pago no válida. Recarga la página e intenta de nuevo.');
      }
      return;
    }

    if (priceUSD <= 0) {
      if (!auto) {
        toast.error('Monto de pago inválido');
      }
      return;
    }

    if (!preciseAmount) {
      if (!auto) {
        toast.error(`No se pudo calcular el monto en ${config.label}`);
      }
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          plan,
          paymentMethod,
          chargeUSD: priceUSD,
          expectedAmountUi: preciseAmount.uiAmount,
          expectedAmountRaw: preciseAmount.rawAmount,
          billingData: billingData || null,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'No se pudo crear el código QR en el servidor');
      }

      const created = await response.json();

      setPaymentRequest({
        requestId: created.requestId,
        qrUrl: created.qrUrl,
        expiresAt: created.expiresAt,
        reference: created.reference,
        status: 'pending',
        paymentSignature: null,
      });
      if (generationKey) {
        setLastGenerationKey(generationKey);
      }

      if (!auto) {
        toast.success('Código QR de Phantom generado');
      }
    } catch (error: unknown) {
      console.error('QR generation error:', error);
      if (!auto) {
        const message = error instanceof Error ? error.message : 'No se pudo generar el código QR';
        toast.error(message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!generationKey || isProcessing) {
      return;
    }

    if (paymentRequest && paymentRequest.status !== 'expired' && lastGenerationKey === generationKey) {
      return;
    }

    if (lastGenerationKey === generationKey && paymentRequest?.status === 'expired') {
      return;
    }

    handleGenerateQr(true);
  }, [generationKey, isProcessing, lastGenerationKey, paymentRequest]);

  const showPriceLoader = needsPriceFeed && loadingPrice;

  return (
    <div className="space-y-3">
      {showPriceLoader ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
          <span className="text-sm text-slate-500">Obteniendo precio de {config.label}...</span>
        </div>
      ) : preciseAmount ? (
        <>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <p className="text-xs text-blue-700 font-medium">
              {paymentMethod === 'usdc' || paymentMethod === 'usdt'
                ? 'Monto fijo en stablecoin'
                : `Cotización actualizada cada ${secondsRemaining}s`}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Monto en USD</span>
              <span className="text-sm font-semibold text-slate-900">${priceUSD.toFixed(2)}</span>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Escanea y paga</span>
              <span className="text-lg font-bold text-blue-600">
                {preciseAmount.uiAmount} {config.label}
              </span>
            </div>
          </div>

          {paymentRequest ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-900">QR listo</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Escanea con Phantom en tu celular para completar el pago en Solana mainnet.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleGenerateQr(false)}
                  disabled={isProcessing}
                  className="h-8 px-3 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Actualizar
                </Button>
              </div>

              <div className="bg-white rounded-2xl p-4 flex justify-center border border-slate-100 shadow-inner">
                <QRCodeSVG value={paymentRequest.qrUrl} size={190} bgColor="#ffffff" fgColor="#0f172a" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Estado</p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs font-medium text-slate-800">
                    {paymentRequest.status === 'paid' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        Pago confirmado
                      </>
                    ) : paymentRequest.status === 'expired' ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                        QR expirado
                      </>
                    ) : (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        Esperando pago en Phantom
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Expira</p>
                  <p className="mt-1.5 text-xs font-medium text-slate-800">
                    {secondsUntilExpiry > 0 ? `${secondsUntilExpiry}s restantes` : 'Expirado'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-700">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Usa Phantom en tu celular</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">
                  Escanea el QR desde Phantom, aprueba la transacción y verificaremos el pago automáticamente.
                </p>
                <a
                  href={paymentRequest.qrUrl}
                  className="inline-flex text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Abrir enlace de pago
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <div className="bg-white rounded-2xl p-4 flex items-center justify-center min-h-[216px] border border-slate-100">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <p className="text-xs text-slate-500">Generando tu código QR único...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Smartphone className="w-6 h-6 text-slate-400" />
                    <p className="text-xs text-slate-500">
                      {isBillingValid
                        ? 'Preparando tu QR automáticamente...'
                        : 'Completa tus datos para generar el QR'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isBillingValid && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs font-medium text-amber-800">Completa tus datos de facturación para continuar</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-red-600 py-4 space-y-2">
          <p className="font-medium">Error al cargar el precio de {config.label}</p>
          {paymentMethod === 'lxr' && !lxrUsdFallback ? (
            <p className="text-xs text-red-500/90 max-w-sm mx-auto">
              Jupiter no publica cotización para LXR. Configura{' '}
              <code className="bg-red-50 px-1 rounded text-red-700">NEXT_PUBLIC_LXR_USD_PRICE</code> en tu entorno o paga con USDC, USDT o SOL.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
