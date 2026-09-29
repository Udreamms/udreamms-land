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
  onOpen?: () => void;
  userEmail: string;
  userName?: string;
}

export default function PortalLiveChat({
  isOpen,
  onClose,
  onOpen,
  userEmail,
  userName = 'Cliente'
}: PortalLiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoZoomOpen, setIsPhotoZoomOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (signal?: AbortSignal) => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/portal/chat?email=${encodeURIComponent(userEmail)}&viewer=client`, {
        signal,
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
        if (typeof data.unreadByClient === 'number') {
          setUnreadCount(isOpen ? 0 : data.unreadByClient);
        }
      }
    } catch (err: any) {
      // Ignore normal abort errors when component unmounts or polling cleans up
      if (err?.name === 'AbortError') return;
      // Silently catch background polling fetch errors so they don't break the UI/Next overlay
      console.warn('PortalLiveChat sync notice (will retry):', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for messages: faster when open (3.5s), normal when closed (8s)
  useEffect(() => {
    if (!userEmail) return;

    const controller = new AbortController();
    fetchMessages(controller.signal);

    const interval = setInterval(() => {
      fetchMessages(controller.signal);
    }, isOpen ? 3500 : 8000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
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

  // When chat is closed: show the stylish floating Sarah Davis bubble button
  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
        {/* Floating Greeting Pill on Desktop */}
        <button
          type="button"
          onClick={onOpen}
          className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-800 rounded-full shadow-lg hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
            ¿Dudas sobre tu visa? Chatea con Sarah
          </span>
          <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <MessageCircle className="w-3 h-3" />
          </div>
        </button>

        {/* Floating Avatar Bubble Button */}
        <button
          type="button"
          onClick={onOpen}
          className="relative group p-1 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Abrir chat con Sarah Davis"
        >
          {/* Subtle Ambient Ping Ring */}
          <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping opacity-60 pointer-events-none" />

          <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full overflow-hidden border-2 border-white bg-slate-900 shadow-inner">
            <img
              src="/images/staff-advisor.png"
              alt="Sarah Davis"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Online Indicator Badge */}
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-500/20 shadow-xs" />

          {/* Unread Message Counter Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 border-2 border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 p-3 sm:p-5 pointer-events-none flex justify-end items-end animate-in fade-in duration-200">
      <div className="pointer-events-auto bg-white border border-slate-200/90 shadow-2xl rounded-3xl w-[94vw] sm:w-[460px] h-[82vh] sm:h-[620px] max-h-[720px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 relative">
        
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPhotoZoomOpen(true)}
              className="relative group cursor-pointer focus:outline-none"
              title="Ver foto de perfil de Sarah Davis"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-blue-400/40 group-hover:border-blue-400 group-hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0 bg-slate-800">
                <img
                  src="/images/staff-advisor.png"
                  alt="Sarah Davis"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 
                  onClick={() => setIsPhotoZoomOpen(true)}
                  className="text-sm font-bold text-white leading-tight cursor-pointer hover:text-blue-300 transition-colors"
                  title="Ver perfil"
                >
                  Sarah Davis
                </h4>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Asesora consular Udreamms
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 no-scrollbar [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
          {/* Welcome Message */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-blue-950 space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Canal Directo con Sarah Davis</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Escribe tus preguntas sobre tu formulario consular, documentos o citas. Sarah te responderá directamente aquí.
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
                className={`flex items-end gap-2.5 ${isClient ? 'justify-end' : 'justify-start'}`}
              >
                {!isClient && (
                  <button
                    type="button"
                    onClick={() => setIsPhotoZoomOpen(true)}
                    className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0 mb-4 shadow-2xs bg-slate-100 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    title="Ampliar foto"
                  >
                    <img
                      src="/images/staff-advisor.png"
                      alt="Sarah Davis"
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                )}
                <div className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isClient
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                    {timeStr}
                    {isClient && <CheckCircle2 className="w-2.5 h-2.5 text-blue-500" />}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe un mensaje para Sarah Davis..."
            className="flex-1 h-10 text-xs bg-slate-50 border border-slate-200 rounded-full px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={isSending || !inputText.trim()}
            className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shrink-0 flex items-center justify-center shadow-sm cursor-pointer"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Photo Zoom / Profile Lightbox (Social Media Style) */}
        {isPhotoZoomOpen && (
          <div
            className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-200"
            onClick={() => setIsPhotoZoomOpen(false)}
          >
            <button
              onClick={() => setIsPhotoZoomOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl max-w-[320px] w-full flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-blue-500/40 shadow-xl ring-4 ring-blue-500/20 bg-slate-800">
                <img
                  src="/images/staff-advisor.png"
                  alt="Sarah Davis"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">Sarah Davis</h3>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xs text-slate-300 font-medium">Asesora Consular Udreamms</p>
                
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    En línea • Atención activa
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
