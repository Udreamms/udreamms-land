import React from 'react';
import {
  Inbox,
  School,
  FileCheck,
  FileText,
  CreditCard,
  Ticket,
  MessageSquare,
  Calendar,
  CheckCircle2,
  XCircle,
  BookOpen,
} from 'lucide-react';

export type StaffTabType =
  | 'nuevos'
  | 'aplicacion_escuela'
  | 'i20_entregado'
  | 'ds160'
  | 'sevis'
  | 'comprar_cita'
  | 'simulacro_entrevista'
  | 'entrevista'
  | 'aprobados'
  | 'negados'
  | 'recursos';

export interface StudentCase {
  id: string;
  name: string;
  email: string;
  phone: string;
  visaType: 'F-1' | 'B-2';
  schoolState: string;
  schoolName: string;
  status: StaffTabType;
  submittedAt: string;
  updatedAt?: string;
  photoUrl?: string;
  passportDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  bankStatementDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  sevisDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  i20Doc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  ds160Doc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  acceptanceLetterDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  affidavitDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  embassyAppointmentDoc?: { name: string; type: string; dataUrl?: string; url?: string; size?: number };
  purchases?: string[];
  entitlements?: Record<string, boolean>;
  groupKey?: string;
  applicantId?: string;
  hasVisaService?: boolean;
  formData: Record<string, string>;
  notes?: string;
  unreadCount?: number;
  lastChatMessage?: string;
}

export interface TabDefinition {
  id: StaffTabType;
  label: string;
  icon: React.ElementType;
  color: string;
}

export const getStatusLabel = (status: StaffTabType): string => {
  switch (status) {
    case 'nuevos':
      return 'Usuarios Registrados';
    case 'aplicacion_escuela':
      return 'Solicitud de Admisión';
    case 'i20_entregado':
      return 'I-20 Recibido';
    case 'ds160':
      return 'Preparación de Documentos';
    case 'sevis':
      return 'Tasa SEVIS (I-901)';
    case 'comprar_cita':
      return 'Listo para Comprar Cita en Embajada';
    case 'simulacro_entrevista':
      return 'Simulacro de Entrevista';
    case 'entrevista':
      return 'Cita en Embajada';
    case 'aprobados':
      return 'Aprobados / Completados';
    case 'negados':
      return 'Negados';
    case 'recursos':
      return 'Recursos & Guías para el Staff';
    default:
      return status;
  }
};

export const STAFF_TABS_LIST: TabDefinition[] = [
  { id: 'nuevos', label: '1. Usuarios Registrados', icon: Inbox, color: 'text-blue-600' },
  { id: 'aplicacion_escuela', label: '2. Solicitud de Admisión', icon: School, color: 'text-sky-600' },
  { id: 'i20_entregado', label: '3. I-20 Recibido', icon: FileCheck, color: 'text-teal-600' },
  { id: 'ds160', label: '4. Preparación de Documentos', icon: FileText, color: 'text-amber-600' },
  { id: 'sevis', label: '5. Tasa SEVIS (I-901)', icon: CreditCard, color: 'text-indigo-600' },
  { id: 'comprar_cita', label: '6. Comprar Cita Embajada', icon: Ticket, color: 'text-orange-600' },
  { id: 'simulacro_entrevista', label: '7. Simulacro Entrevista', icon: MessageSquare, color: 'text-violet-600' },
  { id: 'entrevista', label: '8. Cita en Embajada', icon: Calendar, color: 'text-purple-600' },
  { id: 'aprobados', label: '9. Aprobados', icon: CheckCircle2, color: 'text-emerald-600' },
  { id: 'negados', label: '10. Negados', icon: XCircle, color: 'text-red-600' },
  { id: 'recursos', label: 'Recursos & Guías Staff', icon: BookOpen, color: 'text-amber-600' },
];

export const isUsableDoc = (doc?: { url?: string; dataUrl?: string }): boolean => {
  if (!doc) return false;
  if (doc.url) return true;
  if (doc.dataUrl && !doc.dataUrl.includes('[truncated_due_to_size]')) return true;
  return false;
};

