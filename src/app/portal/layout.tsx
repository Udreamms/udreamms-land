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
import {
  calculateStripeGrossTotal,
  calculateStripeProcessingFee,
} from "@/lib/payments/product-catalog";
import PortalSidebar from "./components/PortalSidebar";
import PortalLiveChat from "@/components/portal/PortalLiveChat";
import { toast } from "sonner";

const IS_DEV = process.env.NODE_ENV === 'development';

function PortalLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
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
    addToCart,
    decreaseQuantity,
    getCartItemQuantity,
    getUniqueCartItems,
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
        body: JSON.stringify({
          email,
          userId: user?.uid || '',
          itemIds: cart,
        }),
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
  }, [cart, checkoutEmail, user]);

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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-t-2 border-slate-900 border-r-2 border-r-transparent animate-spin"></div>
          <span className="text-xs tracking-widest text-slate-500 uppercase font-bold">Cargando Portal...</span>
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
  const cardSubtotal = getCartTotal('card');
  const cardProcessingFee = calculateStripeProcessingFee(cardSubtotal);
  const cardGrossTotal = calculateStripeGrossTotal(cardSubtotal);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 flex flex-col relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-slate-200/40 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-1 relative z-10 pt-6 md:pt-8 pb-16 px-4 md:px-8 w-full min-h-screen">
        <PortalSidebar
          activeSection={activeSection}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isLiveChatOpen={isLiveChatOpen}
          onToggleLiveChat={() => setIsLiveChatOpen(prev => !prev)}
        />

        {/* MAIN CONTENT AREA */}
        <div className={`flex-1 min-w-0 w-full transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-24' : 'md:pl-[21.5rem]'
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full min-h-[400px] max-w-7xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

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
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-5xl lg:max-w-6xl shadow-[0_25px_70px_rgba(0,0,0,0.18)] relative z-10 space-y-6 min-h-[680px] sm:min-h-[740px] max-h-[94vh] overflow-y-auto text-slate-900 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">Pasarela de Pago Segura</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal">Sigue los pasos para completar tu orden.</p>
                </div>
                {!isProcessingCrypto && !paymentApproved && (
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-900 uppercase tracking-wider font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cerrar ✕
                  </button>
                )}
              </div>

              {/* Success Screen */}
              {paymentApproved && approvedOrder ? (
                <div className="text-center py-8 space-y-6 my-auto">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-pulse" />
                  <div className="space-y-2">
                    <h4 className="text-2xl font-semibold text-slate-900">¡Pago aprobado con éxito!</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Tu transacción fue confirmada y tus servicios han sido desbloqueados en la plataforma.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">ID de Orden</p>
                    <p className="text-xs font-mono text-slate-800 break-all">{approvedOrder.requestId}</p>
                    {approvedOrder.email && (
                      <p className="text-xs text-slate-500">
                        Comprobante enviado a: <span className="text-slate-800 font-semibold">{approvedOrder.email}</span>
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
                    className="h-11 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Ir a mi proceso
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1">
                  
                    {/* Left Column: Cart Overview & Method Selector & Contact Info if Crypto */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Resumen del Carrito</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-1 no-scrollbar">
                          {getUniqueCartItems().map((itemId) => {
                            const item = cartItemsConfig[itemId];
                            if (!item) return null;
                            const qty = getCartItemQuantity(itemId);
                            return (
                              <div key={itemId} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                                <div className="space-y-0.5">
                                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">{item.name}</p>
                                  <p className="text-xs text-blue-600 font-semibold">
                                    ${(getItemPrice(itemId, checkoutMethod) * qty).toFixed(2)} USD
                                    {qty > 1 && <span className="text-slate-400 font-normal ml-1">(${getItemPrice(itemId, checkoutMethod).toFixed(2)} c/u)</span>}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-2 py-0.5 shadow-2xs">
                                  <button
                                    onClick={() => decreaseQuantity(itemId)}
                                    className="text-slate-600 hover:text-black font-semibold text-xs px-1 cursor-pointer transition-colors"
                                    title="Restar una unidad"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-semibold text-slate-900 min-w-[14px] text-center">
                                    {qty}
                                  </span>
                                  <button
                                    onClick={() => addToCart(itemId)}
                                    className="text-slate-600 hover:text-black font-semibold text-xs px-1 cursor-pointer transition-colors"
                                    title="Sumar una unidad"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-2 border-t border-slate-100 space-y-1.5 px-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              {checkoutMethod === 'card' ? 'Subtotal neto' : 'Total a pagar'}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              ${(checkoutMethod === 'crypto' ? getCartTotal('crypto') : cardSubtotal).toFixed(2)} USD
                            </span>
                          </div>
                          {checkoutMethod === 'card' && (
                            <>
                              <div className="flex justify-between items-center text-slate-500 text-xs">
                                <span>Comisión pasarela Stripe (~3.5% + $0.30)</span>
                                <span className="font-medium text-slate-700">
                                  +${cardProcessingFee.toFixed(2)} USD
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Total a pagar</span>
                                <span className="text-lg font-bold text-blue-600">
                                  ${cardGrossTotal.toFixed(2)} USD
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Método de Pago</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            onClick={() => !hasCryptoDisabled && setCheckoutMethod('crypto')}
                            disabled={hasCryptoDisabled}
                            className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                              hasCryptoDisabled
                                ? 'opacity-40 cursor-not-allowed border-slate-100 bg-slate-50'
                                : checkoutMethod === 'crypto'
                                ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <Wallet className={`w-4 h-4 ${hasCryptoDisabled ? 'text-slate-300' : 'text-blue-600'}`} />
                              <span className={`text-xs sm:text-sm font-semibold ${hasCryptoDisabled ? 'text-slate-400' : 'text-slate-900'}`}>Pagar con Stablecoin</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                              {hasCryptoDisabled ? "No disponible para este plan" : "USDC, USDT, SOL, LXR"}
                            </p>
                          </button>

                          <button
                            onClick={() => setCheckoutMethod('card')}
                            className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                              checkoutMethod === 'card'
                                ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
                                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-blue-600" />
                              <span className="text-xs sm:text-sm font-semibold text-slate-900">Pagar con Tarjeta</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-normal">Visa, Mastercard, Amex</p>
                          </button>
                        </div>
                      </div>

                      {/* When Crypto is selected, place Contact & Billing Address right here */}
                      {checkoutMethod === 'crypto' && (
                        <div className="pt-2 border-t border-slate-100">
                          <BillingForm
                            initialEmail={user.email || ''}
                            onDataChange={setBillingData}
                            onValidChange={setIsBillingValid}
                            theme="light"
                            compact={true}
                            showAddress={true}
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Column: Dynamic Payment Steps & Forms */}
                    <div className="border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 min-h-[460px] flex flex-col justify-start">
                      {!checkoutMethod ? (
                        <div className="flex flex-col items-center justify-center h-full my-auto text-center py-16 text-slate-400 space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-slate-400" />
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 font-normal max-w-xs">Selecciona un método de pago a la izquierda para continuar.</p>
                        </div>
                      ) : checkoutMethod === 'crypto' ? (
                        <div className="space-y-3">
                          {checkoutSessionId && (
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
                              accent="blue"
                              compact={true}
                              theme="light"
                              userId={user?.uid}
                            />
                          )}
                        </div>
                      ) : (
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900">Pago Seguro con Tarjeta vía Stripe</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            Haz clic en el botón inferior para ser redirigido a la pasarela oficial encriptada de Stripe y completar tu transacción.
                          </p>
                        </div>

                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
                          <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Instrucciones</p>
                          <div className="space-y-2 text-xs text-slate-600 font-normal">
                            <p className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px]">1</span>
                              <span>Presiona <strong>"Pagar en Stripe"</strong> abajo.</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px]">2</span>
                              <span>Completa los datos de tu tarjeta de crédito o débito.</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-[10px]">3</span>
                              <span>Al finalizar, tu servicio se desbloquea automáticamente en el portal.</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-2">
                          <Button
                            onClick={() => void handleStartStripeCheckout()}
                            disabled={stripeRedirecting || cart.length === 0}
                            className="w-full h-11 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Lock className="w-4 h-4 text-white" />
                            {stripeRedirecting ? 'Redirigiendo a Stripe...' : `Pagar $${cardGrossTotal.toFixed(2)} USD en Stripe`}
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

      {/* CLIENT LIVE CHAT DRAWER */}
      <PortalLiveChat
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        userEmail={user?.email || ''}
        userName={user?.displayName || user?.email || 'Cliente'}
      />

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
