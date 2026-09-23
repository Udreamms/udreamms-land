import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin no está inicializado' }, { status: 500 });
    }

    // 1. Delete all entries in staff_hidden_cases to unhide all deleted expedientes
    const hiddenSnap = await db.collection('staff_hidden_cases').get();
    const deletedHiddenIds: string[] = [];
    
    for (const doc of hiddenSnap.docs) {
      deletedHiddenIds.push(doc.id);
      await doc.ref.delete();
    }

    // 2. Fetch all registered users in users collection
    const usersSnap = await db.collection('users').get();
    const allUsers: any[] = [];
    usersSnap.forEach(uDoc => {
      allUsers.push({
        id: uDoc.id,
        ...uDoc.data(),
      });
    });

    // 3. Fetch all solicitudes_visas
    const solsSnap = await db.collection('solicitudes_visas').get();
    const allSols: any[] = [];
    solsSnap.forEach(sDoc => {
      allSols.push({
        id: sDoc.id,
        ...sDoc.data(),
      });
    });

    return NextResponse.json({
      success: true,
      unhiddenCount: deletedHiddenIds.length,
      unhiddenIds: deletedHiddenIds,
      registeredUsersCount: allUsers.length,
      registeredUsers: allUsers.map(u => ({ email: u.email, name: u.displayName || u.name, createdAt: u.createdAt })),
      solicitudesCount: allSols.length,
    });
  } catch (error: any) {
    console.error('Error restoring cases:', error);
    return NextResponse.json({ error: error?.message || 'Error al restaurar expedientes' }, { status: 500 });
  }
}
