'use client';

import { useState, useEffect, useRef } from 'react';

interface PriceDataV3 {
  usdPrice: number;
  blockId: number;
  decimals: number;
  priceChange24h: number;
}

export function usePriceFromJupiter(
  tokenAddresses: string[],
  cacheDurationMs = 60000,
  fallbackUsdPrices: Record<string, number> = {}
) {
  const [prices, setPrices] = useState<{ [key: string]: number | null }>({});
  const [loading, setLoading] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const cacheRef = useRef<{ [key: string]: number | null }>({});
  const cacheTimeRef = useRef<number>(0);

  useEffect(() => {
    if (tokenAddresses.length === 0) {
      setPrices({});
      setLoading(false);
      setSecondsRemaining(0);
      return;
    }

    const fetchPrices = async () => {
      const now = Date.now();
      const isCached = cacheTimeRef.current && now - cacheTimeRef.current < cacheDurationMs;

      if (isCached) {
        setPrices(cacheRef.current);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const params = tokenAddresses.join(',');
        const response = await fetch(`https://api.jup.ag/price/v3?ids=${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: { [key: string]: PriceDataV3 } = await response.json();

        const newPrices: { [key: string]: number | null } = {};
        for (const address of tokenAddresses) {
          const jupiterPrice = data[address]?.usdPrice;
          newPrices[address] =
            jupiterPrice && jupiterPrice > 0
              ? jupiterPrice
              : fallbackUsdPrices[address] ?? null;
        }
        cacheRef.current = newPrices;
        cacheTimeRef.current = now;
        setPrices(newPrices);
      } catch (error) {
        console.error('Error fetching prices from Jupiter:', error);
        setPrices(
          tokenAddresses.reduce(
            (acc, addr) => ({ ...acc, [addr]: fallbackUsdPrices[addr] ?? null }),
            {}
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    const timerInterval = setInterval(() => {
      const elapsed = Date.now() - cacheTimeRef.current;
      const remaining = Math.max(0, cacheDurationMs - elapsed);
      setSecondsRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        fetchPrices();
      }
    }, 1000);

    const fetchInterval = setInterval(fetchPrices, cacheDurationMs);

    return () => {
      clearInterval(timerInterval);
      clearInterval(fetchInterval);
    };
  }, [tokenAddresses.join(','), cacheDurationMs, JSON.stringify(fallbackUsdPrices)]);

  return { prices, loading, secondsRemaining };
}
