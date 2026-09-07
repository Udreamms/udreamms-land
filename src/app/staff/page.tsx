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
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Type definitions for Staff Portal student cases
export type StaffTabType = 'nuevos' | 'ds160' | 'sevis' | 'entrevista' | 'negados' | 'aprobados';

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
  formData: Record<string, string>;
  notes?: string;
}

export default function StaffPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<StaffTabType>('nuevos');
  const [studentCases, setStudentCases] = useState<StudentCase[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCaseModal, setSelectedCaseModal] = useState<StudentCase | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

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
      }
    } catch (error) {
      console.error('Error fetching staff cases:', error);
      toast.error('No se pudieron actualizar los casos desde la nube.');
    } finally {
      setIsLoadingCases(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCases();
      // Polling every 20 seconds for new submissions
      const interval = setInterval(() => {
        fetchCases();
      }, 20000);
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

  const getStatusLabel = (status: StaffTabType) => {
    switch (status) {
      case 'nuevos': return 'Procesos Nuevos';
      case 'ds160': return 'Procesos en DS-160';
      case 'sevis': return 'Procesos en SEVIS';
      case 'entrevista': return 'Listos para Entrevista';
      case 'negados': return 'Negados';
      case 'aprobados': return 'Aprobados';
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

  // Tab definitions
  const tabsList: { id: StaffTabType; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'nuevos', label: 'Procesos Nuevos', icon: Inbox, color: 'text-blue-600' },
    { id: 'ds160', label: 'Procesos en DS-160', icon: FileText, color: 'text-amber-600' },
    { id: 'sevis', label: 'Procesos en SEVIS', icon: CreditCard, color: 'text-indigo-600' },
    { id: 'entrevista', label: 'Listos para Entrevista', icon: Calendar, color: 'text-purple-600' },
    { id: 'negados', label: 'Negados', icon: XCircle, color: 'text-red-600' },
    { id: 'aprobados', label: 'Aprobados', icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative selection:bg-blue-500/20">
      
      {/* FLOATING WHITE GLASSMORPHISM SIDEBAR */}
      <aside className={`fixed top-[18px] left-[18px] h-[calc(100vh-36px)] bg-white border border-slate-200 shadow-xl rounded-3xl p-5 md:p-6 transition-all duration-300 z-40 flex flex-col justify-between ${
        isSidebarCollapsed ? 'w-20' : 'w-80'
      }`}>
        <div className="space-y-6">
          
          {/* Logo & Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
                U
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                    uDreamms
                  </h1>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    STAFF PORTAL
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors hidden md:block text-black"
              title="Colapsar menú"
            >
              <Menu className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {tabsList.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = studentCases.filter(c => c.status === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left ${
                    isActive 
                      ? 'bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-sm' 
                      : 'hover:bg-slate-100 border border-transparent text-slate-700 font-medium'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={tab.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-black'}`} />
                    {!isSidebarCollapsed && (
                      <span className="text-xs truncate">{tab.label}</span>
                    )}
                  </div>

                  {!isSidebarCollapsed && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Logout */}
        <div className="pt-4 border-t border-slate-100">
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full h-11 rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              isSidebarCollapsed ? 'justify-center px-0' : 'justify-center'
            }`}
            title="Cerrar Sesión Staff"
          >
            <LogOut className="w-4 h-4 text-red-600 shrink-0" />
            {!isSidebarCollapsed && <span>Cerrar Sesión Staff</span>}
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 transition-all duration-300 pt-6 md:pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full ${
        isSidebarCollapsed ? 'md:pl-28' : 'md:pl-[22.5rem]'
      }`}>
        
        {/* Header bar */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-slate-200 border border-slate-300 text-slate-800 text-[10px] font-bold uppercase tracking-widest">
                Panel de Administración Staff
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 pt-1">
                {getStatusLabel(activeTab)}
              </h2>
              <p className="text-xs text-slate-500">
                Visualiza los datos en tiempo real de los alumnos para llenar el DS-160 y gestionar trámites.
              </p>
            </div>

            {/* Action Bar: Search & Refresh */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Buscar alumno, email, escuela..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-xs bg-white border-slate-200 rounded-full shadow-sm focus:border-blue-600"
                />
              </div>

              <Button
                onClick={fetchCases}
                disabled={isLoadingCases}
                variant="outline"
                className="h-10 px-4 rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-sm shrink-0"
                title="Actualizar casos desde la base de datos"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-black ${isLoadingCases ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-4">
            {filteredCases.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto">
                  <Inbox className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No hay procesos en la sección de {getStatusLabel(activeTab)}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Los procesos que los alumnos llenen o muevas a este estado aparecerán automáticamente aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredCases.map((student) => (
                  <div
                    key={student.id}
                    className="bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-2xl p-5 md:p-6 transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    {/* Left Info: Photo + Details */}
                    <div className="flex items-start md:items-center gap-4 min-w-0">
                      
                      {/* Photo Thumbnail */}
                      <div className="relative w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-inner">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Student Details */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-slate-900 truncate">
                            {student.name || 'Sin nombre asignado'}
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            student.visaType === 'F-1'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {student.visaType === 'F-1' ? 'Estudiante F-1' : 'Turista B-2'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {student.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-black shrink-0" />
                            {student.email || 'Sin email'}
                          </span>
                          {student.phone && (
                            <span className="flex items-center gap-1.5 truncate">
                              <Phone className="w-3.5 h-3.5 text-black shrink-0" />
                              {student.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 truncate text-slate-700 font-semibold">
                            <School className="w-3.5 h-3.5 text-black shrink-0" />
                            {student.schoolName || student.schoolState}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Actions: Modal View + Status Switcher */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0">
                      
                      {/* View Full Form Button */}
                      <Button
                        onClick={() => setSelectedCaseModal(student)}
                        className="h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                      >
                        <Eye className="w-4 h-4 text-white" />
                        Ver Formulario Completo
                      </Button>

                      {/* Status Dropdown Selector */}
                      <select
                        value={student.status}
                        onChange={(e) => handleMoveStatus(student.id, e.target.value as StaffTabType)}
                        className="h-10 px-3 rounded-full border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600"
                        title="Cambiar estado del proceso"
                      >
                        <option value="nuevos">Procesos Nuevos</option>
                        <option value="ds160">En DS-160</option>
                        <option value="sevis">En SEVIS</option>
                        <option value="entrevista">Listo para Entrevista</option>
                        <option value="aprobados">Aprobado</option>
                        <option value="negados">Negado</option>
                      </select>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* RICH STUDENT FULL FORM MODAL (ALL 13 SECTIONS) */}
      {selectedCaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
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
            <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Estado Actual:</span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                  {getStatusLabel(selectedCaseModal.status)}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-700">Mover a:</span>
                {(['nuevos', 'ds160', 'sevis', 'entrevista', 'aprobados', 'negados'] as StaffTabType[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleMoveStatus(selectedCaseModal.id, st)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
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

            {/* Modal Body: All 13 Sections */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-900">
              
              {/* SECCIÓN FOTOGRAFÍA OFICIAL */}
              {selectedCaseModal.photoUrl && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={selectedCaseModal.photoUrl}
                    alt="Fotografía oficial"
                    className="w-28 h-28 object-cover rounded-2xl border-2 border-white shadow-md"
                  />
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                      <Camera className="w-4 h-4 text-black" />
                      Fotografía Oficial Tipo Pasaporte (5x5 cm / 2x2 pulg)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Fotografía subida por el postulante para la carga en el formulario DS-160 y documentación consular.
                    </p>
                    <div className="pt-2">
                      <a
                        href={selectedCaseModal.photoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        Abrir imagen en tamaño completo
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 1. INFORMACIÓN PERSONAL */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-black" />
                  1. Información Personal
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Apellidos:</span>
                    <strong className="text-slate-900 text-sm">{selectedCaseModal.formData.apellidos || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Nombres:</span>
                    <strong className="text-slate-900 text-sm">{selectedCaseModal.formData.nombres || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Fecha de Nacimiento:</span>
                    <strong className="text-slate-900 text-sm">{selectedCaseModal.formData.fecha_nacimiento || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Lugar de Nacimiento:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.lugar_nacimiento || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Ciudad de Nacimiento:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.ciudad_nacimiento || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Estado / Provincia Nacimiento:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.estado_nacimiento || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">País de Nacimiento:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.pais_nacimiento || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">¿Otra nacionalidad?:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.otra_nacionalidad || 'No'} {selectedCaseModal.formData.cuales_nacionalidades ? `(${selectedCaseModal.formData.cuales_nacionalidades})` : ''}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">¿Residente permanente otro país?:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.residente_otro_pais || 'No'} {selectedCaseModal.formData.que_pais_residencia ? `(${selectedCaseModal.formData.que_pais_residencia})` : ''}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">N° Documento Nacional (DNI / CURP):</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.num_identificacion_nacional || '-'}</strong>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="text-slate-500 font-semibold block">¿Rechazo de visa previo?:</span>
                    <p className="text-slate-900 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                      {selectedCaseModal.formData.rechazo_visa_detalle || 'Ninguno reportado.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. INFORMACIÓN ADICIONAL (ESTUDIANTES F-1) */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <School className="w-4 h-4 text-black" />
                  2. Información Adicional (Sólo para Estudiantes)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="text-slate-500 font-semibold block">¿Por qué quieres estudiar inglés?:</span>
                    <p className="text-slate-900 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                      {selectedCaseModal.formData.motivo_estudio_ingles || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Duración de Estudio:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.duracion_estudio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Horario de Estudio:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.horario_estudio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Semestre de Inicio:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.semestre_inicio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Estado de Estudio USA:</span>
                    <strong className="text-slate-900">Utah</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-semibold block">Nombre de la Escuela Seleccionada:</span>
                    <strong className="text-blue-700 text-sm font-bold">
                      {selectedCaseModal.formData.nombre_escuela || selectedCaseModal.formData.escuela_manual_nombre || '-'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 3. ESTADO CIVIL */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-black" />
                  3. Estado Civil
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Estado Civil:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.estado_civil || '-'}</strong>
                  </div>
                  {selectedCaseModal.formData.estado_civil === 'Casado' && (
                    <>
                      <div>
                        <span className="text-slate-500 font-semibold block">Nombre del Cónyuge:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.nombre_conyuge || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Fecha de Matrimonio:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.fecha_matrimonio || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Nacimiento Cónyuge:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.fecha_nacimiento_conyuge || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Lugar / Ciudad Cónyuge:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.ciudad_conyuge || '-'}, {selectedCaseModal.formData.pais_conyuge || '-'}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 4. PASAPORTE */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-black" />
                  4. Pasaporte
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Número de Pasaporte:</span>
                    <strong className="text-slate-900 text-sm font-mono">{selectedCaseModal.formData.num_pasaporte || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Ciudad de Emisión:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.ciudad_pasaporte || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Estado de Emisión:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.estado_pasaporte || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Fecha de Emisión:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.fecha_emision_pasaporte || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Fecha de Expiración:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.fecha_expiracion_pasaporte || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">¿Ha extraviado pasaporte antes?:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.perdio_pasaporte || 'No'}</strong>
                  </div>
                </div>
              </div>

              {/* 5. DIRECCIÓN DE DOMICILIO ACTUAL */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Home className="w-4 h-4 text-black" />
                  5. Dirección de Domicilio Actual
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-semibold block">Dirección:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.direccion_domicilio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Ciudad:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.ciudad_domicilio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Estado / Provincia:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.estado_domicilio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">País:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.pais_domicilio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Código Postal:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.cp_domicilio || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Celular:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.celular_contacto || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Email:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.email_contacto || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* 6. PATROCINADOR / SPONSOR */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-black" />
                  6. Patrocinador / Sponsor
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">¿Tiene Patrocinador?:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.tiene_patrocinador || 'No'}</strong>
                  </div>
                  {selectedCaseModal.formData.tiene_patrocinador === 'Sí' && (
                    <>
                      <div>
                        <span className="text-slate-500 font-semibold block">Nombre Completo:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.sponsor_nombres || ''} {selectedCaseModal.formData.sponsor_apellidos || ''}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Parentesco:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.sponsor_parentesco || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Teléfono:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.sponsor_celular || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Email:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.sponsor_email || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Dirección Sponsor:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.sponsor_direccion || '-'}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 7. HIJOS */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-black" />
                  7. Hijos ({selectedCaseModal.formData.hijos_count || '0'} Hijos Registrados)
                </h4>
                <div className="space-y-3">
                  {Array.from({ length: parseInt(selectedCaseModal.formData.hijos_count || '0', 10) || 0 }).map((_, i) => {
                    const hNum = i + 1;
                    return (
                      <div key={hNum} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 font-semibold block">Hijo N° {hNum}:</span>
                          <strong className="text-slate-900">{selectedCaseModal.formData[`hijo${hNum}_nombres`] || ''} {selectedCaseModal.formData[`hijo${hNum}_apellidos`] || ''}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Fecha de Nacimiento:</span>
                          <strong className="text-slate-900">{selectedCaseModal.formData[`hijo${hNum}_fecha_nac`] || '-'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Pasaporte:</span>
                          <strong className="text-slate-900 font-mono">{selectedCaseModal.formData[`hijo${hNum}_pasaporte`] || '-'}</strong>
                        </div>
                      </div>
                    );
                  })}
                  {(!selectedCaseModal.formData.hijos_count || selectedCaseModal.formData.hijos_count === '0') && (
                    <p className="text-xs text-slate-500">El postulante indicó que no viajará con hijos.</p>
                  )}
                </div>
              </div>

              {/* 8. PADRES */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-black" />
                  8. Nombre de los Padres
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold block">Nombre Completo Mamá:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.nombre_mama || '-'}</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">Fecha Nac: {selectedCaseModal.formData.fecha_nac_mama || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Nombre Completo Papá:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.nombre_papa || '-'}</strong>
                    <span className="text-slate-500 text-[11px] block mt-0.5">Fecha Nac: {selectedCaseModal.formData.fecha_nac_papa || '-'}</span>
                  </div>
                </div>
              </div>

              {/* 9. INFORMACIÓN DE TRABAJO */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-black" />
                  9. Información de Trabajo
                </h4>
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Empleo Actual</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                      <div>
                        <span className="text-slate-500 font-semibold block">Empresa:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_empresa || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Dirección:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_direccion || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Ciudad / País:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_ciudad || '-'}, {selectedCaseModal.formData.trabajo_pais || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Teléfono Empresa:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_telefono || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Fecha de Inicio:</span>
                        <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_fecha_inicio || '-'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block">Salario Mensual:</span>
                        <strong className="text-emerald-700 font-bold">{selectedCaseModal.formData.trabajo_salario || '-'}</strong>
                      </div>
                      <div className="sm:col-span-2 md:col-span-3">
                        <span className="text-slate-500 font-semibold block">Descripción de Labores:</span>
                        <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">{selectedCaseModal.formData.trabajo_descripcion || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {selectedCaseModal.formData.trabajo_anterior_si === 'Sí' && (
                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Empleo Anterior</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        <div>
                          <span className="text-slate-500 font-semibold block">Empresa Anterior:</span>
                          <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_ant_empresa || '-'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Cargo Desempeñado:</span>
                          <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_ant_cargo || '-'}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold block">Supervisor:</span>
                          <strong className="text-slate-900">{selectedCaseModal.formData.trabajo_ant_supervisor || '-'}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 10 & 11. EDUCACIÓN */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-black" />
                  10 & 11. Historial Educativo
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 text-xs uppercase block border-b border-slate-200 pb-1">Educación Secundaria</strong>
                    <div><span className="text-slate-500 font-semibold">Institución:</span> <strong className="text-slate-900">{selectedCaseModal.formData.secundaria_nombre || '-'}</strong></div>
                    <div><span className="text-slate-500 font-semibold">Programa / Título:</span> <strong className="text-slate-900">{selectedCaseModal.formData.secundaria_programa || '-'}</strong></div>
                    <div><span className="text-slate-500 font-semibold">Fechas:</span> <strong className="text-slate-900">{selectedCaseModal.formData.secundaria_fecha_inicio || '-'} a {selectedCaseModal.formData.secundaria_fecha_fin || '-'}</strong></div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <strong className="text-slate-900 text-xs uppercase block border-b border-slate-200 pb-1">Universidad / Instituto</strong>
                    <div><span className="text-slate-500 font-semibold">Institución:</span> <strong className="text-slate-900">{selectedCaseModal.formData.universidad_nombre || '-'}</strong></div>
                    <div><span className="text-slate-500 font-semibold">Carrera / Programa:</span> <strong className="text-slate-900">{selectedCaseModal.formData.universidad_programa || '-'}</strong></div>
                    <div><span className="text-slate-500 font-semibold">Fechas:</span> <strong className="text-slate-900">{selectedCaseModal.formData.universidad_fecha_inicio || '-'} a {selectedCaseModal.formData.universidad_fecha_fin || '-'}</strong></div>
                  </div>
                </div>
              </div>

              {/* 12. ENTRADA A ESTADOS UNIDOS */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-black" />
                  12. Información requerida antes de entrar a EE.UU.
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-semibold block">Dirección de Hospedaje en EE.UU.:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.usa_hospedaje_direccion || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Fecha de Llegada / Salida:</span>
                    <strong className="text-slate-900">{selectedCaseModal.formData.usa_fecha_llegada || '-'} al {selectedCaseModal.formData.usa_fecha_salida || '-'}</strong>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="text-slate-500 font-semibold block">Viajes Anteriores a EE.UU.:</span>
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">{selectedCaseModal.formData.usa_viajes_anteriores || 'Sin viajes previos registrados.'}</p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="text-slate-500 font-semibold block">Visas Americanas Anteriores:</span>
                    <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">{selectedCaseModal.formData.usa_visas_anteriores_detalle || 'Sin visas anteriores.'}</p>
                  </div>
                </div>
              </div>

              {/* 13. CONTACTOS DE EMERGENCIA */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-white shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-black" />
                  13. Contactos de Emergencia
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 font-bold block border-b border-slate-200 pb-1">Contacto de Emergencia 1</strong>
                    <div><span className="text-slate-500">Nombre:</span> <strong>{selectedCaseModal.formData.contacto1_nombres || ''} {selectedCaseModal.formData.contacto1_apellidos || ''}</strong></div>
                    <div><span className="text-slate-500">Teléfono:</span> <strong>{selectedCaseModal.formData.contacto1_celular || '-'}</strong></div>
                    <div><span className="text-slate-500">Email:</span> <strong>{selectedCaseModal.formData.contacto1_email || '-'}</strong></div>
                    <div><span className="text-slate-500">Parentesco:</span> <strong>{selectedCaseModal.formData.contacto1_parentesco || '-'}</strong></div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 font-bold block border-b border-slate-200 pb-1">Contacto de Emergencia 2</strong>
                    <div><span className="text-slate-500">Nombre:</span> <strong>{selectedCaseModal.formData.contacto2_nombres || ''} {selectedCaseModal.formData.contacto2_apellidos || ''}</strong></div>
                    <div><span className="text-slate-500">Teléfono:</span> <strong>{selectedCaseModal.formData.contacto2_celular || '-'}</strong></div>
                    <div><span className="text-slate-500">Email:</span> <strong>{selectedCaseModal.formData.contacto2_email || '-'}</strong></div>
                    <div><span className="text-slate-500">Parentesco:</span> <strong>{selectedCaseModal.formData.contacto2_parentesco || '-'}</strong></div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Última actualización sincronizada con Firebase.
              </span>
              <Button
                onClick={() => setSelectedCaseModal(null)}
                className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/20"
              >
                Cerrar Formulario
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
