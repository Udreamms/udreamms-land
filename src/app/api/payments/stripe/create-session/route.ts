import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import {
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

    const seen = new Set<string>();
    const validItemIds = itemIds.filter((id) => {
      if (!(id in PRODUCT_CATALOG) || seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    if (validItemIds.length === 0) {
      return NextResponse.json({ error: 'El carrito no tiene productos válidos' }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const successBase =
      customSuccessUrl ||
      process.env.NEXT_PUBLIC_PORTAL_STRIPE_SUCCESS_URL ||
      `${origin}/portal?stripe=success`;
    const cancelUrl = customCancelUrl || `${origin}/portal?stripe=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(email.includes('@') ? { customer_email: email } : {}),
      line_items: validItemIds.map((itemId) => {
        const entry = getProductEntry(itemId)!;
        return {
          quantity: 1,
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
      metadata: {
        item_ids: validItemIds.join(','),
        product_id: validItemIds.length === 1 ? validItemIds[0] : 'cart',
        billing_email: email.toLowerCase(),
        charge_usd: String(getCartTotalUsd(validItemIds, 'card')),
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
      itemIds: validItemIds,
      totalUsd: getCartTotalUsd(validItemIds, 'card'),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear sesión de Stripe';
    console.error('[API] stripe/create-session error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
