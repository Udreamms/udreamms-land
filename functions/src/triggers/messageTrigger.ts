
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import { firestore } from 'firebase-admin';

const db = firestore();

/**
 * Se dispara cuando se añade un nuevo mensaje a una conversación.
 * Orquesta la lógica del flujo de trabajo: lee el estado actual, determina el siguiente paso y actualiza el estado.
 */
export const onMessageCreated = onDocumentCreated("conversations/{conversationId}/messages/{messageId}", async (event) => {
    const { conversationId } = event.params;
    const snap = event.data;

    if (!snap) {
        logger.info(`[${conversationId}] No data associated with the event, document may have been deleted.`);
        return;
    }

    const messageData = snap.data();

    // Ignorar mensajes enviados por el bot para evitar bucles infinitos
    if (messageData.sender !== 'customer') {
      logger.info(`[${conversationId}] Mensaje del bot ignorado.`);
      return;
    }

    try {
      // 1. Obtener el `userId` del documento de la oportunidad.
      // El ID de la conversación es el número de teléfono, que es el ID de la oportunidad.
      const opportunityRef = db.collection('opportunities').doc(conversationId);
      const opportunityDoc = await opportunityRef.get();

      if (!opportunityDoc.exists) {
        logger.error(`[${conversationId}] No se encontró la oportunidad correspondiente.`);
        return;
      }
      
      const userId = opportunityDoc.data()?.userId;
      if (!userId) {
        logger.error(`[${conversationId}] La oportunidad no tiene un userId asignado. Abortando.`);
        return;
      }
      logger.info(`[${conversationId}] Procesando para el usuario: ${userId}.`);


      // 2. Leer el estado actual de la conversación del usuario final.
      // El ID del documento de estado es el número de teléfono del cliente final.
      const userStateRef = db.collection('userStates').doc(conversationId);
      const userStateDoc = await userStateRef.get();

      let currentState = 'start'; // Estado por defecto si no existe
      if (userStateDoc.exists) {
        currentState = userStateDoc.data()?.currentState || 'start';
      }
      logger.info(`[${conversationId}] Estado actual: ${currentState}.`);

      // 3. Lógica del flujo de trabajo (SIMULACIÓN)
      // Aquí iría la lógica compleja para determinar el siguiente paso basado en `currentState` y `messageData.content`.
      // Por ahora, simplemente avanzamos a un estado de "processed".
      const nextState = `processed_${new Date().getTime()}`;
      logger.info(`[${conversationId}] Transición al siguiente estado: ${nextState}.`);


      // 4. Escribir el nuevo estado, sellándolo con el `userId`.
      await userStateRef.set({
        userId, // Sello de propiedad para las reglas de seguridad
        currentState: nextState,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
        // Aquí se podrían añadir más detalles, como el workflowId activo.
      }, { merge: true });

      logger.info(`[${conversationId}] Estado actualizado correctamente.`);

      // TODO: Aquí se podría disparar la acción de respuesta (p.ej. enviar un mensaje de vuelta).

      return;

    } catch (error) {
      logger.error(`[${conversationId}] Error al procesar el mensaje:`, error);
      return;
    }
  });
