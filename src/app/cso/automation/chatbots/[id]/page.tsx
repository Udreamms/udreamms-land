
// src/app/cso/automation/chatbots/[id]/page.tsx
'use client';
import React, { useRef, useEffect, useState } from 'react';
import ChatbotCanvasWithProvider, { ChatbotCanvasRef } from '@/components/ChatbotCanvas';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, FolderOpen, Loader2 } from 'lucide-react'; // Changed Upload to FolderOpen
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';

const ChatbotEditorPage = () => {
  const params = useParams();
  const router = useRouter();
  const [botId, setBotId] = useState(Array.isArray(params.id) ? params.id[0] : params.id);
  const [botName, setBotName] = useState('Nuevo Chatbot');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<ChatbotCanvasRef>(null);

  useEffect(() => {
    const loadBotData = async () => {
      if (botId && botId !== 'new') {
        setIsLoading(true);
        const botDocRef = doc(db, 'chatbots', botId);
        const botDoc = await getDoc(botDocRef);
        if (botDoc.exists()) {
          const data = botDoc.data();
          setBotName(data.name || `Editando Bot: ${botId}`);
          canvasRef.current?.setFlowData(data.flow);
        } else {
          console.error("No such bot found!");
          router.push('/cso/automation/chatbots');
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    loadBotData();
  }, [botId, router]);

  const handleSave = async () => {
    if (!canvasRef.current) return;
    setIsSaving(true);

    const flowData = canvasRef.current.getFlowData();
    const botData = {
      name: botName,
      flow: flowData,
      updatedAt: new Date(),
    };

    try {
      if (botId === 'new') {
        const docRef = await addDoc(collection(db, 'chatbots'), botData);
        alert('Bot creado y guardado!');
        router.replace(`/cso/automation/chatbots/${docRef.id}`);
        setBotId(docRef.id);
      } else {
        const botDocRef = doc(db, 'chatbots', botId);
        await setDoc(botDocRef, botData, { merge: true });
        alert('Bot guardado!');
      }
    } catch (error) {
      console.error("Error saving bot:", error);
      alert('Error al guardar el bot.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-4">Cargando bot...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <header className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-950/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/cso/automation/chatbots')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <input 
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="text-lg font-bold bg-transparent focus:outline-none focus:bg-neutral-800 rounded px-2"
          />
        </div>
        <div className="flex space-x-2">
            <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
            {/* The load button was removed in a previous step, but if you wanted to add it back, it would be here */}
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatbotCanvasWithProvider ref={canvasRef} botId={botId} />
      </div>
    </div>
  );
};

export default ChatbotEditorPage;
