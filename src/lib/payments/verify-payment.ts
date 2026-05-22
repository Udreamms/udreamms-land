import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { SOLANA_RPC_URL, TREASURY_WALLET, type CryptoPaymentMethod } from './payment-config';

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const LXR_MINT = '7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth';

export async function verifyVisaTransaction(
  signature: string,
  paymentMethod: CryptoPaymentMethod
): Promise<{ ok: true } | { ok: false; error: string }> {
  const treasuryWallet = process.env.NEXT_PUBLIC_TREASURY_WALLET || TREASURY_WALLET;
  if (!treasuryWallet) {
    return { ok: false, error: 'Treasury wallet not configured' };
  }

  const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
  const transaction = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!transaction) {
    return { ok: false, error: 'Transaction not found' };
  }

  if (transaction.meta?.err) {
    return { ok: false, error: 'Transaction failed on-chain' };
  }

  const treasuryPublicKey = new PublicKey(treasuryWallet);
  let expectedDestination: PublicKey = treasuryPublicKey;

  if (paymentMethod === 'lxr') {
    expectedDestination = await getAssociatedTokenAddress(new PublicKey(LXR_MINT), treasuryPublicKey, true);
  } else if (paymentMethod === 'usdc' || paymentMethod === 'usdt') {
    const mint = paymentMethod === 'usdt' ? 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' : USDC_MINT;
    expectedDestination = await getAssociatedTokenAddress(new PublicKey(mint), treasuryPublicKey, true);
  }

  const accountKeys = transaction.transaction.message.getAccountKeys();
  const hasValidDestination = accountKeys.staticAccountKeys.some(
    (key) => key.toString() === expectedDestination.toString()
  );

  if (!hasValidDestination) {
    return { ok: false, error: 'Transaction destination invalid' };
  }

  return { ok: true };
}
