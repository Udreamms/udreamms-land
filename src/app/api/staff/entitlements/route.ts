import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

// Every product staff can lock/unlock for a client, matching the purchased_* flags
// written by the normal checkout flow (see PortalContext.tsx / unlock-purchase.ts).
export const PRODUCT_FLAGS = [
  'purchased_plan_esencial',
  'purchased_plan_pro',
  'purchased_plan_elite',
  'purchased_plan_allinclusive',
  'purchased_plan_turista_basico',
  'purchased_plan_turista_premium',
  'purchased_plan_turista_vip',
  'purchased_aplicacion_escuela',
  'purchased_sevis',
  'purchased_entrevista_embajada',
  'purchased_curso_estudiante',
  'purchased_libro_estudiante',
  'purchased_curso_turista',
  'purchased_libro_turista',
  'purchased_recursos_estudiante',
  'purchased_recursos_turista',
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, flag, value } = body;

    if (!email || !flag) {
      return NextResponse.json({ error: 'email y flag son requeridos' }, { status: 400 });
    }
    if (!PRODUCT_FLAGS.includes(flag)) {
      return NextResponse.json({ error: 'Producto no reconocido' }, { status: 400 });
    }
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }

    const emailLower = String(email).toLowerCase().trim();
    const snap = await db.collection('users').where('email', '==', emailLower).limit(1).get();

    if (snap.empty) {
      return NextResponse.json({
        error: 'Este cliente todavía no tiene una cuenta registrada en el portal (nunca inició sesión), así que no hay un perfil donde activar el producto todavía.',
      }, { status: 404 });
    }

    const userDoc = snap.docs[0];
    await userDoc.ref.set({ [flag]: Boolean(value), updatedAt: new Date().toISOString() }, { merge: true });

    return NextResponse.json({ success: true, email: emailLower, flag, value: Boolean(value) });
  } catch (error: any) {
    console.error('Error toggling entitlement:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar el producto' }, { status: 500 });
  }
}
