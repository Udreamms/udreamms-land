import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- Initialization ---
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });


// --- Types ---
interface ProjectFile {
    name: string;
    content: string;
}

// --- Helper Functions ---
const parseJsonFromText = (text: string): { files: ProjectFile[] } | null => {
    const jsonRegex = /```json\n([\s\S]*?)\n```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
        try {
            return JSON.parse(match[1]);
        } catch (error) {
            console.error('Failed to parse JSON from AI response:', error);
            return null;
        }
    }
    console.error('No valid JSON block found in AI response.');
    return null;
};

// --- Main Cloud Function ---
export const handleProjectAgent = onCall(async (request) => {
    // 1. Authentication & Validation
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'You must be logged in to call this function.');
    }
    const { projectId, messages, userMessageContent } = request.data;
    if (!projectId || !messages || !userMessageContent) {
        throw new HttpsError('invalid-argument', 'Missing required data: projectId, messages, or userMessageContent.');
    }
    
    const projectRef = db.collection('projects').doc(projectId);

    try {
        // 2. Construct the prompt with explicit instructions
        const CTO_PROMPT_ENHANCEMENT = `
            You are a world-class AI CTO. Your task is to generate the file structure for a web project based on the user's request.
            You MUST respond with a valid JSON object inside a markdown code block.
            The JSON object must have a single key "files", which is an array of objects, where each object has a "name" and "content" property.
            The HTML file must be complete, including <!DOCTYPE>, <html>, <head> with a <title> and TailwindCSS script, and <body>.
            
            Example response format:
            \`\`\`json
            {
              "files": [
                { "name": "index.html", "content": "<!DOCTYPE html><html><head><title>My App</title><script src=\\"https://cdn.tailwindcss.com\\"></script></head><body>...</body></html>" },
                { "name": "style.css", "content": "/* CSS styles */" },
                { "name": "script.js", "content": "// JavaScript code" }
              ]
            }
            \`\`\`
        `;
        const fullPrompt = `${userMessageContent}\n\n${CTO_PROMPT_ENHANCEMENT}`;

        // 3. Call the Gemini AI model
        const chat = geminiModel.startChat({
            history: messages.map((msg: { role: string, content: string }) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
        });
        const result = await chat.sendMessage(fullPrompt);
        const agentResponseText = result.response.text();
        
        // 4. Process and save the response
        const parsedData = parseJsonFromText(agentResponseText);
        
        const finalMessages = [
            ...messages,
            { role: 'user', content: userMessageContent },
            { 
                role: 'assistant', 
                content: parsedData ? "I have updated the project files based on your request." : agentResponseText 
            }
        ];

        const updatePayload: { messages: any[]; files?: ProjectFile[] } = {
            messages: finalMessages,
        };

        if (parsedData && parsedData.files) {
            updatePayload.files = parsedData.files;
        }

        // Update the project document in Firestore
        await projectRef.update(updatePayload);

        return { success: true, message: "Project updated successfully." };

    } catch (error) {
        console.error('Error in handleProjectAgent:', error);
        throw new HttpsError('internal', 'An unexpected error occurred while processing your request.');
    }
});
