'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  GraduationCap,
  Plane,
  Sparkles,
  Check,
  ShieldCheck,
  MessageSquare,
  BookOpen,
  Video,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal, studentPlans, touristPlans } from "../PortalContext";

interface PlansGridProps {
  variant?: 'estudiante' | 'turista' | 'all';
}

export default function PlansGrid({ variant = 'all' }: PlansGridProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');
  const initialFilter = (tabParam === 'estudiante' || tabParam === 'turista') ? tabParam : variant;

  const { isPlanPurchased, cart, addToCart, setIsCartOpen, getCartItemQuantity } = usePortal();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'estudiante' | 'turista'>(initialFilter);

  useEffect(() => {
    if (tabParam === 'estudiante' || tabParam === 'turista') {
      setSelectedFilter(tabParam);
    }
  }, [tabParam]);

  const showStudent = selectedFilter === 'all' || selectedFilter === 'estudiante';
  const showTourist = selectedFilter === 'all' || selectedFilter === 'turista';

  // Additional standalone products
  const additionalProducts = [
    {
      id: 'sevis',
      name: 'Tarifa SEVIS (I-901)',
      price: 368,
      badge: 'Tasa Oficial DHS',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600 bg-emerald-50',
      description: 'Pago y gestión oficial de la tasa SEVIS I-901 requerida antes de tu cita consular.',
      features: ['Comprobante oficial I-901', 'Procesamiento y registro'],
      visa: 'estudiante' as const,
    },
    {
      id: 'entrevista-embajada',
      name: 'Cita para la Entrevista (MRV)',
      price: 195,
      badge: 'Cita Consular',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: MessageSquare,
      iconColor: 'text-amber-600 bg-amber-50',
      description: 'Programación y pago del arancel de visa consular (MRV) para tu entrevista en la Embajada.',
      features: ['Arancel consular oficial', 'Programación en el portal CAS/Embajada'],
      visa: 'all' as const,
    },
    {
      id: selectedFilter === 'turista' ? 'libro-turista' : 'libro-estudiante',
      name: selectedFilter === 'turista' ? 'Libro Digital (B-2)' : 'Libro Digital (F-1)',
      price: 29.99,
      badge: 'Ebook Completo',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: BookOpen,
      iconColor: 'text-blue-600 bg-blue-50',
      description: 'Guía completa paso a paso con estrategias, modelos y requisitos clave.',
      features: ['Descarga instantánea', 'Plantillas redactadas'],
      visa: 'all' as const,
    },
    {
      id: selectedFilter === 'turista' ? 'curso-turista' : 'curso-estudiante',
      name: selectedFilter === 'turista' ? 'Masterclass Express (B-2)' : 'Masterclass Express (F-1)',
      price: 99.99,
      badge: 'Video Curso',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Video,
      iconColor: 'text-purple-600 bg-purple-50',
      description: 'Curso audiovisual intensivo con el paso a paso explicado al detalle.',
      features: ['Módulos en video HD', 'Acceso permanente'],
      visa: 'all' as const,
    },
  ].filter((prod) => {
    if (selectedFilter === 'turista') {
      return prod.id !== 'sevis';
    }
    return true;
  });

  const renderAdditionalProducts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch w-full min-w-0">
      {additionalProducts.map((prod) => {
        const Icon = prod.icon;
        const isPurchased = isPlanPurchased(prod.id);
        const inCart = cart.includes(prod.id);

        return (
          <div
            key={prod.id}
            className="relative group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 min-w-0"
          >
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className={`p-2 rounded-xl ${prod.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border ${prod.badgeColor}`}>
                  {prod.badge}
                </span>
              </div>

              {/* Title & Price */}
              <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                {prod.name}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3 min-h-[34px]">
                {prod.description}
              </p>

              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  ${prod.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase">USD</span>
              </div>

              {/* Mini Features List */}
              <ul className="space-y-1.5 border-t border-slate-100 pt-2.5 mb-4">
                {prod.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="w-full pt-1">
              {inCart ? (
                <div className="flex items-center gap-1.5 w-full">
                  <Button
                    onClick={() => setIsCartOpen(true)}
                    className="flex-1 h-8 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:scale-102 active:scale-95 transition-all text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-3 h-3 text-blue-600" />
                    En carrito ({getCartItemQuantity(prod.id)})
                  </Button>
                  <button
                    onClick={() => addToCart(prod.id)}
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 cursor-pointer"
                    title="Añadir otro cupo"
                  >
                    +
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => addToCart(prod.id)}
                  className="w-full h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 active:scale-95 transition-all text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  {isPurchased ? "+ Añadir otro cupo" : "Añadir al carrito"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPlansList = (plans: typeof studentPlans, isStudent: boolean) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch w-full min-w-0">
      {plans.map((plan) => (
        <div key={plan.id} className="relative group w-full flex flex-col h-[520px] min-w-0">
          <div className="absolute -inset-1 bg-slate-200/50 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div
            className={`relative h-full bg-white border rounded-[1.5rem] p-4 md:p-5 flex flex-col justify-between transition-all duration-300 min-w-0 ${
              plan.highlight
                ? 'border-2 border-slate-900 ring-2 ring-slate-900/10 shadow-2xl z-10'
                : 'border-slate-200 hover:border-slate-400 shadow-md hover:shadow-xl'
            }`}
          >
            {plan.discount && (
              <div className="absolute top-3 right-3 bg-slate-100 text-slate-900 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide border border-slate-300 z-20">
                {plan.discount}
              </div>
            )}

            {plan.highlight && (
              <div className="absolute top-0 right-1/2 translate-x-1/2 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-b-xl shadow-md z-20 whitespace-nowrap">
                MÁS POPULAR
              </div>
            )}

            {/* Top Header & Pricing Block (Fixed 160px Height for Perfect Alignment) */}
            <div className="flex flex-col items-center text-center mt-5 mb-2 shrink-0 h-[160px] justify-start min-w-0">
              <h3 className="text-xs md:text-sm font-bold text-slate-900 tracking-wider mb-2 leading-snug break-words w-full h-[38px] flex items-center justify-center">
                {plan.name}
              </h3>

              <div className="flex flex-col items-center justify-center h-[52px] shrink-0">
                {plan.id === 'plan-esencial' || plan.id === 'plan-pro' || plan.id === 'plan-turista-basico' ? (
                  <div className="space-y-0.5">
                    <span className="text-lg font-bold text-slate-900 tracking-tight block">
                      ${plan.price.toFixed(2)}{' '}
                      <span className="text-[8px] text-slate-400 uppercase font-medium">Tarjeta</span>
                    </span>
                    <span className="text-base font-semibold text-slate-700 tracking-tight block">
                      $
                      {(plan.id === 'plan-esencial' || plan.id === 'plan-turista-basico' ? 299.99 : 449.0).toFixed(2)}{' '}
                      <span className="text-[8px] text-slate-500 uppercase font-medium">Stablecoin</span>
                    </span>
                  </div>
                ) : (
                  <>
                    {plan.originalPrice ? (
                      <span className="text-slate-400 line-through text-[11px] font-medium block">{plan.originalPrice}</span>
                    ) : (
                      <span className="text-transparent text-[11px] font-medium block">&nbsp;</span>
                    )}
                    <span className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight pt-0.5 block">
                      ${plan.price.toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-slate-500 text-[11px] font-medium mt-2 leading-relaxed line-clamp-2">{plan.description}</p>
            </div>

            {/* Action Button (Fixed Position) */}
            <div className="w-full my-2 shrink-0">
              {cart.includes(plan.id) ? (
                <div className="flex items-center gap-2 w-full">
                  <Button
                    onClick={() => setIsCartOpen(true)}
                    className="flex-1 h-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:scale-102 active:scale-95 transition-all duration-300 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                    En carrito ({getCartItemQuantity(plan.id)})
                  </Button>
                  <button
                    onClick={() => addToCart(plan.id)}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 cursor-pointer transition-transform active:scale-95"
                    title="Añadir otro cupo a este plan"
                  >
                    +
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => addToCart(plan.id)}
                  className="w-full h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 active:scale-95 transition-all duration-300 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  {isPlanPurchased(plan.id) ? "+ Añadir otro cupo" : "Añadir al carrito"}
                </Button>
              )}
            </div>

            {/* Features List Section (Equalized Height with Internal Scrollbar) */}
            <div className="flex-1 border-t border-slate-100 pt-3 min-w-0 overflow-y-auto no-scrollbar flex flex-col justify-start">
              <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-2 text-center shrink-0">
                LO QUE INCLUYE:
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => {
                  const Icon = feature.icon;
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-slate-700 hover:text-slate-900 transition-colors cursor-default leading-relaxed"
                    >
                      <Icon className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" strokeWidth={2.2} />
                      <span className="text-[11px] font-medium text-slate-700 leading-tight">{feature.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6 w-full">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Planes y Servicios</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Explora nuestros artículos individuales y planes integrales de asesoría para tu visa a EE.UU.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-200/70 p-1 rounded-full border border-slate-300/80 shrink-0 self-start lg:self-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 text-xs rounded-full transition-all duration-300 flex items-center gap-1.5 ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${selectedFilter === 'all' ? 'text-white' : 'text-black'}`} />
            Todo el Catálogo
          </button>
          <button
            onClick={() => setSelectedFilter('estudiante')}
            className={`px-3.5 py-1.5 text-xs rounded-full transition-all duration-300 flex items-center gap-1.5 ${
              selectedFilter === 'estudiante'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${selectedFilter === 'estudiante' ? 'text-white' : 'text-black'}`} />
            Visa F-1 (Estudiante)
          </button>
          <button
            onClick={() => setSelectedFilter('turista')}
            className={`px-3.5 py-1.5 text-xs rounded-full transition-all duration-300 flex items-center gap-1.5 ${
              selectedFilter === 'turista'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <Plane className={`w-3.5 h-3.5 ${selectedFilter === 'turista' ? 'text-white' : 'text-black'}`} />
            Visa B-2 (Turista)
          </button>
        </div>
      </div>

      {/* TOP SECTION: Additional Articles & Standalone Services */}
      <div className="space-y-4 w-full min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-900">Servicios y Artículos Adicionales</h3>
            <p className="text-xs text-slate-500">Adquiere servicios específicos, tarifas y guías individuales para tu proceso.</p>
          </div>
        </div>
        {renderAdditionalProducts()}
      </div>

      {/* Student Visa Section */}
      {showStudent && (
        <div className="space-y-5 w-full min-w-0 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-black">
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Planes Completos — Visa de Estudiante F-1</h3>
              <p className="text-xs text-slate-500">Planes integrales de admisión a escuelas de inglés e I-20 en Estados Unidos.</p>
            </div>
          </div>
          {renderPlansList(studentPlans, true)}
        </div>
      )}

      {/* Tourist Visa Section */}
      {showTourist && (
        <div className="space-y-5 w-full min-w-0 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-black">
              <Plane className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Planes Completos — Visa de Turista B-2</h3>
              <p className="text-xs text-slate-500">Planes de asesoría consular, itinerario y experiencias todo incluido.</p>
            </div>
          </div>
          {renderPlansList(touristPlans, false)}
        </div>
      )}
    </div>
  );
}
