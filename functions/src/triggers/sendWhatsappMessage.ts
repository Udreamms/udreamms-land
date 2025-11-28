
// functions/src/triggers/sendWhatsappMessage.ts

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { db, admin } from '../config/firebase';
import axios from 'axios';

export const sendWhatsappMessage = onCall(async (request) => {
  // New syntax: check auth status from request.auth
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  // New syntax: data is accessed from request.data
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

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_TOKEN;
    if (!phoneNumberId || !accessToken) {
        console.error('WhatsApp API credentials are not set.');
        throw new Error('Server configuration error.');
    }
    
    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const response = await axios.post(url, 
      {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'text',
        text: { body: text },
      },
      {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      }
    );

    const messageId = response.data.messages[0]?.id;
    if (!messageId) throw new Error('No message ID returned from WhatsApp.');

    const finalMessage = { ...optimisticMessage, id: messageId, status: 'sent' };
    
    const currentMessages = cardSnap.data()?.messages || [];
    const updatedMessages = currentMessages.map((msg: any) => 
      msg.id === optimisticMessage.id ? finalMessage : msg
    );

    await cardRef.update({ messages: updatedMessages });
    
    return { success: true, wamid: messageId };

  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
    
    const errorMessage = { ...optimisticMessage, status: 'error' };
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
