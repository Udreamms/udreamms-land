import { NextRequest, NextResponse } from 'next/server';
import {
  getPaymentOrder,
  recoverSessionPaymentOrders,
  resolvePaymentOrderStatus,
} from '@/lib/payments/qr-payment';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, requestId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const orderResults = await recoverSessionPaymentOrders(sessionId);
    const paidFromOrders = orderResults.filter((r) => r.status === 'paid');

    if (paidFromOrders.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'visaCryptoSessions.paymentRequests',
        activated: paidFromOrders,
      });
    }

    if (requestId) {
      const order = await getPaymentOrder(sessionId, requestId);
      if (!order) {
        return NextResponse.json({ error: 'Payment request not found' }, { status: 404 });
      }
      const resolved = await resolvePaymentOrderStatus(order);
      if (resolved.status === 'paid') {
        const signature =
          resolved.transactionSignature || (resolved as { paymentSignature?: string }).paymentSignature;
        return NextResponse.json({
          success: true,
          source: 'requestId',
          requestId,
          comprobanteId: resolved.comprobanteId || requestId,
          transactionSignature: signature,
          paymentSignature: signature,
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'No matching on-chain payment found for open requests',
      orderResults,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Recovery failed';
    console.error('[API] payments/qr/recover error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
