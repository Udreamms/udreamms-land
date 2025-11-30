
// functions/src/utils/whatsapp.ts

import axios from 'axios';

/**
 * Sends a text message using the WhatsApp Cloud API.
 * @param {string} recipientNumber The recipient's phone number.
 * @param {string} text The message text to send.
 * @returns {Promise<string>} The message ID from the API response.
 */
export const sendApiMessage = async (recipientNumber: string, text: string): Promise<string> => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.error('WhatsApp API credentials are not set in environment variables.');
    throw new Error('Server configuration error: WhatsApp credentials missing.');
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
  
  try {
    const response = await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to: recipientNumber,
        type: 'text',
        text: { body: text },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const messageId = response.data.messages?.[0]?.id;
    if (!messageId) {
      console.error('No message ID returned from WhatsApp API:', response.data);
      throw new Error('No message ID returned from WhatsApp.');
    }

    return messageId;
  } catch (error: any) {
    console.error(
      'Error sending WhatsApp message via API:',
      error.response ? error.response.data : error.message
    );
    // Re-throw the error to be handled by the calling function
    throw error;
  }
};
