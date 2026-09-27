'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, ChevronDown, CheckCheck, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: string;
  sender: 'client' | 'staff';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface DossierChatFooterProps {
  clientEmail: string;
  clientName?: string;
  onCaseUpdated?: () => void;
}

export const DossierChatFooter: React.FC<DossierChatFooterProps> = ({
  clientEmail,
  clientName = 'el Postulante',
  onCaseUpdated,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHoveredOrFocused, setIsHoveredOrFocused] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoCollapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousMessagesLengthRef = useRef<number>(0);
  const isExpandedRef = useRef<boolean>(isExpanded);
  isExpandedRef.current = isExpanded;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = async () => {
    if (!clientEmail) return;
    try {
      const viewerParam = isExpandedRef.current ? 'staff' : 'preview';
      const res = await fetch(`/api/portal/chat?email=${encodeURIComponent(clientEmail)}&viewer=${viewerParam}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          const newMessages: ChatMessage[] = data.messages;
          
          if (!isExpandedRef.current) {
            // Count new client messages arriving while chat is collapsed
            if (previousMessagesLengthRef.current > 0 && newMessages.length > previousMessagesLengthRef.current) {
              const freshClientMsgs = newMessages
                .slice(previousMessagesLengthRef.current)
                .filter((m) => m.sender === 'client').length;
              if (freshClientMsgs > 0) {
                setUnreadCount((prev) => prev + freshClientMsgs);
              }
            } else if (data.unreadByStaff) {
              setUnreadCount(data.unreadByStaff);
            }
          } else {
            setUnreadCount(0);
          }

          previousMessagesLengthRef.current = newMessages.length;
          setMessages(newMessages);
        }
      }
    } catch (e) {
      console.warn('Could not fetch dossier chat:', e);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 2500);
    return () => clearInterval(interval);
  }, [clientEmail]);

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
      setUnreadCount(0);
      void fetch(`/api/portal/chat?email=${encodeURIComponent(clientEmail)}&viewer=staff`).then(() => {
        onCaseUpdated?.();
      });
    }
  }, [isExpanded, clientEmail]);

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  // Auto-collapse logic:
  // Starts open so the person sees it, and automatically hides after 4 seconds
  // as long as nobody is typing in it.
  useEffect(() => {
    if (!isExpanded) return;

    // If staff is typing or has written text, do not collapse
    if (input.trim().length > 0 || isHoveredOrFocused) {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
        autoCollapseTimerRef.current = null;
      }
      return;
    }

    // Set 4-second auto-collapse timer
    autoCollapseTimerRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 4000);

    return () => {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
    };
  }, [input, isExpanded, isHoveredOrFocused, clientEmail]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || !clientEmail || isSending) return;

    setInput('');
    setIsSending(true);

    const tempMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      sender: 'staff',
      senderName: 'Sarah Davis',
      text: trimmed,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail,
          clientName,
          sender: 'staff',
          senderName: 'Sarah Davis',
          text: trimmed,
        }),
      });
      await fetchChat();
      onCaseUpdated?.();
    } catch (err) {
      console.error('Error sending message from dossier:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (!clientEmail) return null;

  return (
    <div
      onMouseEnter={() => setIsHoveredOrFocused(true)}
      onMouseLeave={() => setIsHoveredOrFocused(false)}
      className="bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col transition-all duration-300 shadow-md select-none"
    >
      {/* Chat Bar Header */}
      <div
        onClick={() => {
          setIsExpanded(!isExpanded);
          setIsHoveredOrFocused(false);
          if (!isExpanded) {
            setUnreadCount(0);
          }
        }}
        className={`px-5 py-2.5 border-b flex items-center justify-between cursor-pointer transition-colors ${
          unreadCount > 0 && !isExpanded
            ? 'bg-red-50 hover:bg-red-100/90 border-red-200'
            : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200/80'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs shrink-0">
            <MessageCircle className="w-4 h-4" />
            {unreadCount > 0 && !isExpanded && (
              <>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
              </>
            )}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-slate-800 truncate">
              Chat en vivo con {clientName || clientEmail}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sincronizado
            </span>

            {/* Notification Badge for new incoming message */}
            {unreadCount > 0 && !isExpanded ? (
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-white bg-red-600 px-2.5 py-0.5 rounded-full shadow-sm animate-bounce shrink-0">
                <Bell className="w-3 h-3 text-white fill-white" />
                <span>{unreadCount === 1 ? '¡1 nuevo mensaje!' : `¡${unreadCount} nuevos mensajes!`}</span>
              </span>
            ) : messages.length > 0 ? (
              <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shrink-0">
                {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            {isExpanded ? 'Ocultar chat' : 'Abrir chat'}
          </span>
          <button
            type="button"
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 transition-colors"
            title={isExpanded ? 'Minimizar chat' : 'Expandir chat'}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Animated Sliding Collapse Container */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden flex flex-col bg-slate-50/70 select-text">
          {/* Messages Scroll Area */}
          <div className="h-44 sm:h-52 md:h-60 p-4 overflow-y-auto space-y-2.5 text-xs sleek-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                <MessageCircle className="w-7 h-7 mb-1.5 text-slate-300" />
                <p className="font-semibold text-slate-600 text-xs">Sin mensajes previos</p>
                <p className="text-[11px] text-slate-400 max-w-sm mt-0.5">
                  Escribe un mensaje para conversar con {clientName} en tiempo real mientras revisas sus datos.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isStaff = msg.sender === 'staff';
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] md:max-w-[70%] p-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap break-words shadow-2xs ${
                        isStaff
                          ? 'bg-blue-600 text-white rounded-tr-xs'
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                      }`}
                    >
                      <p className="text-xs">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 px-1 font-mono">
                      <span>
                        {msg.timestamp
                          ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </span>
                      {isStaff && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder={`Escribe un mensaje a ${clientName || 'el cliente'}... (Enter para enviar)`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsHoveredOrFocused(true)}
              onBlur={() => setIsHoveredOrFocused(false)}
              disabled={isSending}
              className="flex-1 h-9 md:h-10 text-xs bg-slate-50 border border-slate-300 rounded-full px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isSending}
              className="h-9 md:h-10 px-4 md:px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
