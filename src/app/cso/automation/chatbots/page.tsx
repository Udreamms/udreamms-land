
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, MessageCircle, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface Bot {
  id: string;
  name: string;
  isActive: boolean;
}

const ChatbotsPage = () => {
  const router = useRouter();
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBots, setUpdatingBots] = useState<string[]>([]);

  useEffect(() => {
    const botsCollection = collection(db, 'chatbots');

    const unsubscribe = onSnapshot(
      botsCollection,
      (querySnapshot) => {
        const botsData = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              name: doc.data().name || 'Bot sin nombre',
              isActive: doc.data().isActive || false,
              ...doc.data(),
            } as Bot)
        );
        setBots(botsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching bots with snapshot: ', error);
        toast.error('No se pudieron cargar los bots.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCreateNewBot = () => {
    router.push('/cso/automation/chatbots/new');
  };

  const handleBotClick = (botId: string) => {
    router.push(`/cso/automation/chatbots/${botId}`);
  };

  const handleToggleBotStatus = async (bot: Bot) => {
    setUpdatingBots((prev) => [...prev, bot.id]);
    try {
      const botRef = doc(db, 'chatbots', bot.id);
      const newStatus = !bot.isActive;
      await updateDoc(botRef, { isActive: newStatus });

      setBots((prevBots) =>
        prevBots.map((b) => (b.id === bot.id ? { ...b, isActive: newStatus } : b))
      );
      toast.success(
        `Bot "${bot.name}" ${newStatus ? 'activado' : 'desactivado'}.`
      );
    } catch (error) {
      console.error('Error updating bot status:', error);
      toast.error('No se pudo actualizar el estado del bot.');
    } finally {
      setUpdatingBots((prev) => prev.filter((id) => id !== bot.id));
    }
  };

  return (
    <div className="p-6 bg-neutral-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mis Chatbots</h1>
        <Button
          onClick={handleCreateNewBot}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" /> Crear Nuevo Bot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bots.length > 0 ? (
            bots.map((bot) => (
              <div
                key={bot.id}
                className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col group"
              >
                <div
                  onClick={() => handleBotClick(bot.id)}
                  className="p-6 cursor-pointer flex-grow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <MessageCircle className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        bot.isActive
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-neutral-600/50 text-neutral-300'
                      }`}
                    >
                      {bot.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white truncate">
                    {bot.name}
                  </h2>
                  <p className="text-sm text-neutral-400 mt-2 font-mono break-all">
                    {bot.id}
                  </p>
                </div>

                <div className="px-6 py-4 bg-neutral-800/50 rounded-b-xl border-t border-neutral-700">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBotStatus(bot);
                    }}
                    className={`w-full font-semibold transition-colors duration-200 flex items-center justify-center ${
                      bot.isActive
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    disabled={updatingBots.includes(bot.id)}
                  >
                    {updatingBots.includes(bot.id) ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Power className="mr-2 h-4 w-4" />
                        {bot.isActive ? 'Desactivar' : 'Activar'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-neutral-800 rounded-xl border border-dashed border-neutral-700">
              <p className="text-neutral-400 text-lg">
                No se encontraron bots.
              </p>
              <p className="text-neutral-500 mt-2">
                ¡Crea uno nuevo para empezar a automatizar!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatbotsPage;
