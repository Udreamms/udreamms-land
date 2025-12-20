"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.sendMediaMessage = sendMediaMessage;
// src/helpers/whatsappAPI.ts
const functions = require("firebase-functions");
const axios_1 = require("axios");
const whatsappConfig = functions.config().whatsapp;
const accessToken = whatsappConfig === null || whatsappConfig === void 0 ? void 0 : whatsappConfig.access_token;
const phoneNumberId = whatsappConfig === null || whatsappConfig === void 0 ? void 0 : whatsappConfig.phone_number_id;
const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;
// Helper general para realizar la llamada a la API
async function makeWhatsAppRequest(data) {
    var _a;
    if (!accessToken || !phoneNumberId) {
        functions.logger.error('Missing WhatsApp API credentials in config.');
        throw new functions.https.HttpsError('internal', 'Missing WhatsApp API credentials.');
    }
    try {
        await axios_1.default.post(WHATSAPP_API_URL, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    }
    catch (error) { // Catch as 'any' to inspect its properties
        if (error.isAxiosError) {
            functions.logger.error('Error sending WhatsApp message via API:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
        else {
            functions.logger.error('An unexpected error occurred:', error);
        }
        // Re-throw a consistent error to the calling function
        throw new functions.https.HttpsError('internal', 'Error occurred while sending message via WhatsApp API.');
    }
}
// Función específica para mensajes de texto
async function sendMessage(to, message) {
    const data = {
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
    };
    await makeWhatsAppRequest(data);
    functions.logger.info(`Text message sent to ${to}.`);
}
// Función específica para mensajes multimedia
async function sendMediaMessage(to, fileUrl, fileName) {
    const mediaType = getMediaType(fileName);
    if (mediaType === 'unsupported') {
        throw new functions.https.HttpsError('invalid-argument', 'Unsupported file type.');
    }
    const data = {
        messaging_product: 'whatsapp',
        to,
        type: mediaType,
        [mediaType]: {
            link: fileUrl,
            caption: fileName // Opcional: puedes usar el nombre del archivo como caption
        }
    };
    await makeWhatsAppRequest(data);
    functions.logger.info(`Media message (${mediaType}) sent to ${to}.`);
}
function getMediaType(fileName) {
    var _a;
    const extension = (_a = fileName.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    if (!extension)
        return 'unsupported';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return 'image';
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
        return 'document';
    }
    if (['mp4', '3gp', 'mov'].includes(extension)) {
        return 'video';
    }
    if (['mp3', 'aac', 'ogg', 'amr'].includes(extension)) {
        return 'audio';
    }
    return 'unsupported';
}
//# sourceMappingURL=whatsappAPI.js.map