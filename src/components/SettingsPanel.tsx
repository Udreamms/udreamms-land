
// src/components/SettingsPanel.tsx
import React, { useState, useEffect } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Button } from './ui/button';
import { Smile, UploadCloud, Trash2, Menu, PlusCircle, AtSign, Hash, Calendar, Settings2, Code, ToggleLeft, Image, Video, FileText, Mic, ChevronDown, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Reusable Input Style ---
const inputStyle = "w-full bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-3 py-2 text-sm";


// --- Helper Components ---
const CharacterCounter = ({ value, maxLength }) => {
    const length = value?.length || 0;
    return (
        <p className={`text-xs mt-1 ${length > maxLength ? 'text-red-400' : 'text-gray-400'}`}>
            {length} / {maxLength}
        </p>
    );
};
const WhatsAppHint = ({ text }) => <p className="text-xs text-indigo-300 mt-2 p-2 bg-indigo-900/50 rounded">{text}</p>;
const SettingRow = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);
const KeyValueEditor = ({ title, items, setItems, keyPlaceholder, valuePlaceholder }) => {
    const updateItem = (index, key, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], key, value };
        setItems(newItems);
    };
    const addItem = () => setItems([...items, { key: '', value: '' }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    return (
        <div>
            <h3 className="text-md font-semibold mb-2">{title}</h3>
            {items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                    <input type="text" value={item.key} onChange={e => updateItem(index, e.target.value, item.value)} placeholder={keyPlaceholder} className={cn(inputStyle, "w-1/2")} />
                    <input type="text" value={item.value} onChange={e => updateItem(index, item.key, e.target.value)} placeholder={valuePlaceholder} className={cn(inputStyle, "w-1/2")} />
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}><X className="h-4 w-4" /></Button>
                </div>
            ))}
            <Button variant="outline" size="sm" onClick={addItem}>Añadir {title}</Button>
        </div>
    );
};


// --- Settings for Specific Nodes ---

const TextNodeSettings = ({ node, updateNodeConfig }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const text = node.data.text || '';
  const onEmojiClick = (emojiData: EmojiClickData) => updateNodeConfig(node.id, { text: text + emojiData.emoji });
  const addVariable = (variable) => updateNodeConfig(node.id, { text: text + ` {{${variable}}}` });

  return (
    <div className="space-y-4">
      <SettingRow label="Texto del Mensaje">
        <div className="relative">
          <textarea rows={5} className={inputStyle} value={text} onChange={(e) => updateNodeConfig(node.id, { text: e.target.value })}/>
          <Button onClick={() => setShowEmojiPicker(p => !p)} size="icon" variant="ghost" className="absolute top-2 right-2"><Smile className="h-5 w-5 text-gray-400" /></Button>
        </div>
        <CharacterCounter value={text} maxLength={4096} />
        {showEmojiPicker && <div className="absolute z-10 right-12"><EmojiPicker onEmojiClick={onEmojiClick} theme="dark" /></div>}
      </SettingRow>
      <SettingRow label="Insertar Variable">
        <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => addVariable('nombre')}>Nombre</Button>
            <Button size="sm" variant="outline" onClick={() => addVariable('email')}>Email</Button>
            <Button size="sm" variant="outline" onClick={() => addVariable('pedido')}>Pedido</Button>
        </div>
      </SettingRow>
    </div>
  );
};

const MediaNodeSettings = ({ node, updateNodeConfig }) => {
    const mediaType = node.data.mediaType || 'image';
    const hints = {
        image: "Formatos JPG, PNG. Máx 5MB.",
        video: "Formato MP4. Máx 16MB.",
        audio: "Formatos AAC, MP3, OGG. Máx 16MB.",
        document: "Se recomienda PDF. Máx 100MB.",
    };
    return (
        <div className="space-y-4">
            <SettingRow label="Tipo de Multimedia">
                <div className="grid grid-cols-4 gap-2">
                    <Button variant={mediaType === 'image' ? 'secondary' : 'outline'} onClick={() => updateNodeConfig(node.id, { mediaType: 'image' })}><Image className="h-4 w-4"/></Button>
                    <Button variant={mediaType === 'video' ? 'secondary' : 'outline'} onClick={() => updateNodeConfig(node.id, { mediaType: 'video' })}><Video className="h-4 w-4"/></Button>
                    <Button variant={mediaType === 'audio' ? 'secondary' : 'outline'} onClick={() => updateNodeConfig(node.id, { mediaType: 'audio' })}><Mic className="h-4 w-4"/></Button>
                    <Button variant={mediaType === 'document' ? 'secondary' : 'outline'} onClick={() => updateNodeConfig(node.id, { mediaType: 'document' })}><FileText className="h-4 w-4"/></Button>
                </div>
            </SettingRow>
             <SettingRow label="URL del Archivo">
                <input type="text" className={inputStyle} placeholder="https://ejemplo.com/imagen.png" value={node.data.url || ''} onChange={e => updateNodeConfig(node.id, { url: e.target.value })} />
            </SettingRow>
            <SettingRow label="Mensaje Adicional (Caption)">
                <textarea rows={3} className={inputStyle} value={node.data.caption || ''} onChange={e => updateNodeConfig(node.id, { caption: e.target.value })}/>
                <CharacterCounter value={node.data.caption} maxLength={1024} />
            </SettingRow>
            <WhatsAppHint text={hints[mediaType]} />
        </div>
    );
};

