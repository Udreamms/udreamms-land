// src/components/settings/nodes/CaptureInputSettings.tsx
'use client';
import React, { useCallback } from 'react';
import { Node } from 'reactflow';
import { produce } from 'immer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsSection, Field } from '../SharedComponents';
import { Clock, AlertTriangle, CornerDownRight, ShieldAlert } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CaptureInputData {
    variableName?: string;
    inputType?: string; // 'text', 'email', 'phone', 'date', 'url', 'number', 'regex', 'image', 'document'
    validationRegex?: string;
    errorMessage?: string;
    maxRetries?: number;
    timeoutSeconds?: number;
    timeoutMessage?: string;
    exitKeywords?: string;
    isMedia?: boolean;
}

interface NodeSettingsProps {
    node: Node<CaptureInputData>;
    updateNodeConfig: (nodeId: string, data: object) => void;
}

const REGEX_TEMPLATES: Record<string, string> = {
    email: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
    phone: "^\\+?[1-9]\\d{7,14}$",
    date: "^\\d{2}/\\d{2}/\\d{4}$",
    url: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)",
    number: "^\\d+$",
    cpf: "^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$"
};

export const CaptureInputSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    // Estado inicial seguro
    const data = node.data || {};
    
    // Función centralizada de actualización con Immer
    const updateConfig = useCallback((path: keyof CaptureInputData, value: any) => {
        const newData = produce(data, draft => {
            // @ts-ignore - Immer maneja el tipado dinámico
            draft[path] = value;
        });
        updateNodeConfig(node.id, newData);
    }, [data, node.id, updateNodeConfig]);

    // Manejo especial para cambio de tipo de input
    const handleTypeChange = (value: string) => {
        const isMedia = ['image', 'document', 'audio', 'video'].includes(value);
        const templateRegex = REGEX_TEMPLATES[value] || '';

        const newData = produce(data, draft => {
            draft.inputType = value;
            draft.isMedia = isMedia;
            if (!isMedia && templateRegex) {
                draft.validationRegex = templateRegex;
            }
            // Si cambia a custom o texto simple, podríamos limpiar el regex o dejarlo
            if (value === 'text') draft.validationRegex = '';
        });
        updateNodeConfig(node.id, newData);
    };

    return (
        <div className="space-y-3">
            <Tabs defaultValue="validation" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="validation">Validación</TabsTrigger>
                    <TabsTrigger value="logic">Lógica & Failsafe</TabsTrigger>
                </TabsList>

                {/* --- TAB: VALIDACIÓN Y VARIABLE --- */}
                <TabsContent value="validation" className="space-y-4 mt-4">
                    <SettingsSection title="📦 Almacenamiento">
                        <Field 
                            label="Nombre de la Variable" 
                            htmlFor="variableName" 
                            description="Se guardará automáticamente en formato snake_case."
                        >
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-neutral-500 font-mono text-xs">@</span>
                                <Input 
                                    id="variableName"
                                    value={data.variableName || ''} 
                                    onChange={(e) => {
                                        // Forzar snake_case visualmente
                                        const val = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
                                        updateConfig('variableName', val);
                                    }} 
                                    placeholder="ej: email_cliente" 
                                    className="pl-7 font-mono text-purple-400 bg-neutral-950 border-neutral-800"
                                />
                            </div>
                        </Field>
                    </SettingsSection>

                    <SettingsSection title="🛡️ Reglas de Entrada">
                        <Field label="Tipo de Dato Esperado" htmlFor="inputType">
                            <Select value={data.inputType || 'text'} onValueChange={handleTypeChange}>
                                <SelectTrigger className="bg-neutral-950 border-neutral-800">
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Texto Libre (Cualquiera)</SelectItem>
                                    <SelectItem value="email">📧 Email</SelectItem>
                                    <SelectItem value="phone">📱 Teléfono</SelectItem>
                                    <SelectItem value="number">🔢 Número Entero</SelectItem>
                                    <SelectItem value="date">📅 Fecha (DD/MM/AAAA)</SelectItem>
                                    <SelectItem value="url">🔗 URL / Link</SelectItem>
                                    <SelectItem value="cpf">🆔 CPF / DNI (Formato)</SelectItem>
                                    <SelectItem value="regex">🛠️ Regex Personalizado</SelectItem>
                                    <Separator className="my-1 bg-neutral-800"/>
                                    <SelectItem value="image">📷 Imagen (Media)</SelectItem>
                                    <SelectItem value="document">📄 Documento (PDF/Doc)</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        {!data.isMedia && (
                            <div className="space-y-3 pt-2">
                                <Field 
                                    label="Expresión Regular (Regex)" 
                                    htmlFor="regex" 
                                    description={data.inputType !== 'regex' ? "Autogenerado por la plantilla seleccionada." : "Define tu propia validación estricta."}
                                >
                                    <Input 
                                        id="regex"
                                        value={data.validationRegex || ''} 
                                        onChange={(e) => updateConfig('validationRegex', e.target.value)}
                                        disabled={data.inputType !== 'regex'}
                                        className="font-mono text-xs text-yellow-500 bg-neutral-950 border-neutral-800 disabled:opacity-50"
                                        placeholder="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"
                                    />
                                </Field>

                                <Field 
                                    label="Mensaje de Error" 
                                    htmlFor="errorMessage" 
                                    description="Se enviará si la validación falla."
                                >
                                    <Textarea 
                                        id="errorMessage"
                                        value={data.errorMessage || ''}
                                        onChange={(e) => updateConfig('errorMessage', e.target.value)}
                                        placeholder="Formato inválido. Por favor intenta de nuevo..."
                                        className="min-h-[80px] bg-neutral-950 border-neutral-800 resize-none"
                                    />
                                </Field>
                            </div>
                        )}
                        
                        {data.isMedia && (
                            <div className="p-3 bg-blue-900/20 border border-blue-800 rounded-md text-sm text-blue-200 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>El bot esperará un archivo adjunto. El enlace público del archivo se guardará en la variable.</p>
                            </div>
                        )}
                    </SettingsSection>
                </TabsContent>

                {/* --- TAB: LÓGICA DE REINTENTO Y SALIDA --- */}
                <TabsContent value="logic" className="space-y-4 mt-4">
                    <SettingsSection title="🔄 Bucle de Reintentos">
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Intentos Máximos" htmlFor="maxRetries">
                                <Input 
                                    type="number" 
                                    min={1} 
                                    max={10}
                                    value={data.maxRetries || 3}
                                    onChange={(e) => updateConfig('maxRetries', parseInt(e.target.value))}
                                    className="bg-neutral-950 border-neutral-800"
                                />
                            </Field>
                            <div className="flex items-end pb-2">
                                <p className="text-xs text-neutral-500">
                                    Si falla {data.maxRetries || 3} veces, el flujo continuará por la salida de "Fallo".
                                </p>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="⏳ Anti-Ghosting (Timeouts)">
                        <Field 
                            label="Tiempo de Espera (Segundos)" 
                            htmlFor="timeout" 
                            description="Si no responde en este tiempo, se cancela la espera."
                        >
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                                <Input 
                                    type="number"
                                    min={30}
                                    value={data.timeoutSeconds || 300}
                                    onChange={(e) => updateConfig('timeoutSeconds', parseInt(e.target.value))}
                                    className="pl-9 bg-neutral-950 border-neutral-800"
                                />
                            </div>
                        </Field>

                        <Field label="Mensaje de Timeout" htmlFor="timeoutMsg">
                             <Textarea 
                                value={data.timeoutMessage || ''}
                                onChange={(e) => updateConfig('timeoutMessage', e.target.value)}
                                placeholder="La sesión ha expirado por inactividad."
                                className="min-h-[60px] bg-neutral-950 border-neutral-800"
                            />
                        </Field>
                    </SettingsSection>

                    <SettingsSection title="🚪 Salida Inteligente">
                        <Field 
                            label="Palabras Clave de Cancelación" 
                            htmlFor="exitKeywords"
                            description="Separadas por coma. Permiten al usuario salir del formulario."
                        >
                            <div className="relative">
                                <CornerDownRight className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                                <Input 
                                    value={data.exitKeywords || ''}
                                    onChange={(e) => updateConfig('exitKeywords', e.target.value)}
                                    placeholder="cancelar, salir, menú, stop"
                                    className="pl-9 bg-neutral-950 border-neutral-800"
                                />
                            </div>
                        </Field>
                        
                        <div className="p-3 bg-neutral-800 rounded-md border border-neutral-700 flex gap-2 items-center">
                            <ShieldAlert className="w-4 h-4 text-yellow-500" />
                            <p className="text-xs text-neutral-400">
                                Estas palabras interrumpirán la captura inmediatamente y desviarán el flujo.
                            </p>
                        </div>
                    </SettingsSection>
                </TabsContent>
            </Tabs>
        </div>
    );
};
