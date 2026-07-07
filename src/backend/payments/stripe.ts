import Stripe from 'stripe';
import {
  resolveItemIdFromStripeMetadata,
  resolveItemIdsFromAmountCents,
  STRIPE_ITEM_PRICE_CENTS,
} from '@/lib/payments/stripe-links';

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export function resolveItemIdFromCheckoutSession(
  session: Stripe.Checkout.Session,
  preferredItemId?: string
): string | null {
  if (session.payment_status !== 'paid') {
    return null;
  }

  const fromMetadata = resolveItemIdFromStripeMetadata(session.metadata || undefined);
  if (fromMetadata) {
    return fromMetadata;
  }

  if (preferredItemId && session.amount_total === STRIPE_ITEM_PRICE_CENTS[preferredItemId]) {
    return preferredItemId;
  }

  if (session.amount_total == null) {
    return null;
  }

  const matches = resolveItemIdsFromAmountCents(session.amount_total);
  if (matches.length === 1) {
    return matches[0];
  }

  if (preferredItemId && matches.includes(preferredItemId)) {
    return preferredItemId;
  }

  return null;
}

export async function findPaidSessionForItem(email: string, itemId: string) {
  const stripe = getStripeClient();
  if (!stripe) {
    return null;
  }

  const normalized = email.trim().toLowerCase();
  const expectedCents = STRIPE_ITEM_PRICE_CENTS[itemId];
  if (!expectedCents) {
    return null;
  }

  const oneDayAgo = Math.floor(Date.now() / 1000) - 60 * 60 * 24;

  const sessions = await stripe.checkout.sessions.list({
    limit: 30,
    status: 'complete',
    created: { gte: oneDayAgo },
  });

  return (
    sessions.data.find((session) => {
      const sessionEmail = session.customer_details?.email?.trim().toLowerCase();
      if (sessionEmail !== normalized) {
        return false;
      }
      return resolveItemIdFromCheckoutSession(session, itemId) === itemId;
    }) || null
  );
}

export async function findPaidSessionsForItems(email: string, itemIds: string[]) {
  const results: Array<{ itemId: string; session: Stripe.Checkout.Session }> = [];

  for (const itemId of itemIds) {
    const session = await findPaidSessionForItem(email, itemId);
    if (session) {
      results.push({ itemId, session });
    }
  }

  return results;
}

/** @deprecated Use findPaidSessionForItem(email, 'libro-estudiante') */
export async function findPaidLibroSessionByEmail(email: string) {
  return findPaidSessionForItem(email, 'libro-estudiante');
}
