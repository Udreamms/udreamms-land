'use client';

import { useEffect, useMemo, useState } from 'react';
import { Keypair } from '@solana/web3.js';
import { AlertCircle, CheckCircle2, Clock, Loader2, RefreshCw, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePriceFromJupiter } from '@/hooks/usePriceFromJupiter';
import { BillingData } from './BillingForm';
import BrandedQrCode from './BrandedQrCode';
import WalletCopyButton from './WalletCopyButton';
import {
  getPaymentConfig,
  getLxrLaunchLabel,
  getLxrUsdPriceFallback,
  SOL_MINT,
  TREASURY_WALLET,
  type CryptoPaymentMethod,
} from '@/lib/payments/payment-config';
import { encodeCompactSolanaPayQrUrl } from '@/lib/payments/solana-pay';

interface QrTokenPaymentProps {
  plan: string;
  cartItems?: string[];
  priceUSD: number;
  paymentMethod: CryptoPaymentMethod;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  onSuccess: (details: { requestId: string; paymentSignature?: string | null }) => void;
  sessionId: string;
  billingData: BillingData | null;
  isBillingValid: boolean;
  compact?: boolean;
  theme?: 'light' | 'dark';
  userId?: string;
}

interface PaymentRequestState {
  requestId: string;
  qrUrl: string;
  expiresAt: string;
  reference: string;
  recipientWallet: string;
  status: 'pending' | 'paid' | 'expired';
  paymentSignature?: string | null;
  isLocalFallback?: boolean;
}

