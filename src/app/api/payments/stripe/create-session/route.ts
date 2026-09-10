import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import {
  calculateStripeGrossTotal,
  calculateStripeProcessingFee,
  getCartTotalUsd,
  getItemPriceUsd,
  getProductEntry,
  PRODUCT_CATALOG,
} from '@/lib/payments/product-catalog';
import { PORTAL_STRIPE_SUCCESS_URL } from '@/lib/payments/stripe-links';

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe no está configurado. Agrega STRIPE_SECRET_KEY en el servidor.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    const itemIds = Array.isArray(body.itemIds)
      ? body.itemIds.filter((id: unknown): id is string => typeof id === 'string')
      : [];
    const customSuccessUrl =
      typeof body.successUrl === 'string' && body.successUrl.includes('://')
        ? body.successUrl
        : null;
    const customCancelUrl =
      typeof body.cancelUrl === 'string' && body.cancelUrl.includes('://')
        ? body.cancelUrl
        : null;

    const counts: Record<string, number> = {};
    for (const id of itemIds) {
      if (id in PRODUCT_CATALOG) {
        counts[id] = (counts[id] || 0) + 1;
      }
    }
    const uniqueItemIds = Object.keys(counts);

    if (uniqueItemIds.length === 0) {
      return NextResponse.json({ error: 'El carrito no tiene productos válidos' }, { status: 400 });
    }

    const allValidItems = itemIds.filter((id) => id in PRODUCT_CATALOG);
    const subtotalUsd = getCartTotalUsd(allValidItems, 'card');
    const processingFeeUsd = calculateStripeProcessingFee(subtotalUsd);
    const grossTotalUsd = calculateStripeGrossTotal(subtotalUsd);

    const origin = request.nextUrl.origin;
    const successBase =
      customSuccessUrl ||
      process.env.NEXT_PUBLIC_PORTAL_STRIPE_SUCCESS_URL ||
      `${origin}/portal?stripe=success`;
    const cancelUrl = customCancelUrl || `${origin}/portal?stripe=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(email.includes('@') ? { customer_email: email } : {}),
      line_items: [
        ...uniqueItemIds.map((itemId) => {
          const entry = getProductEntry(itemId)!;
          const qty = counts[itemId] || 1;
          return {
            quantity: qty,
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(getItemPriceUsd(itemId, 'card') * 100),
              product_data: {
                name: entry.name,
                metadata: { item_id: itemId },
              },
            },
          };
        }),
        ...(processingFeeUsd > 0 ? [{
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(processingFeeUsd * 100),
            product_data: {
              name: 'Comisión de Procesamiento y Pasarela (Stripe)',
              description: 'Tarifa por procesamiento y gestión de transacción bancaria internacional con tarjeta',
            },
          },
        }] : []),
      ],
      metadata: {
        user_id: userId || '',
        item_ids: allValidItems.join(','),
        product_id: uniqueItemIds.length === 1 && counts[uniqueItemIds[0]] === 1 ? uniqueItemIds[0] : 'cart',
        billing_email: email.toLowerCase(),
        subtotal_usd: String(subtotalUsd),
        processing_fee_usd: String(processingFeeUsd),
        charge_usd: String(grossTotalUsd),
      },
      success_url: `${successBase}${successBase.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'No se pudo crear la sesión de Stripe' }, { status: 500 });
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      itemIds: allValidItems,
      subtotalUsd,
      processingFeeUsd,
      totalUsd: grossTotalUsd,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear sesión de Stripe';
    console.error('[API] stripe/create-session error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
