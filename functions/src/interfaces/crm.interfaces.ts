import { Timestamp } from 'firebase-admin/firestore';

/**
 * Representa una oportunidad de venta en la colección 'opportunities'.
 */
export interface Opportunity {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  source: "WhatsApp" | "Web" | "Manual";
  currentPipeline: string;
  currentStage: string;
  createdAt: Timestamp;
  lastContacted: Timestamp;
  lastMessageSnippet: string;
  hasUnreadMessages: boolean;
  assignedTo?: string;
  value?: number;
  internalNotes?: string;
}

/**
 * Representa un único mensaje en una conversación.
 */
export interface Message {
  id?: string;
  from: "cliente" | "bot" | "agente";
  text: string;
  type: string;
  timestamp: Date | Timestamp;
  whatsappMessageId?: string;
  direction: "inbound" | "outbound";
  status: "sent" | "delivered" | "read" | "failed" | "received";
  aiSuggestion?: string; // <-- Campo añadido para la sugerencia de IA
}