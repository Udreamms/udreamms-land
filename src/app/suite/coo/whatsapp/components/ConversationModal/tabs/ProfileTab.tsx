import React, { useState } from 'react';
import {
    Phone, Mail, Globe, Building, MapPin, CreditCard, User,
    Calendar, Plus, RefreshCw, DollarSign, FileText,
    FileSpreadsheet, ImageIcon, Edit2, ChevronRight, X, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ContactFieldCard } from '../components/SharedComponents';
import { LaneChecklist } from '../ConversationChecklistSystem';
import { CardData } from '../types';

interface ProfileTabProps {
    liveCardData: CardData | null;
    contactInfo: Partial<CardData>;
    isEditing: boolean;
    handleInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInfoSave: () => Promise<void>;
    setIsEditing: (val: boolean) => void;
    setContactInfo: React.Dispatch<React.SetStateAction<Partial<CardData>>>;
    currentGroupName: string;
    toggleChecklistItem: (item: string) => Promise<void>;
    handleToggleCheckIn: (checkIn: any) => Promise<void>;
    checklistProgress: number;
}

// Configuration for fields
const FIXED_FIELDS = [
    { key: 'contactNumber', label: 'DIRECT LINE', icon: <Phone size={18} className="text-blue-400" />, placeholder: 'Unmapped' },
    { key: 'email', label: 'DIGITAL MAIL', icon: <Mail size={18} className="text-purple-400" />, placeholder: 'Not linked' },
    { key: 'website', label: 'GLOBAL WEB', icon: <Globe size={18} className="text-sky-400" />, placeholder: 'No URL' },
    { key: 'company', label: 'ORGANIZATION', icon: <Building size={18} className="text-amber-400" />, placeholder: 'No disponible' },
    { key: 'address', label: 'GEOGRAPHIC LOCATION', icon: <MapPin size={18} className="text-rose-400" />, placeholder: 'No disponible' },
    { key: 'postalCode', label: 'POSTAL CODE', icon: <MapPin size={18} className="text-neutral-500" />, placeholder: 'Código Postal' },
];

