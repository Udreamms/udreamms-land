import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/backend/firebase/admin';
import { applyPendingPurchasesForEmail } from '@/backend/payments/unlock-purchase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token || !admin.apps.length) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;
    if (!email) {
      return NextResponse.json({ error: 'User email not available' }, { status: 400 });
    }

    const pending = await applyPendingPurchasesForEmail(email, decoded.uid);

    return NextResponse.json({
      success: true,
      email,
      pending,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to apply pending purchases';
    console.error('[API] payments/apply-pending error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
