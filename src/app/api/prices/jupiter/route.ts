import { NextRequest, NextResponse } from 'next/server';
import {
  getLxrUsdPriceFallback,
  getMintDecimals,
  LXR_MINT,
} from '@/backend/payments/payment-config';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

interface PriceDataV3 {
  usdPrice?: number;
  decimals?: number;
}

async function fetchJupiterPriceV3(mints: string[]): Promise<Record<string, PriceDataV3>> {
  try {
    const apiKey = process.env.JUPITER_API_KEY;
    const response = await fetch(`https://api.jup.ag/price/v3?ids=${mints.join(',')}`, {
      headers: apiKey ? { 'x-api-key': apiKey } : undefined,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn(`Jupiter Price API returned ${response.status} for mints: ${mints.join(',')}`);
      return {};
    }

    return response.json();
  } catch (error) {
    console.warn('Jupiter Price API request failed:', error);
    return {};
  }
}

async function fetchJupiterQuoteUsdPrice(mint: string, decimals: number): Promise<number | null> {
  try {
    const amount = Math.pow(10, decimals).toString();
    const apiKey = process.env.JUPITER_API_KEY;
    const url = new URL('https://api.jup.ag/swap/v1/quote');
    url.searchParams.set('inputMint', mint);
    url.searchParams.set('outputMint', USDC_MINT);
    url.searchParams.set('amount', amount);
    url.searchParams.set('slippageBps', '50');

    const response = await fetch(url, {
      headers: apiKey ? { 'x-api-key': apiKey } : undefined,
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { outAmount?: string };
    if (!data.outAmount) {
      return null;
    }

    const usdPrice = Number(data.outAmount) / 1_000_000;
    return Number.isFinite(usdPrice) && usdPrice > 0 ? usdPrice : null;
  } catch {
    return null;
  }
}

function resolveMintPrice(
  mint: string,
  v3Data: Record<string, PriceDataV3>
): Promise<{ price: number | null; source: 'jupiter-v3' | 'jupiter-quote' | 'env-fallback' | null }> {
  const v3Price = v3Data[mint]?.usdPrice;
  if (v3Price && v3Price > 0) {
    return Promise.resolve({ price: v3Price, source: 'jupiter-v3' });
  }

  return (async () => {
    const decimals = v3Data[mint]?.decimals ?? getMintDecimals(mint);
    const quotePrice = await fetchJupiterQuoteUsdPrice(mint, decimals);
    if (quotePrice) {
      return { price: quotePrice, source: 'jupiter-quote' as const };
    }

    if (mint === LXR_MINT) {
      const lxrFallback = getLxrUsdPriceFallback();
      if (lxrFallback) {
        return { price: lxrFallback, source: 'env-fallback' as const };
      }
    }

    return { price: null, source: null };
  })();
}

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get('ids');
  if (!idsParam) {
    return NextResponse.json({ error: 'Missing ids query parameter' }, { status: 400 });
  }

  const mints = idsParam.split(',').map((id) => id.trim()).filter(Boolean);
  if (mints.length === 0) {
    return NextResponse.json({ error: 'No mint addresses provided' }, { status: 400 });
  }

  const v3Data = await fetchJupiterPriceV3(mints);
  const prices: Record<string, number | null> = {};
  const sources: Record<string, 'jupiter-v3' | 'jupiter-quote' | 'env-fallback' | null> = {};

  await Promise.all(
    mints.map(async (mint) => {
      const resolved = await resolveMintPrice(mint, v3Data);
      prices[mint] = resolved.price;
      sources[mint] = resolved.source;
    })
  );

  return NextResponse.json({ prices, sources });
}
