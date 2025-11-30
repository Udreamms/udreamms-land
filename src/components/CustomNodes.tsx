
// src/components/CustomNodes.tsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import { Clock, MessageSquare, Edit2, Zap, AlertTriangle, CheckCircle, Code, Variable, StopCircle } from 'lucide-react';

const nodeStyle = {
  borderRadius: '8px',
  padding: '12px 16px',
  color: 'white',
  minWidth: '220px',
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

const NodeWrapper = ({ children, header, icon, label }) => (
  <div style={nodeStyle}>
    <div style={nodeHeaderStyle}>
      {icon}
      <span>{label || header}</span>
    </div>
    <div style={{ paddingTop: '8px', borderTop: '1px solid #3f3f46' }}>
      {children}
    </div>
  </div>
);

export const StartNode = ({ data }) => (
  <NodeWrapper header="Start" icon={<CheckCircle size={16} className="text-green-400" />} label={data.label}>
    <p className="text-sm text-gray-400">Punto de inicio de la conversación.</p>
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </NodeWrapper>
);

export const EndNode = ({ data }) => (
  <NodeWrapper header="End / Transfer" icon={<StopCircle size={16} className="text-red-400" />} label={data.label}>
    <p className="text-sm text-gray-400">Finaliza el flujo o transfiere a un agente.</p>
    <Handle type="target" position={Position.Top} style={handleStyle} />
  </NodeWrapper>
);

export const TextMessageNode = ({ data }) => (
  <NodeWrapper header="Text Message" icon={<MessageSquare size={16} className="text-blue-400" />} label={data.label}>
    <p className="text-sm text-gray-300 truncate">{data.text || 'Haz clic para editar el texto.'}</p>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </NodeWrapper>
);

export const MediaMessageNode = ({ data }) => (
    <NodeWrapper header="Media Message" icon={<Zap size={16} className="text-yellow-400" />} label={data.label}>
      <p className="text-sm text-gray-300">Envía una imagen, video o documento.</p>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </NodeWrapper>
);

export const QuickReplyNode = ({ data }) => (
  <NodeWrapper header="Quick Reply Buttons" icon={<Zap size={16} className="text-purple-400" />} label={data.label}>
    <p className="text-sm text-gray-300 truncate">{data.text || 'Haz clic para editar.'}</p>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', gap: '5px' }}>
        { (data.buttons || []).filter(b => b).map((btn, i) => (
            <div key={i} style={{ fontSize: '10px', background: '#4f46e5', padding: '3px 5px', borderRadius: '4px' }}>
                {btn}
                <Handle type="source" position={Position.Bottom} id={`${i}`} style={{...handleStyle, left: `${(i+1)*25}%`}} />
            </div>
        ))}
    </div>
    <Handle type="target" position={Position.Top} style={handleStyle} />
  </NodeWrapper>
);

export const ListMessageNode = ({ data }) => (
    <NodeWrapper header="List Message" icon={<Zap size={16} className="text-indigo-400" />} label={data.label}>
      <p className="text-sm text-gray-300">Envía un mensaje con hasta 10 opciones.</p>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </NodeWrapper>
);

export const ConditionNode = ({ data }) => (
  <NodeWrapper header="Condition / Decision" icon={<AlertTriangle size={16} className="text-orange-400" />} label={data.label}>
    <p className="text-sm text-gray-300">Bifurca el flujo basado en una condición.</p>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Right} id="true" style={{ ...handleStyle, top: '30%' }} />
    <Handle type="source" position={Position.Left} id="false" style={{ ...handleStyle, top: '70%' }} />
  </NodeWrapper>
);

export const CaptureInputNode = ({ data }) => (
  <NodeWrapper header="Capture Input" icon={<Edit2 size={16} className="text-cyan-400" />} label={data.label}>
    <p className="text-sm text-gray-300">Espera y guarda la respuesta del usuario.</p>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} style={handleStyle} />
  </NodeWrapper>
);

export const WebhookNode = ({ data }) => (
  <NodeWrapper header="External Action / Webhook" icon={<Code size={16} className="text-pink-400" />} label={data.label}>
    <p className="text-sm text-gray-300">Llama a un servicio externo (API).</p>
    <Handle type="target" position={Position.Top} style={handleStyle} />
    <Handle type="source" position={Position.Bottom} id="success" style={{ ...handleStyle, left: '30%' }} />
    <Handle type="source" position={Position.Bottom} id="failure" style={{ ...handleStyle, left: '70%' }} />
  </NodeWrapper>
);

export const SetVariableNode = ({ data }) => (
    <NodeWrapper header="Set Variable" icon={<Variable size={16} className="text-lime-400" />} label={data.label}>
        <p className="text-sm text-gray-300">Define o modifica una variable.</p>
        <Handle type="target" position={Position.Top} style={handleStyle} />
        <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </NodeWrapper>
);
