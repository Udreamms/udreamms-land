
// src/webhooks/whatsapp.ts
import * as functions from 'firebase-functions';
import { handleKanbanUpdate } from '../helpers/kanban';
import { getActiveBot, executeBotFlow } from '../helpers/botEngine';

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

export const whatsappWebhook = functions.https.onRequest(async (req, res) => {
    // Confirmamos a WhatsApp que recibimos el mensaje (Status 200)
    res.status(200).send('EVENT_RECEIVED');

    const { entry } = req.body;
    if (req.method !== 'POST' || !entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text) {
        return;
    }

    const { messages, contacts } = entry[0].changes[0].value;
    const from = messages[0].from;
    const body = messages[0].text.body;
    const contactName = contacts[0].profile.name;

    try {
        // 1. SIEMPRE buscamos la tarjeta existente o creamos una solo si no existe.
        // handleKanbanUpdate usa transacciones, así que es seguro.
        const cardData = await handleKanbanUpdate(from, contactName, body);
        if (!cardData) return;

        // 2. Revisamos si hay un bot activo para responder
        const activeBot = await getActiveBot();
        if (activeBot) {
            const now = new Date();
            // Verificamos cuándo fue la última actualización REAL de la tarjeta (antes de este mensaje)
            // Si el campo no existe, asumimos fecha 0 (muy antigua)
            const lastUpdate = cardData.updatedAt?.toDate ? cardData.updatedAt.toDate() : new Date(0);
            
            // Calculamos el tiempo. Nota: handleKanbanUpdate actualiza 'updatedAt', 
            // pero aquí necesitamos saber si la sesión estaba "fría" antes de este mensaje.
            // Para simplificar: Si cardData.isNew es true, es nuevo.
            // Si no, miramos el tiempo. Como acabamos de actualizar la tarjeta en el paso 1, 
            // la lógica de tiempo debe ser cuidadosa. 
            // En handleKanbanUpdate devolvemos el objeto. Si usamos el updatedAt que acaba de escribir, será "ahora".
            // PERO, podemos confiar en 'isNew'.
            // Para el caso de >24h, necesitamos un campo 'lastInteraction' en botState o confiar en que
            // si el botState existe, revisamos su timestamp.
            
            let shouldRestart = false;
            
            if (cardData.isNew) {
                shouldRestart = true;
            } else if (cardData.botState?.lastInteraction) {
                 // Si hay estado previo, revisamos cuán viejo es
                 const lastInteraction = cardData.botState.lastInteraction.toDate ? cardData.botState.lastInteraction.toDate() : new Date(0);
                 const timeDiff = now.getTime() - lastInteraction.getTime();
                 if (timeDiff > TWENTY_FOUR_HOURS_IN_MS) {
                     shouldRestart = true;
                 }
            } else {
                // Si no es nueva y no tiene botState (ej. interacción manual antigua), reiniciar bot.
                shouldRestart = true;
            }

            if (shouldRestart) {
                functions.logger.info(`Starting/Restarting bot flow for ${from}.`);
                // Borramos virtualmente el estado para que executeBotFlow empiece del nodo Inicio
                // ESTO NO BORRA LA TARJETA, solo le dice al bot "no recuerdes el paso anterior"
                delete cardData.botState;
                await executeBotFlow(activeBot, from, cardData, body);
            } else if (cardData.botState?.status === 'active') {
                // Continuar conversación existente
                await executeBotFlow(activeBot, from, cardData, body);
            }
        }
    } catch (error) {
        functions.logger.error('Error in whatsappWebhook:', error);
    }
});
