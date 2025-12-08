
// functions/src/utils/whatsapp.ts

import * as functions from "firebase-functions";
import { db } from "../config/firebase";
import { DocumentReference, FieldValue, Timestamp } from "firebase-admin/firestore";
import { logError } from "./error-logging"; // Assuming you have an error logging utility

/**
 * Finds an existing Kanban card for a contact or creates a new one if it doesn't exist.
 * CRITICAL FIX: Now saves the first message when creating a new card.
 *
 * @param {string} contactNumber The contact's phone number.
 * @param {string} contactName The contact's name.
 * @param {string} initialMessage The first message content from the contact.
 * @returns {Promise<DocumentReference | null>} A reference to the card document.
 */
export async function findOrCreateCard(
    contactNumber: string,
    contactName: string,
    initialMessage: string,
): Promise<DocumentReference | null> {
    try {
        // More efficient query to find the card directly across all groups
        const cardsQuery = db.collectionGroup('cards').where('contactNumber', '==', contactNumber).limit(1);
        const cardsSnapshot = await cardsQuery.get();

        if (!cardsSnapshot.empty) {
            // Card already exists, return its reference
            const existingCardDoc = cardsSnapshot.docs[0];
            functions.logger.info(`Card found for ${contactNumber} at path: ${existingCardDoc.ref.path}`);
            return existingCardDoc.ref;
        }

        // Card does not exist, create it
        functions.logger.info(`No card found for ${contactNumber}. Creating a new one.`);

        // Find the default group to add the new card to (e.g., the first one ordered by creation date)
        const groupsQuery = db.collection('kanban-groups').orderBy('order', 'asc').limit(1);
        const groupsSnapshot = await groupsQuery.get();

        if (groupsSnapshot.empty) {
            throw new Error("No Kanban groups found. Cannot create a card.");
        }
        const defaultGroup = groupsSnapshot.docs[0];

        // Create the new card with the first message included
        const newCardRef = defaultGroup.ref.collection('cards').doc();
        await newCardRef.set({
            contactName,
            contactNumber,
            lastMessage: initialMessage,
            channel: 'WhatsApp',
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            groupId: defaultGroup.id,
            // --- THIS IS THE FIX ---
            // Save the first message so the conversation appears correctly and the bot can process it.
            messages: [{
                sender: 'contact',
                content: initialMessage,
                timestamp: Timestamp.now(),
            }],
        });

        functions.logger.info(`New card created for ${contactNumber} in group ${defaultGroup.id} with ID ${newCardRef.id}`);
        return newCardRef;

    } catch (error) {
        logError(error, {
             message: "Error in findOrCreateCard",
             contactNumber,
             contactName,
        });
        return null;
    }
}

/**
 * Sends a message using the WhatsApp API.
 * (Keeping this function as it was, assuming it's used for manual replies)
 */
export async function sendWhatsappMessage(toNumber: string, messageBody: string): Promise<any> {
    const metaApiToken = functions.config().whatsapp.meta_api_token;
    const fromPhoneNumberId = functions.config().whatsapp.from_phone_number_id;
    const url = `https://graph.facebook.com/v19.0/${fromPhoneNumberId}/messages`;

    const payload = {
        messaging_product: "whatsapp",
        to: toNumber,
        type: "text",
        text: {
            body: messageBody,
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${metaApiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`WhatsApp API failed with status ${response.status}: ${JSON.stringify(errorData)}`);
        }

        const responseData = await response.json();
        functions.logger.info("Message sent successfully via WhatsApp API", responseData);
        return responseData;
    } catch (error) {
        logError(error, {
            message: "Failed to send WhatsApp message",
            toNumber,
        });
        throw new functions.https.HttpsError('internal', 'Failed to send WhatsApp message.');
    }
}
