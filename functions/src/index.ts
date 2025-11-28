/**
 * This file is the main entry point for all Firebase Cloud Functions.
 */
import { setGlobalOptions } from 'firebase-functions/v2';

// Set global options to grant all functions access to the GEMINI_API_KEY secret
// and increase memory to force a refresh of the environment variables.
setGlobalOptions({ secrets: ["GEMINI_API_KEY"], memory: "512MiB" });

/**
 * The webhook for handling incoming WhatsApp messages.
 * This re-exports the function from its own file.
 */
export { whatsappWebhook } from './triggers/whatsappWebhook';

/**
 * A callable function to send outbound WhatsApp messages.
 */
export { sendWhatsappMessage } from './triggers/sendWhatsappMessage';
