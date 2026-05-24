export type CryptoPaymentMethod = 'sol' | 'usdc' | 'lxr' | 'usdt';

export interface CryptoPaymentConfig {
  method: CryptoPaymentMethod;
  label: string;
  mint: string | null;
  decimals: number;
}

export const TREASURY_WALLET =
  process.env.NEXT_PUBLIC_TREASURY_WALLET || 'Ao8RqGikw3joMDo25nb3s3c7WcP6ouazJJnA1twirDAT';

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const QR_EXPIRATION_MINUTES = 60;

export const VISA_PLAN_CATALOG_USD: Record<string, number> = {
  basico: 380,
  premium: 3500,
  vip: 4990,
};

export const SOLANA_PAYMENT_CONFIG: Record<CryptoPaymentMethod, CryptoPaymentConfig> = {
  sol: {
    method: 'sol',
    label: 'SOL',
    mint: null,
    decimals: 9,
  },
  usdc: {
    method: 'usdc',
    label: 'USDC',
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
  },
  usdt: {
    method: 'usdt',
    label: 'USDT',
    mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
  },
  lxr: {
    method: 'lxr',
    label: 'LXR',
    mint: '7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth',
    decimals: 9,
  },
};

/** LXR is not listed on Jupiter Price API; set USD price via env. */
export function getLxrUsdPriceFallback(): number | null {
  const raw = process.env.NEXT_PUBLIC_LXR_USD_PRICE;
  if (!raw) return null;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function getPaymentConfig(method: CryptoPaymentMethod): CryptoPaymentConfig {
  return SOLANA_PAYMENT_CONFIG[method];
}

export {
  getVisaCryptoComprobantePath,
  getVisaCryptoPaymentRequestPath,
  getVisaCryptoPaymentRequestsCollectionPath,
  getVisaCryptoSessionPath,
  getVisaOrderDocPath,
  getVisaPaymentRequestsCollectionPath,
} from './firestore-schema';
