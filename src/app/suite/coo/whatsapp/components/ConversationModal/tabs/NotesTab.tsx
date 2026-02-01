import React from 'react';
import { CheckCircle, CheckCheck, User, Edit2, Trash2, FileText, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CardData, Note, CheckIn } from '../types';

interface NotesTabProps {
    liveCardData: CardData | null;
    isAddingCheckIn: boolean;
    setIsAddingCheckIn: (val: boolean) => void;
    newCheckIn: string;
    setNewCheckIn: (val: string) => void;
    handleSaveCheckIn: () => Promise<void>;
    handleToggleCheckIn: (checkIn: CheckIn) => Promise<void>;
    editingCheckInId: string | null;
    setEditingCheckInId: (id: string | null) => void;
    editText: string;
    setEditText: (val: string) => void;
    handleSaveEditedCheckIn: () => Promise<void>;
    handleEditCheckIn: (checkIn: CheckIn) => void;
    handleDeleteCheckIn: (id: string) => Promise<void>;
    isAddingNote: boolean;
    setIsAddingNote: (val: boolean) => void;
    newNote: string;
    setNewNote: (val: string) => void;
    handleSaveNote: () => Promise<void>;
    editingNoteId: string | null;
    setEditingNoteId: (id: string | null) => void;
    handleEditNote: (note: Note) => void;
    handleDeleteNote: (id: string) => Promise<void>;
    handleSaveEditedNote: () => Promise<void>;
}

