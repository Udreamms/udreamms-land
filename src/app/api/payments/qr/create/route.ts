import { Keypair } from '@solana/web3.js';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';
import {
  extractBillingEmail,
  getVisaCryptoPaymentRequestPath,
  getVisaCryptoPaymentRequestsCollectionPath,
} from '@/backend/payments/firestore-schema';
import {
  QR_EXPIRATION_MINUTES,
  TREASURY_WALLET,
  VISA_PLAN_CATALOG_USD,
  type CryptoPaymentMethod,
} from '@/backend/payments/payment-config';
import { encodeCompactSolanaPayQrUrl } from '@/backend/payments/solana-pay';
import { upsertVisaCryptoSession, validatePaymentOrderPayload } from '@/backend/payments/qr-payment';

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        {
          error:
            'Firebase Admin no está configurado. Agrega FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY en .env.local.',
        },
        { status: 503 }
      );
    }

    const {
      sessionId,
      plan,
      paymentMethod,
      chargeUSD,
      expectedAmountUi,
      expectedAmountRaw,
      billingData,
      items,
    } = await request.json();

    if (!sessionId || !plan || !paymentMethod || !expectedAmountUi || !expectedAmountRaw) {
      return NextResponse.json(
        { error: 'Missing required fields (sessionId, plan, paymentMethod, expectedAmountUi, expectedAmountRaw)' },
        { status: 400 }
      );
    }

    const planKey = String(plan).toLowerCase();
    const normalizedItems = Array.isArray(items) ? items.filter((id: unknown) => typeof id === 'string') : [];
    let catalogPlanPriceUSD = 0;
    let cartItemIds: string[] = [];

    if (planKey === 'cart') {
      if (normalizedItems.length === 0) {
        return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
      }
      cartItemIds = normalizedItems;
      for (const itemId of cartItemIds) {
        const itemPrice = VISA_PLAN_CATALOG_USD[itemId];
        if (!itemPrice) {
          return NextResponse.json({ error: `Invalid cart item: ${itemId}` }, { status: 400 });
        }
        catalogPlanPriceUSD += itemPrice;
      }
    } else {
      cartItemIds = [planKey];
      catalogPlanPriceUSD = VISA_PLAN_CATALOG_USD[planKey];
    }

    if (!catalogPlanPriceUSD) {
      return NextResponse.json({ error: 'Invalid plan or empty checkout value' }, { status: 400 });
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

    const qrUrl = encodeCompactSolanaPayQrUrl({
      recipient: TREASURY_WALLET,
      amount: String(expectedAmountUi),
      splToken: config.mint,
      reference,
    });

    const createdAtIso = createdAt.toISOString();

    await db.doc(getVisaCryptoPaymentRequestPath(sessionId, requestId)).set({
      requestId,
      sessionId,
      planId: planKey,
      cartItemIds: planKey === 'cart' ? cartItemIds : [planKey],
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
