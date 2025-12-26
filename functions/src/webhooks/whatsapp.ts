
// src/webhooks/whatsapp.ts
import * as functions from 'firebase-functions';
import { handleKanbanUpdate, updateReadStatus } from '../helpers/kanban'; // Importar nueva función
import { getActiveBot, executeBotFlow } from '../helpers/botEngine';

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

export const whatsappWebhook = functions.https.onRequest(async (req, res) => {
    res.status(200).send('EVENT_RECEIVED');

    const { entry } = req.body;
    
    // Validar POST
    if (req.method !== 'POST') return;

    const change = entry?.[0]?.changes?.[0]?.value;
    if (!change) return;

    // --- CASO 1: MANEJO DE ESTADOS (READ, DELIVERED, SENT) ---
    if (change.statuses && change.statuses.length > 0) {
        const statusUpdate = change.statuses[0];
        // Solo nos importa si el usuario LEYÓ el mensaje
        if (statusUpdate.status === 'read') {
            const recipientId = statusUpdate.recipient_id;
            // Actualizamos la tarjeta con "Visto por última vez: Ahora"
            await updateReadStatus(recipientId);
        }
        return; // Terminamos aquí si es solo un estado
    }

    // --- CASO 2: MANEJO DE MENSAJES ENTRANTES ---
    const message = change.messages?.[0];
    if (!message) return;

    const contact = change.contacts?.[0];
    const from = message.from;
    const contactName = contact?.profile?.name || 'Usuario';
    
    // EXTRACCIÓN ROBUSTA DEL MENSAJE (Texto, Botón, Lista)
    let body = '';
    
    if (message.type === 'text') {
        body = message.text.body;
    } else if (message.type === 'interactive') {
        const interactive = message.interactive;
        if (interactive.type === 'button_reply') {
            body = interactive.button_reply.id || interactive.button_reply.title;
        } else if (interactive.type === 'list_reply') {
            body = interactive.list_reply.id || interactive.list_reply.title;
        }
    } else {
        functions.logger.info(`Received non-text message type: ${message.type}`);
        return;
    }

    functions.logger.info(`📩 Webhook Received from ${from}: "${body}" (Type: ${message.type})`);

    try {
        // 1. Gestionar Tarjeta en Kanban
        const cardData = await handleKanbanUpdate(from, contactName, body);
        if (!cardData) return;

        // 2. Ejecutar Bot
        const activeBot = await getActiveBot();
        if (activeBot) {
            const now = new Date();
            let shouldRestart = false;
            
            if (cardData.isNew) {
                shouldRestart = true;
            } else if (cardData.botState?.lastInteraction) {
                 const lastInteraction = cardData.botState.lastInteraction.toDate ? cardData.botState.lastInteraction.toDate() : new Date(0);
                 const timeDiff = now.getTime() - lastInteraction.getTime();
                 if (timeDiff > TWENTY_FOUR_HOURS_IN_MS) {
                     shouldRestart = true;
                 }
            } else {
                 if (!cardData.botState) shouldRestart = true;
            }

            if (shouldRestart) {
                functions.logger.info(`Starting/Restarting bot flow for ${from}.`);
                delete cardData.botState; 
                await executeBotFlow(activeBot, from, cardData, body);
            } else if (cardData.botState?.status === 'active') {
                await executeBotFlow(activeBot, from, cardData, body);
            }
        }
    } catch (error) {
        functions.logger.error('Error in whatsappWebhook:', error);
    }
});
