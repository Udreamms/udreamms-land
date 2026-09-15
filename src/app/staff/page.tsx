'use client';

import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertTriangle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

import {
  StaffTabType,
  StudentCase,
  getStatusLabel,
} from './types';
import { StaffLogin } from './components/StaffLogin';
import { StaffSidebar } from './components/StaffSidebar';
import { StaffCaseCard } from './components/StaffCaseCard';
import { StaffDossierModal } from './components/StaffDossierModal';
import { StaffChatDrawer } from './components/StaffChatDrawer';
import { StaffResources } from './components/StaffResources';

export default function StaffPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<StaffTabType>('nuevos');
  const [studentCases, setStudentCases] = useState<StudentCase[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCaseModal, setSelectedCaseModal] = useState<StudentCase | null>(null);
  const [activeChatStudent, setActiveChatStudent] = useState<StudentCase | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [dbConnectionError, setDbConnectionError] = useState<string | null>(null);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [caseModalGroup, setCaseModalGroup] = useState<StudentCase[]>([]);
  const [isCreatingApplicant, setIsCreatingApplicant] = useState<boolean>(false);
  const [togglingFlags, setTogglingFlags] = useState<Set<string>>(new Set());
  const [isEditingDossier, setIsEditingDossier] = useState<boolean>(false);
  const [editedFormData, setEditedFormData] = useState<Record<string, string>>({});
  const [dossierSaveStatus, setDossierSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Check auth session on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('udreamms_staff_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch cases from Firebase Firestore via API
  const fetchCases = async (): Promise<StudentCase[]> => {
    setIsLoadingCases(true);
    try {
      const res = await fetch('/api/staff/cases');
      if (res.ok) {
        const data = await res.json();
        if (data.cases && Array.isArray(data.cases)) {
          setStudentCases(data.cases);
        }
        setDbConnectionError(data.error || null);
        return data.cases && Array.isArray(data.cases) ? data.cases : [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching staff cases:', error);
      toast.error('No se pudieron actualizar los casos desde la nube.');
      return [];
    } finally {
      setIsLoadingCases(false);
    }
  };

  const openCaseModal = (student: StudentCase, allCases: StudentCase[]) => {
    const group = allCases.filter((c) => (c.groupKey || c.id) === (student.groupKey || student.id));
    setCaseModalGroup(group.length > 0 ? group : [student]);
    setSelectedCaseModal(student);
  };

  const closeCaseModal = () => {
    setSelectedCaseModal(null);
    setCaseModalGroup([]);
    setIsEditingDossier(false);
    setEditedFormData({});
  };

  const handleCreateApplicant = async (email: string, visaType: 'F-1' | 'B-2', name?: string) => {
    setIsCreatingApplicant(true);
    try {
      const res = await fetch('/api/staff/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, visaType, name }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success('Nueva tarjeta creada.');
        const freshCases = await fetchCases();
        if (selectedCaseModal) {
          const groupKey = selectedCaseModal.groupKey || selectedCaseModal.id;
          const freshGroup = freshCases.filter((c) => (c.groupKey || c.id) === groupKey);
          if (freshGroup.length > 0) setCaseModalGroup(freshGroup);
        }
      } else {
        toast.error(data?.error || 'No se pudo crear la tarjeta.');
      }
    } catch (err) {
      console.error('Error creating applicant card:', err);
      toast.error('No se pudo crear la tarjeta. Revisa tu conexión.');
    } finally {
      setIsCreatingApplicant(false);
    }
  };

  const handleToggleEntitlement = async (email: string, flag: string, value: boolean) => {
    if (!selectedCaseModal) return;
    if (togglingFlags.has(flag)) return;
    setTogglingFlags((prev) => new Set(prev).add(flag));

    setSelectedCaseModal((prev) => (prev ? { ...prev, entitlements: { ...prev.entitlements, [flag]: value } } : prev));
    try {
      const res = await fetch('/api/staff/entitlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, flag, value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSelectedCaseModal((prev) => (prev ? { ...prev, entitlements: { ...prev.entitlements, [flag]: !value } } : prev));
        toast.error(data?.error || 'No se pudo actualizar el producto.');
      } else {
        toast.success(value ? 'Producto activado.' : 'Producto desactivado.');
        void fetchCases();
      }
    } catch (err) {
      console.error('Error toggling entitlement:', err);
      setSelectedCaseModal((prev) => (prev ? { ...prev, entitlements: { ...prev.entitlements, [flag]: !value } } : prev));
      toast.error('No se pudo actualizar el producto. Revisa tu conexión.');
    } finally {
      setTogglingFlags((prev) => {
        const next = new Set(prev);
        next.delete(flag);
        return next;
      });
    }
  };

  const handleDeleteCase = async (caseItem: StudentCase) => {
    const confirmed =
      typeof window !== 'undefined'
        ? window.confirm(
            `¿Eliminar el expediente de "${caseItem.name}" (${caseItem.email})? Esta acción no se puede deshacer.`
          )
        : false;
    if (!confirmed) return;

    setDeletingCaseId(caseItem.id);
    try {
      const res = await fetch(`/api/staff/cases?caseId=${encodeURIComponent(caseItem.id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setStudentCases((prev) => prev.filter((c) => c.id !== caseItem.id));
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
      const interval = setInterval(() => {
        fetchCases();
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '@Udreamms2026') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('udreamms_staff_auth', 'true');
      }
      toast.success('¡Bienvenido al Panel de Staff Udreamms!');
    } else {
      toast.error('Contraseña incorrecta. Intenta nuevamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('udreamms_staff_auth');
    }
    toast.info('Sesión de Staff cerrada.');
  };

  const handleMoveStatus = async (caseId: string, newStatus: StaffTabType) => {
    setStudentCases((prev) =>
      prev.map((item) => {
        if (item.id === caseId) {
          return { ...item, status: newStatus };
        }
        return item;
      })
    );

    if (selectedCaseModal && selectedCaseModal.id === caseId) {
      setSelectedCaseModal((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch('/api/staff/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, status: newStatus }),
      });
      toast.success(`Expediente movido a "${getStatusLabel(newStatus)}" en la nube.`);
    } catch (err) {
      console.error('Error updating status in cloud:', err);
    }
  };

  const startEditingDossier = () => {
    if (!selectedCaseModal) return;
    setEditedFormData({ ...selectedCaseModal.formData });
    setIsEditingDossier(true);
  };

  const stopEditingDossier = () => {
    setIsEditingDossier(false);
    setEditedFormData({});
  };

  // Auto-save dossier edits
  useEffect(() => {
    if (!isEditingDossier || !selectedCaseModal) return;
    setDossierSaveStatus('saving');
    const timer = setTimeout(async () => {
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
          setStudentCases((prev) =>
            prev.map((c) => (c.id === selectedCaseModal.id ? { ...c, formData: editedFormData } : c))
          );
          setSelectedCaseModal((prev) =>
            prev && prev.id === selectedCaseModal.id ? { ...prev, formData: editedFormData } : prev
          );
          setDossierSaveStatus('saved');
        } else {
          setDossierSaveStatus('error');
          toast.error('No se pudo guardar el último cambio. Revisa tu conexión.');
        }
      } catch (err) {
        console.error('Error auto-saving dossier edits:', err);
        setDossierSaveStatus('error');
        toast.error('No se pudo guardar el último cambio. Revisa tu conexión.');
      }
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedFormData, isEditingDossier]);

  // Fetch chat messages
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
    setChatInput('');
    setIsSendingChat(true);

    const tempMsg = {
      id: `temp_${Date.now()}`,
      sender: 'staff',
      senderName: 'Staff Consular Udreamms',
      text,
      timestamp: new Date().toISOString(),
      read: true,
    };
    setChatMessages((prev) => [...prev, tempMsg]);

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
      toast.error('Error al enviar mensaje.');
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles.`);
  };

  // 1. PASSWORD ACCESS SCREEN
  if (!isAuthenticated) {
    return (
      <StaffLogin
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        onLogin={handleLogin}
      />
    );
  }

  // Multi-card group mapping
  const casesByGroup = new Map<string, StudentCase[]>();
  studentCases.forEach((c) => {
    const key = c.groupKey || c.id;
    if (!casesByGroup.has(key)) casesByGroup.set(key, []);
    casesByGroup.get(key)!.push(c);
  });

  const matchesSearchQuery = (c: StudentCase) =>
    searchQuery === '' ||
    (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.id && c.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.schoolName && c.schoolName.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredCases: StudentCase[] = [];
  casesByGroup.forEach((group) => {
    const inStage = group.filter((c) => c.status === activeTab && matchesSearchQuery(c));
    if (inStage.length === 0) return;
    inStage.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
    filteredCases.push(inStage[0]);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative selection:bg-blue-500/20">
      {/* FLOATING WHITE GLASSMORPHISM SIDEBAR */}
      <StaffSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentCases={studentCases}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main
        className={`flex-1 transition-all duration-300 pt-6 pb-16 px-4 md:pr-6 lg:pr-8 ${
          isSidebarCollapsed ? 'md:ml-24' : 'md:ml-[342px]'
        }`}
      >
        <div className="w-full max-w-[1550px] space-y-5">
          {activeTab === 'recursos' ? (
            <StaffResources />
          ) : (
            <>
              {/* Header Row: Title & Actions */}
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
                    className="h-9 px-4 rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
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
                      const groupSize = casesByGroup.get(student.groupKey || student.id)?.length || 1;
                      return (
                        <StaffCaseCard
                          key={student.id}
                          student={student}
                          groupSize={groupSize}
                          onSelectCase={(s) => openCaseModal(s, studentCases)}
                          onMoveStatus={handleMoveStatus}
                          onStartChat={(s) => {
                            setStudentCases((prev) =>
                              prev.map((item) => (item.id === s.id ? { ...item, unreadCount: 0 } : item))
                            );
                            setActiveChatStudent(s);
                          }}
                          onCopy={handleCopy}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* RICH STUDENT FULL FORM MODAL */}
      <StaffDossierModal
        selectedCaseModal={selectedCaseModal}
        caseModalGroup={caseModalGroup}
        setSelectedCaseModal={setSelectedCaseModal}
        onClose={closeCaseModal}
        onMoveStatus={handleMoveStatus}
        onCreateApplicant={handleCreateApplicant}
        onToggleEntitlement={handleToggleEntitlement}
        onDeleteCase={handleDeleteCase}
        onStartChat={(s) => setActiveChatStudent(s)}
        onCopy={handleCopy}
        onCaseUpdated={fetchCases}
        isCreatingApplicant={isCreatingApplicant}
        togglingFlags={togglingFlags}
        deletingCaseId={deletingCaseId}
        isEditingDossier={isEditingDossier}
        editedFormData={editedFormData}
        setEditedFormData={setEditedFormData}
        dossierSaveStatus={dossierSaveStatus}
        startEditingDossier={startEditingDossier}
        stopEditingDossier={stopEditingDossier}
      />

      {/* STAFF LIVE CHAT DRAWER */}
      <StaffChatDrawer
        activeChatStudent={activeChatStudent}
        onClose={() => setActiveChatStudent(null)}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isSendingChat={isSendingChat}
        onSendChat={handleSendStaffChat}
        onRefreshChat={fetchStaffChat}
      />
    </div>
  );
}
