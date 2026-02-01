import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TabAddressProps {
    contact: any;
    updateField: (field: string, value: any) => void;
}

export const TabAddress: React.FC<TabAddressProps> = ({ contact, updateField }) => {
    return (
        <div className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Dirección de Domicilio Actual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Dirección Completa</Label>
                        <Input value={contact.address || ''} onChange={e => updateField('address', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" placeholder="Calle, Número, Depto..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Ciudad</Label>
                            <Input value={contact.city || ''} onChange={e => updateField('city', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Estado/Provincia</Label>
                            <Input value={contact.state || ''} onChange={e => updateField('state', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">País</Label>
                            <Input value={contact.country || ''} onChange={e => updateField('country', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Código Postal</Label>
                            <Input value={contact.postalCode || ''} onChange={e => updateField('postalCode', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Teléfono Personal</Label>
                            <Input value={contact.phone || ''} onChange={e => updateField('phone', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Email Personal</Label>
                            <Input value={contact.email || ''} onChange={e => updateField('email', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Información Previa en EE.UU.</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Dirección de Hospedaje en EE.UU.</Label>
                        <Input value={contact.usAddress || ''} onChange={e => updateField('usAddress', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
