
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db, functions } from '@/lib/firebase';
import { doc, onSnapshot, Timestamp, updateDoc, DocumentData } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { 
    Send, Loader2, User, Building, Phone, Hash, Save, Mail, Globe, MapPin, 
    PlusCircle, Trash2, GripVertical, Paperclip, Smile, FileText, Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '@/lib/hooks/useFileUpload';

// --- Interfaces ---
interface Message {
  text: string;
  sender: 'user' | 'agent';
  timestamp: Timestamp;
}
interface CustomField { [key: string]: string; }
interface CardData extends DocumentData {
  contactName?: string;
  contactNumber?: string;
  company?: string;
  email?: string;
  website?: string;
  address?: string;
  tags?: string[];
  messages?: Message[];
  customFields?: CustomField;
}

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

const EditableField = ({ icon, name, value, onChange, placeholder }) => (
    <div className="relative flex items-center">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</div>
        <Input 
            id={`contact-${name}`} name={name} value={value} onChange={onChange}
            placeholder={placeholder} className="pl-9 bg-neutral-800/60 border-neutral-700 focus:bg-neutral-800"
        />
    </div>
);

const ConversationModal = ({ isOpen, onClose, card }) => {
  const [liveCardData, setLiveCardData] = useState<CardData | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contactInfo, setContactInfo] = useState<Partial<CardData>>({});
  const [customFields, setCustomFields] = useState<CustomField>({});
  const [newFieldName, setNewFieldName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { uploading, progress, uploadFile } = useFileUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
      if (!liveCardData || !card) {
          toast.error("No se puede subir un archivo sin una conversación activa.");
          return;
      }
      const file = acceptedFiles[0];
      if (file) {
          uploadFile(file, {
              cardId: card.id,
              groupId: card.groupId,
              toNumber: liveCardData.contactNumber!,
          });
      }
  }, [liveCardData, card, uploadFile]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true,
  });

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
          contactName: data.contactName || '', company: data.company || '', email: data.email || '',
          website: data.website || '', address: data.address || '', tags: data.tags || [],
        });
        setCustomFields(data.customFields || {});
      } else {
        setLiveCardData(null);
      }
    });
    return () => unsubscribe();
  }, [card?.id, card?.groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [liveCardData?.messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !card || isSending) return;
    setIsSending(true);
    const promise = sendWhatsappMessage({
        cardId: card.id, groupId: card.groupId, message: newMessage, toNumber: liveCardData?.contactNumber,
    });
    toast.promise(promise, {
        loading: 'Enviando mensaje...',
        success: () => { setNewMessage(''); return 'Mensaje enviado.'; },
        error: 'Error al enviar el mensaje.',
        finally: () => setIsSending(false)
    });
  };

  const handleInfoSave = async () => {
    if (!card) return;
    const cardRef = doc(db, 'kanban-groups', card.groupId, 'cards', card.id);
    const updatedData = { ...contactInfo, customFields };
    toast.promise(updateDoc(cardRef, updatedData), {
        loading: 'Guardando información...',
        success: 'Información del contacto actualizada.',
        error: 'No se pudo actualizar la información.',
    });
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    const textArea = textareaRef.current;
    if (textArea) {
        const start = textArea.selectionStart;
        const end = textArea.selectionEnd;
        setNewMessage(prev => prev.substring(0, start) + emojiObject.emoji + prev.substring(end));
        setTimeout(() => { textArea.focus(); textArea.selectionStart = textArea.selectionEnd = start + emojiObject.emoji.length; }, 0);
    }
  };
  
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => setContactInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCustomFieldChange = (key: string, value: string) => setCustomFields(prev => ({ ...prev, [key]: value }));
  const addCustomField = () => newFieldName && !customFields.hasOwnProperty(newFieldName) ? setCustomFields(prev => ({ ...prev, [newFieldName]: '' })) || setNewFieldName('') : toast.warning('El nombre del campo no puede estar vacío o ya existe.');
  const deleteCustomField = (key: string) => { const { [key]: _, ...rest } = customFields; setCustomFields(rest); };
  const groupedMessages = groupMessagesByDate(liveCardData?.messages);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] flex flex-col p-0 bg-neutral-900 border-neutral-800">
        <DialogTitle className="sr-only">Conversation with {liveCardData?.contactName || 'contact'}</DialogTitle>
        <div className="grid grid-cols-12 flex-1 h-full">
          <div className="col-span-8 flex flex-col border-r border-neutral-800 h-full" {...getRootProps()}>
            <input {...getInputProps()} />
            <header className="flex items-center p-3 border-b border-neutral-800 bg-neutral-800/80 backdrop-blur-sm flex-shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${liveCardData?.contactName || 'C'}&background=2563eb&color=fff&bold=true`} alt="avatar" className="w-10 h-10 rounded-full mr-4"/>
                <div>
                    <h2 className="text-lg font-bold text-white">{liveCardData?.contactName || 'Desconocido'}</h2>
                    <p className="text-sm text-neutral-400">{liveCardData?.contactNumber || ''}</p>
                </div>
            </header>
            <div className="relative flex-1">
                {uploading && <Progress value={progress} className="absolute top-0 left-0 w-full h-1 z-20" />}
                {isDragActive && <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center text-white font-bold z-10 backdrop-blur-sm"><p>Suelta el archivo para enviarlo</p></div>}
                <div className="absolute inset-0 overflow-y-auto p-6 space-y-2 bg-black/30 bg-blend-multiply bg-[url('/whatsapp-bg.png')]">
                  {Object.entries(groupedMessages).map(([date, messages]) => (
                    <React.Fragment key={date}>
                      <div className="flex justify-center my-3"><span className="text-xs text-neutral-300 bg-neutral-800/90 px-3 py-1 rounded-full shadow-lg">{date}</span></div>
                      {messages.map((msg, index) => (
                        <div key={index} className={cn("flex items-end gap-2", msg.sender === 'agent' ? 'justify-end' : 'justify-start')}>
                          <div className={cn( "px-3 py-2 rounded-xl max-w-lg shadow-md", msg.sender === 'agent' ? 'bg-[#005c4b] text-white rounded-br-none' : 'bg-neutral-700 text-white rounded-bl-none' )}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-xs text-neutral-300/60 text-right mt-1">{msg.timestamp?.toDate().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
            </div>
            <footer className="p-3 border-t border-neutral-800 bg-neutral-800/50 flex-shrink-0">
              <div className="flex items-center bg-neutral-700/80 rounded-lg p-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white"><Paperclip size={20}/></Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-auto bg-neutral-800 border-neutral-700 text-white p-1 space-y-1">
                        <Button variant="ghost" className="w-full justify-start text-sm" onClick={open}><ImageIcon className="mr-2 h-4 w-4 text-yellow-400"/> Foto o Video</Button>
                        <Button variant="ghost" className="w-full justify-start text-sm" onClick={open}><FileText className="mr-2 h-4 w-4 text-blue-400"/> Documento</Button>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white"><Smile size={20}/></Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="p-0 border-none bg-transparent w-auto">
                        <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                    </PopoverContent>
                </Popover>
                <Textarea ref={textareaRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Escribe un mensaje aquí..." className="bg-transparent border-none focus:ring-0 focus-visible:ring-0 resize-none text-base h-auto" rows={1} />
                <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()} size="icon" className="h-9 w-12 bg-blue-600 hover:bg-blue-700 rounded-lg">
                  {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </footer>
          </div>
          <div className="col-span-4 flex flex-col bg-neutral-950 p-4 overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-white">Información del Contacto</h3>
            <div className="space-y-4">
                <EditableField icon={<User size={16}/>} name="contactName" value={contactInfo.contactName || ''} onChange={handleInfoChange} placeholder="Nombre completo" />
                <EditableField icon={<Phone size={16}/>} name="contactNumber" value={liveCardData?.contactNumber || ''} onChange={()=>{}} placeholder="" />
                <EditableField icon={<Building size={16}/>} name="company" value={contactInfo.company || ''} onChange={handleInfoChange} placeholder="Nombre de la empresa" />
                <EditableField icon={<Mail size={16}/>} name="email" value={contactInfo.email || ''} onChange={handleInfoChange} placeholder="correo@ejemplo.com" />
                <EditableField icon={<Globe size={16}/>} name="website" value={contactInfo.website || ''} onChange={handleInfoChange} placeholder="https://ejemplo.com" />
                <EditableField icon={<MapPin size={16}/>} name="address" value={contactInfo.address || ''} onChange={handleInfoChange} placeholder="Ciudad, País" />
                <EditableField icon={<Hash size={16}/>} name="tags" value={(contactInfo.tags || []).join(', ')} onChange={(e) => setContactInfo(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim())}))} placeholder="VIP, Lead, Soporte" />
            </div>
            <hr className="my-6 border-neutral-700" />
            <h4 className="text-lg font-bold mb-4 text-white">Campos Personalizados</h4>
            <div className="space-y-3">
                {Object.entries(customFields).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                        <GripVertical size={16} className="text-neutral-500 cursor-move"/>
                        <Input value={key} disabled className="w-1/3 bg-neutral-800 border-neutral-700 font-semibold text-xs"/>
                        <Input value={value} onChange={(e) => handleCustomFieldChange(key, e.target.value)} placeholder="Valor..." className="flex-grow bg-neutral-800/60 border-neutral-700 focus:bg-neutral-800"/>
                        <Button variant="ghost" size="icon" onClick={() => deleteCustomField(key)} className="text-neutral-500 hover:text-red-500"><Trash2 size={16}/></Button>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-4">
                <Input value={newFieldName} onChange={(e) => setNewFieldName(e.target.value)} placeholder="Nombre del nuevo campo..."/>
                <Button onClick={addCustomField} size="sm" variant="outline"><PlusCircle size={16} className="mr-2"/>Añadir</Button>
            </div>
            <div className="mt-auto pt-6">
                <Button onClick={handleInfoSave} className="w-full bg-blue-600 hover:bg-blue-700"><Save size={16} className="mr-2"/>Guardar Toda la Información</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationModal;
