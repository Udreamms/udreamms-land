"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappWebhook = void 0;
// src/webhooks/whatsapp.ts
const functions = require("firebase-functions");
const kanban_1 = require("../helpers/kanban"); // Importar nueva función
const botEngine_1 = require("../helpers/botEngine");
const TWENTY_FOUR_HOURS_IN_MS = 24 * 60 * 60 * 1000;
exports.whatsappWebhook = functions.https.onRequest(async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    res.status(200).send('EVENT_RECEIVED');
    const { entry } = req.body;
    // Validar POST
    if (req.method !== 'POST')
        return;
    const change = (_c = (_b = (_a = entry === null || entry === void 0 ? void 0 : entry[0]) === null || _a === void 0 ? void 0 : _a.changes) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value;
    if (!change)
        return;
    // --- CASO 1: MANEJO DE ESTADOS (READ, DELIVERED, SENT) ---
    if (change.statuses && change.statuses.length > 0) {
        const statusUpdate = change.statuses[0];
        // Solo nos importa si el usuario LEYÓ el mensaje
        if (statusUpdate.status === 'read') {
            const recipientId = statusUpdate.recipient_id;
            // Actualizamos la tarjeta con "Visto por última vez: Ahora"
            await (0, kanban_1.updateReadStatus)(recipientId);
        }
        return; // Terminamos aquí si es solo un estado
    }
    // --- CASO 2: MANEJO DE MENSAJES ENTRANTES ---
    const message = (_d = change.messages) === null || _d === void 0 ? void 0 : _d[0];
    if (!message)
        return;
    const contact = (_e = change.contacts) === null || _e === void 0 ? void 0 : _e[0];
    const from = message.from;
    const contactName = ((_f = contact === null || contact === void 0 ? void 0 : contact.profile) === null || _f === void 0 ? void 0 : _f.name) || 'Usuario';
    // EXTRACCIÓN ROBUSTA DEL MENSAJE (Texto, Botón, Lista)
    let body = '';
    if (message.type === 'text') {
        body = message.text.body;
    }
    else if (message.type === 'interactive') {
        const interactive = message.interactive;
        if (interactive.type === 'button_reply') {
            body = interactive.button_reply.id || interactive.button_reply.title;
        }
        else if (interactive.type === 'list_reply') {
            body = interactive.list_reply.id || interactive.list_reply.title;
        }
    }
    else {
        functions.logger.info(`Received non-text message type: ${message.type}`);
        return;
    }
    functions.logger.info(`📩 Webhook Received from ${from}: "${body}" (Type: ${message.type})`);
    try {
        // 1. Gestionar Tarjeta en Kanban
        const cardData = await (0, kanban_1.handleKanbanUpdate)(from, contactName, body);
        if (!cardData)
            return;
        // 2. Ejecutar Bot
        const activeBot = await (0, botEngine_1.getActiveBot)();
        if (activeBot) {
            const now = new Date();
            let shouldRestart = false;
            if (cardData.isNew) {
                shouldRestart = true;
            }
            else if ((_g = cardData.botState) === null || _g === void 0 ? void 0 : _g.lastInteraction) {
                const lastInteraction = cardData.botState.lastInteraction.toDate ? cardData.botState.lastInteraction.toDate() : new Date(0);
                const timeDiff = now.getTime() - lastInteraction.getTime();
                if (timeDiff > TWENTY_FOUR_HOURS_IN_MS) {
                    shouldRestart = true;
                }
            }
            else {
                if (!cardData.botState)
                    shouldRestart = true;
            }
            if (shouldRestart) {
                functions.logger.info(`Starting/Restarting bot flow for ${from}.`);
                delete cardData.botState;
                await (0, botEngine_1.executeBotFlow)(activeBot, from, cardData, body);
            }
            else if (((_h = cardData.botState) === null || _h === void 0 ? void 0 : _h.status) === 'active') {
                await (0, botEngine_1.executeBotFlow)(activeBot, from, cardData, body);
            }
        }
    }
    catch (error) {
        functions.logger.error('Error in whatsappWebhook:', error);
    }
});
//# sourceMappingURL=whatsapp.js.map