
'use client';

import React,
 
{ useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send, Smile, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { db, functions } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import EmojiPicker from 'emoji-picker-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

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
    
    // UI becomes responsive immediately
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
      // The function itself handles updating the message to 'error' status,
      // but we can still show a generic error if needed.
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-gray-900 border-gray-700 text-white flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-gray-700">
          <DialogTitle>{liveCardData?.contactName || 'Desconocido'}</DialogTitle>
          <DialogDescription>{liveCardData?.contactNumber}</DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow grid grid-cols-3 overflow-hidden">
          <div className="col-span-1 border-r border-gray-700 p-4 flex flex-col gap-4 bg-gray-900/50 overflow-y-auto">
             {/* ... */}
          </div>

          <div className="col-span-2 flex flex-col h-full bg-gray-800/40">
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-1">
              {groupedMessages.map(([date, messages]) => (
                <React.Fragment key={date}>
                  <div className="flex justify-center my-2">
                    <span className="bg-gray-700 text-xs text-gray-300 px-2 py-1 rounded-full">{date}</span>
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
            
            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
               {showEmojiPicker && (
                <div className="absolute bottom-24 z-10">
                   <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                </div>
              )}
              <div className="relative">
                <Textarea
                  placeholder="Escribe un mensaje..."
                  className="bg-gray-700 border-gray-600 text-white pr-32"
                  rows={2}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex gap-1">
                   <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="default" size="icon" onClick={handleSendMessage}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationModal;
