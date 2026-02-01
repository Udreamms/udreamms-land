import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TabStudentInfoProps {
    contact: any;
    updateField: (field: string, value: any) => void;
}

export const TabStudentInfo: React.FC<TabStudentInfoProps> = ({ contact, updateField }) => {
    return (
        <div className="space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Nombres</Label>
                            <Input value={contact.firstName || ''} onChange={e => updateField('firstName', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Apellidos</Label>
                            <Input value={contact.lastName || ''} onChange={e => updateField('lastName', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                    </div>
                    {/* Fallback for legacy 'name' field if firstName/lastName not set */}
                    {!contact.firstName && !contact.lastName && (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Nombre Completo (Legacy)</Label>
                            <Input value={contact.name || ''} onChange={e => updateField('name', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Fecha de Nacimiento</Label>
                            <Input type="date" value={contact.birthDate || ''} onChange={e => updateField('birthDate', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Lugar de Nacimiento</Label>
                            <Input value={contact.birthPlace || ''} onChange={e => updateField('birthPlace', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Nacionalidad</Label>
                            <Input value={contact.nationality || ''} onChange={e => updateField('nationality', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Ciudad (Nacimiento)</Label>
                            <Input value={contact.birthCity || ''} onChange={e => updateField('birthCity', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Estado/Provincia</Label>
                            <Input value={contact.birthState || ''} onChange={e => updateField('birthState', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">País</Label>
                            <Input value={contact.birthCountry || ''} onChange={e => updateField('birthCountry', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Número de Identificación Nacional (DNI/CURP)</Label>
                        <Input value={contact.nationalId || ''} onChange={e => updateField('nationalId', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">¿Otra Nacionalidad?</Label>
                            <Select value={contact.hasOtherNationality || 'no'} onValueChange={val => updateField('hasOtherNationality', val)}>
                                <SelectTrigger className="bg-neutral-950 border-neutral-800 h-9 rounded-md">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    <SelectItem value="yes">Sí</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {contact.hasOtherNationality === 'yes' && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">¿Qué país?</Label>
                                <Input value={contact.otherNationalityCountry || ''} onChange={e => updateField('otherNationalityCountry', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">¿Residente Permanente de otro país?</Label>
                            <Select value={contact.isPermanentResidentOther || 'no'} onValueChange={val => updateField('isPermanentResidentOther', val)}>
                                <SelectTrigger className="bg-neutral-950 border-neutral-800 h-9 rounded-md">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                    <SelectItem value="yes">Sí</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {contact.isPermanentResidentOther === 'yes' && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">¿Qué país?</Label>
                                <Input value={contact.permanentResidentCountry || ''} onChange={e => updateField('permanentResidentCountry', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Estado Civil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Estado Civil</Label>
                        <Select value={contact.maritalStatus || 'single'} onValueChange={val => updateField('maritalStatus', val)}>
                            <SelectTrigger className="bg-neutral-950 border-neutral-800 h-9 rounded-md">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                <SelectItem value="single">Soltero(a)</SelectItem>
                                <SelectItem value="married">Casado(a)</SelectItem>
                                <SelectItem value="divorced">Divorciado(a)</SelectItem>
                                <SelectItem value="widowed">Viudo(a)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {contact.maritalStatus === 'married' && (
                        <div className="space-y-4 pl-4 border-l-2 border-blue-600">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Nombre del Cónyuge</Label>
                                <Input value={contact.spouseName || ''} onChange={e => updateField('spouseName', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Fecha de Matrimonio</Label>
                                    <Input type="date" value={contact.marriageDate || ''} onChange={e => updateField('marriageDate', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Fecha Nac. Cónyuge</Label>
                                    <Input type="date" value={contact.spouseBirthDate || ''} onChange={e => updateField('spouseBirthDate', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Ciudad (Cónyuge)</Label>
                                    <Input value={contact.spouseCity || ''} onChange={e => updateField('spouseCity', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Estado (Cónyuge)</Label>
                                    <Input value={contact.spouseState || ''} onChange={e => updateField('spouseState', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">País (Cónyuge)</Label>
                                    <Input value={contact.spouseCountry || ''} onChange={e => updateField('spouseCountry', e.target.value)} className="bg-neutral-950 border-neutral-800 h-9 rounded-md" />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
