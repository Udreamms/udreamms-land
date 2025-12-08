
'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
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

const Card = ({ card, groupId, onClick, cardColor = 'bg-neutral-800' }) => {
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
    const now = new Date();
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000;
    const diffInDays = diffInSeconds / 86400;

    if (diffInDays < 1) return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (diffInDays < 7) return date.toLocaleDateString('es-ES', { weekday: 'short' });
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
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
        className={`group relative ${cardColor} p-3 rounded-lg shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-200 touch-none flex items-start gap-2`}
      >
        <div {...attributes} {...listeners} className="cursor-grab text-neutral-500 hover:text-white p-1">
            <GripVertical size={18} />
        </div>
        <div onClick={onClick} className="flex-grow cursor-pointer">
            <div className="flex justify-between items-start w-full">
                <div className="flex items-center gap-2 mb-1">
                    <WhatsappIcon className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="font-semibold text-base text-white truncate">{card.contactName || 'Desconocido'}</span>
                </div>
                <span className="text-xs text-neutral-400 whitespace-nowrap pl-2">{formatTimestamp(card.updatedAt || card.createdAt)}</span>
            </div>
            
            <p className="text-sm text-neutral-300 break-words line-clamp-2">
                {card.lastMessage || '...'}
            </p>

            <div className="flex items-center gap-2 mt-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                    <span className="text-lg -mb-1 cursor-default">{flag}</span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-neutral-900 text-white border-neutral-700">
                    <p>{code} {card.contactNumber || ''}</p>
                    </TooltipContent>
                </Tooltip>
                <span className="text-xs text-neutral-400">{card.contactNumber || 'Sin número'}</span>
            </div>
            
            <Button
                variant="ghost"
                size="icon"
                onClick={handleOpenDeleteDialog}
                className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-opacity h-7 w-7"
                aria-label="Eliminar tarjeta"
            >
                <Trash2 size={15} />
            </Button>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-700 text-white">
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
                className="col-span-3 bg-neutral-800 border-neutral-600 focus:ring-blue-500"
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
