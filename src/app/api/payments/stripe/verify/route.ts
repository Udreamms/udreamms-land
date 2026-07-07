import { NextRequest, NextResponse } from 'next/server';
import { findPaidSessionsForItems } from '@/backend/payments/stripe';
import { unlockPurchasesByEmail, PURCHASE_FIELD_BY_ITEM } from '@/backend/payments/unlock-purchase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email : '';
    const itemIds = Array.isArray(body.itemIds)
      ? body.itemIds.filter((id: unknown): id is string => typeof id === 'string')
      : [];

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const validItemIds: string[] = Array.from(
      new Set(itemIds.filter((id): id is string => typeof id === 'string' && Boolean(PURCHASE_FIELD_BY_ITEM[id])))
    );
    if (validItemIds.length === 0) {
      return NextResponse.json({ error: 'At least one valid itemId is required' }, { status: 400 });
    }

    const paidSessions = await findPaidSessionsForItems(email, validItemIds);
    if (paidSessions.length === 0) {
      return NextResponse.json(
        {
          verified: false,
          message:
            'Aún no encontramos un pago confirmado en Stripe para estos productos. Si acabas de pagar, espera 1-2 minutos e intenta de nuevo.',
        },
        { status: 404 }
      );
    }

    const verifiedItemIds = paidSessions.map((entry) => entry.itemId);
    const unlock = await unlockPurchasesByEmail(email, verifiedItemIds, {
      type: 'stripe',
      referenceId: paidSessions.map((entry) => entry.session.id).join(','),
    });

    return NextResponse.json({
      verified: true,
      email: email.trim().toLowerCase(),
      itemIds: verifiedItemIds,
      unlock,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Stripe verification failed';
    console.error('[API] payments/stripe/verify error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
