import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { db, functions } from '@/lib/firebase';
import { doc, onSnapshot, getDoc, updateDoc, query, collection, where, getDocs, serverTimestamp, Timestamp, arrayUnion } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { toast } from 'sonner';
import { useFileUpload } from '@/lib/hooks/useFileUpload';
import { useDropzone } from 'react-dropzone';
import { CardData, Message, Note, CheckIn, ConversationModalProps } from '../types';
import { COLUMN_CHECKLISTS } from '../ConversationChecklistSystem';
import { groupMessagesByDate } from '../utils';
import { socialPlatforms } from '../constants';

const sendWhatsappMessage = httpsCallable(functions, 'sendWhatsappMessage');
const moveCardCallable = httpsCallable(functions, 'moveCard');

export const useConversationLogic = ({ isOpen, onClose, card, groupName, groups = [] }: ConversationModalProps) => {
    const [liveCardData, setLiveCardData] = useState<CardData | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [contactInfo, setContactInfo] = useState<Partial<CardData>>({});
    const [activeTab, setActiveTab] = useState<'perfil' | 'pagos' | 'notas' | 'historial' | null>(null);
    const [activePlatform, setActivePlatform] = useState('WhatsApp');
    const [isEditing, setIsEditing] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string; name: string; type: string; } | null>(null);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [isAddingCheckIn, setIsAddingCheckIn] = useState(false);
    const [newCheckIn, setNewCheckIn] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingCheckInId, setEditingCheckInId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [isAddingPayment, setIsAddingPayment] = useState(false);
    const [newPayment, setNewPayment] = useState({
        type: 'visa' as const,
        last4: '',
        expiry: '',
        brand: ''
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { uploading, progress, uploadFile } = useFileUpload();

    // Memos
    const currentGroupName = useMemo(() => {
        if (!liveCardData?.groupId || !groups.length) return groupName || 'default';
        const currentGroup = groups.find(g => g.id === liveCardData.groupId);
        return currentGroup?.name || groupName || 'default';
    }, [liveCardData?.groupId, groups, groupName]);

    const dynamicItems = liveCardData?.checkIns || [];
    const completedDynamicItems = dynamicItems.filter(item => item.completed);
    const totalItems = dynamicItems.length;
    const totalCompleted = completedDynamicItems.length;
    const checklistProgress = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

    const nextGroup = useMemo(() => {
        if (!groups.length || !card?.groupId) return null;
        const currentIndex = groups.findIndex(g => g.id === card.groupId);
        if (currentIndex !== -1 && currentIndex < groups.length - 1) {
            return groups[currentIndex + 1];
        }
        return null;
    }, [groups, card?.groupId]);

    // Effects
    useEffect(() => {
        if (!liveCardData) return;
        const hasItems = liveCardData.checkIns && liveCardData.checkIns.length > 0;
        const allCompleted = hasItems && liveCardData?.checkIns?.every(i => i.completed);

        if (allCompleted && nextGroup && card?.id && card?.groupId) {
            const triggerMove = async () => {
                try {
                    const movePromise = moveCardCallable({
                        sourceGroupId: card.groupId,
                        destGroupId: nextGroup.id,
                        cardId: card.id
                    });

                    const compositePromise = movePromise.then(async () => {
                        await updateDoc(doc(db, 'kanban-groups', nextGroup.id, 'cards', card.id), {
                            checkIns: [],
                            checklistStatus: {}
                        });
                        return "Moved and Cleared";
                    });

                    toast.promise(compositePromise, {
                        loading: 'Hito alcanzado: Moviendo a la siguiente etapa...',
                        success: `¡Felicidades! Cliente movido a ${nextGroup.name}`,
                        error: 'No se pudo mover automáticamente'
                    });

                    await compositePromise;
                } catch (error) {
                    console.error("Auto-move error:", error);
                }
            };

            const timer = setTimeout(triggerMove, 1500);
            return () => clearTimeout(timer);
        }
    }, [checklistProgress, nextGroup, card?.id, card?.groupId, liveCardData]);

    useEffect(() => {
        if (!card || !card.id) {
            setLiveCardData(null);
            return;
        }

        let unsubscribe: (() => void) | null = null;
        let internalGroups = groups;

        const initLogic = async () => {
            try {
                // If groups are not provided (e.g., from global contacts page), fetch them
                if (internalGroups.length === 0) {
                    const groupsSnap = await getDocs(collection(db, 'kanban-groups'));
                    internalGroups = groupsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                }

                const findCardInAllGroups = async () => {
                    for (const group of internalGroups) {
                        const cardRef = doc(db, 'kanban-groups', group.id, 'cards', card.id);
                        const cardSnap = await getDoc(cardRef);
                        if (cardSnap.exists()) {
                            if (unsubscribe) unsubscribe();
                            unsubscribe = onSnapshot(cardRef, (docSnap) => {
                                if (docSnap.exists()) {
                                    const data = docSnap.data() as CardData;
                                    setLiveCardData({ ...data, groupId: group.id });
                                }
                            });
                            return true;
                        }
                    }
                    return false;
                };

                // If we have a groupId, start there
                const initialGroupId = card.groupId;
                if (initialGroupId) {
                    const cardRef = doc(db, 'kanban-groups', initialGroupId, 'cards', card.id);
                    unsubscribe = onSnapshot(cardRef, (docSnap) => {
                        if (docSnap.exists()) {
                            const data = docSnap.data() as CardData;
                            setLiveCardData({ ...data, groupId: initialGroupId });
                        } else {
                            findCardInAllGroups();
                        }
                    });
                } else {
                    // Try to find it across all groups
                    await findCardInAllGroups();
                }
            } catch (error) {
                console.error("Error in initLogic:", error);
            }
        };

        initLogic();

        return () => { if (unsubscribe) unsubscribe(); };
    }, [card?.id, card?.groupId, groups]);

    const currentGroupId = liveCardData?.groupId || card?.groupId;

    useEffect(() => {
        if (!isEditing && liveCardData) {
            setContactInfo({
                ...liveCardData, // Spread all for now, can be more selective
                contactName: liveCardData.contactName || '',
                company: liveCardData.company || '',
                email: liveCardData.email || '',
                website: liveCardData.website || '',
                address: liveCardData.address || '',
                city: liveCardData.city || '',
                postalCode: liveCardData.postalCode || '',
                notes: liveCardData.notes || [],
                socials: liveCardData.socials || {},
            });
        }
    }, [liveCardData, isEditing]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [liveCardData?.messages]);

    // Handlers
    const toggleChecklistItem = async (item: string) => {
        if (!liveCardData?.id || !currentGroupId) return;
        const newStatus = !liveCardData.checklistStatus?.[item];
        const updatedChecklistStatus = { ...(liveCardData.checklistStatus || {}), [item]: newStatus };
        setLiveCardData(prev => prev ? ({ ...prev, checklistStatus: updatedChecklistStatus }) : null);
        try {
            await updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', liveCardData.id), { checklistStatus: updatedChecklistStatus });
        } catch (error) {
            console.error("Error updating checklist:", error);
            toast.error("Error al actualizar el checklist");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !card?.id || !currentGroupId || isSending) return;
        setIsSending(true);
        toast.promise(
            sendWhatsappMessage({
                cardId: card.id,
                groupId: currentGroupId,
                message: newMessage,
                toNumber: liveCardData?.contactNumber || card?.contactNumber
            }),
            {
                loading: 'Enviando mensaje...',
                success: () => { setNewMessage(''); return 'Mensaje enviado.'; },
                error: 'Error al enviar el mensaje.',
                finally: () => setIsSending(false)
            }
        );
    };

    const handleInfoSave = async () => {
        if (!card?.id || !currentGroupId) return;
        try {
            await updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), contactInfo);
            const phone = liveCardData?.contactNumber || card.contactNumber;
            if (phone) {
                const contactsQuery = query(collection(db, 'contacts'), where('phone', '==', phone));
                const contactsSnapshot = await getDocs(contactsQuery);
                if (!contactsSnapshot.empty) {
                    for (const cDoc of contactsSnapshot.docs) {
                        await updateDoc(cDoc.ref, {
                            name: contactInfo.contactName || '',
                            email: contactInfo.email || '',
                            phone: phone,
                            company: contactInfo.company || '',
                            city: contactInfo.city || '',
                            profession: contactInfo.profession || '',
                            lastUpdated: serverTimestamp()
                        });
                    }
                }
            }
            toast.success('Información actualizada.');
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving information:", error);
            toast.error('No se pudo actualizar.');
        }
    };

    const handleSaveNote = async () => {
        if (!newNote.trim() || !card?.id || !currentGroupId) return;
        const noteObject: Note = {
            id: `note_${Date.now()}`,
            text: newNote,
            author: 'Agente',
            timestamp: Timestamp.now()
        };
        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { notes: arrayUnion(noteObject) }),
            {
                loading: 'Guardando nota...',
                success: () => { setNewNote(''); setIsAddingNote(false); return 'Nota guardada.'; },
                error: 'Error al guardar la nota.',
            }
        );
    };

    const handleSaveCheckIn = async (customText?: string) => {
        const textToSave = (typeof customText === 'string' && customText) ? customText : newCheckIn;
        if (!textToSave || !textToSave.trim() || !card?.id || !currentGroupId) return;
        const checkInObject = { id: `checkin_${Date.now()}`, text: textToSave, author: 'Agente', timestamp: Timestamp.now() };
        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { checkIns: arrayUnion(checkInObject) }),
            {
                loading: 'Guardando tarea...',
                success: () => { setNewCheckIn(''); setIsAddingCheckIn(false); return 'Tarea guardada'; },
                error: 'Error al guardar la tarea'
            }
        );
    };

    const handleSavePaymentMethod = async () => {
        if (!card?.id || !currentGroupId || !newPayment.last4) {
            toast.error("Por favor completa los datos básicos");
            return;
        }
        const paymentMethodObject = {
            id: `pm_${Date.now()}`,
            ...newPayment,
            isDefault: (liveCardData?.paymentMethods?.length || 0) === 0
        };
        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { paymentMethods: arrayUnion(paymentMethodObject) }),
            {
                loading: 'Guardando método de pago...',
                success: () => {
                    setIsAddingPayment(false);
                    setNewPayment({ type: 'visa', last4: '', expiry: '', brand: '' });
                    return 'Método de pago guardado correctamente';
                },
                error: 'Error al guardar el método de pago',
            }
        );
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!card?.id || !currentGroupId || !confirm('¿Realmente quieres eliminar esta nota?')) return;
        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { notes: liveCardData?.notes?.filter((n) => n.id !== noteId) || [] }),
            { loading: 'Eliminando nota...', success: 'Nota eliminada correctamente', error: 'Error al eliminar la nota' }
        );
    };

    const handleDeleteCheckIn = async (checkInId: string) => {
        if (!card?.id || !currentGroupId || !confirm('¿Realmente quieres eliminar este check-in?')) return;
        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { checkIns: liveCardData?.checkIns?.filter((c) => c.id !== checkInId) || [] }),
            { loading: 'Eliminando check-in...', success: 'Check-in eliminado correctamente', error: 'Error al eliminar the check-in' }
        );
    };

    const handleSaveEditedNote = async () => {
        if (!card?.id || !currentGroupId || !editingNoteId || !editText.trim()) return;
        const updatedNotes = liveCardData?.notes?.map(n => n.id === editingNoteId ? { ...n, text: editText } : n) || [];
        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { notes: updatedNotes }),
            { loading: 'Guardando cambios...', success: () => { setEditingNoteId(null); setEditText(''); return 'Nota actualizada.'; }, error: 'Error al actualizar.' }
        );
    };

    const handleSaveEditedCheckIn = async () => {
        if (!card?.id || !currentGroupId || !editingCheckInId || !editText.trim()) return;
        const updatedCheckIns = liveCardData?.checkIns?.map(c => c.id === editingCheckInId ? { ...c, text: editText } : c) || [];
        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { checkIns: updatedCheckIns }),
            { loading: 'Guardando check-in...', success: () => { setEditingCheckInId(null); setEditText(''); return 'Check-in actualizado.'; }, error: 'Error al actualizar.' }
        );
    };

    const handleToggleCheckIn = async (checkIn: CheckIn) => {
        if (!card?.id || !currentGroupId) return;
        const updatedCheckIns = liveCardData?.checkIns?.map(c => c.id === checkIn.id ? { ...c, completed: !c.completed } : c) || [];
        try {
            await updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { checkIns: updatedCheckIns });
        } catch (error) {
            console.error("Error toggling check-in:", error);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (!card || acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        setSelectedFile(file);
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setFilePreviewUrl(url);
        } else {
            setFilePreviewUrl(null);
        }
    }, [card]);

    const handleDisplayFileSend = async () => {
        if (!selectedFile || !card?.id || !currentGroupId || !liveCardData?.contactNumber) return;
        await uploadFile(selectedFile, { cardId: card.id, groupId: currentGroupId, toNumber: liveCardData.contactNumber });
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setSelectedFile(null);
        setFilePreviewUrl(null);
    };

    const handleCancelPreview = () => {
        if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
        setSelectedFile(null);
        setFilePreviewUrl(null);
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true, noKeyboard: true });

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onEmojiClick = (emojiData: any) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    const handleEditNote = (note: Note) => {
        setEditingNoteId(note.id);
        setEditText(note.text);
    };

    const handleSaveMute = async (duration: string | null) => {
        if (!card?.id || !currentGroupId) return;

        let mutedUntil: Timestamp | null = null;
        if (duration) {
            const now = new Date();
            if (duration === '8h') now.setHours(now.getHours() + 8);
            if (duration === '1w') now.setDate(now.getDate() + 7);
            if (duration === 'always') now.setFullYear(now.getFullYear() + 100);
            mutedUntil = Timestamp.fromDate(now);
        }

        toast.promise(
            updateDoc(doc(db, 'kanban-groups', currentGroupId, 'cards', card.id), { mutedUntil }),
            {
                loading: 'Actualizando silencio...',
                success: duration ? 'Notificaciones silenciadas.' : 'Notificaciones activadas.',
                error: 'Error al actualizar.'
            }
        );
    };

    const handleEditCheckIn = (checkIn: CheckIn) => {
        setEditingCheckInId(checkIn.id);
        setEditText(checkIn.text);
    };

    const groupedMessages = useMemo(() => groupMessagesByDate(liveCardData?.messages || []), [liveCardData?.messages]);

    const isMessageRead = useCallback((msg: Message) =>
        liveCardData?.lastReadAt && msg.timestamp
            ? msg.timestamp.seconds <= liveCardData.lastReadAt.seconds
            : false, [liveCardData?.lastReadAt]);

    const currentPlatform = useMemo(() => socialPlatforms.find(p => p.name === activePlatform) || socialPlatforms[0], [activePlatform]);

    return {
        liveCardData,
        newMessage,
        setNewMessage,
        isSending,
        contactInfo,
        setContactInfo,
        activeTab,
        setActiveTab,
        activePlatform,
        setActivePlatform,
        isEditing,
        setIsEditing,
        previewFile,
        setPreviewFile,
        isAddingNote,
        setIsAddingNote,
        newNote,
        setNewNote,
        isAddingCheckIn,
        setIsAddingCheckIn,
        newCheckIn,
        setNewCheckIn,
        selectedFile,
        filePreviewUrl,
        editingNoteId,
        setEditingNoteId,
        editingCheckInId,
        setEditingCheckInId,
        editText,
        setEditText,
        isAddingPayment,
        setIsAddingPayment,
        newPayment,
        setNewPayment,
        messagesEndRef,
        uploading,
        progress,
        currentGroupName,
        checklistProgress,
        handleSendMessage,
        handleInfoSave,
        handleSaveNote,
        handleSaveCheckIn,
        handleSavePaymentMethod,
        handleDeleteNote,
        handleDeleteCheckIn,
        handleSaveEditedNote,
        handleSaveEditedCheckIn,
        handleToggleCheckIn,
        handleDisplayFileSend,
        handleCancelPreview,
        getRootProps,
        getInputProps,
        isDragActive,
        open,
        handleInfoChange,
        onEmojiClick,
        toggleChecklistItem,
        groupedMessages,
        isMessageRead,
        currentPlatform,
        handleEditNote,
        handleEditCheckIn,
        handleSaveMute
    };
};
