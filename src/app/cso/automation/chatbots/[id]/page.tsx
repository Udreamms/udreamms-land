
// src/app/cso/automation/chatbots/[id]/page.tsx
'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import ChatbotCanvasWithProvider, { ChatbotCanvasRef } from '@/components/ChatbotCanvas';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { Node, Edge, useNodesState, useEdgesState, OnNodesChange, OnEdgesChange, addEdge, Connection } from 'reactflow';
import { toast } from 'sonner';

const ChatbotEditorPage = () => {
  const params = useParams();
  const router = useRouter();
  const [botId, setBotId] = useState(Array.isArray(params.id) ? params.id[0] : params.id);
  const [botName, setBotName] = useState('Nuevo Chatbot');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [nodes, setNodes, onNodesChangeOriginal] = useNodesState([]);
  const [edges, setEdges, onEdgesChangeOriginal] = useEdgesState([]);
  
  const canvasRef = useRef<ChatbotCanvasRef>(null);

  // --- Wrappers to detect changes ---
  const onNodesChange: OnNodesChange = (changes) => {
    onNodesChangeOriginal(changes);
    setHasUnsavedChanges(true);
  };

  const onEdgesChange: OnEdgesChange = (changes) => {
    onEdgesChangeOriginal(changes);
    setHasUnsavedChanges(true);
  };

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges],
  );
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotName(e.target.value);
    setHasUnsavedChanges(true);
  }

  // --- Effect to handle unsaved changes before leaving ---
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // Required for modern browsers
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const loadBotData = async () => {
      if (botId && botId !== 'new') {
        setIsLoading(true);
        const botDocRef = doc(db, 'chatbots', botId);
        const botDoc = await getDoc(botDocRef);
        if (botDoc.exists()) {
          const data = botDoc.data();
          setBotName(data.name || `Editando Bot: ${botId}`);
          const flow = data.flow || { nodes: [], edges: [] };
          setNodes(flow.nodes);
          setEdges(flow.edges);
        } else {
          toast.error("Error: No se encontró el bot.");
          router.push('/cso/automation/chatbots');
        }
        setIsLoading(false);
      } else {
        setNodes([{ id: '1', type: 'startNode', position: { x: 350, y: 25 }, data: { label: 'Inicio' } }]);
        setEdges([]);
        setIsLoading(false);
      }
      setHasUnsavedChanges(false); // Reset on initial load
    };
    loadBotData();
  }, [botId, router, setNodes, setEdges]);

  const handleSave = async () => {
    setIsSaving(true);
    const promise = () => new Promise(async (resolve, reject) => {
        const flowData = { nodes, edges };
        const botData = { name: botName, flow: flowData, updatedAt: new Date() };
        try {
          if (botId === 'new') {
            const docRef = await addDoc(collection(db, 'chatbots'), botData);
            setHasUnsavedChanges(false); // Reset before navigation
            router.push(`/cso/automation/chatbots/${docRef.id}`);
            // No need to setBotId here, the page will reload with the new ID
            resolve(docRef);
          } else if (botId) {
            const botDocRef = doc(db, 'chatbots', botId);
            await setDoc(botDocRef, botData, { merge: true });
            setHasUnsavedChanges(false); // Reset on successful save
            resolve(botDocRef);
          } else {
            reject(new Error("No se puede guardar el bot sin una ID válida."));
          }
        } catch (error) {
          console.error("Error saving bot:", error);
          reject(error);
        }
    });

    toast.promise(promise(), {
      loading: 'Guardando bot...',
      success: '¡Bot guardado exitosamente!',
      error: 'Error al guardar el bot.',
      finally: () => setIsSaving(false)
    });
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?')) {
        router.push('/cso/automation/chatbots');
      }
    } else {
      router.push('/cso/automation/chatbots');
    }
  };


  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-neutral-900 text-white">
            <Loader2 className="h-8 w-8 animate-spin" /> <p className="ml-4">Cargando bot...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <header className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-950/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack}><ArrowLeft className="h-5 w-5" /></Button>
          <input type="text" value={botName} onChange={handleNameChange} className="text-lg font-bold bg-transparent focus:outline-none focus:bg-neutral-800 rounded px-2" />
        </div>
        <div className="flex items-center space-x-2">
            <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatbotCanvasWithProvider 
            ref={canvasRef} 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            setNodes={setNodes}
            setEdges={setEdges}
        />
      </div>
    </div>
  );
};

export default ChatbotEditorPage;
