
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    const fetchBots = async () => {
      setIsLoading(true);
      try {
        const botsCollection = collection(db, 'chatbots');
        const querySnapshot = await getDocs(botsCollection);
        const botsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Bot sin nombre',
          isActive: doc.data().isActive || false, // Asume 'false' si no está definido
          ...doc.data(),
        } as Bot));
        setBots(botsData);
      } catch (error) {
        console.error("Error fetching bots:", error);
        alert("No se pudieron cargar los bots.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleCreateNewBot = () => {
    router.push('/cso/automation/chatbots/new');
  };

  const handleBotClick = (botId: string) => {
    router.push(`/cso/automation/chatbots/${botId}`);
  };

  // Función para manejar el cambio de estado del bot
  const handleToggleBotStatus = async (bot: Bot) => {
    setUpdatingBots(prev => [...prev, bot.id]);
    try {
      const botRef = doc(db, 'chatbots', bot.id);
      const newStatus = !bot.isActive;
      await updateDoc(botRef, { isActive: newStatus });
      // Actualiza el estado local para reflejar el cambio instantáneamente
      setBots(prevBots =>
        prevBots.map(b => (b.id === bot.id ? { ...b, isActive: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating bot status:", error);
      alert("No se pudo actualizar el estado del bot.");
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
