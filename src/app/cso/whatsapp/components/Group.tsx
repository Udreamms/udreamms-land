
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
    messages: any[]; // Se puede mejorar el tipado de 'messages' si es necesario
}

// ... (resto del componente sin cambios)
const colors = [
    { name: 'Predeterminado', value: 'bg-black/50', cardColor: 'bg-gray-900' },
    { name: 'Marrón', value: 'bg-stone-950', cardColor: 'bg-stone-900' },
    { name: 'Naranja', value: 'bg-orange-950', cardColor: 'bg-orange-900' },
    { name: 'Amarillo', value: 'bg-yellow-950', cardColor: 'bg-yellow-900' },
    { name: 'Verde', value: 'bg-green-950', cardColor: 'bg-green-900' },
    { name: 'Azul', value: 'bg-blue-950', cardColor: 'bg-blue-900' },
    { name: 'Morado', value: 'bg-purple-950', cardColor: 'bg-purple-900' },
    { name: 'Rosa', value: 'bg-pink-950', cardColor: 'bg-pink-900' },
    { name: 'Rojo', value: 'bg-red-950', cardColor: 'bg-red-900' },
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
      contactName: "Nueva Tarjeta",
      lastMessage: 'Creada manualmente',
      channel: 'Manual',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messages: [],
    });
  };

  const handleDeleteGroup = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el grupo "${group.name}"?`)) {
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
      className={`${selectedColor.value} backdrop-blur-sm text-white rounded-lg w-96 flex-shrink-0 h-fit`}
    >
      <div className="p-4 flex flex-col">
        <div {...attributes} {...listeners} className="flex justify-between items-center mb-4 cursor-grab touch-none">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-200 truncate">{group.name}</h2>
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
              {cards.length}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="mr-2" size={16} />
                  Colores
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-gray-800 border-gray-700 text-white">
                    {colors.map(color => (
                      <DropdownMenuItem key={color.name} onClick={() => onUpdateColor(group.id, color.value)}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.value.replace('/50', '')}`}></div>
                          {color.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={handleDeleteGroup} className="cursor-pointer hover:bg-red-500/10 text-red-400">
                <Trash2 className="mr-2" size={16} />
                Eliminar Grupo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <SortableContext items={cards.map(c => c.id)}>
            {cards.map((card) => (
              <Card key={card.id} card={card} groupId={group.id} onClick={() => onCardClick(card)} cardColor={selectedColor.cardColor} />
            ))}
          </SortableContext>
        </div>

        <div className="mt-4">
          <Button variant="ghost" onClick={handleAddCard} className="w-full text-sm text-gray-400 hover:text-white">
            <Plus className="mr-2" size={16} /> Crear Tarjeta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Group;
