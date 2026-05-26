"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu, X, ChevronDown, Lock, GraduationCap, Plane, Home as HomeIcon,
  Briefcase, Globe, CreditCard, Car, Smartphone, FileText, Heart,
  ArrowRight, Star, Gift, Building2, Book, ShieldCheck, Map, LayoutGrid, Users, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

// --- TIPOS DE DATOS ---
type SubItem = {
  title: string;
  desc: string;
  href: string;
  icon: React.ElementType;
  colorClass: string;
};

type SocialItem = {
  label: string;
  href: string;
  imgSrc: string;
};

type MenuItemData = {
  label: string;
  href?: string;
  megaMenu?: {
    title: string;
    description: string;
    actionText: string;
    actionHref: string;
    items: SubItem[];
    socials?: SocialItem[];
  };
};

// --- DATA DEL MENÚ ---
const menuData: MenuItemData[] = [
  {
    label: "Visas",
    megaMenu: {
      title: "Tu camino a USA",
      description: "Asesoría experta para cada tipo de viajero.",
      actionText: "Evaluar mi perfil",
      actionHref: "/#quiz", // Placeholder for smart quiz link
      items: [
        { title: "Visa de Estudiante", desc: "F-1: Estudia y vive en USA", href: "/visas/student", icon: GraduationCap, colorClass: "text-blue-400 bg-blue-500/10" },
        { title: "Visa de Turismo", desc: "B1/B2: Viaja sin preocupaciones", href: "/visas/tourist", icon: Plane, colorClass: "text-sky-400 bg-sky-500/10" }
      ]
    }
  },
  { label: "Testimonios", href: "/#reviews" }, // Placeholder anchor
  {
    label: "Comunidad",
    megaMenu: {
      title: "Nuestra Comunidad",
      description: "Únete a la red Udreamms y aprovecha beneficios exclusivos.",
      actionText: "Unirme ahora",
      actionHref: "/contact",
      items: [
        { title: "Udreamms App", desc: "Todo en tu bolsillo", href: "/portal", icon: LayoutGrid, colorClass: "text-pink-400 bg-pink-500/10" },
        { title: "Referidos", desc: "Gana $50 por amigo", href: "/referrals", icon: Gift, colorClass: "text-emerald-400 bg-emerald-500/10" },
        { title: "Instituciones Educativas", desc: "Alianzas estratégicas", href: "/partnerships", icon: Building2, colorClass: "text-indigo-400 bg-indigo-500/10" },
        { title: "Embajadores", desc: "Representa a Udreamms", href: "/contact", icon: Users, colorClass: "text-amber-400 bg-amber-500/10" },
      ],
      socials: [
        { label: "Facebook", href: "https://www.facebook.com/udreamms/", imgSrc: "/assets/f.jpg" },
        { label: "Instagram", href: "https://www.instagram.com/udreamms/", imgSrc: "/assets/i.jpg" },
        { label: "WhatsApp", href: "https://wa.me/16507840581", imgSrc: "/assets/w.jpg" },
        { label: "X", href: "https://x.com/udreamms", imgSrc: "/assets/x.jpg" },
        { label: "YouTube", href: "https://www.youtube.com/@udreamms", imgSrc: "/assets/y.jpg" },
        { label: "TikTok", href: "https://www.tiktok.com/@udreamms", imgSrc: "/assets/t.jpg" },
      ]
    }
  },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contáctanos", href: "/contact" },
  { label: "Luxor | $LXR", href: "https://www.byluxor.com/es" },
];

