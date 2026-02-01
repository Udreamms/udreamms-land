import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Phone, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ContactGridProps {
    contacts: any[];
    containerVariants: any;
    itemVariants: any;
    handleContactClick: (contact: any) => void;
    setSelectedContact: (contact: any) => void;
    setIsDetailModalOpen: (open: boolean) => void;
    setIsEditingProfile: (editing: boolean) => void;
    handleDeleteContact: (id: string) => void;
}

export const ContactGrid: React.FC<ContactGridProps> = ({
    contacts,
    containerVariants,
    itemVariants,
    handleContactClick,
    setSelectedContact,
    setIsDetailModalOpen,
    setIsEditingProfile,
    handleDeleteContact
}) => {
    return (
        <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20"
        >
            {contacts.map((contact) => (
                <motion.div
                    key={contact.id}
                    variants={itemVariants}
                    onClick={() => handleContactClick(contact)}
                    className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 hover:border-blue-500/30 hover:bg-neutral-900/60 transition-all cursor-pointer group flex flex-col relative overflow-hidden shadow-xl"
                >
                    <div className="absolute top-4 right-4 z-20">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="w-4 h-4 text-neutral-400" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-neutral-900 border-neutral-800 text-white rounded-xl">
                                <DropdownMenuItem onClick={() => { setSelectedContact(contact); setIsDetailModalOpen(true); setIsEditingProfile(false); }}>Open Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteContact(contact.id)} className="text-red-400">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg mb-4 group-hover:scale-110 transition-transform">
                            {contact.name?.charAt(0)}
                        </div>
                        <Badge variant="outline" className={`${contact.stage === 'Closed' ? 'border-emerald-500/50 text-emerald-500' :
                            contact.stage === 'In Progress' ? 'border-blue-500/50 text-blue-500' : 'border-orange-500/50 text-orange-500'} px-3 py-0.5 text-[8px] uppercase tracking-widest font-bold`}>
                            {contact.stage}
                        </Badge>
                    </div>

                    <h3 className="text-lg font-black text-neutral-100 mb-1 truncate pr-10">{contact.name}</h3>
                    <p className="text-xs text-neutral-400 mb-6 truncate">{contact.email}</p>

                    <div className="space-y-2 mb-6">
                        <div className="flex items-center text-xs text-neutral-500">
                            <Phone className="w-3 h-3 mr-2" /> {contact.phone}
                        </div>
                        <div className="flex items-center text-xs text-neutral-500">
                            <ExternalLink className="w-3 h-3 mr-2" /> {contact.source}
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};
