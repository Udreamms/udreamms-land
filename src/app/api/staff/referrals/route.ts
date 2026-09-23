import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ referrals: [], error: 'Firebase Admin no configurado' });
    }

    const snap = await db.collection('referrals').get();
    const referrals: any[] = [];
    snap.forEach((doc) => {
      referrals.push({ id: doc.id, ...doc.data() });
    });

    referrals.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json({ referrals });
  } catch (error: any) {
    console.error('Error fetching staff referrals:', error);
    return NextResponse.json({ referrals: [], error: error?.message || 'Error al obtener referidos' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin no configurado' }, { status: 500 });
    }

    const body = await req.json();
    const { id, status, rewardPaid, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const docRef = db.collection('referrals').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Referido no encontrado' }, { status: 404 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (status !== undefined) updates.status = status;
    if (rewardPaid !== undefined) updates.rewardPaid = Boolean(rewardPaid);
    if (notes !== undefined) updates.notes = String(notes);

    await docRef.update(updates);

    return NextResponse.json({ success: true, id, updates });
  } catch (error: any) {
    console.error('Error updating referral:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar referido' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin no configurado' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await db.collection('referrals').doc(id).delete();
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error deleting referral:', error);
    return NextResponse.json({ error: error?.message || 'Error al eliminar referido' }, { status: 500 });
  }
}
