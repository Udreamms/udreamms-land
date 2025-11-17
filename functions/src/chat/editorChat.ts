import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Initialize the Gemini AI model
// Make sure to set the GEMINI_API_KEY in your Firebase environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const handleEditorChat = onCall(async (request) => {
  // 1. Authentication and Validation
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const { projectId, message } = request.data;
  if (!projectId || !message) {
    throw new HttpsError('invalid-argument', 'The function must be called with "projectId" and "message" arguments.');
  }
  const userId = request.auth.uid;

  try {
    const projectRef = db.collection('projects').doc(projectId);

    // 2. Add user's message to the chat history
    await db.collection('projects').doc(projectId).collection('chat_history').add({
      sender: 'user',
      text: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: userId,
    });

    // 3. Retrieve recent chat history and current code for context
    const chatHistorySnapshot = await db.collection('projects').doc(projectId).collection('chat_history')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();
      
    const chatHistory = chatHistorySnapshot.docs.map(doc => doc.data()).reverse(); // oldest to newest

    const projectDoc = await projectRef.get();
    if (!projectDoc.exists) {
        throw new HttpsError('not-found', 'Project not found.');
    }
    const currentCode = projectDoc.data()?.code || '<!-- Start your HTML here -->';

    // 4. Construct a robust prompt for Gemini
    const prompt = `
      You are an expert web developer AI specializing in Tailwind CSS.
      The user is editing a website. Based on their message, update the HTML code.
      
      **User's Request:** "${message}"
      
      **Current HTML code (inside the <body> tag):**
      \`\`\`html
      ${currentCode}
      \`\`\`
      
      **Recent Chat History (for context):**
      ${JSON.stringify(chatHistory.map(h => ({ sender: h.sender, text: h.text })))}

      **Instructions:**
      1. Generate the new, complete HTML code for the content that should be inside the <body> tag.
      2. Your response MUST BE a valid JSON object with a single key "newCode".
      3. Do NOT include \`\`\`json, \`\`\`html, or any other markdown formatting in your response. Just the raw JSON object.
      4. Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags in the "newCode" value. Only the content.
      
      **Example Response:**
      { "newCode": "<div class=\\"p-4\\"><h1 class=\\"text-2xl\\">Hello World</h1></div>" }
    `;

    // 5. Call the Gemini AI model
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();

    // 6. Parse the JSON response and update the database
    let parsedResponse;
    try {
        parsedResponse = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse AI response:", responseText);
        throw new HttpsError('internal', 'The AI returned an invalid response. Please try again.');
    }
    
    const newCode = parsedResponse.newCode;
    if (typeof newCode !== 'string') {
        throw new HttpsError('internal', 'The AI response was missing the "newCode" string.');
    }

    await projectRef.update({ code: newCode });

    // 7. Add AI's confirmation to chat history
     await db.collection('projects').doc(projectId).collection('chat_history').add({
      sender: 'ai',
      text: 'I have updated the code based on your request.', // A simple confirmation message
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 8. Return the new code to the client for instant preview
    return { newCode };

  } catch (error) {
    console.error('Error in handleEditorChat:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'An unexpected error occurred.');
  }
});
