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

    const realCases: any[] = [];
    snapshot.forEach(doc => {
      realCases.push({ id: doc.id, ...doc.data() });
    });

    // Sort by updatedAt or submittedAt desc
    realCases.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.submittedAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.submittedAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({ cases: realCases });
  } catch (error: any) {
    console.error('Error fetching staff cases:', error);
    return NextResponse.json({ cases: defaultCases, error: error?.message });
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
