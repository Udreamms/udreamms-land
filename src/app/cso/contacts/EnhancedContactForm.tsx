'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { User, Briefcase, Phone, CreditCard, Package } from 'lucide-react';

interface ContactFormProps {
    contact: any;
    onChange: (updates: any) => void;
}

export const EnhancedContactForm: React.FC<ContactFormProps> = ({ contact, onChange }) => {
    const updateField = (field: string, value: any) => {
        onChange({ ...contact, [field]: value });
    };

    return (
        <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-neutral-900/50 p-1 rounded-xl">
                <TabsTrigger value="basic" className="data-[state=active]:bg-blue-600 rounded-lg">
                    <User className="w-4 h-4 mr-2" />
                    Básico
                </TabsTrigger>
                <TabsTrigger value="professional" className="data-[state=active]:bg-blue-600 rounded-lg">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Profesional
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-blue-600 rounded-lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Contacto
                </TabsTrigger>
                <TabsTrigger value="payment" className="data-[state=active]:bg-blue-600 rounded-lg">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pagos
                </TabsTrigger>
                <TabsTrigger value="service" className="data-[state=active]:bg-blue-600 rounded-lg">
                    <Package className="w-4 h-4 mr-2" />
                    Servicios
                </TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Nombre Completo</Label>
                        <Input value={contact.name} onChange={e => updateField('name', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Email</Label>
                        <Input value={contact.email} onChange={e => updateField('email', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="juan@email.com" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Teléfono</Label>
                        <Input value={contact.phone} onChange={e => updateField('phone', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="+51 999 123 456" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Fecha de Nacimiento</Label>
                        <Input type="date" value={contact.birthDate} onChange={e => updateField('birthDate', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Género</Label>
                        <Select value={contact.gender} onValueChange={val => updateField('gender', val)}>
                            <SelectTrigger className="bg-neutral-900 border-neutral-800 h-11 rounded-xl">
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                <SelectItem value="man">Hombre</SelectItem>
                                <SelectItem value="woman">Mujer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Tipo Cliente</Label>
                        <Select value={contact.clientType} onValueChange={val => updateField('clientType', val)}>
                            <SelectTrigger className="bg-neutral-900 border-neutral-800 h-11 rounded-xl">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                <SelectItem value="persona">Persona</SelectItem>
                                <SelectItem value="empresa">Empresa</SelectItem>
                                <SelectItem value="estudiante">Prospecto Estudiante</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Pasaporte/DNI</Label>
                        <Input value={contact.passport} onChange={e => updateField('passport', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="12345678" />
                    </div>
                </div>
            </TabsContent>

            {/* Professional Info Tab */}
            <TabsContent value="professional" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Profesión</Label>
                        <Input value={contact.profession} onChange={e => updateField('profession', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Ingeniero" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Ocupación</Label>
                        <Input value={contact.occupation} onChange={e => updateField('occupation', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Desarrollador Senior" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Empresa</Label>
                        <Input value={contact.company} onChange={e => updateField('company', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Tech Corp" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Sitio Web</Label>
                        <Input value={contact.website} onChange={e => updateField('website', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="https://..." />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Intereses</Label>
                    <Textarea value={contact.interests} onChange={e => updateField('interests', e.target.value)} className="bg-neutral-900 border-neutral-800 rounded-xl min-h-[100px]" placeholder="Tecnología, deportes, viajes..." />
                </div>
            </TabsContent>

            {/* Contact Details Tab */}
            <TabsContent value="contact" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Ciudad</Label>
                        <Input value={contact.city} onChange={e => updateField('city', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Lima" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Código Postal</Label>
                        <Input value={contact.postalCode} onChange={e => updateField('postalCode', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="15001" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Dirección</Label>
                    <Input value={contact.address} onChange={e => updateField('address', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Av. Principal 123" />
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Redes Sociales</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Input value={contact.instagram} onChange={e => updateField('instagram', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Instagram" />
                        <Input value={contact.facebook} onChange={e => updateField('facebook', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Facebook" />
                        <Input value={contact.tiktok} onChange={e => updateField('tiktok', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="TikTok" />
                        <Input value={contact.linkedin} onChange={e => updateField('linkedin', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="LinkedIn" />
                        <Input value={contact.twitter} onChange={e => updateField('twitter', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Twitter/X" />
                    </div>
                </div>
            </TabsContent>

            {/* Payment Info Tab */}
            <TabsContent value="payment" className="space-y-6 mt-6">
                <div className="space-y-4">
                    <Label className="text-sm font-bold text-neutral-300">Tarjeta de Crédito</Label>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Número</Label>
                            <Input value={contact.tdcNumber} onChange={e => updateField('tdcNumber', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl font-mono" placeholder="**** **** **** ****" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Expira</Label>
                            <Input value={contact.tdcExpiry} onChange={e => updateField('tdcExpiry', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="MM/YY" />
                        </div>
                    </div>
                    <div className="w-1/3 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">CVV</Label>
                        <Input value={contact.tdcCvv} onChange={e => updateField('tdcCvv', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="***" maxLength={3} />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-neutral-800">
                    <Label className="text-sm font-bold text-neutral-300">Tarjeta de Débito</Label>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Número</Label>
                            <Input value={contact.tddNumber} onChange={e => updateField('tddNumber', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl font-mono" placeholder="**** **** **** ****" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Expira</Label>
                            <Input value={contact.tddExpiry} onChange={e => updateField('tddExpiry', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="MM/YY" />
                        </div>
                    </div>
                    <div className="w-1/3 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">CVV</Label>
                        <Input value={contact.tddCvv} onChange={e => updateField('tddCvv', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="***" maxLength={3} />
                    </div>
                </div>
            </TabsContent>

            {/* Service Info Tab */}
            <TabsContent value="service" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Tipo de Servicio</Label>
                        <Input value={contact.serviceType} onChange={e => updateField('serviceType', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Consultoría" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Estado de Pago</Label>
                        <Select value={contact.paymentStatus} onValueChange={val => updateField('paymentStatus', val)}>
                            <SelectTrigger className="bg-neutral-900 border-neutral-800 h-11 rounded-xl">
                                <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="paid">Pagado</SelectItem>
                                <SelectItem value="partial">Parcial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Detalles del Servicio</Label>
                    <Textarea value={contact.serviceDetails} onChange={e => updateField('serviceDetails', e.target.value)} className="bg-neutral-900 border-neutral-800 rounded-xl min-h-[100px]" placeholder="Descripción del servicio..." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Fecha de Inicio</Label>
                        <Input type="date" value={contact.serviceStartDate} onChange={e => updateField('serviceStartDate', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Fecha de Entrega</Label>
                        <Input type="date" value={contact.serviceDeliveryDate} onChange={e => updateField('serviceDeliveryDate', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Enlaces de Documentos</Label>
                    <div className="space-y-3">
                        <Input value={contact.backupLink} onChange={e => updateField('backupLink', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Enlace de Backup" />
                        <Input value={contact.contractLink} onChange={e => updateField('contractLink', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Enlace de Contrato" />
                        <Input value={contact.invoiceLink} onChange={e => updateField('invoiceLink', e.target.value)} className="bg-neutral-900 border-neutral-800 h-11 rounded-xl" placeholder="Enlace de Factura" />
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
};
