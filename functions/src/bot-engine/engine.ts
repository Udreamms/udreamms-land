
// functions/src/bot-engine/engine.ts

import { db } from '../config/firebase';
import { sendApiMessage } from '../utils/whatsapp';
import { FieldValue } from 'firebase-admin/firestore';

// --- Definiciones de Tipos para Claridad y Seguridad ---

interface FlowNodeData {
  label: string;
  text?: string;
  // Añadir aquí otras propiedades que puedan tener los datos de un nodo
}

interface FlowNode {
  id: string;
  type: string;
  data: FlowNodeData;
  // Añadir aquí otras propiedades de un nodo si las hubiera
}

interface ChatbotFlow {
  nodes: FlowNode[];
  edges: any[];
}

interface UserSession {
  botId: string;
  currentNodeId: string;
  lastInteraction: FieldValue;
}

// --- Gestión de Sesiones ---

const getUserSession = async (fromNumber: string): Promise<UserSession | null> => {
  const sessionRef = db.collection('whatsapp_sessions').doc(fromNumber);
  const sessionSnap = await sessionRef.get();
  return sessionSnap.exists ? (sessionSnap.data() as UserSession) : null;
};

const updateUserSession = async (fromNumber: string, botId: string, currentNodeId: string): Promise<void> => {
  const sessionRef = db.collection('whatsapp_sessions').doc(fromNumber);
  const sessionData: UserSession = {
    botId,
    currentNodeId,
    lastInteraction: FieldValue.serverTimestamp(),
  };
  await sessionRef.set(sessionData, { merge: true });
};

const deleteUserSession = async (fromNumber: string): Promise<void> => {
  const sessionRef = db.collection('whatsapp_sessions').doc(fromNumber);
  await sessionRef.delete();
};

// --- Lógica del Motor del Bot ---

export const handleBotConversation = async (messageData: any): Promise<void> => {
  const fromNumber = messageData.from;
  // @ts-ignore - userMessage se usará en futuras implementaciones de nodos de condición/captura.
  const userMessage = messageData.text?.body || '';

  const activeBotQuery = db.collection('chatbots').where('isActive', '==', true).limit(1);
  const activeBotSnap = await activeBotQuery.get();

  if (activeBotSnap.empty) {
    return;
  }

  const botDoc = activeBotSnap.docs[0];
  const botId = botDoc.id;
  const botFlow = botDoc.data().flow as ChatbotFlow;

  let session = await getUserSession(fromNumber);
  let currentNode: FlowNode | undefined;

  if (!session) {
    currentNode = botFlow.nodes.find(node => node.data.label.toLowerCase() === 'inicio');
    if (!currentNode) {
      console.error(`Bot activo ${botId} no tiene un nodo "Inicio".`);
      return;
    }
  } else {
    const lastNodeId = session.currentNodeId;
    const outgoingEdge = botFlow.edges.find(edge => edge.source === lastNodeId);
    if (outgoingEdge) {
      currentNode = botFlow.nodes.find(node => node.id === outgoingEdge.target);
    } else {
      await deleteUserSession(fromNumber);
      console.log(`Conversación finalizada para ${fromNumber}. Handover a manual.`);
      return;
    }
  }

  if (!currentNode) {
    console.log(`No se encontró un nodo siguiente para ${fromNumber}. Finalizando flujo.`);
    await deleteUserSession(fromNumber);
    return;
  }

  const nodeType = currentNode.type;
  let responseText = '';

  if (nodeType === 'textMessage') {
    responseText = currentNode.data.text || 'Mensaje no configurado.';
  } else if (nodeType === 'startNode') {
    const outgoingEdge = botFlow.edges.find(edge => edge.source === currentNode?.id);
    if (outgoingEdge) {
      const nextNode = botFlow.nodes.find(node => node.id === outgoingEdge.target);
      if (nextNode && nextNode.type === 'textMessage') {
        currentNode = nextNode;
        responseText = nextNode.data.text || 'Mensaje de bienvenida no configurado.';
      }
    }
  }

  if (responseText) {
    const recipientNumber = fromNumber.replace('+', '');
    await sendApiMessage(recipientNumber, responseText);
    await updateUserSession(fromNumber, botId, currentNode.id);
  } else {
    await updateUserSession(fromNumber, botId, currentNode.id);
  }
};
