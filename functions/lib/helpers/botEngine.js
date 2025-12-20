"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveBot = getActiveBot;
exports.executeBotFlow = executeBotFlow;
// src/helpers/botEngine.ts
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const whatsappAPI_1 = require("./whatsappAPI");
const db = admin.firestore();
async function getActiveBot() {
    const botsSnapshot = await db.collection('chatbots').where('isActive', '==', true).limit(1).get();
    if (botsSnapshot.empty) {
        return null;
    }
    const botData = botsSnapshot.docs[0].data();
    // Ensure the flow data exists
    if (!botData.flow || !botData.flow.nodes || !botData.flow.edges) {
        functions.logger.warn(`Active bot ${botsSnapshot.docs[0].id} is missing flow data.`);
        return null;
    }
    return Object.assign({ id: botsSnapshot.docs[0].id }, botData);
}
async function executeBotFlow(bot, to) {
    functions.logger.info(`Executing flow for bot: "${bot.name}" for user ${to}`);
    const startNode = bot.flow.nodes.find((n) => n.type === 'startNode');
    if (!startNode) {
        functions.logger.error('No start node found in the bot flow.');
        return;
    }
    const firstEdge = bot.flow.edges.find((e) => e.source === startNode.id);
    if (!firstEdge) {
        functions.logger.error('No edge found from the start node.');
        return;
    }
    const nextNode = bot.flow.nodes.find((n) => n.id === firstEdge.target);
    if ((nextNode === null || nextNode === void 0 ? void 0 : nextNode.type) === 'textMessageNode' && nextNode.data.content) {
        const messageToSend = nextNode.data.content;
        // 1. Send the message via the API
        await (0, whatsappAPI_1.sendMessage)(to, messageToSend);
        // 2. Log the bot's message in the Kanban card
        const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', to);
        const cardSnapshot = await cardsRef.get();
        if (!cardSnapshot.empty) {
            const cardDocRef = cardSnapshot.docs[0].ref;
            await cardDocRef.update({
                lastMessage: messageToSend,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                messages: admin.firestore.FieldValue.arrayUnion({
                    sender: 'agent', // Representing the bot
                    text: messageToSend,
                    timestamp: new Date(),
                }),
            });
            functions.logger.info(`Successfully logged bot message to card for ${to}.`);
        }
        else {
            functions.logger.warn(`Could not find a card for ${to} to log the bot's message.`);
        }
    }
    else {
        functions.logger.warn('The next node has no message to send or is not a text message node.');
    }
}
//# sourceMappingURL=botEngine.js.map