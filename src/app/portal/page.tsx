'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Phone,
  Settings,
  LogOut,
  Check,
  Calendar,
  MessageSquare,
  ArrowRight,
  Shield,
  FileText,
  Video,
  UserCheck,
  Sparkles,
  Download
} from "lucide-react";

export default function PortalPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTopSection, setActiveTopSection] = useState<'visa-estudiante' | 'visa-turista' | 'experto'>('visa-estudiante');
  const [activeSection, setActiveSection] = useState<'servicios' | 'productos' | 'curso' | 'libro' | 'experto' | 'proceso'>('proceso');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const router = useRouter();

  // Watch Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNewDisplayName(currentUser.displayName || "");
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada correctamente");
      router.push('/login');
    } catch (err: any) {
      toast.error("Error al cerrar sesión: " + err.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSavingProfile(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName
      });
      // Refresh local user state
      setUser({
        ...auth.currentUser,
        displayName: newDisplayName
      });
      toast.success("Perfil actualizado con éxito");
      setIsProfileModalOpen(false);
    } catch (err: any) {
      toast.error("Error al actualizar perfil: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-t-2 border-purple-500 border-r-2 border-r-transparent animate-spin"></div>
          <span className="text-xs tracking-widest text-white/40 uppercase font-normal">Cargando Portal...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Initials for avatar fallback
  const userInitials = user.displayName 
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email ? user.email.slice(0, 2).toUpperCase() : "UD";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/20 flex flex-col relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 h-16 w-full shrink-0">
        <div className="w-full px-4 md:px-8 h-full flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-7 h-7 relative">
              <img src="/icons/new-icon-udreamms.png" alt="Udreamms" className="object-contain w-full h-full drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
            </div>
            <span className="text-lg font-normal tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Udreamms</span>
          </div>

          {/* Menus (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTopSection('visa-estudiante');
                setActiveSection('proceso');
              }}
              className={`relative px-4 py-2 text-xs font-normal tracking-wider uppercase rounded-full transition-all duration-300 ${
                activeTopSection === 'visa-estudiante' ? "text-purple-400 bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Visa de Estudiante F-1
              {activeTopSection === 'visa-estudiante' && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute bottom-0 left-4 right-4 h-[2px] bg-purple-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTopSection('visa-turista');
                setActiveSection('proceso');
              }}
              className={`relative px-4 py-2 text-xs font-normal tracking-wider uppercase rounded-full transition-all duration-300 ${
                activeTopSection === 'visa-turista' ? "text-purple-400 bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Visa de Turista B-2
              {activeTopSection === 'visa-turista' && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute bottom-0 left-4 right-4 h-[2px] bg-purple-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTopSection('experto');
                setActiveSection('experto');
              }}
              className={`relative px-4 py-2 text-xs font-normal tracking-wider uppercase rounded-full transition-all duration-300 ${
                activeTopSection === 'experto' ? "text-purple-400 bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Hablar con un experto
              {activeTopSection === 'experto' && (
                <motion.div 
                  layoutId="activeTabIndicator" 
                  className="absolute bottom-0 left-4 right-4 h-[2px] bg-purple-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          </nav>

          {/* User profile section */}
          <div className="relative z-50">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-9 h-9 rounded-full overflow-hidden border border-white/20 hover:border-purple-500/50 cursor-pointer transition-colors relative flex items-center justify-center bg-white/5 shadow-inner"
            >
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "Usuario"} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xs font-normal text-white uppercase tracking-wider">
                  {userInitials}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown on outer click */}
                  <div className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setIsDropdownOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0d0d11]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 z-50 space-y-3"
                  >
                    <div className="px-1 py-1">
                      <p className="text-xs font-normal tracking-widest text-white/40 uppercase mb-1">Tu Cuenta</p>
                      <p className="text-sm font-normal truncate text-white">{user.displayName || "Usuario Udreamms"}</p>
                      <p className="text-xs truncate text-white/50">{user.email}</p>
                    </div>

                    <div className="border-t border-white/5" />

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full h-10 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3 px-3 text-left text-xs font-normal text-white/80 hover:text-white"
                      >
                        <Settings className="w-4 h-4 text-white" />
                        Administrar Perfil
                      </button>
                      
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="w-full h-10 rounded-xl hover:bg-red-500/10 transition-colors flex items-center gap-3 px-3 text-left text-xs font-normal text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* MOBILE NAV BAR (Visible only on small screens) */}
      <div className="md:hidden w-full bg-[#070709] border-b border-white/5 overflow-x-auto no-scrollbar shrink-0 flex items-center py-2 px-4 gap-2 z-30">
        <button
          onClick={() => {
            setActiveTopSection('visa-estudiante');
            setActiveSection('proceso');
          }}
          className={`px-4 py-1.5 text-[10px] font-normal tracking-widest uppercase rounded-full shrink-0 transition-all ${
            activeTopSection === 'visa-estudiante' ? "text-purple-400 bg-transparent border border-purple-500/40" : "text-white/40 border border-transparent"
          }`}
        >
          Visa de Estudiante F-1
        </button>
        <button
          onClick={() => {
            setActiveTopSection('visa-turista');
            setActiveSection('proceso');
          }}
          className={`px-4 py-1.5 text-[10px] font-normal tracking-widest uppercase rounded-full shrink-0 transition-all ${
            activeTopSection === 'visa-turista' ? "text-purple-400 bg-transparent border border-purple-500/40" : "text-white/40 border border-transparent"
          }`}
        >
          Visa de Turista B-2
        </button>
        <button
          onClick={() => {
            setActiveTopSection('experto');
            setActiveSection('experto');
          }}
          className={`px-4 py-1.5 text-[10px] font-normal tracking-widest uppercase rounded-full shrink-0 transition-all ${
            activeTopSection === 'experto' ? "text-purple-400 bg-transparent border border-purple-500/40" : "text-white/40 border border-transparent"
          }`}
        >
          Experto
        </button>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-1 overflow-y-auto relative z-10 py-8 px-4 md:px-8 w-full">
        <div className="flex flex-col md:flex-row gap-8 items-start w-full">
          
          {/* LEFT SIDEBAR (Visible when 'visa-estudiante' or 'visa-turista' is active) */}
          {(activeTopSection === 'visa-estudiante' || activeTopSection === 'visa-turista') && (
            <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-white/5 md:pr-6">
              <div className="hidden md:block px-3 py-1.5 text-[10px] font-semibold tracking-widest text-white/40 uppercase mb-2">
                Menú de Visa
              </div>
              <button
                onClick={() => setActiveSection('proceso')}
                className={`px-4 py-2.5 md:py-3 text-[10px] md:text-xs font-normal tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 text-left ${
                  activeSection === 'proceso' 
                    ? "text-purple-400 bg-white/5 border border-purple-500/30" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {activeTopSection === 'visa-estudiante' ? "Mi proceso de admisión" : "Mi proceso de solicitud"}
              </button>
              <button
                onClick={() => setActiveSection('servicios')}
                className={`px-4 py-2.5 md:py-3 text-[10px] md:text-xs font-normal tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 text-left ${
                  activeSection === 'servicios' 
                    ? "text-purple-400 bg-white/5 border border-purple-500/30" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Servicios
              </button>
              <button
                onClick={() => setActiveSection('curso')}
                className={`px-4 py-2.5 md:py-3 text-[10px] md:text-xs font-normal tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 text-left ${
                  activeSection === 'curso' 
                    ? "text-purple-400 bg-white/5 border border-purple-500/30" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Curso Digital
              </button>
              <button
                onClick={() => setActiveSection('libro')}
                className={`px-4 py-2.5 md:py-3 text-[10px] md:text-xs font-normal tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 text-left ${
                  activeSection === 'libro' 
                    ? "text-purple-400 bg-white/5 border border-purple-500/30" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Libro Digital
              </button>
              <button
                onClick={() => setActiveSection('productos')}
                className={`px-4 py-2.5 md:py-3 text-[10px] md:text-xs font-normal tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 text-left ${
                  activeSection === 'productos' 
                    ? "text-purple-400 bg-white/5 border border-purple-500/30" 
                    : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                Recursos adicionales
              </button>
              <a
                href={activeTopSection === 'visa-estudiante' ? "https://www.udreamms.com/visas/student" : "https://www.udreamms.com/visas/tourist"}
                className="px-4 py-2.5 md:py-3 text-[10px] md:text-xs font-normal tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 text-left text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              >
                Sitio web
              </a>
            </aside>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 min-w-0 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full min-h-[400px]"
              >
            {/* MI PROCESO DE ADMISIÓN SECTION */}
            {activeSection === 'proceso' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">
                    {activeTopSection === 'visa-estudiante' ? "Mi Proceso de Admisión" : "Mi Proceso de Solicitud"}
                  </h2>
                  <p className="text-sm text-white/50">Monitorea y gestiona el avance de tu trámite de visa en tiempo real.</p>
                </div>

                <div className="w-full bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-normal uppercase tracking-widest">Servicio Activo</span>
                      <h3 className="text-xl font-normal pt-1">
                        {activeTopSection === 'visa-estudiante' ? "Asesoría de Visa de Estudiante F-1" : "Asesoría de Visa de Turista B-2"}
                      </h3>
                    </div>
                    {activeTopSection === 'visa-estudiante' ? (
                      <GraduationCap className="w-8 h-8 text-purple-400 shrink-0" />
                    ) : (
                      <Briefcase className="w-8 h-8 text-purple-400 shrink-0" />
                    )}
                  </div>

                  {/* Stepper progress */}
                  <div className="relative pt-4 pl-4 space-y-8">
                    {/* Vertical line connecting steps */}
                    <div className="absolute top-6 left-7 bottom-6 w-[2px] bg-gradient-to-b from-purple-500 via-purple-500/40 to-white/5" />

                    {/* Step 1 */}
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-normal text-white">Registro e Inicio de Proceso</h4>
                        <p className="text-xs text-white/50">Tu perfil ha sido registrado correctamente en la plataforma.</p>
                        <span className="text-[10px] font-normal text-purple-400 uppercase tracking-widest">Completado</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-normal text-white">
                          {activeTopSection === 'visa-estudiante' ? "Evaluación de Perfil Académico" : "Evaluación de Perfil Turístico"}
                        </h4>
                        <p className="text-xs text-white/50">
                          {activeTopSection === 'visa-estudiante' 
                            ? "Nuestros expertos están validando tus datos e institución recomendada." 
                            : "Nuestros expertos están validando tus lazos familiares, económicos y laborales."}
                        </p>
                        <span className="text-[10px] font-normal text-amber-400 uppercase tracking-widest">En Progreso</span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                        <span className="text-xs font-normal">3</span>
                      </div>
                      <div className="space-y-1 opacity-50">
                        <h4 className="text-sm font-normal text-white">Preparación de Documentación y Formulario DS-160</h4>
                        <p className="text-xs text-white/50">
                          {activeTopSection === 'visa-estudiante'
                            ? "Llenado y recopilación de documentos financieros y formularios consulares."
                            : "Llenado y recopilación de lazos en tu país y formulario consular DS-160."}
                        </p>
                        <span className="text-[10px] font-normal text-white/30 uppercase tracking-widest">Pendiente</span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shrink-0">
                        <span className="text-xs font-normal">4</span>
                      </div>
                      <div className="space-y-1 opacity-50">
                        <h4 className="text-sm font-normal text-white">Simulacro y Cita Consular</h4>
                        <p className="text-xs text-white/50">Capacitación intensiva para tu entrevista presencial con el cónsul.</p>
                        <span className="text-[10px] font-normal text-white/30 uppercase tracking-widest">Pendiente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SERVICIOS SECTION */}
            {activeSection === 'servicios' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Servicios y Soporte</h2>
                  <p className="text-sm text-white/50">Administra tus servicios y mantente en comunicación con tu asesor.</p>
                </div>

                <div className="w-full bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
                  <div className="space-y-4 max-w-2xl">
                    <Shield className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-normal">Asesor Designado</h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {activeTopSection === 'visa-estudiante' 
                        ? "Tienes soporte de primer nivel asignado para tu trámite de Visa de Estudiante F-1. Si tienes preguntas urgentes sobre tus pasos o necesitas cargar documentos, comunícate directamente por el canal preferencial."
                        : "Tienes soporte de primer nivel asignado para tu trámite de Visa de Turista B-2. Si tienes preguntas urgentes sobre tus pasos o necesitas cargar documentos, comunícate directamente por el canal preferencial."}
                    </p>
                  </div>

                  <Button 
                    onClick={() => {
                      setActiveTopSection('experto');
                      setActiveSection('experto');
                    }}
                    className="w-full md:w-auto h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase px-8 flex items-center justify-center gap-2"
                  >
                    Contactar Asesor
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* PRODUCTOS SECTION */}
            {activeSection === 'productos' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Recursos adicionales</h2>
                  <p className="text-sm text-white/50">Accede a tus herramientas de preparación y recursos adicionales.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Product 1 */}
                  <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all group">
                    <FileText className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
                    <div className="space-y-1">
                      <h3 className="text-md font-normal">
                        {activeTopSection === 'visa-estudiante' ? "Guía de Entrevista Consular" : "Guía de Entrevista Consular (Turismo)"}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {activeTopSection === 'visa-estudiante' 
                          ? "Recopilación de las preguntas más frecuentes del cónsul y consejos prácticos para responder con seguridad."
                          : "Recopilación de las preguntas frecuentes sobre turismo, fondos económicos e intenciones de retorno."}
                      </p>
                    </div>
                    <Button className="w-full h-10 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2">
                      Descargar PDF
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Product 2 */}
                  <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all group">
                    <Sparkles className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
                    <div className="space-y-1">
                      <h3 className="text-md font-normal">
                        {activeTopSection === 'visa-estudiante' ? "Plantilla de Carta de Intención" : "Plantilla de Lazos de Arraigo"}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {activeTopSection === 'visa-estudiante'
                          ? "Formato sugerido y redactado profesionalmente para demostrar tus lazos con tu país de origen."
                          : "Modelo de redacción y documentos de soporte sugeridos para probar tus vínculos de arraigo."}
                      </p>
                    </div>
                    <Button className="w-full h-10 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2">
                      Descargar DOCX
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Product 3 */}
                  <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 hover:shadow-[0_0_20px_rgba(168,85,247,0.05)] transition-all group">
                    <UserCheck className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
                    <div className="space-y-1">
                      <h3 className="text-md font-normal">
                        {activeTopSection === 'visa-estudiante' ? "Checklist de Requisitos Consulares" : "Checklist de Requisitos Turísticos"}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {activeTopSection === 'visa-estudiante'
                          ? "Lista de verificación interactiva de documentos indispensables que debes presentar el día de tu cita."
                          : "Lista de verificación interactiva de lazos familiares, financieros y laborales para tu cita."}
                      </p>
                    </div>
                    <Button className="w-full h-10 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2">
                      Descargar PDF
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>

                </div>
              </div>
            )}

            {/* CURSO SECTION */}
            {activeSection === 'curso' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Mi Curso de Preparación</h2>
                  <p className="text-sm text-white/50">Capacítate con nuestros videocursos prácticos dictados por mentores autorizados.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Video Player Mockup */}
                  <div className="lg:col-span-2 bg-[#0d0d11] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                    <div className="aspect-video bg-zinc-950 w-full relative flex items-center justify-center border-b border-white/5 group">
                      <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/0 transition-all pointer-events-none" />
                      <Video className="w-16 h-16 text-white/40 group-hover:text-white transition-all cursor-pointer" />
                      <span className="absolute bottom-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur text-[10px] font-normal tracking-wider text-white/80">Vista previa del curso</span>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-normal">
                        {activeTopSection === 'visa-estudiante' 
                          ? "Introducción al proceso de visa americana y perfiles" 
                          : "Introducción a la Visa de Turista B-2 y perfiles"}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {activeTopSection === 'visa-estudiante'
                          ? "En este módulo aprenderás el funcionamiento básico del sistema consular de USA y cómo analizar las debilidades y fortalezas de tu perfil antes de presentarte."
                          : "En este módulo aprenderás el funcionamiento básico del sistema consular de USA para visas de turismo y cómo estructurar tus lazos con tu país."}
                      </p>
                    </div>
                  </div>

                  {/* Modules list */}
                  <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4">
                    <h3 className="text-md font-normal tracking-wide border-b border-white/5 pb-2">Módulos del Curso</h3>
                    
                    <div className="space-y-2 overflow-y-auto max-h-[350px] pr-2 no-scrollbar">
                      {activeTopSection === 'visa-estudiante' ? (
                        <>
                          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                            <span className="text-xs font-normal text-purple-400">1. Introducción y Conceptos Básicos</span>
                            <span className="text-[10px] font-normal text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded uppercase">Viendo</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">2. Formulario DS-160 paso a paso</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">32 min</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">3. Solvencia Económica y Enlaces</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">24 min</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">4. Psicología Consular y Postura</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">40 min</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">5. Casos de Estudio y Prácticas</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">18 min</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                            <span className="text-xs font-normal text-purple-400">1. Requisitos y Pilares de la Visa B-2</span>
                            <span className="text-[10px] font-normal text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded uppercase">Viendo</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">2. Llenado del Formulario DS-160</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">35 min</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">3. Justificación de Arraigo Familiar</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">20 min</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">4. Solvencia y Lazos Laborales</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">28 min</span>
                          </div>

                          <div className="p-3 rounded-2xl hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-white/80 group-hover:text-white">5. Simulacro de Entrevista y Casos</span>
                            <span className="text-[10px] text-white/40 group-hover:text-white/60">25 min</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LIBRO DIGITAL SECTION */}
            {activeSection === 'libro' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Mi Libro Digital</h2>
                  <p className="text-sm text-white/50">Tu guía definitiva hacia Estados Unidos en formato ebook.</p>
                </div>

                <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 w-full font-sans">
                  {/* Book Mockup cover */}
                  <div className="w-48 h-64 shrink-0 rounded-2xl bg-gradient-to-tr from-[#1b1030] to-[#5b238d] border border-purple-500/30 flex flex-col justify-between p-4 shadow-[0_15px_35px_rgba(168,85,247,0.2)] hover:scale-105 transition-transform duration-300 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                    <span className="text-[10px] font-normal tracking-widest text-purple-300 uppercase">uDreamms Ebook</span>
                    <div className="space-y-1 z-10">
                      <h4 className="text-md font-normal leading-tight text-white">
                        {activeTopSection === 'visa-estudiante' ? "TU SUEÑO EN" : "TU VIAJE EN"}
                      </h4>
                      <h4 className="text-2xl font-normal tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
                        {activeTopSection === 'visa-estudiante' ? "AMÉRICA" : "USA"}
                      </h4>
                      <p className="text-[9px] text-white/50 pt-1">
                        {activeTopSection === 'visa-estudiante' 
                          ? "Guía indispensable para tu viaje y estadía" 
                          : "Guía de aprobación de Visa de Turista"}
                      </p>
                    </div>
                    <span className="text-[8px] tracking-[0.2em] uppercase text-white/40 z-10 font-normal">Edición 2026</span>
                  </div>

                  {/* Book details */}
                  <div className="space-y-6 text-center md:text-left flex-1">
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-normal">
                        {activeTopSection === 'visa-estudiante' 
                          ? "Tu Sueño en América: Guía de Sobrevivencia Consular" 
                          : "Turista en USA: Guía para una Aprobación Consular Exitosa"}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {activeTopSection === 'visa-estudiante'
                          ? "Este libro digital contiene la metodología exacta de Udreamms para optimizar tus respuestas consulares, entender los factores críticos de aprobación de visa y planificar tu viaje de manera exitosa."
                          : "Este libro digital contiene los secretos prácticos de Udreamms para responder con precisión sobre tus planes turísticos, justificar fondos y garantizar tu retorno."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                      <Button className="h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase px-8 flex items-center gap-2">
                        Descargar Ebook (PDF)
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button className="h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase px-8">
                        Leer Online
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HABLAR CON UN EXPERTO */}
            {activeSection === 'experto' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">Hablar con un Experto</h2>
                  <p className="text-sm text-white/50">Canal preferencial de soporte y videollamadas con tu mentor asignado.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  
                  {/* WhatsApp Support */}
                  <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.03)] transition-all">
                    <div className="space-y-4">
                      <MessageSquare className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-normal">Soporte por WhatsApp</h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Comunícate por texto en tiempo real con tu mentor asignado para resolver dudas de papelería, pagos, o para notificar la fecha de tus entrevistas de forma prioritaria.
                      </p>
                    </div>

                    <a 
                      href="https://wa.me/13854162224?text=Hola%2C%20necesito%20soporte%20con%20mi%20portal%20Udreamms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] text-white text-xs font-normal tracking-widest uppercase items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                    >
                      Iniciar Chat WhatsApp
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Schedule Call */}
                  <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 hover:shadow-[0_0_20px_rgba(168,85,247,0.03)] transition-all">
                    <div className="space-y-4">
                      <Calendar className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-normal">Agendar Videollamada</h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Programa tus simulacros de entrevista consular presenciales o llamadas de orientación técnica con nuestro equipo. Selecciona la fecha y el horario que mejor te convenga.
                      </p>
                    </div>

                    <a 
                      href="https://calendar.app.google/uAhHFp3YC2T1PbGU6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] text-white text-xs font-normal tracking-widest uppercase items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
                    >
                      Agendar Videocita
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full shrink-0 border-t border-white/5 py-6 mt-12 relative z-10 text-center text-[10px] tracking-[0.2em] uppercase text-white/30">
        Udreamms Portal © 2026. Todos los derechos reservados.
      </footer>

      {/* ACCOUNT MANAGEMENT MODAL */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal overlay background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsProfileModalOpen(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#0d0d11] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative z-10 space-y-6"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-normal text-white">Administrar Perfil</h3>
                <p className="text-xs text-white/40">Visualiza y actualiza la información de tu cuenta.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-normal text-white/40 uppercase tracking-wider block">Correo Electrónico</label>
                  <Input
                    type="text"
                    disabled
                    value={user.email || ""}
                    className="bg-white/5 border-white/10 rounded-full h-11 text-white/40 text-xs tracking-wide px-6 text-center cursor-not-allowed border-dashed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-normal text-white/40 uppercase tracking-wider block">Nombre de Perfil</label>
                  <Input
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="bg-white/5 border-white/10 focus:border-purple-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-purple-500/60 rounded-full h-11 text-white text-xs tracking-wide px-6 text-center transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 h-11 rounded-full bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 text-xs font-normal uppercase"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="flex-1 h-11 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal uppercase"
                  >
                    {savingProfile ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
