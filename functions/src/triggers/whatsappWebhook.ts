
// functions/src/triggers/whatsappWebhook.ts

import * as functions from "firebase-functions";
import { db } from "../config/firebase";
import { DocumentReference, FieldValue, Timestamp } from "firebase-admin/firestore";
import { findOrCreateCard } from "../utils/kanban-utils";
import { runBotEngine } from "../bot-engine/engine";
import { logError } from "../utils/error-logging";

interface MessagePayload {
    from: string;
    text?: { body: string };
    // Aquí se pueden añadir otros tipos de mensajes (imagen, audio, etc.)
}

/**
 * Procesa un mensaje entrante de WhatsApp.
 * @param {string} contactNumber - El número del contacto.
 * @param {string} contactName - El nombre del contacto.
 * @param {MessagePayload} message - El objeto del mensaje.
 */
export async function processIncomingMessage(
    contactNumber: string,
    contactName: string,
    message: MessagePayload,
): Promise<void> {
    try {
        functions.logger.info(`Procesando mensaje de ${contactNumber} (${contactName})`, { message });

        const messageContent = message.text?.body;
        if (!messageContent) {
            functions.logger.warn("Mensaje sin contenido de texto, omitiendo.", { message });
            return;
        }

        const cardRef = await findOrCreateCard(contactNumber, contactName, messageContent);
        if (!cardRef) {
            throw new Error("No se pudo encontrar o crear la tarjeta Kanban.");
        }
        
        // CORRECCIÓN: Asegurarse de que el primer mensaje siempre se guarde.
        // La función findOrCreateCard ahora se encarga de esto.
        
        const activeBotQuery = await db.collection('chatbots')
            .where('isActive', '==', true)
            .limit(1)
            .get();

        if (!activeBotQuery.empty) {
            const botDoc = activeBotQuery.docs[0];
            functions.logger.info(`Bot activo encontrado: ${botDoc.id}. Ejecutando motor...`);
            
            await runBotEngine(cardRef, messageContent);

        } else {
            functions.logger.info("No hay bots activos. El mensaje se manejará manualmente.");
            // El mensaje ya fue añadido por findOrCreateCard si era una nueva conversación.
            // Si la conversación ya existía, añadimos el nuevo mensaje.
            const cardSnap = await cardRef.get();
            if (cardSnap.exists) { // Solo añadir si no es el primer mensaje (ya lo hizo findOrCreateCard)
                const cardData = cardSnap.data();
                if (cardData && cardData.messages && cardData.messages.length > 0) {
                     await cardRef.update({
                        messages: FieldValue.arrayUnion({
                            sender: 'contact',
                            content: messageContent,
                            timestamp: Timestamp.now(),
                        }),
                        updatedAt: FieldValue.serverTimestamp(),
                        lastMessage: messageContent,
                    });
                }
            }
        }
    } catch (error) {
        logError(error, {
            message: "Error procesando mensaje entrante de WhatsApp",
            contactNumber,
            contactName,
            incomingMessage: message,
        });
        throw new functions.https.HttpsError("internal", "Error al procesar el mensaje.");
    }
}

// Suponiendo que el webhook llama a esta función.
// (El código original del webhook no se muestra, pero se asume que existe y llama a processIncomingMessage)
export const metaWebhook = functions.https.onRequest(async (req, res) => {
    // Lógica del webhook para extraer contactNumber, contactName y message...
    // Esta parte es un ejemplo y debe ser adaptada a la estructura real de la API de Meta.
    try {
        const body = req.body;
        // Extraer los datos relevantes del webhook de Meta
        const contactNumber = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
        const contactName = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || 'Usuario';
        const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
        
        if (contactNumber && message) {
            await processIncomingMessage(contactNumber, contactName, message);
            res.status(200).send('OK');
        } else {
            res.status(400).send('Invalid webhook payload');
        }
    } catch (error) {
        logError(error, { body: req.body });
        res.status(500).send('Internal Server Error');
    }
});
