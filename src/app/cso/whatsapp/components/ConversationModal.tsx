
'use client';

import React,
 
{ useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Mic, Smile, Check, CheckCheck, Clock, AlertCircle, Maximize, Minimize, X, Pencil, ImageIcon } from 'lucide-react';
import { db, functions } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import EmojiPicker from 'emoji-picker-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const sendWhatsappMessage = httpsCallable(functions, 'sendWhatsappMessage');

const MessageStatus = ({ status }) => {
  switch (status) {
    case 'read':
      return <CheckCheck className="h-4 w-4 text-blue-400" />;
    case 'delivered':
      return <CheckCheck className="h-4 w-4 text-gray-400" />;
    case 'sent':
      return <Check className="h-4 w-4 text-gray-400" />;
    case 'sending':
      return <Clock className="h-4 w-4 text-gray-400" />;
    case 'error':
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Error al enviar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    default:
      return null;
  }
};

const groupMessagesByDate = (messages = []) => {
  const grouped = messages.reduce((acc, msg) => {
    const date = msg.timestamp?.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});
  return Object.entries(grouped);
};

const ConversationModal = ({ isOpen, onClose, card }) => {
  const [liveCardData, setLiveCardData] = useState(card);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen && card?.groupId && card?.id) {
      const cardRef = doc(db, 'kanban-groups', card.groupId, 'cards', card.id);
      const unsubscribe = onSnapshot(cardRef, (doc) => {
        if (doc.exists()) {
          setLiveCardData({ ...doc.data(), id: doc.id, groupId: card.groupId });
        }
      });
      return () => unsubscribe();
    }
  }, [isOpen, card]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveCardData?.messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !card) return;
    
    setMessageText('');
    setShowEmojiPicker(false);
    
    try {
      await sendWhatsappMessage({
        groupId: card.groupId,
        cardId: card.id,
        text: messageText,
      });
    } catch (err) {
      console.error("Caught sending error on client:", err);
      setError("No se pudo enviar el mensaje."); 
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessageText(prev => prev + emojiObject.emoji);
  };
  
  const formatMessageTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };
  
  const groupedMessages = groupMessagesByDate(liveCardData?.messages);
  
  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    const maxHeight = 96; // ~4 lines
    if (textarea.scrollHeight <= maxHeight) {
        textarea.style.height = `${textarea.scrollHeight}px`;
    } else {
        textarea.style.height = `${maxHeight}px`;
    }
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : name.substring(0, 2).toUpperCase();
  };

  const contactName = liveCardData?.contactName || 'Desconocido';
  const contactNumber = liveCardData?.contactNumber || '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "bg-black border-gray-800 text-white flex flex-col p-0 gap-0 transition-all duration-300",
          isMaximized 
            ? "w-screen h-screen max-w-full inset-0 translate-0 rounded-none" 
            : "max-w-7xl h-[80vh]"
        )}
      >
        <DialogTitle className="sr-only">Conversación con {contactName}</DialogTitle>
        <DialogDescription className="sr-only">
          Ventana de chat para enviar y recibir mensajes, y para ver la información de contacto de {contactName}.
        </DialogDescription>

        {/* Barra Superior de Controles */}
        <div className="flex justify-between items-center p-1 border-b border-gray-800 flex-shrink-0">
            <div className="w-16"></div> {/* Espaciador para centrar el título si lo hubiera */}
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsMaximized(!isMaximized)} className="text-gray-400 hover:text-white rounded-full w-8 h-8">
                    {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white w-8 h-8"><X className="h-4 w-4" /></Button>
                </DialogClose>
            </div>
        </div>

        <div className="flex-grow grid grid-cols-2 overflow-hidden">
          {/* Columna Izquierda (Chat) */}
          <div className="col-span-1 flex flex-col h-full bg-black">
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-1 no-scrollbar">
              {groupedMessages.map(([date, messages]) => (
                <React.Fragment key={date}>
                  <div className="flex justify-center my-2">
                    <span className="bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded-full">{date}</span>
                  </div>
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'contact' ? 'justify-start' : 'justify-end'} my-1`}>
                      <div className="max-w-xs lg:max-w-md">
                        <div className={`p-3 rounded-lg ${msg.sender === 'contact' ? 'bg-gray-700' : 'bg-blue-600'} text-white`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'contact' ? 'justify-start' : 'justify-end'}`}>
                          <p className="text-xs text-gray-400">
                            {formatMessageTimestamp(msg.timestamp)}
                          </p>
                          {msg.sender !== 'contact' && <MessageStatus status={msg.status} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-2 bg-black">
               {showEmojiPicker && (
                <div className="absolute bottom-20 z-10">
                   <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                </div>
              )}
              <div className="bg-gray-900 rounded-full flex items-center px-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full">
                  <Plus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <Smile className="h-5 w-5" />
                </Button>
                <Textarea
                  ref={textareaRef}
                  placeholder="Escribe un mensaje..."
                  className="bg-transparent border-none text-white flex-1 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 self-center no-scrollbar"
                  rows={1}
                  value={messageText}
                  onChange={(e) => {
                      setMessageText(e.target.value);
                      handleInput(e);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full">
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
            </div>
          </div>

          {/* Columna Derecha (Información del Contacto) */}
          <div className="col-span-1 border-l border-gray-800 flex flex-col bg-black overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center p-3">
                <p className="text-sm font-semibold">Información del Contacto</p>
                <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white"><Pencil className="h-5 w-5" /></Button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center text-center p-4">
                <Avatar className="w-20 h-20 mb-3">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=random`} />
                    <AvatarFallback className="text-2xl bg-gray-700">{getInitials(contactName)}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-bold">{contactName}</h2>
                <p className="text-sm text-gray-400">{contactNumber}</p>
            </div>

            <Separator className="bg-gray-800" />

            {/* About Section */}
            <div className="p-4 space-y-1">
                <p className="text-xs text-gray-400">Sobre este contacto</p>
                <p className="text-white text-sm">Aquí puedes añadir una descripción o notas sobre el contacto.</p>
            </div>

            <Separator className="bg-gray-800" />

            {/* Media Section */}
            <div className="p-4">
                <div className="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-900 p-2 rounded-md">
                    <div className="flex items-center gap-4">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                        <p>Media, links y docs</p>
                    </div>
                    <span className="text-gray-400">0</span>
                </div>
            </div>

            <Separator className="bg-gray-800" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationModal;
