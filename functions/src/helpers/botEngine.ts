
// src/helpers/botEngine.ts
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { 
    sendMessage, 
    sendMediaMessage, 
    sendButtonMessage, 
    sendListMessage, 
    sendLocationMessage 
} from './whatsappAPI';

const db = admin.firestore();

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

        // 1. VALIDACIÓN PARA CAPTURA DE DATOS
        if (currentNode.type === 'captureInputNode') {
            const validation = validateInput(userMessage, currentNode.data);
            if (!validation.isValid) {
                await sendMessage(to, validation.errorMessage || "Respuesta inválida.");
                return; 
            }
            if (currentNode.data.variableName) {
                await saveVariable(to, currentNode.data.variableName, userMessage);
                if (!cardData.customFields) cardData.customFields = {};
                cardData.customFields[currentNode.data.variableName] = userMessage;
            }
        }
        
        // 2. ENRUTAMIENTO INTELIGENTE (Smart Routing)
        // Buscamos todos los caminos posibles desde este nodo
        const outgoingEdges = bot.flow.edges.filter((e: any) => String(e.source) === String(currentNodeId));
        let selectedEdge = null;

        if (outgoingEdges.length === 0) {
            functions.logger.info("End of flow reached (no edges).");
            await updateBotState(to, { status: 'completed', currentNodeId: null });
            return;
        } else if (outgoingEdges.length === 1) {
            // Si solo hay un camino, lo tomamos sin preguntar (ej. Texto -> Texto)
            selectedEdge = outgoingEdges[0];
        } else {
            // HAY MÚLTIPLES CAMINOS: Debemos decidir cuál tomar según la respuesta del usuario
            functions.logger.info(`Multiple paths detected from ${currentNode.type}. Routing based on user input: "${userMessage}"`);
            
            if (currentNode.type === 'quickReplyNode') {
                // Buscamos qué botón coincide con el texto del usuario
                const buttons = currentNode.data.buttons || [];
                const matchedBtn = buttons.find((btn: any) => 
                    (btn.title || '').toLowerCase().trim() === userMessage.toLowerCase().trim() ||
                    (btn.id || '') === userMessage // Por si acaso llega el ID
                );

                if (matchedBtn) {
                    const handleId = matchedBtn.id || matchedBtn.title;
                    // Buscamos el edge que sale del handle específico de ese botón
                    selectedEdge = outgoingEdges.find((e: any) => e.sourceHandle === handleId);
                    if (!selectedEdge) {
                        functions.logger.warn(`Button "${handleId}" matched, but no edge connected to it. Using fallback.`);
                    }
                }
            } else if (currentNode.type === 'listMessageNode') {
                // Similar para listas
                let matchedRowId = null;
                const sections = currentNode.data.sections || [];
                for (const sec of sections) {
                    const row = (sec.rows || []).find((r: any) => 
                        (r.title || '').toLowerCase().trim() === userMessage.toLowerCase().trim()
                    );
                    if (row) {
                        matchedRowId = row.id || row.title;
                        break;
                    }
                }
                
                if (matchedRowId) {
                    selectedEdge = outgoingEdges.find((e: any) => e.sourceHandle === matchedRowId);
                }
            }

            // FALLBACK: Si no encontramos coincidencia específica (o no hay handles nombrados),
            // tomamos el primer edge disponible para no romper el flujo.
            if (!selectedEdge) {
                functions.logger.info("No specific route matched. Taking default path.");
                selectedEdge = outgoingEdges[0];
            }
        }

        if (selectedEdge) {
            nextNodeId = selectedEdge.target;
            functions.logger.info(`Routing to next node: ${nextNodeId}`);
        } else {
             functions.logger.warn("Could not determine next step.");
             return;
        }

    } else {
        // INICIO DEL FLUJO (StartNode)
        const startNode = bot.flow.nodes.find((n: any) => n.type === 'startNode');
        if (!startNode) return;
        const firstEdge = bot.flow.edges.find((e: any) => String(e.source) === String(startNode.id));
        if (firstEdge) nextNodeId = firstEdge.target;
    }

    // --- BUCLE DE EJECUCIÓN (Ejecuta nodos secuenciales hasta que necesita parar) ---
    while (shouldContinue && nextNodeId && executionCount < MAX_STEPS) {
        executionCount++;
        const nextNode = bot.flow.nodes.find((n: any) => String(n.id) === String(nextNodeId));
        
        if (!nextNode) {
            shouldContinue = false;
            break;
        }

        functions.logger.info(`[Step ${executionCount}] Executing Node: ${nextNode.type}`);
        
        // Guardamos estado ANTES de ejecutar (por si falla o para esperar input)
        await updateBotState(to, { 
            status: 'active', 
            currentNodeId: nextNodeId,
            lastInteraction: new Date() 
        });

        switch (nextNode.type) {
            case 'textMessageNode':
                const txt = replaceVariables(nextNode.data.content, cardData);
                await sendMessage(to, txt);
                await logBotMessage(to, txt);
                nextNodeId = getNextNodeId(bot, nextNodeId);
                await delay(800);
                if (!nextNodeId) shouldContinue = false;
                break;

            case 'captureInputNode':
                // NODO DE PARADA: El bot se detiene aquí y espera al webhook (Paso 0)
                shouldContinue = false; 
                break;

            case 'mediaMessageNode':
                const caption = replaceVariables(nextNode.data.caption || '', cardData);
                if (nextNode.data.url) {
                    await sendMediaMessage(to, nextNode.data.url, caption, nextNode.data.filename);
                    await logBotMessage(to, `[Archivo] ${caption}`);
                }
                nextNodeId = getNextNodeId(bot, nextNodeId);
                await delay(1000);
                if (!nextNodeId) shouldContinue = false;
                break;

            case 'quickReplyNode':
                const btnText = replaceVariables(nextNode.data.text || nextNode.data.bodyText, cardData);
                const buttons = nextNode.data.buttons || [];
                if (buttons.length > 0) {
                    await sendButtonMessage(to, btnText, buttons);
                    await logBotMessage(to, `[Botones] ${btnText}`);
                    shouldContinue = false; // NODO DE PARADA (Espera selección)
                } else {
                    await sendMessage(to, btnText); // Fallback texto
                    nextNodeId = getNextNodeId(bot, nextNodeId);
                }
                break;

            case 'listMessageNode':
                const listText = replaceVariables(nextNode.data.text, cardData);
                const btnLabel = nextNode.data.buttonText || "Ver Opciones";
                const sections = nextNode.data.sections || [];
                if (sections.length > 0) {
                    await sendListMessage(to, listText, btnLabel, sections);
                    await logBotMessage(to, `[Lista] ${listText}`);
                    shouldContinue = false; // NODO DE PARADA (Espera selección)
                } else {
                    nextNodeId = getNextNodeId(bot, nextNodeId);
                }
                break;

            case 'locationNode':
                if (nextNode.data.latitude) {
                    await sendLocationMessage(to, parseFloat(nextNode.data.latitude), parseFloat(nextNode.data.longitude), nextNode.data.name, nextNode.data.address);
                }
                nextNodeId = getNextNodeId(bot, nextNodeId);
                if (!nextNodeId) shouldContinue = false;
                break;

            case 'delayNode':
                const ms = (nextNode.data.duration || 2) * 1000;
                await delay(ms);
                nextNodeId = getNextNodeId(bot, nextNodeId);
                if (!nextNodeId) shouldContinue = false;
                break;
            
            case 'conditionNode':
                // Lógica simple: Buscar edge 'true' o 'false' (placeholder)
                const trueEdge = bot.flow.edges.find((e: any) => String(e.source) === String(nextNodeId) && e.sourceHandle === 'true');
                if (trueEdge) nextNodeId = trueEdge.target;
                else nextNodeId = getNextNodeId(bot, nextNodeId);
                
                if (!nextNodeId) shouldContinue = false;
                break;

            default:
                // Paso a través para nodos desconocidos o puramente lógicos
                nextNodeId = getNextNodeId(bot, nextNodeId);
                if (!nextNodeId) shouldContinue = false;
                break;
        }
    }
    
    // Si terminamos el bucle y no hay más nodos, marcamos como completado
    if (!shouldContinue && !nextNodeId && currentNodeId !== nextNodeId) {
         // Ojo: Si shouldContinue es false porque estamos en un nodo de parada (Capture/Buttons), NO completamos.
         // Solo completamos si no hay nextNodeId.
    }
}

// Helper para obtener el siguiente nodo por defecto (primer edge)
function getNextNodeId(bot: any, currentId: string): string | null {
    const edge = bot.flow.edges.find((e: any) => String(e.source) === String(currentId));
    return edge ? edge.target : null;
}

// HELPERS DE VALIDACIÓN Y DB (Sin cambios significativos, solo incluidos por completitud)
function validateInput(input: string, config: any): { isValid: boolean, errorMessage?: string } {
    if (!input || input.trim() === '') return { isValid: false, errorMessage: "Respuesta vacía." };
    if (config.inputType === 'email') {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(input)) return { isValid: false, errorMessage: config.errorMessage || "Email inválido." };
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
        await snapshot.docs[0].ref.update(updateData);
    }
}
async function updateBotState(contactNumber: string, state: any) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    if (!snapshot.empty) await snapshot.docs[0].ref.update({ botState: state, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
}
async function logBotMessage(contactNumber: string, message: string) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    if (!snapshot.empty) await snapshot.docs[0].ref.update({ lastMessage: message, messages: admin.firestore.FieldValue.arrayUnion({ sender: 'agent', text: message, timestamp: new Date() }) });
}
