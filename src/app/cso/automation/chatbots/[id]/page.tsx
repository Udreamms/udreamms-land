
// src/app/cso/automation/chatbots/[id]/page.tsx
'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import ChatbotCanvasWithProvider, { ChatbotCanvasRef } from '@/components/ChatbotCanvas';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2, Dot } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';
import { Node, Edge, useNodesState, useEdgesState, OnNodesChange, OnEdgesChange, addEdge, Connection } from 'reactflow';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
      setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2.5 } }, eds));
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
        event.returnValue = '';
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
      setHasUnsavedChanges(false);
    };
    loadBotData();
  }, [botId, router, setNodes, setEdges]);

  const handleSave = async () => {
    if (!botName.trim()) {
        toast.error("El nombre del bot no puede estar vacío.");
        return;
    }
    setIsSaving(true);
    const promise = () => new Promise(async (resolve, reject) => {
        const flowData = { nodes, edges };
        const botData = { name: botName, flow: flowData, updatedAt: new Date() };
        try {
          if (botId === 'new') {
            const docRef = await addDoc(collection(db, 'chatbots'), botData);
            setHasUnsavedChanges(false);
            router.push(`/cso/automation/chatbots/${docRef.id}`);
            resolve(docRef);
          } else if (botId) {
            const botDocRef = doc(db, 'chatbots', botId);
            await setDoc(botDocRef, botData, { merge: true });
            setHasUnsavedChanges(false);
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
        <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
            <Loader2 className="h-8 w-8 animate-spin" /> <p className="ml-4">Cargando editor...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden">
      <header className="flex items-center justify-between p-3 border-b border-neutral-800 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={handleGoBack} className="h-9 w-9"><ArrowLeft className="h-4 w-4" /></Button>
          <div className="w-px h-6 bg-neutral-700" />
          <div className="relative">
            <input 
                type="text" 
                value={botName} 
                onChange={handleNameChange} 
                className="text-lg font-bold bg-transparent focus:outline-none hover:bg-neutral-800/80 rounded px-2 py-1 transition-colors" 
                placeholder="Nombre del Chatbot"
            />
            <Dot className={cn("absolute -right-1 top-1 text-blue-500 transition-opacity duration-300", hasUnsavedChanges ? "opacity-100 animate-pulse" : "opacity-0")} size={24} />
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <span className={cn("text-xs text-neutral-400 transition-opacity duration-300", hasUnsavedChanges ? "opacity-100" : "opacity-0")}>
                Cambios sin guardar
            </span>
            <Button onClick={handleSave} disabled={isSaving || !hasUnsavedChanges} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
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
