'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  User, 
  ShieldCheck, 
  Headphones, 
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  sender: 'client' | 'staff';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface PortalLiveChatProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName?: string;
}

export default function PortalLiveChat({
  isOpen,
  onClose,
  userEmail,
  userName = 'Cliente'
}: PortalLiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/portal/chat?email=${encodeURIComponent(userEmail)}&viewer=client`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when opened
  useEffect(() => {
    if (isOpen && userEmail) {
      setIsLoading(true);
      fetchMessages();
      const interval = setInterval(fetchMessages, 3500);
      return () => clearInterval(interval);
    }
  }, [isOpen, userEmail]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !userEmail || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    const tempMessage: ChatMessage = {
      id: `temp_${Date.now()}`,
      sender: 'client',
      senderName: userName,
      text: messageText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: userEmail,
          clientName: userName,
          sender: 'client',
          senderName: userName,
          text: messageText,
        }),
      });

      if (!res.ok) {
        toast.error('No se pudo enviar el mensaje.');
      } else {
        await fetchMessages();
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Error al enviar mensaje');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-end sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md h-[85vh] sm:h-[620px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-right-5 duration-300">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white leading-tight">
                  Staff Udreamms
                </h4>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Atención consular personalizada
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
          {/* Welcome Message */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-blue-950 space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Canal Directo con tu Asesor</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Escribe tus preguntas sobre tu formulario consular, documentos o citas. Nuestro equipo te responderá directamente aquí.
            </p>
          </div>

          {messages.length === 0 && !isLoading && (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <MessageCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No hay mensajes previos. Escribe tu primera consulta abajo.</p>
            </div>
          )}

          {messages.map((msg) => {
            const isClient = msg.sender === 'client';
            const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    isClient
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {!isClient && (
                    <span className="text-[10px] font-bold text-blue-600 block mb-1">
                      Staff Udreamms
                    </span>
                  )}
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                  {timeStr}
                  {isClient && <CheckCircle2 className="w-2.5 h-2.5 text-blue-500" />}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje para el staff..."
            className="h-10 text-xs bg-slate-50 border-slate-200 rounded-full px-4 focus:bg-white focus:border-blue-600"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex items-center justify-center shadow-sm"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

      </div>
    </div>
  );
}
