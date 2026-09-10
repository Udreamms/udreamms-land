import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/firebase/admin';

export interface ChatMessage {
  id: string;
  sender: 'client' | 'staff';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const viewer = searchParams.get('viewer') || 'client'; // 'client' | 'staff'

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const docId = `chat_${cleanEmail}`;

    if (!db) {
      return NextResponse.json({ messages: [], unreadCount: 0 });
    }

    const docRef = db.collection('portal_chats').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({
        messages: [],
        unreadCount: 0,
        lastMessage: '',
      });
    }

    const data = doc.data() || {};
    const messages: ChatMessage[] = data.messages || [];

    // Mark as read according to viewer
    if (viewer === 'staff' && data.unreadByStaff) {
      await docRef.update({ unreadByStaff: 0 });
    } else if (viewer === 'client' && data.unreadByClient) {
      await docRef.update({ unreadByClient: 0 });
    }

    return NextResponse.json({
      messages,
      unreadByStaff: data.unreadByStaff || 0,
      unreadByClient: data.unreadByClient || 0,
      lastMessage: data.lastMessage || '',
      updatedAt: data.updatedAt || '',
    });
  } catch (error: any) {
    console.error('Error in chat GET:', error);
    return NextResponse.json({ error: error?.message || 'Error al obtener mensajes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientEmail, clientName, sender, senderName, text } = body;

    if (!clientEmail || !text || !sender) {
      return NextResponse.json({ error: 'Faltan parámetros (clientEmail, text, sender)' }, { status: 400 });
    }

    const cleanEmail = clientEmail.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    const docId = `chat_${cleanEmail}`;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: sender === 'staff' ? 'staff' : 'client',
      senderName: senderName || (sender === 'staff' ? 'Staff Udreamms' : clientName || 'Cliente'),
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    if (db) {
      const docRef = db.collection('portal_chats').doc(docId);
      const doc = await docRef.get();

      if (doc.exists) {
        const existingData = doc.data() || {};
        const messages = existingData.messages || [];
        messages.push(newMessage);

        const unreadByStaff = sender === 'client' ? (existingData.unreadByStaff || 0) + 1 : 0;
        const unreadByClient = sender === 'staff' ? (existingData.unreadByClient || 0) + 1 : 0;

        await docRef.update({
          clientEmail,
          clientName: clientName || existingData.clientName || clientEmail,
          messages,
          lastMessage: newMessage.text,
          lastSender: sender,
          updatedAt: new Date().toISOString(),
          unreadByStaff,
          unreadByClient,
        });
      } else {
        await docRef.set({
          id: docId,
          clientEmail,
          clientName: clientName || clientEmail,
          messages: [newMessage],
          lastMessage: newMessage.text,
          lastSender: sender,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          unreadByStaff: sender === 'client' ? 1 : 0,
          unreadByClient: sender === 'staff' ? 1 : 0,
        });
      }
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error('Error in chat POST:', error);
    return NextResponse.json({ error: error?.message || 'Error al enviar mensaje' }, { status: 500 });
  }
}
