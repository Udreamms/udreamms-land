
// functions/src/triggers/sendWhatsappMessage.ts

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db, admin } from '../config/firebase';
import { sendApiMessage } from '../utils/whatsapp'; // Importamos la nueva función

export const sendWhatsappMessage = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { groupId, cardId, text } = request.data;
  if (!groupId || !cardId || !text) {
    throw new HttpsError('invalid-argument', 'Missing groupId, cardId, or text.');
  }

  const cardRef = db.collection('kanban-groups').doc(groupId).collection('cards').doc(cardId);
  
  const optimisticMessage = {
    id: `local_${Date.now()}`,
    text: text,
    sender: 'cso',
    timestamp: new Date(),
    status: 'sending',
  };

  // Se añade el mensaje optimista a la base de datos
  await cardRef.update({
    messages: admin.firestore.FieldValue.arrayUnion(optimisticMessage),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  try {
    const cardSnap = await cardRef.get();
    if (!cardSnap.exists) throw new HttpsError('not-found', 'Card not found.');
    
    const cardData = cardSnap.data();
    const recipientNumber = cardData?.contactNumber?.replace('+', '');
    if (!recipientNumber) throw new HttpsError('failed-precondition', 'Contact number is missing.');

    // --- Lógica de envío refactorizada ---
    // Ahora llamamos a la función centralizada
    const messageId = await sendApiMessage(recipientNumber, text);
    // ------------------------------------

    const finalMessage = { ...optimisticMessage, id: messageId, status: 'sent' };
    
    const currentMessages = cardSnap.data()?.messages || [];
    const updatedMessages = currentMessages.map((msg: any) => 
      msg.id === optimisticMessage.id ? finalMessage : msg
    );

    await cardRef.update({ messages: updatedMessages });
    
    return { success: true, wamid: messageId };

  } catch (error: any) {
    console.error('Error in sendWhatsappMessage function:', error);
    
    const errorMessage = { ...optimisticMessage, status: 'error' };
    // Volvemos a leer los mensajes para asegurar que tenemos la última versión
    const currentMessages = (await cardRef.get()).data()?.messages || [];
    const updatedMessages = currentMessages.map((msg: any) => 
      msg.id === optimisticMessage.id ? errorMessage : msg
    );
    await cardRef.update({ messages: updatedMessages });
    
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to send message.');
  }
});
