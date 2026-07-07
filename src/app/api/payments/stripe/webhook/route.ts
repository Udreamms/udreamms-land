import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/backend/payments/stripe';
import { unlockPurchasesByEmail } from '@/backend/payments/unlock-purchase';
import { PRODUCT_CATALOG } from '@/lib/payments/product-catalog';

export const runtime = 'nodejs';

function parseItemIdsFromMetadata(metadata: Record<string, string> | null | undefined): string[] {
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
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid webhook signature';
    console.error('[Stripe Webhook] Signature verification failed:', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email =
        session.customer_details?.email ||
        session.metadata?.billing_email ||
        '';

      const itemIds = parseItemIdsFromMetadata(session.metadata);

      if (email && itemIds.length > 0) {
        await unlockPurchasesByEmail(email, itemIds, {
          type: 'stripe',
          referenceId: session.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed';
    console.error('[Stripe Webhook] Handler error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
