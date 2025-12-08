
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'; // Import onSnapshot
import { db } from '@/lib/firebase';
import { toast } from 'sonner'; // Import toast for notifications

interface Bot {
  id: string;
  name: string;
  isActive: boolean; // Propiedad para rastrear el estado del bot
}

const ChatbotsPage = () => {
  const router = useRouter();
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBots, setUpdatingBots] = useState<string[]>([]); // Para mostrar feedback de carga por bot

  useEffect(() => {
    const botsCollection = collection(db, 'chatbots');

    // Set up the real-time listener
    const unsubscribe = onSnapshot(botsCollection, (querySnapshot) => {
      const botsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Bot sin nombre',
        isActive: doc.data().isActive || false,
        ...doc.data(),
      } as Bot));
      setBots(botsData);
      setIsLoading(false); // Set loading to false after the first data load
    }, (error) => {
      console.error("Error fetching bots with snapshot: ", error);
      toast.error("No se pudieron cargar los bots.");
      setIsLoading(false);
    });

    // Cleanup: unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once

  const handleCreateNewBot = () => {
    router.push('/cso/automation/chatbots/new');
  };

  const handleBotClick = (botId: string) => {
    router.push(`/cso/automation/chatbots/${botId}`);
  };

  // Función para manejar el cambio de estado del bot (actualizada con toasts)
  const handleToggleBotStatus = async (bot: Bot) => {
    setUpdatingBots(prev => [...prev, bot.id]);
    try {
      const botRef = doc(db, 'chatbots', bot.id);
      const newStatus = !bot.isActive;
      await updateDoc(botRef, { isActive: newStatus });
      
      // The optimistic update below is technically not needed due to the real-time listener,
      // but it makes the UI feel even more instantaneous.
      setBots(prevBots =>
        prevBots.map(b => (b.id === bot.id ? { ...b, isActive: newStatus } : b))
      );
      toast.success(`Bot "${bot.name}" ${newStatus ? 'activado' : 'desactivado'}.`);

    } catch (error) {
      console.error("Error updating bot status:", error);
      toast.error("No se pudo actualizar el estado del bot.");
    } finally {
      setUpdatingBots(prev => prev.filter(id => id !== bot.id));
    }
  };

  return (
    <div className="p-6 bg-neutral-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chatbots</h1>
        <Button onClick={handleCreateNewBot} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Bot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.length > 0 ? (
            bots.map(bot => (
              <div
                key={bot.id}
                className="border border-neutral-700 rounded-lg p-4 flex flex-col justify-between transition-colors duration-200"
              >
                <div 
                  onClick={() => handleBotClick(bot.id)}
                  className="cursor-pointer"
                >
                  <h2 className="text-lg font-semibold">{bot.name}</h2>
                  <p className="text-sm text-neutral-400 mt-2">
                    ID: {bot.id}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que al hacer clic se navegue a la página del bot
                      handleToggleBotStatus(bot);
                    }}
                    className={`w-full ${bot.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-600 hover:bg-neutral-700'}`}
                    disabled={updatingBots.includes(bot.id)} // Deshabilita el botón mientras se actualiza
                  >
                    {updatingBots.includes(bot.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      bot.isActive ? 'Activado' : 'Desactivado'
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-400 col-span-full">No se encontraron bots. ¡Crea uno nuevo para empezar!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotsPage;
