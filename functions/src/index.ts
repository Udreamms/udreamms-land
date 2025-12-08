
// src/index.ts
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export all callable functions from the whatsapp callable file
export { sendWhatsappMessage, sendWhatsappMediaMessage } from './callable/whatsapp';

// Export all webhook functions from the whatsapp webhook file
export { whatsappWebhook } from './webhooks/whatsapp';
