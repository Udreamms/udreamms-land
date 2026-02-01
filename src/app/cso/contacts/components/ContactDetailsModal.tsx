import React from 'react';
import { motion } from 'framer-motion';
import {
    X, Edit, Save, Activity, Mail, Phone, Globe, Building,
    MapPin, CreditCard, User, Calendar, CheckCheck,
    ArrowUpRight, ExternalLink, Briefcase, Plus, DollarSign, Clock, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { cn } from "@/lib/utils";

interface ContactDetailsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedContact: any;
    setSelectedContact: (contact: any) => void;
    isEditingProfile: boolean;
    setIsEditingProfile: (editing: boolean) => void;
    handleSaveContact: () => void;
    handleUpdateStage: (stage: string) => void;
    handleRemoveTag: (tag: string) => void;
    handleAddTag: () => void;
    newTag: string;
    setNewTag: (tag: string) => void;
    isAddingTag: boolean;
    setIsAddingTag: (adding: boolean) => void;
    getDateString: (value: any) => string;
    getDateInputValue: (value: any) => string;
    getAge: (birthDate: any) => number | null;
}

export const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
    isOpen,
    onOpenChange,
    selectedContact,
    setSelectedContact,
    isEditingProfile,
    setIsEditingProfile,
    handleSaveContact,
    handleUpdateStage,
    handleRemoveTag,
    handleAddTag,
    newTag,
    setNewTag,
    isAddingTag,
    setIsAddingTag,
    getDateString,
    getDateInputValue,
    getAge
}) => {
    if (!selectedContact) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#080808]/95 border-neutral-800 text-white sm:max-w-7xl p-0 overflow-hidden outline-none rounded-[3rem] backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/5">
                <DialogTitle className="sr-only">Contact Details</DialogTitle>
                <DialogDescription className="sr-only">View and edit contact information and history.</DialogDescription>

                <div className="flex flex-col max-h-[90vh]">
                    {/* Modal Header/Hero */}
                    <div className="bg-gradient-to-br from-blue-900/30 via-transparent to-transparent p-12 border-b border-white/5 relative">
                        <div className="absolute top-0 right-0 p-8 space-x-2 flex">
                            {!isEditingProfile ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditingProfile(true)}
                                    className="h-12 w-12 text-blue-400 hover:text-blue-100 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all shadow-lg shadow-blue-500/10"
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleSaveContact}
                                        className="h-12 w-12 text-emerald-400 hover:text-emerald-100 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-500/10"
                                    >
                                        <Save className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsEditingProfile(false)}
                                        className="h-12 w-12 text-red-300 hover:text-white rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 shadow-lg shadow-red-500/10"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </>
                            )}
                        </div>
                        <div className="flex items-center space-x-10">
                            <motion.div
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black shadow-[0_25px_50px_rgb(37,99,235,0.4)] relative"
                            >
                                {selectedContact.name?.charAt(0)}
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-[6px] border-[#0c0c0c] rounded-full shadow-lg" />
                            </motion.div>
                            <div className="flex-1 max-w-xl">
                                {!isEditingProfile ? (
                                    <h1 className="text-5xl font-black tracking-tighter mb-4 text-white">
                                        {selectedContact.name}
                                    </h1>
                                ) : (
                                    <Input
                                        value={selectedContact.name || ''}
                                        onChange={(e) => setSelectedContact({ ...selectedContact, name: e.target.value })}
                                        className="text-5xl font-black tracking-tighter mb-4 bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto cursor-text text-white"
                                    />
                                )}
                                <div className="flex items-center space-x-4">
                                    <Badge variant="outline" className="px-5 py-2 border-blue-500/50 text-blue-400 bg-blue-500/10 font-black tracking-widest text-[10px] uppercase rounded-full">
                                        <Activity className="w-3.5 h-3.5 mr-2" /> {selectedContact.stage === 'Closed' ? 'Completado' : selectedContact.stage}
                                    </Badge>
                                    <span className="text-neutral-400 font-bold text-sm uppercase tracking-wider">ESTABLISHED {selectedContact.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-10 overflow-y-auto custom-scrollbar">
                        {/* Block 1: Digital Identity */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4">Digital Identity</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Mail className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Electronic Mail</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.email || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.email || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, email: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Phone className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Direct Line</p>
                                            <Input
                                                value={selectedContact.phone || ''}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, phone: e.target.value })}
                                                className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                readOnly={!isEditingProfile}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Globe className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Global Web</p>
                                            <Input
                                                value={selectedContact.website || ''}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, website: e.target.value })}
                                                className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                placeholder="No URL"
                                                readOnly={!isEditingProfile}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Building className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Organization</p>
                                            <Input
                                                value={selectedContact.company || ''}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, company: e.target.value })}
                                                className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                placeholder="No disponible"
                                                readOnly={!isEditingProfile}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <MapPin className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Geographic Location</p>
                                            <Input
                                                value={selectedContact.address || ''}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, address: e.target.value })}
                                                className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                placeholder="No disponible"
                                                readOnly={!isEditingProfile}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <MapPin className="w-6 h-6 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Postal Code</p>
                                            <Input
                                                value={selectedContact.postalCode || ''}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, postalCode: e.target.value })}
                                                className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                placeholder="No disponible"
                                                readOnly={!isEditingProfile}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block 2: Traveler Details & Bio */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4 uppercase">Traveler Details & Bio</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <CreditCard className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Passport / ID</p>
                                            <Input
                                                value={selectedContact.passport || ''}
                                                onChange={(e) => setSelectedContact({ ...selectedContact, passport: e.target.value })}
                                                className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                placeholder="12345678"
                                                readOnly={!isEditingProfile}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <User className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Gender</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight uppercase">
                                                    {selectedContact.gender || '---'}
                                                </p>
                                            ) : (
                                                <div className="flex gap-2 mt-1">
                                                    <Button
                                                        variant={selectedContact.gender === 'man' ? 'default' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => setSelectedContact({ ...selectedContact, gender: 'man' })}
                                                        className={cn("h-7 px-4 text-[10px] font-black uppercase rounded-lg transition-all", selectedContact.gender === 'man' ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-neutral-800/50 text-neutral-500 hover:text-neutral-300")}
                                                    >
                                                        Man
                                                    </Button>
                                                    <Button
                                                        variant={selectedContact.gender === 'woman' ? 'default' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => setSelectedContact({ ...selectedContact, gender: 'woman' })}
                                                        className={cn("h-7 px-4 text-[10px] font-black uppercase rounded-lg transition-all", selectedContact.gender === 'woman' ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-neutral-800/50 text-neutral-500 hover:text-neutral-300")}
                                                    >
                                                        Woman
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <User className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Client Type</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight uppercase">
                                                    {selectedContact.clientType || '---'}
                                                </p>
                                            ) : (
                                                <div className="flex gap-2 mt-1">
                                                    <Button
                                                        variant={selectedContact.clientType === 'persona' ? 'default' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => setSelectedContact({ ...selectedContact, clientType: 'persona' })}
                                                        className={cn("h-7 px-4 text-[10px] font-black uppercase rounded-lg transition-all", selectedContact.clientType === 'persona' ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-neutral-800/50 text-neutral-500 hover:text-neutral-300")}
                                                    >
                                                        Individual
                                                    </Button>
                                                    <Button
                                                        variant={selectedContact.clientType === 'empresa' ? 'default' : 'ghost'}
                                                        size="sm"
                                                        onClick={() => setSelectedContact({ ...selectedContact, clientType: 'empresa' })}
                                                        className={cn("h-7 px-4 text-[10px] font-black uppercase rounded-lg transition-all", selectedContact.clientType === 'empresa' ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "bg-neutral-800/50 text-neutral-500 hover:text-neutral-300")}
                                                    >
                                                        Corporate
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Calendar className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-500 font-bold tracking-[0.2em] mb-1 uppercase">Date of Birth & Age</p>
                                            <div className="flex items-center gap-3">
                                                {!isEditingProfile ? (
                                                    <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                        {getDateString(selectedContact.birthDate)}
                                                    </p>
                                                ) : (
                                                    <Input
                                                        type="date"
                                                        value={getDateInputValue(selectedContact.birthDate)}
                                                        onChange={(e) => setSelectedContact({ ...selectedContact, birthDate: e.target.value })}
                                                        className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto w-40"
                                                    />
                                                )}
                                                {getAge(selectedContact.birthDate) !== null && (
                                                    <Badge className="bg-blue-600/10 text-blue-400 border border-blue-500/20 font-black text-[10px] uppercase px-3">
                                                        {getAge(selectedContact.birthDate)} years
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block 3: Kanban Trajectory */}
                        <div className="bg-white/[0.01] rounded-[2.5rem] border border-white/5 p-10 space-y-8 relative h-full">
                            <div className="absolute top-0 right-0 p-8">
                                <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white font-black text-[10px] tracking-widest">TIMELINE</Button>
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 flex items-center">
                                <Activity className="w-4 h-4 mr-3 text-blue-500 animate-pulse" />
                                Kanban Trajectory
                            </h3>

                            <div className="relative pl-8 space-y-12 border-l-2 border-dashed border-neutral-800 ml-3">
                                <div
                                    className={`relative cursor-pointer group/step transition-all ${selectedContact.stage === 'Prospecting' ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'} `}
                                    onClick={() => handleUpdateStage('Prospecting')}
                                >
                                    <div className="absolute -left-[45px] top-1 w-8 h-8 rounded-2xl border-4 border-[#080808] bg-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center group-hover/step:scale-110 transition-transform">
                                        <CheckCheck className="text-[#080808] w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neutral-400 font-extrabold tracking-widest uppercase mb-1">Entry Phase</p>
                                        <p className="text-xl font-black text-neutral-200 leading-none">Prospecting</p>
                                        <p className="text-[11px] text-neutral-400 mt-2 font-medium leading-relaxed italic opacity-70">Captured via High-Conversion Intelligence Module.</p>
                                    </div>
                                </div>
                                <div
                                    className={`relative cursor-pointer group/step transition-all ${selectedContact.stage === 'In Progress' ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'} `}
                                    onClick={() => handleUpdateStage('In Progress')}
                                >
                                    <div className={`absolute -left-[45px] top-1 w-8 h-8 rounded-2xl border-4 border-[#080808] z-10 group-hover/step:scale-110 transition-transform ${selectedContact.stage !== 'Prospecting' ? 'bg-blue-600 shadow-[0_0_25px_rgba(59,130,246,0.4)] animate-pulse' : 'bg-neutral-900 border-neutral-800'} `}>
                                        {selectedContact.stage !== 'Prospecting' && <Activity className="text-white w-4 h-4 m-1.5" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neutral-400 font-extrabold tracking-widest uppercase mb-1">Active Interaction</p>
                                        <p className="text-xl font-black text-neutral-200 leading-none">In Progress</p>
                                        {selectedContact.stage === 'In Progress' && (
                                            <div className="mt-3 flex items-center space-x-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">System focus active</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`relative cursor-pointer group/step transition-all ${selectedContact.stage === 'Closed' ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'} `}
                                    onClick={() => handleUpdateStage('Closed')}
                                >
                                    <div className={`absolute -left-[45px] top-1 w-8 h-8 rounded-2xl border-4 border-[#080808] group-hover/step:scale-110 transition-transform ${selectedContact.stage === 'Closed' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-neutral-900 border-neutral-800'} `}>
                                        {selectedContact.stage === 'Closed' && <ArrowUpRight className="text-[#080808] w-4 h-4 m-1.5" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-neutral-400 font-extrabold tracking-widest uppercase mb-1">Fulfillment</p>
                                        <p className="text-xl font-black text-neutral-300 leading-none">Completado / Final</p>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full mt-10 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-black py-8 rounded-2xl shadow-2xl shadow-blue-900/40 relative group overflow-hidden active:scale-95 transition-all">
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity" />
                                <span className="flex items-center text-lg">
                                    <ExternalLink className="w-6 h-6 mr-3" /> OPEN SECURE ARCHIVE
                                </span>
                            </Button>
                        </div>

                        {/* Block 4: Professional Information */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4 uppercase">Professional Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Briefcase className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Profession</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.profession || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.profession || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, profession: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="Ingeniero"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Briefcase className="w-6 h-6 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Occupation</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.occupation || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.occupation || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, occupation: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="Puesto actual"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Plus className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Interests</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.interests || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.interests || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, interests: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="Tecnología, viajes..."
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block 5: Social Media Ecosystem */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4 uppercase">Social Media Ecosystem</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Globe className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Instagram</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.instagram || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.instagram || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, instagram: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="@username"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Globe className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Facebook</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.facebook || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.facebook || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, facebook: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="profile url"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Globe className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">LinkedIn</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.linkedin || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.linkedin || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, linkedin: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="linkedin.com/in/..."
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block 6: Service Management */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4 uppercase">Service Management</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <RefreshCw className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Service</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.serviceType || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.serviceType || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, serviceType: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="Tipo de servicio"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <DollarSign className="w-6 h-6 text-emerald-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Payment Status</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {selectedContact.paymentStatus || '---'}
                                                </p>
                                            ) : (
                                                <Input
                                                    value={selectedContact.paymentStatus || ''}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, paymentStatus: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                                                    placeholder="Pagado, Pendiente..."
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Clock className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Start Date</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {getDateString(selectedContact.serviceStartDate)}
                                                </p>
                                            ) : (
                                                <Input
                                                    type="date"
                                                    value={getDateInputValue(selectedContact.serviceStartDate)}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, serviceStartDate: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto w-40"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                            <Clock className="w-6 h-6 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-neutral-400 font-black tracking-widest mb-1 uppercase">Delivery Date</p>
                                            {!isEditingProfile ? (
                                                <p className="text-lg text-neutral-200 font-bold tracking-tight">
                                                    {getDateString(selectedContact.serviceDeliveryDate)}
                                                </p>
                                            ) : (
                                                <Input
                                                    type="date"
                                                    value={getDateInputValue(selectedContact.serviceDeliveryDate)}
                                                    onChange={(e) => setSelectedContact({ ...selectedContact, serviceDeliveryDate: e.target.value })}
                                                    className="text-lg text-neutral-200 font-bold tracking-tight bg-transparent border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto w-40"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Block 7: Neural Taxonomy */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8 lg:col-span-3 md:col-span-2">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4 uppercase">Neural Taxonomy</h3>
                                <div className="flex flex-wrap gap-3">
                                    {(selectedContact.tags || []).map((tag: string) => (
                                        <Badge key={tag} className="bg-neutral-900 text-neutral-300 border border-white/5 px-4 py-2 text-[11px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors group/tag relative pr-9">
                                            {tag}
                                            {isEditingProfile && (
                                                <X
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="w-3.5 h-3.5 ml-3 absolute right-3 cursor-pointer opacity-30 hover:opacity-100 hover:text-red-500 transition-all"
                                                />
                                            )}
                                        </Badge>
                                    ))}
                                    {isEditingProfile && (
                                        isAddingTag ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    autoFocus
                                                    value={newTag}
                                                    onChange={(e) => setNewTag(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                                    onBlur={() => !newTag && setIsAddingTag(false)}
                                                    className="h-10 w-32 bg-neutral-900 border-neutral-800 rounded-full px-4 text-xs font-bold"
                                                    placeholder="New label..."
                                                />
                                                <Button onClick={handleAddTag} size="icon" className="h-8 w-8 rounded-full bg-blue-600">
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsAddingTag(true)}
                                                className="h-10 px-5 text-[11px] font-black border-dashed border-neutral-800 bg-transparent text-neutral-400 hover:text-blue-400 hover:border-blue-500/50 rounded-full transition-all flex items-center"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> ADD LABEL
                                            </Button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
