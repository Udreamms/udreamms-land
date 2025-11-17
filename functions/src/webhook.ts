
// functions/src/webhook.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Esta función busca un documento en la colección 'phoneNumbers' 
// que coincida con el número de teléfono proporcionado y devuelve el 'userId' asociado.
async function getUserIdFromPhoneNumber(phoneNumber: string): Promise<string | null> {
  try {
    const phoneSnapshot = await admin.firestore().collection('phoneNumbers').where('e164', '==', phoneNumber).limit(1).get();
    if (phoneSnapshot.empty) {
      console.log(`No user found for phone number: ${phoneNumber}`);
      return null;
    }
    // Suponiendo que el documento en phoneNumbers tiene un campo 'userId'
    const userData = phoneSnapshot.docs[0].data();
    return userData.userId;
  } catch (error) {
    console.error('Error in getUserIdFromPhoneNumber:', error);
    return null;
  }
}

// Define y exporta la Cloud Function que maneja los webhooks.
export const whatsappWebhook = functions.https.onRequest(async (request, response) => {
  // Validar que el método de la petición sea POST
  if (request.method !== 'POST') {
    console.warn('Received non-POST request');
    response.status(405).send('Method Not Allowed');
    return;
  }

  const data = request.body;

  // Validar la estructura del payload (ejemplo para WhatsApp Cloud API)
  if (data.object !== 'whatsapp_business_account' || !data.entry) {
    console.warn('Invalid or incomplete webhook payload:', data);
    response.status(400).send('Bad Request: Invalid payload structure.');
    return;
  }

  try {
    // Procesar cada evento en la entrada del webhook
    for (const entry of data.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const message = change.value.messages[0];
          const from = message.from; // Número de teléfono del cliente en formato internacional

          // Encontrar el userId asociado a este número de teléfono
          const userId = await getUserIdFromPhoneNumber(from);

          if (!userId) {
            console.error(`Webhook received for an unregistered phone number: ${from}`);
            continue; // Saltar al siguiente mensaje
          }

          // Crear un nuevo documento en la colección 'conversations'
          // El ID del documento será el ID del mensaje de WhatsApp para evitar duplicados.
          await admin.firestore().collection('conversations').doc(message.id).set({
            userId: userId, // ID del propietario de la conversación
            contactPhone: from,
            lastMessage: message.text.body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            platform: 'whatsapp',
            // Puedes añadir más campos relevantes aquí
          }, { merge: true });
          
          console.log(`Conversation for ${from} (user: ${userId}) processed successfully.`);
        }
      }
    }
    
    // Responder al webhook que el evento fue recibido y procesado.
    response.status(200).send('EVENT_RECEIVED');

  } catch (error) {
    console.error('Error processing webhook:', error);
    response.status(500).send('Internal Server Error');
  }
});
