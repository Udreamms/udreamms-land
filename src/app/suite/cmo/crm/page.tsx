'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, Variants, motion } from 'framer-motion';

import { db } from '@/lib/firebase';
import { collection, getDocs, collectionGroup, setDoc, doc, deleteDoc, serverTimestamp, query, where, updateDoc } from 'firebase/firestore';
import { Plus, Search, X, Users, RefreshCw, Filter, MoreHorizontal, ArrowLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ConversationModal from '../../coo/whatsapp/components/ConversationModal';
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Modular Components
import { ContactHeader } from './components/ContactHeader';
import { ContactFilters } from './components/ContactFilters';
import { ContactList } from './components/ContactList';
import { ContactGrid } from './components/ContactGrid';
import { ContactDetailsModal } from './components/ContactDetailsModal';
import { ImportDialog } from './components/ImportDialog';
import { DuplicateManager } from './components/DuplicateManager';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function ContactsPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [isMounted, setIsMounted] = useState(false);
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isDuplicateManagerOpen, setIsDuplicateManagerOpen] = useState(false);

    // Handle client-side mounting and localStorage
    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
            const savedViewMode = localStorage.getItem('contactsViewMode');
            if (savedViewMode === 'list' || savedViewMode === 'grid') {
                setViewMode(savedViewMode);
            }
        }
    }, []);
    const [syncStatus, setSyncStatus] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Helpers
    const getDateString = (value: any) => {
        if (!value) return '---';
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && 'seconds' in value) {
            return new Date(value.seconds * 1000).toLocaleDateString();
        }
        return '---';
    };

    const getDateInputValue = (value: any) => {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object' && 'seconds' in value) {
            return new Date(value.seconds * 1000).toISOString().split('T')[0];
        }
        return '';
    };

    const getAge = (birthDate: any) => {
        if (!birthDate) return null;
        let date: Date;
        if (typeof birthDate === 'string') {
            date = new Date(birthDate);
        } else if (birthDate && typeof birthDate === 'object' && 'seconds' in birthDate) {
            date = new Date(birthDate.seconds * 1000);
        } else {
            return null;
        }
        if (isNaN(date.getTime())) return null;
        return new Date().getFullYear() - date.getFullYear();
    };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                console.log('Fetching contacts from Firebase...');
                setIsLoadingContacts(true);
                const querySnapshot = await getDocs(collection(db, 'contacts'));
                const contactsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Contacts fetched:', contactsData.length, contactsData);
                setContacts(contactsData as any[]);
                console.log('Setting isLoadingContacts to false...');
                setIsLoadingContacts(false);
            } catch (error) {
                console.error("Error loading contacts:", error);
                setIsLoadingContacts(false);
            }
        };
        fetchContacts();
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('contactsViewMode', viewMode);
        }
    }, [viewMode]);

    const onImportDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsSyncing(true);
        setSyncStatus(`Procesando archivo...`);

        // Dynamic import for XLSX to keep it out of the main bundle if possible
        const XLSX = await import('xlsx');

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length < 2) {
                    setSyncStatus("❌ Error: El archivo está vacío.");
                    setIsSyncing(false);
                    return;
                }

                const headers = jsonData[0].map((h: string) => h.toString().trim().toLowerCase());
                const rows = jsonData.slice(1);

                let importedCount = 0;
                for (const row of rows) {
                    if (!row || row.length === 0) continue;
                    const rowData: any = {};
                    headers.forEach((header: string, index: number) => {
                        rowData[header] = row[index] || '';
                    });

                    if (!rowData.name && !rowData.nombre) continue;

                    const contactId = Math.random().toString(36).substr(2, 9);
                    const contactData = {
                        name: rowData.name || rowData.nombre || 'Sin Nombre',
                        email: rowData.email || rowData.correo || '',
                        phone: rowData.phone || rowData.telefono || '',
                        source: rowData.source || rowData.fuente || 'Excel Import',
                        stage: rowData.stage || rowData.etapa || 'Prospecting',
                        city: rowData.city || rowData.ciudad || '',
                        profession: rowData.profession || rowData.profesion || '',
                        company: rowData.company || rowData.empresa || '',
                        tags: rowData.tags ? rowData.tags.toString().split(';') : [],
                        id: contactId,
                        date: new Date().toISOString().split('T')[0],
                        createdAt: serverTimestamp(),
                        lastUpdated: serverTimestamp(),
                        importedFrom: 'excel'
                    };

                    await setDoc(doc(db, 'contacts', contactId), contactData);
                    importedCount++;
                }

                setSyncStatus(`✅ Importación completada: ${importedCount} contactos.`);
                const querySnapshot = await getDocs(collection(db, 'contacts'));
                setContacts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]);
                setTimeout(() => { setIsImportModalOpen(false); setSyncStatus(''); }, 2000);
            } catch (err) {
                console.error("Error parsing file:", err);
                setSyncStatus("❌ Error al procesar el archivo.");
            } finally {
                setIsSyncing(false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSyncWhatsAppContacts = async () => {
        setIsSyncing(true);
        setSyncStatus('Iniciando sincronización inteligente...');
        try {
            const cardsQuery = query(collectionGroup(db, 'cards'));
            const cardsSnapshot = await getDocs(cardsQuery);
            let importedCount = 0;
            let updatedCount = 0;
            let skippedCount = 0;

            for (const cardDoc of cardsSnapshot.docs) {
                const cardData = cardDoc.data();
                if (!cardData.contactNumber) continue;

                const phone = cardData.contactNumber.replace(/\D/g, '');

                // 1. Check if contact already exists by phone
                const existingContactQuery = query(
                    collection(db, 'contacts'),
                    where('phone', '==', phone)
                );
                const existingDocs = await getDocs(existingContactQuery);

                const contactData: any = {
                    name: cardData.contactName || 'Sin Nombre',
                    email: cardData.email || '',
                    // phone is key
                    source: 'WhatsApp',
                    // Merge tags carefully
                    // tags: cardData.tags || [], 
                    stage: 'In Progress',
                    lastUpdated: serverTimestamp(),
                };

                if (!existingDocs.empty) {
                    // --- UPDATE EXISTING ---
                    const existingDoc = existingDocs.docs[0];
                    const existingData = existingDoc.data();

                    // Intelligent Merge: Only update empty fields or force specific updates
                    const mergedData: any = { ...contactData };

                    // Don't overwrite name if it looks like a default "Sin Nombre" coming from card but contact has real name
                    if (mergedData.name === 'Sin Nombre' && existingData.name !== 'Sin Nombre') {
                        delete mergedData.name;
                    }
                    // Don't overwrite email if existing is present and incoming is empty
                    if (!mergedData.email && existingData.email) {
                        delete mergedData.email;
                    }

                    // Merge tags
                    const currentTags = existingData.tags || [];
                    const newTags = cardData.tags || [];
                    const combinedTags = Array.from(new Set([...currentTags, ...newTags]));
                    mergedData.tags = combinedTags;

                    await updateDoc(doc(db, 'contacts', existingDoc.id), mergedData);
                    updatedCount++;
                } else {
                    // --- CREATE NEW ---
                    const contactId = cardDoc.id; // Use card ID as contact ID for easier linking, or random
                    // Actually, let's use random to avoid collisions if card ID is weird, 
                    // or better, use the card ID but check if it's already used (unlikely for new phone)
                    // Let's use `contactId` same as `cardDoc.id` for strong link, 
                    // BUT `cardDoc.id` might be shared if copied? No, card IDs are unique.
                    // Risk: If manual contact was created with random ID, and now we sync, we found it by phone (Update path).
                    // If we didn't find it by phone, we create new.

                    const newContactData = {
                        ...contactData,
                        phone: phone, // ensure phone is set
                        id: contactId,
                        importedFrom: 'whatsapp-kanban',
                        importedAt: serverTimestamp(),
                        date: new Date().toISOString().split('T')[0],
                        tags: cardData.tags || []
                    };

                    // Check if ID collision happens (rare but possible if card ID methods mixed)
                    // Safe to use setDoc with merge:true just in case, but we verified phone doesn't exist.
                    // Wait, if ID exists but phone is different? Unlikely.
                    await setDoc(doc(db, 'contacts', contactId), newContactData);
                    importedCount++;
                }
            }
            setSyncStatus(`✅ Sincronización: ${importedCount} nuevos, ${updatedCount} actualizados.`);

            // Refresh local state
            const querySnapshot = await getDocs(collection(db, 'contacts'));
            setContacts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]);
        } catch (error) {
            console.error('Error syncing contacts:', error);
            setSyncStatus(`❌ Error sincronizando.`);
        } finally {
            setIsSyncing(false);
        }
    };

    const [newContact, setNewContact] = useState({
        // Basic & Identity
        name: '', email: '', phone: '', source: 'Other', tags: [] as string[], stage: 'Prospecting',
        birthDate: '', gender: '' as 'man' | 'woman' | '', maritalStatus: 'single',
        nationality: '', birthCountry: '', birthCity: '',
        spouseName: '', spouseBirthDate: '',

        // Passport & Visa
        passport: '', passportIssueDate: '', passportExpiryDate: '', passportIssueCity: '', passportIssueCountry: '',
        hasVisa: 'no', visaType: '', visaIssueDate: '', visaExpiryDate: '',
        lostPassport: 'no', lostPassportDetails: '',

        // Address
        address: '', city: '', postalCode: '', state: '', country: '',
        livedInUS: 'no', previousUSAddress: '',

        // Family
        sponsorName: '', sponsorRelation: '', sponsorAddress: '', sponsorPhone: '', sponsorEmail: '',
        parents: [] as any[], // { name, relation }
        children: [] as any[], // { name, birthDate, birthPlace }
        travelingWithChildren: 'no',

        // Employment
        profession: '', occupation: '', company: '',
        currentEmployment: {
            occupation: '', employer: '', address: '', startDate: '', monthlyIncome: '', description: ''
        },
        previousEmployment: {
            employer: '', address: '', jobTitle: '', supervisor: '', supervisorPhone: '', startDate: '', endDate: '', description: ''
        },

        // Education
        highSchool: { name: '', address: '', startDate: '', endDate: '', degree: '' },
        university: { name: '', address: '', startDate: '', endDate: '', degree: '' },
        otherEducation: { name: '', address: '', startDate: '', endDate: '', degree: '' },

        // Background
        studyReason: '', postStudyPlans: '', preferredSchedule: '',
        refusedVisa: 'no', refusedVisaDetails: '',
        militaryService: 'no', militaryServiceDetails: '',
        languages: [] as string[],
        emergencyContacts: [] as any[], // { name, relation, phone, email, address }

        // Files
        documents: [] as any[], // { name, url, type, category }

        // Metadata
        clientType: 'persona' as 'persona' | 'empresa',
        interests: '', website: '',
        instagram: '', facebook: '', tiktok: '', linkedin: '', twitter: '',

        // Payment
        tdcNumber: '', tdcExpiry: '', tdcCvv: '', tddNumber: '', tddExpiry: '', tddCvv: '',
        serviceDetails: '', serviceType: '', paymentStatus: '', serviceStartDate: '', serviceDeliveryDate: '',
        backupLink: '', contractLink: '', invoiceLink: ''
    });

    const handleAddContact = async () => {
        if (!newContact.name) return;
        const newContactId = Math.random().toString(36).substr(2, 9);

        // Sanitize Phone
        const sanitizedPhone = newContact.phone ? newContact.phone.replace(/\D/g, '') : '';
        const contactToSave = { ...newContact, phone: sanitizedPhone };

        const contactData = { ...contactToSave, id: newContactId, date: new Date().toISOString().split('T')[0], createdAt: serverTimestamp(), lastUpdated: serverTimestamp() };
        try {
            await setDoc(doc(db, 'contacts', newContactId), contactData);
            setContacts([contactData, ...contacts]);
            setIsAddModalOpen(false);
            setNewContact({
                // Reset to empty state
                name: '', email: '', phone: '', source: 'Other', tags: [], stage: 'Prospecting',
                birthDate: '', gender: '', maritalStatus: 'single', nationality: '', birthCountry: '', birthCity: '',
                spouseName: '', spouseBirthDate: '',
                passport: '', passportIssueDate: '', passportExpiryDate: '', passportIssueCity: '', passportIssueCountry: '',
                hasVisa: 'no', visaType: '', visaIssueDate: '', visaExpiryDate: '', lostPassport: 'no', lostPassportDetails: '',
                address: '', city: '', postalCode: '', state: '', country: '', livedInUS: 'no', previousUSAddress: '',
                sponsorName: '', sponsorRelation: '', sponsorAddress: '', sponsorPhone: '', sponsorEmail: '',
                parents: [], children: [], travelingWithChildren: 'no',
                profession: '', occupation: '', company: '',
                currentEmployment: { occupation: '', employer: '', address: '', startDate: '', monthlyIncome: '', description: '' },
                previousEmployment: { employer: '', address: '', jobTitle: '', supervisor: '', supervisorPhone: '', startDate: '', endDate: '', description: '' },
                highSchool: { name: '', address: '', startDate: '', endDate: '', degree: '' },
                university: { name: '', address: '', startDate: '', endDate: '', degree: '' },
                otherEducation: { name: '', address: '', startDate: '', endDate: '', degree: '' },
                studyReason: '', postStudyPlans: '', preferredSchedule: '', refusedVisa: 'no', refusedVisaDetails: '',
                militaryService: 'no', militaryServiceDetails: '', languages: [], emergencyContacts: [],
                documents: [],
                clientType: 'persona', interests: '', website: '',
                instagram: '', facebook: '', tiktok: '', linkedin: '', twitter: '',
                tdcNumber: '', tdcExpiry: '', tdcCvv: '', tddNumber: '', tddExpiry: '', tddCvv: '',
                serviceDetails: '', serviceType: '', paymentStatus: '', serviceStartDate: '', serviceDeliveryDate: '',
                backupLink: '', contractLink: '', invoiceLink: ''
            });
        } catch (error) { toast.error("Error al guardar."); }
    };

    const handleSaveContact = async () => {
        if (!selectedContact) return;
        try {
            const sanitizedPhone = selectedContact.phone ? selectedContact.phone.replace(/\D/g, '') : '';
            const contactToSave = { ...selectedContact, phone: sanitizedPhone };

            const contactRef = doc(db, 'contacts', selectedContact.id);
            await setDoc(contactRef, { ...contactToSave, lastUpdated: serverTimestamp() }, { merge: true });

            if (sanitizedPhone) {
                const cardsQuery = query(collectionGroup(db, 'cards'), where('contactNumber', '==', sanitizedPhone));
                const cardsSnapshot = await getDocs(cardsQuery);
                for (const cardDoc of cardsSnapshot.docs) {
                    await updateDoc(cardDoc.ref, {
                        contactName: selectedContact.name,
                        email: selectedContact.email || '',
                        company: selectedContact.company || '',
                        city: selectedContact.city || '',
                        profession: selectedContact.profession || '',
                        lastUpdated: serverTimestamp()
                    });
                }
            }
            toast.success('Perfil actualizado');
            setContacts(contacts.map(c => c.id === selectedContact.id ? selectedContact : c));
            setIsDetailModalOpen(false);
            setIsEditingProfile(false);
        } catch (error) { toast.error("Error al actualizar."); }
    };

    const handleDeleteContact = async (id: string) => {
        if (!window.confirm("¿Eliminar contacto?")) return;
        try {
            await deleteDoc(doc(db, 'contacts', id));
            setContacts(contacts.filter(c => c.id !== id));
            toast.success("Contacto eliminado");
        } catch (error) { toast.error("Error al eliminar."); }
    };

    const handleUpdateStage = (stage: string) => {
        if (!selectedContact) return;
        setSelectedContact({ ...selectedContact, stage });
    };

    const handleAddTag = () => {
        if (!newTag || !selectedContact) return;
        if (!selectedContact.tags.includes(newTag)) {
            setSelectedContact({ ...selectedContact, tags: [...selectedContact.tags, newTag] });
        }
        setNewTag('');
        setIsAddingTag(false);
    };

    const handleRemoveTag = (tagToRemove: string) => {
        if (!selectedContact) return;
        setSelectedContact({ ...selectedContact, tags: selectedContact.tags.filter((t: string) => t !== tagToRemove) });
    };

    // Navigation
    const router = useRouter();

    const handleContactClick = (contact: any) => {
        // Redirect to the Kanban Board with the contact ID to open the chat there
        router.push(`/suite/coo/whatsapp?chatId=${contact.id}`);
    };

    const filteredContacts = contacts.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.phone || '').includes(searchQuery);
        const matchesStage = selectedStages.length === 0 || selectedStages.includes(c.stage);
        const matchesSource = selectedSources.length === 0 || selectedSources.includes(c.source);
        const matchesTags = selectedTags.length === 0 || (c.tags && c.tags.some((tag: string) => selectedTags.includes(tag)));
        return matchesSearch && matchesStage && matchesSource && matchesTags;
    });

    const availableStages = Array.from(new Set(contacts.map(c => c.stage).filter(Boolean)));
    const availableSources = Array.from(new Set(contacts.map(c => c.source).filter(Boolean)));
    const availableTags = Array.from(new Set(contacts.flatMap(c => c.tags || []).filter(Boolean)));
    const activeFiltersCount = selectedStages.length + selectedSources.length + selectedTags.length;

    return (
        <div className="flex h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden font-sans">


            <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
                {/* Enterprise Header Bar (Metrics) */}
                <div className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-8 z-20 shrink-0">
                    <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Total Database</span>
                            <span className="text-xl font-black text-white">{contacts.length}</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Leads</span>
                            <span className="text-xl font-black text-blue-500">{contacts.filter(c => c.stage === 'In Progress').length}</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Conversion</span>
                            <span className="text-xl font-black text-emerald-500">{contacts.length > 0 ? Math.round((contacts.filter(c => c.stage === 'Closed').length / contacts.length) * 100) : 0}%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">System Live</span>
                        </div>
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto scrollbar-hide custom-scrollbar p-6 space-y-6">
                    <ContactHeader
                        isChatOpen={isChatOpen}
                        handleSyncWhatsAppContacts={handleSyncWhatsAppContacts}
                        isSyncing={isSyncing}
                        isImportModalOpen={isImportModalOpen}
                        setIsImportModalOpen={setIsImportModalOpen}
                        onImportDrop={onImportDrop}
                        isAddModalOpen={isAddModalOpen}
                        setIsAddModalOpen={setIsAddModalOpen}
                        newContact={newContact}
                        setNewContact={setNewContact}
                        handleAddContact={handleAddContact}
                        setIsDuplicateManagerOpen={setIsDuplicateManagerOpen}
                    />

                    {syncStatus && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 font-medium text-sm">
                            {syncStatus}
                        </motion.div>
                    )}

                    <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4">
                        <ContactFilters
                            isChatOpen={isChatOpen}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            viewMode={viewMode}
                            setViewMode={setViewMode}
                            isFilterOpen={isFilterOpen}
                            setIsFilterOpen={setIsFilterOpen}
                            activeFiltersCount={activeFiltersCount}
                            clearAllFilters={() => { setSelectedStages([]); setSelectedSources([]); setSelectedTags([]); }}
                            availableStages={availableStages}
                            selectedStages={selectedStages}
                            setSelectedStages={setSelectedStages}
                            availableSources={availableSources}
                            selectedSources={selectedSources}
                            setSelectedSources={setSelectedSources}
                            availableTags={availableTags}
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            filteredCount={filteredContacts.length}
                        />
                    </div>

                    {isLoadingContacts ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <RefreshCw className="w-10 h-10 text-neutral-700 animate-spin mx-auto mb-4" />
                                <p className="text-neutral-500 font-bold text-xs uppercase tracking-widest">Consulting Core Database...</p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {viewMode === 'list' ? (
                                <ContactList
                                    key="list"
                                    contacts={filteredContacts}
                                    containerVariants={containerVariants}
                                    itemVariants={itemVariants}
                                    isChatOpen={isChatOpen}
                                    handleContactClick={handleContactClick}
                                    setSelectedContact={setSelectedContact}
                                    setIsDetailModalOpen={setIsDetailModalOpen}
                                    setIsEditingProfile={setIsEditingProfile}
                                    handleDeleteContact={handleDeleteContact}
                                />
                            ) : (
                                <ContactGrid
                                    key="grid"
                                    contacts={filteredContacts}
                                    containerVariants={containerVariants}
                                    itemVariants={itemVariants}
                                    handleContactClick={handleContactClick}
                                    setSelectedContact={setSelectedContact}
                                    setIsDetailModalOpen={setIsDetailModalOpen}
                                    setIsEditingProfile={setIsEditingProfile}
                                    handleDeleteContact={handleDeleteContact}
                                />
                            )}
                        </AnimatePresence>
                    )}
                </main>
            </div>

            <ConversationModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                card={selectedContact ? { id: selectedContact.id, contactName: selectedContact.name, contactNumber: selectedContact.phone, ...selectedContact } : null}
                allConversations={contacts.map(c => ({ ...c, contactName: c.name, contactNumber: c.phone }))}
                onSelectConversation={(contact) => setSelectedContact(contact)}
                isGlobalContact={true}
                stats={{
                    totalConversations: contacts.length,
                    totalGroups: 0
                }}
                hideInternalTray={true}
                hideSidebar={true}
            />

            <ContactDetailsModal
                isOpen={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                selectedContact={selectedContact}
                setSelectedContact={setSelectedContact}
                isEditingProfile={isEditingProfile}
                setIsEditingProfile={setIsEditingProfile}
                handleSaveContact={handleSaveContact}
                handleUpdateStage={handleUpdateStage}
                handleRemoveTag={handleRemoveTag}
                handleAddTag={handleAddTag}
                newTag={newTag}
                setNewTag={setNewTag}
                isAddingTag={isAddingTag}
                setIsAddingTag={setIsAddingTag}
                getDateString={getDateString}
                getDateInputValue={getDateInputValue}
                getAge={getAge}
            />
        </div>
    );
}
