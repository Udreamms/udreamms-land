
// functions/src/triggers/whatsappWebhook.ts

import { onRequest } from 'firebase-functions/v2/https';
import { db } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

async function getInboxGroupId(): Promise<string> {
  const groupsQuery = db.collection('kanban-groups').where('name', '==', 'Bandeja de Entrada');
  const snapshot = await groupsQuery.get();

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  } else {
    const newGroup = await db.collection('kanban-groups').add({
      name: 'Bandeja de Entrada',
      order: 0,
      createdAt: FieldValue.serverTimestamp(),
    });
    return newGroup.id;
  }
}

export const whatsappWebhook = onRequest(async (req, res) => {
  if (req.method === 'GET' && req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
    return;
  }

  if (req.method !== 'POST') {
    res.sendStatus(403);
    return;
  }

  try {
    const body = req.body;
    const change = body.entry?.[0]?.changes?.[0]?.value;

    if (!change) {
      res.sendStatus(200);
      return;
    }

    if (change.messages?.[0]) {
      const messageData = change.messages[0];
      const contactData = change.contacts?.[0];
      
      const text = messageData.text?.body;
      if (!text) {
        res.sendStatus(200);
        return;
      }

      const from = messageData.from;
      const profileName = contactData?.profile?.name || 'Desconocido';
      const contactNumber = `+${from}`;

      const cardsQuery = db.collectionGroup('cards').where('contactNumber', '==', contactNumber).limit(1);
      const cardSnapshot = await cardsQuery.get();

      const newMessage = {
        id: messageData.id,
        text: text,
        sender: 'contact',
        timestamp: new Date(),
        status: 'read',
      };

      if (!cardSnapshot.empty) {
        const existingCardRef = cardSnapshot.docs[0].ref;
        await existingCardRef.update({
          lastMessage: text,
          updatedAt: FieldValue.serverTimestamp(),
          messages: FieldValue.arrayUnion(newMessage),
          contactName: profileName,
        });
      } else {
        const inboxGroupId = await getInboxGroupId();
        await db.collection('kanban-groups').doc(inboxGroupId).collection('cards').add({
          contactName: profileName,
          contactNumber: contactNumber,
          channel: 'WhatsApp',
          lastMessage: text,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          messages: [newMessage],
        });
      }
    } 
    else if (change.statuses?.[0]) {
      const statusData = change.statuses[0];
      const messageId = statusData.id;
      const newStatus = statusData.status;
      const recipientNumber = `+${statusData.recipient_id}`;

      const cardsQuery = db.collectionGroup('cards').where('contactNumber', '==', recipientNumber).limit(1);
      const cardSnapshot = await cardsQuery.get();

      if (!cardSnapshot.empty) {
        const cardDoc = cardSnapshot.docs[0];
        const cardData = cardDoc.data();
        
        const updatedMessages = cardData.messages.map((msg: any) => {
          if (msg.id === messageId) {
            if (msg.status === 'read') return msg;
            if (msg.status === 'delivered' && newStatus === 'sent') return msg;
            return { ...msg, status: newStatus };
          }
          return msg;
        });

        await cardDoc.ref.update({ messages: updatedMessages });
      }
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Error processing WhatsApp webhook:', error.message, error.stack);
    res.sendStatus(500);
  }
});
