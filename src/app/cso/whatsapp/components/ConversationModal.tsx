
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Mic, Smile, Check, CheckCheck, Clock, AlertCircle, Maximize, Minimize, X, Pencil, ImageIcon } from 'lucide-react';
import { db, functions } from '@/lib/firebase';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import EmojiPicker from 'emoji-picker-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// --- Interface para Tipado de Mensajes ---
interface Message {
  text: string;
  sender: 'contact' | 'user';
  timestamp: Timestamp;
  status: 'sent' | 'delivered' | 'read' | 'sending' | 'error';
}

const sendWhatsappMessage = httpsCallable(functions, 'sendWhatsappMessage');

const MessageStatus = ({ status }) => {
  // ... (sin cambios)
};

const groupMessagesByDate = (messages: Message[] = []) => {
  if (!Array.isArray(messages)) {
    return [];
  }
  const grouped = messages.reduce((acc, msg) => {
    if (!msg.timestamp?.toDate) return acc;
    const date = msg.timestamp.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as { [key: string]: Message[] });
  return Object.entries(grouped);
};

const ConversationModal = ({ isOpen, onClose, card }) => {
  const [liveCardData, setLiveCardData] = useState(card);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  // --- CORRECCIÓN: Tipado del Ref ---
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    // ... (sin cambios)
  };

  const onEmojiClick = (emojiObject) => {
    setMessageText(prev => prev + emojiObject.emoji);
  };
  
  const formatMessageTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };
  
  const groupedMessages = groupMessagesByDate(liveCardData?.messages as Message[]);
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    const maxHeight = 96;
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
            {/* ... (sin cambios en la estructura JSX) */}
             <div className="flex-grow grid grid-cols-2 overflow-hidden">
              <div className="col-span-1 flex flex-col h-full bg-black">
                <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-1 no-scrollbar">
                  {/* ... (código de mapeo de mensajes) */}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="p-2 bg-black">
                  {/* ... (código del área de texto) */}
                </div>
              </div>

              {/* ... (resto del JSX) */}
            </div>
        </DialogContent>
    </Dialog>
  );
};

export default ConversationModal;