function createLocalFallbackPaymentRequest({
  sessionId,
  preciseAmount,
  config,
}: {
  sessionId: string;
  preciseAmount: { uiAmount: string };
  config: ReturnType<typeof getPaymentConfig>;
}): PaymentRequestState {
  const reference = Keypair.generate().publicKey.toBase58();
  const qrUrl = encodeCompactSolanaPayQrUrl({
    recipient: TREASURY_WALLET,
    amount: preciseAmount.uiAmount,
    splToken: config.mint,
    reference,
  });

  return {
    requestId: `local_${Date.now()}`,
    qrUrl,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    reference,
    recipientWallet: TREASURY_WALLET,
    status: 'pending',
    paymentSignature: null,
    isLocalFallback: true,
  };
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
  cartItems,
  priceUSD,
  paymentMethod,
  isProcessing,
  setIsProcessing,
  onSuccess,
  sessionId,
  billingData,
  isBillingValid,
  compact = false,
  theme = 'dark',
  userId,
}: QrTokenPaymentProps) {
  const isLight = theme === 'light';
  const config = useMemo(() => getPaymentConfig(paymentMethod), [paymentMethod]);
  const needsPriceFeed = paymentMethod !== 'usdc' && paymentMethod !== 'usdt';
  const priceMint = paymentMethod === 'sol' ? SOL_MINT : config.mint;
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
    if (!paymentRequest?.requestId || paymentRequest.status !== 'pending' || paymentRequest.isLocalFallback) {
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
    if (!isBillingValid || !billingData || priceUSD <= 0 || !preciseAmount) {
      return null;
    }

    return [
      sessionId,
      plan,
      plan === 'cart' && cartItems?.length ? cartItems.join(',') : '',
      paymentMethod,
      priceUSD.toFixed(2),
      preciseAmount.uiAmount,
      billingData.email.trim().toLowerCase(),
      billingData.fullName.trim(),
      `${billingData.phonePrefix}${billingData.phone}`.trim(),
      billingData.country,
      billingData.addressLine1.trim(),
      (billingData.addressLine2 || '').trim(),
      billingData.city.trim(),
      billingData.zipCode.trim(),
    ].join('::');
  }, [billingData, cartItems, isBillingValid, paymentMethod, plan, preciseAmount, priceUSD, sessionId]);

  const handleGenerateQr = async (auto = false) => {
    if (isProcessing) {
      return;
    }

    if (!isBillingValid) {
      if (!auto) {
        toast.error('Completa los datos de contacto para continuar');
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
          items: plan === 'cart' && cartItems?.length ? cartItems : undefined,
          paymentMethod,
          chargeUSD: priceUSD,
          expectedAmountUi: preciseAmount.uiAmount,
          expectedAmountRaw: preciseAmount.rawAmount,
          billingData: billingData || null,
          userId: userId || undefined,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.warn('[QR] Servidor no disponible:', errorBody.error || response.statusText);

        const fallback = createLocalFallbackPaymentRequest({
          sessionId,
          preciseAmount,
          config,
        });
        setPaymentRequest(fallback);
        if (generationKey) {
          setLastGenerationKey(generationKey);
        }
        return;
      }

      const created = await response.json();

      setPaymentRequest({
        requestId: created.requestId,
        qrUrl: created.qrUrl,
        expiresAt: created.expiresAt,
        reference: created.reference,
        recipientWallet: created.recipientWallet || TREASURY_WALLET,
        status: 'pending',
        paymentSignature: null,
        isLocalFallback: false,
      });
      if (generationKey) {
        setLastGenerationKey(generationKey);
      }

      if (!auto) {
        toast.success('Código QR de Phantom generado');
      }
    } catch (error: unknown) {
      console.warn('[QR] Error de red, usando QR local:', error);

      if (generationKey) {
        setLastGenerationKey(generationKey);
      }

      const fallback = createLocalFallbackPaymentRequest({
        sessionId,
        preciseAmount,
        config,
      });
      setPaymentRequest(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!generationKey || isProcessing) {
      return;
    }

    if (lastGenerationKey === generationKey) {
      return;
    }

    handleGenerateQr(true);
  }, [generationKey, isProcessing, lastGenerationKey]);

  const showPriceLoader = needsPriceFeed && loadingPrice;
  const qrSize = compact ? 165 : 240;
  const walletAddress = paymentRequest?.recipientWallet || TREASURY_WALLET;

  return (
    <div className={compact ? 'space-y-2.5' : 'space-y-3'}>
      {showPriceLoader ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
          <span className="text-xs text-slate-500">Obteniendo precio de {config.label}...</span>
        </div>
      ) : preciseAmount ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className={`rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold ${
              isLight ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                {paymentMethod === 'usdc' || paymentMethod === 'usdt'
                  ? 'Monto exacto en stablecoin'
                  : `Cotización: ${secondsRemaining}s`}
              </span>
            </div>

            <div className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'
            }`}>
              <span className="text-slate-400 font-normal">Pagas:</span>
              <span className={isLight ? 'text-blue-600 font-bold' : 'text-blue-400 font-bold'}>
                {preciseAmount.uiAmount} {config.label}
              </span>
            </div>
          </div>

          <div className={`rounded-2xl p-3 sm:p-3.5 space-y-2.5 ${
            isLight ? 'bg-slate-50 border border-slate-200/90 shadow-2xs' : 'rounded-2xl ring-1 ring-white/10'
          }`}>
            {paymentRequest ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Código QR Listo
                    </p>
                    <p className={`text-[11px] leading-tight ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Escanea con tu billetera Phantom (Solana mainnet).
                    </p>
                  </div>
                  {!paymentRequest.isLocalFallback && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setLastGenerationKey(null);
                        handleGenerateQr(false);
                      }}
                      disabled={isProcessing}
                      className={`h-7 px-2.5 text-xs cursor-pointer ${
                        isLight ? 'text-slate-500 hover:text-blue-600 hover:bg-slate-200/60' : 'text-slate-400 hover:text-blue-400 hover:bg-white/10'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Actualizar
                    </Button>
                  )}
                </div>

                <div className="flex justify-center py-0.5">
                  <BrandedQrCode value={paymentRequest.qrUrl} size={qrSize} />
                </div>

                {!paymentRequest.isLocalFallback && (
                  <div className="grid gap-2 grid-cols-2">
                    <div className={`rounded-xl p-2 border ${
                      isLight ? 'bg-white border-slate-200/80' : 'border-white/10 bg-white/5'
                    }`}>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Estado</p>
                      <div className={`mt-0.5 flex items-center gap-1.5 text-xs font-semibold ${
                        isLight ? 'text-slate-900' : 'text-slate-200'
                      }`}>
                        {paymentRequest.status === 'paid' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Confirmado</span>
                          </>
                        ) : paymentRequest.status === 'expired' ? (
                          <>
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span>Expirado</span>
                          </>
                        ) : (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                            <span className="text-[11px]">Esperando pago</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className={`rounded-xl p-2 border ${
                      isLight ? 'bg-white border-slate-200/80' : 'border-white/10 bg-white/5'
                    }`}>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Expira en</p>
                      <p className={`mt-0.5 text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>
                        {secondsUntilExpiry > 0 ? `${secondsUntilExpiry}s` : 'Expirado'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={`rounded-xl p-5 flex items-center justify-center min-h-[160px] border ${
                isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
              }`}>
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <p className="text-xs font-semibold text-slate-700">Generando tu código QR...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center px-4">
                    <Smartphone className={`w-6 h-6 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                    <p className="text-xs font-medium text-slate-500">
                      {isBillingValid
                        ? 'Generando tu código QR de pago...'
                        : 'Completa tu nombre, correo y teléfono para generar el código QR.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      ) : paymentMethod === 'lxr' && !loadingPrice && !quotedTokenPrice ? (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-3.5 text-center space-y-1.5">
          <p className="text-xs font-semibold text-purple-900">
            LXR — disponible en {getLxrLaunchLabel()}
          </p>
          <p className="text-[11px] text-slate-600 leading-relaxed max-w-sm mx-auto">
            Por ahora puedes pagar con USDC, USDT o SOL.
          </p>
        </div>
      ) : (
        <div className="text-center text-red-600 py-3 space-y-1">
          <p className="text-xs font-semibold">Error al calcular el precio de {config.label}</p>
        </div>
      )}

      <WalletCopyButton address={walletAddress} theme={theme} />
    </div>
  );
}
