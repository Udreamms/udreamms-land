'use client';

import React, { useState } from "react";
import { ShoppingCart, GraduationCap, Plane, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal, studentPlans, touristPlans } from "../PortalContext";

interface PlansGridProps {
  variant?: 'estudiante' | 'turista' | 'all';
}

export default function PlansGrid({ variant = 'all' }: PlansGridProps) {
  const { isPlanPurchased, cart, addToCart, setIsCartOpen } = usePortal();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'estudiante' | 'turista'>(variant);

  const showStudent = selectedFilter === 'all' || selectedFilter === 'estudiante';
  const showTourist = selectedFilter === 'all' || selectedFilter === 'turista';

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
                      <span className="text-[8px] text-slate-500 uppercase font-medium">Crypto</span>
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
              {isPlanPurchased(plan.id) ? (
                <Button
                  disabled
                  className="w-full h-10 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold tracking-widest uppercase cursor-default"
                >
                  Plan Adquirido
                </Button>
              ) : cart.includes(plan.id) ? (
                <Button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full h-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:scale-105 active:scale-95 transition-all duration-300 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-blue-600" />
                  Ver en carrito
                </Button>
              ) : (
                <Button
                  onClick={() => addToCart(plan.id)}
                  className="w-full h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 transition-all duration-300 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  Añadir al carrito
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
    <div className="space-y-8 w-full min-w-0">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6 w-full">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Planes de Asesoría</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Explora y selecciona el plan ideal para tu trámite de visa a EE.UU. Paga con tarjeta o crypto.
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
            Todos los Planes
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

      {/* Student Visa Section */}
      {showStudent && (
        <div className="space-y-5 w-full min-w-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-black">
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Visa de Estudiante F-1</h3>
              <p className="text-xs text-slate-500">Planes de admisión a escuelas de inglés e I-20 en Estados Unidos.</p>
            </div>
          </div>
          {renderPlansList(studentPlans, true)}
        </div>
      )}

      {/* Tourist Visa Section */}
      {showTourist && (
        <div className="space-y-5 w-full min-w-0">
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-300 text-black">
              <Plane className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900">Visa de Turista B-2</h3>
              <p className="text-xs text-slate-500">Planes de asesoría consular, itinerario y experiencias todo incluido.</p>
            </div>
          </div>
          {renderPlansList(touristPlans, false)}
        </div>
      )}
    </div>
  );
}
