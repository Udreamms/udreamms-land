'use client';

import { useState } from 'react';
import { sendMetaEvent } from '@/lib/meta-events';

export default function TestPixelPage() {
  const [status, setStatus] = useState<string>('');

  const handleTestEvent = async () => {
    setStatus('Enviando evento de prueba a Facebook...');
    try {
      // Reemplaza 'TEST63740' por el código que te da Facebook si cambia
      await sendMetaEvent('Lead', { test_value: '123' }, { email: 'test@udreamms.com' }, 'TEST63740');
      setStatus('¡Evento de prueba enviado! Revisa la pestaña de "Probar Eventos" en Facebook.');
    } catch (error) {
      setStatus('Error al enviar el evento.');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Página de Prueba: Píxel y API de Conversiones</h1>
      <p className="mb-8 text-gray-300 max-w-md text-center">
        Haz clic en el botón de abajo para enviar un evento falso de "Lead" (Cliente Potencial) 
        directamente a Facebook usando el código de prueba TEST63740.
      </p>
      
      <button 
        onClick={handleTestEvent}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
      >
        Enviar Evento de Prueba (Lead)
      </button>

      {status && (
        <div className="mt-8 p-4 bg-gray-800 rounded-md border border-gray-700">
          <p className="text-sm font-mono text-green-400">{status}</p>
        </div>
      )}
    </div>
  );
}
