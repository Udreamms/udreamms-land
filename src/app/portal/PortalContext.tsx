'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import {
  CheckCircle2,
  School,
  FileText,
  MessageSquare,
  Plane,
  Car,
  CreditCard,
  Home,
  Users,
  Languages,
  Video,
  Map,
  Calendar,
  Hotel,
  ShoppingBag,
  Star
} from "lucide-react";
import { BillingData } from "@/components/payments/BillingForm";

// Configurations and Constants
export const studentModules = [
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

export const touristModules = [
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
    description: "Cómo demostrar tus pruebas de solvencia económica y empleo estable.",
    videoUrl: ""
  },
  {
    title: "5. Simulacro de Entrevista y Casos Especiales",
    description: "Preguntas frecuentes del cónsul y consejos para responder correctamente.",
    videoUrl: ""
  }
];

export const cartItemsConfig: Record<string, { name: string; price: number; type: 'curso' | 'libro' | 'plan'; visa: 'estudiante' | 'turista' }> = {
  'curso-estudiante': { name: "Master class express - Visa de Estudiante F-1", price: 9.99, type: 'curso', visa: 'estudiante' },
  'libro-estudiante': { name: "Libro Digital - Visa de Estudiante F-1", price: 29.99, type: 'libro', visa: 'estudiante' },
  'curso-turista': { name: "Master class express - Visa de Turista B-2", price: 9.99, type: 'curso', visa: 'turista' },
  'libro-turista': { name: "Libro Digital - Visa de Turista B-2", price: 29.99, type: 'libro', visa: 'turista' },
  'proceso-estudiante': { name: "Asesoría Consular - Visa de Estudiante F-1", price: 380, type: 'plan', visa: 'estudiante' },
  'proceso-turista': { name: "Asesoría Consular - Visa de Turista B-2", price: 380, type: 'plan', visa: 'turista' },
  'plan-esencial': { name: "Plan 1: Esencial - F-1", price: 380, type: 'plan', visa: 'estudiante' },
  'plan-pro': { name: "Plan 2: Pro - F-1", price: 550, type: 'plan', visa: 'estudiante' },
  'plan-elite': { name: "Plan 3: Elite - F-1", price: 2500, type: 'plan', visa: 'estudiante' },
  'plan-allinclusive': { name: "Plan 4: All-Inclusive - F-1", price: 10000, type: 'plan', visa: 'estudiante' },
  'plan-turista-basico': { name: "Plan 1: Turista Básico - B-2", price: 380, type: 'plan', visa: 'turista' },
  'plan-turista-premium': { name: "Plan 2: Turista Premium - B-2", price: 3500, type: 'plan', visa: 'turista' },
  'plan-turista-vip': { name: "Plan 3: Experiencia VIP - B-2", price: 4990, type: 'plan', visa: 'turista' },
};

