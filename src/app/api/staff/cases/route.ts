import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

function parseDateSafe(val: any): string {
  if (!val) return new Date().toISOString().split('T')[0];
  if (typeof val === 'string') {
    if (val.includes('T')) return val.split('T')[0];
    return val;
  }
  if (typeof val === 'object') {
    if (typeof val.toDate === 'function') {
      return val.toDate().toISOString().split('T')[0];
    }
    if (val._seconds) {
      return new Date(val._seconds * 1000).toISOString().split('T')[0];
    }
    if (val.seconds) {
      return new Date(val.seconds * 1000).toISOString().split('T')[0];
    }
  }
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  if (typeof val === 'number') {
    return new Date(val).toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

function parseDateTimeSafe(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (typeof val.toDate === 'function') {
      return val.toDate().toISOString();
    }
    if (val._seconds) {
      return new Date(val._seconds * 1000).toISOString();
    }
    if (val.seconds) {
      return new Date(val.seconds * 1000).toISOString();
    }
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  if (typeof val === 'number') {
    return new Date(val).toISOString();
  }
  return new Date().toISOString();
}

export async function GET(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({
        cases: [],
        dbConnected: false,
        error: 'Firebase Admin no está inicializado en este entorno. Verifica que FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY estén configuradas correctamente en las variables de entorno de Vercel (Production) y vuelve a desplegar.',
      });
    }

    // Cases hidden/deleted by staff should never resurface, even if they are
    // re-derived from the `users` collection cross-reference below.
    let hiddenIds = new Set<string>();
    try {
      const hiddenSnap = await db.collection('staff_hidden_cases').get();
      hiddenSnap.forEach(hDoc => hiddenIds.add(hDoc.id));
    } catch (hiddenErr) {
      console.warn('Could not fetch staff_hidden_cases:', hiddenErr);
    }

    // Query portal_chats collection to attach unread counts in real-time
    let chatMap: Record<string, { unreadByStaff: number; lastMessage: string }> = {};
    try {
      const chatSnap = await db.collection('portal_chats').get();
      chatSnap.forEach(cDoc => {
        const cData = cDoc.data();
        const emailKey = (cData.clientEmail || '').toLowerCase().trim();
        if (emailKey) {
          chatMap[emailKey] = {
            unreadByStaff: cData.unreadByStaff || 0,
            lastMessage: cData.lastMessage || '',
          };
        }
      });
    } catch (chatErr) {
      console.warn('Could not fetch portal_chats map:', chatErr);
    }

    const realCases: any[] = [];
    const existingCaseKeys = new Set<string>();
    const fetchErrors: string[] = [];

    // 1. Fetch from solicitudes_visas (Clients who filled or started their consular forms)
    try {
      const snapshot = await db.collection('solicitudes_visas').get();
      snapshot.forEach(doc => {
        const data = doc.data();
        const formData = data.formData || {};
        const fullName =
          data.name ||
          `${formData.nombres || ''} ${formData.apellidos || ''}`.trim() ||
          data.email ||
          'Postulante';

        const emailKey = (data.email || formData.email_contacto || '').toLowerCase().trim();
        const typeKey = data.visaType === 'B-2' ? 'b2' : 'f1';
        if (emailKey) {
          existingCaseKeys.add(`${emailKey}_${typeKey}`);
        }

        if (hiddenIds.has(doc.id)) return;

        const chatInfo = chatMap[emailKey] || { unreadByStaff: 0, lastMessage: '' };
        const cleanPhotoUrl = (data.photoUrl && !data.photoUrl.includes('unsplash.com')) ? data.photoUrl : '';

        realCases.push({
          id: doc.id,
          applicantId: data.applicantId || '1',
          name: fullName,
          email: data.email || formData.email_contacto || '',
          phone: data.phone || formData.celular_contacto || '',
          visaType: data.visaType === 'B-2' ? 'B-2' : 'F-1',
          schoolState: data.schoolState || formData.estado_estudio_usa || 'Utah',
          schoolName:
            data.schoolName ||
            formData.nombre_escuela ||
            (data.visaType === 'B-2' ? 'N/A (Turismo B-2)' : 'Sin escuela seleccionada'),
          status: data.status || 'nuevos',
          submittedAt: parseDateSafe(data.submittedAt || data.createdAt),
          updatedAt: parseDateTimeSafe(data.updatedAt || data.createdAt),
          photoUrl: cleanPhotoUrl,
          passportDoc: data.passportDoc || null,
          bankStatementDoc: data.bankStatementDoc || null,
          formData: formData,
          notes: data.notes || '',
          unreadCount: chatInfo.unreadByStaff || 0,
          lastChatMessage: chatInfo.lastMessage || '',
        });
      });
    } catch (solErr: any) {
      console.warn('Could not fetch solicitudes_visas:', solErr);
      fetchErrors.push(`solicitudes_visas: ${solErr?.message || solErr}`);
    }

    // 2. Cross-reference users collection: guarantee any registered client or purchaser appears in Staff
    const purchasesByEmail: Record<string, string[]> = {};
    const entitlementsByEmail: Record<string, Record<string, boolean>> = {};
    const PURCHASE_LABELS: Record<string, string> = {
      purchased_plan_esencial: 'Plan Esencial (F-1)',
      purchased_plan_pro: 'Plan Pro (F-1)',
      purchased_plan_elite: 'Plan Elite (F-1)',
      purchased_plan_allinclusive: 'Plan All-Inclusive (F-1)',
      purchased_plan_turista_basico: 'Plan Turista Básico (B-2)',
      purchased_plan_turista_premium: 'Plan Turista Premium (B-2)',
      purchased_plan_turista_vip: 'Plan Turista VIP (B-2)',
      purchased_curso_estudiante: 'Curso Digital Estudiante',
      purchased_libro_estudiante: 'Libro Digital Estudiante',
      purchased_curso_turista: 'Curso Digital Turista',
      purchased_libro_turista: 'Libro Digital Turista',
      purchased_aplicacion_escuela: 'Aplicación a la Escuela',
      purchased_sevis: 'Tasa SEVIS (I-901)',
      purchased_entrevista_embajada: 'Simulacro de Entrevista',
      purchased_recursos_estudiante: 'Recursos Adicionales Estudiante',
      purchased_recursos_turista: 'Recursos Adicionales Turista',
    };

    try {
      const usersSnap = await db.collection('users').get();
      usersSnap.forEach(uDoc => {
        const uData = uDoc.data();
        const uEmail = (uData.email || '').toLowerCase().trim();
        if (!uEmail) return;

        purchasesByEmail[uEmail] = Object.keys(PURCHASE_LABELS).filter(key => Boolean(uData[key])).map(key => PURCHASE_LABELS[key]);
        entitlementsByEmail[uEmail] = Object.keys(PURCHASE_LABELS).reduce((acc, key) => {
          acc[key] = Boolean(uData[key]);
          return acc;
        }, {} as Record<string, boolean>);

        const hasStudent = Boolean(
          uData.purchased_plan_esencial ||
          uData.purchased_plan_pro ||
          uData.purchased_plan_elite ||
          uData.purchased_plan_allinclusive
        );

        const hasTourist = Boolean(
          uData.purchased_plan_turista_basico ||
          uData.purchased_plan_turista_premium ||
          uData.purchased_plan_turista_vip
        );

        const userDisplayName = uData.displayName || uData.name || (uEmail.split('@')[0] || 'Cliente Registrado');
        const userPhone = uData.phone || uData.phoneNumber || '';
        const userSubmittedAt = parseDateSafe(uData.createdAt || uData.last_payment_at || uData.lastLogin);
        const userUpdatedAt = parseDateTimeSafe(uData.updatedAt || uData.last_payment_at || uData.lastLogin || uData.createdAt);

        const syntheticF1Id = `case_${uEmail.replace(/[^a-zA-Z0-9]/g, '_')}_f1`;
        const syntheticB2Id = `case_${uEmail.replace(/[^a-zA-Z0-9]/g, '_')}_b2`;

        if (hasStudent && !existingCaseKeys.has(`${uEmail}_f1`) && !hiddenIds.has(syntheticF1Id)) {
          const chatInfo = chatMap[uEmail] || { unreadByStaff: 0, lastMessage: '' };
          existingCaseKeys.add(`${uEmail}_f1`);
          realCases.push({
            id: syntheticF1Id,
            applicantId: '1',
            name: userDisplayName,
            email: uEmail,
            phone: userPhone,
            visaType: 'F-1',
            schoolState: 'Utah',
            schoolName: 'Lumos Language School (Salt Lake City)',
            status: 'nuevos',
            submittedAt: userSubmittedAt,
            updatedAt: userUpdatedAt,
            // No official photo yet — this entry only exists because the client purchased a plan.
            // We must never show a Google-account profile picture here as if it were the
            // consular 5x5 photo the client is supposed to upload themselves.
            photoUrl: '',
            passportDoc: null,
            bankStatementDoc: null,
            formData: {
              email_contacto: uEmail,
              nombres: userDisplayName.split(' ')[0] || '',
              apellidos: userDisplayName.split(' ').slice(1).join(' ') || '',
            },
            notes: 'Plan Estudiante F-1 adquirido. Expediente pendiente de llenado consular.',
            unreadCount: chatInfo.unreadByStaff || 0,
            lastChatMessage: chatInfo.lastMessage || '',
            purchases: purchasesByEmail[uEmail] || [],
          });
        }

        if (hasTourist && !existingCaseKeys.has(`${uEmail}_b2`) && !hiddenIds.has(syntheticB2Id)) {
          const chatInfo = chatMap[uEmail] || { unreadByStaff: 0, lastMessage: '' };
          existingCaseKeys.add(`${uEmail}_b2`);
          realCases.push({
            id: syntheticB2Id,
            applicantId: '1',
            name: userDisplayName,
            email: uEmail,
            phone: userPhone,
            visaType: 'B-2',
            schoolState: 'Utah',
            schoolName: 'N/A (Turismo B-2)',
            status: 'nuevos',
            submittedAt: userSubmittedAt,
            updatedAt: userUpdatedAt,
            photoUrl: '',
            passportDoc: null,
            bankStatementDoc: null,
            formData: {
              email_contacto: uEmail,
              nombres: userDisplayName.split(' ')[0] || '',
              apellidos: userDisplayName.split(' ').slice(1).join(' ') || '',
            },
            notes: 'Plan Turista B-2 adquirido. Expediente pendiente de llenado consular.',
            unreadCount: chatInfo.unreadByStaff || 0,
            lastChatMessage: chatInfo.lastMessage || '',
            purchases: purchasesByEmail[uEmail] || [],
          });
        }

        // Every registered account shows up in Staff right away, even before buying
        // anything — but with no visa service purchased (F-1 or B-2 plan specifically;
        // Master Class / Libro / Recursos don't count), there's no applicant card yet, so
        // there's nothing to fill a 13-section dossier with. This placeholder lets Staff see
        // and act on (lock/unlock products for) a brand-new lead without a real expediente
        // existing until they actually buy a visa service.
        const placeholderId = `case_${uEmail.replace(/[^a-zA-Z0-9]/g, '_')}_registered`;
        if (
          !hasStudent && !hasTourist &&
          !existingCaseKeys.has(`${uEmail}_f1`) && !existingCaseKeys.has(`${uEmail}_b2`) &&
          !hiddenIds.has(placeholderId)
        ) {
          const chatInfo = chatMap[uEmail] || { unreadByStaff: 0, lastMessage: '' };
          realCases.push({
            id: placeholderId,
            applicantId: '1',
            name: userDisplayName,
            email: uEmail,
            phone: userPhone,
            visaType: 'F-1',
            hasVisaService: false,
            schoolState: '',
            schoolName: '',
            status: 'nuevos',
            submittedAt: userSubmittedAt,
            updatedAt: userUpdatedAt,
            photoUrl: '',
            passportDoc: null,
            bankStatementDoc: null,
            formData: {},
            notes: 'Cliente registrado. Aún no ha comprado ningún servicio de visa (F-1 o B-2).',
            unreadCount: chatInfo.unreadByStaff || 0,
            lastChatMessage: chatInfo.lastMessage || '',
            purchases: purchasesByEmail[uEmail] || [],
          });
        }
      });
    } catch (usersErr: any) {
      console.warn('Could not cross-reference users collection:', usersErr);
      fetchErrors.push(`users: ${usersErr?.message || usersErr}`);
    }

    // Attach purchase info to every case, including ones sourced from solicitudes_visas
    // (which were built before the users-collection pass above ran).
    realCases.forEach(c => {
      const key = (c.email || '').toLowerCase().trim();
      if (!c.purchases) c.purchases = purchasesByEmail[key] || [];
      c.entitlements = entitlementsByEmail[key] || {};
      // Every case except the "registered, no purchase yet" placeholder represents a real
      // applicant card — either an actual solicitudes_visas submission, or a synthetic one
      // seeded because a visa service is purchased. Both cases warrant showing the dossier.
      if (c.hasVisaService === undefined) c.hasVisaService = true;
      // Every card belonging to the same client — whether it's a second F-1 card for another
      // family member, or their separate B-2 tourist process — shares this groupKey, so the
      // Staff UI can fold them all into one expediente with tabs instead of separate list rows.
      c.groupKey = key;
    });

    if (realCases.length === 0) {
      return NextResponse.json({
        cases: [],
        dbConnected: true,
        error: fetchErrors.length > 0
          ? `Firestore conectó pero las consultas fallaron (probable problema de permisos/credenciales del service account): ${fetchErrors.join(' | ')}`
          : undefined,
      });
    }

    // Sort by unread messages first, then updatedAt or submittedAt desc
    realCases.sort((a, b) => {
      if ((b.unreadCount || 0) !== (a.unreadCount || 0)) {
        return (b.unreadCount || 0) - (a.unreadCount || 0);
      }
      const timeA = new Date(a.updatedAt || a.submittedAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.submittedAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ cases: realCases });
  } catch (error: any) {
    console.error('Error fetching staff cases:', error);
    return NextResponse.json({ cases: [], error: error?.message });
  }
}

// Staff-triggered "add another card" for a client who needs more than one applicant slot
// under the same visa service (e.g. bought 3 F-1 visa services for 3 family members).
// Mirrors the doc id scheme /api/portal/submission uses so the client's own portal picks
// this new applicant up the same way it would one it created itself.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, visaType, name } = body;

    if (!email || !visaType) {
      return NextResponse.json({ error: 'email y visaType son requeridos' }, { status: 400 });
    }
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }

    const emailLower = String(email).toLowerCase().trim();
    const emailKey = emailLower.replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';

    // Never collide with the default (unsuffixed) card — staff-created cards always get a
    // fresh, unique applicant id, even if this happens to be the client's very first card.
    const applicantId = String(Date.now());
    const docId = `case_${emailKey}_${typeKey}_${applicantId}`;

    const caseData = {
      id: docId,
      applicantId,
      name: name || 'Postulante',
      email: emailLower,
      phone: '',
      visaType: visaType === 'B-2' ? 'B-2' : 'F-1',
      schoolState: 'Utah',
      schoolName: visaType === 'B-2' ? 'N/A (Turismo B-2)' : 'Sin escuela seleccionada',
      status: 'nuevos',
      submittedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      formData: {
        email_contacto: emailLower,
      },
      notes: 'Expediente creado manualmente por Staff.',
    };

    await db.collection('solicitudes_visas').doc(docId).set(caseData);

    return NextResponse.json({ success: true, caseId: docId, applicantId });
  } catch (error: any) {
    console.error('Error creating new applicant card:', error);
    return NextResponse.json({ error: error?.message || 'Error al crear la tarjeta' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    if (!caseId) {
      return NextResponse.json({ error: 'caseId es requerido' }, { status: 400 });
    }

    if (db) {
      // Remove the actual expediente document if one exists...
      await db.collection('solicitudes_visas').doc(caseId).delete().catch(() => {});
      // ...and blocklist the id so it never resurfaces from the users cross-reference,
      // without touching the client's payment/plan status in the `users` collection.
      await db.collection('staff_hidden_cases').doc(caseId).set({
        hiddenAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, caseId });
  } catch (error: any) {
    console.error('Error deleting staff case:', error);
    return NextResponse.json({ error: error?.message || 'Error al eliminar el expediente' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, status, notes, formData, email, name, visaType } = body;

    if (!caseId) {
      return NextResponse.json({ error: 'caseId es requerido' }, { status: 400 });
    }

    if (db) {
      const docRef = db.collection('solicitudes_visas').doc(caseId);
      const existing = await docRef.get();

      const updatePayload: any = {
        updatedAt: new Date().toISOString()
      };
      if (status) updatePayload.status = status;
      if (notes !== undefined) updatePayload.notes = notes;
      if (formData) updatePayload.formData = formData;

      if (existing.exists) {
        await docRef.set(updatePayload, { merge: true });
      } else {
        // This caseId may belong to a "synthetic" case — one that only exists in the Staff
        // list because the client purchased a plan, with no real solicitudes_visas document
        // yet. Editing it for the first time needs to seed the baseline fields, or it would
        // be saved as a bare stub missing name/email/visaType.
        updatePayload.email = email || formData?.email_contacto || '';
        updatePayload.name = name || `${formData?.nombres || ''} ${formData?.apellidos || ''}`.trim() || 'Postulante';
        updatePayload.visaType = visaType === 'B-2' ? 'B-2' : 'F-1';
        updatePayload.status = updatePayload.status || 'nuevos';
        updatePayload.createdAt = new Date().toISOString();
        await docRef.set(updatePayload);
      }
    }

    return NextResponse.json({ success: true, caseId, status });
  } catch (error: any) {
    console.error('Error updating case status in staff:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar el estado' }, { status: 500 });
  }
}
