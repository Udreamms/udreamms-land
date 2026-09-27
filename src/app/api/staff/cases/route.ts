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

function parseTimestampMs(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const t = new Date(val).getTime();
    return isNaN(t) ? 0 : t;
  }
  if (typeof val === 'object') {
    if (typeof val.toDate === 'function') return val.toDate().getTime();
    if (val._seconds) return val._seconds * 1000 + (val._nanoseconds ? Math.round(val._nanoseconds / 1000000) : 0);
    if (val.seconds) return val.seconds * 1000 + (val.nanoseconds ? Math.round(val.nanoseconds / 1000000) : 0);
  }
  if (val instanceof Date) return val.getTime();
  return 0;
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
          sevisDoc: data.sevisDoc || null,
          i20Doc: data.i20Doc || null,
          ds160Doc: data.ds160Doc || null,
          acceptanceLetterDoc: data.acceptanceLetterDoc || null,
          affidavitDoc: data.affidavitDoc || null,
          embassyAppointmentDoc: data.embassyAppointmentDoc || null,
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
    const userCreatedAtRaw: Record<string, number> = {};
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

        const userTimestamp = parseTimestampMs(uData.createdAt || uData.lastLogin || uData.last_payment_at);
        if (userTimestamp > 0) {
          userCreatedAtRaw[uEmail] = userTimestamp;
        }

        const currentEnt = entitlementsByEmail[uEmail] || {};
        const newEnt = Object.keys(PURCHASE_LABELS).reduce((acc, key) => {
          if (uData[key] !== undefined) {
            acc[key] = Boolean(uData[key]);
          } else {
            acc[key] = Boolean(currentEnt[key]);
          }
          return acc;
        }, {} as Record<string, boolean>);
        entitlementsByEmail[uEmail] = newEnt;
        purchasesByEmail[uEmail] = Object.keys(PURCHASE_LABELS).filter(key => Boolean(newEnt[key])).map(key => PURCHASE_LABELS[key]);

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
        const userUpdatedAt = parseDateTimeSafe(uData.updatedAt || uData.last_payment_at || uData.createdAt);
        const userCountry = uData.country || uData.pais || uData.nacionalidad || '';
        const userBirthDate = uData.birthDate || uData.fecha_nacimiento || uData.birth_date || '';

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
            photoUrl: '',
            passportDoc: null,
            bankStatementDoc: null,
            sevisDoc: null,
            i20Doc: null,
            ds160Doc: null,
            acceptanceLetterDoc: null,
            affidavitDoc: null,
            embassyAppointmentDoc: null,
            formData: {
              email_contacto: uEmail,
              celular_contacto: userPhone,
              pais_domicilio: userCountry,
              fecha_nacimiento: userBirthDate,
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
            sevisDoc: null,
            i20Doc: null,
            ds160Doc: null,
            acceptanceLetterDoc: null,
            affidavitDoc: null,
            embassyAppointmentDoc: null,
            formData: {
              email_contacto: uEmail,
              celular_contacto: userPhone,
              pais_domicilio: userCountry,
              fecha_nacimiento: userBirthDate,
              nombres: userDisplayName.split(' ')[0] || '',
              apellidos: userDisplayName.split(' ').slice(1).join(' ') || '',
            },
            notes: 'Plan Turista B-2 adquirido. Expediente pendiente de llenado consular.',
            unreadCount: chatInfo.unreadByStaff || 0,
            lastChatMessage: chatInfo.lastMessage || '',
            purchases: purchasesByEmail[uEmail] || [],
          });
        }

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
            sevisDoc: null,
            i20Doc: null,
            ds160Doc: null,
            acceptanceLetterDoc: null,
            affidavitDoc: null,
            embassyAppointmentDoc: null,
            formData: {
              email_contacto: uEmail,
              celular_contacto: userPhone,
              pais_domicilio: userCountry,
              fecha_nacimiento: userBirthDate,
              nombres: userDisplayName.split(' ')[0] || '',
              apellidos: userDisplayName.split(' ').slice(1).join(' ') || '',
            },
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

    // Calculate sequential Expediente Number per unique client (ordered chronologically by user registration timestamp)
    const clientEarliestDateMap = new Map<string, number>();
    realCases.forEach(c => {
      const key = c.groupKey || (c.email || '').toLowerCase().trim();
      const explicitUserTs = userCreatedAtRaw[key];
      const caseTs = parseTimestampMs(c.submittedAt || c.updatedAt);
      const effectiveTs = explicitUserTs || caseTs || Date.now();
      const existing = clientEarliestDateMap.get(key);
      if (!existing || effectiveTs < existing) {
        clientEarliestDateMap.set(key, effectiveTs);
      }
    });

    const sortedClientKeys = Array.from(clientEarliestDateMap.keys()).sort((a, b) => {
      const timeA = clientEarliestDateMap.get(a) || 0;
      const timeB = clientEarliestDateMap.get(b) || 0;
      return timeA - timeB;
    });

    const clientNumberMap = new Map<string, number>();
    sortedClientKeys.forEach((key, idx) => {
      clientNumberMap.set(key, idx + 1);
    });

    realCases.forEach(c => {
      const key = c.groupKey || (c.email || '').toLowerCase().trim();
      c.expedienteNumber = clientNumberMap.get(key) || 1;
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

    // If this doc was previously in staff_hidden_cases, un-hide it
    await db.collection('staff_hidden_cases').doc(docId).delete().catch(() => {});

    // Ensure the client's account has the respective visa process unlocked in the Portal
    try {
      const usersSnap = await db.collection('users').get();
      const batch = db.batch();
      let matchedAny = false;
      usersSnap.forEach((uDoc) => {
        const uData = uDoc.data();
        const uEmail = (uData.email || '').toLowerCase().trim();
        if (uEmail === emailLower) {
          matchedAny = true;
          const planField = visaType === 'B-2' ? 'purchased_plan_turista_basico' : 'purchased_plan_esencial';
          batch.set(uDoc.ref, { [planField]: true, updatedAt: new Date().toISOString() }, { merge: true });
        }
      });
      if (matchedAny) {
        await batch.commit();
      }
    } catch (uErr) {
      console.warn('Could not auto-unlock visa plan for user in users collection:', uErr);
    }

    return NextResponse.json({ success: true, caseId: docId, applicantId, createdCase: caseData });
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
      // 1. Fetch case details before deletion to determine email and visaType
      let targetEmail = '';
      let targetVisaType = '';
      try {
        const existingDoc = await db.collection('solicitudes_visas').doc(caseId).get();
        if (existingDoc.exists) {
          const d = existingDoc.data() || {};
          targetEmail = (d.email || d.formData?.email_contacto || '').toLowerCase().trim();
          targetVisaType = d.visaType || '';
        }
      } catch (err) {
        console.warn('Could not read doc before delete:', err);
      }

      // If synthetic case id, parse email and visaType from id: case_${emailKey}_${typeKey}
      if (!targetEmail && caseId.startsWith('case_')) {
        const parts = caseId.split('_');
        if (parts.includes('f1')) targetVisaType = 'F-1';
        else if (parts.includes('b2')) targetVisaType = 'B-2';
      }

      // 2. Remove the actual expediente document if one exists...
      await db.collection('solicitudes_visas').doc(caseId).delete().catch(() => {});

      // 3. Blocklist the id so it never resurfaces from the users cross-reference
      await db.collection('staff_hidden_cases').doc(caseId).set({
        hiddenAt: new Date().toISOString(),
      });

      // 4. Check if client has ANY remaining active cards in solicitudes_visas for this visaType
      if (targetEmail && targetVisaType) {
        try {
          const allDocsSnap = await db.collection('solicitudes_visas').get();
          let hasRemainingForType = false;
          allDocsSnap.forEach((doc) => {
            if (doc.id === caseId) return;
            const docData = doc.data();
            const dEmail = (docData.email || docData.formData?.email_contacto || '').toLowerCase().trim();
            const dVisa = docData.visaType === 'B-2' ? 'B-2' : 'F-1';
            if (dEmail === targetEmail && dVisa === targetVisaType) {
              hasRemainingForType = true;
            }
          });

          // If no remaining cards of this visa type exist, reset the plan in users collection
          if (!hasRemainingForType) {
            const usersSnap = await db.collection('users').get();
            const batch = db.batch();
            let matchedUser = false;
            usersSnap.forEach((uDoc) => {
              const uData = uDoc.data();
              const uEmail = (uData.email || '').toLowerCase().trim();
              if (uEmail === targetEmail) {
                matchedUser = true;
                if (targetVisaType === 'F-1') {
                  batch.set(uDoc.ref, {
                    purchased_plan_esencial: false,
                    purchased_plan_pro: false,
                    purchased_plan_elite: false,
                    purchased_plan_allinclusive: false,
                    updatedAt: new Date().toISOString(),
                  }, { merge: true });
                } else if (targetVisaType === 'B-2') {
                  batch.set(uDoc.ref, {
                    purchased_plan_turista_basico: false,
                    purchased_plan_turista_premium: false,
                    purchased_plan_turista_vip: false,
                    updatedAt: new Date().toISOString(),
                  }, { merge: true });
                }
              }
            });
            if (matchedUser) {
              await batch.commit();
            }
          }
        } catch (uResetErr) {
          console.warn('Could not check remaining cards or reset plan on delete:', uResetErr);
        }
      }
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
    const {
      caseId,
      status,
      notes,
      formData,
      email,
      name,
      visaType,
      photoUrl,
      passportDoc,
      bankStatementDoc,
      sevisDoc,
      i20Doc,
      ds160Doc,
      acceptanceLetterDoc,
      affidavitDoc,
      embassyAppointmentDoc,
    } = body;

    if (!caseId) {
      return NextResponse.json({ error: 'caseId es requerido' }, { status: 400 });
    }

    if (db) {
      const docRef = db.collection('solicitudes_visas').doc(caseId);
      const existing = await docRef.get();

      const updatePayload: any = {
        updatedAt: new Date().toISOString(),
      };
      if (status) updatePayload.status = status;
      if (notes !== undefined) updatePayload.notes = notes;
      if (formData) {
        updatePayload.formData = formData;
        const fullName = `${formData.nombres || ''} ${formData.apellidos || ''}`.trim();
        if (fullName) {
          updatePayload.name = fullName;
          const targetEmail = (email || formData?.email_contacto || (existing.exists ? existing.data()?.email : '') || '').toLowerCase().trim();
          if (targetEmail) {
            db.collection('users').where('email', '==', targetEmail).get().then(uSnap => {
              uSnap.forEach(uDoc => {
                uDoc.ref.set({ displayName: fullName, name: fullName }, { merge: true }).catch(() => {});
              });
            }).catch(() => {});
          }
        }
      }
      if ('photoUrl' in body) {
        updatePayload.photoUrl = photoUrl || '';
      }
      if ('passportDoc' in body) updatePayload.passportDoc = passportDoc;
      if ('bankStatementDoc' in body) updatePayload.bankStatementDoc = bankStatementDoc;
      if ('sevisDoc' in body) updatePayload.sevisDoc = sevisDoc;
      if ('i20Doc' in body) updatePayload.i20Doc = i20Doc;
      if ('ds160Doc' in body) updatePayload.ds160Doc = ds160Doc;
      if ('acceptanceLetterDoc' in body) updatePayload.acceptanceLetterDoc = acceptanceLetterDoc;
      if ('affidavitDoc' in body) updatePayload.affidavitDoc = affidavitDoc;
      if ('embassyAppointmentDoc' in body) updatePayload.embassyAppointmentDoc = embassyAppointmentDoc;

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

      // If status is updated, move ALL cases belonging to this client's email so the entire expediente moves together
      if (status && (email || existing.data()?.email)) {
        const clientEmailLower = String(email || existing.data()?.email || '').toLowerCase().trim();
        if (clientEmailLower) {
          try {
            const allClientDocs = await db.collection('solicitudes_visas').get();
            const batch = db.batch();
            allClientDocs.forEach(d => {
              const dData = d.data();
              const dEmail = (dData.email || dData.formData?.email_contacto || '').toLowerCase().trim();
              if (dEmail === clientEmailLower && d.id !== caseId) {
                batch.update(d.ref, { status, updatedAt: new Date().toISOString() });
              }
            });
            await batch.commit();
          } catch (batchErr) {
            console.warn('Could not batch update client cases status:', batchErr);
          }
        }
      }
    }

    return NextResponse.json({ success: true, caseId, status });
  } catch (error: any) {
    console.error('Error updating case status in staff:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar el estado' }, { status: 500 });
  }
}
