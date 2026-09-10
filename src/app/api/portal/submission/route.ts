import { NextRequest, NextResponse } from 'next/server';
import { admin, db } from '@/backend/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visaType, formData, photoUrl, passportDoc, bankStatementDoc, userEmail, userName, userId } = body;

    if (!visaType || !formData) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (visaType, formData)' }, { status: 400 });
    }

    const emailKey = (userEmail || formData.email_contacto || 'anonimo').toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';
    const docId = `case_${emailKey}_${typeKey}`;

    const fullName = `${formData.nombres || ''} ${formData.apellidos || ''}`.trim() || userName || userEmail || 'Postulante';

    const caseData = {
      id: docId,
      name: fullName,
      email: userEmail || formData.email_contacto || '',
      phone: formData.celular_contacto || '',
      visaType: visaType === 'B-2' ? 'B-2' : 'F-1',
      schoolState: formData.estado_estudio_usa || 'Utah',
      schoolName: formData.nombre_escuela || (visaType === 'B-2' ? 'N/A (Turismo B-2)' : 'Sin escuela seleccionada'),
      submittedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
      photoUrl: photoUrl || '',
      passportDoc: passportDoc || null,
      bankStatementDoc: bankStatementDoc || null,
      formData: formData,
    };

    if (db) {
      const docRef = db.collection('solicitudes_visas').doc(docId);
      const existing = await docRef.get();
      if (existing.exists) {
        // Keep existing status unless newly set
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
