
// functions/src/triggers/sendWhatsappMessage.ts

import * as functions from "firebase-functions";
import { db } from "../config/firebase";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { sendWhatsappMessage as sendWhatsappMessageAPI } from "../utils/whatsapp"; // Renamed for clarity
import { logError } from "../utils/error-logging";

interface SendMessageData {
    cardId: string;
    groupId: string;
    message: string;
    toNumber: string;
}

/**
 * Cloud Function to send a WhatsApp message from the Kanban interface
 * and save the message to the conversation history.
 */
export const sendWhatsappMessage = functions.https.onCall(async (data: SendMessageData, context) => {
    // 1. Validate user authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    // 2. Validate incoming data
    const { cardId, groupId, message, toNumber } = data;
    if (!cardId || !groupId || !message || !toNumber) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Missing required data fields (cardId, groupId, message, toNumber)."
        );
    }

    try {
        // 3. Send the message via the WhatsApp API
        await sendWhatsappMessageAPI(toNumber, message);
        functions.logger.info(`Message sent to ${toNumber} successfully via API.`);

        // 4. --- THIS IS THE FIX ---
        // Save the sent message to the Firestore document (the card)
        const cardRef = db.collection('kanban-groups').doc(groupId).collection('cards').doc(cardId);
        
        const messageData = {
            sender: 'agent', // Or context.auth.uid to know which agent sent it
            content: message,
            timestamp: Timestamp.now(),
        };

        await cardRef.update({
            messages: FieldValue.arrayUnion(messageData),
            lastMessage: message, // Update the last message preview
            updatedAt: FieldValue.serverTimestamp(), // Update the timestamp to move the card up
        });
        
        functions.logger.info(`Message saved to card ${cardId} in group ${groupId}.`);

        // 5. Return success
        return { success: true, message: "Message sent and saved successfully." };

    } catch (error) {
        logError(error, {
            message: "Error in sendWhatsappMessage Cloud Function",
            data,
        });
        // The error from sendWhatsappMessageAPI is already an HttpsError
        throw error;
    }
});
