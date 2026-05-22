import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Connection, ParsedInstruction, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';
import { db } from '@/lib/firebase-admin';
import {
  buildVisaCryptoComprobante,
  extractBillingEmail,
  getVisaCryptoComprobantePath,
  getVisaCryptoPaymentRequestPath,
  getVisaCryptoPaymentRequestsCollectionPath,
  getVisaCryptoSessionPath,
  type VisaCryptoComprobante,
  type VisaCryptoPaymentRequest,
  type VisaCryptoPaymentStatus,
} from './firestore-schema';
import { getPaymentConfig, SOLANA_RPC_URL, type CryptoPaymentMethod } from './payment-config';

export type { VisaCryptoPaymentStatus as VisaPaymentStatus };
export type { VisaCryptoPaymentRequest as VisaPaymentOrder };
export type { VisaCryptoComprobante };

interface VerificationResult {
  signature: string;
  payerWallet: string | null;
}

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

function getPaymentRequestDocRef(sessionId: string, requestId: string) {
  return db.doc(getVisaCryptoPaymentRequestPath(sessionId, requestId));
}

function getSessionDocRef(sessionId: string) {
  return db.doc(getVisaCryptoSessionPath(sessionId));
}

function isExpired(expiresAt: string) {
  return Date.now() > new Date(expiresAt).getTime();
}

function getParsedAccountKeys(transaction: ParsedTransactionWithMeta) {
  return transaction.transaction.message.accountKeys.map((entry) => {
    const candidate = entry as { pubkey?: PublicKey; toBase58?: () => string };

    if (candidate.pubkey) {
      return candidate.pubkey.toBase58();
    }

    if (candidate.toBase58) {
      return candidate.toBase58();
    }

    return String(entry);
  });
}

function getPayerWallet(transaction: ParsedTransactionWithMeta): string | null {
  const keys = getParsedAccountKeys(transaction);
  return keys[0] || null;
}

function getParsedInstructions(transaction: ParsedTransactionWithMeta) {
  return transaction.transaction.message.instructions.filter(
    (instruction): instruction is ParsedInstruction => 'parsed' in instruction
  );
}

function verifySolTransfer(transaction: ParsedTransactionWithMeta, order: VisaCryptoPaymentRequest) {
  const instructions = getParsedInstructions(transaction);

  return instructions.some((instruction) => {
    if (instruction.program !== 'system') {
      return false;
    }

    const parsed = instruction.parsed as { type?: string; info?: Record<string, unknown> };
    if (parsed.type !== 'transfer' || !parsed.info) {
      return false;
    }

    return (
      String(parsed.info.destination || '') === order.recipientWallet &&
      String(parsed.info.lamports || '') === order.expectedAmountRaw
    );
  });
}

function verifySplTransfer(transaction: ParsedTransactionWithMeta, order: VisaCryptoPaymentRequest) {
  if (!order.tokenMint) {
    return false;
  }

  const recipientAta = getAssociatedTokenAddressSync(
    new PublicKey(order.tokenMint),
    new PublicKey(order.recipientWallet),
    true
  ).toBase58();

  const instructions = getParsedInstructions(transaction);

  return instructions.some((instruction) => {
    if (instruction.program !== 'spl-token' && instruction.program !== 'spl-token-2022') {
      return false;
    }

    const parsed = instruction.parsed as { type?: string; info?: Record<string, unknown> };
    if (!parsed.type || !parsed.info) {
      return false;
    }

    if (parsed.type !== 'transfer' && parsed.type !== 'transferChecked') {
      return false;
    }

    const info = parsed.info as Record<string, unknown>;
    const tokenAmount = info.tokenAmount as Record<string, unknown> | undefined;
    const rawAmount = tokenAmount?.amount || info.amount || tokenAmount?.uiAmountString;

    const mint = info.mint ? String(info.mint) : order.tokenMint;

    return (
      String(info.destination || '') === recipientAta &&
      mint === order.tokenMint &&
      String(rawAmount || '') === order.expectedAmountRaw
    );
  });
}

export async function findMatchingPayment(
  order: VisaCryptoPaymentRequest
): Promise<VerificationResult | null> {
  const signatures = await connection.getSignaturesForAddress(new PublicKey(order.reference), {
    limit: 10,
  });

  for (const signatureInfo of signatures) {
    if (signatureInfo.err) {
      continue;
    }

    const transaction = await connection.getParsedTransaction(signatureInfo.signature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction || transaction.meta?.err) {
      continue;
    }

    const accountKeys = getParsedAccountKeys(transaction);
    if (!accountKeys.includes(order.reference)) {
      continue;
    }

    const matches =
      order.paymentMethod === 'sol' ? verifySolTransfer(transaction, order) : verifySplTransfer(transaction, order);

    if (matches) {
      return {
        signature: signatureInfo.signature,
        payerWallet: getPayerWallet(transaction),
      };
    }
  }

  return null;
}

