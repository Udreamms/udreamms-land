'use client';

import { useState, useEffect, useRef } from 'react';

export type JupiterPriceSource = 'jupiter-v3' | 'jupiter-quote' | 'env-fallback' | null;

export function usePriceFromJupiter(
  tokenAddresses: string[],
  cacheDurationMs = 60000,
  fallbackUsdPrices: Record<string, number> = {}
) {
  const [prices, setPrices] = useState<{ [key: string]: number | null }>({});
  const [sources, setSources] = useState<{ [key: string]: JupiterPriceSource }>({});
  const [loading, setLoading] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const cacheRef = useRef<{ [key: string]: number | null }>({});
  const sourcesRef = useRef<{ [key: string]: JupiterPriceSource }>({});
  const cacheTimeRef = useRef<number>(0);

  useEffect(() => {
    if (tokenAddresses.length === 0) {
      setPrices({});
      setSources({});
      setLoading(false);
      setSecondsRemaining(0);
      return;
    }

    const fetchPrices = async () => {
      const now = Date.now();
      const isCached = cacheTimeRef.current && now - cacheTimeRef.current < cacheDurationMs;

      if (isCached) {
        setPrices(cacheRef.current);
        setSources(sourcesRef.current);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const params = tokenAddresses.join(',');
        const response = await fetch(`/api/prices/jupiter?ids=${params}`);

        if (!response.ok) {
          console.warn(`Price API returned ${response.status}`);
          setPrices(
            tokenAddresses.reduce(
              (acc, addr) => ({ ...acc, [addr]: fallbackUsdPrices[addr] ?? null }),
              {}
            )
          );
          setSources(
            tokenAddresses.reduce((acc, addr) => {
              const fallback = fallbackUsdPrices[addr];
              return { ...acc, [addr]: fallback ? 'env-fallback' : null };
            }, {})
          );
          return;
        }

        const data: {
          prices: { [key: string]: number | null };
          sources?: { [key: string]: JupiterPriceSource };
        } = await response.json();

        const newPrices: { [key: string]: number | null } = {};
        const newSources: { [key: string]: JupiterPriceSource } = {};
        for (const address of tokenAddresses) {
          const jupiterPrice = data.prices?.[address];
          const resolvedPrice =
            jupiterPrice && jupiterPrice > 0
              ? jupiterPrice
              : fallbackUsdPrices[address] ?? null;
          newPrices[address] = resolvedPrice;
          newSources[address] =
            data.sources?.[address] ??
            (resolvedPrice && fallbackUsdPrices[address] ? 'env-fallback' : null);
        }
        cacheRef.current = newPrices;
        sourcesRef.current = newSources;
        cacheTimeRef.current = now;
        setPrices(newPrices);
        setSources(newSources);
      } catch (error) {
        console.error('Error fetching prices from Jupiter:', error);
        setPrices(
          tokenAddresses.reduce(
            (acc, addr) => ({ ...acc, [addr]: fallbackUsdPrices[addr] ?? null }),
            {}
          )
        );
        setSources(
          tokenAddresses.reduce((acc, addr) => {
            const fallback = fallbackUsdPrices[addr];
            return { ...acc, [addr]: fallback ? 'env-fallback' : null };
          }, {})
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

  return { prices, sources, loading, secondsRemaining };
}
