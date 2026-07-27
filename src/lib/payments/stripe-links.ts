/** Stripe Payment Links — productos Udreamms */
export const STRIPE_PAYMENT_LINKS = {
  libroEstudiante: 'https://buy.stripe.com/bJeeVdckP87851w2HxenS0D',
  planEsencial: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  planPro: 'https://buy.stripe.com/fZuaEX1GbcnoeC64PFenS0G',
  planElite: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  planAllInclusive: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
  planTuristaBasico: 'https://buy.stripe.com/6oU14n84zcnoalQci7enS0F',
  planTuristaPremium: 'https://buy.stripe.com/9B67sL3OjafgalQ2HxenS0H',
  planTuristaVip: 'https://buy.stripe.com/bJeeVddoTafgeC695VenS0I',
} as const;

/** Catálogo portal / carrito → Payment Link de Stripe */
export const STRIPE_ITEM_LINKS: Record<string, string> = {
  'libro-estudiante': STRIPE_PAYMENT_LINKS.libroEstudiante,
  'libro-turista': STRIPE_PAYMENT_LINKS.libroEstudiante,
  'plan-esencial': STRIPE_PAYMENT_LINKS.planEsencial,
  'plan-pro': STRIPE_PAYMENT_LINKS.planPro,
  'plan-elite': STRIPE_PAYMENT_LINKS.planElite,
  'plan-allinclusive': STRIPE_PAYMENT_LINKS.planAllInclusive,
  'plan-turista-basico': STRIPE_PAYMENT_LINKS.planTuristaBasico,
  'plan-turista-premium': STRIPE_PAYMENT_LINKS.planTuristaPremium,
  'plan-turista-vip': STRIPE_PAYMENT_LINKS.planTuristaVip,
};

/** Precio en centavos USD (tarjeta) para verificación Stripe */
export const STRIPE_ITEM_PRICE_CENTS: Record<string, number> = {
  'libro-estudiante': 2999,
  'libro-turista': 2999,
  'plan-esencial': 38000,
  'plan-turista-basico': 38000,
  'plan-pro': 55000,
  'plan-elite': 250000,
  'plan-allinclusive': 1000000,
  'plan-turista-premium': 325000,
  'plan-turista-vip': 1300000,
};

export const PORTAL_STRIPE_SUCCESS_URL =
  process.env.NEXT_PUBLIC_PORTAL_STRIPE_SUCCESS_URL ||
  'https://www.udreamms.com/portal?stripe=success';

export const BOOK_STRIPE_SUCCESS_URL =
  process.env.NEXT_PUBLIC_BOOK_STRIPE_SUCCESS_URL ||
  'https://www.udreamms.com/visas/student/book?stripe=success';

export function buildStripePaymentLink(itemId: string, email?: string) {
  const base = STRIPE_ITEM_LINKS[itemId];
  if (!base) {
    return null;
  }
  const params = new URLSearchParams();
  const trimmed = email?.trim();
  if (trimmed) {
    params.set('prefilled_email', trimmed);
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function buildStripeBookLink(email: string) {
  return buildStripePaymentLink('libro-estudiante', email) || STRIPE_PAYMENT_LINKS.libroEstudiante;
}

export function getStripeLinkForCart(items: string[]) {
  if (items.length !== 1) {
    return null;
  }
  return STRIPE_ITEM_LINKS[items[0]] || null;
}

export function resolveItemIdFromStripeMetadata(
  metadata: Record<string, string> | null | undefined
): string | null {
  const productId = metadata?.product_id || metadata?.productId || metadata?.item_id;
  if (productId && STRIPE_ITEM_LINKS[productId]) {
    return productId;
  }
  return null;
}

export function resolveItemIdsFromAmountCents(amountCents: number): string[] {
  return Object.entries(STRIPE_ITEM_PRICE_CENTS)
    .filter(([, cents]) => cents === amountCents)
    .map(([itemId]) => itemId);
}
