
// functions/src/triggers/whatsappWebhook.ts

import { https } from 'firebase-functions';
import { db } from '../config/firebase'; // 'admin' se elimina de esta importación
import { FieldValue } from 'firebase-admin/firestore';

async function getInboxGroupId(): Promise<string> {
  const groupsQuery = db.collection('kanban-groups').where('name', '==', 'Bandeja de Entrada');
  const snapshot = await groupsQuery.get();

  if (!snapshot.empty) {
    if (snapshot.size > 1) {
      console.warn('Multiple "Bandeja de Entrada" groups found. Using the first one.');
    }
    return snapshot.docs[0].id;
  } else {
    console.log('"Bandeja de Entrada" group not found, creating it...');
    const newGroup = await db.collection('kanban-groups').add({
      name: 'Bandeja de Entrada',
      order: 0,
      createdAt: FieldValue.serverTimestamp(),
    });
    return newGroup.id;
  }
}

export const whatsappWebhook = https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    if (req.method === 'GET' && req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.sendStatus(403);
    }
    return;
  }

  try {
    const body = req.body;
    
    console.log("--- INICIO DEL WEBHOOK DE WHATSAPP ---");
    console.log(JSON.stringify(body, null, 2));
    console.log("--- FIN DEL WEBHOOK ---");

    if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      const messageData = body.entry[0].changes[0].value.messages[0];
      const contactData = body.entry[0].changes[0].value.contacts?.[0];

      const from = messageData.from;
      const text = messageData.text?.body;
      const profileName = contactData?.profile?.name || 'Desconocido';
      const contactNumber = `+${from}`;
      
      if (!text) {
        res.sendStatus(200);
        return;
      }

      const cardsQuery = db.collectionGroup('cards').where('contactNumber', '==', contactNumber).limit(1);
      const cardSnapshot = await cardsQuery.get();

      const newMessage = {
        id: messageData.id,
        text: text,
        sender: 'contact',
        timestamp: FieldValue.serverTimestamp(),
      };

      if (!cardSnapshot.empty) {
        const existingCardRef = cardSnapshot.docs[0].ref;
        await existingCardRef.update({
          lastMessage: text,
          updatedAt: FieldValue.serverTimestamp(),
          messages: FieldValue.arrayUnion(newMessage)
        });
        console.log(`Card actualizada para ${contactNumber}.`);
      } else {
        const inboxGroupId = await getInboxGroupId();
        const newCardData = {
          contactName: profileName,
          contactNumber: contactNumber,
          channel: 'WhatsApp',
          lastMessage: text,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          messages: [newMessage],
        };
        await db.collection('kanban-groups').doc(in𝐠roupId).collection('cards').add(newCardData);
        console.log(`Nueva card creada para ${contactNumber}.`);
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error procesando el webhook de WhatsApp:', error);
    res.sendStatus(500);
  }
});
