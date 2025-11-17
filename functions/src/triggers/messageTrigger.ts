
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

const db = firestore();

/**
 * Se dispara cuando se añade un nuevo mensaje a una conversación.
 * Orquesta la lógica del flujo de trabajo: lee el estado actual, determina el siguiente paso y actualiza el estado.
 */
export const onMessageCreated = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const { conversationId } = context.params;
    const messageData = snap.data();

    // Ignorar mensajes enviados por el bot para evitar bucles infinitos
    if (messageData.sender !== 'customer') {
      functions.logger.info(`[${conversationId}] Mensaje del bot ignorado.`);
      return null;
    }

    try {
      // 1. Obtener el `userId` del documento de la oportunidad.
      // El ID de la conversación es el número de teléfono, que es el ID de la oportunidad.
      const opportunityRef = db.collection('opportunities').doc(conversationId);
      const opportunityDoc = await opportunityRef.get();

      if (!opportunityDoc.exists) {
        functions.logger.error(`[${conversationId}] No se encontró la oportunidad correspondiente.`);
        return null;
      }
      
      const userId = opportunityDoc.data()?.userId;
      if (!userId) {
        functions.logger.error(`[${conversationId}] La oportunidad no tiene un userId asignado. Abortando.`);
        return null;
      }
      functions.logger.info(`[${conversationId}] Procesando para el usuario: ${userId}.`);


      // 2. Leer el estado actual de la conversación del usuario final.
      // El ID del documento de estado es el número de teléfono del cliente final.
      const userStateRef = db.collection('userStates').doc(conversationId);
      const userStateDoc = await userStateRef.get();

      let currentState = 'start'; // Estado por defecto si no existe
      if (userStateDoc.exists) {
        currentState = userStateDoc.data()?.currentState || 'start';
      }
      functions.logger.info(`[${conversationId}] Estado actual: ${currentState}.`);

      // 3. Lógica del flujo de trabajo (SIMULACIÓN)
      // Aquí iría la lógica compleja para determinar el siguiente paso basado en `currentState` y `messageData.content`.
      // Por ahora, simplemente avanzamos a un estado de "processed".
      const nextState = `processed_${new Date().getTime()}`;
      functions.logger.info(`[${conversationId}] Transición al siguiente estado: ${nextState}.`);


      // 4. Escribir el nuevo estado, sellándolo con el `userId`.
      await userStateRef.set({
        userId, // Sello de propiedad para las reglas de seguridad
        currentState: nextState,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        // Aquí se podrían añadir más detalles, como el workflowId activo.
      }, { merge: true });

      functions.logger.info(`[${conversationId}] Estado actualizado correctamente.`);

      // TODO: Aquí se podría disparar la acción de respuesta (p.ej. enviar un mensaje de vuelta).

      return null;

    } catch (error) {
      functions.logger.error(`[${conversationId}] Error al procesar el mensaje:`, error);
      return null;
    }
  });
