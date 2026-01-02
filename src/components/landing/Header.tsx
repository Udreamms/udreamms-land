"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Menu, X, ChevronDown, Lock, GraduationCap, Plane, Home as HomeIcon, 
  Briefcase, Globe, CreditCard, Car, Smartphone, FileText, Heart, 
  ArrowRight, Star, Gift, Building2, Book, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import PreApplicationForm from "./PreApplicationForm";

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
    label: "Programas",
    href: "/courses", 
    megaMenu: {
      title: "Programas Educativos",
      description: "Descubre el camino académico perfecto para tus metas en Estados Unidos.",
      actionText: "Ver todos los cursos",
      actionHref: "/courses",
      items: [
        { title: "Inglés Intensivo", desc: "Clases presenciales en campus", href: "/courses", icon: Book, colorClass: "text-blue-400 bg-blue-500/10" },
        { title: "Inglés Online", desc: "Aprende desde casa", href: "/courses", icon: Globe, colorClass: "text-purple-400 bg-purple-500/10" },
        { title: "TOEFL & IELTS", desc: "Preparación para exámenes", href: "/courses", icon: FileText, colorClass: "text-orange-400 bg-orange-500/10" },
        { title: "Inglés de Negocios", desc: "Para profesionales", href: "/courses", icon: Briefcase, colorClass: "text-emerald-400 bg-emerald-500/10" },
      ]
    }
  },
  {
    label: "Servicios",
    href: "/services", 
    megaMenu: {
      title: "Soluciones Integrales",
      description: "Más que una agencia. Nos encargamos de todo para que tú solo estudies.",
      actionText: "Explorar servicios",
      actionHref: "/services",
      items: [
        { title: "Trámite de Visa", desc: "Asesoría I-20 y consular", href: "/services", icon: ShieldCheck, colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
        { title: "Vivienda", desc: "Homestays y residencias", href: "/services", icon: HomeIcon, colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
        { title: "Trabajo y Becas", desc: "Oportunidades laborales", href: "/services", icon: Star, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
        { title: "Seguro Médico", desc: "Salud y bienestar", href: "/services", icon: Heart, colorClass: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
        { title: "Viajes y Aventuras", desc: "Conoce USA", href: "/services", icon: Plane, colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
        { title: "Cuenta Bancaria", desc: "Finanzas fáciles", href: "/services", icon: CreditCard, colorClass: "text-green-400 bg-green-500/10 border-green-500/20" },
        { title: "Movilidad", desc: "Autos, Scooters, Bus", href: "/services", icon: Car, colorClass: "text-red-400 bg-red-500/10 border-red-500/20" },
        { title: "Conectividad", desc: "Planes de celular", href: "/services", icon: Smartphone, colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
      ]
    }
  },
  { label: "Destinos", href: "/destinos" },
  {
    label: "Comunidad",
    megaMenu: {
      title: "Nuestra Comunidad",
      description: "Únete a la red Udreamms y aprovecha beneficios exclusivos.",
      actionText: "Unirme ahora",
      actionHref: "/contact",
      items: [
        { title: "Referidos", desc: "Gana $50 por cada amigo", href: "/referrals", icon: Gift, colorClass: "text-emerald-400 bg-emerald-500/10" },
        { title: "Asociaciones", desc: "Para escuelas e instituciones", href: "/partnerships", icon: Building2, colorClass: "text-indigo-400 bg-indigo-500/10" },
      ],
      socials: [
        { label: "Facebook", href: "https://www.facebook.com/udreamms/", imgSrc: "/assets/f.jpg" },
        { label: "Instagram", href: "https://www.instagram.com/udreamms/", imgSrc: "/assets/i.jpg" },
        { label: "WhatsApp", href: "https://chat.whatsapp.com/JTQ2ZVfqv3J9CRm5ydG8t3?mode=r_t", imgSrc: "/assets/w.jpg" },
        { label: "X", href: "https://x.com/udreamms", imgSrc: "/assets/x.jpg" },
        { label: "YouTube", href: "https://www.youtube.com/@udreamms", imgSrc: "/assets/y.jpg" },
        { label: "TikTok", href: "https://www.tiktok.com/@udreamms", imgSrc: "/assets/t.jpg" },
      ]
    }
  },
  { label: "Brochures", href: "/brochures" },
  { label: "FAQs", href: "/faqs" },
  { label: "Nosotros", href: "/about" },
];

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPreApplication, setShowPreApplication] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (label: string) => {
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleApplyClick = () => {
    setShowPreApplication(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* --- NAVBAR PRINCIPAL --- */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
          isScrolled || activeMenu ? "bg-black/90 backdrop-blur-md border-b border-white/10" : "bg-transparent border-b border-transparent"
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full px-6 md:px-12 h-20 flex items-center justify-between relative">
          
          {/* GRUPO IZQUIERDA: LOGO + NAV */}
          <div className="flex items-center gap-12 h-full">
            <Link href="/" className="flex items-center gap-3 z-50 shrink-0 group">
               <div className="w-9 h-9 relative transition-transform duration-300 group-hover:scale-110">
                  <img src="/assets/Logo Udreamms.png" alt="Udreamms" className="object-contain w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
               </div>
               <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">Udreamms</span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center h-full">
              {menuData.map((item) => (
                <div 
                  key={item.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.megaMenu && handleMouseEnter(item.label)}
                >
                  <Link 
                    href={item.href || "#"}
                    className={`
                      px-4 py-2 text-[13px] xl:text-[14px] font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 rounded-full hover:bg-white/5
                      ${activeMenu === item.label ? "text-white bg-white/5" : "text-gray-400 hover:text-white"}
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
          </div>

          {/* GRUPO DERECHA: ACCIONES */}
          <div className="hidden lg:flex items-center gap-4 z-50">
            <Link href="/login" className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1.5 opacity-60 hover:opacity-100">
               <Lock className="w-3 h-3" /> Staff
            </Link>

            <Link href="/portal">
               <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full h-9 px-4 text-sm font-medium border border-transparent hover:border-white/10 transition-all">
                  Portal Alumnos
               </Button>
            </Link>

            <Button 
               onClick={handleApplyClick}
               className="bg-white text-black hover:bg-gray-200 rounded-full h-10 px-8 font-bold text-sm transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Aplica Ahora
            </Button>
          </div>

          {/* MOBILE TOGGLE */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* --- MEGA MENU DESKTOP --- */}
          <AnimatePresence>
            {activeMenu && (
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
                      <div key={item.label} className="w-full px-6 md:px-12 py-12 flex flex-col gap-10">
                         
                         {/* TOP ROW: INTRO + ITEMS */}
                         <div className="grid grid-cols-12 gap-16">
                            {/* IZQUIERDA */}
                            <div className="col-span-3 pr-8 border-r border-white/5 flex flex-col justify-between">
                                <div>
                                  <h3 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
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

                            {/* DERECHA */}
                            <div className="col-span-9">
                                <div className="grid grid-cols-2 gap-8">
                                  {item.megaMenu.items.map((subItem, idx) => (
                                      <Link 
                                        key={idx} 
                                        href={subItem.href}
                                        className="group flex items-start gap-6 p-6 rounded-[2rem] transition-all duration-300 hover:bg-white/[0.03] border border-transparent hover:border-white/5 bg-white/[0.01]"
                                      >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 transition-transform group-hover:scale-110 duration-300 ${subItem.colorClass}`}>
                                            <subItem.icon className="w-7 h-7" strokeWidth={2} />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-white font-bold text-xl mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                                              {subItem.title}
                                            </div>
                                            <p className="text-gray-500 text-base font-medium leading-normal group-hover:text-gray-400">
                                              {subItem.desc}
                                            </p>
                                        </div>
                                      </Link>
                                  ))}
                                </div>
                            </div>
                         </div>

                         {/* BOTTOM ROW: SÍGUENOS (DISTRIBUIDO TOTAL Y MISMO TAMAÑO) */}
                         {item.megaMenu.socials && (
                            <div className="w-full pt-10 border-t border-white/5">
                               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8 block text-center">Síguenos</span>
                               <div className="flex items-center justify-between w-full max-w-full mx-auto px-4 md:px-12">
                                  {item.megaMenu.socials.map((social, idx) => (
                                     <a 
                                       key={idx} 
                                       href={social.href}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="group relative transition-all duration-300 hover:-translate-y-3 flex flex-col items-center gap-4 flex-1"
                                       title={social.label}
                                     >
                                        <div className="relative w-14 h-14 shrink-0">
                                           <img 
                                             src={social.imgSrc} 
                                             alt={social.label} 
                                             className="w-full h-full rounded-2xl object-cover border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/30" 
                                           />
                                           <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors rounded-2xl" />
                                        </div>
                                        <span className="text-[11px] font-black text-gray-500 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.2em] whitespace-nowrap">{social.label}</span>
                                     </a>
                                  ))}
                               </div>
                            </div>
                         )}

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
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black md:hidden overflow-y-auto"
          >
            <div className="p-6">
               <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-white">Menú</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white bg-white/10 rounded-full">
                     <X />
                  </button>
               </div>

               <div className="space-y-6">
                  {menuData.map((item) => (
                     <div key={item.label} className="border-b border-white/10 pb-4">
                        <span className="text-2xl font-bold text-white mb-4 block tracking-tight">{item.label}</span>
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
                                       <span className="text-gray-200 font-bold text-lg">{subItem.title}</span>
                                       <span className="text-gray-600 text-xs">{subItem.desc}</span>
                                    </div>
                                 </Link>
                              ))}
                              
                              {item.megaMenu.socials && (
                                 <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                                    {item.megaMenu.socials.map((social, idx) => (
                                       <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl active:scale-95 transition-transform">
                                          <img src={social.imgSrc} alt={social.label} className="w-12 h-12 rounded-xl" />
                                          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{social.label}</span>
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
                           Portal Alumnos
                        </Button>
                     </Link>
                     <Button 
                        onClick={handleApplyClick}
                        className="w-full bg-white text-black hover:bg-gray-200 h-16 rounded-2xl text-xl font-bold shadow-lg"
                     >
                        Aplica Ahora
                     </Button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPreApplication && (
        <PreApplicationForm onClose={() => setShowPreApplication(false)} />
      )}
    </>
  );
}
