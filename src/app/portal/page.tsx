'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from "firebase/firestore";
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
  Download,
  ShoppingCart,
  Lock,
  School,
  Plane,
  Car,
  CreditCard,
  Home,
  Languages,
  Users,
  CheckCircle2,
  Star,
  Map,
  Hotel,
  ShoppingBag
} from "lucide-react";

const studentModules = [
  {
    title: "PASO 1: APLICA A UNA ESCUELA DE INGLES EN USA",
    description: "Aprende el proceso detallado para seleccionar, aplicar y ser admitido en una escuela de inglés autorizada en los Estados Unidos para obtener tu formulario I-20.",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Curso%20Digital%2F1.mp4?alt=media&token=44dbb5ff-96d5-4843-b719-190391776999"
  },
  {
    title: "PASO 2: COMPRA TU TARIFA SEVIS",
    description: "Te guiamos paso a paso para realizar el pago de tu tasa SEVIS I-901, un requisito indispensable antes de tu cita en la embajada.",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Curso%20Digital%2F2.mp4?alt=media&token=59db6b37-2f47-403d-a93d-052b08a0a1f2"
  },
  {
    title: "PASO 3: COMPLETA TU FORMULARIO DS160",
    description: "Instrucciones precisas para completar el formulario consular DS-160 sin cometer errores críticos que puedan comprometer tu visa de estudiante.",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Curso%20Digital%2F3.mp4?alt=media&token=ac30bc0f-fef5-4edc-bee8-62af82952803"
  },
  {
    title: "PASO 4: COMO COMPRAR TU CITA EN LA EMBAJADA AMERICANA",
    description: "Descubre cómo navegar el portal de citas consulares, realizar el pago del arancel de visa (MRV) y programar tus citas en el CAS y la Embajada.",
    videoUrl: "https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Curso%20Digital%2F4.mp4?alt=media&token=7fab24dd-0b89-4dfb-a3cb-3af7d4751755"
  }
];

const touristModules = [
  {
    title: "1. Requisitos y Pilares de la Visa B-2",
    description: "Entiende los criterios de evaluación del cónsul para la visa de turismo B-2.",
    videoUrl: ""
  },
  {
    title: "2. Llenado del Formulario DS-160",
    description: "Cómo responder a las preguntas del DS-160 enfocado en turismo y arraigo.",
    videoUrl: ""
  },
  {
    title: "3. Justificación de Arraigo Familiar",
    description: "Estrategias para demostrar lazos familiares fuertes en tu país de origen.",
    videoUrl: ""
  },
  {
    title: "4. Solvencia y Lazos Laborales",
    description: "Cómo estructurar tus pruebas de solvencia económica y empleo estable.",
    videoUrl: ""
  },
  {
    title: "5. Simulacro de Entrevista y Casos",
    description: "Preguntas frecuentes del cónsul y consejos para responder correctamente.",
    videoUrl: ""
  }
];

const cartItemsConfig: Record<string, { name: string; price: number; type: 'curso' | 'libro' | 'plan'; visa: 'estudiante' | 'turista' }> = {
  'curso-estudiante': { name: "Curso Digital - Visa de Estudiante F-1", price: 99, type: 'curso', visa: 'estudiante' },
  'libro-estudiante': { name: "Libro Digital - Visa de Estudiante F-1", price: 29, type: 'libro', visa: 'estudiante' },
  'curso-turista': { name: "Curso Digital - Visa de Turista B-2", price: 79, type: 'curso', visa: 'turista' },
  'libro-turista': { name: "Libro Digital - Visa de Turista B-2", price: 19, type: 'libro', visa: 'turista' },
  'plan-esencial': { name: "Plan 1: Esencial - F-1", price: 380, type: 'plan', visa: 'estudiante' },
  'plan-pro': { name: "Plan 2: Pro - F-1", price: 850, type: 'plan', visa: 'estudiante' },
  'plan-elite': { name: "Plan 3: Elite - F-1", price: 2500, type: 'plan', visa: 'estudiante' },
  'plan-allinclusive': { name: "Plan 4: All-Inclusive - F-1", price: 10000, type: 'plan', visa: 'estudiante' },
  'plan-turista-basico': { name: "Plan 1: Turista Básico - B-2", price: 380, type: 'plan', visa: 'turista' },
  'plan-turista-premium': { name: "Plan 2: Turista Premium - B-2", price: 3500, type: 'plan', visa: 'turista' },
  'plan-turista-vip': { name: "Plan 3: Experiencia VIP - B-2", price: 4990, type: 'plan', visa: 'turista' },
};

