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
import { StaffReferrals } from './components/StaffReferrals';

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
    const studentEmail = (student.email || student.formData?.email_contacto || '').trim().toLowerCase();
    const group = allCases.filter((c) => {
      const cEmail = (c.email || c.formData?.email_contacto || '').trim().toLowerCase();
      if (studentEmail && cEmail && studentEmail === cEmail) {
        return true;
      }
      return Boolean(c.groupKey && student.groupKey && c.groupKey === student.groupKey);
    });
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
        toast.success(`¡Nueva tarjeta ${visaType === 'F-1' ? 'Estudiante F-1' : 'Turista B-2'} creada y activa en el portal!`);
        const freshCases = await fetchCases();
        const clientEmail = (email || '').trim().toLowerCase();
        const freshGroup = freshCases.filter((c) => {
          const cEmail = (c.email || c.formData?.email_contacto || '').trim().toLowerCase();
          return Boolean(clientEmail && cEmail && clientEmail === cEmail);
        });
        if (freshGroup.length > 0) {
          setCaseModalGroup(freshGroup);
          const targetId = data?.caseId || data?.createdCase?.id;
          if (targetId) {
            const created = freshGroup.find((c) => c.id === targetId);
            if (created) setSelectedCaseModal(created);
            else setSelectedCaseModal(freshGroup[freshGroup.length - 1]);
          } else {
            setSelectedCaseModal(freshGroup[freshGroup.length - 1]);
          }
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

    const emailNorm = email.toLowerCase().trim();

    // Optimistic UI updates
    setSelectedCaseModal((prev) => (prev ? { ...prev, entitlements: { ...(prev.entitlements || {}), [flag]: value } } : prev));
    setStudentCases((prev) =>
      prev.map((c) =>
        c.email.toLowerCase().trim() === emailNorm
          ? { ...c, entitlements: { ...(c.entitlements || {}), [flag]: value } }
          : c
      )
    );
    setCaseModalGroup((prev) =>
      prev.map((c) =>
        c.email.toLowerCase().trim() === emailNorm
          ? { ...c, entitlements: { ...(c.entitlements || {}), [flag]: value } }
          : c
      )
    );

    try {
      const res = await fetch('/api/staff/entitlements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailNorm, flag, value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Rollback
        setSelectedCaseModal((prev) => (prev ? { ...prev, entitlements: { ...(prev.entitlements || {}), [flag]: !value } } : prev));
        setStudentCases((prev) =>
          prev.map((c) =>
            c.email.toLowerCase().trim() === emailNorm
              ? { ...c, entitlements: { ...(c.entitlements || {}), [flag]: !value } }
              : c
          )
        );
        setCaseModalGroup((prev) =>
          prev.map((c) =>
            c.email.toLowerCase().trim() === emailNorm
              ? { ...c, entitlements: { ...(c.entitlements || {}), [flag]: !value } }
              : c
          )
        );
        toast.error(data?.error || 'No se pudo actualizar el producto.');
      } else {
        toast.success(value ? 'Producto desbloqueado para el cliente.' : 'Producto bloqueado para el cliente.');
        void fetchCases();
      }
    } catch (err) {
      console.error('Error toggling entitlement:', err);
      // Rollback
      setSelectedCaseModal((prev) => (prev ? { ...prev, entitlements: { ...(prev.entitlements || {}), [flag]: !value } } : prev));
      setStudentCases((prev) =>
        prev.map((c) =>
          c.email.toLowerCase().trim() === emailNorm
            ? { ...c, entitlements: { ...(c.entitlements || {}), [flag]: !value } }
            : c
        )
      );
      setCaseModalGroup((prev) =>
        prev.map((c) =>
          c.email.toLowerCase().trim() === emailNorm
            ? { ...c, entitlements: { ...(c.entitlements || {}), [flag]: !value } }
            : c
        )
      );
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
    const visaLabel = caseItem.visaType === 'F-1' ? 'Visa Estudiante (F-1)' : 'Visa Turista (B-2)';
    const cardTitle = caseItem.formData?.nombres || caseItem.name || 'Postulante';
    const confirmed =
      typeof window !== 'undefined'
        ? window.confirm(
            `¿Estás seguro de eliminar la tarjeta "${cardTitle}" (${visaLabel}) de este expediente?\n\nEsta tarjeta se eliminará también del portal personal del cliente (/portal/proceso).`
          )
        : false;
    if (!confirmed) return;

    setDeletingCaseId(caseItem.id);
    try {
      const res = await fetch(`/api/staff/cases?caseId=${encodeURIComponent(caseItem.id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success(`Tarjeta de ${visaLabel} eliminada correctamente.`);
        const freshCases = await fetchCases();
        const clientEmail = (caseItem.email || caseItem.formData?.email_contacto || '').trim().toLowerCase();
        const freshGroup = freshCases.filter((c) => {
          const cEmail = (c.email || c.formData?.email_contacto || '').trim().toLowerCase();
          return Boolean(clientEmail && cEmail && clientEmail === cEmail);
        });
        setCaseModalGroup(freshGroup);
        if (freshGroup.length > 0) {
          setSelectedCaseModal(freshGroup[0]);
        } else {
          closeCaseModal();
        }
      } else {
        const errBody = await res.json().catch(() => ({}));
        toast.error(errBody?.error || 'No se pudo eliminar la tarjeta.');
      }
    } catch (err) {
      console.error('Error deleting case:', err);
      toast.error('No se pudo eliminar la tarjeta.');
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
    const targetCase = studentCases.find((c) => c.id === caseId) || selectedCaseModal;
    const clientEmail = (targetCase?.email || targetCase?.formData?.email_contacto || '').trim().toLowerCase();
    const groupKey = targetCase?.groupKey;

    // Move all cards belonging to this client's expediente
    setStudentCases((prev) =>
      prev.map((item) => {
        const itemEmail = (item.email || item.formData?.email_contacto || '').trim().toLowerCase();
        const belongsToClient =
          (clientEmail && itemEmail === clientEmail) ||
          (groupKey && item.groupKey === groupKey) ||
          item.id === caseId;

        if (belongsToClient) {
          return { ...item, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return item;
      })
    );

    setCaseModalGroup((prev) =>
      prev.map((item) => ({ ...item, status: newStatus, updatedAt: new Date().toISOString() }))
    );

    if (selectedCaseModal) {
      setSelectedCaseModal((prev) => (prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null));
    }

    try {
      await fetch('/api/staff/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          email: clientEmail,
          status: newStatus,
        }),
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
          const updatedName = [editedFormData.nombres, editedFormData.apellidos].filter(Boolean).join(' ');
          setStudentCases((prev) =>
            prev.map((c) => (c.id === selectedCaseModal.id ? {
              ...c,
              formData: editedFormData,
              name: updatedName || c.name,
            } : c))
          );
          setSelectedCaseModal((prev) =>
            prev && prev.id === selectedCaseModal.id ? {
              ...prev,
              formData: editedFormData,
              name: updatedName || prev.name,
            } : prev
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

  // Minimized chat heads list
  const [minimizedClients, setMinimizedClients] = useState<StudentCase[]>([]);

  // Fetch chat messages automatically with fast polling
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
      const interval = setInterval(fetchStaffChat, 2500);
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
      senderName: 'Sarah Davis',
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
          senderName: 'Sarah Davis',
          text,
        }),
      });
      await fetchStaffChat();
      // Reset unread count locally for this client
      setStudentCases((prev) =>
        prev.map((c) =>
          (c.email || '').toLowerCase() === activeChatStudent.email.toLowerCase()
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
      // Remove from minimized if responded
      setMinimizedClients((prev) =>
        prev.filter((c) => (c.email || '').toLowerCase() !== activeChatStudent.email.toLowerCase())
      );
      void fetchCases();
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

  // Sort expedientes according to user workflow:
  // 1. In 'nuevos' (Usuarios Registrados): strictly by arrival order (most recent arrival at the top, oldest at the bottom)
  // 2. In other tabs: by when staff moved them (most recently moved at the top)
  filteredCases.sort((a, b) => {
    if (activeTab === 'nuevos') {
      const numA = a.expedienteNumber || 0;
      const numB = b.expedienteNumber || 0;
      if (numA !== numB) {
        return numB - numA; // El expediente más reciente arriba (ej. #9), el más antiguo abajo (ej. #1)
      }
      const timeA = new Date(a.submittedAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.submittedAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    } else {
      const timeA = new Date(a.updatedAt || a.submittedAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.submittedAt || 0).getTime();
      return timeB - timeA;
    }
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
          ) : activeTab === 'referidos' ? (
            <StaffReferrals />
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
                      const groupCards = casesByGroup.get(student.groupKey || student.id) || [student];
                      const activeGroupCards = groupCards.filter(c => c.hasVisaService !== false);
                      const targetCards = activeGroupCards.length > 0 ? activeGroupCards : groupCards;
                      const groupNames = targetCards.map(c => {
                        const fData = c.formData || {};
                        const cNombres = fData.nombres?.trim() || fData.first_name?.trim();
                        const cApellidos = fData.apellidos?.trim() || fData.last_name?.trim();
                        const fullName = [cNombres, cApellidos].filter(Boolean).join(' ');
                        return fullName || c.name || 'Postulante';
                      }).join(' | ');
                      const groupPhoto = targetCards.find(c => Boolean(c.photoUrl))?.photoUrl || student.photoUrl || '';
                      const groupSize = groupCards.length;
                      return (
                        <StaffCaseCard
                          key={student.id}
                          student={student}
                          groupSize={groupSize}
                          groupNames={groupNames}
                          groupPhoto={groupPhoto}
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

      {/* FLOATING UNANSWERED CLIENT CHAT BUBBLES */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-row-reverse items-center gap-3.5 pointer-events-none">
        {(() => {
          const map = new Map<string, StudentCase>();
          studentCases.forEach((c) => {
            const email = (c.email || c.formData?.email_contacto || '').toLowerCase().trim();
            if (email && (c.unreadCount || 0) > 0) {
              if (!map.has(email) || (map.get(email)!.unreadCount || 0) < (c.unreadCount || 0)) {
                map.set(email, c);
              }
            }
          });
          minimizedClients.forEach((c) => {
            const email = (c.email || c.formData?.email_contacto || '').toLowerCase().trim();
            if (email && !map.has(email)) {
              map.set(email, c);
            }
          });

          return Array.from(map.values())
            .filter((client) => (client.email || '').toLowerCase() !== (activeChatStudent?.email || '').toLowerCase())
            .map((client) => {
              const clientName = client.name || client.formData?.nombres || 'Cliente';
              const initial = (clientName || 'C')[0]?.toUpperCase();
              const unread = client.unreadCount || 0;

              return (
                <div key={client.email} className="relative group pointer-events-auto">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full right-0 mb-2.5 hidden group-hover:flex flex-col items-end whitespace-nowrap bg-slate-900 text-white text-xs rounded-2xl py-2 px-3.5 shadow-2xl border border-slate-700/80 animate-in fade-in zoom-in-95 duration-200 pointer-events-none z-50">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{clientName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/30 text-blue-300 rounded font-bold uppercase">
                        {client.visaType}
                      </span>
                    </div>
                    {client.lastChatMessage && (
                      <span className="text-[11px] text-slate-300 max-w-[220px] truncate mt-0.5">
                        "{client.lastChatMessage}"
                      </span>
                    )}
                  </div>

                  {/* Floating Avatar Bubble Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setStudentCases((prev) =>
                        prev.map((item) =>
                          (item.email || '').toLowerCase() === (client.email || '').toLowerCase()
                            ? { ...item, unreadCount: 0 }
                            : item
                        )
                      );
                      setActiveChatStudent(client);
                      setMinimizedClients((prev) =>
                        prev.filter((c) => (c.email || '').toLowerCase() !== (client.email || '').toLowerCase())
                      );
                    }}
                    className="relative p-1 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                    title={`Abrir chat con ${clientName}`}
                  >
                    {unread > 0 && (
                      <span className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping opacity-60 pointer-events-none" />
                    )}

                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-inner">
                      {client.photoUrl ? (
                        <img
                          src={client.photoUrl}
                          alt={clientName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        initial
                      )}
                    </div>

                    {/* Online Indicator Badge */}
                    <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-500/20 shadow-xs" />

                    {/* Unread Counter Badge */}
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 border-2 border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce">
                        {unread}
                      </span>
                    )}
                  </button>
                </div>
              );
            });
        })()}
      </div>

      {/* STAFF LIVE CHAT DRAWER */}
      <StaffChatDrawer
        activeChatStudent={activeChatStudent}
        onClose={() => {
          if (activeChatStudent) {
            setMinimizedClients((prev) =>
              prev.filter((c) => (c.email || '').toLowerCase() !== (activeChatStudent.email || '').toLowerCase())
            );
          }
          setActiveChatStudent(null);
        }}
        onMinimize={() => {
          if (activeChatStudent) {
            setMinimizedClients((prev) => {
              const exists = prev.some((c) => (c.email || '').toLowerCase() === (activeChatStudent.email || '').toLowerCase());
              return exists ? prev : [...prev, activeChatStudent];
            });
          }
          setActiveChatStudent(null);
        }}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isSendingChat={isSendingChat}
        onSendChat={handleSendStaffChat}
      />
    </div>
  );
}
