const STRIPE_CHECKOUT_STORAGE_KEY = 'udreamms_stripe_checkout';

export interface StoredStripeCheckout {
  itemIds: string[];
  email: string;
  savedAt: string;
}

export function saveStripeCheckoutIntent(itemIds: string[], email: string) {
  if (typeof window === 'undefined') return;
  const payload: StoredStripeCheckout = {
    itemIds,
    email: email.trim().toLowerCase(),
    savedAt: new Date().toISOString(),
  };
  sessionStorage.setItem(STRIPE_CHECKOUT_STORAGE_KEY, JSON.stringify(payload));
}

export function readStripeCheckoutIntent(): StoredStripeCheckout | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(STRIPE_CHECKOUT_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredStripeCheckout;
  } catch {
    return null;
  }
}

export function clearStripeCheckoutIntent() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STRIPE_CHECKOUT_STORAGE_KEY);
}
