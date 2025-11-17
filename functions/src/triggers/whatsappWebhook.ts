
import * as functions from "firebase-functions";
import { firestore } from "firebase-admin";

/**
 * Webhook para procesar mensajes entrantes de WhatsApp.
 * Esta función es el punto de entrada para todos los mensajes de los clientes finales.
 */
export const whatsappWebhook = functions.https.onRequest(async (req, res) => {
  // 1. Extraer datos y validar la solicitud
  // En producción, se debe validar la firma de la solicitud para seguridad.
  const { from, body } = req.body;

  if (!from || !body) {
    functions.logger.warn("Solicitud inválida: falta 'from' o 'body'.");
    res.status(400).send("Solicitud inválida.");
    return;
  }

  const db = firestore();
  let userId: string;

  try {
    // 2. Determinar el propietario del número de teléfono (LA CLAVE MULTI-INQUILINO)
    // Buscamos en la colección `phoneNumbers` para encontrar a qué usuario de nuestra plataforma
    // le pertenece el número de WhatsApp que envía el mensaje.
    const phoneNumbersRef = db.collection("phoneNumbers").doc(from);
    const phoneDoc = await phoneNumbersRef.get();

    if (!phoneDoc.exists || !phoneDoc.data()?.userId) {
      // Si el número no está registrado por ninguno de nuestros usuarios, no podemos procesar el mensaje.
      functions.logger.error(`Mensaje recibido de un número no registrado: ${from}. No se puede asignar a ningún usuario.`);
      res.status(403).send("Número de teléfono no registrado en la plataforma.");
      return;
    }

    userId = phoneDoc.data()!.userId;
    functions.logger.info(`Mensaje de ${from} asignado al usuario: ${userId}`);

    // 3. Crear o actualizar la Oportunidad (AHORA CON `userId`)
    const opportunityId = from; // Seguimos usando el número como ID para fácil acceso
    const opportunityRef = db.collection("opportunities").doc(opportunityId);
    const opportunityDoc = await opportunityRef.get();

    const opportunityData = {
      userId, // <-- Sello de propiedad
      name: `Oportunidad ${from.slice(-4)}`,
      phoneNumber: from,
      source: 'WhatsApp',
      lastMessageSnippet: body,
      hasUnreadMessages: true,
      lastContacted: firestore.FieldValue.serverTimestamp(),
    };

    if (!opportunityDoc.exists) {
      await opportunityRef.set({
        ...opportunityData,
        currentPipeline: "default",
        currentStage: "new",
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await opportunityRef.update(opportunityData);
    }

    // 4. Registrar el mensaje en la subcolección de la conversación (AHORA TAMBIÉN CON `userId`)
    const conversationRef = db.collection("conversations").doc(opportunityId);
    // El documento principal de la conversación también debe tener el userId para reglas de seguridad.
    await conversationRef.set({ userId }, { merge: true }); 
    
    const messagesSubCollectionRef = conversationRef.collection("messages");
    await messagesSubCollectionRef.add({
      content: body,
      timestamp: firestore.FieldValue.serverTimestamp(),
      sender: "customer", // Mensaje del cliente final
    });
    
    functions.logger.info(`Mensaje de ${from} procesado y guardado correctamente.`);
    res.status(200).send("Datos procesados exitosamente.");

  } catch (error) {
    functions.logger.error("Error grave en el webhook de WhatsApp:", error);
    res.status(500).send("Error interno del servidor.");
  }
});
