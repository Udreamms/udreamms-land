/**
 * This file is the main entry point for all Firebase Cloud Functions.
 */
import { setGlobalOptions } from 'firebase-functions/v2';
import { handleEditorChat } from './chat/editorChat';
import { handleProjectAgent } from './chat/projectAgent';

// Set global options to grant all functions access to the GEMINI_API_KEY secret
// and increase memory to force a refresh of the environment variables.
setGlobalOptions({ secrets: ["GEMINI_API_KEY"], memory: "512MiB" });


/**
 * LEGACY: The main Cloud Function for handling the old editor chat.
 */
export const editorChat = handleEditorChat;

/**
 * The new, more powerful project agent function that handles multi-file
 * generation and updates based on a structured JSON response from the AI.
 */
export const projectAgent = handleProjectAgent;


// You can add more function exports here as your project grows.
