
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, onSnapshot, addDoc, serverTimestamp, query,
  doc, deleteDoc, getDoc, setDoc, writeBatch, orderBy, updateDoc,
  collectionGroup, where, getDocs, Timestamp
} from 'firebase/firestore';
import Group from './Group';
import Card from './Card';
import ConversationModal from './ConversationModal';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

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
    // Añade otras propiedades que esperas en una tarjeta
    [key: string]: any;
}


const KanbanBoard = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [activeGroup, setActiveGroup] = useState<GroupData | null>(null);
  const [activeCard, setActiveCard] = useState<CardData | null>(null); // Tipado corregido
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CardData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
        color: 'bg-black/50',
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

    if (active.data.current?.type === "CARD") {
      const sourceGroupId = active.data.current?.card?.groupId;
      let destGroupId = over.id;
      if (over.data.current?.type === 'CARD') {
        destGroupId = over.data.current.card.groupId;
      }
      if (!sourceGroupId || !destGroupId || sourceGroupId === destGroupId) return;
      const cardRef = doc(db, 'kanban-groups', sourceGroupId, 'cards', active.id);
      const cardSnap = await getDoc(cardRef);
      if (cardSnap.exists()) {
        const newCardRef = doc(db, 'kanban-groups', destGroupId, 'cards', active.id);
        await setDoc(newCardRef, { ...cardSnap.data(), updatedAt: serverTimestamp() });
        await deleteDoc(cardRef);
      }
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input 
            type="text" 
            placeholder="Buscar por nombre o número..." 
            className="w-full bg-black border-gray-700 rounded-lg pl-10 hover:bg-gray-900 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {(isSearching || searchResults.length > 0) && (
            <div className="absolute top-full mt-2 w-full bg-black rounded-lg border border-gray-700 z-10">
              {searchResults.length > 0 ? (
                searchResults.map(card => (
                  <div key={card.id} className="p-2 hover:bg-gray-900 cursor-pointer" onClick={() => handleCardClick(card)}>
                    <p className="font-bold">{card.contactName}</p>
                    <p className="text-sm text-gray-400">{card.contactNumber}</p>
                  </div>
                ))
              ) : (
                <p className="p-2 text-gray-400">No se encontraron resultados.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex items-start h-full space-x-4 p-4 overflow-x-auto">
          <SortableContext items={groupIds}>
            {groups.map((group) => <Group key={group.id} group={group} onCardClick={handleCardClick} onUpdateColor={handleUpdateGroupColor} />)}
          </SortableContext>
          <div className="w-72 flex-shrink-0">
            <form onSubmit={handleAddGroup} className="flex items-center p-2 rounded-lg bg-gray-900/50">
              <Input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="+ Nuevo grupo..." className="bg-transparent text-white placeholder-gray-400 focus:outline-none flex-grow border-none" autoComplete="off" />
              <Button variant="ghost" size="sm" type="submit"><Plus /></Button>
            </form>
          </div>
        </div>
        {document.body ? createPortal(
          <DragOverlay>
            {activeGroup && <Group group={activeGroup} onCardClick={() => {}} onUpdateColor={() => {}} />}
            {activeCard && <Card card={activeCard} groupId={activeCard.groupId} onClick={() => {}} />}
          </DragOverlay>,
          document.body
        ) : null}
      </DndContext>
      <ConversationModal isOpen={!!selectedCard} onClose={handleCloseModal} card={selectedCard} />
    </div>
  );
};

export default KanbanBoard;