const QuickReplySettings = ({ node, updateNodeConfig }) => {
  const onButtonChange = (index, value) => {
    const newButtons = [...(node.data.buttons || ['', '', ''])];
    newButtons[index] = value;
    updateNodeConfig(node.id, { buttons: newButtons });
  };
  
  const text = node.data.text || '';

  return (
    <div className="space-y-4">
      <SettingRow label="Texto del Mensaje Principal">
        <textarea
          rows={4}
          className={inputStyle}
          value={text}
          onChange={(e) => updateNodeConfig(node.id, { text: e.target.value })}
        />
        <CharacterCounter value={text} maxLength={1024} />
      </SettingRow>
      <SettingRow label="Botones de Respuesta (Máx. 3)">
        <div className="space-y-2">
          {[0, 1, 2].map(i => {
            const buttonText = node.data.buttons?.[i] || '';
            return (
              <div key={i}>
                <input type="text" placeholder={`Título del Botón ${i + 1}`} value={buttonText} onChange={(e) => onButtonChange(i, e.target.value)} className={inputStyle} />
                <CharacterCounter value={buttonText} maxLength={20} />
              </div>
            );
          })}
        </div>
      </SettingRow>
    </div>
  );
};

const ListNodeSettings = ({ node, updateNodeConfig }) => {
    const sections = node.data.sections || [{ title: '', items: [{ title: '', description: '' }] }];
    
    const updateSection = (secIdx, field, value) => {
        const newSections = [...sections]; newSections[secIdx][field] = value;
        updateNodeConfig(node.id, { sections: newSections });
    };
    const updateItem = (secIdx, itemIdx, field, value) => {
        const newSections = [...sections]; newSections[secIdx].items[itemIdx][field] = value;
        updateNodeConfig(node.id, { sections: newSections });
    };
    const addSection = () => updateNodeConfig(node.id, { sections: [...sections, { title: '', items: [] }] });
    const addItem = (secIdx) => {
        const newSections = [...sections]; newSections[secIdx].items.push({ title: '', description: '' });
        updateNodeConfig(node.id, { sections: newSections });
    };

    return (
        <div className="space-y-4">
            <SettingRow label="Texto del Mensaje Principal"><textarea rows={3} className={inputStyle} value={node.data.body || ''} onChange={e => updateNodeConfig(node.id, { body: e.target.value })}/><CharacterCounter value={node.data.body} maxLength={1024} /></SettingRow>
            <SettingRow label="Texto del Botón de la Lista"><input type="text" className={inputStyle} value={node.data.buttonText || ''} onChange={e => updateNodeConfig(node.id, { buttonText: e.target.value })} /><CharacterCounter value={node.data.buttonText} maxLength={20} /></SettingRow>
            <hr className="border-neutral-700"/>
            {sections.map((sec, secIdx) => (
                <div key={secIdx} className="p-2 border border-neutral-700 rounded">
                    <input type="text" placeholder="Título de la Sección" value={sec.title} onChange={e => updateSection(secIdx, 'title', e.target.value)} className={cn(inputStyle, "mb-2 font-bold")} />
                    {sec.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="ml-4 mb-2 space-y-1">
                            <input type="text" placeholder="Título del Ítem" value={item.title} onChange={e => updateItem(secIdx, itemIdx, 'title', e.target.value)} className={inputStyle} />
                            <CharacterCounter value={item.title} maxLength={24} />
                            <input type="text" placeholder="Descripción (opcional)" value={item.description} onChange={e => updateItem(secIdx, itemIdx, 'description', e.target.value)} className={cn(inputStyle, "text-sm")} />
                            <CharacterCounter value={item.description} maxLength={72} />
                        </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => addItem(secIdx)}>Añadir Ítem</Button>
                </div>
            ))}
            <Button size="sm" variant="outline" onClick={addSection}>Añadir Sección</Button>
            <WhatsAppHint text="Puedes tener un máximo de 10 ítems en total." />
        </div>
    );
};

