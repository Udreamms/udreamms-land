"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsappMediaMessage = exports.sendWhatsappMessage = void 0;
// src/callable/whatsapp.ts
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const whatsappAPI_1 = require("../helpers/whatsappAPI");
const db = admin.firestore();
// Common function to log any outgoing message to the Firestore card
async function logMessageInCard(groupId, cardId, text) {
    const cardRef = db.collection('kanban-groups').doc(groupId).collection('cards').doc(cardId);
    await cardRef.update({
        lastMessage: text.length > 40 ? text.substring(0, 37) + '...' : text,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        messages: admin.firestore.FieldValue.arrayUnion({
            sender: 'agent', // Represents a human agent, not the bot
            text: text,
            timestamp: new Date(),
        }),
    });
}
// Function to handle sending TEXT messages
exports.sendWhatsappMessage = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const { cardId, groupId, message, toNumber } = data;
    if (!cardId || !groupId || !message || !toNumber) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for sending a text message.');
    }
    try {
        await (0, whatsappAPI_1.sendMessage)(toNumber, message);
        await logMessageInCard(groupId, cardId, message);
        return { success: true };
    }
    catch (error) {
        functions.logger.error(`Error in sendWhatsappMessage for card ${cardId}:`, error);
        throw error; // Re-throw the error to be caught by the client
    }
});
// Function to handle sending MEDIA messages (images, documents, etc.)
exports.sendWhatsappMediaMessage = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const { cardId, groupId, fileUrl, toNumber, fileName } = data;
    if (!cardId || !groupId || !fileUrl || !toNumber || !fileName) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required data for sending a media message.');
    }
    try {
        await (0, whatsappAPI_1.sendMediaMessage)(toNumber, fileUrl, fileName);
        const logText = `Archivo enviado: ${fileName}`;
        await logMessageInCard(groupId, cardId, logText);
        return { success: true };
    }
    catch (error) {
        functions.logger.error(`Error in sendWhatsappMediaMessage for card ${cardId}:`, error);
        throw error; // Re-throw the error to be caught by the client
    }
});
//# sourceMappingURL=whatsapp.js.map