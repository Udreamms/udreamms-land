
// src/webhooks/whatsapp.ts
import * as functions from 'firebase-functions';
import { handleKanbanUpdate } from '../helpers/kanban';
import { getActiveBot, executeBotFlow } from '../helpers/botEngine';

const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;

export const whatsappWebhook = functions.https.onRequest(async (req, res) => {
    // 1. Acknowledge the request immediately to prevent WhatsApp from resending.
    res.status(200).send('EVENT_RECEIVED');

    // 2. Validate the incoming payload to ensure it's a user text message.
    const { entry } = req.body;
    if (req.method !== 'POST' || !entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text) {
        functions.logger.log('Webhook received a non-POST, non-message, or non-text event. Ignoring.');
        return;
    }

    // 3. Extract necessary data from the payload.
    const { messages, contacts } = entry[0].changes[0].value;
    const from = messages[0].from;
    const body = messages[0].text.body;
    const contactName = contacts[0].profile.name;

    try {
        // 4. Always create or update the contact card in the Kanban board first.
        // This function now returns the card data, including `isNew` and `updatedAt` fields.
        const cardData = await handleKanbanUpdate(from, contactName, body);
        if (!cardData) {
            functions.logger.error("Failed to create or update Kanban card for an unknown reason.");
            return;
        }

        // 5. Check if an automated bot is active.
        const activeBot = await getActiveBot();
        if (activeBot) {
            const now = new Date();
            // The `updatedAt` field might be a server timestamp, so we need to handle it safely.
            const lastUpdate = cardData.updatedAt?.toDate ? cardData.updatedAt.toDate() : new Date();
            const timeSinceLastUpdate = now.getTime() - lastUpdate.getTime();

            // 6. Execute the bot only if the card is new OR if it's been over 24 hours.
            if (cardData.isNew || timeSinceLastUpdate > TWENTY_FOUR_HOURS_IN_MS) {
                await executeBotFlow(activeBot, from);
            } else {
                functions.logger.info(`Bot active, but not executing for ${from} as it's within the 24-hour window.`);
            }
        }
    } catch (error) {
        functions.logger.error('Critical error in whatsappWebhook execution:', error);
    }
});
