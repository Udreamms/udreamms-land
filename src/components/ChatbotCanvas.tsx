
// src/components/ChatbotCanvas.tsx
'use client';
import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from './ui/button';
import {
  StartNode,
  EndNode,
  TextMessageNode,
  MediaMessageNode,
  QuickReplyNode,
  ListMessageNode,
  ConditionNode,
  CaptureInputNode,
  WebhookNode,
  SetVariableNode,
} from './CustomNodes';
import SettingsPanel from './SettingsPanel';
import { MessageSquare, Zap, AlertTriangle, Edit2, Code, Variable, StopCircle, Grid, AppWindow, Rows, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatbotCanvasRef {
  getFlowData: () => { nodes: Node[], edges: Edge[] };
  setFlowData: (data: { nodes: Node[], edges: Edge[] }) => void;
}

interface ChatbotCanvasProps {
  botId: string;
}

const initialNodes: Node[] = [
  { id: '1', type: 'startNode', position: { x: 350, y: 25 }, data: { label: 'Inicio' } },
];

// Define nodeTypes outside the component to ensure a stable reference
const nodeTypes = {
    startNode: StartNode,
    endNode: EndNode,
    textMessageNode: TextMessageNode,
    mediaMessageNode: MediaMessageNode,
    quickReplyNode: QuickReplyNode,
    listMessageNode: ListMessageNode,
    conditionNode: ConditionNode,
    captureInputNode: CaptureInputNode,
    webhookNode: WebhookNode,
    setVariableNode: SetVariableNode,
};

const SidebarNode = ({ icon, label, nodeType, onDragStart, isCollapsed }) => (
    <div
      className={cn("flex items-center p-3 mb-2 rounded-lg cursor-grab bg-neutral-800 hover:bg-neutral-700 transition-colors", isCollapsed && "justify-center")}
      onDragStart={(event) => onDragStart(event, nodeType)}
      draggable
    >
      {icon}
      <span className={cn("ml-3 text-sm font-medium text-white", isCollapsed && "hidden")}>{label}</span>
    </div>
);

const ChatbotCanvas = forwardRef<ChatbotCanvasRef, ChatbotCanvasProps>(({ botId }, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Lines);
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setRightSidebarOpen] = useState(false);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }, eds)),
    [setEdges],
  );
  
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode = { id: `node_${+new Date()}`, type, position, data: { label: `Nuevo ${type.replace('Node', '')}` } };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
    setRightSidebarOpen(true);
  };
  const onPaneClick = () => {
    setSelectedNode(null);
    setRightSidebarOpen(false);
    setLeftSidebarOpen(false);
  };

  const updateNodeConfig = (nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node))
    );
    if(selectedNode?.id === nodeId){
        setSelectedNode(prev => ({...prev, data: {...prev.data, ...data}}));
    }
  };
  
  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
    setRightSidebarOpen(false);
  }
  
  useImperativeHandle(ref, () => ({
    getFlowData() {
      return { nodes, edges };
    },
    setFlowData(data) {
      if (data && data.nodes) {
        setNodes(data.nodes);
        setEdges(data.edges || []);
      }
    }
  }));

  const onDragStart = (event, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex h-full bg-neutral-900">
       <aside className={cn("bg-neutral-950/50 p-4 border-r border-neutral-800 transition-all duration-300 ease-in-out", isLeftSidebarOpen ? "w-72" : "w-20")}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={cn("text-xl font-bold text-white", !isLeftSidebarOpen && "hidden")}>Nodos</h2>
          <Button variant="ghost" size="icon" onClick={() => setLeftSidebarOpen(!isLeftSidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <p className={cn("text-xs text-gray-400 mb-4", !isLeftSidebarOpen && "hidden")}>Arrastra un nodo al lienzo.</p>
        <SidebarNode icon={<MessageSquare size={16} className="text-blue-400" />} label="Mensaje de Texto" nodeType="textMessageNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<Zap size={16} className="text-yellow-400" />} label="Mensaje Multimedia" nodeType="mediaMessageNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<Zap size={16} className="text-purple-400" />} label="Respuesta Rápida" nodeType="quickReplyNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<Zap size={16} className="text-indigo-400" />} label="Mensaje de Lista" nodeType="listMessageNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<AlertTriangle size={16} className="text-orange-400" />} label="Condición" nodeType="conditionNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<Edit2 size={16} className="text-cyan-400" />} label="Capturar Entrada" nodeType="captureInputNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<Code size={16} className="text-pink-400" />} label="Webhook" nodeType="webhookNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<Variable size={16} className="text-lime-400" />} label="Asignar Variable" nodeType="setVariableNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
        <SidebarNode icon={<StopCircle size={16} className="text-red-400" />} label="Fin" nodeType="endNode" onDragStart={onDragStart} isCollapsed={!isLeftSidebarOpen} />
      </aside>

      <div className="flex-1 relative" onDrop={onDrop} onDragOver={onDragOver}>
        <div className="absolute top-4 left-4 z-10 flex space-x-2 bg-neutral-800 p-2 rounded-lg">
            <Button onClick={() => setBackgroundVariant(BackgroundVariant.Lines)} className={`p-2 ${backgroundVariant === BackgroundVariant.Lines ? 'bg-indigo-600' : 'bg-neutral-700'} hover:bg-indigo-500`}><Rows size={20}/></Button>
            <Button onClick={() => setBackgroundVariant(BackgroundVariant.Dots)} className={`p-2 ${backgroundVariant === BackgroundVariant.Dots ? 'bg-indigo-600' : 'bg-neutral-700'} hover:bg-indigo-500`}><Grid size={20}/></Button>
            <Button onClick={() => setBackgroundVariant(BackgroundVariant.Cross)} className={`p-2 ${backgroundVariant === BackgroundVariant.Cross ? 'bg-indigo-600' : 'bg-neutral-700'} hover:bg-indigo-500`}><AppWindow size={20}/></Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          onInit={setReactFlowInstance}
          fitView
          className="bg-neutral-900"
        >
          <Controls />
          <MiniMap nodeColor="#8b5cf6" nodeStrokeWidth={3} zoomable pannable />
          <Background variant={backgroundVariant} gap={24} size={1} color="#404040" />
        </ReactFlow>
      </div>
      
      <SettingsPanel 
        selectedNode={selectedNode} 
        updateNodeConfig={updateNodeConfig} 
        deleteNode={deleteNode}
        isOpen={isRightSidebarOpen}
        onToggle={() => setRightSidebarOpen(!isRightSidebarOpen)}
      />
    </div>
  );
});
ChatbotCanvas.displayName = 'ChatbotCanvas';

import { ReactFlowProvider } from 'reactflow';

const ChatbotCanvasWithProvider = forwardRef<ChatbotCanvasRef, ChatbotCanvasProps>((props, ref) => (
  <ReactFlowProvider>
    <ChatbotCanvas {...props} ref={ref} />
  </ReactFlowProvider>
));
ChatbotCanvasWithProvider.displayName = 'ChatbotCanvasWithProvider';

export default ChatbotCanvasWithProvider;
