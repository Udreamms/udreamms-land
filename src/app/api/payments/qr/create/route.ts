import { Keypair } from '@solana/web3.js';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';
import {
  extractBillingEmail,
  getVisaCryptoPaymentRequestPath,
  getVisaCryptoPaymentRequestsCollectionPath,
} from '@/backend/payments/firestore-schema';
import {
  PLAN_DISPLAY_TITLES,
  QR_EXPIRATION_MINUTES,
  TREASURY_WALLET,
  VISA_PLAN_CATALOG_USD,
  type CryptoPaymentMethod,
} from '@/backend/payments/payment-config';
import { encodeSolanaPayUrl } from '@/backend/payments/solana-pay';
import { upsertVisaCryptoSession, validatePaymentOrderPayload } from '@/backend/payments/qr-payment';

export async function POST(request: NextRequest) {
  try {
    const {
      sessionId,
      plan,
      paymentMethod,
      chargeUSD,
      expectedAmountUi,
      expectedAmountRaw,
      billingData,
    } = await request.json();

    if (!sessionId || !plan || !paymentMethod || !expectedAmountUi || !expectedAmountRaw) {
      return NextResponse.json(
        { error: 'Missing required fields (sessionId, plan, paymentMethod, expectedAmountUi, expectedAmountRaw)' },
        { status: 400 }
      );
    }

    const planKey = String(plan).toLowerCase();
    const catalogPlanPriceUSD = VISA_PLAN_CATALOG_USD[planKey];
    if (!catalogPlanPriceUSD) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const clientChargeUSD = typeof chargeUSD === 'number' ? chargeUSD : Number(chargeUSD);
    if (Math.abs(clientChargeUSD - catalogPlanPriceUSD) > 0.01) {
      return NextResponse.json(
        {
          error: 'Charge amount mismatch. Refresh checkout and try again.',
          expectedChargeUSD: catalogPlanPriceUSD,
        },
        { status: 400 }
      );
    }

    if (catalogPlanPriceUSD <= 0) {
      return NextResponse.json({ error: 'Invalid charge amount' }, { status: 400 });
    }

    const config = validatePaymentOrderPayload({
      paymentMethod: paymentMethod as CryptoPaymentMethod,
      expectedAmountRaw: String(expectedAmountRaw),
      expectedAmountUi: String(expectedAmountUi),
    });

    const collectionPath = getVisaCryptoPaymentRequestsCollectionPath(sessionId);
    const requestId = db.collection(collectionPath).doc().id;
    const reference = Keypair.generate().publicKey.toBase58();
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + QR_EXPIRATION_MINUTES * 60 * 1000);
    const billingEmail = extractBillingEmail(billingData);

    const qrUrl = encodeSolanaPayUrl({
      recipient: TREASURY_WALLET,
      amount: String(expectedAmountUi),
      splToken: config.mint,
      reference,
      label: `Udreamms ${PLAN_DISPLAY_TITLES[planKey] || planKey}`,
      message: 'Escanea con Phantom para completar tu pago',
      memo: `visa:${requestId}`,
    });

    const createdAtIso = createdAt.toISOString();

    await db.doc(getVisaCryptoPaymentRequestPath(sessionId, requestId)).set({
      requestId,
      sessionId,
      planId: planKey,
      paymentMethod,
      recipientWallet: TREASURY_WALLET,
      reference,
      status: 'pending',
      qrUrl,
      planPriceUSD: catalogPlanPriceUSD,
      chargeUSD: catalogPlanPriceUSD,
      expectedAmountUi: String(expectedAmountUi),
      expectedAmountRaw: String(expectedAmountRaw),
      tokenDecimals: config.decimals,
      tokenMint: config.mint,
      billingData: billingData || null,
      billingEmail,
      createdAt: createdAtIso,
      updatedAt: createdAtIso,
      expiresAt: expiresAt.toISOString(),
    });

    await upsertVisaCryptoSession(sessionId, {
      billingEmail,
      lastPlanId: planKey,
      lastRequestId: requestId,
      createdAt: createdAtIso,
    });

    return NextResponse.json({
      requestId,
      reference,
      qrUrl,
      recipientWallet: TREASURY_WALLET,
      expiresAt: expiresAt.toISOString(),
      status: 'pending',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to create payment QR';
    console.error('[API] payments/qr/create error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
