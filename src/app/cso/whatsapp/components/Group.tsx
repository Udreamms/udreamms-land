
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import Card from './Card';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Group = ({ group }) => {
  const [cards, setCards] = useState([]);
  const [newCardContent, setNewCardContent] = useState('');

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
    const cardsQuery = query(collection(db, `kanban-groups/${group.id}/cards`), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(cardsQuery, (snapshot) => {
      setCards(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [group.id]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (newCardContent.trim() !== '') {
      await addDoc(collection(db, `kanban-groups/${group.id}/cards`), {
        content: newCardContent,
        createdAt: serverTimestamp()
      });
      setNewCardContent('');
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el grupo "${group.name}"?`)) {
      await deleteDoc(doc(db, 'kanban-groups', group.id));
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-900/50 backdrop-blur-sm text-white rounded-lg w-72 flex-shrink-0 h-fit"
    >
      <div className="p-4 flex flex-col">
        <div {...attributes} {...listeners} className="flex justify-between items-center mb-4 cursor-grab touch-none">
          <h2 className="font-bold text-gray-200">{group.name}</h2>
          <Button variant="ghost" size="sm" onClick={handleDeleteGroup} className="text-gray-400 hover:text-white">
            <Trash2 size={16} />
          </Button>
        </div>

        {/* --- CORRECCIÓN FINAL DE ESTILO --- */}
        {/* Se elimina la altura mínima para un crecimiento natural. */}
        <div className="space-y-2">
          <SortableContext items={cards.map(c => c.id)}>
            {cards.map((card) => (
              <Card key={card.id} card={card} groupId={group.id} />
            ))}
          </SortableContext>
        </div>

        <form onSubmit={handleAddCard} className="mt-4">
          <Input
            type="text"
            value={newCardContent}
            onChange={(e) => setNewCardContent(e.target.value)}
            placeholder="Nueva tarjeta..."
            className="bg-gray-800 border-gray-700 rounded w-full mb-2 text-sm"
            autoComplete="off"
          />
          <Button variant="ghost" type="submit" className="w-full text-sm text-gray-400 hover:text-white">
            <Plus className="mr-2" size={16} /> Crear Tarjeta
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Group;
