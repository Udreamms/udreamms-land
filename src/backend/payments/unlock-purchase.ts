import { requireAdminDb } from '@/backend/firebase/admin';

export const PENDING_PURCHASES_COLLECTION = 'pendingPurchases';

/** Firestore user fields unlocked per catalog item id */
export const PURCHASE_FIELD_BY_ITEM: Record<string, string> = {
  'sevis': 'purchased_sevis',
  'entrevista-embajada': 'purchased_entrevista_embajada',
  'curso-estudiante': 'purchased_curso_estudiante',
  'libro-estudiante': 'purchased_libro_estudiante',
  'curso-turista': 'purchased_curso_turista',
  'libro-turista': 'purchased_libro_turista',
  
  // Student Plans
  'plan-esencial': 'purchased_plan_esencial',
  'plan-pro': 'purchased_plan_pro',
  'plan-elite': 'purchased_plan_elite',
  'plan-allinclusive': 'purchased_plan_allinclusive',
  'esencial': 'purchased_plan_esencial',
  'pro': 'purchased_plan_pro',
  'elite': 'purchased_plan_elite',
  'allinclusive': 'purchased_plan_allinclusive',
  'student-basic': 'purchased_plan_esencial',
  'student-pro': 'purchased_plan_pro',
  'student-elite': 'purchased_plan_elite',
  'student-allinclusive': 'purchased_plan_allinclusive',

  // Tourist Plans
  'plan-turista-basico': 'purchased_plan_turista_basico',
  'plan-turista-premium': 'purchased_plan_turista_premium',
  'plan-turista-vip': 'purchased_plan_turista_vip',
  'turista-basico': 'purchased_plan_turista_basico',
  'turista-premium': 'purchased_plan_turista_premium',
  'turista-vip': 'purchased_plan_turista_vip',
  'basico': 'purchased_plan_turista_basico',
  'premium': 'purchased_plan_turista_premium',
  'vip': 'purchased_plan_turista_vip',
  'tourist-basic': 'purchased_plan_turista_basico',
  'tourist-premium': 'purchased_plan_turista_premium',
  'tourist-vip': 'purchased_plan_turista_vip',
};

export function normalizePurchaseEmail(email: string) {
  return email.trim().toLowerCase();
}

export function pendingPurchaseDocId(email: string) {
  return normalizePurchaseEmail(email).replace(/[^a-z0-9]/g, '_');
}

export function buildUnlockUpdates(itemIds: string[]) {
  const updates: Record<string, boolean> = {};
  for (const itemId of itemIds) {
    const field = PURCHASE_FIELD_BY_ITEM[itemId];
    if (field) {
      updates[field] = true;
    }
  }
  return updates;
}

