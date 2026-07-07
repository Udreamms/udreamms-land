'use client';

import React, { useEffect, useCallback, useRef, useState, Suspense } from "react";
import { PortalProvider, usePortal, cartItemsConfig, studentPlans, touristPlans } from "./PortalContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Settings,
  LogOut,
  Calendar,
  ArrowRight,
  FileText,
  Video,
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
  ShoppingBag,
  Zap,
  ShieldCheck,
  Wallet,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BillingForm from "@/components/payments/BillingForm";
import CryptoPaymentTabs from "@/components/payments/CryptoPaymentTabs";
import {
  clearStripeCheckoutIntent,
  readStripeCheckoutIntent,
  saveStripeCheckoutIntent,
} from "@/lib/payments/portal-stripe-checkout";
import PortalSidebar from "./components/PortalSidebar";
import { toast } from "sonner";

const IS_DEV = process.env.NODE_ENV === 'development';

function PortalLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    dbUser,
    loading,
    activeTopSection,
    setActiveTopSection,
    activeSection,
    isDropdownOpen,
    setIsDropdownOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    newDisplayName,
    setNewDisplayName,
    savingProfile,
    cart,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutMethod,
    setCheckoutMethod,
    checkoutSessionId,
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
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    hasCryptoDisabled,

    // Functions
    getItemPrice,
    getCartTotal,
    removeFromCart,
    completeDatabasePurchase,
    handleCheckout,
    handleApplyUnlockCode,
    handleClearBypass,
    handleResetDbPurchased,
    handleSignOut,
    handleUpdateProfile
  } = usePortal();

  const checkoutEmail = user?.email || billingData?.email || '';
  const stripeReturnHandled = useRef(false);
  const [stripeRedirecting, setStripeRedirecting] = useState(false);

  const handleStartStripeCheckout = useCallback(async () => {
    if (cart.length === 0) {
      toast.error('Tu carrito está vacío.');
      return;
    }
    const email = checkoutEmail;
    if (!email?.includes('@')) {
      toast.error('Necesitamos tu correo para procesar el pago.');
      return;
    }

    setStripeRedirecting(true);
    try {
      saveStripeCheckoutIntent(cart, email);
      const response = await fetch('/api/payments/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, itemIds: cart }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo iniciar el pago en Stripe.');
      }
      window.location.href = data.url;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar el pago.';
      toast.error(message);
      setStripeRedirecting(false);
    }
  }, [cart, checkoutEmail]);

  useEffect(() => {
    if (loading || !user || stripeReturnHandled.current) {
      return;
    }

    const stripeStatus = searchParams.get('stripe');
    const sessionId = searchParams.get('session_id');
    if (stripeStatus !== 'success' || !sessionId) {
      return;
    }

    stripeReturnHandled.current = true;

    void (async () => {
      setIsCheckoutOpen(true);
      setCheckoutMethod('card');
      try {
        const response = await fetch('/api/payments/stripe/confirm-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || data.error || 'No se pudo confirmar el pago.');
        }

        const itemIds = data.itemIds?.length
          ? data.itemIds
          : readStripeCheckoutIntent()?.itemIds || cart;

        setPaymentApproved(true);
        setApprovedOrder({
          requestId: sessionId,
          email: data.email || checkoutEmail,
        });
        await completeDatabasePurchase(itemIds);
        clearStripeCheckoutIntent();
        toast.success('¡Pago confirmado! Tus servicios ya están desbloqueados.');
        router.replace('/portal/proceso');
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'No se pudo confirmar el pago.';
        toast.error(message);
        router.replace('/portal');
      }
    })();
  }, [
    loading,
    searchParams,
    user,
    cart,
    checkoutEmail,
    router,
    setIsCheckoutOpen,
    setCheckoutMethod,
    setPaymentApproved,
    setApprovedOrder,
    completeDatabasePurchase,
  ]);

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

  const userInitials = user.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email ? user.email.slice(0, 2).toUpperCase() : "UD";

  const cryptoCheckoutPlan = cart.length === 1 ? cart[0] : 'cart';
  const checkoutTotal = getCartTotal(checkoutMethod);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/20 flex flex-col relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-white/10 h-16 w-full shrink-0">
        <div className="w-full px-4 md:px-8 h-full flex items-center justify-between">
          
          {/* Hamburger Menu & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 -ml-2 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors cursor-pointer hidden md:flex items-center justify-center"
              title="Colapsar Menú"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-7 h-7 relative">
                <img src="/icons/new-icon-udreamms.png" alt="Udreamms" className="object-contain w-full h-full drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
              </div>
              <span className="text-lg font-normal tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Udreamms</span>
            </div>
          </div>

          {/* Menus (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTopSection('visa-estudiante');
                router.push('/portal/visa-estudiante');
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
                router.push('/portal/visa-turista');
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
                router.push('/portal/soporte');
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
                                    <p className="text-[10px] text-purple-400 font-medium">${item.price.toFixed(2)} USD</p>
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
                              ${checkoutTotal.toFixed(2)} USD
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

      {/* MOBILE NAV BAR */}
      <div className="md:hidden w-full bg-[#070709] border-b border-white/5 overflow-x-auto no-scrollbar shrink-0 flex items-center py-2 px-4 gap-2 z-30">
        <button
          onClick={() => {
            setActiveTopSection('visa-estudiante');
            router.push('/portal/visa-estudiante');
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
            router.push('/portal/visa-turista');
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
            router.push('/portal/soporte');
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
          
          {(activeTopSection === 'visa-estudiante' || activeTopSection === 'visa-turista') && (
            <PortalSidebar
              activeTopSection={activeTopSection}
              activeSection={activeSection}
              isSidebarCollapsed={isSidebarCollapsed}
            />
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
                {children}
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

              <div className="space-y-4">
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

                {IS_DEV && (
                <div className="border-t border-white/5 pt-4 space-y-4">
                  <p className="text-[10px] text-amber-400/80 uppercase tracking-widest">Herramientas de desarrollo</p>
                  <div className="space-y-1">
                    <label className="text-[10px] font-normal text-white/40 uppercase tracking-wider block">Código de Desbloqueo Especial</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="Ingresa el código"
                        value={unlockCodeInput}
                        onChange={(e) => setUnlockCodeInput(e.target.value)}
                        className="flex-1 bg-white/5 border-white/10 focus:border-purple-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full h-11 text-white text-xs tracking-wide px-6 text-center transition-all"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyUnlockCode}
                        className="h-11 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] px-4 text-xs font-normal uppercase transition-all duration-300 hover:scale-105 active:scale-95"
                      >
                        Aplicar
                      </Button>
                    </div>
                  </div>
                  {isBypassActive ? (
                    <div className="flex flex-col items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                      <p className="text-[10px] text-purple-300 font-semibold text-center">Acceso especial activado</p>
                      <button
                        type="button"
                        onClick={handleClearBypass}
                        className="text-[10px] text-red-400 hover:text-red-300 underline font-normal transition-colors"
                      >
                        Desactivar acceso especial
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleResetDbPurchased}
                      disabled={savingProfile}
                      className="w-full h-11 rounded-full bg-red-950/20 border border-red-500/30 text-red-400 hover:bg-red-950/40 text-xs font-normal uppercase transition-all duration-300"
                    >
                      {savingProfile ? "Restableciendo..." : "Restablecer compras en DB"}
                    </Button>
                  )}

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-[10px] text-white/50 text-left font-mono">
                    <p className="font-semibold text-purple-400 uppercase tracking-widest text-[9px] mb-1">Estado de permisos</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/70 font-semibold mb-0.5 border-b border-white/5 pb-0.5">F-1</p>
                        <p>Curso: {dbUser?.purchased_curso_estudiante ? "Libre" : "Bloqueado"}</p>
                        <p>Libro: {dbUser?.purchased_libro_estudiante ? "Libre" : "Bloqueado"}</p>
                        <p>Proceso: {dbUser?.purchased_plan_esencial || dbUser?.purchased_plan_pro || dbUser?.purchased_plan_elite || dbUser?.purchased_plan_allinclusive ? "Libre" : "Bloqueado"}</p>
                      </div>
                      <div>
                        <p className="text-white/70 font-semibold mb-0.5 border-b border-white/5 pb-0.5">B-2</p>
                        <p>Curso: {dbUser?.purchased_curso_turista ? "Libre" : "Bloqueado"}</p>
                        <p>Libro: {dbUser?.purchased_libro_turista ? "Libre" : "Bloqueado"}</p>
                        <p>Proceso: {dbUser?.purchased_plan_turista_basico || dbUser?.purchased_plan_turista_premium || dbUser?.purchased_plan_turista_vip ? "Libre" : "Bloqueado"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT PORTAL MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => {
                if (!isProcessingCrypto && !paymentApproved) {
                  setIsCheckoutOpen(false);
                }
              }}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#0d0d11] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-4xl shadow-2xl relative z-10 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-xl font-normal text-white">Pasarela de Pago Segura</h3>
                  <p className="text-xs text-white/40">Sigue los pasos para completar tu orden.</p>
                </div>
                {!isProcessingCrypto && !paymentApproved && (
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-xs text-white/40 hover:text-white uppercase tracking-wider font-semibold"
                  >
                    Cerrar
                  </button>
                )}
              </div>

              {/* Success Screen */}
              {paymentApproved && approvedOrder ? (
                <div className="text-center py-8 space-y-6">
                  <CheckCircle2 className="w-16 h-16 text-purple-400 mx-auto animate-pulse" />
                  <div className="space-y-2">
                    <h4 className="text-2xl font-normal text-white">¡Pago aprobado con éxito!</h4>
                    <p className="text-xs text-white/50 max-w-md mx-auto">
                      Tu transacción fue confirmada y tus servicios han sido desbloqueados en la plataforma.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">ID de Orden</p>
                    <p className="text-xs font-mono text-white/80 break-all">{approvedOrder.requestId}</p>
                    {approvedOrder.email && (
                      <p className="text-xs text-white/40">
                        Comprobante enviado a: <span className="text-white/80">{approvedOrder.email}</span>
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setPaymentApproved(false);
                      setApprovedOrder(null);
                      router.push('/portal/proceso');
                    }}
                    className="h-11 px-8 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] text-xs font-normal uppercase"
                  >
                    Ir a mi proceso
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  
                  {/* Left Column: Cart Overview & Method Selector */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[10px] font-normal tracking-widest text-white/40 uppercase">Resumen del Carrito</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {cart.map((itemId) => {
                          const item = cartItemsConfig[itemId];
                          if (!item) return null;
                          return (
                            <div key={itemId} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 border border-white/5">
                              <div>
                                <p className="text-xs font-normal text-white">{item.name}</p>
                                <p className="text-[10px] text-purple-400 font-semibold">${getItemPrice(itemId, checkoutMethod).toFixed(2)} USD</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs text-white/50 uppercase tracking-wider">Total a pagar</span>
                        <span className="text-lg font-semibold text-white">
                          ${cart.reduce((total, itemId) => total + (getItemPrice(itemId, checkoutMethod) || 0), 0).toFixed(2)} USD
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-normal tracking-widest text-white/40 uppercase">Método de Pago</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => !hasCryptoDisabled && setCheckoutMethod('crypto')}
                          disabled={hasCryptoDisabled}
                          className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                            hasCryptoDisabled
                              ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/[0.01]'
                              : checkoutMethod === 'crypto'
                              ? 'border-purple-500 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Wallet className={`w-4 h-4 ${hasCryptoDisabled ? 'text-white/25' : 'text-purple-400'}`} />
                            <span className={`text-xs font-semibold ${hasCryptoDisabled ? 'text-white/40' : 'text-white'}`}>Pagar con Crypto</span>
                          </div>
                          <p className="text-[9px] text-white/50 leading-relaxed font-light">
                            {hasCryptoDisabled ? "No disponible para este plan" : "USDC, USDT, SOL, LXR"}
                          </p>
                        </button>

                        <button
                          onClick={() => setCheckoutMethod('card')}
                          className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                            checkoutMethod === 'card'
                              ? 'border-purple-500 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-semibold text-white">Pagar con Tarjeta</span>
                          </div>
                          <p className="text-[9px] text-white/50 leading-relaxed">Visa, Mastercard, Amex</p>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Payment Steps & Forms */}
                  <div className="border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 min-h-[350px]">
                    {!checkoutMethod ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12 text-white/40 space-y-3">
                        <ShieldCheck className="w-10 h-10 text-white/20" />
                        <p className="text-xs">Selecciona un método de pago a la izquierda para continuar.</p>
                      </div>
                    ) : checkoutMethod === 'crypto' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-white">1. Datos de Contacto</p>
                          <BillingForm initialEmail={user.email || ''} onDataChange={setBillingData} onValidChange={setIsBillingValid} />
                        </div>

                        {checkoutSessionId && (
                          <div className="space-y-2 pt-2">
                            <p className="text-xs font-semibold text-white">2. Escanea y Realiza el Pago</p>
                            <CryptoPaymentTabs
                              plan={cryptoCheckoutPlan}
                              cartItems={cart.length > 1 ? cart : undefined}
                              priceUSD={checkoutTotal}
                              sessionId={checkoutSessionId}
                              billingData={billingData}
                              isBillingValid={isBillingValid}
                              isProcessing={isProcessingCrypto}
                              setIsProcessing={setIsProcessingCrypto}
                              onSuccess={(details) => {
                                setPaymentApproved(true);
                                setApprovedOrder({
                                  requestId: details.requestId,
                                  email: billingData?.email || user.email || '',
                                });
                                completeDatabasePurchase(cart);
                              }}
                              accent="purple"
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-white font-medium">Pago con Tarjeta a través de Stripe</p>
                          <p className="text-xs text-white/50 leading-relaxed">
                            Haz clic en el botón inferior para ser redirigido a la pasarela encriptada oficial de Stripe y realizar tu pago de manera segura.
                          </p>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                          <p className="text-[10px] font-normal tracking-widest text-white/40 uppercase">Instrucciones</p>
                          <div className="space-y-2 text-xs text-white/70">
                            <p>1. Presiona "Pagar en Stripe".</p>
                            <p>2. Completa el pago con el mismo correo de tu cuenta.</p>
                            <p>3. Al regresar, confirmamos automáticamente y desbloqueamos tu acceso.</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                          <Button
                            onClick={() => void handleStartStripeCheckout()}
                            disabled={stripeRedirecting || cart.length === 0}
                            className="w-full h-11 rounded-full bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal uppercase flex items-center justify-center gap-2 text-white"
                          >
                            <Lock className="w-4 h-4" />
                            {stripeRedirecting ? 'Redirigiendo a Stripe...' : `Pagar $${checkoutTotal.toFixed(2)} en Stripe`}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PortalProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
        <PortalLayoutContent>{children}</PortalLayoutContent>
      </Suspense>
    </PortalProvider>
  );
}
