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
    const { visaType, formData, photoUrl, passportDoc, bankStatementDoc, userEmail, userName, userId } = body;

    if (!visaType || !formData) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (visaType, formData)' }, { status: 400 });
    }

    const email = userEmail || formData.email_contacto || 'anonimo';
    const emailKey = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';
    const docId = `case_${emailKey}_${typeKey}`;

    const fullName = `${formData.nombres || ''} ${formData.apellidos || ''}`.trim() || userName || userEmail || 'Postulante';

    const cleanPassport = sanitizeDocForFirestore(passportDoc);
    const cleanBank = sanitizeDocForFirestore(bankStatementDoc);
    const cleanPhoto = sanitizePhotoUrl(photoUrl);

    const caseData: any = {
      id: docId,
      name: fullName,
      email: email,
      phone: formData.celular_contacto || '',
      visaType: visaType === 'B-2' ? 'B-2' : 'F-1',
      schoolState: formData.estado_estudio_usa || 'Utah',
      schoolName: formData.nombre_escuela || (visaType === 'B-2' ? 'N/A (Turismo B-2)' : 'Sin escuela seleccionada'),
      submittedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      photoUrl: cleanPhoto,
      formData: formData,
    };

    if (cleanPassport) caseData.passportDoc = cleanPassport;
    if (cleanBank) caseData.bankStatementDoc = cleanBank;

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

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ case: null });
    }

    const emailKey = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';
    const docId = `case_${emailKey}_${typeKey}`;

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
