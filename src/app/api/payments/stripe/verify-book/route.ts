import { NextRequest, NextResponse } from 'next/server';
import { findPaidSessionForItem } from '@/backend/payments/stripe';
import { unlockPurchaseByEmail } from '@/backend/payments/unlock-purchase';

/** Compat: verificación del libro ($29.99) */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const session = await findPaidSessionForItem(email, 'libro-estudiante');
    if (!session) {
      return NextResponse.json(
        {
          verified: false,
          message:
            'Aún no encontramos un pago de $29.99 USD con este correo. Si acabas de pagar, espera 1-2 minutos e intenta de nuevo.',
        },
        { status: 404 }
      );
    }

    const unlock = await unlockPurchaseByEmail(email, 'libro-estudiante', {
      type: 'stripe',
      referenceId: session.id,
    });

    return NextResponse.json({
      verified: true,
      sessionId: session.id,
      email: email.trim().toLowerCase(),
      unlock,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Stripe verification failed';
    console.error('[API] payments/stripe/verify-book error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