export async function unlockPurchasesByUserId(
  userId: string,
  itemIds: string[],
  source: { type: 'crypto' | 'stripe' | 'manual'; referenceId?: string }
) {
  if (!userId || itemIds.length === 0) return { unlocked: false };
  const updates = buildUnlockUpdates(itemIds);
  if (Object.keys(updates).length === 0) return { unlocked: false };

  try {
    const db = requireAdminDb();
    await db.doc(`users/${userId}`).set(
      {
        ...updates,
        last_payment_source: source.type,
        last_payment_reference: source.referenceId || null,
        last_payment_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return { unlocked: true, userId, updates };
  } catch (error) {
    console.error(`[unlockPurchase] Error updating user by ID ${userId}:`, error);
    return { unlocked: false, error };
  }
}

async function findUserDocsByEmail(email: string) {
  const normalized = normalizePurchaseEmail(email);
  const db = requireAdminDb();
  const byLower = await db.collection('users').where('email', '==', normalized).limit(5).get();
  if (!byLower.empty) {
    return byLower.docs;
  }
  const original = email.trim();
  if (original && original !== normalized) {
    const byOriginal = await db.collection('users').where('email', '==', original).limit(5).get();
    if (!byOriginal.empty) {
      return byOriginal.docs;
    }
  }
  return [];
}

export async function storePendingPurchase(
  email: string,
  itemId: string,
  source: { type: 'crypto' | 'stripe' | 'manual'; referenceId?: string }
) {
  const normalized = normalizePurchaseEmail(email);
  if (!normalized || !PURCHASE_FIELD_BY_ITEM[itemId]) {
    return { stored: false, reason: 'invalid_email_or_item' as const };
  }

  const docId = pendingPurchaseDocId(normalized);
  const ref = requireAdminDb().doc(`${PENDING_PURCHASES_COLLECTION}/${docId}`);
  const existing = await ref.get();
  const now = new Date().toISOString();

  const items: Record<string, boolean> = existing.exists
    ? { ...(existing.data()?.items as Record<string, boolean> | undefined), [itemId]: true }
    : { [itemId]: true };

  await ref.set(
    {
      email: normalized,
      items,
      lastSource: source.type,
      lastReferenceId: source.referenceId || null,
      updatedAt: now,
      createdAt: existing.exists ? existing.data()?.createdAt || now : now,
    },
    { merge: true }
  );

  return { stored: true, email: normalized, items: Object.keys(items) };
}

export async function unlockPurchaseByEmail(
  email: string,
  itemId: string,
  source: { type: 'crypto' | 'stripe' | 'manual'; referenceId?: string }
) {
  const normalized = normalizePurchaseEmail(email);
  const field = PURCHASE_FIELD_BY_ITEM[itemId];
  if (!normalized || !field) {
    return { unlocked: false, appliedToUser: false, reason: 'invalid_email_or_item' as const };
  }

  const updates = { [field]: true };
  const userDocs = await findUserDocsByEmail(normalized);

  if (userDocs.length > 0) {
    const batch = requireAdminDb().batch();
    for (const userDoc of userDocs) {
      batch.set(userDoc.ref, updates, { merge: true });
    }
    await batch.commit();

    const pendingRef = requireAdminDb().doc(
      `${PENDING_PURCHASES_COLLECTION}/${pendingPurchaseDocId(normalized)}`
    );
    const pending = await pendingRef.get();
    if (pending.exists) {
      const pendingItems = (pending.data()?.items as Record<string, boolean>) || {};
      if (pendingItems[itemId]) {
        const remaining = { ...pendingItems };
        delete remaining[itemId];
        if (Object.keys(remaining).length === 0) {
          await pendingRef.delete();
        } else {
          await pendingRef.set({ items: remaining, updatedAt: new Date().toISOString() }, { merge: true });
        }
      }
    }

    return {
      unlocked: true,
      appliedToUser: true,
      email: normalized,
      itemId,
      userIds: userDocs.map((d) => d.id),
      source: source.type,
    };
  }

  await storePendingPurchase(normalized, itemId, source);
  return {
    unlocked: true,
    appliedToUser: false,
    email: normalized,
    itemId,
    pending: true,
    source: source.type,
  };
}

export async function applyPendingPurchasesForEmail(email: string, uid?: string) {
  const normalized = normalizePurchaseEmail(email);
  const docId = pendingPurchaseDocId(normalized);
  const pendingRef = requireAdminDb().doc(`${PENDING_PURCHASES_COLLECTION}/${docId}`);
  const pendingSnap = await pendingRef.get();

  if (!pendingSnap.exists) {
    return { applied: [] as string[], email: normalized };
  }

  const items = Object.keys((pendingSnap.data()?.items as Record<string, boolean>) || {});
  if (items.length === 0) {
    await pendingRef.delete();
    return { applied: [] as string[], email: normalized };
  }

  const updates = buildUnlockUpdates(items);
  if (Object.keys(updates).length === 0) {
    return { applied: [] as string[], email: normalized };
  }

  if (uid) {
    await requireAdminDb().doc(`users/${uid}`).set(updates, { merge: true });
  } else {
    const userDocs = await findUserDocsByEmail(normalized);
    if (userDocs.length === 0) {
      return { applied: [] as string[], email: normalized, pending: true };
    }
    const batch = requireAdminDb().batch();
    for (const userDoc of userDocs) {
      batch.set(userDoc.ref, updates, { merge: true });
    }
    await batch.commit();
  }

  await pendingRef.delete();
  return { applied: items, email: normalized };
}

export async function unlockPurchasesByEmail(
  email: string,
  itemIds: string[],
  source: { type: 'crypto' | 'stripe' | 'manual'; referenceId?: string }
) {
  const uniqueItems = [...new Set(itemIds)].filter((id) => PURCHASE_FIELD_BY_ITEM[id]);
  const results: Awaited<ReturnType<typeof unlockPurchaseByEmail>>[] = [];
  for (const itemId of uniqueItems) {
    results.push(await unlockPurchaseByEmail(email, itemId, source));
  }
  return results;
}

export async function unlockPurchaseForPlan(
  email: string,
  planId: string,
  source: { type: 'crypto' | 'stripe' | 'manual'; referenceId?: string }
) {
  const itemId = planId === 'cart' ? null : planId;
  if (!itemId || !PURCHASE_FIELD_BY_ITEM[itemId]) {
    return { unlocked: false, reason: 'not_unlockable_plan' as const };
  }
  return unlockPurchaseByEmail(email, itemId, source);
}
