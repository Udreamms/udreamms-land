import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import { unlockPurchasesByEmail } from '@/backend/payments/unlock-purchase';
import { PRODUCT_CATALOG } from '@/lib/payments/product-catalog';

function parseItemIds(metadata: Record<string, string> | null | undefined): string[] {
  if (!metadata) return [];
  if (metadata.item_ids) {
    return metadata.item_ids.split(',').map((s) => s.trim()).filter((id) => PRODUCT_CATALOG[id]);
  }
  const single = metadata.product_id || metadata.productId;
  if (single && single !== 'cart' && PRODUCT_CATALOG[single]) {
    return [single];
  }
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe no configurado' }, { status: 503 });
    }

    const { sessionId } = await request.json();
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'sessionId requerido' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { verified: false, message: 'El pago aún no está confirmado. Espera unos segundos y recarga.' },
        { status: 404 }
      );
    }

    const email =
      session.customer_details?.email ||
      session.metadata?.billing_email ||
      session.customer_email ||
      '';

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'No se encontró correo en la sesión de Stripe' }, { status: 400 });
    }

    const itemIds = parseItemIds(session.metadata);
    if (itemIds.length === 0) {
      return NextResponse.json({ error: 'No se identificaron productos en el pago' }, { status: 400 });
    }

    const unlock = await unlockPurchasesByEmail(email, itemIds, {
      type: 'stripe',
      referenceId: session.id,
    });

    return NextResponse.json({
      verified: true,
      sessionId: session.id,
      email: email.trim().toLowerCase(),
      itemIds,
      unlock,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al confirmar sesión';
    console.error('[API] stripe/confirm-session error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
