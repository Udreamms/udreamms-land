
// src/helpers/botEngine.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { sendMessage } from './whatsappAPI';

const db = admin.firestore();

// Utilidad para retrasos pequeños entre mensajes
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getActiveBot(): Promise<any | null> {
    const botsSnapshot = await db.collection('chatbots').where('isActive', '==', true).limit(1).get();
    if (botsSnapshot.empty) return null;
    
    const botData = botsSnapshot.docs[0].data();
    if (!botData.flow || !botData.flow.nodes || !botData.flow.edges) {
        return null;
    }
    return { id: botsSnapshot.docs[0].id, ...botData };
}

function replaceVariables(text: string, cardData: any): string {
    if (!text) return '';
    let processedText = text;
    const variables = {
        name: cardData.contactName || '',
        phone: cardData.contactNumber || '',
        ...cardData.customFields
    };
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
        processedText = processedText.replace(regex, String(value || ''));
    }
    return processedText;
}

export async function executeBotFlow(bot: any, to: string, cardData: any, userMessage: string): Promise<void> {
    functions.logger.info(`>>> EXECUTING FLOW: ${bot.name} for ${to} <<<`);
    functions.logger.info(`User Message: "${userMessage}"`);

    let currentNodeId = cardData.botState?.currentNodeId;
    let nextNodeId = null;
    let shouldContinue = true;
    let executionCount = 0;
    const MAX_STEPS = 15;

    // --- PASO 0: PROCESAR RESPUESTA DEL NODO ANTERIOR ---
    if (currentNodeId) {
        functions.logger.info(`Resuming from Node ID: ${currentNodeId}`);
        const currentNode = bot.flow.nodes.find((n: any) => String(n.id) === String(currentNodeId));
        
        if (!currentNode) {
             functions.logger.error(`Node ${currentNodeId} not found in flow definition!`);
             return;
        }

        if (currentNode.type === 'captureInputNode') {
            functions.logger.info(`Node is CaptureInput. Validating "${userMessage}"...`);
            const validation = validateInput(userMessage, currentNode.data);
            
            if (!validation.isValid) {
                functions.logger.warn(`Validation failed: ${validation.errorMessage}`);
                await sendMessage(to, validation.errorMessage || "Respuesta inválida, intenta de nuevo.");
                return; 
            }

            functions.logger.info(`Validation Passed. Saving variable...`);
            if (currentNode.data.variableName) {
                await saveVariable(to, currentNode.data.variableName, userMessage);
                if (!cardData.customFields) cardData.customFields = {};
                cardData.customFields[currentNode.data.variableName] = userMessage;
            }
        }
        
        // CORRECCIÓN: Asegurar comparación de strings para IDs
        const edge = bot.flow.edges.find((e: any) => String(e.source) === String(currentNodeId));
        
        if (edge) {
            nextNodeId = edge.target;
            functions.logger.info(`Found edge to next node: ${nextNodeId}`);
        } else {
            functions.logger.warn(`No edge found from ${currentNodeId}. Flow completed or broken.`);
            await updateBotState(to, { status: 'completed', currentNodeId: null });
            return;
        }
    } else {
        functions.logger.info(`No previous state. Starting fresh.`);
        const startNode = bot.flow.nodes.find((n: any) => n.type === 'startNode');
        if (!startNode) {
            functions.logger.error("No StartNode found!");
            return;
        }
        // CORRECCIÓN: Asegurar comparación de strings
        const firstEdge = bot.flow.edges.find((e: any) => String(e.source) === String(startNode.id));
        if (firstEdge) {
            nextNodeId = firstEdge.target;
            functions.logger.info(`Starting flow -> First Node: ${nextNodeId}`);
        } else {
            functions.logger.warn("StartNode has no outgoing connection.");
        }
    }

    // --- BUCLE DE EJECUCIÓN ---
    while (shouldContinue && nextNodeId && executionCount < MAX_STEPS) {
        executionCount++;
        const nextNode = bot.flow.nodes.find((n: any) => String(n.id) === String(nextNodeId));
        
        if (!nextNode) {
            functions.logger.error(`Target node ${nextNodeId} does not exist.`);
            shouldContinue = false;
            break;
        }

        functions.logger.info(`[Step ${executionCount}] Executing Node: ${nextNode.type} (${nextNode.id})`);

        await updateBotState(to, { 
            status: 'active', 
            currentNodeId: nextNodeId,
            lastInteraction: new Date() 
        });

        switch (nextNode.type) {
            case 'textMessageNode':
                const rawText = nextNode.data.content || '';
                const finalMessage = replaceVariables(rawText, cardData);
                functions.logger.info(`Sending Text: "${finalMessage}"`);
                
                await sendMessage(to, finalMessage);
                await logBotMessage(to, finalMessage);
                
                // CORRECCIÓN: Asegurar comparación de strings
                const edgeText = bot.flow.edges.find((e: any) => String(e.source) === String(nextNodeId));
                if (edgeText) {
                    nextNodeId = edgeText.target;
                    await delay(800); 
                } else {
                    functions.logger.info("TextMessageNode has no output. Flow ends.");
                    shouldContinue = false;
                    await updateBotState(to, { status: 'completed', currentNodeId: null });
                }
                break;

            case 'captureInputNode':
                functions.logger.info("CaptureInputNode reached. Stopping execution to wait for user input.");
                shouldContinue = false; 
                break;

            default:
                functions.logger.info(`Node type ${nextNode.type} is pass-through. Finding next node...`);
                // CORRECCIÓN: Asegurar comparación de strings
                const edgeDef = bot.flow.edges.find((e: any) => String(e.source) === String(nextNodeId));
                if (edgeDef) {
                    nextNodeId = edgeDef.target;
                } else {
                    functions.logger.info("Node has no output. Flow ends.");
                    shouldContinue = false;
                    await updateBotState(to, { status: 'completed', currentNodeId: null });
                }
                break;
        }
    }
}

// --- HELPERS ---

function validateInput(input: string, config: any): { isValid: boolean, errorMessage?: string } {
    if (!input || input.trim() === '') return { isValid: false, errorMessage: "Por favor escribe una respuesta válida." };
    if (config.inputType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
            return { isValid: false, errorMessage: config.errorMessage || "Email inválido." };
        }
    }
    return { isValid: true };
}

async function saveVariable(contactNumber: string, variable: string, value: string) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    if (!snapshot.empty) {
        const updateData: any = {};
        updateData[`customFields.${variable}`] = value;
        if (variable === 'nombre' || variable === 'name') updateData['contactName'] = value;
        if (variable === 'email') updateData['email'] = value;
        if (variable === 'empresa') updateData['company'] = value;
        await snapshot.docs[0].ref.update(updateData);
    }
}

async function updateBotState(contactNumber: string, state: any) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    if (!snapshot.empty) {
        await snapshot.docs[0].ref.update({ 
            botState: state,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }
}

async function logBotMessage(contactNumber: string, message: string) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    if (!snapshot.empty) {
        await snapshot.docs[0].ref.update({
            lastMessage: message,
            messages: admin.firestore.FieldValue.arrayUnion({
                sender: 'agent',
                text: message,
                timestamp: new Date(),
            }),
        });
    }
}