export const DOSSIER_SECTIONS: { anchor: string; label: string; fields: string[] }[] = [
  { anchor: 'sec-1', label: '1. Personal', fields: ['apellidos', 'nombres', 'fecha_nacimiento'] },
  { anchor: 'sec-2', label: '2. Escuela', fields: ['nombre_escuela', 'duracion_estudio', 'horario_estudio'] },
  { anchor: 'sec-3', label: '3. Estado Civil', fields: ['estado_civil'] },
  { anchor: 'sec-4', label: '4. Pasaporte', fields: ['num_pasaporte', 'fecha_expiracion_pasaporte'] },
  { anchor: 'sec-5', label: '5. Domicilio', fields: ['direccion_domicilio', 'celular_contacto', 'email_contacto'] },
  { anchor: 'sec-6', label: '6. Sponsor', fields: ['tiene_patrocinador'] },
  { anchor: 'sec-7', label: '7. Hijos', fields: ['hijos_count'] },
  { anchor: 'sec-8', label: '8. Padres', fields: ['nombre_mama', 'nombre_papa'] },
  { anchor: 'sec-9', label: '9. Trabajo', fields: ['trabajo_empresa'] },
  { anchor: 'sec-10', label: '10-11. Educación', fields: ['secundaria_nombre', 'universidad_nombre'] },
  { anchor: 'sec-12', label: '12. Entrada a EE.UU.', fields: ['usa_hospedaje_direccion'] },
  { anchor: 'sec-13', label: '13. Emergencia', fields: ['c1_nombre', 'contacto1_nombres'] },
];

export const isSectionFilled = (formData: Record<string, string>, fields: string[]): boolean =>
  fields.some(f => Boolean(formData?.[f]));

export const SI_NO_OPTIONS = [{ value: 'No', label: 'No' }, { value: 'Sí', label: 'Sí' }];

export const FIELD_SELECT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  otra_nacionalidad: SI_NO_OPTIONS,
  residente_otro_pais: SI_NO_OPTIONS,
  rechazo_estudiante_previo: SI_NO_OPTIONS,
  perdio_pasaporte: SI_NO_OPTIONS,
  tiene_visa_turista: SI_NO_OPTIONS,
  tiene_patrocinador: SI_NO_OPTIONS,
  trabajo_anterior_si: SI_NO_OPTIONS,
  cambio_celular_5anos: SI_NO_OPTIONS,
  familia_en_usa: SI_NO_OPTIONS,
  servicio_militar: SI_NO_OPTIONS,
  duracion_estudio: [
    { value: '3 meses', label: '3 meses' },
    { value: '6 meses', label: '6 meses' },
    { value: '12 meses', label: '12 meses' },
  ],
  horario_estudio: [
    { value: 'Mañana', label: 'Mañana' },
    { value: 'Tarde', label: 'Tarde' },
    { value: 'Noche', label: 'Noche' },
  ],
  semestre_inicio: [
    { value: 'Enero', label: 'Enero' },
    { value: 'Mayo', label: 'Mayo' },
    { value: 'Septiembre', label: 'Septiembre' },
  ],
  estado_civil: [
    { value: 'Soltero', label: 'Soltero / Soltera' },
    { value: 'Casado', label: 'Casado / Casada' },
    { value: 'Divorciado', label: 'Divorciado / Divorciada' },
    { value: 'Viudo', label: 'Viudo / Viuda' },
    { value: 'Unión Libre', label: 'Unión Libre' },
  ],
  hijos_count: Array.from({ length: 11 }, (_, n) => ({
    value: String(n),
    label: n === 0 ? '0 (Ninguno)' : `${n} Hijo${n > 1 ? 's' : ''}`,
  })),
  nombre_escuela: [
    'Uceda School of Utah (Provo)',
    'LANGUAGE ON (Salt Lake City)',
    'Internexus Provo (Campus 1 - Provo)',
    'Internexus Provo (Campus 2 - Provo)',
    'American One English Schools INC (West Valley)',
    'Lumos Language School (Salt Lake City)',
    'Lumos Language School (Orem)',
    'INX Academy (Salt Lake City)',
    'PACE International Academy (Orem)',
    'U.S. Ling Institute (Murray)',
    'Brigham Young University - Provo',
    'BYU Salt Lake Center (Salt Lake City)',
    'Utah Valley University (Orem)',
    'UVU School of Aviation Science (Provo)',
    'University of Utah (Salt Lake City)',
    'Utah State University (Logan)',
    'Utah State University Eastern (Price)',
    'Utah State University Flight Training (Logan)',
    'Utah State Univ. Eastern Flight Training (Price)',
    'Southern Utah University (Cedar City)',
    'Southern Utah University Aviation (Cedar City)',
    'Weber State University (Ogden)',
    'Weber State University Davis (Layton)',
    'Utah Tech University (St. George)',
    'Snow College',
    'Salt Lake Community College (Taylorsville Redwood Campus)',
    'Salt Lake Community College (South City Campus)',
    'Salt Lake Community College (Jordan Campus)',
    'Salt Lake Community College (Miller Campus)',
    'Salt Lake Community College (Library Square Center)',
    'Salt Lake Community College (Meadowbrook Campus)',
    'Salt Lake Community College (Westpointe Center)',
    'Salt Lake Community College (International Aerospace/Aviation)',
    'Otra Escuela',
  ].map(v => ({ value: v, label: v })),
};
