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
    
    // Check hidden cases list to ignore deleted cards
    const hiddenIds = new Set<string>();
    try {
      const hiddenSnap = await db.collection('staff_hidden_cases').get();
      hiddenSnap.forEach((hDoc) => hiddenIds.add(hDoc.id));
    } catch (hErr) {}

    // Indexed lookup by email, fetching only the two fields we need (no base64 documents).
    // Legacy docs that only carry formData.email_contacto are matched by the second query.
    const emailVariants = Array.from(new Set([email.trim(), emailLower]));
    const [byEmail, byContact]= await Promise.all([
      db.collection('solicitudes_visas').where('email', 'in', emailVariants).select('applicantId', 'visaType').get(),
      db.collection('solicitudes_visas').where('formData.email_contacto', 'in', emailVariants).select('applicantId', 'visaType').get(),
    ]);
    const seen = new Set<string>();
    const docs = [...byEmail.docs, ...byContact.docs].filter((d) => !seen.has(d.id) && seen.add(d.id));

    const applicantIds: string[] = [];
    docs.forEach((doc) => {
      if (hiddenIds.has(doc.id)) return;
      const data = doc.data();
      const docVisaType = data.visaType === 'B-2' ? 'B-2' : 'F-1';
      if (docVisaType === visaType) {
        const aId = data.applicantId || '1';
        if (!applicantIds.includes(aId)) {
          applicantIds.push(aId);
        }
      }
    });

    return NextResponse.json({ applicantIds, count: applicantIds.length });
  } catch (error: any) {
    console.error('Error listing applicants:', error);
    return NextResponse.json({ error: error?.message || 'Error al obtener aplicantes', applicantIds: [] }, { status: 500 });
  }
}