export async function upsertVisaCryptoSession(
  sessionId: string,
  fields: {
    billingEmail?: string | null;
    lastPlanId?: string;
    lastRequestId?: string;
    createdAt?: string;
  }
) {
  const now = new Date().toISOString();
  const sessionRef = getSessionDocRef(sessionId);
  const existing = await sessionRef.get();

  const payload: Record<string, unknown> = {
    sessionId,
    updatedAt: now,
  };

  if (fields.billingEmail !== undefined) {
    payload.billingEmail = fields.billingEmail;
  }
  if (fields.lastPlanId) {
    payload.lastPlanId = fields.lastPlanId;
  }
  if (fields.lastRequestId) {
    payload.lastRequestId = fields.lastRequestId;
  }

  if (!existing.exists) {
    payload.createdAt = fields.createdAt || now;
    if (payload.billingEmail === undefined) {
      payload.billingEmail = null;
    }
    if (payload.lastPlanId === undefined) {
      payload.lastPlanId = null;
    }
    if (payload.lastRequestId === undefined) {
      payload.lastRequestId = null;
    }
  }

  await sessionRef.set(payload, { merge: true });
}

export async function markOrderExpired(order: VisaCryptoPaymentRequest) {
  await getPaymentRequestDocRef(order.sessionId, order.requestId).set(
    {
      status: 'expired',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function fulfillVisaOrderFromPayment(
  order: VisaCryptoPaymentRequest,
  verification: VerificationResult
) {
  const now = new Date();
  const paidAtIso = now.toISOString();
  const config = getPaymentConfig(order.paymentMethod);
  const comprobante = buildVisaCryptoComprobante(order, verification.signature, verification.payerWallet, config.label);

  const batch = db.batch();

  batch.set(
    getPaymentRequestDocRef(order.sessionId, order.requestId),
    {
      status: 'paid',
      transactionSignature: verification.signature,
      paymentSignature: verification.signature,
      payerWallet: verification.payerWallet,
      paidAt: paidAtIso,
      comprobanteId: order.requestId,
      updatedAt: paidAtIso,
    },
    { merge: true }
  );

  batch.set(db.doc(getVisaCryptoComprobantePath(order.requestId)), comprobante, { merge: true });

  batch.set(
    getSessionDocRef(order.sessionId),
    {
      sessionId: order.sessionId,
      billingEmail: comprobante.billingEmail,
      lastPlanId: order.planId,
      lastRequestId: order.requestId,
      lastPaidAt: paidAtIso,
      updatedAt: paidAtIso,
    },
    { merge: true }
  );

  await batch.commit();
}

export async function getPaymentOrder(sessionId: string, requestId: string) {
  const snapshot = await getPaymentRequestDocRef(sessionId, requestId).get();

  if (!snapshot.exists) {
    return null;
  }

  const data = normalizePaymentRequest(snapshot.data() as VisaCryptoPaymentRequest);

  if (data.requestId !== requestId || data.sessionId !== sessionId) {
    return null;
  }

  return data;
}

export async function getComprobante(requestId: string): Promise<VisaCryptoComprobante | null> {
  const snapshot = await db.doc(getVisaCryptoComprobantePath(requestId)).get();
  if (!snapshot.exists) {
    return null;
  }
  return snapshot.data() as VisaCryptoComprobante;
}

function normalizePaymentRequest(data: VisaCryptoPaymentRequest): VisaCryptoPaymentRequest {
  const planId = data.planId || (data as { plan?: string }).plan || '';
  const transactionSignature =
    data.transactionSignature || (data as { paymentSignature?: string }).paymentSignature;

  return {
    ...data,
    planId,
    transactionSignature,
    billingEmail: data.billingEmail ?? extractBillingEmail(data.billingData),
  };
}

export async function resolvePaymentOrderStatus(order: VisaCryptoPaymentRequest) {
  if (order.status === 'paid') {
    return order;
  }

  const payment = await findMatchingPayment(order);
  if (payment) {
    await fulfillVisaOrderFromPayment(order, payment);
    return {
      ...order,
      status: 'paid' as const,
      transactionSignature: payment.signature,
      paymentSignature: payment.signature,
      payerWallet: payment.payerWallet,
      paidAt: new Date().toISOString(),
      comprobanteId: order.requestId,
    };
  }

  if (order.status === 'expired' || isExpired(order.expiresAt)) {
    await markOrderExpired(order);
    return {
      ...order,
      status: 'expired' as const,
    };
  }

  return order;
}

export async function recoverSessionPaymentOrders(sessionId: string) {
  const collectionPath = getVisaCryptoPaymentRequestsCollectionPath(sessionId);
  const snapshot = await db.collection(collectionPath).where('status', 'in', ['pending', 'expired']).get();

  const results: Array<{ requestId: string; status: VisaCryptoPaymentStatus; comprobanteId?: string }> = [];

  for (const docSnap of snapshot.docs) {
    const order = normalizePaymentRequest(docSnap.data() as VisaCryptoPaymentRequest);
    const resolved = await resolvePaymentOrderStatus(order);
    results.push({
      requestId: resolved.requestId,
      status: resolved.status,
      comprobanteId: resolved.comprobanteId,
    });
  }

  return results;
}

export function validatePaymentOrderPayload(order: {
  paymentMethod: CryptoPaymentMethod;
  expectedAmountRaw: string;
  expectedAmountUi: string;
}) {
  const config = getPaymentConfig(order.paymentMethod);

  if (!/^\d+$/.test(order.expectedAmountRaw)) {
    throw new Error('Invalid raw amount');
  }

  if (!/^\d+(\.\d+)?$/.test(order.expectedAmountUi)) {
    throw new Error('Invalid UI amount');
  }

  return config;
}
