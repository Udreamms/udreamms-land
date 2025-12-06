
// src/components/CustomNodes.tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
    MessageSquare, Edit2, Zap, AlertTriangle, CheckCircle, Code, Variable, 
    StopCircle, FileText, Video, Mic, Image as ImageIcon, Rows 
} from 'lucide-react';

// --- ESTILOS ---
const nodeStyle = {
  borderRadius: '8px',
  padding: '12px 16px',
  color: 'white',
  minWidth: '250px',
  border: '1px solid #3f3f46',
  backgroundColor: '#27272a',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};
const nodeHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 'bold',
};
const handleStyle = {
  width: '10px',
  height: '10px',
  background: '#8b5cf6',
  border: '1px solid #ede9fe'
};
const contentStyle = {
  paddingTop: '8px',
  borderTop: '1px solid #3f3f46',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};
const optionRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 8px',
  borderRadius: '4px',
  backgroundColor: '#3f3f46',
  position: 'relative',
};

// --- COMPONENTES BASE ---
const NodeWrapper = ({ children, header, icon, label }) => (
  <div style={nodeStyle}>
    <div style={nodeHeaderStyle}>
      {icon}
      <span>{label || header}</span>
    </div>
    <div style={contentStyle}>
      {children}
    </div>
  </div>
);


// --- NODOS ESPECÍFICOS ---
// Cada componente ahora tiene un `data = {}` por defecto y accede a las propiedades de `data` de forma segura.

export const StartNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Start" icon={<CheckCircle size={16} className="text-green-400" />} label={data.label}>
    <p className="text-sm text-gray-400">Punto de inicio de la conversación.</p>
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </NodeWrapper>
);

export const EndNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="End / Transfer" icon={<StopCircle size={16} className="text-red-400" />} label={data.label}>
    <p className="text-sm text-gray-400">Finaliza el flujo o transfiere a un agente.</p>
    <Handle type="target" position={Position.Left} style={handleStyle} />
  </NodeWrapper>
);

export const TextMessageNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Mensaje de Texto" icon={<MessageSquare size={16} className="text-blue-400" />} label={data.label}>
    <p className="text-sm text-gray-300 whitespace-pre-wrap">{data.text || 'Haz clic para editar el texto.'}</p>
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Handle type="source" position={Position.Right} style={handleStyle} />
  </NodeWrapper>
);

export const CaptureInputNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Capturar Entrada" icon={<Edit2 size={16} className="text-cyan-400" />} label={data.label}>
      <p className="text-sm text-gray-400">Espera y guarda la respuesta del usuario.</p>
      {data.variable && <p className="text-xs text-cyan-300">Guardar en: {`{{${data.variable}}}`}</p>}
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </NodeWrapper>
);

export const QuickReplyNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Respuesta Rápida" icon={<Zap size={16} className="text-purple-400" />} label={data.label}>
    <p className="text-sm text-gray-300 whitespace-pre-wrap">{data.text || 'Haz clic para editar.'}</p>
    { (data.buttons || []).filter(b => b).map((btn, i) => (
        <div key={i} style={optionRowStyle}>
            <span>{btn}</span>
            <Handle type="source" position={Position.Right} id={btn} style={handleStyle} />
        </div>
    ))}
    <Handle type="target" position={Position.Left} style={handleStyle} />
  </NodeWrapper>
);

export const ListMessageNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Mensaje de Lista" icon={<Rows size={16} className="text-indigo-400" />} label={data.label}>
      <p className="text-sm text-gray-300 whitespace-pre-wrap">{data.text || 'Haz clic para editar.'}</p>
      { (data.sections || []).map((section, sectionIndex) => (
          <div key={sectionIndex}>
              <p className="text-xs text-gray-400 mb-1">{section.title || `Sección ${sectionIndex + 1}`}</p>
              { (section.options || []).map((opt, optIndex) => (
                  <div key={optIndex} style={{...optionRowStyle, marginBottom: '4px'}}>
                      <span>{opt || `Opción ${optIndex + 1}`}</span>
                      <Handle type="source" position={Position.Right} id={opt} style={handleStyle} />
                  </div>
              ))}
          </div>
      ))}
      <Handle type="target" position={Position.Left} style={handleStyle} />
    </NodeWrapper>
);

export const MediaMessageNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Mensaje Multimedia" icon={<ImageIcon size={16} className="text-yellow-400" />} label={data.label}>
      <p className="text-sm text-gray-300">{data.url ? 'URL:' : 'Envía una imagen, video o documento.'}</p>
      {data.url && <p className="text-xs text-yellow-300 truncate">{data.url}</p>}
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </NodeWrapper>
);

export const ConditionNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Condición" icon={<AlertTriangle size={16} className="text-orange-400" />} label={data.label}>
    <p className="text-sm text-gray-300">Bifurca el flujo basado en una condición.</p>
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Handle type="source" position={Position.Right} id="true" style={{ ...handleStyle, top: '35%' }}> <span className="text-xs absolute right-5 top-[-6px]">True</span> </Handle>
    <Handle type="source" position={Position.Right} id="false" style={{ ...handleStyle, top: '65%' }}> <span className="text-xs absolute right-5 top-[-6px]">False</span> </Handle>
  </NodeWrapper>
);

export const WebhookNode = ({ data = {} }: NodeProps) => (
  <NodeWrapper header="Webhook" icon={<Code size={16} className="text-pink-400" />} label={data.label}>
    <p className="text-sm text-gray-300">Llama a un servicio externo (API).</p>
    <Handle type="target" position={Position.Left} style={handleStyle} />
    <Handle type="source" position={Position.Right} id="success" style={{ ...handleStyle, top: '35%' }}> <span className="text-xs absolute right-5 top-[-6px]">Success</span> </Handle>
    <Handle type="source" position={Position.Right} id="failure" style={{ ...handleStyle, top: '65%' }}> <span className="text-xs absolute right-5 top-[-6px]">Failure</span> </Handle>
  </NodeWrapper>
);

export const SetVariableNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Asignar Variable" icon={<Variable size={16} className="text-lime-400" />} label={data.label}>
        <p className="text-sm text-gray-300">Define o modifica una variable.</p>
        <Handle type="target" position={Position.Left} style={handleStyle} />
        <Handle type="source" position={Position.Right} style={handleStyle} />
    </NodeWrapper>
);
