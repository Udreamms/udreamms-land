import axios, { AxiosError } from "axios";
import { logger } from "firebase-functions";
import { getFirebaseServices } from "../config/firebase.js";

const WHATSAPP_API_VERSION = "v19.0";
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * Envía un mensaje a través de la API de WhatsApp Business.
 */
export async function sendWhatsAppMessage(to: string, messageData: any) {
    const { db } = getFirebaseServices();
    if (!WHATSAPP_API_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
        logger.error("CRÍTICO: Variables de entorno de WhatsApp no configuradas.");
        throw new Error("Credenciales de API de WhatsApp no configuradas.");
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const payload = { messaging_product: "whatsapp", to: to.replace(/\D/g, ''), ...messageData };

    try {
        const response = await axios.post(url, payload, {
            headers: { 'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`, 'Content-Type': 'application/json' },
        });
        const messageId = response.data.messages[0].id;

        await db.collection("conversations").doc(to).collection("messages").add({
            from: "bot",
            text: payload.text?.body || `[${payload.type}]`,
            type: payload.type,
            timestamp: new Date(),
            whatsappMessageId: messageId,
            direction: "outbound",
            status: "sent",
        });

        logger.info(`Mensaje enviado a ${to}. Message ID: ${messageId}`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        logger.error("--- ERROR ENVIANDO MENSAJE WHATSAPP ---", { response: axiosError.response?.data, requestData: payload });
        throw new Error("Fallo al enviar mensaje vía API de WhatsApp.");
    }
}