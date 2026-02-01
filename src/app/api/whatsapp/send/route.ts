import { NextResponse } from 'next/server';
import axios from 'axios';
import { db, admin } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { message, toNumber, cardId, groupId } = await req.json();

        if (!message || !toNumber || !cardId || !groupId) {
            return NextResponse.json(
                { error: 'Missing required fields: message, toNumber, cardId, or groupId' },
                { status: 400 }
            );
        }

        const token = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!token || !phoneNumberId) {
            return NextResponse.json(
                { error: 'Server configuration error: Missing WhatsApp credentials' },
                { status: 500 }
            );
        }

        const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

        // Clean phone number (remove + and spaces, just digits) matches helpers/whatsappAPI.ts
        const cleanTo = toNumber.replace(/\D/g, '');

        console.log(`[WhatsApp API] Sending to: ${cleanTo} (Raw: ${toNumber})`);

        // Prepare WhatsApp Payload
        const payload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: cleanTo,
            type: 'text',
            text: {
                preview_url: false,
                body: message,
            },
        };

        // 1. Send to WhatsApp
        let response;
        try {
            console.log(`[WhatsApp API] Request payload:`, JSON.stringify(payload));
            response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`[WhatsApp API] Success:`, response.data);
        } catch (apiError: any) {
            console.error(`[WhatsApp API] Error Response:`, apiError.response?.data || apiError.message);
            throw apiError;
        }

        const wa_id = response.data?.messages?.[0]?.id;

        // 2. Log in Firestore (Replicating Cloud Function Logic)
        // We use the admin SDK to bypass client rules and ensure server-side consistency
        const cardRef = db.collection('kanban-groups').doc(groupId).collection('cards').doc(cardId);

        await cardRef.update({
            lastMessage: message.length > 40 ? message.substring(0, 37) + '...' : message,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            messages: admin.firestore.FieldValue.arrayUnion({
                sender: 'agent',
                text: message,
                timestamp: new Date(), // Use server time or Date object
                whatsappMessageId: wa_id || null,
            }),
        });

        return NextResponse.json({ success: true, data: response.data, messageId: wa_id });
    } catch (error: any) {
        console.error('Error sending WhatsApp message:', error.response?.data || error.message);
        return NextResponse.json(
            {
                error: 'Failed to send message',
                details: error.response?.data || error.message,
            },
            { status: 500 }
        );
    }
}
