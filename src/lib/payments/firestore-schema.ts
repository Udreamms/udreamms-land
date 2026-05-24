import type { CryptoPaymentMethod } from './payment-config';

/** Root collection for guest checkout sessions (visa crypto QR flow). */
export const VISA_CRYPTO_SESSIONS_COLLECTION = 'visaCryptoSessions';

/** Subcollection under a session: pending / paid / expired QR payment requests. */
export const VISA_CRYPTO_PAYMENT_REQUESTS_SUBCOLLECTION = 'paymentRequests';

/**
 * Top-level collection of paid comprobantes (on-chain proof + order metadata).
 * Document ID = requestId for idempotent writes and easy correlation.
 */
export const VISA_CRYPTO_COMPROBANTES_COLLECTION = 'visaCryptoComprobantes';

export type VisaCryptoPaymentStatus = 'pending' | 'paid' | 'expired';

export interface VisaCryptoBillingData {
  email: string;
  phonePrefix: string;
  phone: string;
  fullName: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface VisaCryptoSession {
  sessionId: string;
  billingEmail: string | null;
  lastPlanId: string | null;
  lastRequestId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Active QR checkout document (lifecycle: pending → paid | expired). */
export interface VisaCryptoPaymentRequest {
  requestId: string;
  sessionId: string;
  planId: string;
  paymentMethod: CryptoPaymentMethod;
  recipientWallet: string;
  reference: string;
  status: VisaCryptoPaymentStatus;
  qrUrl: string;
  planPriceUSD: number;
  chargeUSD: number;
  expectedAmountUi: string;
  expectedAmountRaw: string;
  tokenDecimals: number;
  tokenMint: string | null;
  billingData: VisaCryptoBillingData | null;
  billingEmail: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  paidAt?: string;
  transactionSignature?: string;
  payerWallet?: string | null;
  comprobanteId?: string;
}

/**
 * Immutable paid record for admin queries (email, date) and audit/comprobante.
 * Written once when on-chain payment is confirmed.
 */
export interface VisaCryptoComprobante {
  comprobanteId: string;
  requestId: string;
  sessionId: string;
  orderId: string;
  status: 'paid';
  planId: string;
  paymentMethod: CryptoPaymentMethod;
  transactionSignature: string;
  payerWallet: string | null;
  tokenMint: string | null;
  tokenLabel: string;
  expectedAmountUi: string;
  expectedAmountRaw: string;
  tokenDecimals: number;
  chargeUSD: number;
  planPriceUSD: number;
  billingData: VisaCryptoBillingData | null;
  billingEmail: string;
  billingPhone: string | null;
  billingFullName: string | null;
  recipientWallet: string;
  reference: string;
  qrUrl: string;
  createdAt: string;
  paidAt: string;
  updatedAt: string;
}

export function getVisaCryptoSessionPath(sessionId: string) {
  return `${VISA_CRYPTO_SESSIONS_COLLECTION}/${sessionId}`;
}

export function getVisaCryptoPaymentRequestsCollectionPath(sessionId: string) {
  return `${getVisaCryptoSessionPath(sessionId)}/${VISA_CRYPTO_PAYMENT_REQUESTS_SUBCOLLECTION}`;
}

export function getVisaCryptoPaymentRequestPath(sessionId: string, requestId: string) {
  return `${getVisaCryptoPaymentRequestsCollectionPath(sessionId)}/${requestId}`;
}

export function getVisaCryptoComprobantePath(requestId: string) {
  return `${VISA_CRYPTO_COMPROBANTES_COLLECTION}/${requestId}`;
}

export function extractBillingEmail(
  billingData: VisaCryptoBillingData | Record<string, unknown> | null | undefined
): string | null {
  if (!billingData || typeof billingData !== 'object') {
    return null;
  }
  const email = (billingData as { email?: unknown }).email;
  if (typeof email !== 'string') {
    return null;
  }
  const normalized = email.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function buildVisaCryptoComprobante(
  order: VisaCryptoPaymentRequest,
  signature: string,
  payerWallet: string | null,
  tokenLabel: string
): VisaCryptoComprobante {
  const paidAt = new Date().toISOString();
  const billingEmail =
    order.billingEmail || extractBillingEmail(order.billingData) || 'unknown@guest.checkout';

  return {
    comprobanteId: order.requestId,
    requestId: order.requestId,
    sessionId: order.sessionId,
    orderId: order.requestId,
    status: 'paid',
    planId: order.planId,
    paymentMethod: order.paymentMethod,
    transactionSignature: signature,
    payerWallet,
    tokenMint: order.tokenMint,
    tokenLabel,
    expectedAmountUi: order.expectedAmountUi,
    expectedAmountRaw: order.expectedAmountRaw,
    tokenDecimals: order.tokenDecimals,
    chargeUSD: order.chargeUSD,
    planPriceUSD: order.planPriceUSD,
    billingData: order.billingData,
    billingEmail,
    billingPhone: order.billingData
      ? `${order.billingData.phonePrefix}${order.billingData.phone}`.trim() || null
      : null,
    billingFullName: order.billingData?.fullName || null,
    recipientWallet: order.recipientWallet,
    reference: order.reference,
    qrUrl: order.qrUrl,
    createdAt: order.createdAt,
    paidAt,
    updatedAt: paidAt,
  };
}

/** @deprecated Use getVisaCryptoPaymentRequestsCollectionPath */
export function getVisaPaymentRequestsCollectionPath(sessionId: string) {
  return getVisaCryptoPaymentRequestsCollectionPath(sessionId);
}

/** @deprecated Use getVisaCryptoComprobantePath */
export function getVisaOrderDocPath(sessionId: string, requestId: string) {
  return getVisaCryptoComprobantePath(requestId);
}