const studentPlans = [
  {
    id: "plan-esencial",
    name: "PLAN 1: ESENCIAL",
    price: "$380",
    originalPrice: "$494",
    discount: "30% OFF",
    description: "El punto de partida ideal.",
    highlight: false,
    features: [
      { name: "Servicios Básicos", icon: CheckCircle2 },
      { name: "Aplicación escuela + I-20", icon: School },
      { name: "DS-160 + SEVIS + Cita", icon: FileText },
      { name: "Simulacro de Entrevista (3 sesiones)", icon: MessageSquare },
    ]
  },
  {
    id: "plan-pro",
    name: "PLAN 2: PRO",
    price: "$850",
    originalPrice: "$1,700",
    discount: "50% OFF",
    description: "Para quienes buscan seguridad.",
    highlight: true,
    features: [
      { name: "Servicios Básicos", icon: CheckCircle2 },
      { name: "Aplicación escuela + I-20", icon: School },
      { name: "DS-160 + SEVIS + Cita", icon: FileText },
      { name: "Simulacro de Entrevista (3 sesiones)", icon: MessageSquare },
      { name: "Link vuelos / Seguro Médico", icon: Plane },
      { name: "Pick-up Aeropuerto (UT)", icon: Car },
      { name: "Banco, Celular y Licencia", icon: CreditCard },
    ]
  },
  {
    id: "plan-elite",
    name: "PLAN 3: ELITE",
    price: "$2,500",
    originalPrice: "$3,250",
    discount: "30% OFF",
    description: "Soporte completo y alojamiento.",
    highlight: false,
    features: [
      { name: "Servicios Básicos", icon: CheckCircle2 },
      { name: "Aplicación escuela + I-20", icon: School },
      { name: "DS-160 + SEVIS + Cita", icon: FileText },
      { name: "Simulacro de Entrevista (3 sesiones)", icon: MessageSquare },
      { name: "Link tickets aéreos", icon: Plane },
      { name: "Pick-up Aeropuerto (UT)", icon: Car },
      { name: "Banco, Celular y Licencia", icon: CreditCard },
      { name: "Búsqueda de Alojamiento (Aplicación de vivienda incluida)", icon: Home },
      { name: "Mentoria de Adaptación (1 mes)", icon: Users },
      { name: "Clases de Inglés (1er Mes Gratis)", icon: Languages },
    ]
  },
  {
    id: "plan-allinclusive",
    name: "PLAN 4: ALL-INCLUSIVE",
    price: "$10,000",
    originalPrice: "$13,000",
    discount: "30% OFF",
    description: "La experiencia VIP definitiva.",
    highlight: false,
    features: [
      { name: "Servicios Básicos", icon: CheckCircle2 },
      { name: "Aplicación escuela + I-20", icon: School },
      { name: "DS-160 + SEVIS + Cita", icon: FileText },
      { name: "Simulacro de Entrevista (Ilimitadas)", icon: MessageSquare },
      { name: "Tickets aéreos a USA (incluidos)", icon: Plane },
      { name: "Pick-up Aeropuerto (UT)", icon: Car },
      { name: "Banco, Celular y Licencia", icon: CreditCard },
      { name: "Búsqueda de Alojamiento (4 Meses Pagados)", icon: Home },
      { name: "Mentoria de Adaptación (4 meses)", icon: Star },
      { name: "Clases de Inglés (4 Meses Pagados)", icon: Languages },
    ]
  }
];

