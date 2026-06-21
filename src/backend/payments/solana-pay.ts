interface SolanaPayUrlFields {
  recipient: string;
  amount: string;
  splToken?: string | null;
  reference?: string | string[] | null;
  label?: string;
  message?: string;
  memo?: string;
}

export function encodeSolanaPayUrl({
  recipient,
  amount,
  splToken,
  reference,
  label,
  message,
  memo,
}: SolanaPayUrlFields) {
  const url = new URL(`solana:${recipient}`);

  url.searchParams.append('amount', amount);

  if (splToken) {
    url.searchParams.append('spl-token', splToken);
  }

  const references = reference ? (Array.isArray(reference) ? reference : [reference]) : [];
  references.forEach((item) => url.searchParams.append('reference', item));

  if (label) {
    url.searchParams.append('label', label);
  }

  if (message) {
    url.searchParams.append('message', message);
  }

  if (memo) {
    url.searchParams.append('memo', memo);
  }

  return url.toString();
}

/** Minimal Solana Pay URL for QR — fewer modules, better scan reliability. */
export function encodeCompactSolanaPayQrUrl({
  recipient,
  amount,
  splToken,
  reference,
}: Pick<SolanaPayUrlFields, 'recipient' | 'amount' | 'splToken' | 'reference'>) {
  const url = new URL(`solana:${recipient}`);
  url.searchParams.set('amount', amount);

  if (splToken) {
    url.searchParams.set('spl-token', splToken);
  }

  if (reference) {
    const references = Array.isArray(reference) ? reference : [reference];
    references.forEach((item) => url.searchParams.append('reference', item));
  }

  return url.toString();
}

export function formatBaseUnitsToDecimal(amountRaw: string, decimals: number) {
  const negative = amountRaw.startsWith('-');
  const unsigned = negative ? amountRaw.slice(1) : amountRaw;
  const normalized = unsigned.replace(/^0+/, '') || '0';

  if (decimals === 0) {
    return `${negative ? '-' : ''}${normalized}`;
  }

  const padded = normalized.padStart(decimals + 1, '0');
  const integerPart = padded.slice(0, padded.length - decimals);
  const fractionalPart = padded.slice(-decimals).replace(/0+$/, '');

  return fractionalPart
    ? `${negative ? '-' : ''}${integerPart}.${fractionalPart}`
    : `${negative ? '-' : ''}${integerPart}`;
}
