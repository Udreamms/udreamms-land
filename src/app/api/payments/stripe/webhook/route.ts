import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient, resolveItemIdsFromCheckoutSessionAsync } from '@/backend/payments/stripe';
import { unlockPurchasesByEmail } from '@/backend/payments/unlock-purchase';
import { PRODUCT_CATALOG } from '@/lib/payments/product-catalog';

export const runtime = 'nodejs';

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
        session.customer_email ||
        '';

      const itemIds = await resolveItemIdsFromCheckoutSessionAsync(session);
      const userId = session.metadata?.user_id || '';

      console.log(`[Stripe Webhook] Received checkout.session.completed: userId=${userId}, email=${email}, session=${session.id}, items=${itemIds.join(',')}`);

      if (userId && itemIds.length > 0) {
        const { unlockPurchasesByUserId } = await import('@/backend/payments/unlock-purchase');
        await unlockPurchasesByUserId(userId, itemIds, {
          type: 'stripe',
          referenceId: session.id,
        });
      }

      if (email && itemIds.length > 0) {
        await unlockPurchasesByEmail(email, itemIds, {
          type: 'stripe',
          referenceId: session.id,
        });
      } else if (!userId) {
        console.warn(`[Stripe Webhook] Could not unlock: email=${email}, itemIds=${JSON.stringify(itemIds)}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Webhook handler failed';
    console.error('[Stripe Webhook] Handler error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
