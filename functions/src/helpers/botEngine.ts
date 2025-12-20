
// src/helpers/botEngine.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { sendMessage } from './whatsappAPI';

const db = admin.firestore();

export async function getActiveBot(): Promise<any | null> {
    const botsSnapshot = await db.collection('chatbots').where('isActive', '==', true).limit(1).get();
    if (botsSnapshot.empty) return null;
    
    const botData = botsSnapshot.docs[0].data();
    if (!botData.flow || !botData.flow.nodes || !botData.flow.edges) {
        return null;
    }
    return { id: botsSnapshot.docs[0].id, ...botData };
}

export async function executeBotFlow(bot: any, to: string, cardData: any, userMessage: string): Promise<void> {
    functions.logger.info(`Executing flow for bot: "${bot.name}" for user ${to}`);

    let currentNodeId = cardData.botState?.currentNodeId;
    let nextNodeId = null;

    // --- FASE 1: DETERMINAR EL SIGUIENTE NODO ---
    if (!currentNodeId) {
        // INICIO: Buscar el nodo de arranque
        const startNode = bot.flow.nodes.find((n: any) => n.type === 'startNode');
        if (!startNode) return;

        const firstEdge = bot.flow.edges.find((e: any) => e.source === startNode.id);
        if (firstEdge) nextNodeId = firstEdge.target;
    } else {
        // CONTINUACIÓN: Buscar a dónde ir desde el nodo actual
        const edge = bot.flow.edges.find((e: any) => e.source === currentNodeId);
        if (edge) {
            nextNodeId = edge.target;
        } else {
            // Fin del flujo
            await saveBotState(to, { status: 'completed', currentNodeId: null, lastInteraction: new Date() });
            return;
        }
    }

    if (!nextNodeId) return;

    // --- FASE 2: EJECUTAR EL NODO ---
    const nextNode = bot.flow.nodes.find((n: any) => n.id === nextNodeId);
    if (!nextNode) return;

    if (nextNode.type === 'textMessageNode' && nextNode.data.content) {
        const messageToSend = nextNode.data.content;
        
        await sendMessage(to, messageToSend);
        
        // Guardar estado y mensaje. 
        // IMPORTANTE: Esto agrega el mensaje al historial sin borrar lo anterior.
        await saveBotStateAndLogMessage(to, nextNodeId, messageToSend);
    } else {
        // Para nodos sin acción visual (lógica interna), guardamos el estado para no perder el hilo
        await saveBotState(to, { 
            status: 'active', 
            currentNodeId: nextNodeId,
            lastInteraction: new Date() 
        });
    }
}

// Actualiza la tarjeta existente con el nuevo estado del bot y el mensaje enviado
async function saveBotStateAndLogMessage(contactNumber: string, newNodeId: string, botMessage: string) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const cardSnapshot = await cardsRef.get();

    if (!cardSnapshot.empty) {
        const cardDocRef = cardSnapshot.docs[0].ref;
        
        // Usamos .update() para modificar solo los campos específicos.
        // 'messages': arrayUnion AGREGA al historial, NO lo reemplaza.
        await cardDocRef.update({
            lastMessage: botMessage,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            botState: {
                status: 'active',
                currentNodeId: newNodeId,
                lastInteraction: admin.firestore.FieldValue.serverTimestamp() // Timestamp real de DB
            },
            messages: admin.firestore.FieldValue.arrayUnion({
                sender: 'agent',
                text: botMessage,
                timestamp: new Date(),
            }),
        });
    }
}

async function saveBotState(contactNumber: string, state: any) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const cardSnapshot = await cardsRef.get();
    
    if (!cardSnapshot.empty) {
        // Solo actualizamos el estado lógico, no tocamos los mensajes.
        await cardSnapshot.docs[0].ref.update({ botState: state });
    }
}