const WebhookNodeSettings = ({ node, updateNodeConfig }) => {
    const headers = node.data.headers || [];
    const responseMappings = node.data.responseMappings || [];

    return (
        <div className="space-y-4">
            <SettingRow label="Método y URL">
                <div className="flex gap-2">
                    <select className={cn(inputStyle, "w-1/3")} value={node.data.method || 'GET'} onChange={e => updateNodeConfig(node.id, { method: e.target.value })}>
                        <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
                    </select>
                    <input type="text" className={cn(inputStyle, "w-2/3")} placeholder="https://api.ejemplo.com/data" value={node.data.url || ''} onChange={e => updateNodeConfig(node.id, { url: e.target.value })}/>
                </div>
            </SettingRow>
            <KeyValueEditor title="Headers" items={headers} setItems={newHeaders => updateNodeConfig(node.id, { headers: newHeaders })} keyPlaceholder="Authorization" valuePlaceholder="Bearer sk_..."/>
            {(node.data.method === 'POST' || node.data.method === 'PUT') && (
                 <SettingRow label="Cuerpo JSON (Body)">
                    <textarea rows={5} className={cn(inputStyle, "font-mono text-xs")} placeholder={`{\n  "name": "{{nombre}}"\n}`} value={node.data.body || ''} onChange={e => updateNodeConfig(node.id, { body: e.target.value })} />
                </SettingRow>
            )}
            <hr className="border-neutral-700"/>
            <KeyValueEditor title="Guardar Respuesta en Variables" items={responseMappings} setItems={newMaps => updateNodeConfig(node.id, { responseMappings: newMaps })} keyPlaceholder="Ruta JSON (ej: data.email)" valuePlaceholder="Nombre de Variable (ej: email_cliente)" />
            <WhatsAppHint text="La salida 'failure' se activará si la API no responde en 10s o devuelve un error."/>
        </div>
    );
};

const SetVariableSettings = ({ node, updateNodeConfig }) => {
    const operations = node.data.operations || [];
    const updateOperation = (index, field, value) => {
        const newOps = [...operations]; newOps[index][field] = value;
        updateNodeConfig(node.id, { operations: newOps });
    };
    const addOperation = () => updateNodeConfig(node.id, { operations: [...operations, { variable: '', action: 'set', value: '' }] });
    
    return (
        <div className="space-y-4">
            {operations.map((op, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Variable" value={op.variable} onChange={e => updateOperation(index, 'variable', e.target.value)} className={inputStyle}/>
                    <select value={op.action} onChange={e => updateOperation(index, 'action', e.target.value)} className={inputStyle}>
                        <option value="set">Fijar valor a</option><option value="increment">Incrementar en</option><option value="decrement">Decrementar en</option>
                    </select>
                    <input type="text" placeholder="Valor" value={op.value} onChange={e => updateOperation(index, 'value', e.target.value)} className={inputStyle}/>
                </div>
            ))}
            <Button size="sm" variant="outline" onClick={addOperation}>Añadir Operación</Button>
        </div>
    );
};

const EndNodeSettings = ({ node, updateNodeConfig }) => (
    <div className="space-y-4">
        <SettingRow label="Acción Final">
            <select className={inputStyle} value={node.data.endAction || 'end'} onChange={e => updateNodeConfig(node.id, { endAction: e.target.value })}>
                <option value="end">Solo Terminar Flujo</option><option value="transfer">Transferir a Agente</option><option value="addTag">Añadir Etiqueta al Contacto</option>
            </select>
        </SettingRow>
        {node.data.endAction === 'addTag' && (
            <SettingRow label="Etiqueta a Añadir">
                <input type="text" className={inputStyle} placeholder="Ej: Cliente_Interesado" value={node.data.tag || ''} onChange={e => updateNodeConfig(node.id, { tag: e.target.value })}/>
            </SettingRow>
        )}
        <SettingRow label="Mensaje de Cierre (Opcional)">
            <textarea rows={3} className={inputStyle} placeholder="Ej: Gracias por contactarnos." value={node.data.closingMessage || ''} onChange={e => updateNodeConfig(node.id, { closingMessage: e.target.value })}/>
        </SettingRow>
    </div>
);

