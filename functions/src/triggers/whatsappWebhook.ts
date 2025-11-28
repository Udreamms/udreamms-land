
// functions/src/triggers/whatsappWebhook.ts

import { https } from 'firebase-functions';
import { db } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Creates a new card in the "Bandeja de Entrada" Kanban group for a new WhatsApp message.
 * @param {string} from The sender's WhatsApp number.
 * @param {string} text The content of the message.
 */
async function createKanbanCardInInbox(from: string, text: string) {
  try {
    // 1. Find the "Bandeja de Entrada" group.
    const groupsQuery = db.collection('kanban-groups').where('name', '==', 'Bandeja de Entrada').limit(1);
    const snapshot = await groupsQuery.get();

    if (snapshot.empty) {
      console.error('CRITICAL: Kanban group "Bandeja de Entrada" not found. Please ensure it exists and the name matches exactly.');
      return;
    }

    const inboxGroup = snapshot.docs[0];
    const groupId = inboxGroup.id;

    // 2. Create a new card in its "cards" subcollection.
    await db.collection('kanban-groups').doc(groupId).collection('cards').add({
      content: `De: ${from} - "${text}"`,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`New card created in "Bandeja de Entrada" for message from ${from}.`);

  } catch (error) {
    console.error('Error creating Kanban card:', error);
  }
}

/**
 * Webhook for receiving messages from WhatsApp.
 */
export const whatsappWebhook = https.onRequest(async (req, res) => {
  if (req.method === 'POST') {
    const body = req.body;
    try {
      if (body.object && body.entry?.[0]?.changes?.[0]?.value.messages?.[0]) {
        const messageData = body.entry[0].changes[0].value.messages[0];
        const from = messageData.from;
        const text = messageData.text?.body;

        if (text) {
          // --- Corrected Logic ---
          // Always create the Kanban card in the single inbox group.
          await createKanbanCardInInbox(from, text);
          // --- End Corrected Logic ---
        }
      }
      res.sendStatus(200);
    } catch (error) {
      console.error('Error processing WhatsApp webhook:', error);
      res.sendStatus(500);
    }
  } else if (req.method === 'GET') {
    // Verification logic remains the same
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(405);
  }
});
