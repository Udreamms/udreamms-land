
// src/index.ts
import * as admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Export all functions
export { sendWhatsappMessage, sendWhatsappMediaMessage } from './callable/whatsapp';
export { moveCard } from './cardActions';
export { whatsappWebhook } from './webhooks/whatsapp';
// fixCors eliminado porque ya cumplió su función
