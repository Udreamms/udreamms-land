// Pega este código en: functions/src/triggers/httpTriggers.ts

import { onRequest, onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { createOrUpdateOpportunity, saveIncomingMessage } from "../services/crm.service.js";
import { sendWhatsAppMessage } from "../services/whatsapp.service.js";
import { getFirebaseServices } from "../config/firebase.js";

/**
 * Lógica principal del webhook de WhatsApp.
 */
async function processWhatsAppWebhook(body: any) {
    const change = body.entry?.[0]?.changes?.[0];
    if (change?.field !== "messages") return;

    const value = change.value;
    if (value.messages?.[0]) {
        const message = value.messages[0];
        await Promise.all([
            saveIncomingMessage(message),
            createOrUpdateOpportunity(message),
        ]);
    }
}

/**
 * Endpoint HTTP para el webhook de WhatsApp.
 */
export const whatsappWebhook = onRequest({ cors: true }, async (req, res) => {
    if (req.method === "GET") {
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        // CORRECT FIX: Directly compare with the verify token string
        if (mode === "subscribe" && token === "royalty") {
            logger.info("Webhook verificado exitosamente!");
            res.status(200).send(challenge);
        } else {
            logger.warn("Falló la verificación del Webhook. Token recibido:", token);
            res.sendStatus(403);
        }
    } else if (req.method === "POST") {
        try {
            await processWhatsAppWebhook(req.body);
            res.status(200).send("EVENT_RECEIVED");
        } catch (error) {
            logger.error("Error procesando webhook:", error);
            res.status(500).send("INTERNAL_SERVER_ERROR");
        }
    } else {
        res.sendStatus(405);
    }
});

/**
 * Función callable para que un agente autenticado envíe un mensaje manual.
 */
export const sendManualWhatsAppMessage = onCall(async (request) => {
    const { to, message } = request.data;
    if (!to || !message) {
        throw new HttpsError("invalid-argument", "Faltan los parámetros 'to' o 'message'.");
    }

    const { db } = getFirebaseServices();

    try {
        await sendWhatsAppMessage(to, {
            type: "text",
            text: { body: message },
        });

        await db.collection("conversations").doc(to).collection("messages").add({
            from: "agente",
            text: message,
            type: "text",
            timestamp: new Date(),
            direction: "outbound",
            status: "sent",
        });

        return { success: true, message: "Mensaje enviado." };
    } catch (error) {
        logger.error("Error al enviar mensaje manual:", error);
        throw new HttpsError("internal", "No se pudo enviar el mensaje.");
    }
});
