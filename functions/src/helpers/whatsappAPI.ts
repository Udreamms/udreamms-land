
// src/helpers/whatsappAPI.ts
import * as functions from 'firebase-functions';
import axios from 'axios';

const whatsappConfig = functions.config().whatsapp;
const accessToken = whatsappConfig?.access_token;
const phoneNumberId = whatsappConfig?.phone_number_id;

const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

async function makeWhatsAppRequest(data: object) {
    if (!accessToken || !phoneNumberId) {
        functions.logger.error('Missing WhatsApp API credentials.');
        throw new functions.https.HttpsError('internal', 'Missing credentials.');
    }
    try {
        await axios.post(WHATSAPP_API_URL, data, {
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        functions.logger.error('WhatsApp API Error:', error.response?.data || error.message);
        throw new functions.https.HttpsError('internal', 'Error sending WhatsApp message.');
    }
}

export async function sendMessage(to: string, message: string): Promise<void> {
    await makeWhatsAppRequest({ messaging_product: 'whatsapp', to, text: { body: message } });
}

export async function sendMediaMessage(to: string, fileUrl: string, caption: string = '', fileName: string = 'file'): Promise<void> {
    const mediaType = getMediaType(fileUrl, fileName);
    if (mediaType === 'unsupported') {
        functions.logger.warn(`Unsupported media: ${fileName}`);
        return;
    }
    await makeWhatsAppRequest({
        messaging_product: 'whatsapp', to, type: mediaType,
        [mediaType]: { link: fileUrl, caption: caption }
    });
}

// NUEVO: Enviar Botones (Quick Replies)
export async function sendButtonMessage(to: string, bodyText: string, buttons: any[]): Promise<void> {
    const validButtons = buttons.slice(0, 3).map((btn, i) => ({
        type: "reply",
        reply: { id: btn.id || `btn_${i}`, title: btn.title?.substring(0, 20) || "Opción" }
    }));

    await makeWhatsAppRequest({
        messaging_product: 'whatsapp', to, type: 'interactive',
        interactive: {
            type: 'button',
            body: { text: bodyText },
            action: { buttons: validButtons }
        }
    });
}

// NUEVO: Enviar Lista
export async function sendListMessage(to: string, bodyText: string, buttonText: string, sections: any[]): Promise<void> {
    const formattedSections = sections.map(sec => ({
        title: sec.title,
        rows: (sec.rows || []).map((row: any) => ({
            id: row.id || row.title,
            title: row.title?.substring(0, 23),
            description: row.description?.substring(0, 70) || ''
        }))
    }));

    await makeWhatsAppRequest({
        messaging_product: 'whatsapp', to, type: 'interactive',
        interactive: {
            type: 'list',
            body: { text: bodyText },
            action: { button: buttonText || "Ver Opciones", sections: formattedSections }
        }
    });
}

// NUEVO: Enviar Ubicación
export async function sendLocationMessage(to: string, lat: number, long: number, name: string, address: string): Promise<void> {
    await makeWhatsAppRequest({
        messaging_product: 'whatsapp', to, type: 'location',
        location: { latitude: lat, longitude: long, name: name, address: address }
    });
}

function getMediaType(url: string, fileName: string): 'image' | 'document' | 'video' | 'audio' | 'unsupported' {
    const ext = (fileName.includes('.') ? fileName.split('.').pop() : url.split('.').pop())?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '')) return 'document';
    if (['mp4', '3gp'].includes(ext || '')) return 'video';
    if (['mp3', 'aac', 'ogg'].includes(ext || '')) return 'audio';
    return 'image'; 
}
