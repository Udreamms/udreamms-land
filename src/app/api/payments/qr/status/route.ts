import { NextRequest, NextResponse } from 'next/server';
import { getPaymentOrder, resolvePaymentOrderStatus } from '@/lib/payments/qr-payment';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    const requestId = request.nextUrl.searchParams.get('requestId');

    if (!sessionId || !requestId) {
      return NextResponse.json(
        { error: 'Missing required query params (sessionId, requestId)' },
        { status: 400 }
      );
    }

    const order = await getPaymentOrder(sessionId, requestId);
    if (!order) {
      return NextResponse.json({ error: 'Payment request not found' }, { status: 404 });
    }

    const resolved = await resolvePaymentOrderStatus(order);

    return NextResponse.json({
      requestId: resolved.requestId,
      status: resolved.status,
      expiresAt: resolved.expiresAt,
      paidAt: resolved.paidAt || null,
      transactionSignature:
        resolved.transactionSignature || (resolved as { paymentSignature?: string }).paymentSignature || null,
      paymentSignature:
        resolved.transactionSignature || (resolved as { paymentSignature?: string }).paymentSignature || null,
      comprobanteId: resolved.comprobanteId || (resolved.status === 'paid' ? resolved.requestId : null),
      payerWallet: resolved.payerWallet || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to resolve payment status';
    console.error('[API] payments/qr/status error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
