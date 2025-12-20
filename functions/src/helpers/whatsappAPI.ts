
// src/helpers/whatsappAPI.ts
import * as functions from 'firebase-functions';
import axios from 'axios';

const whatsappConfig = functions.config().whatsapp;
const accessToken = whatsappConfig?.access_token;
const phoneNumberId = whatsappConfig?.phone_number_id;

const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

// Helper general para realizar la llamada a la API
async function makeWhatsAppRequest(data: object) {
    if (!accessToken || !phoneNumberId) {
        functions.logger.error('Missing WhatsApp API credentials in config.');
        throw new functions.https.HttpsError('internal', 'Missing WhatsApp API credentials.');
    }

    try {
        await axios.post(WHATSAPP_API_URL, data, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
    } catch (error: any) { // Catch as 'any' to inspect its properties
        if (error.isAxiosError) {
            functions.logger.error('Error sending WhatsApp message via API:', error.response?.data || error.message);
        } else {
            functions.logger.error('An unexpected error occurred:', error);
        }
        // Re-throw a consistent error to the calling function
        throw new functions.https.HttpsError('internal', 'Error occurred while sending message via WhatsApp API.');
    }
}

// Función específica para mensajes de texto
export async function sendMessage(to: string, message: string): Promise<void> {
    const data = {
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
    };
    await makeWhatsAppRequest(data);
    functions.logger.info(`Text message sent to ${to}.`);
}

// Función específica para mensajes multimedia
export async function sendMediaMessage(to: string, fileUrl: string, fileName: string): Promise<void> {
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

function getMediaType(fileName: string): 'image' | 'document' | 'video' | 'audio' | 'unsupported' {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'unsupported';

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
