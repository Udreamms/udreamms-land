
// src/helpers/whatsappAPI.ts
import * as functions from 'firebase-functions';
import axios from 'axios';

const whatsappConfig = functions.config().whatsapp;
const accessToken = whatsappConfig?.access_token;
const phoneNumberId = whatsappConfig?.phone_number_id;

const WHATSAPP_API_URL = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

async function makeWhatsAppRequest(data: object, type: string) {
    if (!accessToken || !phoneNumberId) {
        functions.logger.error('Missing WhatsApp API credentials.');
        // No lanzamos error para no detener el flujo si faltan credenciales en dev
        return;
    }
    try {
        await axios.post(WHATSAPP_API_URL, data, {
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        });
        // functions.logger.info(`WhatsApp API Response (${type}): OK`);
    } catch (error: any) {
        functions.logger.error(`WhatsApp API Error (${type}):`, error.response?.data || error.message);
    }
}

export async function markAsRead(messageId: string): Promise<void> {
    if (!messageId) return;
    await makeWhatsAppRequest({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
    }, 'MarkAsRead');
}

export async function sendMessage(to: string, message: string): Promise<void> {
    if (!message) return;
    await makeWhatsAppRequest({ messaging_product: 'whatsapp', to, text: { body: message } }, 'Text');
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
    }, 'Media');
}

export async function sendButtonMessage(to: string, bodyText: string, buttons: any[]): Promise<void> {
    const validButtons = buttons.slice(0, 3).map((btn, i) => {
        const id = (btn.id || `btn_${i}`).substring(0, 256);
        const title = (btn.title || "Opción").substring(0, 20); 
        return {
            type: "reply",
            reply: { id, title }
        };
    });

    if (validButtons.length === 0) return;

    const payload = {
        messaging_product: 'whatsapp', 
        to, 
        type: 'interactive',
        interactive: {
            type: 'button',
            body: { text: bodyText.substring(0, 1024) }, 
            action: { buttons: validButtons }
        }
    };
    
    await makeWhatsAppRequest(payload, 'Buttons');
}

export async function sendListMessage(to: string, bodyText: string, buttonText: string, sections: any[]): Promise<void> {
    if (!sections || sections.length === 0) return;

    const formattedSections: any[] = [];
    let totalRows = 0;

    for (const sec of sections) {
        const rows = (sec.rows || []).map((row: any) => {
            const rowId = (row.id || row.title || `row_${Math.random()}`).substring(0, 200);
            let rowTitle = (row.title || "Opción").trim();
            if (rowTitle.length > 24) rowTitle = rowTitle.substring(0, 21) + "...";
            let rowDesc = row.description ? row.description.substring(0, 72) : undefined;
            return { id: rowId, title: rowTitle, description: rowDesc };
        });

        if (rows.length > 0) {
            formattedSections.push({
                title: (sec.title || "Opciones").substring(0, 50),
                rows: rows
            });
            totalRows += rows.length;
        }
    }

    if (totalRows === 0) return;

    let validBtnText = (buttonText || "Ver Opciones").substring(0, 20);

    const payload = {
        messaging_product: 'whatsapp', 
        to, 
        type: 'interactive',
        interactive: {
            type: 'list',
            body: { text: (bodyText || "Selecciona una opción").substring(0, 1024) },
            action: { button: validBtnText, sections: formattedSections }
        }
    };

    await makeWhatsAppRequest(payload, 'List');
}

export async function sendLocationMessage(to: string, lat: number, long: number, name: string, address: string): Promise<void> {
    await makeWhatsAppRequest({
        messaging_product: 'whatsapp', to, type: 'location',
        location: { latitude: lat, longitude: long, name: name, address: address }
    }, 'Location');
}

function getMediaType(url: string, fileName: string): 'image' | 'document' | 'video' | 'audio' | 'unsupported' {
    const ext = (fileName.includes('.') ? fileName.split('.').pop() : url.split('.').pop())?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '')) return 'document';
    if (['mp4', '3gp'].includes(ext || '')) return 'video';
    if (['mp3', 'aac', 'ogg'].includes(ext || '')) return 'audio';
    return 'image'; 
}
