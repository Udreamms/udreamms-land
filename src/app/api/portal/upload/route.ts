import { NextRequest, NextResponse } from 'next/server';
import { admin } from '@/backend/firebase/admin';
import { randomUUID } from 'crypto';

const MAX_FILE_BYTES = 15 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    if (!admin.apps.length) {
      return NextResponse.json({ error: 'Firebase Admin no está configurado en este entorno.' }, { status: 500 });
    }

    const body = await req.json();
    const { dataUrl, fileName, contentType, email, visaType, applicantId, docType } = body;

    if (!dataUrl || !docType) {
      return NextResponse.json({ error: 'Faltan datos obligatorios (dataUrl, docType)' }, { status: 400 });
    }

    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      return NextResponse.json({ error: 'Formato de archivo inválido, se esperaba un data URL en base64.' }, { status: 400 });
    }

    const mimeType = contentType || match[1] || 'application/octet-stream';
    const buffer = Buffer.from(match[2], 'base64');

    if (buffer.length > MAX_FILE_BYTES) {
      return NextResponse.json({ error: 'El archivo excede el tamaño máximo permitido (15MB).' }, { status: 400 });
    }

    const emailKey = (email || 'anonimo').toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const typeKey = visaType === 'B-2' ? 'b2' : 'f1';
    const safeFileName = String(fileName || 'archivo').replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectPath = `client-uploads/${emailKey}/${typeKey}_${applicantId || '1'}/${docType}-${Date.now()}-${safeFileName}`;

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || undefined;
    const bucket = bucketName ? admin.storage().bucket(bucketName) : admin.storage().bucket();
    const file = bucket.file(objectPath);
    const downloadToken = randomUUID();

    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
        metadata: { firebaseStorageDownloadTokens: downloadToken },
      },
    });

    const encodedPath = encodeURIComponent(objectPath);
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`;

    return NextResponse.json({ success: true, url, path: objectPath });
  } catch (error: any) {
    console.error('Error uploading portal document:', error);
    return NextResponse.json({ error: error?.message || 'Error al subir el archivo a la nube.' }, { status: 500 });
  }
}
