import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

// Sample fallback cases for initial preview if DB is fresh
const defaultCases = [
  {
    id: "STU-8401",
    name: "Juan Carlos Pérez Gómez",
    email: "juan.perez@gmail.com",
    phone: "+52 55 1234 5678",
    visaType: "F-1",
    schoolState: "Utah",
    schoolName: "Lumos Language School (Salt Lake City)",
    status: "nuevos",
    submittedAt: "2026-09-07",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    formData: {
      apellidos: "Pérez Gómez",
      nombres: "Juan Carlos",
      fecha_nacimiento: "1998-05-14",
      ciudad_nacimiento: "Ciudad de México",
      pais_nacimiento: "México",
      num_identificacion_nacional: "PERJ980514HDFR",
      duracion_estudio: "6 meses",
      horario_estudio: "Mañana",
      semestre_inicio: "Septiembre",
      estado_estudio_usa: "Utah",
      nombre_escuela: "Lumos Language School (Salt Lake City)",
      estado_civil: "Soltero",
      num_pasaporte: "G38492019",
      fecha_expiracion_pasaporte: "2031-10-15",
      celular_contacto: "+52 55 1234 5678",
      email_contacto: "juan.perez@gmail.com",
      trabajo_empresa: "Tech Solutions S.A.",
      trabajo_salario: "$1,800 USD",
    }
  },
  {
    id: "STU-8402",
    name: "María Fernanda Gómez",
    email: "maria.gomez@hotmail.com",
    phone: "+57 310 987 6543",
    visaType: "B-2",
    schoolState: "Utah",
    schoolName: "N/A (Turismo)",
    status: "ds160",
    submittedAt: "2026-09-06",
    formData: {
      apellidos: "Gómez Silva",
      nombres: "María Fernanda",
      fecha_nacimiento: "1995-11-20",
      ciudad_nacimiento: "Bogotá",
      pais_nacimiento: "Colombia",
      num_identificacion_nacional: "1098473821",
      estado_civil: "Casado",
      nombre_conyuge: "Carlos Andrés Silva",
      num_pasaporte: "CO982341",
      celular_contacto: "+57 310 987 6543",
      email_contacto: "maria.gomez@hotmail.com",
      trabajo_empresa: "Bancolombia",
      trabajo_salario: "$2,400 USD",
      usa_hospedaje_direccion: "Salt Lake Marriott Downtown, Utah",
      usa_fecha_llegada: "2026-11-10",
      usa_fecha_salida: "2026-11-25"
    }
  }
];

export async function GET(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ cases: defaultCases });
    }

    const snapshot = await db.collection('solicitudes_visas').get();
    
    if (snapshot.empty) {
      return NextResponse.json({ cases: defaultCases });
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

      const chatInfo = chatMap[emailKey] || { unreadByStaff: 0, lastMessage: '' };

      realCases.push({
        id: doc.id,
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
        submittedAt:
          data.submittedAt ||
          (data.createdAt ? data.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
        updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
        photoUrl: data.photoUrl || '',
        passportDoc: data.passportDoc || null,
        bankStatementDoc: data.bankStatementDoc || null,
        formData: formData,
        notes: data.notes || '',
        unreadCount: chatInfo.unreadByStaff || 0,
        lastChatMessage: chatInfo.lastMessage || '',
      });
    });

    // Cross-reference users collection: guarantee any client who purchased a plan appears immediately in Staff
    try {
      const usersSnap = await db.collection('users').get();
      usersSnap.forEach(uDoc => {
        const uData = uDoc.data();
        const uEmail = (uData.email || '').toLowerCase().trim();
        if (!uEmail) return;

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

        if (hasStudent && !existingCaseKeys.has(`${uEmail}_f1`)) {
          const chatInfo = chatMap[uEmail] || { unreadByStaff: 0, lastMessage: '' };
          existingCaseKeys.add(`${uEmail}_f1`);
          realCases.push({
            id: `case_${uEmail.replace(/[^a-zA-Z0-9]/g, '_')}_f1`,
            name: uData.displayName || uData.name || uEmail.split('@')[0] || 'Postulante F-1',
            email: uEmail,
            phone: uData.phone || uData.phoneNumber || '',
            visaType: 'F-1',
            schoolState: 'Utah',
            schoolName: 'Lumos Language School (Salt Lake City)',
            status: 'nuevos',
            submittedAt: uData.createdAt ? uData.createdAt.split('T')[0] : (uData.last_payment_at ? uData.last_payment_at.split('T')[0] : new Date().toISOString().split('T')[0]),
            updatedAt: uData.updatedAt || uData.last_payment_at || new Date().toISOString(),
            photoUrl: uData.photoURL || '',
            passportDoc: null,
            bankStatementDoc: null,
            formData: {
              email_contacto: uEmail,
              nombres: (uData.displayName || uData.name || '').split(' ')[0] || '',
              apellidos: (uData.displayName || uData.name || '').split(' ').slice(1).join(' ') || '',
            },
            notes: 'Plan F-1 adquirido. Expediente pendiente de llenado.',
            unreadCount: chatInfo.unreadByStaff || 0,
            lastChatMessage: chatInfo.lastMessage || '',
          });
        }

        if (hasTourist && !existingCaseKeys.has(`${uEmail}_b2`)) {
          const chatInfo = chatMap[uEmail] || { unreadByStaff: 0, lastMessage: '' };
          existingCaseKeys.add(`${uEmail}_b2`);
          realCases.push({
            id: `case_${uEmail.replace(/[^a-zA-Z0-9]/g, '_')}_b2`,
            name: uData.displayName || uData.name || uEmail.split('@')[0] || 'Postulante B-2',
            email: uEmail,
            phone: uData.phone || uData.phoneNumber || '',
            visaType: 'B-2',
            schoolState: 'Utah',
            schoolName: 'N/A (Turismo B-2)',
            status: 'nuevos',
            submittedAt: uData.createdAt ? uData.createdAt.split('T')[0] : (uData.last_payment_at ? uData.last_payment_at.split('T')[0] : new Date().toISOString().split('T')[0]),
            updatedAt: uData.updatedAt || uData.last_payment_at || new Date().toISOString(),
            photoUrl: uData.photoURL || '',
            passportDoc: null,
            bankStatementDoc: null,
            formData: {
              email_contacto: uEmail,
              nombres: (uData.displayName || uData.name || '').split(' ')[0] || '',
              apellidos: (uData.displayName || uData.name || '').split(' ').slice(1).join(' ') || '',
            },
            notes: 'Plan B-2 adquirido. Expediente pendiente de llenado.',
            unreadCount: chatInfo.unreadByStaff || 0,
            lastChatMessage: chatInfo.lastMessage || '',
          });
        }
      });
    } catch (usersErr) {
      console.warn('Could not cross-reference users collection:', usersErr);
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, status, notes } = body;

    if (!caseId) {
      return NextResponse.json({ error: 'caseId es requerido' }, { status: 400 });
    }

    if (db) {
      const updatePayload: any = {
        updatedAt: new Date().toISOString()
      };
      if (status) updatePayload.status = status;
      if (notes !== undefined) updatePayload.notes = notes;

      await db.collection('solicitudes_visas').doc(caseId).set(updatePayload, { merge: true });
    }

    return NextResponse.json({ success: true, caseId, status });
  } catch (error: any) {
    console.error('Error updating case status in staff:', error);
    return NextResponse.json({ error: error?.message || 'Error al actualizar el estado' }, { status: 500 });
  }
}
