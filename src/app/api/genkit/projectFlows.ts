import { defineFlow } from '@genkit-ai/flow';
import { z } from 'zod';
import * as admin from 'firebase-admin';
import { geminiPro } from '@genkit-ai/googleai';
import { generate } from '@genkit-ai/ai';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const editorChat = defineFlow(
  {
    name: 'editorChat',
    inputSchema: z.object({
      projectId: z.string(),
      message: z.string(),
    }),
    outputSchema: z.object({
      response: z.string(),
    }),
  },
  async ({ projectId, message }) => {
    const projectRef = db.collection('projects').doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      throw new Error('Project not found');
    }

    const projectData = projectDoc.data();
    const currentCode = projectData?.code || '<!-- Start your HTML here -->';

    const chatHistorySnapshot = await projectRef.collection('chat_history').orderBy('timestamp', 'asc').get();
    const chatHistory = chatHistorySnapshot.docs.map(doc => doc.data());

    const prompt = `
      You are an expert web developer AI creating a site with Tailwind CSS.
      The user is editing a website and has sent the following message: "${message}".
      This is the current HTML code for the content inside the <body> tag:
      \`\`\`html
      ${currentCode}
      \`\`\`
      This is the chat history for context:
      ${JSON.stringify(chatHistory)}

      Based on the user's message, please generate the new, complete HTML code for the content that should be inside the <body> tag.
      IMPORTANT: Your response MUST be ONLY the HTML code for the body. Do not include <!DOCTYPE>, <html>, <head>, or <body> tags.
      Do not include any explanations, greetings, or markdown formatting. Just the code for the body.
    `;

    const llmResponse = await generate({
      model: geminiPro,
      prompt: prompt,
      config: {
        temperature: 0.5,
      },
    });

    const newCode = llmResponse.text();

    await projectRef.update({
      code: newCode,
    });

    return {
      response: newCode,
    };
  }
);
export const createProjectFlow = defineFlow(
  {
    name: 'createProjectFlow',
    inputSchema: z.object({
      projectName: z.string(),
      ownerId: z.string(), // We'll pass the user's ID from the frontend
    }),
    outputSchema: z.object({
      projectId: z.string(),
      message: z.string(),
    }),
  },
  async ({ projectName, ownerId }) => {
    if (!projectName || !ownerId) {
      throw new Error('Project name and owner ID are required.');
    }

    const projectRef = db.collection('projects').doc();
    const initialProjectData = {
      name: projectName,
      ownerId: ownerId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastEdited: admin.firestore.FieldValue.serverTimestamp(),
      pageSchema: { components: [] }, // Start with an empty page
    };

    await projectRef.set(initialProjectData);

    // Also create an initial chat message
    await projectRef.collection('chat_history').add({
        sender: 'ai',
        text: 'Welcome to your new project! How can I help you build your website today?',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      projectId: projectRef.id,
      message: `Project '${projectName}' created successfully.`,
    };
  }
);
