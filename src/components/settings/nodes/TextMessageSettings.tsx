
// src/components/settings/nodes/TextMessageSettings.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Node } from 'reactflow';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
    Bold, 
    Italic, 
    Code, 
    Smile, 
    Link as LinkIcon,
    Clock // Icono nuevo
} from 'lucide-react';
import { SettingsSection } from '../SharedComponents';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NodeSettingsProps {
    node: Node;
    updateNodeConfig: (nodeId: string, data: object) => void;
}

const COMMON_VARIABLES = [
    { label: 'Nombre', value: '{{first_name}}' },
    { label: 'Apellido', value: '{{last_name}}' },
    { label: 'Teléfono', value: '{{phone}}' },
    { label: 'Email', value: '{{email}}' },
    { label: 'ID Usuario', value: '{{wa_id}}' }
];

export const TextMessageSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [content, setContent] = useState(node.data.content || '');
    const [previewUrl, setPreviewUrl] = useState(node.data.previewUrl !== false);
    // Nuevo estado: por defecto true (humano), false = máquina rápida
    const [typingSimulation, setTypingSimulation] = useState(node.data.typingSimulation !== false); 
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setContent(node.data.content || '');
        if (node.data.previewUrl !== undefined) setPreviewUrl(node.data.previewUrl);
        if (node.data.typingSimulation !== undefined) setTypingSimulation(node.data.typingSimulation);
    }, [node.data]);

    const handleUpdate = (updates: any) => {
        updateNodeConfig(node.id, { ...node.data, ...updates });
    };

    const insertText = (textToInsert: string, wrap: boolean = false) => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = content;
        let newText = '';
        let newCursorPos = 0;

        if (wrap) {
            const selectedText = text.substring(start, end);
            const wrapper = textToInsert;
            newText = text.substring(0, start) + wrapper + selectedText + wrapper + text.substring(end);
            newCursorPos = end + (wrapper.length * 2); 
            if (selectedText.length === 0) newCursorPos = start + wrapper.length;
        } else {
            newText = text.substring(0, start) + textToInsert + text.substring(end);
            newCursorPos = start + textToInsert.length;
        }

        setContent(newText);
        handleUpdate({ content: newText });

        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    return (
        <SettingsSection title="💬 Mensaje de Texto">
            <div className="space-y-4">
                
                {/* Toolbar */}
                <div className="flex items-center justify-between bg-neutral-800 p-1.5 rounded-t-md border border-neutral-700 border-b-0">
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white" onClick={() => insertText('*', true)}><Bold size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white" onClick={() => insertText('_', true)}><Italic size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white" onClick={() => insertText('```', true)}><Code size={14} /></Button>
                        <div className="w-px h-4 bg-neutral-700 mx-1 self-center" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-yellow-500 hover:text-yellow-400"><Smile size={14} /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none" side="right" align="start">
                                <EmojiPicker onEmojiClick={(e) => insertText(e.emoji)} theme={Theme.DARK} lazyLoadEmojis={true} height={350} width={300} />
                            </PopoverContent>
                        </Popover>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300 gap-1 font-medium"><span className="font-mono">{`{}`}</span> Vars</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-neutral-900 border-neutral-700 text-white">
                                {COMMON_VARIABLES.map((v) => (
                                    <DropdownMenuItem key={v.value} onClick={() => insertText(v.value)} className="hover:bg-neutral-800 cursor-pointer flex justify-between gap-4">
                                        <span>{v.label}</span><span className="font-mono text-neutral-500 text-xs">{v.value}</span>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Text Area */}
                <div className="relative -mt-4">
                    <Textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            handleUpdate({ content: e.target.value });
                        }}
                        placeholder="Hola {{first_name}}..."
                        className="min-h-[180px] rounded-t-none border-t-0 font-normal text-base resize-none p-3 pr-2 pb-8 bg-neutral-900 focus-visible:ring-0"
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-neutral-500 bg-neutral-900/90 pl-2">
                        {content.length} caracteres
                    </div>
                </div>

                {/* Configuration Toggles */}
                <div className="space-y-3 pt-2">
                    {/* Link Preview */}
                    <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                        <div className="flex items-center gap-2">
                            <LinkIcon size={14} className="text-neutral-500"/>
                            <Label className="text-xs font-medium text-neutral-400">Previsualizar enlaces</Label>
                        </div>
                        <Switch 
                            checked={previewUrl}
                            onCheckedChange={(checked) => {
                                setPreviewUrl(checked);
                                handleUpdate({ previewUrl: checked });
                            }}
                            className="scale-75"
                        />
                    </div>

                    {/* Human Typing Simulation */}
                    <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className={typingSimulation ? "text-green-400" : "text-neutral-500"}/>
                                <Label className="text-xs font-medium text-neutral-300">Modo Humano (Delay)</Label>
                            </div>
                            <p className="text-[10px] text-neutral-500 pl-6 max-w-[200px]">
                                {typingSimulation 
                                    ? "Espera unos segundos antes de enviar (simula escribir)." 
                                    : "Envío instantáneo (modo robot/OTP)."}
                            </p>
                        </div>
                        <Switch 
                            checked={typingSimulation}
                            onCheckedChange={(checked) => {
                                setTypingSimulation(checked);
                                handleUpdate({ typingSimulation: checked });
                            }}
                            className="scale-75 data-[state=checked]:bg-green-600"
                        />
                    </div>
                </div>
            </div>
        </SettingsSection>
    );
};
