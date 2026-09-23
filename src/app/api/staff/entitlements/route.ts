import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';
import { PENDING_PURCHASES_COLLECTION, pendingPurchaseDocId } from '@/backend/payments/unlock-purchase';

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
    const boolValue = Boolean(value);
    const now = new Date().toISOString();

    // 1. Find all matching user documents in `users` collection by email
    const snap = await db.collection('users').where('email', '==', emailLower).get();
    const directDocRef = db.collection('users').doc(emailLower);
    const directDoc = await directDocRef.get();

    const batch = db.batch();
    const touchedRefs = new Set<string>();

    // Update all query-matched user docs
    snap.docs.forEach((docSnap) => {
      batch.set(docSnap.ref, { [flag]: boolValue, updatedAt: now }, { merge: true });
      touchedRefs.add(docSnap.ref.path);
    });

    // If direct doc exists or no docs matched at all, ensure users/emailLower is also updated/created
    if (directDoc.exists || touchedRefs.size === 0) {
      batch.set(
        directDocRef,
        {
          email: emailLower,
          [flag]: boolValue,
          updatedAt: now,
          ...(directDoc.exists ? {} : { createdAt: now }),
        },
        { merge: true }
      );
      touchedRefs.add(directDocRef.path);
    }

    // 2. Also keep pendingPurchases in sync so if client signs up later with a new UID, it carries over
    const pendingDocId = pendingPurchaseDocId(emailLower);
    const pendingRef = db.collection(PENDING_PURCHASES_COLLECTION).doc(pendingDocId);
    const pendingSnap = await pendingRef.get();

    if (boolValue) {
      // Add to pending
      const existingItems = (pendingSnap.data()?.items as Record<string, boolean>) || {};
      batch.set(
        pendingRef,
        {
          email: emailLower,
          items: { ...existingItems, [flag]: true },
          lastSource: 'staff_override',
          updatedAt: now,
          createdAt: pendingSnap.exists ? pendingSnap.data()?.createdAt || now : now,
        },
        { merge: true }
      );
    } else if (pendingSnap.exists) {
      // Remove from pending
      const existingItems = (pendingSnap.data()?.items as Record<string, boolean>) || {};
      if (existingItems[flag]) {
        const remaining = { ...existingItems };
        delete remaining[flag];
        if (Object.keys(remaining).length === 0) {
          batch.delete(pendingRef);
        } else {
          batch.set(pendingRef, { items: remaining, updatedAt: now }, { merge: true });
        }
      }
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      email: emailLower,
      flag,
      value: boolValue,
    });
  } catch (error: any) {
    console.error('Error toggling entitlement:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar el producto' }, { status: 500 });
  }
}
