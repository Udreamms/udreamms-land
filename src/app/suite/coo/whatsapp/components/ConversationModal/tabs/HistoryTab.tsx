import React from 'react';
import { CardData } from '../types';
import { Clock, MessageSquare, Phone, FileText, Edit, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryTabProps {
    liveCardData: CardData | null;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ liveCardData }) => {
    // Combine real messages with some simulated "system events" for a rich history view
    const messages = liveCardData?.messages || [];

    // Convert messages to history items
    const messageEvents = messages.map((msg: any, index: number) => ({
        id: `msg-${index}`,
        type: 'message',
        content: msg.text || (msg.file ? 'Archivo enviado' : 'Mensaje'),
        timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(),
        icon: MessageSquare,
        color: 'text-blue-400',
        isSystem: false
    }));

    // Simulated system events (In a real app, these would come from an audit log collection)
    const systemEvents = [
        {
            id: 'sys-1',
            type: 'edit',
            content: 'Datos de contacto actualizados',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            icon: Edit,
            color: 'text-yellow-400',
            isSystem: true
        },
        {
            id: 'sys-2',
            type: 'status',
            content: 'Movido a "Negociación"',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            icon: ArrowRight,
            color: 'text-purple-400',
            isSystem: true
        }
    ];

    // Merge and sort by date descending
    const allInteractions = [...messageEvents, ...systemEvents].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const formatDate = (date: Date) => {
        const now = new Date();
        const diff = (now.getTime() - date.getTime()) / 1000; // seconds

        if (diff < 60) return 'Hace un momento';
        if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const creationDate = (liveCardData as any)?.createdAt?.seconds
        ? new Date((liveCardData as any).createdAt.seconds * 1000).toLocaleDateString()
        : 'Fecha desconocida';

    return (
        <div className="h-full pt-4 pb-20 overflow-y-auto custom-scrollbar">
            <h3 className="text-[9px] font-medium text-neutral-600 uppercase tracking-widest mb-4 px-4 sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10 py-2 border-b border-white/5">
                Activity Log
            </h3>

            <div className="space-y-0">
                {allInteractions.map((item) => (
                    <div key={item.id} className="group flex items-start px-4 py-2 hover:bg-neutral-900/50 border-b border-transparent hover:border-white/5 transition-all">
                        <div className="w-16 flex-shrink-0 pt-0.5">
                            <span className="text-[9px] text-neutral-600 block leading-tight">
                                {formatDate(item.timestamp).split(' ').slice(0, 2).join(' ')}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0 flex items-start gap-3">
                            {/* Keep icon very minimal or remove if purely text requested. Keeping minimal icon for context but making it text-aligned */}
                            <div className="pt-0.5">
                                <item.icon size={10} className={cn("opacity-60", item.color)} />
                            </div>

                            <div className="flex-1">
                                <p className="text-[11px] text-neutral-300 leading-tight break-words">
                                    {item.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Initial Creation (Bottom) */}
                <div className="group flex items-start px-4 py-3 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="w-16 flex-shrink-0 pt-0.5">
                        <span className="text-[9px] text-neutral-600 block leading-tight">
                            {creationDate}
                        </span>
                    </div>
                    <div className="flex-1 flex items-start gap-3">
                        <div className="pt-0.5">
                            <Clock size={10} className="text-neutral-500" />
                        </div>
                        <p className="text-[11px] text-neutral-400 font-mono leading-tight">
                            Conversación iniciada
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