export const NotesTab: React.FC<NotesTabProps> = ({
    liveCardData,
    isAddingCheckIn,
    setIsAddingCheckIn,
    newCheckIn,
    setNewCheckIn,
    handleSaveCheckIn,
    handleToggleCheckIn,
    editingCheckInId,
    setEditingCheckInId,
    editText,
    setEditText,
    handleSaveEditedCheckIn,
    handleEditCheckIn,
    handleDeleteCheckIn,
    isAddingNote,
    setIsAddingNote,
    newNote,
    setNewNote,
    handleSaveNote,
    editingNoteId,
    setEditingNoteId,
    handleEditNote,
    handleDeleteNote,
    handleSaveEditedNote
}) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            setShowScrollButton(scrollHeight - scrollTop > clientHeight + 50);
        }
    };

    React.useEffect(() => {
        const timer = setTimeout(checkScroll, 100);
        return () => clearTimeout(timer);
    }, [liveCardData, isAddingCheckIn, isAddingNote]);

    return (
        <div className="relative flex-1 flex flex-col min-h-0 h-full overflow-hidden">
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-24"
            >
                {/* Intel Header */}
                <div className="mb-6 flex flex-col gap-1">
                    <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em] mb-1">Operational Intelligence</h3>
                    <h2 className="text-xl font-bold text-white leading-tight">LÍNEA DE VIDA</h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Columna 1: Check-ins */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10 py-1 border-b border-neutral-800/50">
                            <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em] px-1">
                                HITOS
                            </h3>
                            <Button
                                onClick={() => setIsAddingCheckIn(true)}
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-neutral-600 hover:text-white rounded-full hover:bg-neutral-800"
                            >
                                <CheckCheck size={12} />
                            </Button>
                        </div>

                        {isAddingCheckIn && (
                            <div className="mb-4 pl-2 border-l-2 border-blue-500/50">
                                <Textarea
                                    value={newCheckIn}
                                    onChange={(e) => setNewCheckIn(e.target.value)}
                                    placeholder="Nuevo hito..."
                                    className="bg-transparent border-none min-h-[60px] p-0 text-white placeholder:text-neutral-700 text-[11px] resize-none focus:ring-0 leading-tight"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button variant="ghost" onClick={() => setIsAddingCheckIn(false)} className="text-[9px] h-5 font-bold text-neutral-600 uppercase tracking-wider hover:text-neutral-400 p-0">Cancel</Button>
                                    <Button variant="ghost" onClick={handleSaveCheckIn} className="text-[9px] h-5 font-bold text-blue-500 uppercase tracking-wider hover:text-blue-400 p-0 ml-2">Save</Button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col">
                            {Array.isArray(liveCardData?.checkIns) && liveCardData.checkIns.length > 0 ? (
                                liveCardData.checkIns.map((checkIn) => (
                                    <div key={checkIn.id} className={cn(
                                        "group flex items-start gap-4 px-2 py-3 hover:bg-white/[0.02] transition-colors rounded-md border-b border-transparent",
                                        checkIn.completed ? "opacity-40" : ""
                                    )}>
                                        <button
                                            onClick={() => handleToggleCheckIn(checkIn)}
                                            className={cn(
                                                "mt-0.5 w-3 h-3 rounded-[2px] flex items-center justify-center flex-shrink-0 transition-colors border",
                                                checkIn.completed ? "bg-blue-500/20 border-blue-500/50 text-blue-400" : "bg-transparent border-neutral-700 hover:border-blue-500/50 text-transparent"
                                            )}
                                        >
                                            <CheckCheck size={8} className={checkIn.completed ? "block" : "hidden"} />
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            {editingCheckInId === checkIn.id ? (
                                                <div className="w-full">
                                                    <Textarea
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="min-h-[40px] bg-transparent border-b border-blue-500/50 p-0 text-neutral-200 resize-none text-[10px] focus:ring-0 rounded-none leading-tight"
                                                        autoFocus
                                                        onBlur={handleSaveEditedCheckIn}
                                                    />
                                                </div>
                                            ) : (
                                                <p className={cn("text-[13px] leading-tight break-words font-bold", checkIn.completed ? "line-through text-neutral-600" : "text-neutral-200")}>
                                                    {checkIn.text}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                                                    {checkIn.timestamp?.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingCheckInId(checkIn.id)} className="p-1 text-neutral-600 hover:text-blue-400"><Edit2 size={10} /></button>
                                                    <button onClick={() => handleDeleteCheckIn(checkIn.id)} className="p-1 text-neutral-600 hover:text-red-400"><Trash2 size={10} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center opacity-20 italic text-[9px] font-black uppercase tracking-widest">No milestones</div>
                            )}
                        </div>
                    </div>

                    {/* Columna 2: Notas */}
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2 sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-sm z-10 py-1 border-b border-neutral-800/50">
                            <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em] px-1">
                                NOTAS
                            </h3>
                            <Button
                                onClick={() => setIsAddingNote(true)}
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-neutral-600 hover:text-white rounded-full hover:bg-neutral-800"
                            >
                                <FileText size={12} />
                            </Button>
                        </div>

                        {isAddingNote && (
                            <div className="mb-4 pl-2 border-l-2 border-purple-500/50">
                                <Textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Nueva nota..."
                                    className="bg-transparent border-none min-h-[80px] p-0 text-white placeholder:text-neutral-700 text-[11px] resize-none focus:ring-0 leading-tight"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <Button variant="ghost" onClick={() => setIsAddingNote(false)} className="text-[9px] h-5 font-bold text-neutral-600 uppercase tracking-wider hover:text-neutral-400 p-0">Cancel</Button>
                                    <Button variant="ghost" onClick={handleSaveNote} className="text-[9px] h-5 font-bold text-purple-500 uppercase tracking-wider hover:text-purple-400 p-0 ml-2">Save</Button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col">
                            {Array.isArray(liveCardData?.notes) && liveCardData.notes.length > 0 ? (
                                liveCardData.notes.map((note) => (
                                    <div key={note.id} className="group flex flex-col gap-1 px-2 py-4 hover:bg-white/[0.02] transition-colors rounded-md border-b border-transparent">
                                        {editingNoteId === note.id ? (
                                            <div className="space-y-2">
                                                <Textarea
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="min-h-[60px] bg-transparent border-b border-purple-500/50 p-0 text-neutral-200 resize-none text-[10px] font-mono focus:ring-0 rounded-none leading-tight"
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="ghost" onClick={() => setEditingNoteId(null)} className="text-[9px] h-4 p-0 text-neutral-600 hover:text-white">Cancel</Button>
                                                    <Button variant="ghost" onClick={handleSaveEditedNote} className="text-[9px] h-4 p-0 text-purple-500 hover:text-purple-400">Save</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <p className="text-[13px] text-neutral-200 font-bold leading-relaxed whitespace-pre-wrap break-words">{note.text}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-wider">{note.author || 'INTEL'}</span>
                                                        <span className="text-[9px] text-neutral-800">|</span>
                                                        <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                                                            {note.timestamp?.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditNote(note)} className="p-1 text-neutral-600 hover:text-blue-400"><Edit2 size={10} /></button>
                                                        <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-neutral-600 hover:text-red-400"><Trash2 size={10} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center opacity-20 italic text-[9px] font-black uppercase tracking-widest">No insights</div>
                            )}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {showScrollButton && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: 10, x: '-50%' }}
                            className="absolute bottom-6 left-1/2 z-20"
                        >
                            <Button
                                onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-12 w-12 shadow-[0_0_20px_rgba(147,51,234,0.4)] flex items-center justify-center border border-white/10 group animate-bounce"
                            >
                                <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
