
'use client';

import React from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Card = ({ card, groupId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    // --- CORRECCIÓN CLAVE ---
    // Añadimos el groupId a los datos del elemento arrastrable.
    // Ahora, cuando se mueva la tarjeta, sabremos de qué grupo proviene.
    data: {
      type: 'CARD',
      card: { ...card, groupId },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDeleteCard = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar esta tarjeta?`)) {
      await deleteDoc(doc(db, `kanban-groups/${groupId}/cards`, card.id));
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-gray-800 p-3 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-colors duration-200 touch-none"
    >
      <span className="text-sm text-gray-200">{card.content}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDeleteCard}
        className="invisible group-hover:visible text-gray-400 hover:text-white"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

export default Card;
