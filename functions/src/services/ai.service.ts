// import { generate } from '@genkit-ai/ai';
// import { gemini15Flash, googleAI } from '@genkit-ai/googleai';

// // The Genkit configuration is now handled in the main entry point (index.ts)
// // No need to configure it here anymore.

// const replySuggestionPrompt = `
//   Eres un asistente de ventas experto para una empresa. Tu objetivo es ayudar a los agentes a responder a los clientes de manera rápida y efectiva por WhatsApp.
//   Analiza el siguiente mensaje de un cliente y genera una respuesta corta, profesional y amigable en español.
//   La respuesta debe buscar avanzar la conversación hacia una venta o resolver la duda del cliente.

//   Mensaje del cliente: \"{messageText}\"

//   Sugerencia de respuesta:
// `;

// /**
//  * Analiza un mensaje de WhatsApp y sugiere una respuesta utilizando IA.
//  * @param messageText El texto del mensaje recibido.
//  * @returns Una promesa que se resuelve con la respuesta sugerida.
//  */
// export async function suggestWhatsAppReply(messageText: string): Promise<string> {
//   if (!messageText) {
//     return '';
//   }

//   try {
//     // const llmResponse = await generate({
//     //   model: gemini15Flash,
//     //   prompt: replySuggestionPrompt.replace('{messageText}', messageText),
//     // });

//     // return llmResponse.text();
//     return Promise.resolve(''); // Return an empty string to avoid breaking dependent functions

//   } catch (error) {
//     console.error('Error generando sugerencia de respuesta con IA:', error);
//     return '';
//   }
// }
