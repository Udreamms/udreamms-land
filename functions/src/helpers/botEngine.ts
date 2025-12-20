
// src/helpers/botEngine.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { sendMessage } from './whatsappAPI';

const db = admin.firestore();

export async function getActiveBot(): Promise<any | null> {
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
    return { id: botsSnapshot.docs[0].id, ...botData };
}

export async function executeBotFlow(bot: any, to: string): Promise<void> {
    functions.logger.info(`Executing flow for bot: "${bot.name}" for user ${to}`);

    const startNode = bot.flow.nodes.find((n: any) => n.type === 'startNode');
    if (!startNode) {
        functions.logger.error('No start node found in the bot flow.');
        return;
    }

    const firstEdge = bot.flow.edges.find((e: any) => e.source === startNode.id);
    if (!firstEdge) {
        functions.logger.error('No edge found from the start node.');
        return;
    }

    const nextNode = bot.flow.nodes.find((n: any) => n.id === firstEdge.target);
    if (nextNode?.type === 'textMessageNode' && nextNode.data.content) {
        const messageToSend = nextNode.data.content;
        
        // 1. Send the message via the API
        await sendMessage(to, messageToSend);
        
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
        } else {
            functions.logger.warn(`Could not find a card for ${to} to log the bot's message.`);
        }
    } else {
        functions.logger.warn('The next node has no message to send or is not a text message node.');
    }
}
