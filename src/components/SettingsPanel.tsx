
// src/components/SettingsPanel.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Node } from 'reactflow';
import { useDropzone } from 'react-dropzone';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '@/lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Trash2, ChevronRight, ChevronLeft, Plus, UploadCloud, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { produce } from 'immer';

// --- Interfaces ---
interface SettingsPanelProps {
  selectedNode: Node | null;
  updateNodeConfig: (nodeId: string, data: object) => void;
  deleteNode: (nodeId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface NodeSettingsProps {
  node: Node;
  updateNodeConfig: (nodeId: string, data: object) => void;
}

// --- Componentes de UI reutilizables ---
const SettingsSection = ({ title, children }) => (
    <div className="space-y-4 p-4 border border-neutral-800 rounded-lg bg-neutral-900/50">
      <h4 className="font-semibold text-lg text-white">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
);

const Field = ({ label, htmlFor, children, description = null }) => (
    <div>
        <Label htmlFor={htmlFor} className="text-xs font-semibold text-gray-400">{label}</Label>
        {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
        {children}
    </div>
);

const FileUploader = ({ onUploadSuccess, initialUrl = null, initialFilename = null }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileUrl, setFileUrl] = useState(initialUrl);
    const [filename, setFilename] = useState(initialFilename);
    const [error, setError] = useState(null);

    useEffect(() => {
        setFileUrl(initialUrl);
        setFilename(initialFilename);
    }, [initialUrl, initialFilename]);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        const storage = getStorage(app);
        const storageRef = ref(storage, `chatbot_media/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(prog);
            },
            (err) => {
                console.error("Error al subir archivo:", err);
                setError('Error al subir el archivo.');
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFileUrl(downloadURL);
                    setFilename(file.name);
                    onUploadSuccess(downloadURL, file.name, file.type);
                    setUploading(false);
                });
            }
        );
    }, [onUploadSuccess]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

    const handleRemoveFile = () => {
        setFileUrl(null);
        setFilename(null);
        onUploadSuccess('', '', '');
    };

    if (fileUrl) {
        return (
            <div className="p-4 bg-neutral-800 rounded-lg flex items-center justify-between">
                <p className="text-sm text-white truncate pr-4">{filename}</p>
                <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                    <XCircle className="text-red-500" size={20}/>
                </Button>
            </div>
        );
    }

    return (
        <div {...getRootProps()} className={cn("p-6 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors", isDragActive ? "border-purple-500 bg-purple-900/10" : "border-neutral-600 hover:border-neutral-500 hover:bg-neutral-800/50")}>
            <input {...getInputProps()} />
            {uploading ? (
                <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-gray-400">Subiendo... {Math.round(progress)}%</p>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="text-gray-500" size={32}/>
                    <p className="text-sm text-gray-400">
                        {isDragActive ? "Suelta el archivo aquí" : "Arrastra un archivo o haz clic para seleccionarlo"}
                    </p>
                     {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
            )}
        </div>
    );
};

// --- Settings Components per Node Type ---

const GeneralSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [nodeName, setNodeName] = useState(node.data.label || '');

    useEffect(() => {
        setNodeName(node.data.label || '');
    }, [node.data.label]);

    const handleNameChange = (e) => {
        setNodeName(e.target.value);
    };

    const handleBlur = () => {
        updateNodeConfig(node.id, { ...node.data, label: nodeName });
    };

    return (
        <SettingsSection title="Ajustes Generales">
            <Field label="Nombre del Nodo" htmlFor="node-name" description="Útil para identificar el nodo en el flujo.">
                <Input id="node-name" value={nodeName} onChange={handleNameChange} onBlur={handleBlur} placeholder="Ej: Saludo Inicial" />
            </Field>
        </SettingsSection>
    );
};

const TextMessageSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [content, setContent] = useState(node.data.content || '');

    useEffect(() => {
        setContent(node.data.content || '');
    }, [node.data.content]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleBlur = () => {
        updateNodeConfig(node.id, { ...node.data, content });
    };

    return (
        <SettingsSection title="💬 Mensaje de Texto">
            <Field label="Contenido del Mensaje" htmlFor="text-content">
                 <Textarea
                    id="text-content"
                    value={content}
                    onChange={handleContentChange}
                    onBlur={handleBlur}
                    placeholder="Escribe tu mensaje aquí. Usa {{variable}} para insertar datos."
                    className="min-h-[150px]"
                />
            </Field>
        </SettingsSection>
    );
};

const MediaMessageSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [config, setConfig] = useState({
        url: node.data.url || '',
        caption: node.data.caption || '',
        filename: node.data.filename || '',
        mediaType: node.data.mediaType || 'image',
    });

    useEffect(() => {
        setConfig(prev => ({ ...prev, ...node.data }));
    }, [node.data]);

    const handleUpdate = (data) => {
        const newConfig = { ...config, ...data };
        setConfig(newConfig);
        updateNodeConfig(node.id, newConfig);
    };
    
    const handleUploadSuccess = (url, filename, fileType) => {
        let detectedType = 'document';
        if (fileType.startsWith('image/')) detectedType = 'image';
        else if (fileType.startsWith('video/')) detectedType = 'video';
        else if (fileType.startsWith('audio/')) detectedType = 'audio';
        handleUpdate({ url, filename, mediaType: detectedType });
    };

    return (
        <SettingsSection title="🖼️ Mensaje Multimedia">
            <Field label="Carga de Archivo" htmlFor="file-upload" description="Arrastra y suelta o selecciona un archivo. El tipo se detectará automáticamente.">
                <FileUploader onUploadSuccess={handleUploadSuccess} initialUrl={config.url} initialFilename={config.filename} />
            </Field>

            {config.filename && (
                 <p className="text-xs text-gray-400 text-center">Tipo detectado: <span className="font-semibold text-purple-400">{config.mediaType.toUpperCase()}</span></p>
            )}

            {['image', 'video'].includes(config.mediaType) && (
                <Field label="Pie de foto (Caption)" htmlFor="media-caption">
                    <Textarea id="media-caption" value={config.caption || ''} onChange={(e) => setConfig(p => ({...p, caption: e.target.value}))} onBlur={() => updateNodeConfig(node.id, config)} placeholder="Escribe un mensaje aquí..." />
                </Field>
            )}
        </SettingsSection>
    );
};

const QuickReplySettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [config, setConfig] = useState({
        header: node.data.header || '',
        text: node.data.text || '',
        buttons: node.data.buttons || [''],
    });

    useEffect(() => {
        setConfig({
            header: node.data.header || '',
            text: node.data.text || '',
            buttons: node.data.buttons && node.data.buttons.length > 0 ? node.data.buttons : [''],
        });
    }, [node.data]);

    const handleBlur = () => { updateNodeConfig(node.id, config); };

    const handleButtonChange = (value, index) => {
         const newButtons = [...config.buttons];
         newButtons[index] = value;
         setConfig(p => ({...p, buttons: newButtons}));
    }

    const addButton = () => {
        if (config.buttons.length < 10) {
            const newButtons = [...config.buttons, ''];
            setConfig(p => ({ ...p, buttons: newButtons }));
            updateNodeConfig(node.id, { ...config, buttons: newButtons });
        }
    };

    const removeButton = (index) => {
        const newButtons = config.buttons.filter((_, i) => i !== index);
        setConfig(p => ({...p, buttons: newButtons}));
        updateNodeConfig(node.id, { ...config, buttons: newButtons });
    };

    return (
        <div className="space-y-6">
            <SettingsSection title="⚡ Respuesta Rápida">
                <Field label="Encabezado (Opcional)" htmlFor="qr-header">
                    <Input name="header" value={config.header || ''} onChange={(e) => setConfig(p => ({...p, header: e.target.value}))} onBlur={handleBlur} />
                </Field>
                <Field label="Texto del Mensaje" htmlFor="qr-text">
                    <Textarea name="text" value={config.text || ''} onChange={(e) => setConfig(p => ({...p, text: e.target.value}))} onBlur={handleBlur} className="min-h-[100px]" />
                </Field>
            </SettingsSection>
            <SettingsSection title="Gestión de Botones">
                 <p className="text-xs text-gray-500 -mt-2">Cada botón genera automáticamente una rama de salida en el lienzo.</p>
                {config.buttons.map((btn, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Input name="button" value={btn || ''} onChange={(e) => handleButtonChange(e.target.value, i)} onBlur={handleBlur} placeholder={`Botón ${i + 1}`} />
                        <Button variant="ghost" size="icon" onClick={() => removeButton(i)}><Trash2 size={16}/></Button>
                    </div>
                ))}
                {config.buttons.length < 10 && <Button onClick={addButton} variant="outline" className="w-full"><Plus size={16} className="mr-2"/>Añadir Botón</Button>}
            </SettingsSection>
        </div>
    );
};

const ListMessageSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const defaultConfig = {
        header: '',
        body: '',
        footer: '',
        buttonText: 'Ver Opciones',
        sections: [{ title: 'Mi Sección', rows: [{ title: 'Opción 1', description: '' }] }]
    };

    const [config, setConfig] = useState(() => ({ ...defaultConfig, ...(node.data.listConfig || {}) }));
    
    useEffect(() => {
        const mergedConfig = { ...defaultConfig, ...(node.data.listConfig || {}) };
        setConfig(mergedConfig);
    }, [node.data.listConfig]);

    const handleSave = () => {
        updateNodeConfig(node.id, { ...node.data, listConfig: config });
    };
    
    const handleFieldChange = (field, value) => {
        setConfig(produce(config, draft => {
            draft[field] = value;
        }));
    };

    const addSection = () => {
        setConfig(produce(config, draft => {
            draft.sections.push({ title: `Nueva Sección ${draft.sections.length + 1}`, rows: [] });
        }));
    };

    const updateSectionTitle = (sectionIndex, title) => {
        setConfig(produce(config, draft => {
            draft.sections[sectionIndex].title = title;
        }));
    };

    const deleteSection = (sectionIndex) => {
        const newConfig = produce(config, draft => {
            draft.sections.splice(sectionIndex, 1);
        });
        setConfig(newConfig);
        updateNodeConfig(node.id, { ...node.data, listConfig: newConfig });
    };

    const addRow = (sectionIndex) => {
        setConfig(produce(config, draft => {
             draft.sections[sectionIndex].rows.push({ title: 'Nueva Opción', description: '' });
        }));
    };
    
    const updateRow = (sectionIndex, rowIndex, field, value) => {
         setConfig(produce(config, draft => {
            draft.sections[sectionIndex].rows[rowIndex][field] = value;
        }));
    };

    const deleteRow = (sectionIndex, rowIndex) => {
        const newConfig = produce(config, draft => {
            draft.sections[sectionIndex].rows.splice(rowIndex, 1);
        });
        setConfig(newConfig);
        updateNodeConfig(node.id, { ...node.data, listConfig: newConfig });
    };

    return (
        <div className="space-y-6">
            <SettingsSection title="📑 Contenido Inicial del Mensaje de Lista">
                <Field label="Título (Header)" htmlFor="list-header">
                    <Input id="list-header" value={config.header || ''} onChange={(e) => handleFieldChange('header', e.target.value)} onBlur={handleSave} />
                </Field>
                <Field label="Cuerpo del Mensaje (Body)" htmlFor="list-body">
                    <Textarea id="list-body" value={config.body || ''} onChange={(e) => handleFieldChange('body', e.target.value)} onBlur={handleSave} />
                </Field>
                <Field label="Pie de Página (Footer)" htmlFor="list-footer">
                    <Input id="list-footer" value={config.footer || ''} onChange={(e) => handleFieldChange('footer', e.target.value)} onBlur={handleSave} />
                </Field>
                <Field label="Texto del Botón Principal" htmlFor="list-button">
                    <Input id="list-button" value={config.buttonText || ''} onChange={(e) => handleFieldChange('buttonText', e.target.value)} onBlur={handleSave} />
                </Field>
            </SettingsSection>

            <SettingsSection title="Estructura de la Lista">
                {config.sections.map((section, sIdx) => (
                    <div key={sIdx} className="p-3 border border-neutral-700 rounded-md space-y-3 bg-neutral-900">
                        <div className="flex items-center gap-2">
                            <Input 
                                placeholder="Título de la Sección" 
                                value={section.title || ''}
                                onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
                                onBlur={handleSave}
                                className="flex-grow"
                            />
                            <Button variant="ghost" size="icon" onClick={() => deleteSection(sIdx)}><Trash2 size={16} /></Button>
                        </div>
                        <div className="space-y-2 pl-4">
                            {section.rows.map((row, rIdx) => (
                                <div key={rIdx} className="flex items-center gap-2">
                                    <div className="flex-grow space-y-1">
                                         <Input 
                                            placeholder="Título de la Opción"
                                            value={row.title || ''}
                                            onChange={(e) => updateRow(sIdx, rIdx, 'title', e.target.value)}
                                            onBlur={handleSave}
                                        />
                                        <Input 
                                            placeholder="Descripción (Opcional)"
                                            value={row.description || ''}
                                            onChange={(e) => updateRow(sIdx, rIdx, 'description', e.target.value)}
                                            onBlur={handleSave}
                                        />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => deleteRow(sIdx, rIdx)}><Trash2 size={16} /></Button>
                                </div>
                            ))}
                             <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => addRow(sIdx)}><Plus size={14} className="mr-2"/>Añadir Opción</Button>
                        </div>
                    </div>
                ))}
                 <Button variant="outline" className="w-full" onClick={addSection}><Plus size={16} className="mr-2"/>Añadir Sección</Button>
            </SettingsSection>
        </div>
    );
};

const CaptureInputSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [config, setConfig] = useState({
        message: node.data.message || '',
        variable: node.data.variable || '',
        validationType: node.data.validationType || 'text',
        errorMessage: node.data.errorMessage || ''
    });

    useEffect(() => {
        setConfig(prev => ({ ...prev, ...node.data }));
    }, [node.data]);
    
    const handleUpdate = () => {
        updateNodeConfig(node.id, config);
    };

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
             <SettingsSection title="📝 Capturar Entrada">
                <Field label="Mensaje de Solicitud" htmlFor="capture-message">
                    <Textarea id="capture-message" value={config.message || ''} onChange={(e) => handleChange('message', e.target.value)} onBlur={handleUpdate} placeholder="Ej: ¿Cuál es tu nombre?" />
                </Field>
                <Field label="Guardar en Variable" htmlFor="capture-variable">
                    <Input id="capture-variable" value={config.variable || ''} onChange={(e) => handleChange('variable', e.target.value)} onBlur={handleUpdate} placeholder="Ej: nombre_usuario" />
                </Field>
            </SettingsSection>
            <SettingsSection title="Validación">
                <Field label="Tipo de Entrada Esperada" htmlFor="validation-type">
                    <Select value={config.validationType || 'text'} onValueChange={(v) => {handleChange('validationType', v); handleUpdate()}}>
                         <SelectTrigger><SelectValue/></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="number">Número</SelectItem>
                            <SelectItem value="email">Correo Electrónico</SelectItem>
                            <SelectItem value="date">Fecha</SelectItem>
                         </SelectContent>
                    </Select>
                </Field>
                <Field label="Mensaje de Error de Validación" htmlFor="error-message">
                     <Input id="error-message" value={config.errorMessage || ''} onChange={(e) => handleChange('errorMessage', e.target.value)} onBlur={handleUpdate} placeholder="Ej: Por favor, ingresa un número válido." />
                </Field>
            </SettingsSection>
        </div>
    );
};

const ConditionSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    // A simplified version for now, can be expanded.
    return (
        <SettingsSection title="⚠️ Condición">
            <p className="text-gray-500 text-center py-4">Configuración avanzada de Condiciones próximamente.</p>
            <p className="text-xs text-gray-400 text-center">Salidas fijas: <strong>True</strong> y <strong>False</strong>.</p>
        </SettingsSection>
    )
};

const WebhookSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    // A simplified version for now, can be expanded.
    return (
        <SettingsSection title="💻 Webhook">
            <p className="text-gray-500 text-center py-4">Configuración avanzada de Webhooks próximamente.</p>
             <p className="text-xs text-gray-400 text-center">Salidas fijas: <strong>Success</strong> y <strong>Failure</strong>.</p>
        </SettingsSection>
    )
};

const SetVariableSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    // A simplified version for now, can be expanded.
     return (
        <SettingsSection title="🟢 Asignar Variable">
            <p className="text-gray-500 text-center py-4">Configuración avanzada de Variables próximamente.</p>
        </SettingsSection>
    )
};

const EndSettings = ({ node, updateNodeConfig }: NodeSettingsProps) => {
    const [restart, setRestart] = useState(node.data.restart || false);

    const handleCheckChange = (checked) => {
        setRestart(checked);
        updateNodeConfig(node.id, {...node.data, restart: checked});
    }
    
     return (
        <SettingsSection title="🔴 Fin del Flujo">
            <p className="text-sm text-gray-400">Este nodo termina el flujo actual de la conversación.</p>
             <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="restart-flow" checked={restart} onCheckedChange={handleCheckChange} />
                <Label htmlFor="restart-flow" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Permitir al usuario reiniciar el bot
                </Label>
            </div>
        </SettingsSection>
    )
};

// --- Panel Principal ---
const SettingsPanel = ({ selectedNode, updateNodeConfig, deleteNode, isOpen, onToggle }: SettingsPanelProps) => {
  if (!isOpen) {
    return (
      <div className="absolute top-1/2 right-0 -translate-y-1/2">
        <Button size="icon" onClick={onToggle} className="rounded-r-none"><ChevronLeft className="h-4 w-4" /></Button>
      </div>
    );
  }

  const nodeSettingsMap: { [key: string]: React.FC<NodeSettingsProps> } = {
    textMessageNode: TextMessageSettings,
    mediaMessageNode: MediaMessageSettings,
    quickReplyNode: QuickReplySettings,
    listMessageNode: ListMessageSettings,
    captureInputNode: CaptureInputSettings,
    conditionNode: ConditionSettings,
    webhookNode: WebhookSettings,
    setVariableNode: SetVariableSettings,
    endNode: EndSettings,
  };
  
  const NodeSpecificSettings = selectedNode ? nodeSettingsMap[selectedNode.type] : null;

  return (
    <aside className={cn("w-96 bg-neutral-950/80 backdrop-blur-sm p-4 border-l border-neutral-800 text-white flex flex-col transition-all duration-300 ease-in-out", isOpen ? "translate-x-0" : "translate-x-full")}>
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <h3 className="font-bold text-lg">Configuración</h3>
        <Button variant="ghost" size="icon" onClick={onToggle}><ChevronRight className="h-5 w-5" /></Button>
      </div>

      {selectedNode ? (
        <Tabs defaultValue="specific" className="flex-grow flex flex-col mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="specific">Específico</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          <TabsContent value="specific" className="flex-grow py-4 overflow-y-auto">
            {NodeSpecificSettings ? <NodeSpecificSettings node={selectedNode} updateNodeConfig={updateNodeConfig} /> : <p className="text-gray-500">Este nodo no tiene configuraciones específicas.</p>}
          </TabsContent>
          <TabsContent value="general" className="py-4">
            <GeneralSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />
          </TabsContent>
          <div className="mt-auto pt-4 border-t border-neutral-800">
            <Button variant="destructive" onClick={() => deleteNode(selectedNode.id)} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar Nodo
            </Button>
          </div>
        </Tabs>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Selecciona un nodo para editar</p>
        </div>
      )}
    </aside>
  );
};

export default SettingsPanel;
