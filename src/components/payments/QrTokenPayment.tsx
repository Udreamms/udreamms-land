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
}: QrTokenPaymentProps) {
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
    if (!billingData || !isBillingValid || !preciseAmount) {
      return null;
    }

    return JSON.stringify({
      sessionId,
      plan,
      cartItems: plan === 'cart' ? cartItems : undefined,
      paymentMethod,
      amount: preciseAmount.uiAmount,
      email: billingData.email,
      fullName: billingData.fullName,
      zipCode: billingData.zipCode,
    });
  }, [billingData, cartItems, isBillingValid, paymentMethod, plan, preciseAmount, sessionId]);

  const handleGenerateQr = async (auto = false) => {
    if (!billingData || !isBillingValid) {
      if (!auto) {
        toast.error('Completa tu nombre, correo y teléfono primero');
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
          items: plan === 'cart' && cartItems?.length ? cartItems : undefined,
          paymentMethod,
          chargeUSD: priceUSD,
          expectedAmountUi: preciseAmount.uiAmount,
          expectedAmountRaw: preciseAmount.rawAmount,
          billingData: billingData || null,
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
  const qrSize = compact ? 300 : 340;
  const walletAddress = paymentRequest?.recipientWallet || TREASURY_WALLET;

  return (
    <div className="space-y-3">
      {showPriceLoader ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400 mr-2" />
          <span className="text-sm text-slate-400">Obteniendo precio de {config.label}...</span>
        </div>
      ) : preciseAmount ? (
        <>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <p className="text-xs text-blue-400 font-medium">
              {paymentMethod === 'usdc' || paymentMethod === 'usdt'
                ? 'Monto fijo en stablecoin'
                : `Cotización actualizada cada ${secondsRemaining}s`}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">Monto en USD</span>
              <span className="text-sm font-medium text-white">${priceUSD.toFixed(2)}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Escanea y paga</span>
              <span className="text-lg font-medium text-blue-400">
                {preciseAmount.uiAmount} {config.label}
              </span>
            </div>
          </div>

          <div className="rounded-2xl ring-1 ring-white/10 p-4 space-y-3">
            {paymentRequest ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white">QR listo</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Escanea con Phantom en tu celular para completar el pago en Solana mainnet.
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
                      className="h-8 px-3 text-xs text-slate-400 hover:text-blue-400 hover:bg-white/10"
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                      Actualizar
                    </Button>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3">
                  <BrandedQrCode value={paymentRequest.qrUrl} size={qrSize} />
                </div>

                {!paymentRequest.isLocalFallback && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Estado</p>
                      <div className="mt-1.5 flex items-center gap-2 text-xs font-medium text-slate-200">
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
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                            Esperando pago en Phantom
                          </>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Expira</p>
                      <p className="mt-1.5 text-xs font-medium text-slate-200">
                        {secondsUntilExpiry > 0 ? `${secondsUntilExpiry}s restantes` : 'Expirado'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-center min-h-[180px] border border-white/10">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    <p className="text-xs text-slate-400">Generando tu código QR único...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center px-4">
                    <Smartphone className="w-6 h-6 text-slate-500" />
                    <p className="text-xs text-slate-400">
                      {isBillingValid
                        ? 'Preparando tu QR automáticamente...'
                        : 'Completa nombre, correo y teléfono para generar el QR'}
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </>
      ) : paymentMethod === 'lxr' && !loadingPrice && !quotedTokenPrice ? (
        <div className="rounded-xl border border-purple-500/25 bg-purple-500/10 p-4 text-center space-y-2">
          <p className="text-sm font-medium text-purple-200">
            LXR — disponible en {getLxrLaunchLabel()}
          </p>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            El token aún no cotiza en Jupiter. Cuando salga al público, el precio y el código QR se
            activarán solos cada 60 segundos, igual que con SOL.
          </p>
          <p className="text-xs text-slate-500">Por ahora puedes pagar con USDC, USDT o SOL.</p>
        </div>
      ) : (
        <div className="text-center text-red-400 py-4 space-y-2">
          <p className="font-medium">Error al cargar el precio de {config.label}</p>
        </div>
      )}

      <WalletCopyButton address={walletAddress} />
    </div>
  );
}