export const studentPlans = [
  {
    id: "plan-esencial",
    name: "PLAN 1: ESENCIAL",
    price: 380,
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
    price: 550,
    originalPrice: "$1,100",
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
    price: 2500,
    originalPrice: "$3,250",
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
    price: 10000,
    originalPrice: "$13,000",
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

export const touristPlans = [
  {
    id: "plan-turista-basico",
    name: "PLAN 1: TURISTA BÁSICO",
    price: 380,
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
    price: 3500,
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
    price: 4990,
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

interface PortalContextType {
  user: any;
  dbUser: any;
  loading: boolean;
  activeTopSection: 'visa-estudiante' | 'visa-turista' | 'experto';
  setActiveTopSection: (val: 'visa-estudiante' | 'visa-turista' | 'experto') => void;
  activeSection: string;
  activeStudentStep: number;
  setActiveStudentStep: (val: number) => void;
  activeTouristStep: number;
  setActiveTouristStep: (val: number) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (val: boolean) => void;
  newDisplayName: string;
  setNewDisplayName: (val: string) => void;
  savingProfile: boolean;
  setSavingProfile: (val: boolean) => void;
  cart: string[];
  setCart: React.Dispatch<React.SetStateAction<string[]>>;
  isCartOpen: boolean;
  setIsCartOpen: (val: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (val: boolean) => void;
  checkoutMethod: 'card' | 'crypto' | null;
  setCheckoutMethod: (val: 'card' | 'crypto' | null) => void;
  checkoutSessionId: string | null;
  setCheckoutSessionId: (val: string | null) => void;
  isProcessingCrypto: boolean;
  setIsProcessingCrypto: (val: boolean) => void;
  billingData: BillingData | null;
  setBillingData: (val: BillingData | null) => void;
  isBillingValid: boolean;
  setIsBillingValid: (val: boolean) => void;
  paymentApproved: boolean;
  setPaymentApproved: (val: boolean) => void;
  approvedOrder: any;
  setApprovedOrder: (val: any) => void;
  unlockCodeInput: string;
  setUnlockCodeInput: (val: string) => void;
  isBypassActive: boolean;
  setIsBypassActive: (val: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (val: boolean) => void;
  hasCryptoDisabled: boolean;

  // Functions
  getItemPrice: (itemId: string, method: 'card' | 'crypto' | null) => number;
  getStripeLink: (items: string[]) => string;
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  completeDatabasePurchase: (itemsToUnlock: string[]) => Promise<void>;
  handleCheckout: () => void;
  handleApplyUnlockCode: () => void;
  handleClearBypass: () => void;
  handleResetDbPurchased: () => void;
  isUnlocked: (type: 'curso' | 'libro' | 'proceso', visa: 'estudiante' | 'turista') => boolean;
  isPlanPurchased: (planId: string) => boolean;
  handleSignOut: () => Promise<void>;
  handleUpdateProfile: (e: React.FormEvent) => Promise<void>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Deduce activeSection from pathname
  const activeSection = pathname.split('/').pop() || 'proceso';

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTopSection, setActiveTopSection] = useState<'visa-estudiante' | 'visa-turista' | 'experto'>('visa-estudiante');
  const [activeStudentStep, setActiveStudentStep] = useState(0);
  const [activeTouristStep, setActiveTouristStep] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [dbUser, setDbUser] = useState<any>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutMethod, setCheckoutMethod] = useState<'card' | 'crypto' | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [isProcessingCrypto, setIsProcessingCrypto] = useState(false);
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isBillingValid, setIsBillingValid] = useState(false);
  const [paymentApproved, setPaymentApproved] = useState(false);
  const [approvedOrder, setApprovedOrder] = useState<any>(null);

  const [unlockCodeInput, setUnlockCodeInput] = useState("");
  const [isBypassActive, setIsBypassActive] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('udreamms_bypass') === '@Udreamms2026';
    }
    return false;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const hasCryptoDisabled = cart.some(itemId => itemId === 'plan-elite' || itemId === 'plan-allinclusive');

  useEffect(() => {
    if (hasCryptoDisabled && checkoutMethod === 'crypto') {
      setCheckoutMethod('card');
    }
  }, [hasCryptoDisabled, checkoutMethod]);

  const createCheckoutSessionId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  };

  const getItemPrice = (itemId: string, method: 'card' | 'crypto' | null) => {
    const basePrice = cartItemsConfig[itemId]?.price || 0;
    if ((itemId === 'plan-esencial' || itemId === 'plan-turista-basico') && method === 'crypto') {
      return 299.99;
    }
    if (itemId === 'plan-pro' && method === 'crypto') {
      return 449.00;
    }
    return basePrice;
  };

  const getStripeLink = (items: string[]) => {
    if (items.includes('plan-esencial') || items.includes('plan-turista-basico')) {
      return "https://buy.stripe.com/00w4gzdoT734alQeqfenS0x";
    }
    if (items.includes('plan-pro')) {
      return "https://buy.stripe.com/cNicN5ckPevw65AdmbenS0A";
    }
    if (items.includes('plan-elite')) {
      return "https://buy.stripe.com/cNidR91GbevweC65TJenS0B";
    }
    if (items.includes('plan-allinclusive')) {
      return "https://buy.stripe.com/fZu7sL1Gb8782To4PFenS0C";
    }
    if (items.includes('plan-turista-premium')) {
      return "https://buy.stripe.com/00wdR93Ojafgdy2ci7enS0y";
    }
    if (items.includes('plan-turista-vip')) {
      return "https://buy.stripe.com/bJe3cvfx1cnoeC6fujenS0z";
    }
    return "https://buy.stripe.com/00w4gzdoT734alQeqfenS0x";
  };

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

  const completeDatabasePurchase = async (itemsToUnlock: string[]) => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const updates: Record<string, boolean> = {};
      
      itemsToUnlock.forEach((itemId) => {
        if (itemId === 'curso-estudiante') updates.purchased_curso_estudiante = true;
        if (itemId === 'libro-estudiante') updates.purchased_libro_estudiante = true;
        if (itemId === 'curso-turista') updates.purchased_curso_turista = true;
        if (itemId === 'libro-turista') updates.purchased_libro_turista = true;
        if (itemId === 'plan-esencial') updates.purchased_plan_esencial = true;
        if (itemId === 'plan-pro') updates.purchased_plan_pro = true;
        if (itemId === 'plan-elite') updates.purchased_plan_elite = true;
        if (itemId === 'plan-allinclusive') updates.purchased_plan_allinclusive = true;
        if (itemId === 'plan-turista-basico') updates.purchased_plan_turista_basico = true;
        if (itemId === 'plan-turista-premium') updates.purchased_plan_turista_premium = true;
        if (itemId === 'plan-turista-vip') updates.purchased_plan_turista_vip = true;
      });

      await updateDoc(userRef, updates);
      toast.success("¡Pago completado con éxito! Contenido desbloqueado.");
      setCart([]);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      toast.error("Error al procesar pago: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutSessionId(createCheckoutSessionId());
    setCheckoutMethod(null);
    setPaymentApproved(false);
    setApprovedOrder(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleApplyUnlockCode = () => {
    if (unlockCodeInput === '@Udreamms2026') {
      localStorage.setItem('udreamms_bypass', '@Udreamms2026');
      setIsBypassActive(true);
      toast.success("Código correcto. Todos los contenidos han sido desbloqueados para pruebas.");
      setUnlockCodeInput("");
    } else {
      toast.error("Código de desbloqueo incorrecto");
    }
  };

  const handleClearBypass = () => {
    localStorage.removeItem('udreamms_bypass');
    setIsBypassActive(false);
    toast.info("Acceso especial desactivado. Los contenidos se han bloqueado de nuevo.");
  };

  const handleResetDbPurchased = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const updates = {
        purchased_curso_estudiante: false,
        purchased_libro_estudiante: false,
        purchased_curso_turista: false,
        purchased_libro_turista: false,
        purchased_plan_esencial: false,
        purchased_plan_pro: false,
        purchased_plan_elite: false,
        purchased_plan_allinclusive: false,
        purchased_plan_turista_basico: false,
        purchased_plan_turista_premium: false,
        purchased_plan_turista_vip: false,
      };
      await updateDoc(userRef, updates);
      localStorage.removeItem('udreamms_bypass');
      setIsBypassActive(false);
      toast.success("Se han restablecido todas las compras en la Base de Datos. Todos los contenidos están bloqueados.");
    } catch (err: any) {
      toast.error("Error al restablecer compras: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const isUnlocked = (type: 'curso' | 'libro' | 'proceso', visa: 'estudiante' | 'turista') => {
    if (isBypassActive) return true;
    if (typeof window !== 'undefined' && localStorage.getItem('udreamms_bypass') === '@Udreamms2026') {
      return true;
    }

    if (!dbUser) return false;
    if (visa === 'estudiante') {
      if (type === 'curso') return !!dbUser.purchased_curso_estudiante;
      if (type === 'libro') return !!dbUser.purchased_libro_estudiante;
      if (type === 'proceso') {
        return (
          !!dbUser.purchased_plan_esencial ||
          !!dbUser.purchased_plan_pro ||
          !!dbUser.purchased_plan_elite ||
          !!dbUser.purchased_plan_allinclusive
        );
      }
    } else {
      if (type === 'curso') return !!dbUser.purchased_curso_turista;
      if (type === 'libro') return !!dbUser.purchased_libro_turista;
      if (type === 'proceso') {
        return (
          !!dbUser.purchased_plan_turista_basico ||
          !!dbUser.purchased_plan_turista_premium ||
          !!dbUser.purchased_plan_turista_vip
        );
      }
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
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(user, { displayName: newDisplayName });
      toast.success("Nombre de perfil actualizado correctamente");
      setIsProfileModalOpen(false);
    } catch (err: any) {
      toast.error("Error al actualizar perfil: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // Watch Auth State and listen to Firestore user document
  useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNewDisplayName(currentUser.displayName || "");
        
        const userDocRef = doc(db, "users", currentUser.uid);
        unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setDbUser(docSnap.data());
          } else {
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

  // Adjust activeTopSection when pathname changes
  useEffect(() => {
    if (pathname.includes('/soporte')) {
      setActiveTopSection('experto');
    }
  }, [pathname]);

  return (
    <PortalContext.Provider
      value={{
        user,
        dbUser,
        loading,
        activeTopSection,
        setActiveTopSection,
        activeSection,
        activeStudentStep,
        setActiveStudentStep,
        activeTouristStep,
        setActiveTouristStep,
        isDropdownOpen,
        setIsDropdownOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        newDisplayName,
        setNewDisplayName,
        savingProfile,
        setSavingProfile,
        cart,
        setCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutMethod,
        setCheckoutMethod,
        checkoutSessionId,
        setCheckoutSessionId,
        isProcessingCrypto,
        setIsProcessingCrypto,
        billingData,
        setBillingData,
        isBillingValid,
        setIsBillingValid,
        paymentApproved,
        setPaymentApproved,
        approvedOrder,
        setApprovedOrder,
        unlockCodeInput,
        setUnlockCodeInput,
        isBypassActive,
        setIsBypassActive,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        hasCryptoDisabled,

        // Functions
        getItemPrice,
        getStripeLink,
        addToCart,
        removeFromCart,
        completeDatabasePurchase,
        handleCheckout,
        handleApplyUnlockCode,
        handleClearBypass,
        handleResetDbPurchased,
        isUnlocked,
        isPlanPurchased,
        handleSignOut,
        handleUpdateProfile
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
