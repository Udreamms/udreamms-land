import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Edit, Save, Activity, X, Mail, Phone, Globe, Building, MapPin,
    CreditCard, User, Calendar, CheckCheck, ArrowUpRight, ExternalLink,
    Briefcase, Plus, RefreshCw, DollarSign, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { EnhancedContactForm } from './EnhancedContactForm';
import { cn, formatPhoneNumber } from "@/lib/utils";

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
            <DialogContent className="bg-[#080808]/95 border-neutral-800 text-white sm:max-w-7xl p-0 overflow-hidden outline-none rounded-[3rem] backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-white/5 h-[90vh] flex flex-col">
                <DialogTitle className="sr-only">Contact Details</DialogTitle>
                <DialogDescription className="sr-only">View and edit contact information.</DialogDescription>

                {/* Header */}
                <div className="bg-gradient-to-br from-blue-900/30 via-transparent to-transparent p-10 border-b border-white/5 relative shrink-0">
                    <div className="absolute top-0 right-0 p-8 space-x-2 flex">
                        {/* Close / Action buttons could go here if needed, but Dialog has default close usually, or we add custom one */}
                        <Button onClick={() => onOpenChange(false)} variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
                            <X className="w-6 h-6" />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-10">
                        <motion.div
                            initial={{ scale: 0.8, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-medium shadow-[0_25px_50px_rgb(37,99,235,0.4)] relative"
                        >
                            {selectedContact.name?.charAt(0)}
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-[6px] border-[#0c0c0c] rounded-full shadow-lg" />
                        </motion.div>
                        <div className="flex-1 max-w-xl">
                            <h1 className="text-5xl font-medium tracking-tighter mb-4 text-white">
                                {selectedContact.name}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <Badge variant="outline" className="px-5 py-2 border-blue-500/50 text-blue-400 bg-blue-500/10 font-medium tracking-widest text-[10px] uppercase rounded-full">
                                    <Activity className="w-3.5 h-3.5 mr-2" /> {selectedContact.stage === 'Closed' ? 'Completado' : selectedContact.stage}
                                </Badge>
                                <span className="text-neutral-400 font-medium text-sm uppercase tracking-wider">ESTABLISHED {selectedContact.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs for Overview vs Full Profile */}
                <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-10 pt-6 border-b border-white/5 bg-black/20">
                        <TabsList className="bg-transparent space-x-6 p-0 h-auto">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 text-neutral-500 text-xs font-medium tracking-widest uppercase py-4 rounded-none transition-all">
                                Dashboard Overview
                            </TabsTrigger>
                            <TabsTrigger value="profile" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 text-neutral-500 text-xs font-medium tracking-widest uppercase py-4 rounded-none transition-all">
                                Full Profile & Data
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#080808]">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* Block 1: Digital Identity */}
                            <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4">Digital Identity</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <Mail className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Electronic Mail</p>
                                                <p className="text-lg text-neutral-200 font-medium tracking-tight truncate">
                                                    {selectedContact.email || '---'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <Phone className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Direct Line</p>
                                                <p className="text-lg text-neutral-200 font-medium tracking-tight">
                                                    {formatPhoneNumber(selectedContact.phone)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <Globe className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Global Web</p>
                                                <p className="text-lg text-neutral-200 font-medium tracking-tight truncate">
                                                    {selectedContact.website || 'No URL'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <Building className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Organization</p>
                                                <p className="text-lg text-neutral-200 font-medium tracking-tight">
                                                    {selectedContact.company || 'No disponible'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <MapPin className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Location</p>
                                                <p className="text-lg text-neutral-200 font-medium tracking-tight">
                                                    {selectedContact.city || selectedContact.address || 'No disponible'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Block 2: Traveler Details & Bio */}
                            <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4 uppercase">Traveler Details</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <CreditCard className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Passport / ID</p>
                                                <p className="text-lg text-neutral-200 font-medium tracking-tight">
                                                    {selectedContact.passport || '---'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <User className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Gender</p>
                                                <p className="text-lg text-neutral-200 font-medium tracking-tight uppercase">
                                                    {selectedContact.gender || '---'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/5 flex items-center justify-center mr-6 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                <Calendar className="w-6 h-6 text-neutral-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] text-neutral-500 font-medium tracking-[0.2em] mb-1 uppercase">Date of Birth</p>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-lg text-neutral-200 font-medium tracking-tight">
                                                        {getDateString(selectedContact.birthDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-center justify-between bg-neutral-900/50 rounded-xl p-4 border border-white/5">
                                                <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">Client Type</span>
                                                <span className="text-sm font-medium text-white uppercase bg-blue-600 px-3 py-1 rounded-lg shadow-lg shadow-blue-900/20">{selectedContact.clientType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Block 3: Kanban Trajectory */}
                            <div className="bg-white/[0.01] rounded-[2.5rem] border border-white/5 p-10 space-y-8 relative h-full">
                                <div className="absolute top-0 right-0 p-8">
                                    <h3 className="text-neutral-600 font-medium text-[10px] tracking-widest uppercase">TIMELINE</h3>
                                </div>
                                <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 flex items-center">
                                    <Activity className="w-4 h-4 mr-3 text-blue-500 animate-pulse" />
                                    Kanban Trajectory
                                </h3>

                                <div className="relative pl-8 space-y-12 border-l-2 border-dashed border-neutral-800 ml-3 py-4">
                                    <div
                                        className={`relative cursor-pointer group/step transition-all ${selectedContact.stage === 'Prospecting' ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-100'} `}
                                        onClick={() => handleUpdateStage('Prospecting')}
                                    >
                                        <div className="absolute -left-[45px] top-1 w-8 h-8 rounded-2xl border-4 border-[#080808] bg-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center group-hover/step:scale-110 transition-transform">
                                            <CheckCheck className="text-[#080808] w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 font-extrabold tracking-widest uppercase mb-1">Entry Phase</p>
                                            <p className="text-xl font-medium text-neutral-200 leading-none">Prospecting</p>
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
                                            <p className="text-xl font-medium text-neutral-200 leading-none">In Progress</p>
                                            {selectedContact.stage === 'In Progress' && (
                                                <div className="mt-3 flex items-center space-x-2">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                                                    <span className="text-[9px] font-medium text-blue-500 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">System focus active</span>
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
                                            <p className="text-xl font-medium text-neutral-300 leading-none">Completado</p>
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full mt-10 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-medium py-8 rounded-2xl shadow-2xl shadow-blue-900/40 relative group overflow-hidden active:scale-95 transition-all">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <span className="flex items-center text-lg">
                                        <ExternalLink className="w-6 h-6 mr-3" /> OPEN SECURE ARCHIVE
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Neural Taxonomy & Tags */}
                        <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/5 p-10 mt-10">
                            <h3 className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 mb-6 border-l-4 border-blue-600 pl-4 uppercase">Neural Taxonomy</h3>
                            <div className="flex flex-wrap gap-3">
                                {(selectedContact.tags || []).map((tag: string) => (
                                    <Badge key={tag} className="bg-neutral-900 text-neutral-300 border border-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-widest hover:bg-neutral-800 transition-colors group/tag relative pr-9">
                                        {tag}
                                        <X
                                            onClick={() => handleRemoveTag(tag)}
                                            className="w-3.5 h-3.5 ml-3 absolute right-3 cursor-pointer opacity-30 hover:opacity-100 hover:text-red-500 transition-all"
                                        />
                                    </Badge>
                                ))}
                                {isAddingTag ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            autoFocus
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                            onBlur={() => !newTag && setIsAddingTag(false)}
                                            className="h-10 w-32 bg-neutral-900 border-neutral-800 rounded-full px-4 text-xs font-medium"
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
                                        className="h-10 px-5 text-[11px] font-medium border-dashed border-neutral-800 bg-transparent text-neutral-400 hover:text-blue-400 hover:border-blue-500/50 rounded-full transition-all flex items-center"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> ADD LABEL
                                    </Button>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="profile" className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#050505] data-[state=inactive]:hidden">
                        <EnhancedContactForm contact={selectedContact} onChange={setSelectedContact} />
                    </TabsContent>
                </Tabs>

            </DialogContent>
        </Dialog>
    );
};
