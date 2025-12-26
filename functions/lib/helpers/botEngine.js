"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveBot = getActiveBot;
exports.executeBotFlow = executeBotFlow;
// src/helpers/botEngine.ts
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const whatsappAPI_1 = require("./whatsappAPI");
const db = admin.firestore();
// Delay helper
const delay = (ms) => new Promise(res => setTimeout(res, ms));
async function getActiveBot() {
    const botsSnapshot = await db.collection('chatbots').where('isActive', '==', true).limit(1).get();
    if (botsSnapshot.empty)
        return null;
    const botData = botsSnapshot.docs[0].data();
    if (!botData.flow || !botData.flow.nodes || !botData.flow.edges)
        return null;
    return Object.assign({ id: botsSnapshot.docs[0].id }, botData);
}
function replaceVariables(text, cardData) {
    if (!text)
        return '';
    let processedText = text;
    const variables = Object.assign({ name: cardData.contactName || 'Amigo', nombre: cardData.contactName || 'Amigo', phone: cardData.contactNumber || '' }, cardData.customFields);
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{?\\{\\s*${key}\\s*\\}\\}?`, 'gi');
        processedText = processedText.replace(regex, String(value || ''));
    }
    return processedText;
}
// Calcula el tiempo de "escritura humana" en MS
function calculateTypingDelay(text) {
    const charsPerSecond = 25;
    const baseDelay = 1000;
    let typingTime = (text.length / charsPerSecond) * 1000;
    if (typingTime < 1500)
        typingTime = 1500;
    if (typingTime > 6000)
        typingTime = 6000;
    return baseDelay + typingTime;
}
function sanitizeListData(data) {
    const cleanSections = [];
    if (Array.isArray(data.sections) && data.sections.length > 0) {
        for (const sec of data.sections) {
            const rows = sec.rows || [];
            const options = sec.options || [];
            const validRows = [];
            if (Array.isArray(rows)) {
                rows.forEach((r) => { if (r && r.title && r.title.trim() !== '')
                    validRows.push(r); });
            }
            if (Array.isArray(options)) {
                options.forEach((opt, idx) => {
                    if (typeof opt === 'string' && opt.trim() !== '') {
                        validRows.push({ id: `opt_${Date.now()}_${idx}`, title: opt, description: '' });
                    }
                });
            }
            if (validRows.length > 0)
                cleanSections.push({ title: sec.title || 'Opciones', rows: validRows });
        }
    }
    if (cleanSections.length === 0 && Array.isArray(data.options)) {
        const validRows = data.options.filter((opt) => typeof opt === 'string' && opt.trim() !== '')
            .map((opt, idx) => ({ id: `legacy_${idx}`, title: opt }));
        if (validRows.length > 0)
            cleanSections.push({ title: 'Opciones', rows: validRows });
    }
    return cleanSections;
}
function sanitizeButtonsData(buttons) {
    if (!Array.isArray(buttons))
        return [];
    return buttons.filter(b => b && b.title && b.title !== 'undefined' && b.title.trim() !== '');
}
// --- MAIN ENGINE ---
async function executeBotFlow(bot, to, cardData, userMessage) {
    var _a;
    functions.logger.info(`>>> EXECUTING FLOW: ${bot.name} for ${to} <<<`);
    let currentNodeId = (_a = cardData.botState) === null || _a === void 0 ? void 0 : _a.currentNodeId;
    let nextNodeId = null;
    let shouldContinue = true;
    let executionCount = 0;
    const MAX_STEPS = 15;
    // --- PROCESAR INPUT USUARIO ---
    if (currentNodeId) {
        const currentNode = bot.flow.nodes.find((n) => String(n.id) === String(currentNodeId));
        if (!currentNode)
            return;
        await (0, whatsappAPI_1.markAsRead)(userMessage);
        await delay(500);
        if (currentNode.type === 'captureInputNode') {
            const validation = validateInput(userMessage, currentNode.data);
            if (!validation.isValid) {
                await (0, whatsappAPI_1.sendMessage)(to, validation.errorMessage || "Respuesta inválida.");
                return;
            }
            let varName = currentNode.data.variableName;
            if (!varName || varName === 'undefined') {
                const text = (currentNode.data.text || '').toLowerCase();
                if (text.includes('nombre') || text.includes('name'))
                    varName = 'nombre';
                else
                    varName = `captured_${currentNode.id}`;
            }
            if (varName) {
                await saveVariable(to, varName, userMessage);
                if (!cardData.customFields)
                    cardData.customFields = {};
                cardData.customFields[varName] = userMessage;
                if (['nombre', 'name'].includes(varName))
                    cardData.contactName = userMessage;
            }
        }
        const outgoingEdges = bot.flow.edges.filter((e) => String(e.source) === String(currentNodeId));
        let selectedEdge = null;
        if (outgoingEdges.length > 0) {
            if (outgoingEdges.length === 1) {
                selectedEdge = outgoingEdges[0];
            }
            else {
                if (currentNode.type === 'quickReplyNode') {
                    const buttons = sanitizeButtonsData(currentNode.data.buttons || []);
                    const matchedBtn = buttons.find((btn) => (btn.title || '').toLowerCase().trim() === userMessage.toLowerCase().trim() ||
                        (btn.id || '') === userMessage);
                    if (matchedBtn) {
                        const handleId = matchedBtn.id || matchedBtn.title;
                        selectedEdge = outgoingEdges.find((e) => e.sourceHandle === handleId);
                    }
                }
                else if (currentNode.type === 'listMessageNode') {
                    const sections = sanitizeListData(currentNode.data);
                    let matchedRowId = null;
                    for (const sec of sections) {
                        const row = sec.rows.find((r) => (r.title || '').toLowerCase().trim() === userMessage.toLowerCase().trim() ||
                            (r.id || '') === userMessage);
                        if (row) {
                            matchedRowId = row.id || row.title;
                            break;
                        }
                    }
                    if (matchedRowId) {
                        selectedEdge = outgoingEdges.find((e) => e.sourceHandle === matchedRowId);
                    }
                }
                if (!selectedEdge)
                    selectedEdge = outgoingEdges[0];
            }
            if (selectedEdge)
                nextNodeId = selectedEdge.target;
        }
        else {
            await updateBotState(to, { status: 'completed', currentNodeId: null });
            return;
        }
    }
    else {
        const startNode = bot.flow.nodes.find((n) => n.type === 'startNode');
        if (!startNode)
            return;
        const firstEdge = bot.flow.edges.find((e) => String(e.source) === String(startNode.id));
        if (firstEdge)
            nextNodeId = firstEdge.target;
    }
    // --- EJECUCIÓN DE NODOS ---
    while (shouldContinue && nextNodeId && executionCount < MAX_STEPS) {
        executionCount++;
        const nextNode = bot.flow.nodes.find((n) => String(n.id) === String(nextNodeId));
        if (!nextNode) {
            shouldContinue = false;
            break;
        }
        await updateBotState(to, { status: 'active', currentNodeId: nextNodeId, lastInteraction: new Date() });
        // Simulación Humana (Typing Delay) - CONTROLADO POR UI
        if (['textMessageNode', 'mediaMessageNode', 'quickReplyNode', 'listMessageNode'].includes(nextNode.type)) {
            // Por defecto es TRUE (Humano) a menos que se desactive explícitamente en el editor
            const simulateTyping = nextNode.data.typingSimulation !== false;
            if (simulateTyping) {
                const content = nextNode.data.content || nextNode.data.text || nextNode.data.caption || '';
                const humanDelay = calculateTypingDelay(content);
                await delay(humanDelay);
            }
        }
        switch (nextNode.type) {
            case 'textMessageNode':
                const txt = replaceVariables(nextNode.data.content || nextNode.data.text || '', cardData);
                if (txt) {
                    await (0, whatsappAPI_1.sendMessage)(to, txt);
                    await logBotMessage(to, txt);
                }
                nextNodeId = getNextNodeId(bot, nextNodeId);
                break;
            case 'captureInputNode':
                shouldContinue = false;
                break;
            case 'mediaMessageNode':
                const caption = replaceVariables(nextNode.data.caption || '', cardData);
                if (nextNode.data.url) {
                    await (0, whatsappAPI_1.sendMediaMessage)(to, nextNode.data.url, caption, nextNode.data.filename);
                    await logBotMessage(to, `[Archivo] ${caption}`);
                }
                nextNodeId = getNextNodeId(bot, nextNodeId);
                break;
            case 'quickReplyNode':
                const qrText = replaceVariables(nextNode.data.text || nextNode.data.bodyText || 'Selecciona:', cardData);
                const buttons = sanitizeButtonsData(nextNode.data.buttons || []);
                if (buttons.length > 0) {
                    await (0, whatsappAPI_1.sendButtonMessage)(to, qrText, buttons);
                    await logBotMessage(to, `[Botones] ${qrText}`);
                    shouldContinue = false;
                }
                else {
                    await (0, whatsappAPI_1.sendMessage)(to, qrText);
                    nextNodeId = getNextNodeId(bot, nextNodeId);
                }
                break;
            case 'listMessageNode':
                const listBody = replaceVariables(nextNode.data.body || nextNode.data.text || 'Selecciona:', cardData);
                const btnLabel = nextNode.data.buttonText || "Opciones";
                const cleanSections = sanitizeListData(nextNode.data);
                if (cleanSections.length > 0) {
                    await (0, whatsappAPI_1.sendListMessage)(to, listBody, btnLabel, cleanSections);
                    await logBotMessage(to, `[Lista] ${listBody}`);
                    shouldContinue = false;
                }
                else {
                    await (0, whatsappAPI_1.sendMessage)(to, listBody);
                    nextNodeId = getNextNodeId(bot, nextNodeId);
                }
                break;
            case 'locationNode':
                if (nextNode.data.latitude) {
                    await (0, whatsappAPI_1.sendLocationMessage)(to, parseFloat(nextNode.data.latitude), parseFloat(nextNode.data.longitude), nextNode.data.name, nextNode.data.address);
                }
                nextNodeId = getNextNodeId(bot, nextNodeId);
                break;
            case 'delayNode':
                const ms = (nextNode.data.duration || 2) * 1000;
                await delay(ms);
                nextNodeId = getNextNodeId(bot, nextNodeId);
                break;
            case 'conditionNode':
                const trueEdge = bot.flow.edges.find((e) => String(e.source) === String(nextNodeId) && e.sourceHandle === 'true');
                if (trueEdge)
                    nextNodeId = trueEdge.target;
                else
                    nextNodeId = getNextNodeId(bot, nextNodeId);
                break;
            default:
                nextNodeId = getNextNodeId(bot, nextNodeId);
                break;
        }
    }
}
function getNextNodeId(bot, currentId) {
    if (!currentId)
        return null;
    const edge = bot.flow.edges.find((e) => String(e.source) === String(currentId));
    return edge ? edge.target : null;
}
function validateInput(input, config) {
    if (!input || input.trim() === '')
        return { isValid: false, errorMessage: "Respuesta vacía." };
    if (config.inputType === 'email') {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(input))
            return { isValid: false, errorMessage: config.errorMessage || "Email inválido." };
    }
    return { isValid: true };
}
async function saveVariable(contactNumber, variable, value) {
    if (!variable)
        return;
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    const updateData = {};
    updateData[`customFields.${variable}`] = value;
    if (['nombre', 'name', 'fullname'].includes(variable.toLowerCase())) {
        updateData['contactName'] = value;
    }
    if (!snapshot.empty) {
        await snapshot.docs[0].ref.update(updateData);
    }
}
async function updateBotState(contactNumber, state) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    if (!snapshot.empty)
        await snapshot.docs[0].ref.update({ botState: state, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
}
async function logBotMessage(contactNumber, message) {
    const cardsRef = db.collectionGroup('cards').where('contactNumber', '==', contactNumber);
    const snapshot = await cardsRef.get();
    if (!snapshot.empty)
        await snapshot.docs[0].ref.update({ lastMessage: message, messages: admin.firestore.FieldValue.arrayUnion({ sender: 'agent', text: message, timestamp: new Date() }) });
}
//# sourceMappingURL=botEngine.js.map