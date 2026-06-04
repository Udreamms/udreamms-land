// Utilidad para enviar eventos al Píxel (Cliente) y a la API de Conversiones (Servidor)

// Generar un ID único para la deduplicación de eventos
const generateEventId = () => {
  return 'event_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

export const sendMetaEvent = async (
  eventName: string,
  eventData: any = {},
  userData: { email?: string; phone?: string } = {},
  testEventCode?: string
) => {
  const eventId = generateEventId();

  // 1. Enviar evento al Píxel (Cliente)
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData, { eventID: eventId });
  }

  // 2. Enviar evento a nuestro backend para la API de Conversiones (Servidor)
  try {
    // Obtener cookies de fbp y fbc si existen
    const getCookie = (name: string) => {
      if (typeof document === 'undefined') return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return undefined;
    };

    // Para la deduplicación de Meta, el event_id debe coincidir exactamente.
    await fetch('/api/meta/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventData,
        eventId,
        eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        email: userData.email,
        phone: userData.phone,
        testEventCode: testEventCode, // Se envía si se quiere probar en el administrador
      }),
    });
  } catch (error) {
    console.error('Error enviando evento a la API de Conversiones:', error);
  }
};
