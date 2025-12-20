// src/components/SettingsPanel.tsx
'use client';
import React from 'react';
import { Node } from 'reactflow';
import { Button } from './ui/button';
import { Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { GeneralSettings } from './settings/nodes/GeneralSettings';
import { TextMessageSettings } from './settings/nodes/TextMessageSettings';
import { MediaMessageSettings } from './settings/nodes/MediaMessageSettings';
import { QuickReplySettings } from './settings/nodes/QuickReplySettings';
import { ListMessageSettings } from './settings/nodes/ListMessageSettings';
import { CaptureInputSettings } from './settings/nodes/CaptureInputSettings';
import { ConditionSettings } from './settings/nodes/ConditionSettings';
import { WebhookSettings } from './settings/nodes/WebhookSettings';
import { SetVariableSettings } from './settings/nodes/SetVariableSettings';
import { EndSettings } from './settings/nodes/EndSettings';
import { PollSettings } from './settings/nodes/PollSettings';
import { ContactSettings } from './settings/nodes/ContactSettings';
import { LocationSettings } from './settings/nodes/LocationSettings';
import { PlaceholderSettings } from './settings/nodes/PlaceholderSettings';
import { WhatsappFlowsSettings } from './settings/nodes/WhatsappFlowsSettings';
import { CheckoutSettings } from './settings/nodes/CheckoutSettings';
import { StartSettings } from './settings/nodes/StartSettings'; // Importado

// Nuevos Nodos AI & Management
import { GenerativeAISettings } from './settings/nodes/GenerativeAISettings';
import { TranscriptionSettings } from './settings/nodes/TranscriptionSettings';
import { SentimentAnalysisSettings } from './settings/nodes/SentimentAnalysisSettings';
import { TemplateSettings } from './settings/nodes/TemplateSettings';
import { HumanHandoffSettings } from './settings/nodes/HumanHandoffSettings';

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

const SettingsPanel = ({ selectedNode, updateNodeConfig, deleteNode, isOpen, onToggle }: SettingsPanelProps) => {
  if (!isOpen) {
    return (
      <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
        <Button size="icon" onClick={onToggle} className="rounded-r-none shadow-lg"><ChevronLeft className="h-4 w-4" /></Button>
      </div>
    );
  }

  const nodeSettingsMap: { [key: string]: React.FC<NodeSettingsProps> } = {
    startNode: StartSettings, // Registrado
    textMessageNode: TextMessageSettings,
    mediaMessageNode: MediaMessageSettings,
    quickReplyNode: QuickReplySettings,
    listMessageNode: ListMessageSettings,
    captureInputNode: CaptureInputSettings,
    conditionNode: ConditionSettings,
    webhookNode: WebhookSettings,
    setVariableNode: SetVariableSettings,
    endNode: EndSettings,
    pollNode: PollSettings,
    contactNode: ContactSettings,
    locationNode: LocationSettings,
    firestoreReadWriteNode: PlaceholderSettings,
    delayNode: PlaceholderSettings,
    catalogNode: PlaceholderSettings,
    productNode: PlaceholderSettings,
    whatsappFlowsNode: WhatsappFlowsSettings,
    checkoutNode: CheckoutSettings,
    generativeAINode: GenerativeAISettings,
    transcriptionNode: TranscriptionSettings,
    sentimentAnalysisNode: SentimentAnalysisSettings,
    templateNode: TemplateSettings,
    humanHandoffNode: HumanHandoffSettings,
  };
  
  const NodeSpecificSettings = selectedNode && selectedNode.type && nodeSettingsMap[selectedNode.type] ? nodeSettingsMap[selectedNode.type] : null;

  return (
    <aside className={cn("w-96 bg-neutral-950/80 backdrop-blur-sm p-3 border-l border-neutral-800 text-white flex flex-col transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "translate-x-full")}>
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h3 className="font-bold text-lg">Configuración de Nodo</h3>
        <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-neutral-800 text-neutral-400 hover:text-white"><ChevronRight className="h-5 w-5" /></Button>
      </div>

      {selectedNode ? (
        <div className="flex-grow flex flex-col mt-3 overflow-hidden">
          <Tabs defaultValue="specific" className="flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specific">Específico</TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>
            <div className="flex-grow overflow-y-auto mt-4 space-y-4 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-neutral-800/50">
                <TabsContent value="specific">
                    {NodeSpecificSettings ? <NodeSpecificSettings node={selectedNode} updateNodeConfig={updateNodeConfig} /> : <p className="text-neutral-500 text-center py-8">Este nodo no tiene configuraciones específicas.</p>}
                </TabsContent>
                <TabsContent value="general">
                    <GeneralSettings node={selectedNode} updateNodeConfig={updateNodeConfig} />
                </TabsContent>
            </div>
          </Tabs>
          <div className="mt-auto pt-3 border-t border-neutral-800">
            {/* El nodo de inicio usualmente no se debería borrar, pero lo dejo por consistencia si el usuario quiere */}
            <Button variant="destructive" onClick={() => deleteNode(selectedNode.id)} className="w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar Nodo
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-neutral-500 text-center">Selecciona un nodo para <br/> ver su configuración</p>
        </div>
      )}
    </aside>
  );
};

export default SettingsPanel;