const CaptureInputSettings = ({ node, updateNodeConfig }) => (
    <div className="space-y-4">
        <SettingRow label="Mensaje de Petición">
            <textarea rows={3} className={inputStyle} placeholder="Ej: Para continuar, por favor, introduce tu email." value={node.data.prompt || ''} onChange={(e) => updateNodeConfig(node.id, { prompt: e.target.value })}/>
        </SettingRow>
        <SettingRow label="Guardar Respuesta en Variable">
            <div className="flex items-center gap-2">
                <AtSign className="text-gray-400" />
                <input type="text" className={inputStyle} placeholder="Ej: email_usuario" value={node.data.variableName || ''} onChange={(e) => updateNodeConfig(node.id, { variableName: e.target.value })}/>
            </div>
        </SettingRow>
        <WhatsAppHint text="La respuesta del usuario se guardará en esta variable para que puedas usarla después." />
    </div>
);

const ConditionSettings = ({ node, updateNodeConfig }) => {
    const conditions = node.data.conditions || [{ variable: '', operator: 'contains', value: '' }];
    const updateCondition = (index, field, value) => {
        const newConditions = [...conditions]; newConditions[index][field] = value;
        updateNodeConfig(node.id, { conditions: newConditions });
    };
    const addCondition = () => updateNodeConfig(node.id, { conditions: [...conditions, { variable: '', operator: 'contains', value: '' }] });

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-400">El flujo continuará por la primera rama cuya condición sea verdadera.</p>
            {conditions.map((cond, index) => (
                <div key={index} className="p-2 border border-neutral-700 rounded space-y-2">
                    <SettingRow label="Variable"><input type="text" className={inputStyle} placeholder="Ej: email_usuario" value={cond.variable} onChange={e => updateCondition(index, 'variable', e.target.value)} /></SettingRow>
                    <SettingRow label="Operador">
                        <select className={inputStyle} value={cond.operator} onChange={e => updateCondition(index, 'operator', e.target.value)}>
                            <option value="contains">Contiene</option><option value="equals">Es igual a</option><option value="not_equals">No es igual a</option>
                            <option value="starts_with">Empieza por</option><option value="ends_with">Termina con</option><option value="gt">Es mayor que (número)</option>
                            <option value="lt">Es menor que (número)</option>
                        </select>
                    </SettingRow>
                    <SettingRow label="Valor"><input type="text" className={inputStyle} placeholder="Ej: @gmail.com" value={cond.value} onChange={e => updateCondition(index, 'value', e.target.value)} /></SettingRow>
                </div>
            ))}
            <Button size="sm" variant="outline" onClick={addCondition}>Añadir Otra Condición (OR)</Button>
            <WhatsAppHint text="Si ninguna condición se cumple, el flujo continuará por la salida 'fallback'." />
        </div>
    );
};

// --- Main Panel Component ---
const SettingsPanel = ({ selectedNode, updateNodeConfig, deleteNode, isOpen, onToggle }) => {
  const [nodeName, setNodeName] = useState(selectedNode?.data?.label || '');
  useEffect(() => { setNodeName(selectedNode?.data?.label || ''); }, [selectedNode]);
  if (!isOpen) return null;

  const handleNameChange = (e) => {
    setNodeName(e.target.value);
    updateNodeConfig(selectedNode.id, { label: e.target.value });
  };
  const handleDelete = () => {
    if (window.confirm(`¿Seguro que quieres eliminar el nodo "${selectedNode.data.label || selectedNode.id}"?`)) {
        deleteNode(selectedNode.id);
    }
  }

  const nodeSettingsMap = {
    'textMessageNode': <TextNodeSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'quickReplyNode': <QuickReplySettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'captureInputNode': <CaptureInputSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'conditionNode': <ConditionSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'mediaMessageNode': <MediaNodeSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'listMessageNode': <ListNodeSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'webhookNode': <WebhookNodeSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'setVariableNode': <SetVariableSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
    'endNode': <EndNodeSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />,
  };

  return (
    <aside className="w-96 bg-neutral-950/50 p-4 border-l border-neutral-800 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">{selectedNode ? "Editar Nodo" : "Configuración"}</h2>
            <Button variant="ghost" size="icon" onClick={onToggle}><Menu className="h-5 w-5" /></Button>
        </div>
      
      {selectedNode ? (
        <>
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                <SettingRow label="Nombre del Nodo">
                    <input type="text" value={nodeName} onChange={handleNameChange} className={inputStyle} placeholder="Ej: Saludo Inicial" />
                </SettingRow>
                <hr className="border-neutral-700" />
                {nodeSettingsMap[selectedNode.type] || <p className="text-sm text-gray-400">No hay configuraciones para este nodo.</p>}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-800">
                <Button onClick={handleDelete} variant="destructive" className="w-full flex items-center gap-2"><Trash2 size={16} /> Eliminar Nodo</Button>
            </div>
        </>
      ) : (
        <p className="text-sm text-gray-400 mt-2">Selecciona un nodo del lienzo para ver sus propiedades.</p>
      )}
    </aside>
  );
};

export default SettingsPanel;
