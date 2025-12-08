
// src/index.ts
import * as admin from 'firebase-admin';

// This check prevents the app from being initialized multiple times,
// which is important in a modular structure.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// --- Export all functions from their new, organized locations ---

// Functions that can be called directly from the web application
export { sendWhatsappMessage, sendWhatsappMediaMessage } from './callable/whatsapp';
export { moveCard } from './cardActions'; // Now included!

// Functions that act as webhooks for external services
export { whatsappWebhook } from './webhooks/whatsapp';
