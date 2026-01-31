import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, UserPlus, MessageSquare, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ContactListProps {
    contacts: any[];
    containerVariants: any;
    itemVariants: any;
    isChatOpen: boolean;
    handleContactClick: (contact: any) => void;
    setSelectedContact: (contact: any) => void;
    setIsDetailModalOpen: (open: boolean) => void;
    setIsEditingProfile: (editing: boolean) => void;
    handleDeleteContact: (id: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
    contacts,
    containerVariants,
    itemVariants,
    isChatOpen,
    handleContactClick,
    setSelectedContact,
    setIsDetailModalOpen,
    setIsEditingProfile,
    handleDeleteContact
}) => {
    return (
        <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 10 }}
            className="bg-black/40 rounded-lg border border-white/5 shadow-2xl overflow-hidden"
        >
            <div className={cn(
                "grid px-6 py-3 border-b border-white/5 text-[10px] font-black text-neutral-500 uppercase tracking-widest bg-white/[0.01]",
                isChatOpen
                    ? "grid-cols-[40px_1fr_40px]"
                    : "grid-cols-[40px_2.5fr_2fr_1.5fr_1fr_1fr_1fr_80px] gap-4"
            )}>
                <div className="flex justify-center items-center">
                    <div className="w-3.5 h-3.5 border border-neutral-800 rounded"></div>
                </div>
                <div className="truncate">Identity / Name</div>
                {!isChatOpen && (
                    <>
                        <div className="truncate">Email Address</div>
                        <div className="truncate">Primary Phone</div>
                        <div className="truncate text-center">Source</div>
                        <div className="truncate text-center">Stage</div>
                        <div className="truncate">Tags</div>
                    </>
                )}
                <div className="text-right pr-2">Actions</div>
            </div>

            <motion.div className="divide-y divide-white/[0.02]">
                {contacts.map((contact) => (
                    <motion.div
                        key={contact.id}
                        variants={itemVariants}
                        onClick={() => handleContactClick(contact)}
                        className={cn(
                            "grid items-center hover:bg-white/[0.02] transition-colors cursor-pointer group",
                            isChatOpen
                                ? "grid-cols-[40px_1fr_40px] px-3 py-2"
                                : "grid-cols-[40px_2.5fr_2fr_1.5fr_1fr_1fr_1fr_80px] px-6 py-2 gap-4"
                        )}
                    >
                        <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
                            <div className="w-3.5 h-3.5 border border-neutral-800 rounded group-hover:border-neutral-600 transition-colors"></div>
                        </div>
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className={cn(
                                "rounded bg-neutral-800 flex-shrink-0 flex items-center justify-center font-bold text-neutral-400 group-hover:text-blue-400 transition-colors",
                                isChatOpen ? "w-8 h-8 text-[10px]" : "w-7 h-7 text-[9px]"
                            )}>
                                {contact.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <div className="font-bold text-neutral-200 group-hover:text-white truncate text-xs">{contact.name}</div>
                                {isChatOpen && (
                                    <span className="text-[10px] text-neutral-500 font-mono truncate">{contact.phone || contact.email}</span>
                                )}
                            </div>
                        </div>
                        {!isChatOpen && (
                            <>
                                <div className="text-neutral-400 text-[11px] truncate">{contact.email || '—'}</div>
                                <div className="text-neutral-400 font-mono text-[11px] truncate tracking-tighter">{contact.phone || '—'}</div>
                                <div className="text-neutral-500 font-bold text-[10px] tracking-tight uppercase text-center">{contact.source}</div>
                                <div className="flex justify-center">
                                    <Badge variant="outline" className={cn(
                                        "px-2 py-0 border-0 text-[9px] font-black uppercase rounded",
                                        contact.stage === 'Closed' ? 'text-emerald-500 bg-emerald-500/10' :
                                            contact.stage === 'In Progress' ? 'text-blue-500 bg-blue-500/10' :
                                                'text-orange-500 bg-orange-500/10'
                                    )}>
                                        {contact.stage}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1 items-center">
                                    {contact.tags?.slice(0, 1).map((tag: string) => (
                                        <span key={tag} className="px-1.5 py-0.5 bg-neutral-900 text-[9px] text-neutral-500 rounded border border-white/5 uppercase font-bold">{tag}</span>
                                    ))}
                                    {contact.tags?.length > 1 && <span className="text-[9px] text-neutral-600 font-bold">+{contact.tags.length - 1}</span>}
                                </div>
                            </>
                        )}
                        <div className="text-right flex justify-end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-600 hover:text-white hover:bg-white/5 rounded">
                                        <MoreVertical className="w-3.5 h-3.5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-neutral-900 border-neutral-800 text-white rounded-md shadow-2xl py-1">
                                    <DropdownMenuItem onClick={() => { setSelectedContact(contact); setIsDetailModalOpen(true); setIsEditingProfile(false); }} className="hover:bg-blue-600 rounded-sm cursor-pointer mx-1 text-xs font-bold uppercase tracking-wider py-2">
                                        <UserPlus className="w-3 h-3 mr-2" /> View Details
                                    </DropdownMenuItem>
                                    {!isChatOpen && (
                                        <DropdownMenuItem onClick={() => handleContactClick(contact)} className="hover:bg-blue-600 rounded-sm cursor-pointer mx-1 text-xs font-bold uppercase tracking-wider py-2">
                                            <MessageSquare className="w-3 h-3 mr-2" /> Open Instance
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => { handleDeleteContact(contact.id) }} className="hover:bg-red-600 rounded-sm cursor-pointer mx-1 text-xs font-bold uppercase tracking-wider py-2 text-red-500 focus:text-white">
                                        <Trash2 className="w-3 h-3 mr-2" /> Purge Profile
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {contacts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
                    <Search className="w-16 h-16 mb-6 opacity-20" />
                    <p className="text-xl font-bold tracking-tight">Zero matches detected.</p>
                </div>
            )}
        </motion.div>
    );
};
