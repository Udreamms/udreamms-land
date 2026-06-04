import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventData, eventId, eventSourceUrl, clientIp, userAgent, fbp, fbc, email, phone, testEventCode } = body;

    const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Faltan credenciales de Meta' }, { status: 500 });
    }

    // Configurar la carga útil para la API de Conversiones
    // Aplicando deduplicación con event_id si está presente
    const payload = {
      // test_event_code se usa solo para hacer pruebas en el Administrador de Eventos
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000), // En segundos
          event_id: eventId, // Para deduplicación (Pixel vs Server)
          action_source: 'website',
          event_source_url: eventSourceUrl,
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
            fbp: fbp, // Cookie de pixel
            fbc: fbc, // Cookie de click de fb
          } as any,
          custom_data: eventData || {},
        },
      ],
    };

    // Añadir email/phone si existen (ya deberían venir en SHA-256 desde el frontend)
    if (email) payload.data[0].user_data.em = [email];
    if (phone) payload.data[0].user_data.ph = [phone];

    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Meta API Error:', data);
      return NextResponse.json({ error: 'Error de la API de Meta', details: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error procesando evento Meta:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