const OPTIONAL_FIELDS = [
    { key: 'passport', label: 'PASSPORT / ID', icon: <CreditCard size={18} className="text-amber-500" />, placeholder: 'ID Document', section: 'Identity' },
    { key: 'clientType', label: 'CLIENT TYPE', icon: <User size={18} className="text-blue-400" />, placeholder: 'Select Type', customRender: true, section: 'Identity' },
    { key: 'gender', label: 'GENDER', icon: <User size={18} className="text-pink-400" />, placeholder: 'Select Gender', customRender: true, section: 'Identity' },
    { key: 'birthDate', label: 'DATE OF BIRTH', icon: <Calendar size={18} className="text-purple-400" />, placeholder: 'Select Date', customRender: true, section: 'Identity' },
    { key: 'profession', label: 'PROFESIÓN', icon: <User size={18} className="text-indigo-400" />, placeholder: 'Ej: Ingeniero', section: 'Professional' },
    { key: 'occupation', label: 'OCUPACIÓN', icon: <Building size={18} className="text-indigo-500" />, placeholder: 'Puesto actual', section: 'Professional' },
    { key: 'interests', label: 'INTERESES', icon: <Plus size={18} className="text-emerald-400" />, placeholder: 'Intereses del cliente', section: 'Professional' },
    { key: 'serviceType', label: 'SERVICIO', icon: <RefreshCw size={18} className="text-amber-400" />, placeholder: 'Tipo de servicio', section: 'Service' },
    { key: 'paymentStatus', label: 'ESTADO DE PAGO', icon: <DollarSign size={18} className="text-emerald-400" />, placeholder: 'Ej: Pagado', section: 'Service' },
    { key: 'serviceDetails', label: 'DETALLES ADICIONALES', icon: <FileText size={18} className="text-neutral-400" />, placeholder: 'Notas...', section: 'Service' },
    { key: 'backupLink', label: 'RESPALDO', icon: <RefreshCw size={18} className="text-blue-400" />, placeholder: 'Link', section: 'Links' },
    { key: 'contractLink', label: 'CONTRATO', icon: <FileText size={18} className="text-purple-400" />, placeholder: 'Link', section: 'Links' },
    { key: 'invoiceLink', label: 'FACTURA', icon: <FileSpreadsheet size={18} className="text-emerald-400" />, placeholder: 'Link', section: 'Links' },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({
    liveCardData,
    contactInfo,
    isEditing, // Not used deeply here anymore, we use local state
    handleInfoChange,
    handleInfoSave,
    setIsEditing,
    setContactInfo,
    currentGroupName,
    toggleChecklistItem,
    handleToggleCheckIn,
    checklistProgress
}) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [addedFields, setAddedFields] = useState<string[]>([]);
    const [editingField, setEditingField] = useState<string | null>(null);

    // Helper to check if a field has data
    const hasData = (key: string) => {
        const val = contactInfo[key as keyof CardData];
        return val !== undefined && val !== null && val !== '';
    };

    // Helper to add field
    const addField = (key: string) => {
        if (!addedFields.includes(key)) {
            setAddedFields(prev => [...prev, key]);
        }
        setShowSuggestions(false);
        setEditingField(key);
    };

    // Helper to delete/hide field
    const deleteField = (key: string) => {
        setContactInfo(prev => ({ ...prev, [key]: '' }));
        setAddedFields(prev => prev.filter(f => f !== key));
        // We trigger save to persist the "deletion" (empty string)
        setTimeout(() => handleInfoSave(), 100);
    };

    // Helper to finish edit
    const finishEdit = () => {
        setEditingField(null);
        handleInfoSave();
    };

    // Render logic for optional fields
    const shouldRender = (key: string) => hasData(key) || addedFields.includes(key);

    // Helper to format file size
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden p-3 space-y-5 pb-24 dark:bg-neutral-950 dark:text-neutral-200 custom-scrollbar">
            {/* Header Section from Image */}
            <div className="flex items-center justify-between border-b border-neutral-800/50 pb-2 mb-2">
                <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">PERFIL</h2>
                <ChevronRight size={14} className="text-neutral-600" />
            </div>

            {/* Profile Info Row (Simplified) */}
            <div className="flex items-center gap-4 px-1">
                <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-xl font-bold text-neutral-300 border border-neutral-700">
                        {contactInfo.contactName?.substring(0, 1).toUpperCase() || 'C'}
                    </div>
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-neutral-950 rounded-full"></div>
                </div>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <Input
                                name="contactName"
                                value={contactInfo.contactName || ''}
                                onChange={handleInfoChange}
                                className="h-8 text-sm font-bold bg-neutral-900 border-neutral-700 rounded-md focus:ring-1 focus:ring-blue-500"
                                placeholder="Nombre"
                            />
                        </div>
                    ) : (
                        <div className="group cursor-pointer" onClick={() => setIsEditing(true)}>
                            <h2 className="text-xl font-bold text-white leading-tight hover:text-blue-400 transition-colors truncate">
                                {contactInfo.contactName || 'Nuevo Cliente'}
                            </h2>
                            <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">{currentGroupName || 'SEVIS'}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Datos de Contacto */}
            <div className="space-y-4 pt-2">
                <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em] border-b border-neutral-800/50 pb-1.5 px-1">INFORMACIÓN DE CONTACTO</h3>
                <div className="flex flex-col">
                    {FIXED_FIELDS.map((field) => (
                        <div key={field.key} className="flex items-center gap-4 px-2 py-3 hover:bg-white/[0.02] transition-colors group rounded-md">
                            <div className="text-neutral-500 group-hover:text-neutral-300 shrink-0">
                                {React.cloneElement(field.icon as React.ReactElement, { size: 16 })}
                            </div>
                            <div className="flex-1 min-w-0">
                                {editingField === field.key ? (
                                    <Input
                                        value={(contactInfo as any)[field.key] || ''}
                                        onChange={handleInfoChange}
                                        name={field.key}
                                        className="h-8 text-xs bg-neutral-900 border-neutral-800 rounded-lg text-neutral-200"
                                        autoFocus
                                        onBlur={() => { setEditingField(null); handleInfoSave(); }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setEditingField(field.key)}>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">{field.label}</span>
                                            <span className="text-[13px] text-neutral-200 font-bold truncate">
                                                {(contactInfo as any)[field.key] || <span className="text-neutral-600 italic font-normal">{field.placeholder}</span>}
                                            </span>
                                        </div>
                                        <Edit2 size={10} className="opacity-0 group-hover:opacity-100 text-neutral-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Información Adicional (Optional Fields) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-1">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Detalles Adicionales</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowSuggestions(!showSuggestions)} className="h-5 px-2 text-[10px] text-blue-400 hover:text-blue-300 hover:bg-neutral-900">
                        {showSuggestions ? 'Cerrar' : '+ Agregar'}
                    </Button>
                </div>

                {showSuggestions && (
                    <div className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-wrap gap-2">
                            {OPTIONAL_FIELDS.filter(f => !hasData(f.key) && !addedFields.includes(f.key)).map(field => (
                                <button
                                    key={field.key}
                                    onClick={() => { addField(field.key); setEditingField(field.key); }}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-[10px] text-neutral-300 transition-all"
                                >
                                    <Plus size={10} />
                                    {field.label}
                                </button>
                            ))}
                            {OPTIONAL_FIELDS.filter(f => !hasData(f.key) && !addedFields.includes(f.key)).length === 0 && (
                                <p className="text-[10px] text-neutral-500 italic w-full text-center">Todos los campos disponibles han sido agregados.</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex flex-col">
                    {OPTIONAL_FIELDS.filter(f => hasData(f.key) || addedFields.includes(f.key)).map((field) => (
                        <div key={field.key} className="flex items-center gap-4 px-2 py-3 hover:bg-white/[0.02] transition-colors group rounded-md">
                            <div className="text-neutral-500 shrink-0">
                                {React.cloneElement(field.icon as React.ReactElement, { size: 16 })}
                            </div>
                            <div className="flex-1 min-w-0">
                                {editingField === field.key ? (
                                    <div className="animate-in fade-in duration-200">
                                        {field.key === 'gender' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => setContactInfo(prev => ({ ...prev, gender: 'man' }))} className={cn("text-xs px-2 py-1 rounded border", contactInfo.gender === 'man' ? "bg-blue-600 border-blue-600 text-white" : "border-neutral-700 text-neutral-400")}>Hombre</button>
                                                <button onClick={() => setContactInfo(prev => ({ ...prev, gender: 'woman' }))} className={cn("text-xs px-2 py-1 rounded border", contactInfo.gender === 'woman' ? "bg-pink-600 border-pink-600 text-white" : "border-neutral-700 text-neutral-400")}>Mujer</button>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 ml-auto" onClick={() => { setEditingField(null); handleInfoSave(); }}><Check size={12} /></Button>
                                            </div>
                                        ) : field.key === 'birthDate' ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    value={contactInfo.birthDate ? new Date(contactInfo.birthDate.seconds * 1000).toISOString().split('T')[0] : ''}
                                                    onChange={(e) => { const d = e.target.valueAsDate; if (d) setContactInfo(prev => ({ ...prev, birthDate: Timestamp.fromDate(d) })) }}
                                                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                                                />
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditingField(null); handleInfoSave(); }}><Check size={12} /></Button>
                                            </div>
                                        ) : (
                                            <Input
                                                value={(contactInfo as any)[field.key] || ''}
                                                onChange={handleInfoChange}
                                                name={field.key}
                                                className="h-8 text-xs bg-neutral-900 border-neutral-800 rounded-lg text-neutral-200"
                                                autoFocus
                                                onBlur={() => { setEditingField(null); handleInfoSave(); }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between cursor-pointer group/val" onClick={() => setEditingField(field.key)}>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mb-0.5">{field.label}</span>
                                            <span className="text-[13px] text-neutral-200 font-bold truncate">
                                                {field.key === 'gender' ? (contactInfo.gender === 'man' ? 'Hombre' : contactInfo.gender === 'woman' ? 'Mujer' : '--') :
                                                    field.key === 'birthDate' ? (contactInfo.birthDate ? new Date(contactInfo.birthDate.seconds * 1000).toLocaleDateString() : '--') :
                                                        ((contactInfo as any)[field.key] || '--')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/val:opacity-100 transition-opacity">
                                            <Edit2 size={10} className="text-neutral-600" />
                                            <button onClick={(e) => { e.stopPropagation(); deleteField(field.key); }} className="p-1 hover:text-red-400 text-neutral-600"><X size={10} /></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {OPTIONAL_FIELDS.filter(f => hasData(f.key) || addedFields.includes(f.key)).length === 0 && (
                        <p className="text-[10px] text-neutral-600 italic px-4 py-2">No hay detalles adicionales.</p>
                    )}
                </div>
            </div>

            {/* 4. Documentos (Restored) */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-800 pb-1 flex justify-between items-center">
                    Documentos
                    <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-full">{liveCardData?.documents?.length || 0}</span>
                </h3>
                <div className="space-y-2">
                    {liveCardData?.documents && liveCardData.documents.length > 0 ? (
                        liveCardData.documents.map((doc, idx) => (
                            <a
                                key={doc.id || idx}
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 transition-all group"
                            >
                                <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-blue-400 transition-colors">
                                    <FileText size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-neutral-300 truncate group-hover:text-white">{doc.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-neutral-500 uppercase">{doc.type?.split('/')[1] || 'FILE'}</span>
                                        <span className="text-[10px] text-neutral-600">•</span>
                                        <span className="text-[10px] text-neutral-500">{formatBytes(doc.size || 0)}</span>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-neutral-500 hover:text-white"><ChevronRight size={14} /></Button>
                            </a>
                        ))
                    ) : (
                        <div className="p-4 rounded-lg border border-dashed border-neutral-800 flex flex-col items-center justify-center text-center gap-2 text-neutral-500">
                            <FileSpreadsheet size={24} className="opacity-20" />
                            <p className="text-xs">No hay documentos adjuntos</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 5. Checklist (Simplified) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-1">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Checklist Operativo</h3>
                    <span className="text-xs font-bold text-blue-500">{checklistProgress}%</span>
                </div>

                <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                    <div className="p-3 bg-neutral-900 border-b border-neutral-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-300 uppercase">{currentGroupName || 'General'}</span>
                        <div className="h-1.5 w-16 bg-neutral-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${checklistProgress}%` }} />
                        </div>
                    </div>
                    <div className="p-3">
                        <LaneChecklist
                            groupName={currentGroupName}
                            onToggle={(id) => toggleChecklistItem(id)}
                            checklistStatus={{}} // Logic handles this internally usually or via context
                            progress={checklistProgress}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};
