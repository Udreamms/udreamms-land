import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface GroupData {
    id: string;
    name: string;
}

interface CreateClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    groups: GroupData[];
}

export function CreateClientModal({ isOpen, onClose, groups }: CreateClientModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        if (!selectedGroupId) {
            // Fallback if no group selected, try to select first one again
            if (groups.length > 0) setSelectedGroupId(groups[0].id);
            else {
                toast.error("No hay grupos/columnas disponibles para agregar el cliente.");
                return;
            }
        }

        const groupIdToUse = selectedGroupId || groups[0]?.id;

        try {
            await addDoc(collection(db, 'kanban-groups', groupIdToUse, 'cards'), {
                contactName: name,
                contactNumber: phone,
                createdAt: serverTimestamp(),
                groupId: groupIdToUse, // Redundant but useful for flattened queries
                // Initialize empty/default fields
                email: '',
                description: '',
                checkIns: [],
                messages: []
            });

            toast.success("Cliente creado exitosamente");
            setName('');
            setPhone('');
            onClose();
        } catch (error: any) {
            console.error("Error creating client:", error);
            toast.error("Error al crear cliente: " + error.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-neutral-400">
                            Nombre
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                            placeholder="Ej. Juan Pérez"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right text-neutral-400">
                            Teléfono
                        </Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="col-span-3 bg-neutral-800 border-neutral-700 text-white"
                            placeholder="+52 123 456 7890"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="group" className="text-right text-neutral-400">
                            Etapa
                        </Label>
                        <Select
                            value={selectedGroupId}
                            onValueChange={setSelectedGroupId}
                        >
                            <SelectTrigger className="col-span-3 bg-neutral-800 border-neutral-700 text-white">
                                <SelectValue placeholder="Selecciona una etapa" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                {groups.map(group => (
                                    <SelectItem key={group.id} value={group.id}>
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-neutral-800 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Crear Cliente
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
