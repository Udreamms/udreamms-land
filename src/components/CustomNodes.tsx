
// src/components/CustomNodes.tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
    MessageSquare, Edit2, Zap, AlertTriangle, CheckCircle, Code, Variable, 
    StopCircle, Rows, ImageIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- COMPONENTES BASE MEJORADOS CON TAILWIND ---

interface NodeWrapperProps {
  children: React.ReactNode;
  header: string;
  icon: React.ReactNode;
  label?: string;
  color: string; // Tailwind color class e.g., 'border-blue-500'
}

const NodeWrapper = ({ children, header, icon, label, color }: NodeWrapperProps) => (
  // SOLUCIÓN:
  // 1. Se eliminó la clase 'react-flow__node-default' para evitar heredar estilos no deseados.
  // 2. Se aumentó el ancho a 'w-80' (320px).
  // 3. Se aseguró un fondo sólido con 'bg-neutral-800'.
  // 4. Se aumentó el redondeo con 'rounded-xl'.
  <div className={cn("rounded-xl shadow-lg border-2 bg-neutral-800 w-80", color)}>
    {/* HEADER */}
    <div className={cn("p-3 rounded-t-lg flex items-center gap-3", color.replace('border-', 'bg-').replace('-500', '-900/60'))}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <p className="font-bold text-white text-sm">{label || header}</p>
        <p className="text-xs text-neutral-400 -mt-0.5">{header}</p>
      </div>
    </div>
    
    {/* CONTENT */}
    <div className="p-4 text-sm text-neutral-300 space-y-2">
      {children}
    </div>
  </div>
);

const HandleStyled = ({ type, position, id, ...props }) => (
    <Handle 
        type={type} 
        position={position} 
        id={id}
        className="!w-3 !h-3 !bg-neutral-600 !border-2 !border-neutral-800 hover:!bg-blue-500 hover:!border-white transition-all"
        {...props}
    />
);

const OptionRow = ({ children, handleId }) => (
    <div className="flex justify-between items-center p-2 rounded-md bg-neutral-700/80 relative">
        <span className="truncate text-xs">{children}</span>
        <HandleStyled type="source" position={Position.Right} id={handleId} />
    </div>
);


// --- NODOS ESPECÍFICOS REDISEÑADOS --- (No necesitan cambios, heredan de NodeWrapper)

export const StartNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Inicio" icon={<CheckCircle size={20} className="text-green-400" />} label={data.label} color="border-green-500">
    <p className="text-xs text-neutral-400 text-center py-2">Punto de inicio de la conversación.</p>
    <HandleStyled type="source" position={Position.Right} />
  </NodeWrapper>
);

export const EndNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Fin / Transferir" icon={<StopCircle size={20} className="text-red-400" />} label={data.label} color="border-red-500">
    <p className="text-xs text-neutral-400 text-center py-2">Finaliza el flujo del bot.</p>
    <HandleStyled type="target" position={Position.Left} />
  </NodeWrapper>
);

export const TextMessageNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Mensaje de Texto" icon={<MessageSquare size={20} className="text-blue-400" />} label={data.label} color="border-blue-500">
    <p className="text-xs text-neutral-400">Contenido:</p>
    <p className="whitespace-pre-wrap bg-neutral-900/70 p-2 rounded-md text-white max-h-28 overflow-y-auto text-xs">
        {data.content || 'Haz clic para editar el texto...'}
    </p>
    <HandleStyled type="target" position={Position.Left} />
    <HandleStyled type="source" position={Position.Right} />
  </NodeWrapper>
);

export const CaptureInputNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Capturar Entrada" icon={<Edit2 size={20} className="text-cyan-400" />} label={data.label} color="border-cyan-500">
      <p className="text-xs text-neutral-400">Espera y guarda la respuesta del usuario.</p>
      {data.variable && <p className="text-xs text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded-md">Guardar en: {`{{${data.variable}}}`}</p>}
      <HandleStyled type="target" position={Position.Left} />
      <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const QuickReplyNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Respuesta Rápida" icon={<Zap size={20} className="text-purple-400" />} label={data.label} color="border-purple-500">
    <p className="text-xs text-neutral-400">Texto:</p>
    <p className="whitespace-pre-wrap bg-neutral-900/70 p-2 rounded-md text-white max-h-20 overflow-y-auto text-xs">
        {data.text || 'Haz clic para editar.'}
    </p>
    <div className="space-y-1.5 pt-1">
        { (data.buttons || []).filter(b => b).map((btn, i) => (
            <OptionRow key={i} handleId={btn}>{btn}</OptionRow>
        ))}
    </div>
    <HandleStyled type="target" position={Position.Left} />
  </NodeWrapper>
);

export const ListMessageNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Mensaje de Lista" icon={<Rows size={20} className="text-indigo-400" />} label={data.label} color="border-indigo-500">
        <p className="text-xs text-neutral-400">Texto Principal:</p>
        <p className="whitespace-pre-wrap bg-neutral-900/70 p-2 rounded-md text-white max-h-20 overflow-y-auto text-xs">
            {data.text || 'Haz clic para editar.'}
        </p>
      { (data.sections || []).map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-1.5 pt-1">
              <p className="text-xs text-indigo-300 font-semibold">{section.title || `Sección ${sectionIndex + 1}`}</p>
              { (section.options || []).map((opt, optIndex) => (
                  <OptionRow key={optIndex} handleId={opt}>{opt || `Opción ${optIndex + 1}`}</OptionRow>
              ))}
          </div>
      ))}
      <HandleStyled type="target" position={Position.Left} />
    </NodeWrapper>
);

export const MediaMessageNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Mensaje Multimedia" icon={<ImageIcon size={20} className="text-yellow-400" />} label={data.label} color="border-yellow-500">
      <p className="text-xs text-neutral-400">{data.url ? 'Archivo:' : 'Envía una imagen, video o documento.'}</p>
      {data.url && <p className="text-xs text-yellow-300 truncate bg-yellow-900/50 px-2 py-1 rounded-md">{data.filename || data.url}</p>}
      <HandleStyled type="target" position={Position.Left} />
      <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const ConditionNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Condición" icon={<AlertTriangle size={20} className="text-orange-400" />} label={data.label} color="border-orange-500">
    <p className="text-xs text-neutral-400">Bifurca el flujo basado en una condición.</p>
    <div className="space-y-1.5 pt-1">
        <OptionRow handleId="true">Verdadero</OptionRow>
        <OptionRow handleId="false">Falso</OptionRow>
    </div>
    <HandleStyled type="target" position={Position.Left} />
  </NodeWrapper>
);

export const WebhookNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Webhook" icon={<Code size={20} className="text-pink-400" />} label={data.label} color="border-pink-500">
    <p className="text-xs text-neutral-400">Llama a un servicio externo (API).</p>
    <div className="space-y-1.5 pt-1">
        <OptionRow handleId="success">Éxito</OptionRow>
        <OptionRow handleId="failure">Fallo</OptionRow>
    </div>
    <HandleStyled type="target" position={Position.Left} />
  </NodeWrapper>
);

export const SetVariableNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Asignar Variable" icon={<Variable size={20} className="text-lime-400" />} label={data.label} color="border-lime-500">
        <p className="text-xs text-neutral-400">Define o modifica una variable.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);