const touristPlans = [
  {
    id: "plan-turista-basico",
    name: "PLAN 1: TURISTA BÁSICO",
    price: "$380",
    originalPrice: "$494",
    discount: "30% OFF",
    description: "Lo esencial para tu solicitud.",
    highlight: false,
    features: [
      { name: "Auditoría de Perfil Migratorio", icon: FileText },
      { name: "Gestión de Visa B1/B2", icon: CheckCircle2 },
      { name: "Preparación para la Entrevista", icon: Users },
      { name: "Guía general para el día de la entrevista", icon: Video },
    ]
  },
  {
    id: "plan-turista-premium",
    name: "PLAN 2: TURISTA PREMIUM",
    price: "$3,500",
    originalPrice: "$4,550",
    discount: "30% OFF",
    description: "La experiencia completa y cómoda.",
    highlight: true,
    features: [
      { name: "Elige ciudad: FL, NY, CA, UT, NV, HI", icon: Map },
      { name: "Itinerario 8 días / 7 noches totalmente planificado", icon: Calendar },
      { name: "Vuelos y traslados internos incluidos", icon: Plane },
      { name: "Hospedaje 4–5 estrellas seleccionado", icon: Hotel },
      { name: "Entradas a parques y actividades", icon: ShoppingBag },
      { name: "Experiencias: ski, hiking, naturaleza", icon: Star },
      { name: "Gestión total del viaje", icon: CheckCircle2 },
      { name: "💡 Todo incluido: viaja sin preocupaciones", icon: Star },
    ]
  },
  {
    id: "plan-turista-vip",
    name: "PLAN 3: EXPERIENCIA VIP",
    price: "$4,990",
    originalPrice: "$6,500",
    discount: "30% OFF",
    description: "Lujo y atención exclusiva.",
    highlight: false,
    features: [
      { name: "Ruta Turística Multi-Estado – Todo Incluido", icon: Map },
      { name: "Itinerario personalizado 12–15 días", icon: Calendar },
      { name: "Vuelos y traslados internos incluidos", icon: Plane },
      { name: "Hospedaje 4–5 estrellas garantizado", icon: Star },
      { name: "Entradas a parques y experiencias premium", icon: ShoppingBag },
      { name: "Actividades exclusivas: shows y aventuras", icon: Video },
      { name: "Gestión integral del viaje, todo cubierto", icon: CheckCircle2 },
      { name: "💡 Todo incluido: solo llega y disfruta", icon: Star },
    ]
  }
];

