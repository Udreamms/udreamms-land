
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp, query, writeBatch, Timestamp } from 'firebase/firestore';
import Card from './Card';
import { Plus, Trash2, MoreVertical, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Interface para Tipado de Tarjetas ---
interface CardData {
    id: string;
    groupId: string;
    contactName: string;
    lastMessage: string;
    channel: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    messages: any[];
}

const colors = [
    { name: 'Predeterminado', value: 'bg-neutral-900/50', cardColor: 'bg-neutral-800' },
    { name: 'Piedra', value: 'bg-stone-900/50', cardColor: 'bg-stone-800' },
    { name: 'Naranja', value: 'bg-orange-900/50', cardColor: 'bg-orange-800' },
    { name: 'Amarillo', value: 'bg-yellow-900/50', cardColor: 'bg-yellow-800' },
    { name: 'Verde', value: 'bg-green-900/50', cardColor: 'bg-green-800' },
    { name: 'Azul', value: 'bg-blue-900/50', cardColor: 'bg-blue-800' },
    { name: 'Púrpura', value: 'bg-purple-900/50', cardColor: 'bg-purple-800' },
    { name: 'Rosa', value: 'bg-pink-900/50', cardColor: 'bg-pink-800' },
    { name: 'Rojo', value: 'bg-red-900/50', cardColor: 'bg-red-800' },
];

const Group = ({ group, onCardClick, onUpdateColor }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id, data: { type: 'GROUP', group } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  useEffect(() => {
    if (!group.id) return;
    const cardsQuery = query(collection(db, `kanban-groups/${group.id}/cards`));
    
    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, groupId: group.id })) as CardData[];
      cardsData.sort((a, b) => (b.updatedAt?.toDate()?.getTime() || 0) - (a.updatedAt?.toDate()?.getTime() || 0));
      setCards(cardsData);
    });
    return () => unsubscribe();
  }, [group.id]);

  const handleAddCard = async () => {
    await addDoc(collection(db, `kanban-groups/${group.id}/cards`), {
      contactName: "Nuevo Contacto",
      lastMessage: 'Conversación iniciada...',
      channel: 'Manual',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messages: [],
    });
  };

  const handleDeleteGroup = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el grupo "${group.name}"? Esta acción no se puede deshacer.`)) {
      const batch = writeBatch(db);
      cards.forEach((card) => {
        const cardRef = doc(db, `kanban-groups/${group.id}/cards`, card.id);
        batch.delete(cardRef);
      });
      const groupRef = doc(db, 'kanban-groups', group.id);
      batch.delete(groupRef);
      await batch.commit();
    }
  };
  
  const selectedColor = colors.find(c => c.value === group.color) || colors[0];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col w-96 flex-shrink-0 h-full" // Ancho aumentado a w-96
    >
      <div className={`${selectedColor.value} rounded-t-lg p-3 flex flex-col`}>
        <div {...attributes} {...listeners} className="flex justify-between items-center cursor-grab touch-none">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white truncate">{group.name}</h2>
            <span className="text-xs text-neutral-300 bg-black/30 px-2 py-0.5 rounded-full">
              {cards.length}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-black/20">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-neutral-800 border-neutral-700 text-white shadow-lg">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="hover:bg-neutral-700">
                  <Palette className="mr-2" size={16} />
                  Cambiar Color
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-neutral-800 border-neutral-700 text-white">
                    {colors.map(color => (
                      <DropdownMenuItem key={color.name} onClick={() => onUpdateColor(group.id, color.value)} className="hover:bg-neutral-700">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.value.replace('/50', '').replace('-900', '-500')}`}></div>
                          {color.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={handleDeleteGroup} className="cursor-pointer focus:bg-red-500/20 text-red-400 focus:text-red-300">
                <Trash2 className="mr-2" size={16} />
                Eliminar Grupo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Scrollbar oculto */}
      <div className="flex-grow overflow-y-auto bg-black/30 p-2 rounded-b-lg space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <SortableContext items={cards.map(c => c.id)}>
          {cards.map((card) => (
            <Card key={card.id} card={card} groupId={group.id} onClick={() => onCardClick(card)} cardColor={selectedColor.cardColor} />
          ))}
        </SortableContext>
        
        <Button variant="ghost" onClick={handleAddCard} className="w-full text-sm text-neutral-400 hover:text-white hover:bg-neutral-700/50 mt-2">
          <Plus className="mr-2" size={16} /> Añadir Tarjeta
        </Button>
      </div>
    </div>
  );
};

export default Group;
