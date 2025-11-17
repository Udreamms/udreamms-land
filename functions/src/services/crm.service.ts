import { logger } from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore"; // <-- AÑADIDO
import { getFirebaseServices } from "../config/firebase.js";
import { Opportunity, Message } from "../interfaces/crm.interfaces.js";

/**
 * Crea o actualiza una oportunidad basada en un mensaje entrante.
 */
export async function createOrUpdateOpportunity(message: any): Promise<void> {
    const { db } = getFirebaseServices(); // <-- CORREGIDO
    const from = message.from;
    const opportunityRef = db.collection('opportunities').doc(from);
    const textSnippet = message.text?.body || `[${message.type}]`;

    try {
        const docSnap = await opportunityRef.get();
        const now = FieldValue.serverTimestamp(); // <-- CORREGIDO

        if (!docSnap.exists) {
            logger.info(`Creando nueva oportunidad para ${from}`);
            const newOpportunity: Omit<Opportunity, 'id' | 'createdAt' | 'lastContacted'> = {
                name: `Oportunidad ${from.slice(-4)}`,
                phoneNumber: from,
                source: "WhatsApp",
                currentPipeline: "default",
                currentStage: "new",
                lastMessageSnippet: textSnippet,
                hasUnreadMessages: true,
            };
            await opportunityRef.set({ ...newOpportunity, createdAt: now, lastContacted: now });
        } else {
            logger.info(`Actualizando oportunidad para ${from}`);
            await opportunityRef.update({ lastContacted: now, lastMessageSnippet: textSnippet, hasUnreadMessages: true });
        }
    } catch (error) {
        logger.error(`Error en createOrUpdateOpportunity para ${from}:`, error);
        throw error;
    }
}

/**
 * Guarda un mensaje entrante, genera una sugerencia de IA y lo guarda todo.
 */
export async function saveIncomingMessage(message: any): Promise<void> {
    const { db } = getFirebaseServices();
    const text = message.text?.body || `[${message.type} - sin texto]`;
    const conversationRef = db.collection("conversations").doc(message.from).collection("messages");
    
    const newMessage: Omit<Message, 'id'> = {
        from: "cliente",
        text: text,
        type: message.type,
        timestamp: new Date(parseInt(message.timestamp, 10) * 1000),
        whatsappMessageId: message.id,
        direction: "inbound",
        status: "received",
        aiSuggestion: '', 
    };
    
    await conversationRef.add(newMessage);
}