export default function PortalPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTopSection, setActiveTopSection] = useState<'visa-estudiante' | 'visa-turista' | 'experto'>('visa-estudiante');
  const [activeSection, setActiveSection] = useState<'servicios' | 'productos' | 'curso' | 'libro' | 'experto' | 'proceso'>('proceso');
  const [activeStudentStep, setActiveStudentStep] = useState(0);
  const [activeTouristStep, setActiveTouristStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const router = useRouter();

  const [dbUser, setDbUser] = useState<any>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (itemId: string) => {
    if (cart.includes(itemId)) {
      toast.info("Ya está en el carrito");
      return;
    }
    setCart((prev) => [...prev, itemId]);
    toast.success("Agregado al carrito");
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((id) => id !== itemId));
    toast.success("Eliminado del carrito");
  };

  const handleCheckout = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const updates: Record<string, boolean> = {};
      
      cart.forEach((itemId) => {
        if (itemId === 'curso-estudiante') updates.purchased_curso_estudiante = true;
        if (itemId === 'libro-estudiante') updates.purchased_libro_estudiante = true;
        if (itemId === 'curso-turista') updates.purchased_curso_turista = true;
        if (itemId === 'libro-turista') updates.purchased_libro_turista = true;
        if (itemId === 'plan-esencial') updates.purchased_plan_esencial = true;
        if (itemId === 'plan-pro') updates.purchased_plan_pro = true;
        if (itemId === 'plan-elite') updates.purchased_plan_elite = true;
        if (itemId === 'plan-turista-basico') updates.purchased_plan_turista_basico = true;
        if (itemId === 'plan-turista-premium') updates.purchased_plan_turista_premium = true;
        if (itemId === 'plan-turista-vip') updates.purchased_plan_turista_vip = true;
      });

      // Synchronize with database
      await updateDoc(userRef, updates);
      
      toast.success("¡Pago completado con éxito! Contenido desbloqueado.");
      setCart([]);
      setIsCartOpen(false);
    } catch (err: any) {
      toast.error("Error al procesar pago: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (type: 'curso' | 'libro', visa: 'estudiante' | 'turista') => {
    if (!dbUser) return false;
    if (visa === 'estudiante') {
      if (type === 'curso') return !!dbUser.purchased_curso_estudiante;
      if (type === 'libro') return !!dbUser.purchased_libro_estudiante;
    } else {
      if (type === 'curso') return !!dbUser.purchased_curso_turista;
      if (type === 'libro') return !!dbUser.purchased_libro_turista;
    }
    return false;
  };

  const isPlanPurchased = (planId: string) => {
    if (!dbUser) return false;
    if (planId === 'plan-esencial') return !!dbUser.purchased_plan_esencial;
    if (planId === 'plan-pro') return !!dbUser.purchased_plan_pro;
    if (planId === 'plan-elite') return !!dbUser.purchased_plan_elite;
    if (planId === 'plan-allinclusive') return !!dbUser.purchased_plan_allinclusive;
    if (planId === 'plan-turista-basico') return !!dbUser.purchased_plan_turista_basico;
    if (planId === 'plan-turista-premium') return !!dbUser.purchased_plan_turista_premium;
    if (planId === 'plan-turista-vip') return !!dbUser.purchased_plan_turista_vip;
    return false;
  };

  const renderLockOverlay = (itemId: 'curso-estudiante' | 'libro-estudiante' | 'curso-turista' | 'libro-turista') => {
    const itemInfo = cartItemsConfig[itemId];
    const isAdded = cart.includes(itemId);
    
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-md rounded-3xl border border-white/5 text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md bg-[#0d0d11]/90 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
          
          <Lock className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
          
          <div className="space-y-2">
            <h3 className="text-xl font-normal text-white uppercase tracking-wider">{itemInfo.name}</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Este contenido exclusivo está bloqueado. Adquiere el acceso permanente para comenzar tu preparación consular con nuestros mentores autorizados.
            </p>
          </div>

          <div className="text-2xl font-normal text-purple-400 tracking-tight">
            ${itemInfo.price}.00 USD
          </div>

          <div className="pt-2">
            {isAdded ? (
              <Button
                onClick={() => setIsCartOpen(true)}
                className="w-full h-12 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition-all text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Ver en el carrito
              </Button>
            ) : (
              <Button
                onClick={() => addToCart(itemId)}
                className="w-full h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2"
              >
                Agregar al carrito
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  // Watch Auth State and listen to Firestore user document
  useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNewDisplayName(currentUser.displayName || "");
        
        // Listen to user document in Firestore in real-time
        const userDocRef = doc(db, "users", currentUser.uid);
        unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setDbUser(docSnap.data());
          } else {
            // Document might not exist yet, set an empty object
            setDbUser({});
          }
        }, (err) => {
          console.error("Error listening to user document:", err);
        });
      } else {
        setUser(null);
        setDbUser(null);
        if (unsubDoc) {
          unsubDoc();
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (unsubDoc) {
        unsubDoc();
      }
    };
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

          {/* Right Header Area (Cart + Profile) */}
          <div className="flex items-center gap-4 relative z-50">
            
            {/* Shopping Cart Button */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative w-9 h-9 rounded-full bg-white/5 border border-white/20 hover:border-purple-500/50 flex items-center justify-center cursor-pointer transition-colors shadow-inner text-white"
              >
                <ShoppingCart className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              <AnimatePresence>
                {isCartOpen && (
                  <>
                    <div className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setIsCartOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#0d0d11]/95 backdrop-blur-xl border border-white/10 shadow-2xl p-4 z-50 space-y-4"
                    >
                      <div>
                        <p className="text-xs font-normal tracking-widest text-white/40 uppercase mb-2">Carrito de Compras</p>
                        {cart.length === 0 ? (
                          <p className="text-xs text-white/50 py-4 text-center">Tu carrito está vacío</p>
                        ) : (
                          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                            {cart.map((itemId) => {
                              const item = cartItemsConfig[itemId];
                              if (!item) return null;
                              return (
                                <div key={itemId} className="flex justify-between items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                                  <div className="min-w-0">
                                    <p className="text-xs font-normal truncate text-white">{item.name}</p>
                                    <p className="text-[10px] text-purple-400 font-medium">${item.price}.00 USD</p>
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(itemId)}
                                    className="text-[10px] text-red-400 hover:text-red-300 uppercase tracking-wider font-semibold shrink-0"
                                  >
                                    Quitar
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {cart.length > 0 && (
                        <>
                          <div className="border-t border-white/5" />
                          <div className="flex justify-between items-center px-1">
                            <span className="text-xs text-white/50 uppercase tracking-wider">Total</span>
                            <span className="text-sm font-semibold text-white">
                              ${cart.reduce((total, itemId) => total + (cartItemsConfig[itemId]?.price || 0), 0)}.00 USD
                            </span>
                          </div>
                          <Button
                            onClick={handleCheckout}
                            className="w-full h-11 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2"
                          >
                            Realizar Pago
                          </Button>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User profile dropdown button */}
            <div className="relative">
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
                    <div className="fixed inset-0 z-45 pointer-events-auto" onClick={() => setIsDropdownOpen(false)} />
                    
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
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">
                    Elige tu Plan Ideal
                  </h2>
                  <p className="text-sm text-white/50">
                    {activeTopSection === 'visa-estudiante' 
                      ? "Integramos admisión universitaria y preparación consular estratégica en un solo lugar." 
                      : "Te preparamos con éxito para tu cita consular con planes diseñados para tu viaje turístico."}
                  </p>
                </div>

                {activeTopSection === 'visa-estudiante' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch w-full">
                    {studentPlans.map((plan, index) => (
                      <div key={index} className="relative group w-full flex flex-col h-full">
                        {/* Glow Effect Background */}
                        <div className="absolute -inset-1.5 bg-white/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Card Content */}
                        <div className={`relative flex-1 bg-[#0d0d11]/80 border rounded-[2rem] p-6 flex flex-col overflow-hidden transition-all duration-300 ${plan.highlight ? 'border-purple-500/50 ring-1 ring-purple-500/30 shadow-2xl shadow-purple-500/5 z-10' : 'border-white/5 hover:border-white/10 shadow-2xl hover:bg-[#0f0f15]'}`}>
                          
                          {/* Visual Accent */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] blur-2xl" />

                          {/* Discount Badge */}
                          {plan.discount && (
                            <div className="absolute top-4 right-4 bg-purple-950/80 text-purple-300 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border border-purple-500/30">
                              {plan.discount}
                            </div>
                          )}

                          {/* Recommended Badge */}
                          {plan.highlight && (
                            <div className="absolute top-0 right-1/2 translate-x-1/2 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] text-white text-[9px] font-semibold uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-lg z-20">
                              MÁS POPULAR
                            </div>
                          )}

                          <div className="flex flex-col items-center text-center mt-6 mb-6">
                            <h3 className="text-md font-semibold text-white tracking-wider mb-2">
                              {plan.name}
                            </h3>
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-white/40 line-through text-xs font-normal">
                                {plan.originalPrice}
                              </span>
                              <span className="text-3xl font-normal text-white tracking-tight pt-0.5">
                                {plan.price}
                              </span>
                            </div>
                            <p className="text-white/50 text-xs font-light mt-3 leading-relaxed">
                              {plan.description}
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-3 mt-auto mb-6 w-full">
                            {isPlanPurchased(plan.id) ? (
                              <Button
                                disabled
                                className="w-full h-11 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-normal tracking-widest uppercase cursor-default"
                              >
                                Plan Adquirido
                              </Button>
                            ) : cart.includes(plan.id) ? (
                              <Button
                                onClick={() => setIsCartOpen(true)}
                                className="w-full h-11 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Ver en carrito
                              </Button>
                            ) : (
                              <Button
                                onClick={() => addToCart(plan.id)}
                                className="w-full h-11 rounded-full bg-transparent border border-white/20 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
                              >
                                Añadir al carrito
                              </Button>
                            )}
                          </div>

                          <div className="space-y-4 flex-1 border-t border-white/5 pt-5">
                            <p className="text-white/30 font-normal text-[10px] uppercase tracking-widest mb-2 text-center">
                              LO QUE INCLUYE:
                            </p>
                            <ul className="space-y-3">
                              {plan.features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                  <li key={i} className="flex items-start gap-2 text-white/70 hover:text-white transition-colors cursor-default leading-relaxed">
                                    <Icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" strokeWidth={2} />
                                    <span className="text-xs font-light text-white/80">
                                      {feature.name}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch w-full">
                    {touristPlans.map((plan, index) => (
                      <div key={index} className="relative group w-full flex flex-col h-full">
                        {/* Glow Effect Background */}
                        <div className="absolute -inset-1.5 bg-white/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Card Content */}
                        <div className={`relative flex-1 bg-[#0d0d11]/80 border rounded-[2rem] p-6 flex flex-col overflow-hidden transition-all duration-300 ${plan.highlight ? 'border-purple-500/50 ring-1 ring-purple-500/30 shadow-2xl shadow-purple-500/5 z-10' : 'border-white/5 hover:border-white/10 shadow-2xl hover:bg-[#0f0f15]'}`}>
                          
                          {/* Visual Accent */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] blur-2xl" />

                          {/* Discount Badge */}
                          {plan.discount && (
                            <div className="absolute top-4 right-4 bg-purple-950/80 text-purple-300 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border border-purple-500/30">
                              {plan.discount}
                            </div>
                          )}

                          {/* Recommended Badge */}
                          {plan.highlight && (
                            <div className="absolute top-0 right-1/2 translate-x-1/2 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] text-white text-[9px] font-semibold uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-lg z-20">
                              MÁS POPULAR
                            </div>
                          )}

                          <div className="flex flex-col items-center text-center mt-6 mb-6">
                            <h3 className="text-md font-semibold text-white tracking-wider mb-2">
                              {plan.name}
                            </h3>
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-white/40 line-through text-xs font-normal">
                                {plan.originalPrice}
                              </span>
                              <span className="text-3xl font-normal text-white tracking-tight pt-0.5">
                                {plan.price}
                              </span>
                            </div>
                            <p className="text-white/50 text-xs font-light mt-3 leading-relaxed">
                              {plan.description}
                            </p>
                          </div>

                          <div className="flex flex-col items-center gap-3 mt-auto mb-6 w-full">
                            {isPlanPurchased(plan.id) ? (
                              <Button
                                disabled
                                className="w-full h-11 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-normal tracking-widest uppercase cursor-default"
                              >
                                Plan Adquirido
                              </Button>
                            ) : cart.includes(plan.id) ? (
                              <Button
                                onClick={() => setIsCartOpen(true)}
                                className="w-full h-11 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Ver en carrito
                              </Button>
                            ) : (
                              <Button
                                onClick={() => addToCart(plan.id)}
                                className="w-full h-11 rounded-full bg-transparent border border-white/20 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
                              >
                                Añadir al carrito
                              </Button>
                            )}
                          </div>

                          <div className="space-y-4 flex-1 border-t border-white/5 pt-5">
                            <p className="text-white/30 font-normal text-[10px] uppercase tracking-widest mb-2 text-center">
                              LO QUE INCLUYE:
                            </p>
                            <ul className="space-y-3">
                              {plan.features.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                  <li key={i} className="flex items-start gap-2 text-white/70 hover:text-white transition-colors cursor-default leading-relaxed">
                                    <Icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" strokeWidth={2} />
                                    <span className="text-xs font-light text-white/80">
                                      {feature.name}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <h2 className="text-2xl md:text-3xl font-normal tracking-tight">
                    {activeTopSection === 'visa-estudiante' ? "OBTÉN TU VISA DE ESTUDIANTE EN 30 DÍAS" : "Mi Curso de Preparación"}
                  </h2>
                  <p className="text-sm text-white/50">Capacítate con nuestros videocursos prácticos dictados por mentores autorizados.</p>
                </div>

                <div className="relative min-h-[450px]">
                  {!isUnlocked('curso', activeTopSection === 'visa-estudiante' ? 'estudiante' : 'turista') && 
                    renderLockOverlay(activeTopSection === 'visa-estudiante' ? 'curso-estudiante' : 'curso-turista')}

                  <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${!isUnlocked('curso', activeTopSection === 'visa-estudiante' ? 'estudiante' : 'turista') ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
                  {/* Video Player or Mockup */}
                  <div className="lg:col-span-2 bg-[#0d0d11] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
                    {activeTopSection === 'visa-estudiante' ? (
                      <div className="aspect-video bg-zinc-950 w-full relative flex items-center justify-center border-b border-white/5">
                        <video
                          key={studentModules[activeStudentStep].videoUrl}
                          src={studentModules[activeStudentStep].videoUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      touristModules[activeTouristStep].videoUrl ? (
                        <div className="aspect-video bg-zinc-950 w-full relative flex items-center justify-center border-b border-white/5">
                          <video
                            key={touristModules[activeTouristStep].videoUrl}
                            src={touristModules[activeTouristStep].videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-zinc-950 w-full relative flex items-center justify-center border-b border-white/5 group">
                          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/0 transition-all pointer-events-none" />
                          <Video className="w-16 h-16 text-white/40 group-hover:text-white transition-all cursor-pointer" />
                          <span className="absolute bottom-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur text-[10px] font-normal tracking-wider text-white/80">Vista previa del curso</span>
                        </div>
                      )
                    )}
                    <div className="p-6 space-y-2">
                      <h3 className="text-lg font-normal">
                        {activeTopSection === 'visa-estudiante' 
                          ? studentModules[activeStudentStep].title 
                          : touristModules[activeTouristStep].title}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed">
                        {activeTopSection === 'visa-estudiante'
                          ? studentModules[activeStudentStep].description
                          : touristModules[activeTouristStep].description}
                      </p>
                    </div>
                  </div>

                  {/* Modules list */}
                  <div className="bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4">
                    <h3 className="text-md font-normal tracking-wide border-b border-white/5 pb-2">Módulos del Curso</h3>
                    
                    <div className="space-y-2 overflow-y-auto max-h-[350px] pr-2 no-scrollbar">
                      {activeTopSection === 'visa-estudiante' ? (
                        studentModules.map((mod, index) => {
                          const isActive = activeStudentStep === index;
                          return (
                            <div
                              key={index}
                              onClick={() => setActiveStudentStep(index)}
                              className={`p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer group ${
                                isActive 
                                  ? "bg-purple-500/10 border border-purple-500/20" 
                                  : "hover:bg-white/5 border border-transparent"
                              }`}
                            >
                              <span className={`text-xs ${isActive ? "font-normal text-purple-400" : "text-white/80 group-hover:text-white"}`}>
                                {mod.title}
                              </span>
                              {isActive && (
                                <span className="text-[10px] font-normal text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded uppercase">
                                  Viendo
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        touristModules.map((mod, index) => {
                          const isActive = activeTouristStep === index;
                          return (
                            <div
                              key={index}
                              onClick={() => setActiveTouristStep(index)}
                              className={`p-3 rounded-2xl transition-all flex items-center justify-between cursor-pointer group ${
                                isActive 
                                  ? "bg-purple-500/10 border border-purple-500/20" 
                                  : "hover:bg-white/5 border border-transparent"
                              }`}
                            >
                              <span className={`text-xs ${isActive ? "font-normal text-purple-400" : "text-white/80 group-hover:text-white"}`}>
                                {mod.title}
                              </span>
                              {isActive && (
                                <span className="text-[10px] font-normal text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded uppercase">
                                  Viendo
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
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

                <div className="relative min-h-[350px]">
                  {!isUnlocked('libro', activeTopSection === 'visa-estudiante' ? 'estudiante' : 'turista') && 
                    renderLockOverlay(activeTopSection === 'visa-estudiante' ? 'libro-estudiante' : 'libro-turista')}

                  <div className={`bg-[#0d0d11]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 w-full font-sans ${!isUnlocked('libro', activeTopSection === 'visa-estudiante' ? 'estudiante' : 'turista') ? 'filter blur-sm select-none pointer-events-none' : ''}`}>
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
                      <a
                        href="https://hotmart.s3.amazonaws.com/product_contents/983dc68d-226b-49b9-b21d-8690a0e1781c/Libro%20Oficial%20Udreamms%202025.pdf?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIAlyHIes8td8SftGgCGD7a%2Fg6F7O75p935aSUeOFQqosAiEAtudMlgXKWth5wfHOvHfm%2BR0SXymggImEyeFI5AL9pNMqigUIcBADGgwwOTYzNTI1NjM4NzMiDDw9pm%2FUI%2B7JksJKGSrnBNxgSzENiekiJ%2Fzaoynv%2BfOsXHClS%2Fs4U7FeMwIcYd%2FQe%2BRRZ3u6JW%2BG6W%2BPAxFjEOJYDg3LF3P%2FfVdnq9OrJBlJt7eHi6z1MKbujl0ueuyg4%2FYL5xlCrDxeEBnqLlnBCSsTbOLjqzpIqP5FAePZqq5Oh7vcMxQHFqb4BE2dgnvAXw9p8J4dczy5bIqNGKIbpB1i%2FgTEf7FZ95woBgVx%2BvcGCiuS6aaE5iqYB9jNuql%2B%2Fa6nXowLL0Gl%2Fy2IMjhJcMS9iCrVr6Ayq%2FhJondfRBOFU1ieG3t8aqIkB%2FBjMggn%2B1ZpmzNuRj0mf8MZoTyt3wKYju7mE1a6IyfQyTfKxgCL%2FkRIGDY4THgOd7Ayng6yYlBpklAfIer20Snb%2BXP2pRGpIASstku7UmzDXKm8dKQoxdbyTkh3m5f9UVdgJTgvh4V%2FMPFaZJXQTZSKE71zFw7tXKmvog7Flzw2y9T0xNUsPL12bKZ1J30mSUDza6mQSb8RIiB8EdjqwwcYHWqqkYOjycz6ryydqjsf3%2Bi9Ww9jwwCZmz3lna7dvYy8%2Fx3xT940rQa9RwyDDjseeBFD973Z6ajTXLbhx8wbsXJyHOJnMpGf0V26BojuPlrlhVLCdT2YwDB7a0TxWd0O4hMFJqvgBn8Mp8D%2BnWCRzymHlbYvCZDgQgL8MwWT4Hj4rlzfYqJCji8u4jNQzIZhy6uqQe9eK9tZRCzjtG6piNmouuDKlx11CDFbu4iIZ%2FDuvIVyxLha%2Bc7LrnV9rqL2obhhFPKWLGdZLYJmkId5JbxBmS6woVHd%2BUgvCUt%2FCQWGjeiN8WP0HjmjDTD%2FxovRBjqZAejmeGz9ad0%2BRtJTPOTTeRWldUEhw8gnel1%2F72qsMwoAVUhOuhnfpxDtaJczmKhuPeWFkkPMJpDmi2H%2BkEYfM%2FfPgmwRIv%2FTx30m%2F%2BIqsr5zFS4KqMz%2FkOyKNaTXIkIuv%2Bz1WUVYvaA2gvgKRtnJUluBOYyPEUXo4yQZqMQNf6rtMqY03AoAN%2BlqNfrYAeQbjZnUExsLZ6RWfQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260605T150422Z&X-Amz-SignedHeaders=host&X-Amz-Expires=14400&X-Amz-Credential=ASIARM3YPOKQ5T63WM3E%2F20260605%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=84eafd387fce678c72e2dd8b19af547596d0244aba76eec203605e1b8174e19b"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase px-8"
                      >
                        Descargar Libro
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
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
