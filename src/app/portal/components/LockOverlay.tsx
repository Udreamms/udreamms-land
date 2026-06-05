'use client';

import React from "react";
import { motion } from "framer-motion";
import { Lock, Briefcase, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortal, cartItemsConfig } from "../PortalContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface LockOverlayProps {
  itemId: 'curso-estudiante' | 'libro-estudiante' | 'curso-turista' | 'libro-turista' | 'proceso-estudiante' | 'proceso-turista';
}

export default function LockOverlay({ itemId }: LockOverlayProps) {
  const router = useRouter();
  const { cart, addToCart, handleCheckout } = usePortal();
  const itemInfo = cartItemsConfig[itemId];
  if (!itemInfo) return null;

  const isAdded = cart.includes(itemId);
  const isProceso = itemId.startsWith('proceso');

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md rounded-3xl border border-white/5 text-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md bg-[#0d0d11]/90 border border-white/10 rounded-3xl p-5 md:p-8 space-y-4 md:space-y-6 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[40px] pointer-events-none" />
        
        <Lock className="w-10 h-10 md:w-12 md:h-12 text-purple-400 mx-auto animate-pulse" />
        
        <div className="space-y-1 md:space-y-2">
          <h3 className="text-lg md:text-xl font-normal text-white uppercase tracking-wider">{itemInfo.name}</h3>
          <p className="text-[11px] md:text-xs text-white/50 leading-relaxed">
            {isProceso
              ? "Este módulo de seguimiento y preparación consular requiere la contratación de un plan de asesoría activo."
              : "Este contenido exclusivo está bloqueado. Adquiere el acceso permanente para comenzar tu preparación consular con nuestros mentores autorizados."}
          </p>
        </div>

        {!isProceso && (
          <div className="text-xl md:text-2xl font-normal text-purple-400 tracking-tight">
            ${itemInfo.price.toFixed(2)} USD
          </div>
        )}

        <div className="pt-1 md:pt-2">
          {isProceso ? (
            <Button
              onClick={() => {
                router.push('/portal/servicios');
                toast.info("Por favor, selecciona y añade un plan al carrito para desbloquear tu proceso de asesoría.");
              }}
              className="w-full h-10 md:h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Elegir Plan de Asesoría
            </Button>
          ) : isAdded ? (
            <Button
              onClick={() => handleCheckout()}
              className="w-full h-10 md:h-12 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition-all text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Ver en carrito
            </Button>
          ) : (
            <Button
              onClick={() => addToCart(itemId)}
              className="w-full h-10 md:h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:border-[#2d1b4e] hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-xs font-normal tracking-widest uppercase flex items-center justify-center gap-2"
            >
              Añadir al carrito
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
