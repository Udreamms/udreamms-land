import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

// Lets the client's own portal discover applicant "cards" that exist in the cloud but
// weren't created on this browser — most commonly ones Staff added manually for a client
// who bought multiple visa services (e.g. 3 family members under one F-1 plan).
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const visaType = searchParams.get('visaType') || 'F-1';

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }
    if (!db) {
      return NextResponse.json({ applicantIds: [] });
    }

    const emailLower = email.toLowerCase().trim();
    const snap = await db.collection('solicitudes_visas').where('email', '==', emailLower).get();

    const applicantIds: string[] = [];
    snap.forEach(doc => {
      const data = doc.data();
      const docVisaType = data.visaType === 'B-2' ? 'B-2' : 'F-1';
      if (docVisaType === visaType) {
        applicantIds.push(data.applicantId || '1');
      }
    });

    return NextResponse.json({ applicantIds });
  } catch (error: any) {
    console.error('Error listing applicants:', error);
    return NextResponse.json({ error: error?.message || 'Error al obtener aplicantes', applicantIds: [] }, { status: 500 });
  }
}
