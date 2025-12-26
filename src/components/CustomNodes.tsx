
// src/components/CustomNodes.tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
    MessageSquare, Edit2, Zap, AlertTriangle, CheckCircle, Code, Variable, 
    StopCircle, Rows, ImageIcon, CheckSquare, Contact, MapPin, BrainCircuit, 
    Database, Clock, ShoppingCart, CreditCard, Rocket, Mic, Smile, Users, ThumbsUp, Send, Bot
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

// --- CORRECCIÓN DEL ERROR DE BUILD ---
// Se añade 'id = undefined' para que el prop 'id' sea opcional.
// React Flow internamente asignará un id 'null' si no se provee uno, lo cual es válido.
const HandleStyled = ({ type, position, id = undefined, ...props }) => (
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
        {data.text || data.bodyText || 'Haz clic para editar.'}
    </p>
    <div className="space-y-1.5 pt-1">
        { (data.buttons || []).filter(b => b).map((btn, i) => {
            const isObject = typeof btn === 'object' && btn !== null;
            const label = isObject ? btn.title : btn;
            const id = isObject ? (btn.id || btn.payload || btn.title) : btn;
            return (
                <OptionRow key={i} handleId={id}>{label}</OptionRow>
            )
        })}
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
              { (section.rows || section.options || []).map((opt, optIndex) => {
                  const isObject = typeof opt === 'object' && opt !== null;
                  const label = isObject ? opt.title : opt;
                  const id = isObject ? opt.id : opt;
                  return (
                    <OptionRow key={optIndex} handleId={id}>{label || `Opción ${optIndex + 1}`}</OptionRow>
                  );
              })}
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
  <NodeWrapper header="Condición" icon={<BrainCircuit size={20} className="text-amber-400" />} label={data.label} color="border-amber-500">
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

// --- NUEVOS NODOS (PLACEHOLDERS) ---

export const PollNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Encuesta Nativa" icon={<CheckSquare size={20} className="text-teal-400" />} label={data.label} color="border-teal-500">
        <p className="text-xs text-neutral-400">Crea una pregunta con opciones para votar.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const ContactNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Contacto (VCard)" icon={<Contact size={20} className="text-orange-400" />} label={data.label} color="border-orange-500">
        <p className="text-xs text-neutral-400">Envía una ficha de contacto.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const LocationNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Ubicación" icon={<MapPin size={20} className="text-red-400" />} label={data.label} color="border-red-500">
        <p className="text-xs text-neutral-400">Envía coordenadas geográficas.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const FirestoreReadWriteNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Consulta Firestore" icon={<Database size={20} className="text-gray-400" />} label={data.label} color="border-gray-500">
        <p className="text-xs text-neutral-400">Lee o escribe en la base de datos.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const DelayNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Espera / Delay" icon={<Clock size={20} className="text-gray-400" />} label={data.label} color="border-gray-500">
        <p className="text-xs text-neutral-400">Introduce una pausa en el flujo.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const CatalogNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Catálogo de Productos" icon={<ShoppingCart size={20} className="text-green-400" />} label={data.label} color="border-green-500">
        <p className="text-xs text-neutral-400">Muestra un catálogo de productos.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const ProductNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Producto Único/Múltiple" icon={<CreditCard size={20} className="text-green-400" />} label={data.label} color="border-green-500">
        <p className="text-xs text-neutral-400">Envía uno o varios productos.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const WhatsappFlowsNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="WhatsApp Flows" icon={<Rocket size={20} className="text-green-400" />} label={data.label} color="border-green-500">
        <p className="text-xs text-neutral-400">Inicia un formulario interactivo.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const CheckoutNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Nodo de Pago" icon={<ThumbsUp size={20} className="text-green-400" />} label={data.label} color="border-green-500">
        <p className="text-xs text-neutral-400">Integra una pasarela de pago.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const GenerativeAINode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="IA Generativa (LLM)" icon={<Bot size={20} className="text-sky-400" />} label={data.label} color="border-sky-500">
        <p className="text-xs text-neutral-400">Conecta con un modelo de lenguaje.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const TranscriptionNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Transcripción (Audio)" icon={<Mic size={20} className="text-sky-400" />} label={data.label} color="border-sky-500">
        <p className="text-xs text-neutral-400">Convierte audio a texto.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const SentimentAnalysisNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Análisis de Sentimiento" icon={<Smile size={20} className="text-sky-400" />} label={data.label} color="border-sky-500">
        <p className="text-xs text-neutral-400">Clasifica la emoción del usuario.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const TemplateNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Plantillas (Templates)" icon={<Send size={20} className="text-fuchsia-400" />} label={data.label} color="border-fuchsia-500">
        <p className="text-xs text-neutral-400">Envía notificaciones aprobadas por Meta.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);

export const HumanHandoffNode = ({ data = {} }: NodeProps) => (
    <NodeWrapper header="Transferencia a Humano" icon={<Users size={20} className="text-fuchsia-400" />} label={data.label} color="border-fuchsia-500">
        <p className="text-xs text-neutral-400">Transfiere la conversación a un agente.</p>
        <HandleStyled type="target" position={Position.Left} />
        <HandleStyled type="source" position={Position.Right} />
    </NodeWrapper>
);
