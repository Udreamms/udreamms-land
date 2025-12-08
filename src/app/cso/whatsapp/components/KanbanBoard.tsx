
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { db, functions } from '@/lib/firebase'; // Import functions
import { httpsCallable } from 'firebase/functions'; // Import httpsCallable
import {
  collection, onSnapshot, addDoc, serverTimestamp, query,
  doc, deleteDoc, getDoc, setDoc, writeBatch, orderBy, updateDoc,
  collectionGroup, where, getDocs, Timestamp
} from 'firebase/firestore';
import Group from './Group';
import Card from './Card';
import ConversationModal from './ConversationModal';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

// --- Interfaces para Tipado ---
interface GroupData {
  id: string;
  name: string;
  order: number;
  color: string;
  createdAt: Timestamp;
}

interface CardData {
    id: string;
    groupId: string;
    contactName: string;
    contactNumber?: string;
    [key: string]: any;
}

const moveCard = httpsCallable(functions, 'moveCard');

const KanbanBoard = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [activeGroup, setActiveGroup] = useState<GroupData | null>(null);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CardData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const groupIds = useMemo(() => groups.map((g) => g.id), [groups]);

  useEffect(() => {
    const groupsQuery = query(collection(db, 'kanban-groups'), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groupsFromDb = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as GroupData[];
      setGroups(groupsFromDb);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      const cardsQuery = query(
        collectionGroup(db, 'cards'),
        where('contactName', '>=', searchTerm),
        where('contactName', '<=', searchTerm + '\uf8ff')
      );
      const cardsSnapshot = await getDocs(cardsQuery);
      const results = cardsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, groupId: doc.ref.parent.parent?.id })) as CardData[];
      setSearchResults(results);
    };

    const debounceTimeout = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (newGroupName.trim() !== '') {
      await addDoc(collection(db, 'kanban-groups'), {
        name: newGroupName, 
        order: groups.length,
        color: 'bg-neutral-900/50',
        createdAt: serverTimestamp()
      });
      setNewGroupName('');
    }
  };
  
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setSearchTerm('');
    setSearchResults([]);
  };
  
  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const handleUpdateGroupColor = async (groupId, color) => {
    const groupRef = doc(db, 'kanban-groups', groupId);
    await updateDoc(groupRef, { color });
  };

  function onDragStart(event) {
    if (event.active.data.current?.type === "GROUP") setActiveGroup(event.active.data.current.group);
    if (event.active.data.current?.type === "CARD") setActiveCard(event.active.data.current.card);
  }

  async function onDragEnd(event) {
    setActiveGroup(null);
    setActiveCard(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // --- Mover un Grupo ---
    if (active.data.current?.type === "GROUP") {
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      if (oldIndex === newIndex) return;
      const newGroups = arrayMove(groups, oldIndex, newIndex);
      setGroups(newGroups);
      const batch = writeBatch(db);
      newGroups.forEach((group, index) => {
        const groupRef = doc(db, 'kanban-groups', group.id);
        batch.update(groupRef, { order: index });
      });
      await batch.commit();
    }

    // --- Mover una Tarjeta ---
    if (active.data.current?.type === "CARD") {
      const sourceGroupId = active.data.current?.card?.groupId;
      let destGroupId = over.id;

      // Si se suelta sobre otra tarjeta, usar el groupId de esa tarjeta
      if (over.data.current?.type === 'CARD') {
        destGroupId = over.data.current.card.groupId;
      }

      if (!sourceGroupId || !destGroupId || sourceGroupId === destGroupId) {
        return;
      }
      
      const cardId = active.id;

      // Llamada a la Cloud Function
      const promise = moveCard({ sourceGroupId, destGroupId, cardId });

      toast.promise(promise, {
        loading: 'Moviendo conversación...',
        success: 'Conversación movida con éxito.',
        error: (err) => `Error al mover: ${err.message}`,
      });
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-white overflow-hidden">
      {/* Encabezado con Título y Búsqueda */}
      <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
        <div>
            <h1 className="text-2xl font-bold">Kanban de WhatsApp</h1>
            <p className="text-neutral-400 text-sm">Gestiona tus conversaciones arrastrando y soltando.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <Input 
            type="text" 
            placeholder="Buscar contacto..." 
            className="w-full bg-neutral-800/80 border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </Button>
          )}
          {(isSearching || searchResults.length > 0) && searchTerm && (
            <div className="absolute top-full mt-2 w-full bg-neutral-800 rounded-lg border border-neutral-700 z-20 shadow-lg">
              {searchResults.length > 0 ? (
                searchResults.map(card => (
                  <div key={card.id} className="p-3 hover:bg-neutral-700/80 cursor-pointer rounded-md" onClick={() => handleCardClick(card)}>
                    <p className="font-semibold">{card.contactName}</p>
                    <p className="text-sm text-neutral-400">{card.contactNumber}</p>
                  </div>
                ))
              ) : (
                <p className="p-3 text-neutral-400">No se encontraron resultados.</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex items-start flex-grow space-x-4 p-6 overflow-x-auto">
          <SortableContext items={groupIds}>
            {groups.map((group) => <Group key={group.id} group={group} onCardClick={handleCardClick} onUpdateColor={handleUpdateGroupColor} />)}
          </SortableContext>
          <div className="w-80 flex-shrink-0">
            <form onSubmit={handleAddGroup} className={`flex items-center p-2 rounded-lg transition-all duration-300 ${isInputFocused ? 'bg-neutral-800' : 'bg-neutral-900/80'}`}>
              <Input 
                type="text" 
                value={newGroupName} 
                onChange={(e) => setNewGroupName(e.target.value)} 
                placeholder="+ Añadir otro grupo" 
                className="bg-transparent text-white placeholder-neutral-400 focus:outline-none flex-grow border-none focus:ring-0" 
                autoComplete="off"
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              <Button variant="ghost" size="sm" type="submit" className={`${newGroupName.trim() ? 'opacity-100' : 'opacity-0'} transition-opacity`}><Plus /></Button>
            </form>
          </div>
        </div>
        
        {typeof document !== 'undefined' && createPortal(
          <DragOverlay>
            {activeGroup && <Group group={activeGroup} onCardClick={() => {}} onUpdateColor={() => {}} />}
            {activeCard && <Card card={activeCard} groupId={activeCard.groupId} onClick={() => {}} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      
      <ConversationModal isOpen={!!selectedCard} onClose={handleCloseModal} card={selectedCard} />
    </div>
  );
};

export default KanbanBoard;
