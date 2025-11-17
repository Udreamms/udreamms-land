import { defineFlow } from '@genkit-ai/flow';
import { gemini15Flash } from '@genkit-ai/googleai';
import { z } from 'zod';
import { generate } from '@genkit-ai/ai';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert, AppOptions } from 'firebase-admin/app';

// Conditionally initialize Firebase Admin SDK
if (getApps().length === 0) {
  let appOptions: AppOptions = {};
  // Check if running in a local development environment
  if (process.env.NODE_ENV === 'development') {
    // In development, use the service account key
    const serviceAccount = require('../../../../functions/service-account-key.json');
    appOptions.credential = cert(serviceAccount);
  }
  // In production (e.g., Google Cloud Run), the SDK will automatically find the credentials
  initializeApp(appOptions);
}


interface ChatHistoryMessage {
  sender: 'user' | 'ai';
  text: string;
}

export const editorChat = defineFlow(
  {
    name: 'editorChat',
    inputSchema: z.object({
      projectId: z.string(),
      message: z.string(),
    }),
    outputSchema: z.object({
      code: z.string(),
      response: z.string(),
    }),
  },
  async ({ projectId, message }) => {
    const firestore = getFirestore();
    const projectRef = firestore.collection('projects').doc(projectId);

    // 1. Read the current code from Firestore
    const projectDoc = await projectRef.get();
    const currentCode = projectDoc.exists ? projectDoc.data()?.code || '' : '';

    // 2. Read the recent chat history from Firestore
    const chatHistoryRef = projectRef.collection('chat_history');
    const chatHistorySnapshot = await chatHistoryRef.orderBy('timestamp', 'desc').limit(10).get();
    const chatHistory: ChatHistoryMessage[] = [];
    chatHistorySnapshot.forEach(doc => {
      const data = doc.data();
      chatHistory.push({ sender: data.sender, text: data.text });
    });
    chatHistory.reverse(); // Order from oldest to newest

    // Format history for the prompt
    const formattedHistory = chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    // 3. Construct the new, context-aware prompt
    const PROMPT = `
      You are an expert web developer building a webpage iteratively.
      You will be given the current HTML/CSS code, the recent conversation history, and a new user request.
      Your task is to modify the existing code to incorporate the user's request, using the conversation history for context if needed.

      Your response MUST be a valid JSON object with two keys: "code" and "response".
      - "code": The full, updated HTML and CSS code. Do not use markdown.
      - "response": A very short, conversational message confirming the change (e.g., "Done!", "I've changed the button color for you.").

      Conversation History:
      ${formattedHistory}

      Current Code:
      \`\`\`html
      ${currentCode}
      \`\`\`

      New User Request: "${message}"
    `;

    // 4. Call the AI with the enhanced prompt
    const llmResponse = await generate({
      model: gemini15Flash,
      prompt: PROMPT,
      output: {
        format: 'json',
        schema: z.object({
          code: z.string(),
          response: z.string(),
        }),
      },
    });

    const { code, response } = llmResponse.output();

    // 5. Update the project with the newly modified code
    await projectRef.update({
      code: code,
    });

    return { code, response };
  }
);
