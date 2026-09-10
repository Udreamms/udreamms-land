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

export function matchItemFromDescriptionOrAmount(description: string, amountCents?: number | null): string | null {
  const desc = (description || '').toLowerCase();
  
  if (desc.includes('escuela') || desc.includes('i-20') || desc.includes('aplicación') || desc.includes('aplicacion')) {
    if (desc.includes('uceda')) return 'aplicacion-escuela-uceda';
    if (desc.includes('lumos') && desc.includes('orem')) return 'aplicacion-escuela-lumos-orem';
    if (desc.includes('lumos')) return 'aplicacion-escuela-lumos-slc';
    if (desc.includes('language on')) return 'aplicacion-escuela-language-on';
    if (desc.includes('internexus') && desc.includes('2')) return 'aplicacion-escuela-internexus-2';
    if (desc.includes('internexus')) return 'aplicacion-escuela-internexus-1';
    if (desc.includes('american one')) return 'aplicacion-escuela-american-one';
    if (desc.includes('inx')) return 'aplicacion-escuela-inx';
    if (desc.includes('pace')) return 'aplicacion-escuela-pace';
    if (desc.includes('ling')) return 'aplicacion-escuela-us-ling';
    if (desc.includes('byu') || desc.includes('brigham')) return 'aplicacion-escuela-byu';
    if (desc.includes('uvu') || desc.includes('utah valley')) return 'aplicacion-escuela-uvu';
    if (desc.includes('uofu') || desc.includes('university of utah')) return 'aplicacion-escuela-uofu';
    if (desc.includes('usu') || desc.includes('utah state')) return 'aplicacion-escuela-usu';
    if (desc.includes('slcc') || desc.includes('salt lake community')) return 'aplicacion-escuela-slcc';
    return 'aplicacion-escuela';
  }

  if (desc.includes('sevis') || amountCents === 36800 || amountCents === 35000) {
    return 'sevis';
  }
  if (desc.includes('entrevista') || desc.includes('cita') || desc.includes('mrv') || desc.includes('simulacro') || amountCents === 19500 || amountCents === 18500 || amountCents === 4999) {
    return 'entrevista-embajada';
  }
  if (desc.includes('esencial') || (desc.includes('f-1') && amountCents === 38000)) {
    return 'plan-esencial';
  }
  if (desc.includes('plan 2') || desc.includes('plan-pro') || (desc.includes('pro') && !desc.includes('proceso')) || (amountCents === 55000)) {
    return 'plan-pro';
  }
  if (desc.includes('elite') || (amountCents === 325000 || amountCents === 250000)) {
    return 'plan-elite';
  }
  if (desc.includes('all-inclusive') || desc.includes('allinclusive') || (amountCents === 1300000 || amountCents === 1000000)) {
    return 'plan-allinclusive';
  }
  if (desc.includes('turista') && (desc.includes('básico') || desc.includes('basico') || desc.includes('plan 1') || amountCents === 38000)) {
    return 'plan-turista-basico';
  }
  if (desc.includes('turista') && (desc.includes('premium') || desc.includes('plan 2') || amountCents === 350000 || amountCents === 325000)) {
    return 'plan-turista-premium';
  }
  if (desc.includes('vip') || (desc.includes('turista') && (desc.includes('plan 3') || amountCents === 499000))) {
    return 'plan-turista-vip';
  }
  if (desc.includes('libro') || amountCents === 2999) {
    if (desc.includes('turista') || desc.includes('b-2')) return 'libro-turista';
    return 'libro-estudiante';
  }
  if (desc.includes('master class') || desc.includes('curso') || amountCents === 9999 || amountCents === 999) {
    if (desc.includes('turista') || desc.includes('b-2')) return 'curso-turista';
    return 'curso-estudiante';
  }
  
  return null;
}

export async function resolveItemIdsFromCheckoutSessionAsync(
  session: Stripe.Checkout.Session,
  preferredItemId?: string
): Promise<string[]> {
  const results = new Set<string>();

  // 1. Try metadata
  const metaItem = resolveItemIdFromStripeMetadata(session.metadata || undefined);
  if (metaItem) {
    results.add(metaItem);
  }
  if (session.metadata?.item_ids) {
    session.metadata.item_ids.split(',').forEach((s) => {
      const trimmed = s.trim();
      if (trimmed) results.add(trimmed);
    });
  }

  // 2. Try line items inspection (essential for Stripe Payment Links)
  const stripe = getStripeClient();
  if (stripe && session.id) {
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 });
      for (const item of lineItems.data) {
        const desc = item.description || '';
        const amt = item.amount_total ?? item.price?.unit_amount ?? null;
        const matched = matchItemFromDescriptionOrAmount(desc, amt);
        if (matched) {
          results.add(matched);
        }
      }
    } catch (err) {
      console.warn('[Stripe] Could not fetch line items for session', session.id, err);
    }
  }

  // 3. Fallback by preferred item and amount
  if (results.size === 0 && preferredItemId && session.amount_total === STRIPE_ITEM_PRICE_CENTS[preferredItemId]) {
    results.add(preferredItemId);
  }

  // 4. Fallback by amount total matching
  if (results.size === 0 && session.amount_total != null) {
    const matches = resolveItemIdsFromAmountCents(session.amount_total);
    if (matches.length === 1) {
      results.add(matches[0]);
    } else if (preferredItemId && matches.includes(preferredItemId)) {
      results.add(preferredItemId);
    } else if (matches.includes('plan-esencial')) {
      results.add('plan-esencial');
    }
  }

  return Array.from(results);
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
