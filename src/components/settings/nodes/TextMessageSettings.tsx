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
    MoreHorizontal, 
    Link as LinkIcon 
} from 'lucide-react';
import { SettingsSection, Field } from '../SharedComponents';
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
    const [previewUrl, setPreviewUrl] = useState(node.data.previewUrl !== false); // Default true
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setContent(node.data.content || '');
        if (node.data.previewUrl !== undefined) {
            setPreviewUrl(node.data.previewUrl);
        }
    }, [node.data]);

    const handleUpdate = (newContent: string, newPreviewUrl: boolean) => {
        setContent(newContent);
        setPreviewUrl(newPreviewUrl);
        updateNodeConfig(node.id, { 
            ...node.data, 
            content: newContent, 
            previewUrl: newPreviewUrl 
        });
    };

    const insertText = (textToInsert: string, wrap: boolean = false) => {
        if (!textareaRef.current) return;
        
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = content;
        
        let newText = '';
        let newCursorPos = 0;

        if (wrap) {
            // Logic for wrapping text (bold, italic, code)
            const selectedText = text.substring(start, end);
            const wrapper = textToInsert; // e.g., '*'
            newText = text.substring(0, start) + wrapper + selectedText + wrapper + text.substring(end);
            newCursorPos = end + (wrapper.length * 2); 
            if (selectedText.length === 0) newCursorPos = start + wrapper.length; // Place cursor inside if no selection
        } else {
            // Logic for inserting (variables, emojis)
            newText = text.substring(0, start) + textToInsert + text.substring(end);
            newCursorPos = start + textToInsert.length;
        }

        handleUpdate(newText, previewUrl);

        setTimeout(() => {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        insertText(emojiData.emoji);
    };

    return (
        <SettingsSection title="💬 Mensaje de Texto">
            <div className="space-y-4">
                
                {/* Toolbar */}
                <div className="flex items-center justify-between bg-neutral-800 p-1.5 rounded-t-md border border-neutral-700 border-b-0">
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white" onClick={() => insertText('*', true)} title="Negrita (*texto*)">
                            <Bold size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white" onClick={() => insertText('_', true)} title="Cursiva (_texto_)">
                            <Italic size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-white" onClick={() => insertText('```', true)} title="Monoespaciado (```texto```)">
                            <Code size={14} />
                        </Button>
                        
                        <div className="w-px h-4 bg-neutral-700 mx-1 self-center" />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-yellow-500 hover:text-yellow-400" title="Insertar Emoji">
                                    <Smile size={14} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-none" side="right" align="start">
                                <EmojiPicker 
                                    onEmojiClick={handleEmojiClick}
                                    theme={Theme.DARK} // Assuming dark mode based on context
                                    lazyLoadEmojis={true}
                                    height={350}
                                    width={300}
                                />
                            </PopoverContent>
                        </Popover>

                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300 gap-1 font-medium">
                                    <span className="font-mono">{`{}`}</span> Variables
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-neutral-900 border-neutral-700 text-white">
                                {COMMON_VARIABLES.map((v) => (
                                    <DropdownMenuItem 
                                        key={v.value} 
                                        onClick={() => insertText(v.value)}
                                        className="hover:bg-neutral-800 cursor-pointer flex justify-between gap-4"
                                    >
                                        <span>{v.label}</span>
                                        <span className="font-mono text-neutral-500 text-xs">{v.value}</span>
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
                        id="text-content"
                        value={content}
                        onChange={(e) => handleUpdate(e.target.value, previewUrl)}
                        placeholder="Hola {{first_name}}, escribe tu mensaje aquí..."
                        className="min-h-[180px] rounded-t-none border-t-0 font-normal text-base leading-relaxed resize-none p-3 pr-2 pb-8 focus-visible:ring-0 focus-visible:border-neutral-700 bg-neutral-900"
                    />
                    <div className="absolute bottom-2 right-3 text-xs text-neutral-500 bg-neutral-900/90 pl-2">
                        {content.length} caracteres
                    </div>
                </div>

                {/* Preview URL Toggle */}
                <div className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-2">
                        <LinkIcon size={14} className="text-neutral-400"/>
                        <Label htmlFor="preview-url" className="text-sm font-medium text-neutral-300 cursor-pointer">Previsualizar enlaces</Label>
                    </div>
                    <Switch 
                        id="preview-url" 
                        checked={previewUrl}
                        onCheckedChange={(checked) => handleUpdate(content, checked)}
                    />
                </div>
            </div>
        </SettingsSection>
    );
};