export default function Header() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Determinar si es una página de "landing de visa"
  const isVisaLandingPage = [
    "/visas/student",
    "/visas/tourist"
  ].includes(pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (isVisaLandingPage) return; // No mostrar mega menu en landings de visa
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleApplyClick = () => {
    if (pathname === '/') {
      document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#planes';
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* --- NAVBAR PRINCIPAL --- */}
      <header
        className={`${isVisaLandingPage ? "absolute" : "fixed"} top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${!isVisaLandingPage && (isScrolled || activeMenu) ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent border-b border-transparent"
          }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full px-4 md:px-8 lg:px-12 h-14 flex items-center justify-between relative">

          {/* GRUPO IZQUIERDA: LOGO + NAV */}
          <div className="flex items-center gap-4 lg:gap-12 h-full">
            <Link href="/" className="flex items-center gap-2 z-50 shrink-0 group">
              <div className="w-7 h-7 relative transition-transform duration-300 group-hover:scale-110">
                <img src="/icons/new-icon-udreamms.png" alt="Udreamms" className="object-contain w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              </div>
              <span className="text-lg font-medium tracking-tight text-white group-hover:text-white transition-colors">Udreamms</span>
            </Link>

            {/* DESKTOP NAV - Ocultar en landings de visa */}
            {!isVisaLandingPage && (
              <nav className="hidden lg:flex items-center h-full">
                {menuData.map((item) => (
                  <div
                    key={item.label}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => item.megaMenu && handleMouseEnter(item.label)}
                  >
                    <Link
                      href={item.href || "#"}
                      {...(item.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`
                        px-3 py-1.5 text-[12px] xl:text-[13px] font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 rounded-full hover:bg-white/5
                        ${activeMenu === item.label ? "text-white bg-white/5" : "text-white/80 hover:text-white"}

                      `}
                    >
                      {item.label}
                      {item.megaMenu && (
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 opacity-60 ${activeMenu === item.label ? "rotate-180 opacity-100" : ""}`} />
                      )}
                    </Link>
                  </div>
                ))}
              </nav>
            )}
          </div>

          {/* GRUPO DERECHA: ACCIONES */}
          <div className="hidden lg:flex items-center gap-4 z-50">
            {/* Solo mostrar Staff si NO es landing de visa, o podrías dejarlo oculto si quieres algo más limpio */}
            {!isVisaLandingPage && (
              <Link href="/portal" className="text-[10px] font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5 opacity-80 hover:opacity-100">
                <Lock className="w-3 h-3" /> Staff
              </Link>
            )}

            <Link href="/portal">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full h-8 px-3 text-xs font-medium border border-transparent hover:border-white/10 transition-all">
                Portal de Cliente
              </Button>
            </Link>

            <Button
              onClick={handleApplyClick}
              className="bg-transparent text-white border border-white/40 hover:bg-blue-600 hover:border-blue-600 rounded-full h-8 px-5 font-medium text-xs transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Aplica Ahora
            </Button>
          </div>

          {/* MOBILE TOGGLE AND CTA */}
          {!isVisaLandingPage && (
            <div className="lg:hidden flex items-center gap-2">
              <Button
                onClick={handleApplyClick}
                size="sm"
                className="bg-transparent text-white border border-white/40 hover:bg-blue-600 hover:border-blue-600 hover:scale-105 transition-all duration-300 rounded-full text-[11px] h-8 px-4"
              >
                Aplica Ahora
              </Button>
              <button
                className="text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          )}

          {/* En móvil si es landing de visa, igual mostramos portal y aplica ahora si no hay menu de hamburguesa? O simplemente dejamos el logo y botones? */}
          {isVisaLandingPage && (
            <div className="lg:hidden flex items-center gap-2">
              <Link href="/portal">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full text-xs px-3">
                  Portal
                </Button>
              </Link>
              <Button
                onClick={handleApplyClick}
                size="sm"
                className="bg-transparent text-white border border-white/40 hover:bg-blue-600 hover:border-blue-600 hover:scale-105 transition-all duration-300 rounded-full text-[10px] h-7 px-3"
              >
                Aplica
              </Button>
            </div>
          )}

          {/* --- MEGA MENU DESKTOP --- */}
          <AnimatePresence>
            {!isVisaLandingPage && activeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 w-full bg-[#050505] border-b border-white/10 shadow-2xl overflow-hidden"
                style={{ height: "auto" }}
              >
                {menuData.map((item) => (
                  item.label === activeMenu && item.megaMenu && (
                    <div key={item.label} className="w-full px-6 md:px-12 py-12">

                      {/* GRID LAYOUT: LEFT (Intro) - MIDDLE (Items) - RIGHT (Socials) */}
                      <div className="grid grid-cols-12 gap-12">

                        {/* COL 1: INTRO (3 cols) */}
                        <div className="col-span-3 pr-6 border-r border-white/5 flex flex-col justify-between">
                          <div>
                            <h3 className="text-3xl font-medium text-white mb-4 tracking-tight leading-tight">
                              {item.megaMenu.title}
                            </h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                              {item.megaMenu.description}
                            </p>
                          </div>
                          <Link href={item.megaMenu.actionHref}>
                            <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full gap-3 pl-6 pr-4 h-12 w-full justify-between group transition-all">
                              {item.megaMenu.actionText}
                              <div className="bg-white text-black rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                <ArrowRight className="w-3 h-3" />
                              </div>
                            </Button>
                          </Link>
                        </div>

                        {/* COL 2: ITEMS (Width depends on socials presence) */}
                        <div className={`${item.megaMenu.socials ? 'col-span-7 border-r border-white/5 pr-8' : 'col-span-9'}`}>
                          <div className={`${item.label === 'Visas' ? 'grid grid-cols-3 gap-6' : 'grid grid-cols-2 gap-8'}`}>
                            {item.megaMenu.items.map((subItem, idx) => (
                              <Link
                                key={idx}
                                href={subItem.href}
                                className={`group flex items-start ${item.label === 'Visas' ? 'gap-4 p-4 rounded-2xl' : 'gap-5 p-5 rounded-[1.5rem]'} transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-white/5 bg-white/[0.01]`}
                              >
                                <div className={`${item.label === 'Visas' ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-2xl'} flex items-center justify-center shrink-0 border border-white/5 transition-transform group-hover:scale-110 duration-300 ${subItem.colorClass}`}>
                                  <subItem.icon className={`${item.label === 'Visas' ? 'w-5 h-5' : 'w-6 h-6'}`} strokeWidth={2} />
                                </div>
                                <div className="flex flex-col">
                                  <div className={`text-white font-medium ${item.label === 'Visas' ? 'text-sm mb-0.5' : 'text-lg mb-1'} group-hover:text-white transition-colors flex items-center gap-2`}>
                                    {subItem.title}
                                  </div>
                                  <p className={`text-gray-500 font-medium leading-tight group-hover:text-gray-400 ${item.label === 'Visas' ? 'text-xs' : 'text-sm leading-normal'}`}>
                                    {subItem.desc}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* COL 3: SOCIALS (2 cols - Only if they exist) */}
                        {item.megaMenu.socials && (
                          <div className="col-span-2 pl-2 flex flex-col justify-center">
                            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-500 mb-6 block">Síguenos</span>
                            <div className="flex flex-col gap-4">
                              {item.megaMenu.socials.map((social, idx) => (
                                <a
                                  key={idx}
                                  href={social.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-3 transition-all duration-300 hover:translate-x-1"
                                >
                                  <div className="relative w-8 h-8 shrink-0">
                                    <img
                                      src={social.imgSrc}
                                      alt={social.label}
                                      className="w-full h-full rounded-lg object-cover border border-white/10 shadow-sm transition-all duration-300 group-hover:border-primary/50"
                                    />
                                  </div>
                                  <span className="text-[11px] font-medium text-gray-400 group-hover:text-white uppercase tracking-wider">{social.label}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {!isVisaLandingPage && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black md:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-medium text-white">Menú</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white bg-white/10 rounded-full">
                  <X />
                </button>
              </div>

              <div className="space-y-6">
                {menuData.map((item) => (
                  <div key={item.label} className="border-b border-white/10 pb-4">
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-2xl font-medium text-white mb-4 block tracking-tight hover:text-white/80 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-2xl font-medium text-white mb-4 block tracking-tight">{item.label}</span>
                    )}
                    {item.megaMenu && (
                      <div className="grid grid-cols-1 gap-4 pl-2">
                        {item.megaMenu.items.map((subItem, idx) => (
                          <Link
                            key={idx}
                            href={subItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-4 py-3"
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subItem.colorClass}`}>
                              <subItem.icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-200 font-medium text-lg">{subItem.title}</span>
                              <span className="text-gray-600 text-xs">{subItem.desc}</span>
                            </div>
                          </Link>
                        ))}

                        {item.megaMenu.socials && (
                          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                            {item.megaMenu.socials.map((social, idx) => (
                              <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                                <img src={social.imgSrc} alt={social.label} className="w-12 h-12 rounded-xl" />
                                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{social.label}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-6 space-y-4">
                  <Link href="/portal" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 h-16 text-lg font-medium border border-white/10 rounded-2xl">
                      <GraduationCap className="w-6 h-6 mr-4" />
                      Portal de Cliente
                    </Button>
                  </Link>
                  <Button
                    onClick={handleApplyClick}
                    className="w-full bg-transparent text-white border border-white/40 hover:bg-blue-600 hover:border-blue-600 hover:scale-[1.02] transition-all duration-300 h-12 rounded-xl text-lg font-medium shadow-lg"
                  >
                    Aplica Ahora
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
