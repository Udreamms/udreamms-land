'use client';

import React, { useState, useEffect } from "react";
import { 
  Lock, 
  LogOut, 
  FileText, 
  CreditCard, 
  Calendar, 
  XCircle, 
  CheckCircle2, 
  Inbox, 
  User, 
  GraduationCap, 
  Briefcase, 
  Eye, 
  ArrowRight, 
  Search, 
  ChevronRight,
  Menu,
  X,
  Camera,
  MapPin,
  RefreshCw,
  Phone,
  Mail,
  Home,
  Heart,
  Plane,
  Users,
  Building,
  School,
  ExternalLink,
  Copy,
  FileCheck,
  Ticket,
  MessageSquare,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  AlertTriangle,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Type definitions for Staff Portal student cases in logical workflow order
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
  | 'negados';

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
  purchases?: string[];
  formData: Record<string, string>;
  notes?: string;
  unreadCount?: number;
  lastChatMessage?: string;
}

export default function StaffPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<StaffTabType>('nuevos');
  const [studentCases, setStudentCases] = useState<StudentCase[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCaseModal, setSelectedCaseModal] = useState<StudentCase | null>(null);
  const [activeChatStudent, setActiveChatStudent] = useState<StudentCase | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [isEditingDossier, setIsEditingDossier] = useState<boolean>(false);
  const [editedFormData, setEditedFormData] = useState<Record<string, string>>({});
  const [isSavingDossier, setIsSavingDossier] = useState<boolean>(false);

  // Check auth session on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('udreamms_staff_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch real cases from Firebase Firestore via API
  const fetchCases = async () => {
    setIsLoadingCases(true);
    try {
      const res = await fetch('/api/staff/cases');
      if (res.ok) {
        const data = await res.json();
        if (data.cases && Array.isArray(data.cases)) {
          setStudentCases(data.cases);
        }
        setDbConnectionError(data.error || null);
      }
    } catch (error) {
      console.error('Error fetching staff cases:', error);
      toast.error('No se pudieron actualizar los casos desde la nube.');
    } finally {
      setIsLoadingCases(false);
    }
  };

  // Delete a client's expediente permanently from the Staff panel
  const handleDeleteCase = async (caseItem: StudentCase) => {
    const confirmed = typeof window !== 'undefined'
      ? window.confirm(`¿Eliminar el expediente de "${caseItem.name}" (${caseItem.email})? Esta acción no se puede deshacer.`)
      : false;
    if (!confirmed) return;

    setDeletingCaseId(caseItem.id);
    try {
      const res = await fetch(`/api/staff/cases?caseId=${encodeURIComponent(caseItem.id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStudentCases(prev => prev.filter(c => c.id !== caseItem.id));
        if (selectedCaseModal?.id === caseItem.id) setSelectedCaseModal(null);
        toast.success(`Expediente de "${caseItem.name}" eliminado.`);
      } else {
        const errBody = await res.json().catch(() => ({}));
        toast.error(errBody?.error || 'No se pudo eliminar el expediente.');
      }
    } catch (err) {
      console.error('Error deleting case:', err);
      toast.error('No se pudo eliminar el expediente.');
    } finally {
      setDeletingCaseId(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCases();
      // Polling every 3.5 seconds for instant chat notifications and new submissions
      const interval = setInterval(() => {
        fetchCases();
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '@Udreamms2026') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('udreamms_staff_auth', 'true');
      }
      toast.success("¡Bienvenido al Panel de Staff Udreamms!");
    } else {
      toast.error("Contraseña incorrecta. Intenta nuevamente.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput("");
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('udreamms_staff_auth');
    }
    toast.info("Sesión de Staff cerrada.");
  };

  // Move status handler
  const handleMoveStatus = async (caseId: string, newStatus: StaffTabType) => {
    setStudentCases(prev => prev.map(item => {
      if (item.id === caseId) {
        return { ...item, status: newStatus };
      }
      return item;
    }));

    if (selectedCaseModal && selectedCaseModal.id === caseId) {
      setSelectedCaseModal(prev => prev ? { ...prev, status: newStatus } : null);
    }

    try {
      await fetch('/api/staff/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, status: newStatus })
      });
      toast.success(`Expediente movido a "${getStatusLabel(newStatus)}" en la nube.`);
    } catch (err) {
      console.error('Error updating status in cloud:', err);
    }
  };

  // Same fixed option lists the client's own form uses for these fields (FormularioConsular.tsx).
  // Kept in sync manually — if a dropdown's choices change there, mirror the change here so
  // staff can only ever set a value the client's form could also produce.
  const SI_NO_OPTIONS = [{ value: 'No', label: 'No' }, { value: 'Sí', label: 'Sí' }];
  const FIELD_SELECT_OPTIONS: Record<string, { value: string; label: string }[]> = {
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
    hijos_count: Array.from({ length: 11 }, (_, n) => ({ value: String(n), label: n === 0 ? '0 (Ninguno)' : `${n} Hijo${n > 1 ? 's' : ''}` })),
    nombre_escuela: [
      'Uceda School of Utah (Provo)', 'LANGUAGE ON (Salt Lake City)', 'Internexus Provo (Campus 1 - Provo)',
      'Internexus Provo (Campus 2 - Provo)', 'American One English Schools INC (West Valley)',
      'Lumos Language School (Salt Lake City)', 'Lumos Language School (Orem)', 'INX Academy (Salt Lake City)',
      'PACE International Academy (Orem)', 'U.S. Ling Institute (Murray)', 'Brigham Young University - Provo',
      'BYU Salt Lake Center (Salt Lake City)', 'Utah Valley University (Orem)', 'UVU School of Aviation Science (Provo)',
      'University of Utah (Salt Lake City)', 'Utah State University (Logan)', 'Utah State University Eastern (Price)',
      'Utah State University Flight Training (Logan)', 'Utah State Univ. Eastern Flight Training (Price)',
      'Southern Utah University (Cedar City)', 'Southern Utah University Aviation (Cedar City)',
      'Weber State University (Ogden)', 'Weber State University Davis (Layton)', 'Utah Tech University (St. George)',
      'Snow College', 'Salt Lake Community College (Taylorsville Redwood Campus)',
      'Salt Lake Community College (South City Campus)', 'Salt Lake Community College (Jordan Campus)',
      'Salt Lake Community College (Miller Campus)', 'Salt Lake Community College (Library Square Center)',
      'Salt Lake Community College (Meadowbrook Campus)', 'Salt Lake Community College (Westpointe Center)',
      'Salt Lake Community College (International Aerospace/Aviation)', 'Otra Escuela',
    ].map(v => ({ value: v, label: v })),
  };

  // A doc entry only counts as "attached" if it actually has a usable link. Guards against
  // legacy records where a large PDF got truncated to a broken placeholder string before
  // the Storage-based upload pipeline existed.
  const isUsableDoc = (doc?: { url?: string; dataUrl?: string }): boolean => {
    if (!doc) return false;
    if (doc.url) return true;
    if (doc.dataUrl && !doc.dataUrl.includes('[truncated_due_to_size]')) return true;
    return false;
  };

  // Quick-nav + completion badges for the 12-section dossier modal. Each entry's `fields`
  // is a representative sample used only to flag a section "Con datos" vs "Pendiente" —
  // it doesn't need to be exhaustive, just enough to tell staff where to look first.
  const DOSSIER_SECTIONS: { anchor: string; label: string; fields: string[] }[] = [
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

  const isSectionFilled = (formData: Record<string, string>, fields: string[]): boolean =>
    fields.some(f => Boolean(formData?.[f]));

  const scrollToDossierSection = (anchor: string) => {
    if (typeof document === 'undefined') return;
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // A single field in the dossier: renders as static text normally, and swaps to a real
  // input the moment staff clicks "Editar Expediente" — bound to `editedFormData` so nothing
  // is written to Firestore until "Guardar Cambios" is pressed.
  const EditableField = ({
    formKey, label, mono, multiline, className,
  }: { formKey: string; label: string; mono?: boolean; multiline?: boolean; className?: string }) => {
    if (!selectedCaseModal) return null;
    if (!isEditingDossier) {
      const value = selectedCaseModal.formData?.[formKey];
      return (
        <div className={className}>
          <span className="text-slate-500 font-semibold block">{label}:</span>
          <strong className={`text-slate-900 block ${mono ? 'font-mono' : ''}`}>{value || '-'}</strong>
        </div>
      );
    }
    const value = editedFormData[formKey] ?? '';
    const options = FIELD_SELECT_OPTIONS[formKey];
    return (
      <div className={className}>
        <label className="text-slate-500 font-semibold block mb-0.5">{label}:</label>
        {options ? (
          <select
            value={value}
            onChange={(e) => setEditedFormData(prev => ({ ...prev, [formKey]: e.target.value }))}
            className="w-full h-8 px-2 rounded-md border border-blue-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Selecciona...</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            value={value}
            onChange={(e) => setEditedFormData(prev => ({ ...prev, [formKey]: e.target.value }))}
            rows={2}
            className="w-full px-2 py-1.5 rounded-md border border-blue-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setEditedFormData(prev => ({ ...prev, [formKey]: e.target.value }))}
            className={`w-full h-8 px-2 rounded-md border border-blue-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${mono ? 'font-mono' : ''}`}
          />
        )}
      </div>
    );
  };

  // Used to gate conditional sub-fields (e.g. cónyuge fields only when estado_civil is
  // "Casado"). Reads from the in-progress edit while editing, so toggling a dropdown
  // immediately shows/hides its dependent fields instead of waiting for a save.
  const getFieldValue = (key: string): string =>
    (isEditingDossier ? editedFormData[key] : selectedCaseModal?.formData?.[key]) || '';

  const startEditingDossier = () => {
    if (!selectedCaseModal) return;
    setEditedFormData({ ...selectedCaseModal.formData });
    setIsEditingDossier(true);
  };

  const cancelEditingDossier = () => {
    setIsEditingDossier(false);
    setEditedFormData({});
  };

  const saveDossierEdits = async () => {
    if (!selectedCaseModal) return;
    setIsSavingDossier(true);
    try {
      const res = await fetch('/api/staff/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: selectedCaseModal.id,
          formData: editedFormData,
          email: selectedCaseModal.email,
          name: selectedCaseModal.name,
          visaType: selectedCaseModal.visaType,
        }),
      });
      if (res.ok) {
        setStudentCases(prev => prev.map(c => c.id === selectedCaseModal.id ? { ...c, formData: editedFormData } : c));
        setSelectedCaseModal(prev => prev ? { ...prev, formData: editedFormData } : null);
        setIsEditingDossier(false);
        toast.success('Expediente actualizado correctamente.');
      } else {
        const errBody = await res.json().catch(() => ({}));
        toast.error(errBody?.error || 'No se pudo guardar el expediente.');
      }
    } catch (err) {
      console.error('Error saving dossier edits:', err);
      toast.error('No se pudo guardar el expediente. Revisa tu conexión.');
    } finally {
      setIsSavingDossier(false);
    }
  };

  const SectionStatusBadge = ({ filled }: { filled: boolean }) => (
    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide flex items-center gap-1 ${
      filled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
    }`}>
      {filled && <CheckCircle2 className="w-2.5 h-2.5" />}
      {filled ? 'Con Datos' : 'Pendiente'}
    </span>
  );

  const getStatusLabel = (status: StaffTabType) => {
    switch (status) {
      case 'nuevos': return 'Procesos Nuevos';
      case 'aplicacion_escuela': return 'Aplicación a la Escuela';
      case 'i20_entregado': return 'I-20 Entregado';
      case 'ds160': return 'Llenado DS-160';
      case 'sevis': return 'Tasa SEVIS (I-901)';
      case 'comprar_cita': return 'Listo para Comprar Cita en Embajada';
      case 'simulacro_entrevista': return 'Simulacro de Entrevista';
      case 'entrevista': return 'Cita en Embajada';
      case 'aprobados': return 'Aprobados / Completados';
      case 'negados': return 'Negados';
      default: return status;
    }
  };

  // Fetch messages when activeChatStudent changes
  const fetchStaffChat = async () => {
    if (!activeChatStudent?.email) return;
    try {
      const res = await fetch(`/api/portal/chat?email=${encodeURIComponent(activeChatStudent.email)}&viewer=staff`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setChatMessages(data.messages);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (activeChatStudent) {
      fetchStaffChat();
      const interval = setInterval(fetchStaffChat, 3500);
      return () => clearInterval(interval);
    }
  }, [activeChatStudent]);

  const handleSendStaffChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeChatStudent?.email || isSendingChat) return;

    const text = chatInput.trim();
    setChatInput("");
    setIsSendingChat(true);

    const tempMsg = {
      id: `temp_${Date.now()}`,
      sender: 'staff',
      senderName: 'Staff Consular Udreamms',
      text,
      timestamp: new Date().toISOString(),
      read: true
    };
    setChatMessages(prev => [...prev, tempMsg]);

    try {
      await fetch('/api/portal/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientEmail: activeChatStudent.email,
          clientName: activeChatStudent.name,
          sender: 'staff',
          senderName: 'Staff Consular Udreamms',
          text,
        }),
      });
      await fetchStaffChat();
    } catch (err) {
      toast.error("Error al enviar mensaje.");
    } finally {
      setIsSendingChat(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles.`);
  };

  // 1. PASSWORD ACCESS SCREEN (WHITE CLEAN THEME)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans flex items-center justify-center p-4 selection:bg-blue-500/20">
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-black" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
              Acceso Restringido Staff
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Password
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ingresa la contraseña de autorización para gestionar los procesos de alumnos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700 block">Contraseña de Staff</label>
              <Input
                type="password"
                required
                placeholder="Ingresa la contraseña..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="h-11 bg-white border-slate-300 text-xs px-4 text-center text-slate-900 rounded-full focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Ingresar al Portal Staff
            </Button>
          </form>

        </div>
      </div>
    );
  }

  // Filtered cases for active tab and search
  const filteredCases = studentCases.filter(c => {
    const matchesTab = c.status === activeTab;
    const matchesSearch = searchQuery === "" || 
      (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (c.id && c.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.schoolName && c.schoolName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Tab definitions in chronological, logical visa processing order
  const tabsList: { id: StaffTabType; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'nuevos', label: '1. Procesos Nuevos', icon: Inbox, color: 'text-blue-600' },
    { id: 'aplicacion_escuela', label: '2. Aplicación a Escuela', icon: School, color: 'text-sky-600' },
    { id: 'i20_entregado', label: '3. I-20 Entregado', icon: FileCheck, color: 'text-teal-600' },
    { id: 'ds160', label: '4. Llenado DS-160', icon: FileText, color: 'text-amber-600' },
    { id: 'sevis', label: '5. Tasa SEVIS (I-901)', icon: CreditCard, color: 'text-indigo-600' },
    { id: 'comprar_cita', label: '6. Comprar Cita Embajada', icon: Ticket, color: 'text-orange-600' },
    { id: 'simulacro_entrevista', label: '7. Simulacro Entrevista', icon: MessageSquare, color: 'text-violet-600' },
    { id: 'entrevista', label: '8. Cita en Embajada', icon: Calendar, color: 'text-purple-600' },
    { id: 'aprobados', label: '9. Aprobados', icon: CheckCircle2, color: 'text-emerald-600' },
    { id: 'negados', label: '10. Negados', icon: XCircle, color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative selection:bg-blue-500/20">
      
      {/* FLOATING WHITE GLASSMORPHISM SIDEBAR */}
      <aside className={`shrink-0 fixed top-[18px] left-[18px] z-40 flex flex-col justify-between h-[calc(100vh-36px)] bg-white border border-slate-200 rounded-3xl p-3 md:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.06)] text-black overflow-y-auto no-scrollbar transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        <div className="flex flex-col gap-2">
          
          {/* Header with Udreamms Logo & Hamburger Toggle */}
          {isSidebarCollapsed ? (
            <div className="hidden md:flex flex-col items-center gap-3 mb-4 pb-3 border-b border-slate-100 px-1">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm"
                title="Expandir menú"
              >
                <Menu className="w-4 h-4 shrink-0 text-black" />
              </button>
              <div title="Udreamms" className="w-7 h-7 relative cursor-pointer group">
                <img
                  src="/icons/new-icon-udreamms.png"
                  alt="Udreamms"
                  className="object-contain w-full h-full group-hover:scale-110 transition-transform"
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-between mb-4 pb-3 border-b border-slate-100 px-2">
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="w-7 h-7 relative shrink-0">
                  <img
                    src="/icons/new-icon-udreamms.png"
                    alt="Udreamms"
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-lg font-bold tracking-tight text-black">
                  Udreamms
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm shrink-0"
                title="Colapsar menú"
              >
                <Menu className="w-4 h-4 shrink-0 text-black" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
            {tabsList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = studentCases.filter(c => c.status === tab.id).length;
              const unreadInTab = studentCases.filter(c => c.status === tab.id && (c.unreadCount || 0) > 0).reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full py-2.5 md:py-3 rounded-xl md:rounded-2xl transition-all duration-200 flex items-center shrink-0 cursor-pointer ${
                    isSidebarCollapsed 
                      ? 'justify-center px-0' 
                      : 'justify-between px-3 text-left'
                  } ${
                    isActive 
                      ? 'bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-xs' 
                      : 'hover:bg-slate-100 border border-transparent text-slate-700 font-medium'
                  }`}
                  title={tab.label}
                >
                  <div className={`flex items-center min-w-0 ${isSidebarCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                    <div className="relative shrink-0 flex items-center justify-center">
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-black'}`} />
                      {unreadInTab > 0 && isSidebarCollapsed && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-600 border-2 border-white animate-pulse" />
                      )}
                    </div>
                    {!isSidebarCollapsed && (
                      <span className="text-xs truncate">{tab.label}</span>
                    )}
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {unreadInTab > 0 && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse shadow-xs">
                          {unreadInTab}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="pt-3 border-t border-slate-100 shrink-0">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-bold uppercase tracking-wider flex items-center transition-all cursor-pointer ${
              isSidebarCollapsed ? 'justify-center px-0' : 'justify-center gap-2'
            }`}
            title="Cerrar Sesión Staff"
          >
            <LogOut className="w-4 h-4 text-red-600 shrink-0" />
            {!isSidebarCollapsed && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 pt-6 pb-16 px-4 md:pr-6 lg:pr-8 ${
        isSidebarCollapsed ? 'md:ml-24' : 'md:ml-[342px]'
      }`}>
        
        {/* Content Container spanning wider to right edge */}
        <div className="w-full max-w-[1550px] space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="px-3 py-0.5 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-[10px] font-bold uppercase tracking-widest">
                Panel de Administración Staff
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 pt-0.5">
                {getStatusLabel(activeTab)}
              </h2>
              <p className="text-xs text-slate-500">
                Visualiza los datos en tiempo real de los alumnos para llenar el DS-160 y gestionar trámites.
              </p>
            </div>

            {/* Action Bar: Search & Refresh */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Buscar alumno, email, escuela..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs bg-white border-slate-200 rounded-full shadow-sm focus:border-blue-600 w-full"
                />
              </div>

              <Button
                onClick={fetchCases}
                disabled={isLoadingCases}
                variant="outline"
                className="h-9 px-4 rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm shrink-0"
                title="Actualizar casos desde la base de datos"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-black ${isLoadingCases ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          </div>

          {dbConnectionError && (
            <div className="bg-red-50 border border-red-300 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-800">
                <p className="font-bold mb-0.5">Sin conexión a la base de datos</p>
                <p>{dbConnectionError}</p>
              </div>
            </div>
          )}

          {/* Cases List */}
          <div className="space-y-3.5 w-full">
            {filteredCases.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm w-full">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  No hay procesos en la sección de {getStatusLabel(activeTab)}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Los procesos que los alumnos llenen o muevas a este estado aparecerán automáticamente aquí.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {filteredCases.map((student) => {
                  const hasPhoto = Boolean(student.photoUrl);
                  const hasPassport = isUsableDoc(student.passportDoc);
                  const hasBankStatement = isUsableDoc(student.bankStatementDoc);

                  return (
                    <div
                      key={student.id}
                      onClick={() => setSelectedCaseModal(student)}
                      className="w-full bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl p-4 md:p-5 transition-all duration-200 cursor-pointer flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 group relative overflow-hidden"
                    >
                      {/* Left side: Photo + Compact Detailed Info */}
                      <div className="flex items-start md:items-center gap-4 min-w-0 flex-1">
                        
                        {/* 5x5 Photo Thumbnail */}
                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-100 border border-slate-200 group-hover:border-blue-500 overflow-hidden shrink-0 flex items-center justify-center shadow-xs transition-colors">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <User className="w-7 h-7" />
                              <span className="text-[9px] font-bold">Sin foto</span>
                            </div>
                          )}
                        </div>

                        {/* Student Details */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                          
                          {/* Row 1: Full Name + Visa Badge + Case ID */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                              {student.name || 'Postulante sin nombre registrado'}
                            </h4>

                            <span className={`h-6 px-2.5 rounded-full text-[10px] font-semibold uppercase tracking-wide inline-flex items-center gap-1 ${
                              student.visaType === 'F-1'
                                ? 'bg-blue-600 text-white'
                                : 'bg-indigo-600 text-white'
                            }`}>
                              {student.visaType === 'F-1' ? '🎓 F-1 Estudiante' : '✈️ B-2 Turista'}
                            </span>

                            <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 font-mono inline-flex items-center">
                              {student.id}
                            </span>
                          </div>

                          {/* Row 2: Contact Info & School (Email, Phone, School) */}
                          <div className="flex items-center gap-x-4 gap-y-1 text-xs text-slate-600 flex-wrap">
                            {/* Email */}
                            <div className="flex items-center gap-1.5 font-medium text-slate-700">
                              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="truncate">{student.email || 'Sin correo'}</span>
                              {student.email && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(student.email, 'Correo');
                                  }}
                                  className="p-0.5 hover:text-blue-600 rounded transition-colors"
                                  title="Copiar correo"
                                >
                                  <Copy className="w-3 h-3 text-slate-400 hover:text-blue-600" />
                                </button>
                              )}
                            </div>

                            {/* Phone */}
                            {student.phone ? (
                              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{student.phone}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(student.phone, 'Teléfono');
                                  }}
                                  className="p-0.5 hover:text-emerald-600 rounded transition-colors"
                                  title="Copiar teléfono"
                                >
                                  <Copy className="w-3 h-3 text-slate-400 hover:text-emerald-600" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Sin teléfono</span>
                            )}

                            {/* School / State */}
                            <div className="h-6 flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 rounded-full text-xs">
                              <School className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span className="truncate">{student.schoolName || student.schoolState || 'Utah'}</span>
                            </div>
                          </div>

                          {/* Row 3: Document Attachment Status Badges & Form Progress — all the same pill size */}
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            {/* Form completion badge */}
                            {(() => {
                              const filledCount = Object.values(student.formData || {}).filter(Boolean).length;
                              if (filledCount >= 10) {
                                return (
                                  <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border bg-emerald-50 text-emerald-800 border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    {filledCount} Datos Consulares Llenos
                                  </span>
                                );
                              } else if (filledCount > 0) {
                                return (
                                  <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border bg-amber-50 text-amber-800 border-amber-200">
                                    <Sparkles className="w-3 h-3 text-amber-600" />
                                    {filledCount} Datos en Proceso
                                  </span>
                                );
                              } else {
                                return (
                                  <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border bg-slate-100 text-slate-600 border-slate-200">
                                    <User className="w-3 h-3 text-slate-500" />
                                    Cliente Registrado
                                  </span>
                                );
                              }
                            })()}

                            {/* Photo 5x5 badge */}
                            <span className={`h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${
                              hasPhoto
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              <Camera className="w-3 h-3" />
                              {hasPhoto ? 'Foto 5x5 ✓' : 'Sin Foto 5x5'}
                            </span>

                            {/* Passport badge */}
                            <span className={`h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${
                              hasPassport
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              <CreditCard className="w-3 h-3" />
                              {hasPassport ? 'Pasaporte ✓' : 'Sin Pasaporte'}
                            </span>

                            {/* Bank statement badge (mainly for F-1) */}
                            {student.visaType === 'F-1' && (
                              <span className={`h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${
                                hasBankStatement
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}>
                                <Building className="w-3 h-3" />
                                {hasBankStatement ? 'Edo. Cuenta ✓' : 'Sin Edo. Cuenta'}
                              </span>
                            )}
                          </div>

                          {/* Notes if available */}
                          {student.notes && (
                            <p className="text-[11px] text-slate-500 italic truncate max-w-xl">
                              {student.notes}
                            </p>
                          )}

                        </div>
                      </div>

                      {/* Right side: 5-State Selector + Full Dossier Button */}
                      <div
                        className="flex flex-col sm:flex-row xl:flex-col items-stretch sm:items-center xl:items-end gap-2 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* State selector dropdown */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <label className="text-xs font-semibold text-slate-600 shrink-0">
                            Estado:
                          </label>
                          <select
                            value={student.status}
                            onChange={(e) => handleMoveStatus(student.id, e.target.value as StaffTabType)}
                            className="h-9 px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white text-slate-900 text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs w-full sm:w-auto"
                            title="Cambiar estado del trámite"
                          >
                            <option value="nuevos">📥 1. Procesos Nuevos</option>
                            <option value="aplicacion_escuela">🏫 2. Aplicación a la Escuela</option>
                            <option value="i20_entregado">📄 3. I-20 Entregado</option>
                            <option value="ds160">📝 4. Llenado DS-160</option>
                            <option value="sevis">💳 5. Tasa SEVIS (I-901)</option>
                            <option value="comprar_cita">🎟️ 6. Comprar Cita Embajada</option>
                            <option value="simulacro_entrevista">🎙️ 7. Simulacro Entrevista</option>
                            <option value="entrevista">📅 8. Cita en Embajada</option>
                            <option value="aprobados">✅ 9. Aprobados</option>
                            <option value="negados">❌ 10. Negados</option>
                          </select>
                        </div>

                        {/* Buttons row: Chat bubble with live notification dot + View Full Expediente */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            type="button"
                            onClick={() => {
                              setStudentCases(prev => prev.map(item => item.id === student.id ? { ...item, unreadCount: 0 } : item));
                              setActiveChatStudent(student);
                            }}
                            className={`relative h-9 w-9 p-0 rounded-xl border font-semibold transition-all shrink-0 flex items-center justify-center shadow-xs cursor-pointer ${
                              (student.unreadCount || 0) > 0
                                ? 'border-red-300 bg-red-50 hover:bg-red-100 text-red-600 ring-2 ring-red-400/30'
                                : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
                            }`}
                            title={(student.unreadCount || 0) > 0 ? `¡${student.unreadCount} mensaje(s) nuevo(s) de ${student.name || 'este cliente'}!` : `Chatear en vivo con ${student.name || 'el postulante'}`}
                          >
                            <MessageCircle className={`w-4 h-4 ${(student.unreadCount || 0) > 0 ? 'text-red-600' : 'text-blue-600'}`} />

                            {/* Live Unread Notification Dot / Badge */}
                            {(student.unreadCount || 0) > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 text-[8px] font-black text-white items-center justify-center border-2 border-white shadow-xs">
                                  {student.unreadCount! > 9 ? '9+' : student.unreadCount}
                                </span>
                              </span>
                            )}
                          </Button>

                          <Button
                            type="button"
                            onClick={() => setSelectedCaseModal(student)}
                            className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all flex-1 sm:flex-initial cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-white" />
                            <span>Ver Expediente</span>
                          </Button>

                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCase(student);
                            }}
                            disabled={deletingCaseId === student.id}
                            className="h-9 w-9 p-0 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center shadow-xs shrink-0 cursor-pointer"
                            title={`Eliminar expediente de ${student.name || 'este cliente'}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* RICH STUDENT FULL FORM MODAL (ALL 13 SECTIONS) */}
      {selectedCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-[1560px] max-h-[95vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                  {selectedCaseModal.photoUrl ? (
                    <img
                      src={selectedCaseModal.photoUrl}
                      alt={selectedCaseModal.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedCaseModal.name || 'Sin nombre asignado'}
                    </h3>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                      {selectedCaseModal.visaType === 'F-1' ? 'Visa de Estudiante (F-1)' : 'Visa de Turista (B-2)'}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {getStatusLabel(selectedCaseModal.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Mail className="w-3.5 h-3.5 text-black" />
                      {selectedCaseModal.email || 'Sin email'}
                      {selectedCaseModal.email && (
                        <button 
                          onClick={() => handleCopy(selectedCaseModal.email, 'Email')}
                          className="hover:text-blue-600 p-0.5"
                          title="Copiar email"
                        >
                          <Copy className="w-3 h-3 text-black" />
                        </button>
                      )}
                    </span>
                    {selectedCaseModal.phone && (
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-black" />
                        {selectedCaseModal.phone}
                        <button 
                          onClick={() => handleCopy(selectedCaseModal.phone, 'Teléfono')}
                          className="hover:text-blue-600 p-0.5"
                          title="Copiar teléfono"
                        >
                          <Copy className="w-3 h-3 text-black" />
                        </button>
                      </span>
                    )}
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      Expediente: {selectedCaseModal.id}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCaseModal(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                title="Cerrar modal"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Quick Status Toolbar */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-700 mr-1">Cambiar estado a:</span>
                {([
                  'nuevos',
                  'aplicacion_escuela',
                  'i20_entregado',
                  'ds160',
                  'sevis',
                  'comprar_cita',
                  'simulacro_entrevista',
                  'entrevista',
                  'aprobados',
                  'negados'
                ] as StaffTabType[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleMoveStatus(selectedCaseModal.id, st)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      selectedCaseModal.status === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {getStatusLabel(st)}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit Dossier Toolbar */}
            <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200/60 shrink-0 flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-amber-800">
                {isEditingDossier
                  ? 'Editando el expediente — los cambios no se guardan hasta que le des a "Guardar Cambios".'
                  : 'Puedes corregir o completar cualquier dato del expediente en nombre del cliente.'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {isEditingDossier ? (
                  <>
                    <Button
                      type="button"
                      onClick={cancelEditingDossier}
                      disabled={isSavingDossier}
                      variant="outline"
                      className="h-8 px-3 rounded-lg text-xs font-semibold border-slate-300 text-slate-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={saveDossierEdits}
                      disabled={isSavingDossier}
                      className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-white" />
                      {isSavingDossier ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={startEditingDossier}
                    className="h-8 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-white" />
                    Editar Expediente
                  </Button>
                )}
              </div>
            </div>

            {/* Modal Body: All 13 Sections */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-900">

              {/* Compras del Cliente */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 space-y-2.5">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Compras del Cliente
                </h4>
                {selectedCaseModal.purchases && selectedCaseModal.purchases.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCaseModal.purchases.map((p) => (
                      <span key={p} className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Sin compras registradas para este correo.</p>
                )}
              </div>

              {/* Quick-Nav: jump straight to any of the 12 sections instead of scrolling blindly */}
              <div className="sticky top-0 z-10 -mx-6 md:-mx-8 px-6 md:px-8 py-2.5 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
                {DOSSIER_SECTIONS.map(sec => {
                  const filled = isSectionFilled(selectedCaseModal.formData || {}, sec.fields);
                  return (
                    <button
                      key={sec.anchor}
                      type="button"
                      onClick={() => scrollToDossierSection(sec.anchor)}
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors border ${
                        filled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {filled && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                      {sec.label}
                    </button>
                  );
                })}
              </div>

              {/* Expediente Overview Banner */}
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-900">
                      Progreso del Expediente:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-2xs">
                      {Object.values(selectedCaseModal.formData || {}).filter(Boolean).length} datos registrados
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {selectedCaseModal.notes || 'Datos sincronizados en tiempo real con la nube de Firebase.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Registrado: {selectedCaseModal.submittedAt || 'Reciente'}</span>
                </div>
              </div>

              {/* SECCIÓN DOCUMENTOS Y ARCHIVOS ADJUNTOS */}
              {(selectedCaseModal.photoUrl || selectedCaseModal.passportDoc || selectedCaseModal.bankStatementDoc) && (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Documentos Oficiales Adjuntos por el Postulante
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-slate-200">
                      Archivos Expediente
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Foto Oficial */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                            <Camera className="w-3 h-3 text-slate-600" />
                            Foto Oficial 5x5
                          </span>
                          {selectedCaseModal.photoUrl ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Adjunta
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                              Sin Foto
                            </span>
                          )}
                        </div>
                        {selectedCaseModal.photoUrl && (
                          <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                            <img src={selectedCaseModal.photoUrl} alt="Foto" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                      {selectedCaseModal.photoUrl ? (
                        <a
                          href={selectedCaseModal.photoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-slate-600" />
                          Ver Fotografía
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center block italic">No adjuntada</span>
                      )}
                    </div>

                    {/* Pasaporte */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-indigo-600" />
                            Pasaporte
                          </span>
                          {isUsableDoc(selectedCaseModal.passportDoc) ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Adjunto
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                              Sin Archivo
                            </span>
                          )}
                        </div>
                        {isUsableDoc(selectedCaseModal.passportDoc) ? (
                          <div className="p-2 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center">
                            <p className="text-[11px] font-bold text-indigo-950 truncate" title={selectedCaseModal.passportDoc!.name}>
                              {selectedCaseModal.passportDoc!.name}
                            </p>
                            <span className="text-[9px] font-bold text-indigo-700 uppercase">
                              {selectedCaseModal.passportDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                            </span>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-slate-400 text-[11px]">No cargado</div>
                        )}
                      </div>
                      {isUsableDoc(selectedCaseModal.passportDoc) ? (
                        <a
                          href={selectedCaseModal.passportDoc!.url || selectedCaseModal.passportDoc!.dataUrl}
                          download={selectedCaseModal.passportDoc!.name}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <ExternalLink className="w-3 h-3 text-white" />
                          Ver / Descargar
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center block italic">No adjuntado</span>
                      )}
                    </div>

                    {/* Estado de Cuenta */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                            <Building className="w-3 h-3 text-emerald-600" />
                            Estado de Cuenta
                          </span>
                          {isUsableDoc(selectedCaseModal.bankStatementDoc) ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                              Adjunto
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                              Sin Archivo
                            </span>
                          )}
                        </div>
                        {isUsableDoc(selectedCaseModal.bankStatementDoc) ? (
                          <div className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
                            <p className="text-[11px] font-bold text-emerald-950 truncate" title={selectedCaseModal.bankStatementDoc!.name}>
                              {selectedCaseModal.bankStatementDoc!.name}
                            </p>
                            <span className="text-[9px] font-bold text-emerald-700 uppercase">
                              {selectedCaseModal.bankStatementDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                            </span>
                          </div>
                        ) : (
                          <div className="py-4 text-center text-slate-400 text-[11px]">No cargado</div>
                        )}
                      </div>
                      {isUsableDoc(selectedCaseModal.bankStatementDoc) ? (
                        <a
                          href={selectedCaseModal.bankStatementDoc!.url || selectedCaseModal.bankStatementDoc!.dataUrl}
                          download={selectedCaseModal.bankStatementDoc!.name}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <ExternalLink className="w-3 h-3 text-white" />
                          Ver / Descargar
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 text-center block italic">No adjuntado</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 1. INFORMACIÓN PERSONAL */}
              <div id="sec-1" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><User className="w-4 h-4 text-black" />1. Información Personal</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[0].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-xs">
                  {EditableField({ formKey: "apellidos", label: "Apellidos" })}
                  {EditableField({ formKey: "nombres", label: "Nombres" })}
                  {EditableField({ formKey: "fecha_nacimiento", label: "Fecha de Nacimiento" })}
                  {EditableField({ formKey: "lugar_nacimiento", label: "Lugar de Nacimiento" })}
                  {EditableField({ formKey: "ciudad_nacimiento", label: "Ciudad de Nacimiento" })}
                  {EditableField({ formKey: "estado_nacimiento", label: "Estado / Provincia Nacimiento" })}
                  {EditableField({ formKey: "pais_nacimiento", label: "País de Nacimiento" })}
                  {EditableField({ formKey: "otra_nacionalidad", label: "¿Otra nacionalidad?" })}
                  {EditableField({ formKey: "cuales_nacionalidades", label: "¿Cuáles nacionalidades?" })}
                  {EditableField({ formKey: "residente_otro_pais", label: "¿Residente permanente otro país?" })}
                  {EditableField({ formKey: "que_pais_residencia", label: "¿Qué país de residencia?" })}
                  {EditableField({ formKey: "num_identificacion_nacional", label: "N° Documento Nacional (DNI / CURP)" })}
                  {EditableField({ formKey: "rechazo_visa_detalle", label: "¿Rechazo de visa previo?", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5" })}
                </div>
              </div>

              {/* 2. INFORMACIÓN ADICIONAL (ESTUDIANTES F-1) */}
              <div id="sec-2" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><School className="w-4 h-4 text-black" />2. Información Adicional (Sólo para Estudiantes)</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[1].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                  {EditableField({ formKey: "motivo_estudio_ingles", label: "¿Por qué quieres estudiar inglés?", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-4" })}
                  {EditableField({ formKey: "duracion_estudio", label: "Duración de Estudio" })}
                  {EditableField({ formKey: "horario_estudio", label: "Horario de Estudio" })}
                  {EditableField({ formKey: "semestre_inicio", label: "Semestre de Inicio" })}
                  <div>
                    <span className="text-slate-500 font-semibold block">Estado de Estudio USA:</span>
                    <strong className="text-slate-900">Utah</strong>
                  </div>
                  {EditableField({ formKey: "nombre_escuela", label: "Nombre de la Escuela Seleccionada", className: "sm:col-span-2 lg:col-span-4" })}
                </div>
              </div>

              {/* 3. ESTADO CIVIL */}
              <div id="sec-3" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-black" />3. Estado Civil</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[2].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
                  {EditableField({ formKey: "estado_civil", label: "Estado Civil" })}
                  {getFieldValue('estado_civil') === 'Casado' && (
                    <>
                      {EditableField({ formKey: "nombre_conyuge", label: "Nombre del Cónyuge" })}
                      {EditableField({ formKey: "fecha_matrimonio", label: "Fecha de Matrimonio" })}
                      {EditableField({ formKey: "fecha_nacimiento_conyuge", label: "Nacimiento Cónyuge" })}
                      {EditableField({ formKey: "ciudad_conyuge", label: "Ciudad Cónyuge" })}
                      {EditableField({ formKey: "pais_conyuge", label: "País Cónyuge" })}
                    </>
                  )}
                </div>
              </div>

              {/* 4. PASAPORTE */}
              <div id="sec-4" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-black" />4. Pasaporte</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[3].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                  {EditableField({ formKey: "num_pasaporte", label: "Número de Pasaporte", mono: true })}
                  {EditableField({ formKey: "ciudad_pasaporte", label: "Ciudad de Emisión" })}
                  {EditableField({ formKey: "estado_pasaporte", label: "Estado de Emisión" })}
                  {EditableField({ formKey: "fecha_emision_pasaporte", label: "Fecha de Emisión" })}
                  {EditableField({ formKey: "fecha_expiracion_pasaporte", label: "Fecha de Expiración" })}
                  {EditableField({ formKey: "perdio_pasaporte", label: "¿Ha extraviado pasaporte antes?" })}
                </div>
              </div>

              {/* 5. DIRECCIÓN DE DOMICILIO ACTUAL */}
              <div id="sec-5" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Home className="w-4 h-4 text-black" />5. Dirección de Domicilio Actual</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[4].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 text-xs">
                  {EditableField({ formKey: "direccion_domicilio", label: "Dirección", className: "sm:col-span-2" })}
                  {EditableField({ formKey: "ciudad_domicilio", label: "Ciudad" })}
                  {EditableField({ formKey: "estado_domicilio", label: "Estado / Provincia" })}
                  {EditableField({ formKey: "pais_domicilio", label: "País" })}
                  {EditableField({ formKey: "cp_domicilio", label: "Código Postal" })}
                  {EditableField({ formKey: "celular_contacto", label: "Celular" })}
                  {EditableField({ formKey: "email_contacto", label: "Email" })}
                </div>
              </div>

              {/* 6. PATROCINADOR / SPONSOR */}
              <div id="sec-6" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Users className="w-4 h-4 text-black" />6. Patrocinador / Sponsor</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[5].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                  {EditableField({ formKey: "tiene_patrocinador", label: "¿Tiene Patrocinador?" })}
                  {getFieldValue('tiene_patrocinador') === 'Sí' && (
                    <>
                      {EditableField({ formKey: "sponsor_nombres", label: "Nombres" })}
                      {EditableField({ formKey: "sponsor_apellidos", label: "Apellidos" })}
                      {EditableField({ formKey: "sponsor_parentesco", label: "Parentesco" })}
                      {EditableField({ formKey: "sponsor_celular", label: "Teléfono" })}
                      {EditableField({ formKey: "sponsor_email", label: "Email" })}
                      {EditableField({ formKey: "sponsor_direccion", label: "Dirección Sponsor" })}
                    </>
                  )}
                </div>
              </div>

              {/* 7. HIJOS */}
              <div id="sec-7" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Users className="w-4 h-4 text-black" />7. Hijos ({selectedCaseModal.formData.hijos_count || '0'} Hijos Registrados)</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[6].fields) })}
                </h4>
                <div className="space-y-3">
                  {Array.from({ length: parseInt(selectedCaseModal.formData.hijos_count || '0', 10) || 0 }).map((_, i) => {
                    const hNum = i + 1;
                    return (
                      <div key={hNum} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        {EditableField({ formKey: `hijo${hNum}_nombres`, label: `Hijo N° ${hNum} - Nombres` })}
                        {EditableField({ formKey: `hijo${hNum}_apellidos`, label: "Apellidos" })}
                        {EditableField({ formKey: `hijo${hNum}_fecha_nac`, label: "Fecha de Nacimiento" })}
                        {EditableField({ formKey: `hijo${hNum}_pasaporte`, label: "Pasaporte", mono: true })}
                      </div>
                    );
                  })}
                  {(!selectedCaseModal.formData.hijos_count || selectedCaseModal.formData.hijos_count === '0') && (
                    <p className="text-xs text-slate-500">El postulante indicó que no viajará con hijos.</p>
                  )}
                </div>
              </div>

              {/* 8. PADRES */}
              <div id="sec-8" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Users className="w-4 h-4 text-black" />8. Nombre de los Padres</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[7].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {EditableField({ formKey: "nombre_mama", label: "Nombre Completo Mamá" })}
                  {EditableField({ formKey: "fecha_nac_mama", label: "Fecha Nac. Mamá" })}
                  {EditableField({ formKey: "nombre_papa", label: "Nombre Completo Papá" })}
                  {EditableField({ formKey: "fecha_nac_papa", label: "Fecha Nac. Papá" })}
                </div>
              </div>

              {/* 9. INFORMACIÓN DE TRABAJO */}
              <div id="sec-9" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-black" />9. Información de Trabajo</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[8].fields) })}
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Empleo Actual</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                      {EditableField({ formKey: "trabajo_empresa", label: "Empresa" })}
                      {EditableField({ formKey: "trabajo_direccion", label: "Dirección" })}
                      {EditableField({ formKey: "trabajo_ciudad", label: "Ciudad" })}
                      {EditableField({ formKey: "trabajo_pais", label: "País" })}
                      {EditableField({ formKey: "trabajo_telefono", label: "Teléfono Empresa" })}
                      {EditableField({ formKey: "trabajo_fecha_inicio", label: "Fecha de Inicio" })}
                      {EditableField({ formKey: "trabajo_salario", label: "Salario Mensual" })}
                      {EditableField({ formKey: "trabajo_descripcion", label: "Descripción de Labores", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
                    </div>
                  </div>

                  {getFieldValue('trabajo_anterior_si') === 'Sí' && (
                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Empleo Anterior</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                        {EditableField({ formKey: "trabajo_ant_empresa", label: "Empresa Anterior" })}
                        {EditableField({ formKey: "trabajo_ant_cargo", label: "Cargo Desempeñado" })}
                        {EditableField({ formKey: "trabajo_ant_supervisor", label: "Supervisor" })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 10 & 11. EDUCACIÓN */}
              <div id="sec-10" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-black" />10 & 11. Historial Educativo</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[9].fields) })}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 text-xs uppercase block border-b border-slate-200 pb-1">Educación Secundaria</strong>
                    {EditableField({ formKey: "secundaria_nombre", label: "Institución" })}
                    {EditableField({ formKey: "secundaria_programa", label: "Programa / Título" })}
                    {EditableField({ formKey: "secundaria_fecha_inicio", label: "Fecha Inicio" })}
                    {EditableField({ formKey: "secundaria_fecha_fin", label: "Fecha Fin" })}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 text-xs uppercase block border-b border-slate-200 pb-1">Universidad / Instituto</strong>
                    {EditableField({ formKey: "universidad_nombre", label: "Institución" })}
                    {EditableField({ formKey: "universidad_programa", label: "Carrera / Programa" })}
                    {EditableField({ formKey: "universidad_fecha_inicio", label: "Fecha Inicio" })}
                    {EditableField({ formKey: "universidad_fecha_fin", label: "Fecha Fin" })}
                  </div>
                </div>
              </div>

              {/* 12. ENTRADA A ESTADOS UNIDOS Y ANTECEDENTES */}
              <div id="sec-12" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Plane className="w-4 h-4 text-black" />12. Información requerida antes de entrar a EE.UU.</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[10].fields) })}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
                  {EditableField({ formKey: "usa_hospedaje_direccion", label: "Dirección de Hospedaje en EE.UU.", className: "sm:col-span-2 lg:col-span-3" })}
                  {EditableField({ formKey: "usa_fecha_llegada", label: "Fecha de Llegada" })}
                  {EditableField({ formKey: "usa_fecha_salida", label: "Fecha de Salida" })}
                  {EditableField({ formKey: "usa_viajes_anteriores", label: "Viajes Anteriores a EE.UU.", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
                  {EditableField({ formKey: "usa_visas_anteriores_detalle", label: "Visas Americanas Anteriores", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-6" })}
                  {EditableField({ formKey: "idiomas_habla", label: "Idiomas que habla" })}
                  {EditableField({ formKey: "servicio_militar", label: "¿Servicio militar?" })}
                  {EditableField({ formKey: "viajes_otros_paises_5anos", label: "Viajes a otros países en los últimos 5 años", multiline: true, className: "sm:col-span-2 md:col-span-3 lg:col-span-4" })}
                </div>
              </div>

              {/* 13. CONTACTOS DE EMERGENCIA (NO FAMILIARES) */}
              <div id="sec-13" className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm scroll-mt-16">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-black" />13. Contactos de Emergencia (NO Familiares)</span>
                  {SectionStatusBadge({ filled: isSectionFilled(selectedCaseModal.formData, DOSSIER_SECTIONS[11].fields) })}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Contacto 1 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 font-bold block border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
                      Contacto de Emergencia N° 1
                    </strong>
                    {EditableField({ formKey: "c1_nombre", label: "Nombre" })}
                    {EditableField({ formKey: "c1_telefono", label: "Teléfono" })}
                    {EditableField({ formKey: "c1_email", label: "Email" })}
                    {EditableField({ formKey: "c1_direccion", label: "Dirección" })}
                    {EditableField({ formKey: "c1_ciudad", label: "Ciudad" })}
                    {EditableField({ formKey: "c1_estado", label: "Estado" })}
                    {EditableField({ formKey: "c1_pais", label: "País" })}
                    {EditableField({ formKey: "c1_cp", label: "Código Postal" })}
                  </div>

                  {/* Contacto 2 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 font-bold block border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
                      Contacto de Emergencia N° 2
                    </strong>
                    {EditableField({ formKey: "c2_nombre", label: "Nombre" })}
                    {EditableField({ formKey: "c2_telefono", label: "Teléfono" })}
                    {EditableField({ formKey: "c2_email", label: "Email" })}
                    {EditableField({ formKey: "c2_direccion", label: "Dirección" })}
                    {EditableField({ formKey: "c2_ciudad", label: "Ciudad" })}
                    {EditableField({ formKey: "c2_estado", label: "Estado" })}
                    {EditableField({ formKey: "c2_pais", label: "País" })}
                    {EditableField({ formKey: "c2_cp", label: "Código Postal" })}
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    const student = selectedCaseModal;
                    setSelectedCaseModal(null);
                    setActiveChatStudent(student);
                  }}
                  className="h-10 px-4 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span>Chatear en Vivo con {selectedCaseModal.name || 'el Postulante'}</span>
                </Button>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Última actualización sincronizada con Firebase.
                </span>
              </div>
              <Button
                onClick={() => setSelectedCaseModal(null)}
                className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Cerrar Formulario
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* STAFF LIVE CHAT DRAWER / WINDOW */}
      {activeChatStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-end sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md h-[85vh] sm:h-[620px] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
            
            {/* Chat Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0 shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-xs">
                  {activeChatStudent.photoUrl ? (
                    <img src={activeChatStudent.photoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    (activeChatStudent.name || 'P')[0]?.toUpperCase()
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white truncate">
                      {activeChatStudent.name || 'Postulante'}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-500/30 text-blue-300 text-[9px] font-bold uppercase">
                      {activeChatStudent.visaType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">
                    {activeChatStudent.email || 'Chat directo en tiempo real'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={fetchStaffChat}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Refrescar mensajes"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChatStudent(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Cerrar chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stage Info Bar */}
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-950 font-medium">
              <span className="text-[11px] font-bold text-blue-700">Etapa actual:</span>
              <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                {getStatusLabel(activeChatStudent.status)}
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Comunícate directamente con el cliente
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-[240px]">
                    Envía un mensaje para responder preguntas sobre su formulario DS-160, documentos o cita.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, index) => {
                  const isStaff = msg.sender === 'staff';
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-500">
                          {isStaff ? 'Tú (Staff Udreamms)' : (msg.senderName || activeChatStudent.name || 'Cliente')}
                        </span>
                        {msg.timestamp && (
                          <span className="text-[9px] text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs whitespace-pre-wrap break-words ${
                          isStaff
                            ? 'bg-blue-600 text-white rounded-tr-xs shadow-blue-500/10'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendStaffChat} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <Input
                placeholder="Escribe un mensaje al cliente..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="h-10 text-xs bg-slate-50 border-slate-200 rounded-full focus:border-blue-600 focus:bg-white"
                disabled={isSendingChat}
              />
              <Button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="h-10 w-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 shrink-0 flex items-center justify-center cursor-pointer transition-all"
                title="Enviar mensaje"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
