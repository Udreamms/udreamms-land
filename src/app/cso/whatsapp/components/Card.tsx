
'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import { countryData } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Card = ({ card, groupId, onClick, cardColor = 'bg-gray-800' }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: 'CARD', card: { ...card, groupId } },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleOpenDeleteDialog = (e) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteConfirmation('');
  };

  const handleDeleteCard = async () => {
    if (deleteConfirmation === 'delete') {
      try {
        await deleteDoc(doc(db, `kanban-groups/${groupId}/cards`, card.id));
        handleCloseDeleteDialog();
      } catch (error) {
        console.error("Error deleting card: ", error);
      }
    }
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleString('es-ES', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  };
  
  const getCountryInfo = (phoneNumber) => {
    if (!phoneNumber) return { flag: '🏳️', code: 'N/A' };
    const number = phoneNumber.replace('+', '');
    
    const codes = Object.keys(countryData).sort((a, b) => b.length - a.length);
    
    for (const code of codes) {
      if (number.startsWith(code)) {
        const data = countryData[code];
        return typeof data === 'string' ? { flag: data, code: 'N/A' } : data;
      }
    }
    return { flag: '🏳️', code: 'N/A' };
  };

  const { flag, code } = getCountryInfo(card.contactNumber);

  return (
    <TooltipProvider>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={onClick}
        className={`group relative ${cardColor} p-3 rounded-lg hover:brightness-110 transition-all duration-200 touch-none cursor-grab`}
      >
        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-2">
              <WhatsappIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
              <span className="font-bold text-base text-white truncate">{card.contactName || 'Desconocido'}</span>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap pl-2">{formatTimestamp(card.updatedAt || card.createdAt)}</span>
          </div>
          <div className="flex flex-col text-left gap-2 pl-7">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">{card.contactNumber || 'Sin número'}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-lg -mt-1 cursor-default">{flag}</span>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white border-gray-700">
                  <p>{code}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs text-gray-400 mt-1 break-words pr-5">
              {card.lastMessage || '...'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenDeleteDialog}
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity h-7 w-7"
            aria-label="Eliminar tarjeta"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              Esta acción es irreversible. Para eliminar esta tarjeta, por favor escribe 'delete' en el campo de abajo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="delete-confirm" className="text-right">
                Confirmar
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="col-span-3 bg-gray-800 border-gray-600 focus:ring-blue-500"
                autoComplete="off"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteDialog}>Cancelar</Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCard}
              disabled={deleteConfirmation !== 'delete'}
            >
              Eliminar Tarjeta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default Card;
