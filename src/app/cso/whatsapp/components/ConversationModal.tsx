
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { db, functions } from '@/lib/firebase';
import { doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Loader2, User, Building, Phone, Hash, Pencil, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

// --- Interfaces ---
interface Message {
  content: string;
  sender: 'contact' | 'agent';
  timestamp: Timestamp;
}

interface CardData {
  contactName?: string;
  contactNumber?: string;
  company?: string;
  notes?: string;
  tags?: string[];
  messages?: Message[];
}

// --- Componente Auxiliar (LA SOLUCIÓN AL ERROR) ---
const Field = ({ label, htmlFor, children, description = null }: { label: string, htmlFor: string, children: React.ReactNode, description?: string | null }) => (
    <div className="space-y-2">
        <Label htmlFor={htmlFor} className="text-xs font-semibold text-neutral-400">{label}</Label>
        {description && <p className="text-xs text-neutral-500 -mt-1">{description}</p>}
        {children}
    </div>
);


const sendWhatsappMessage = httpsCallable(functions, 'sendWhatsappMessage');

const groupMessagesByDate = (messages: Message[] = []) => {
  if (!Array.isArray(messages)) return [];
  return messages.reduce((acc, msg) => {
    if (!msg.timestamp?.toDate) return acc;
    const date = msg.timestamp.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {} as { [key: string]: Message[] });
};

const ConversationModal = ({ isOpen, onClose, card }) => {
  const [liveCardData, setLiveCardData] = useState<CardData | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', company: '', tags: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!card?.id || !card?.groupId) {
      setLiveCardData(null);
      return;
    }
    const cardRef = doc(db, 'kanban-groups', card.groupId, 'cards', card.id);
    const unsubscribe = onSnapshot(cardRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as CardData;
        setLiveCardData(data);
        setContactInfo({
          name: data.contactName || '',
          company: data.company || '',
          tags: (data.tags || []).join(', '),
        });
      } else {
        setLiveCardData(null);
      }
    });
    return () => unsubscribe();
  }, [card?.id, card?.groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveCardData?.messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !card || isSending) return;
    setIsSending(true);
    try {
      await sendWhatsappMessage({
        cardId: card.id,
        groupId: card.groupId,
        message: newMessage,
        toNumber: liveCardData?.contactNumber,
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error('Error al enviar el mensaje.');
    } finally {
      setIsSending(false);
    }
  };

  const handleInfoSave = async () => {
    if (!card) return;
    const cardRef = doc(db, 'kanban-groups', card.groupId, 'cards', card.id);
    const updatedData = {
      contactName: contactInfo.name,
      company: contactInfo.company,
      tags: contactInfo.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };
    try {
      await updateDoc(cardRef, updatedData);
      toast.success('Información del contacto actualizada.');
    } catch (error) {
      console.error("Error updating contact info:", error);
      toast.error('No se pudo actualizar la información.');
    }
  };
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const groupedMessages = groupMessagesByDate(liveCardData?.messages);
  const contactName = liveCardData?.contactName || 'Desconocido';
  const contactNumber = liveCardData?.contactNumber || '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-neutral-800">
          <DialogTitle className="text-white">Conversación con {contactName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Columna de Chat (ocupa 2/3) */}
          <div className="col-span-2 flex flex-col bg-neutral-900/50 h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(groupedMessages).map(([date, messages]) => (
                <React.Fragment key={date}>
                  <div className="text-center my-2">
                    <span className="text-xs text-neutral-400 bg-neutral-800 px-2 py-1 rounded-full">{date}</span>
                  </div>
                  {messages.map((msg, index) => (
                    <div key={index} className={cn("flex", msg.sender === 'agent' ? 'justify-end' : 'justify-start')}>
                      <div className={cn(
                        "p-3 rounded-lg max-w-sm",
                        msg.sender === 'agent' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-neutral-700 text-white rounded-bl-none'
                      )}>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-neutral-300/70 text-right mt-1">
                          {msg.timestamp?.toDate().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-neutral-800 bg-neutral-900">
              <div className="relative">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Escribe un mensaje... (Shift+Enter para nueva línea)"
                  className="bg-neutral-800 border-neutral-700 pr-20"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !newMessage.trim()}
                  size="icon"
                  className="absolute right-3 bottom-2.5 h-9 w-12"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Columna de Información del Contacto (ocupa 1/3) */}
          <div className="col-span-1 flex flex-col bg-neutral-950 p-4 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Detalles del Contacto</h3>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4 space-y-4">
                <Field label="Nombre" htmlFor="contact-name">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16}/>
                        <Input id="contact-name" name="name" value={contactInfo.name} onChange={handleInfoChange} className="pl-9"/>
                    </div>
                </Field>
                <Field label="Número de WhatsApp" htmlFor="contact-number">
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16}/>
                        <Input id="contact-number" value={contactNumber} disabled className="pl-9"/>
                    </div>
                </Field>
                <Field label="Empresa" htmlFor="contact-company">
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16}/>
                        <Input id="contact-company" name="company" value={contactInfo.company} onChange={handleInfoChange} className="pl-9"/>
                    </div>
                </Field>
                <Field label="Etiquetas" htmlFor="contact-tags" description="Separadas por comas. Ej: VIP, Lead, Soporte">
                     <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16}/>
                        <Input id="contact-tags" name="tags" value={contactInfo.tags} onChange={handleInfoChange} className="pl-9"/>
                    </div>
                </Field>
                <Button onClick={handleInfoSave} className="w-full"><Save size={16} className="mr-2"/>Guardar Cambios</Button>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                 <Field label="Notas Internas" htmlFor="contact-notes" description="Estas notas no son visibles para el cliente.">
                    <Textarea id="contact-notes" className="min-h-[200px]" placeholder="Añade información relevante sobre el cliente..."/>
                </Field>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationModal;
