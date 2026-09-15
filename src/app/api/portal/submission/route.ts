import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/backend/firebase/admin';

function sanitizeDocForFirestore(doc: any): any {
  if (!doc) return null;
  // If dataUrl exceeds 450KB, truncate dataUrl to prevent Firestore 1MB doc limit error while keeping metadata
  const copy = { ...doc };
  if (copy.dataUrl && typeof copy.dataUrl === 'string' && copy.dataUrl.length > 450000) {
    copy.dataUrl = copy.dataUrl.substring(0, 500) + '...[truncated_due_to_size]';
    copy.sizeNote = 'Archivo cargado localmente en el navegador del postulante';
  }
  return copy;
}

function sanitizePhotoUrl(url: any): string {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:') && url.length > 450000) {
    return ''; // Oversized base64 photo - keep metadata clean
  }
  return url;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      visaType,
      formData,
      photoUrl,
      passportDoc,
      bankStatementDoc,
      sevisDoc,
      i20Doc,
      ds160Doc,
      acceptanceLetterDoc,
      affidavitDoc,
      embassyAppointmentDoc,
      userEmail,
      userName,
      userId,
      applicantId,
    } = body;

    if (!visaType || !formData) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (visaType, formData)' }, { status: 400 });
    }

    const email = userEmail || formData.email_contacto || 'anonimo';
    const emailKey = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';
    // Applicant '1' (the default, single-applicant case) keeps the legacy doc id so
    // existing expedientes keep merging into the same document. Additional applicants
    // under the same account get their own suffixed id so they never overwrite each other.
    const normalizedApplicantId = applicantId || '1';
    const docId = normalizedApplicantId === '1'
      ? `case_${emailKey}_${typeKey}`
      : `case_${emailKey}_${typeKey}_${normalizedApplicantId}`;

    const fullName = `${formData.nombres || ''} ${formData.apellidos || ''}`.trim() || userName || userEmail || 'Postulante';

    const cleanPassport = sanitizeDocForFirestore(passportDoc);
    const cleanBank = sanitizeDocForFirestore(bankStatementDoc);
    const cleanSevis = sanitizeDocForFirestore(sevisDoc);
    const cleanI20 = sanitizeDocForFirestore(i20Doc);
    const cleanDs160 = sanitizeDocForFirestore(ds160Doc);
    const cleanAcceptance = sanitizeDocForFirestore(acceptanceLetterDoc);
    const cleanAffidavit = sanitizeDocForFirestore(affidavitDoc);
    const cleanEmbassyAppointment = sanitizeDocForFirestore(embassyAppointmentDoc);
    const cleanPhoto = sanitizePhotoUrl(photoUrl);

    const caseData: any = {
      id: docId,
      applicantId: normalizedApplicantId,
      name: fullName,
      email: email,
      phone: formData.celular_contacto || '',
      visaType: visaType === 'B-2' ? 'B-2' : 'F-1',
      schoolState: formData.estado_estudio_usa || 'Utah',
      schoolName: formData.nombre_escuela || (visaType === 'B-2' ? 'N/A (Turismo B-2)' : 'Sin escuela seleccionada'),
      submittedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      formData: formData,
    };

    // Only touch these fields when the client actually meant to change them. A save
    // triggered by uploading just one document (or removing it) always explicitly includes
    // that field's key in the request body — even as null, to mean "clear it". A save that
    // isn't about that field at all (e.g. only text changed) omits the key entirely, so
    // `'photoUrl' in body` is false and we never touch — and never accidentally wipe —
    // whatever was already synced for it.
    if ('photoUrl' in body) caseData.photoUrl = cleanPhoto;
    if ('passportDoc' in body) caseData.passportDoc = cleanPassport;
    if ('bankStatementDoc' in body) caseData.bankStatementDoc = cleanBank;
    if ('sevisDoc' in body) caseData.sevisDoc = cleanSevis;
    if ('i20Doc' in body) caseData.i20Doc = cleanI20;
    if ('ds160Doc' in body) caseData.ds160Doc = cleanDs160;
    if ('acceptanceLetterDoc' in body) caseData.acceptanceLetterDoc = cleanAcceptance;
    if ('affidavitDoc' in body) caseData.affidavitDoc = cleanAffidavit;
    if ('embassyAppointmentDoc' in body) caseData.embassyAppointmentDoc = cleanEmbassyAppointment;

    if (db) {
      const docRef = db.collection('solicitudes_visas').doc(docId);
      const existing = await docRef.get();
      if (existing.exists) {
        const existingData = existing.data();
        await docRef.set({
          ...caseData,
          status: existingData?.status || 'nuevos',
          createdAt: existingData?.createdAt || new Date().toISOString(),
        }, { merge: true });
      } else {
        await docRef.set({
          ...caseData,
          status: 'nuevos',
          createdAt: new Date().toISOString(),
        });
      }

      // Also update user document if userId or email matches
      if (userId) {
        try {
          await db.collection('users').doc(userId).set({
            name: fullName,
            displayName: fullName,
            phone: formData.celular_contacto || '',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (uErr) {
          // non-blocking
        }
      }
    }

    return NextResponse.json({ success: true, caseId: docId });
  } catch (error: any) {
    console.error('Error saving consular submission:', error);
    return NextResponse.json({ error: error?.message || 'Error al guardar la postulación' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const visaType = searchParams.get('visaType') || 'F-1';
    const applicantId = searchParams.get('applicantId') || '1';

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ case: null, dbConnected: false });
    }

    const emailKey = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';
    const docId = applicantId === '1'
      ? `case_${emailKey}_${typeKey}`
      : `case_${emailKey}_${typeKey}_${applicantId}`;

    const doc = await db.collection('solicitudes_visas').doc(docId).get();
    if (!doc.exists) {
      return NextResponse.json({ case: null });
    }

    return NextResponse.json({ case: doc.data() });
  } catch (error: any) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ error: error?.message || 'Error al obtener postulación' }, { status: 500 });
  }
}

// Lets a client permanently remove one of their own applicant cards. Without this, the
// client's "remove card" button only cleared localStorage — the Firestore document stayed
// behind, so the next cloud sync (which discovers cards Staff or another device created)
// would bring the "removed" card right back.
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const visaType = searchParams.get('visaType') || 'F-1';
    const applicantId = searchParams.get('applicantId') || '1';

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }
    if (!db) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado' }, { status: 500 });
    }

    const emailKey = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';
    const docId = applicantId === '1'
      ? `case_${emailKey}_${typeKey}`
      : `case_${emailKey}_${typeKey}_${applicantId}`;

    await db.collection('solicitudes_visas').doc(docId).delete();

    return NextResponse.json({ success: true, caseId: docId });
  } catch (error: any) {
    console.error('Error deleting submission:', error);
    return NextResponse.json({ error: error?.message || 'Error al eliminar la tarjeta' }, { status: 500 });
  }
}
