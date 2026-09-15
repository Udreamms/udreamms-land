'use client';

import React from 'react';
import { RefreshCw, X, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StudentCase, getStatusLabel } from '../types';

interface StaffChatDrawerProps {
  activeChatStudent: StudentCase | null;
  onClose: () => void;
  chatMessages: any[];
  chatInput: string;
  setChatInput: (val: string) => void;
  isSendingChat: boolean;
  onSendChat: (e?: React.FormEvent) => void;
  onRefreshChat: () => void;
}

export const StaffChatDrawer: React.FC<StaffChatDrawerProps> = ({
  activeChatStudent,
  onClose,
  chatMessages,
  chatInput,
  setChatInput,
  isSendingChat,
  onSendChat,
  onRefreshChat,
}) => {
  if (!activeChatStudent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-end sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md h-[85vh] sm:h-[620px] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs">
              {activeChatStudent.photoUrl ? (
                <img
                  src={activeChatStudent.photoUrl}
                  alt=""
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                (activeChatStudent.name || 'P')[0]?.toUpperCase()
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white truncate">
                  {activeChatStudent.name || 'Postulante'}
                </h3>
                <span className="px-1.5 py-0.5 rounded-md bg-blue-500/30 text-blue-300 text-[9px] font-bold uppercase">
                  {activeChatStudent.visaType}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                {activeChatStudent.email || 'Chat directo en tiempo real'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onRefreshChat}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refrescar mensajes"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Cerrar chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Info Bar */}
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-950 font-medium">
          <span className="text-[11px] font-bold text-blue-700">Etapa actual:</span>
          <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
            {getStatusLabel(activeChatStudent.status)}
          </span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Comunícate directamente con el cliente
              </p>
              <p className="text-[11px] text-slate-500 max-w-[240px]">
                Envía un mensaje para responder preguntas sobre su formulario DS-160, documentos o cita.
              </p>
            </div>
          ) : (
            chatMessages.map((msg, index) => {
              const isStaff = msg.sender === 'staff';
              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-500">
                      {isStaff ? 'Tú (Staff Udreamms)' : msg.senderName || activeChatStudent.name || 'Cliente'}
                    </span>
                    {msg.timestamp && (
                      <span className="text-[9px] text-slate-400">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-wrap break-words ${
                      isStaff
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-blue-500/10'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={onSendChat}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <Input
            placeholder="Escribe un mensaje al cliente..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="h-10 text-xs bg-slate-50 border-slate-200 rounded-full focus:border-blue-600 focus:bg-white"
            disabled={isSendingChat}
          />
          <Button
            type="submit"
            disabled={!chatInput.trim() || isSendingChat}
            className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 shrink-0 flex items-center justify-center cursor-pointer transition-all"
            title="Enviar mensaje"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
};
