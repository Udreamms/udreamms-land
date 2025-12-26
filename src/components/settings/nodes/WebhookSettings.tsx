// src/components/settings/nodes/WebhookSettings.tsx
'use client';
import React, { useState } from 'react';
import { Node } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsSection, Field } from '../SharedComponents';

interface NodeSettingsProps {
    node: Node;
    updateNodeConfig: (nodeId: string, data: object) => void;
}

export const WebhookSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [config, setConfig] = useState({
        url: node.data.url || 'https://',
        method: node.data.method || 'POST',
        headers: node.data.headers || [], // Array of {key, value}
        saveResponseTo: node.data.saveResponseTo || ''
    });

    const update = (data: any) => {
        setConfig(data);
        updateNodeConfig(node.id, data);
    };

    return (
        <div className="space-y-6">
            <SettingsSection title="🔗 Petición HTTP">
                <div className="flex gap-2">
                    <Select value={config.method} onValueChange={(v) => update({...config, method: v})}>
                        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input value={config.url} onChange={(e) => update({...config, url: e.target.value})} placeholder="https://api.ejemplo.com/v1..." className="font-mono text-sm"/>
                </div>
            </SettingsSection>

            <SettingsSection title="Respuesta">
                <Field label="Guardar respuesta en variable" htmlFor="res-var">
                    <Input 
                        value={config.saveResponseTo} 
                        onChange={(e) => update({...config, saveResponseTo: e.target.value})} 
                        placeholder="ej: api_response"
                        className="font-mono text-green-400"
                    />
                </Field>
                <p className="text-xs text-neutral-500">
                    La respuesta JSON completa se guardará en esta variable para usarla después (ej: <code>{`{{api_response.id}}`}</code>).
                </p>
            </SettingsSection>
        </div>
    );
};
