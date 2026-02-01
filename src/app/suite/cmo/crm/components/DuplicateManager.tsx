import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Merge, Trash2, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { db } from '@/lib/firebase';
import { deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface DuplicateManagerProps {
    isOpen: boolean;
    onClose: () => void;
    contacts: any[];
    onContactsUpdated: (updatedContacts: any[]) => void;
}

export const DuplicateManager: React.FC<DuplicateManagerProps> = ({
    isOpen,
    onClose,
    contacts,
    onContactsUpdated
}) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [duplicates, setDuplicates] = useState<any[]>([]); // Array of groups
    const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    // Grouping Logic
    const analyzeDuplicates = () => {
        setAnalyzing(true);
        setTimeout(() => {
            const groups: any[] = [];
            const processedIds = new Set();

            contacts.forEach(contact => {
                if (processedIds.has(contact.id)) return;

                // Find matches by Phone OR Name (case insensitive)
                const matches = contacts.filter(c =>
                    c.id !== contact.id && !processedIds.has(c.id) && (
                        (c.phone && contact.phone && c.phone.replace(/\D/g, '') === contact.phone.replace(/\D/g, '')) ||
                        (c.name && contact.name && c.name.toLowerCase().trim() === contact.name.toLowerCase().trim())
                    )
                );

                if (matches.length > 0) {
                    const group = [contact, ...matches];
                    groups.push(group);
                    group.forEach(g => processedIds.add(g.id));
                }
            });

            setDuplicates(groups);
            setAnalyzing(false);
        }, 500);
    };

    // Auto-analyze on open
    React.useEffect(() => {
        if (isOpen) analyzeDuplicates();
    }, [isOpen]);

    const handleMerge = async (group: any[], primaryContactId: string) => {
        if (!primaryContactId || processing) return;
        setProcessing(true);

        try {
            const primaryContact = group.find(c => c.id === primaryContactId);
            const others = group.filter(c => c.id !== primaryContactId);

            // Merge Data strategy:
            // 1. Tags: Union
            // 2. Empty fields in primary: Fill from others
            const mergedTags = new Set(primaryContact.tags || []);
            const updates: any = {};

            others.forEach(other => {
                (other.tags || []).forEach((t: string) => mergedTags.add(t));

                if (!primaryContact.email && other.email) updates.email = other.email;
                if (!primaryContact.company && other.company) updates.company = other.company;
                if (!primaryContact.address && other.address) updates.address = other.address;
                // Add more fields as needed
            });

            updates.tags = Array.from(mergedTags);
            updates.lastUpdated = serverTimestamp();

            // Execute Updates
            // 1. Update Primary
            await updateDoc(doc(db, 'contacts', primaryContactId), updates);

            // 2. Delete Others
            for (const other of others) {
                await deleteDoc(doc(db, 'contacts', other.id));
            }

            toast.success(`Fusionado exitosamente. ${others.length} duplicados eliminados.`);

            // Remove group from UI
            const newContacts = contacts.filter(c => !others.find(o => o.id === c.id));
            // Update the primary in list locally
            const updatedPrimary = { ...primaryContact, ...updates };
            const finalContacts = newContacts.map(c => c.id === primaryContactId ? updatedPrimary : c);

            onContactsUpdated(finalContacts);
            setDuplicates(prev => prev.filter((_, idx) => idx !== selectedGroupIndex));
            setSelectedGroupIndex(null);

        } catch (error) {
            console.error("Merge error:", error);
            toast.error("Error al fusionar contactos.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#0b141a] border-neutral-800 text-white sm:max-w-4xl p-0 overflow-hidden outline-none">
                <DialogHeader className="p-6 border-b border-white/5 bg-neutral-900/50">
                    <DialogTitle className="text-xl font-black flex items-center gap-2">
                        <Merge className="text-blue-500" />
                        Gestor de Duplicados
                    </DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Detecta y fusiona contactos que comparten nombre o teléfono.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 h-[600px] overflow-y-auto custom-scrollbar flex gap-6">
                    {/* Groups List */}
                    <div className="w-1/3 border-r border-white/5 pr-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                {duplicates.length} Grupos Encontrados
                            </span>
                            <Button variant="ghost" size="sm" onClick={analyzeDuplicates} disabled={analyzing}>
                                <RefreshCw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>

                        {duplicates.length === 0 && !analyzing && (
                            <div className="text-center py-10 text-neutral-500 text-sm">
                                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500/50" />
                                <p>Todo limpio. No se encontraron duplicados.</p>
                            </div>
                        )}

                        {duplicates.map((group, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedGroupIndex(idx)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedGroupIndex === idx ? 'bg-blue-500/10 border-blue-500/50' : 'bg-neutral-900/50 border-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className="bg-neutral-950 text-neutral-400 border-neutral-800">
                                        {group.length} Contactos
                                    </Badge>
                                </div>
                                <p className="font-bold text-sm truncate">{group[0].name}</p>
                                <p className="text-xs text-neutral-500 truncate">{group[0].phone}</p>
                            </div>
                        ))}
                    </div>

                    {/* Merge Area */}
                    <div className="flex-1 pl-2">
                        {selectedGroupIndex !== null && duplicates[selectedGroupIndex] ? (
                            <MergeView
                                group={duplicates[selectedGroupIndex]}
                                onMerge={(primaryId) => handleMerge(duplicates[selectedGroupIndex], primaryId)}
                                processing={processing}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center text-neutral-600 text-sm">
                                Selecciona un grupo para revisar
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const MergeView = ({ group, onMerge, processing }: { group: any[], onMerge: (id: string) => void, processing: boolean }) => {
    const [primaryId, setPrimaryId] = useState<string>(group[0].id);

    return (
        <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200/80 leading-relaxed">
                    Selecciona el <strong>Contacto Principal</strong>. Los datos de los otros contactos (como etiquetas faltantes) se fusionarán en el principal, y los duplicados serán <strong>eliminados permanentemente</strong>.
                </p>
            </div>

            <div className="space-y-3">
                {group.map(contact => (
                    <div
                        key={contact.id}
                        onClick={() => setPrimaryId(contact.id)}
                        className={`relative p-4 rounded-xl border transition-all cursor-pointer ${primaryId === contact.id ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500' : 'bg-neutral-900 border-white/5 hover:bg-neutral-800'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${primaryId === contact.id ? 'border-blue-500 bg-blue-500' : 'border-neutral-600'}`}>
                                    {primaryId === contact.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">{contact.name}</p>
                                    <p className="text-xs text-neutral-400">{contact.phone} • {contact.email || 'Sin Email'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-neutral-500 uppercase">Tags</span>
                                <div className="flex gap-1 justify-end mt-1">
                                    {(contact.tags || []).slice(0, 3).map((t: string) => (
                                        <div key={t} className="w-2 h-2 rounded-full bg-neutral-600" title={t} />
                                    ))}
                                    {(contact.tags?.length || 0) > 3 && <span className="text-[10px] text-neutral-500">+{contact.tags.length - 3}</span>}
                                </div>
                            </div>
                        </div>
                        {primaryId === contact.id && (
                            <Badge className="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-600 border-none text-[10px]">
                                PRINCIPAL
                            </Badge>
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                <Button
                    onClick={() => onMerge(primaryId)}
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                    {processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Merge className="w-4 h-4 mr-2" />}
                    Fusionar y Eliminar Duplicados
                </Button>
            </div>
        </div>
    );
};
