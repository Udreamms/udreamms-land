'use client';

import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal, studentPlans, touristPlans } from "../PortalContext";

interface PlansGridProps {
  variant: 'estudiante' | 'turista';
}

export default function PlansGrid({ variant }: PlansGridProps) {
  const { isPlanPurchased, cart, addToCart, setIsCartOpen } = usePortal();
  const isStudent = variant === 'estudiante';
  const plans = isStudent ? studentPlans : touristPlans;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight">
          {isStudent ? 'Visa de Estudiante F-1' : 'Visa de Turista B-2'}
        </h2>
        <p className="text-sm text-white/50">
          {isStudent
            ? 'Elige uno de los 4 planes de asesoría para tu visa F-1. Paga con tarjeta o crypto y desbloquea tu proceso al instante.'
            : 'Elige tu plan de visa turista B-2. Paga con tarjeta o crypto y desbloquea tu proceso al instante.'}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 gap-6 items-stretch w-full ${
          isStudent ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {plans.map((plan) => (
          <div key={plan.id} className="relative group w-full flex flex-col h-full">
            <div className="absolute -inset-1.5 bg-white/10 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div
              className={`relative flex-1 bg-[#0d0d11]/80 border rounded-[2rem] p-6 flex flex-col overflow-hidden transition-all duration-300 ${
                plan.highlight
                  ? 'border-purple-500/50 ring-1 ring-purple-500/30 shadow-2xl shadow-purple-500/5 z-10'
                  : 'border-white/5 hover:border-white/10 shadow-2xl hover:bg-[#0f0f15]'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] blur-2xl" />

              {plan.discount && (
                <div className="absolute top-4 right-4 bg-purple-950/80 text-purple-300 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide border border-purple-500/30">
                  {plan.discount}
                </div>
              )}

              {plan.highlight && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] text-white text-[9px] font-semibold uppercase tracking-widest px-4 py-1 rounded-b-xl shadow-lg z-20">
                  MÁS POPULAR
                </div>
              )}

              <div className="flex flex-col items-center text-center mt-6 mb-6">
                <h3 className="text-md font-semibold text-white tracking-wider mb-2">{plan.name}</h3>
                <div className="flex flex-col items-center justify-center min-h-[56px]">
                  {plan.id === 'plan-esencial' || plan.id === 'plan-pro' || plan.id === 'plan-turista-basico' ? (
                    <div className="space-y-0.5">
                      <span className="text-xl font-normal text-white tracking-tight block">
                        ${plan.price.toFixed(2)}{' '}
                        <span className="text-[9px] text-white/50 uppercase font-light">Tarjeta</span>
                      </span>
                      <span className="text-lg font-normal text-purple-400 tracking-tight block">
                        $
                        {(plan.id === 'plan-esencial' || plan.id === 'plan-turista-basico' ? 299.99 : 449.0).toFixed(2)}{' '}
                        <span className="text-[8px] text-purple-400/60 uppercase font-light">Crypto</span>
                      </span>
                    </div>
                  ) : (
                    <>
                      {plan.originalPrice && (
                        <span className="text-white/40 line-through text-xs font-normal">{plan.originalPrice}</span>
                      )}
                      <span className="text-3xl font-normal text-white tracking-tight pt-0.5">
                        ${plan.price.toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-white/50 text-xs font-light mt-3 leading-relaxed">{plan.description}</p>
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
                      <li
                        key={i}
                        className="flex items-start gap-2 text-white/70 hover:text-white transition-colors cursor-default leading-relaxed"
                      >
                        <Icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-xs font-light text-white/80">{feature.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
