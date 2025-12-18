// src/components/ChatbotCanvas.tsx
'use client';
import React, { useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Edge,
  Node,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  ReactFlowInstance,
  OnConnect,
  ReactFlowProvider,
  updateEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from './ui/button';
import * as nodeComponents from './CustomNodes';
import CustomEdge from './CustomEdge';
import SettingsPanel from './SettingsPanel';
import { 
    Menu, MessageSquare, Image as ImageIcon, Zap, Rows, Edit2, AlertTriangle, Code, Variable, StopCircle, ChevronLeft,
    CheckSquare, Contact, MapPin, BrainCircuit, Bot, Database, Clock, ShoppingCart, CreditCard,
    Rocket, Mic, Smile, Users, ThumbsUp, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarNodeGroups = [
    {
        title: 'Mensajería y UI',
        nodes: [
            { type: 'textMessageNode', label: 'Mensaje de Texto', icon: <MessageSquare className="text-blue-400" /> },
            { type: 'mediaMessageNode', label: 'Mensaje Multimedia', icon: <ImageIcon className="text-yellow-400" /> },
            { type: 'quickReplyNode', label: 'Respuesta Rápida', icon: <Zap className="text-purple-400" /> },
            { type: 'listMessageNode', label: 'Mensaje de Lista', icon: <Rows className="text-indigo-400" /> },
            { type: 'pollNode', label: 'Encuesta Nativa', icon: <CheckSquare className="text-teal-400" /> },
            { type: 'contactNode', label: 'Contacto (VCard)', icon: <Contact className="text-orange-400" /> },
            { type: 'locationNode', label: 'Ubicación', icon: <MapPin className="text-red-400" /> },
        ]
    },
    {
        title: 'Lógica y Procesamiento',
        nodes: [
            { type: 'captureInputNode', label: 'Capturar Entrada', icon: <Edit2 className="text-cyan-400" /> },
            { type: 'conditionNode', label: 'Condición (If/Else)', icon: <BrainCircuit className="text-amber-400" /> },
            { type: 'setVariableNode', label: 'Asignar Variable', icon: <Variable className="text-lime-400" /> },
            { type: 'webhookNode', label: 'Webhook', icon: <Code className="text-pink-400" /> },
            { type: 'firestoreReadWriteNode', label: 'Consulta Firestore', icon: <Database className="text-gray-400" /> },
            { type: 'delayNode', label: 'Espera / Delay', icon: <Clock className="text-gray-400" /> },
            { type: 'endNode', label: 'Fin de Flujo', icon: <StopCircle className="text-red-500" /> },
        ]
    },
    {
        title: 'Comercio y Ventas',
        nodes: [
            { type: 'catalogNode', label: 'Catálogo de Productos', icon: <ShoppingCart className="text-green-400" /> },
            { type: 'productNode', label: 'Producto Único/Múltiple', icon: <CreditCard className="text-green-400" /> },
            { type: 'whatsappFlowsNode', label: 'WhatsApp Flows', icon: <Rocket className="text-green-400" /> },
            { type: 'checkoutNode', label: 'Nodo de Pago', icon: <ThumbsUp className="text-green-400" /> },
        ]
    },
    {
        title: 'Inteligencia Artificial',
        nodes: [
            { type: 'generativeAINode', label: 'IA Generativa (LLM)', icon: <Bot className="text-sky-400" /> },
            { type: 'transcriptionNode', label: 'Transcripción (Audio)', icon: <Mic className="text-sky-400" /> },
            { type: 'sentimentAnalysisNode', label: 'Análisis de Sentimiento', icon: <Smile className="text-sky-400" /> },
        ]
    },
    {
        title: 'Gestión y Soporte',
        nodes: [
            { type: 'templateNode', label: 'Plantillas (Templates)', icon: <Send className="text-fuchsia-400" /> },
            { type: 'humanHandoffNode', label: 'Transferencia a Humano', icon: <Users className="text-fuchsia-400" /> },
        ]
    }
];
const sidebarNodes = sidebarNodeGroups.flatMap(group => group.nodes);


export interface ChatbotCanvasRef {}
interface ChatbotCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}

const SidebarNode = ({ icon, label, type: nodeType, onDragStart, isCollapsed }) => {
    const nodeContent = (
        <div
            className={cn("flex items-center p-3 mb-2 rounded-lg cursor-grab bg-neutral-800/80 hover:bg-neutral-700/80 transition-colors border border-neutral-700/50", isCollapsed && "justify-center")}
            onDragStart={(event) => onDragStart(event, nodeType)}
            draggable
        >
            {React.cloneElement(icon, { size: 20 })}
            <span className={cn("ml-3 text-sm font-medium text-white", isCollapsed && "hidden")}>{label}</span>
        </div>
    );

    return isCollapsed ? (
        <Tooltip>
            <TooltipTrigger asChild>{nodeContent}</TooltipTrigger>
            <TooltipContent side="right" className="bg-neutral-800 text-white border-neutral-700">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    ) : (
        nodeContent
    );
};

const ChatbotCanvas = forwardRef<ChatbotCanvasRef, ChatbotCanvasProps>(
  ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges }, ref) => {
    
    // MEMOIZE nodeTypes and edgeTypes to prevent unnecessary re-renders and warnings
    // Defining the object INSIDE useMemo to strictly follow "Alternative implementation" from React Flow docs
    const nodeTypes = useMemo(() => ({
        startNode: nodeComponents.StartNode,
        endNode: nodeComponents.EndNode,
        textMessageNode: nodeComponents.TextMessageNode,
        mediaMessageNode: nodeComponents.MediaMessageNode,
        quickReplyNode: nodeComponents.QuickReplyNode,
        listMessageNode: nodeComponents.ListMessageNode,
        pollNode: nodeComponents.PollNode,
        contactNode: nodeComponents.ContactNode,
        locationNode: nodeComponents.LocationNode,
        captureInputNode: nodeComponents.CaptureInputNode,
        conditionNode: nodeComponents.ConditionNode,
        setVariableNode: nodeComponents.SetVariableNode,
        webhookNode: nodeComponents.WebhookNode,
        firestoreReadWriteNode: nodeComponents.FirestoreReadWriteNode,
        delayNode: nodeComponents.DelayNode,
        catalogNode: nodeComponents.CatalogNode,
        productNode: nodeComponents.ProductNode,
        whatsappFlowsNode: nodeComponents.WhatsappFlowsNode,
        checkoutNode: nodeComponents.CheckoutNode,
        generativeAINode: nodeComponents.GenerativeAINode,
        transcriptionNode: nodeComponents.TranscriptionNode,
        sentimentAnalysisNode: nodeComponents.SentimentAnalysisNode,
        templateNode: nodeComponents.TemplateNode,
        humanHandoffNode: nodeComponents.HumanHandoffNode,
    }), []);

    const edgeTypes = useMemo(() => ({
        custom: CustomEdge,
    }), []);

    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);
    
    const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
    
    const onDrop = useCallback(
      (event) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        if (typeof type === 'undefined' || !type || !reactFlowInstance) return;

        const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
        const newNodeData = sidebarNodes.find(n => n.type === type);
        const newNode: Node = { id: `dndnode_${+new Date()}`, type, position, data: { label: newNodeData?.label || 'Nuevo Nodo' } };
        setNodes((nds) => nds.concat(newNode));
      },
      [reactFlowInstance, setNodes],
    );

    const onEdgeUpdate = useCallback(
      (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
      [setEdges]
    );

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setRightSidebarOpen(true);
    };
    
    const onPaneClick = () => {
        setSelectedNode(null);
        setRightSidebarOpen(false);
    };

    const updateNodeConfig = useCallback((nodeId: string, data: object) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node))
        );
        if (selectedNode?.id === nodeId) {
            setSelectedNode(prev => ({ ...prev!, data: { ...prev!.data, ...data } }));
        }
    }, [selectedNode, setNodes]);
    
    const deleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        setSelectedNode(null);
        setRightSidebarOpen(false);
    }, [setNodes, setEdges]);
    
    useImperativeHandle(ref, () => ({}));

    return (
      <div className="flex h-full bg-neutral-950">
        <aside className={cn("bg-neutral-950/50 p-3 border-r border-neutral-800 transition-all duration-300 ease-in-out", isLeftSidebarOpen ? "w-96" : "w-20")}>
            <div className="flex items-center justify-between mb-4 h-10">
                <h2 className={cn("text-lg font-bold text-white", !isLeftSidebarOpen && "hidden")}>Nodos Disponibles</h2>
                <Button variant="ghost" size="icon" onClick={() => setLeftSidebarOpen(!isLeftSidebarOpen)} className="hover:bg-neutral-800 text-neutral-400 hover:text-white">
                    {isLeftSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-3rem)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {sidebarNodeGroups.map((group, index) => (
                    <div key={index}>
                        <h3 className={cn("text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-4", isLeftSidebarOpen ? "px-2" : "text-center")}>
                            {isLeftSidebarOpen ? group.title : "•"}
                        </h3>
                        {group.nodes.map(nodeInfo => (
                            <SidebarNode key={nodeInfo.type} {...nodeInfo} onDragStart={(e, type) => e.dataTransfer.setData('application/reactflow', type)} isCollapsed={!isLeftSidebarOpen} />
                        ))}
                    </div>
                ))}
            </div>
        </aside>

        <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={setReactFlowInstance}
            fitView
            className="bg-neutral-950"
          >
            <Controls className="[&>button]:bg-neutral-800/80 [&>button]:border-neutral-700 hover:[&>button]:bg-neutral-700" />
            <MiniMap nodeStrokeWidth={3} zoomable pannable className="!bg-neutral-900/80 !border-neutral-700"/>
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#2d2d2d" />
          </ReactFlow>
        </div>
        
        <SettingsPanel 
          selectedNode={selectedNode} 
          updateNodeConfig={updateNodeConfig} 
          deleteNode={deleteNode}
          isOpen={isRightSidebarOpen}
          onToggle={() => setRightSidebarOpen(o => !o)}
        />
      </div>
    );
});
ChatbotCanvas.displayName = 'ChatbotCanvas';

const ChatbotCanvasWithProvider = forwardRef<ChatbotCanvasRef, ChatbotCanvasProps>((props, ref) => (
  <TooltipProvider delayDuration={0}>
    <ReactFlowProvider>
      <ChatbotCanvas {...props} ref={ref} />
    </ReactFlowProvider>
  </TooltipProvider>
));
ChatbotCanvasWithProvider.displayName = 'ChatbotCanvasWithProvider';

export default ChatbotCanvasWithProvider;
