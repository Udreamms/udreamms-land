'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Video,
  Download,
  Home,
  ShoppingBag,
  Menu,
  Headphones,
  ShoppingCart,
  ArrowRight,
  Settings,
  LogOut,
  MessageSquare,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { usePortal, cartItemsConfig } from '../PortalContext';
import { Button } from '@/components/ui/button';

interface PortalSidebarProps {
  activeTopSection?: string;
  activeSection: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar?: () => void;
  isLiveChatOpen?: boolean;
  onToggleLiveChat?: () => void;
}

export default function PortalSidebar({
  activeSection,
  isSidebarCollapsed,
  onToggleSidebar,
  isLiveChatOpen = false,
  onToggleLiveChat,
}: PortalSidebarProps) {
  const [unreadChatCount, setUnreadChatCount] = useState<number>(0);
  const {
    user,
    cart,
    isCartOpen,
    setIsCartOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    setIsProfileModalOpen,
    handleSignOut,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    getCartItemQuantity,
    getUniqueCartItems,
    getCartTotal,
    handleCheckout,
    checkoutMethod,
  } = usePortal();

  // Poll for unread messages from staff
  useEffect(() => {
    if (!user?.email) return;

    const checkUnread = async () => {
      try {
        const res = await fetch(`/api/portal/chat?email=${encodeURIComponent(user.email!)}&viewer=client`);
        if (res.ok) {
          const data = await res.json();
          setUnreadChatCount(data.unreadByClient || 0);
        }
      } catch (e) {
        // silent catch
      }
    };

    checkUnread();
    const interval = setInterval(checkUnread, 8000);
    return () => clearInterval(interval);
  }, [user?.email, isLiveChatOpen]);

  const userInitials = user?.displayName
    ? user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'UD';

  const checkoutTotal = getCartTotal(checkoutMethod);

  const linkClass = (isActive: boolean) =>
    `px-4 py-2.5 md:py-3 text-[10px] md:text-xs tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 flex items-center gap-3 ${
      isSidebarCollapsed ? 'justify-center' : 'justify-start text-left'
    } ${
      isActive
        ? 'text-white bg-slate-900 font-bold shadow-md'
        : 'text-slate-600 hover:text-black hover:bg-slate-100 border border-transparent font-medium'
    }`;

  return (
    <aside
      className={`shrink-0 fixed top-[18px] left-[18px] z-40 flex flex-col justify-between h-[calc(100vh-36px)] bg-white border border-slate-200 rounded-3xl p-3 md:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.06)] text-black overflow-y-auto no-scrollbar transition-all duration-300 ${
        isSidebarCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      <div className="flex flex-col gap-2">
        {/* Header with Udreamms Logo & Hamburger Toggle */}
        {isSidebarCollapsed ? (
          <div className="hidden md:flex flex-col items-center gap-3 mb-4 pb-3 border-b border-slate-100 px-1">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm"
              title="Expandir menú"
            >
              <Menu className="w-4 h-4 shrink-0 text-black" />
            </button>
            <Link href="/" title="Udreamms" className="w-7 h-7 relative cursor-pointer group">
              <img
                src="/icons/new-icon-udreamms.png"
                alt="Udreamms"
                className="object-contain w-full h-full group-hover:scale-110 transition-transform"
              />
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-between mb-4 pb-3 border-b border-slate-100 px-2">
            <Link href="/" className="flex items-center gap-2 cursor-pointer group">
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
            </Link>
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-black border border-slate-200 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-sm shrink-0"
              title="Colapsar menú"
            >
              <Menu className="w-4 h-4 shrink-0 text-black" />
            </button>
          </div>
        )}

        <Link
          href="/portal/proceso"
          title={isSidebarCollapsed ? 'Mi proceso' : undefined}
          className={linkClass(activeSection === 'proceso')}
        >
          <GraduationCap className={`w-4 h-4 shrink-0 ${activeSection === 'proceso' ? 'text-white' : 'text-black'}`} />
          {!isSidebarCollapsed && <span>Mi proceso</span>}
        </Link>

        <Link
          href="/portal/planes"
          title={isSidebarCollapsed ? 'Planes' : undefined}
          className={linkClass(
            activeSection === 'planes' ||
              activeSection === 'visa-estudiante' ||
              activeSection === 'visa-turista'
          )}
        >
          <ShoppingBag className={`w-4 h-4 shrink-0 ${activeSection === 'planes' || activeSection === 'visa-estudiante' || activeSection === 'visa-turista' ? 'text-white' : 'text-black'}`} />
          {!isSidebarCollapsed && <span>Planes</span>}
        </Link>

        <Link
          href="/portal/curso"
          title={isSidebarCollapsed ? 'Master class express' : undefined}
          className={linkClass(activeSection === 'curso')}
        >
          <Video className={`w-4 h-4 shrink-0 ${activeSection === 'curso' ? 'text-white' : 'text-black'}`} />
          {!isSidebarCollapsed && <span>Master class express</span>}
        </Link>

        <Link
          href="/portal/libro"
          title={isSidebarCollapsed ? 'Libro digital' : undefined}
          className={linkClass(activeSection === 'libro')}
        >
          <BookOpen className={`w-4 h-4 shrink-0 ${activeSection === 'libro' ? 'text-white' : 'text-black'}`} />
          {!isSidebarCollapsed && <span>Libro digital</span>}
        </Link>

        <Link
          href="/portal/recursos"
          title={isSidebarCollapsed ? 'Recursos adicionales' : undefined}
          className={linkClass(activeSection === 'recursos')}
        >
          <Download className={`w-4 h-4 shrink-0 ${activeSection === 'recursos' ? 'text-white' : 'text-black'}`} />
          {!isSidebarCollapsed && <span>Recursos adicionales</span>}
        </Link>

        <Link
          href="/portal/soporte"
          title={isSidebarCollapsed ? 'Hablar con un experto' : undefined}
          className={linkClass(activeSection === 'soporte')}
        >
          <Headphones className={`w-4 h-4 shrink-0 ${activeSection === 'soporte' ? 'text-white' : 'text-black'}`} />
          {!isSidebarCollapsed && <span>Hablar con un experto</span>}
        </Link>

        {/* Live Chat with Staff Button */}
        <button
          type="button"
          onClick={onToggleLiveChat}
          title={isSidebarCollapsed ? 'Chat en vivo con Staff' : undefined}
          className={`px-4 py-2.5 md:py-3 text-[10px] md:text-xs tracking-widest md:tracking-wider uppercase rounded-full md:rounded-xl shrink-0 transition-all duration-300 flex items-center gap-3 w-full cursor-pointer text-left ${
            isSidebarCollapsed ? 'justify-center' : 'justify-start'
          } ${
            isLiveChatOpen
              ? 'text-white bg-blue-600 font-bold shadow-md'
              : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 border border-transparent font-medium'
          }`}
        >
          <div className="relative shrink-0 flex items-center justify-center">
            <MessageSquare className={`w-4 h-4 shrink-0 ${isLiveChatOpen ? 'text-white' : 'text-blue-600'}`} />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className="truncate">Chat en vivo</span>
              {unreadChatCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 shadow-xs">
                  {unreadChatCount}
                </span>
              )}
            </div>
          )}
        </button>

        <a
          href="https://www.udreamms.com"
          target="_blank"
          rel="noopener noreferrer"
          title={isSidebarCollapsed ? 'Sitio web' : undefined}
          className={linkClass(false)}
        >
          <Home className="w-4 h-4 shrink-0 text-black" />
          {!isSidebarCollapsed && <span>Sitio web</span>}
        </a>
      </div>

      {/* Bottom Footer Section: Cart & User Account */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col gap-2 relative">
        {/* Shopping Cart Button & Inline Panel */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              if (isSidebarCollapsed) {
                if (cart.length > 0) {
                  handleCheckout();
                } else if (onToggleSidebar) {
                  onToggleSidebar();
                }
              } else {
                setIsCartOpen(!isCartOpen);
              }
            }}
            className={`w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-all duration-200 flex items-center gap-3 cursor-pointer text-black ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            } ${isCartOpen && !isSidebarCollapsed ? 'border-slate-900 ring-1 ring-slate-900/10' : ''}`}
            title="Carrito de Compras"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <ShoppingCart className="w-4 h-4 text-black" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-slate-900 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {cart.length}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-800">
                  Carrito
                </span>
              )}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <span className="bg-slate-900 text-white border border-slate-900 px-2 py-0.5 rounded-full text-[9px] font-bold">
                    {cart.length}
                  </span>
                )}
                <span className="text-[10px] text-slate-400">
                  {isCartOpen ? '▲' : '▼'}
                </span>
              </div>
            )}
          </button>

          {/* Inline Cart Drawer within Sidebar Flow */}
          <AnimatePresence>
            {isCartOpen && !isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden rounded-2xl bg-slate-50 border border-slate-200 p-3.5 space-y-3 shadow-inner text-black"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                    Tu Carrito ({cart.length})
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs px-1.5 py-0.5 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer"
                    title="Cerrar carrito"
                  >
                    ✕
                  </button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">Tu carrito está vacío</p>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-0.5 no-scrollbar">
                    {getUniqueCartItems().map((itemId) => {
                      const item = cartItemsConfig[itemId];
                      if (!item) return null;
                      const qty = getCartItemQuantity(itemId);
                      return (
                        <div
                          key={itemId}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs"
                        >
                          <div className="flex justify-between items-start gap-1.5">
                            <p className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-1">
                              {item.name}
                            </p>
                            <button
                              onClick={() => removeFromCart(itemId)}
                              className="text-[9px] text-slate-400 hover:text-red-500 uppercase tracking-wider font-bold shrink-0 transition-colors cursor-pointer"
                              title="Quitar"
                            >
                              Quitar
                            </button>
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-900">
                              ${(item.price * qty).toFixed(2)} USD
                            </span>

                            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-1.5 py-0.5">
                              <button
                                onClick={() => decreaseQuantity(itemId)}
                                className="text-slate-600 hover:text-black font-bold text-xs px-1 cursor-pointer"
                                title="Restar"
                              >
                                -
                              </button>
                              <span className="text-[10px] font-bold text-slate-900 min-w-[14px] text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => addToCart(itemId)}
                                className="text-slate-600 hover:text-black font-bold text-xs px-1 cursor-pointer"
                                title="Sumar"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-200 space-y-2.5">
                    <div className="flex justify-between items-center px-0.5">
                      <span className="text-[11px] text-slate-600 uppercase tracking-wider font-semibold">Total</span>
                      <span className="text-xs font-bold text-black">
                        ${checkoutTotal.toFixed(2)} USD
                      </span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 text-[11px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer"
                    >
                      <span>Realizar Pago</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Account Profile Button */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full p-2 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 transition-all duration-200 flex items-center gap-3 cursor-pointer text-black ${
                isSidebarCollapsed ? 'justify-center' : 'justify-start'
              }`}
              title={user.displayName || user.email || 'Mi Cuenta'}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 shrink-0 relative flex items-center justify-center bg-slate-900 shadow-sm text-white font-bold">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {userInitials}
                  </span>
                )}
              </div>

              {!isSidebarCollapsed && (
                <div className="min-w-0 text-left flex-1">
                  <p className="text-xs font-bold text-black truncate leading-tight">
                    {user.displayName || 'Usuario Udreamms'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5 font-medium">
                    {user.email}
                  </p>
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setIsDropdownOpen(false)} />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={`absolute z-50 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 space-y-3 text-black ${
                      isSidebarCollapsed ? 'left-full bottom-0 ml-3' : 'left-0 bottom-full mb-3'
                    }`}
                  >
                    <div className="px-1 py-1">
                      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
                        Tu Cuenta
                      </p>
                      <p className="text-sm font-bold truncate text-black">
                        {user.displayName || 'Usuario Udreamms'}
                      </p>
                      <p className="text-xs truncate text-slate-500 font-medium">{user.email}</p>
                    </div>

                    <div className="border-t border-slate-100" />

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="w-full h-10 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3 px-3 text-left text-xs font-semibold text-slate-700 hover:text-black"
                      >
                        <Settings className="w-4 h-4 text-black" />
                        Administrar Perfil
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="w-full h-10 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-3 px-3 text-left text-xs font-semibold text-slate-600 hover:text-black"
                      >
                        <LogOut className="w-4 h-4 text-black" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </aside>
  );
}
