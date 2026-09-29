'use client';

import React from 'react';
import Link from 'next/link';
import { School, MapPin, ExternalLink, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { UTAH_SCHOOLS_CATALOG } from '@/lib/payments/product-catalog';
import { Button } from '@/components/ui/button';

export default function InstitucionesAliadasPage() {
  return (
    <div className="w-full min-w-0 space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 w-full">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium uppercase tracking-wider mb-2">
            <School className="w-3.5 h-3.5" />
            <span>Red Oficial SEVP / EE.UU.</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            Instituciones Aliadas
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-1 max-w-2xl font-normal">
            Escuelas de idiomas y academias autorizadas para la emisión de formularios I-20 para tu visa de estudiante (F-1).
          </p>
        </div>

        <Link href="/portal/tienda">
          <Button className="h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span>Ver admisiones en Tienda</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Convenios y representación directa
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            Como representantes de estas instituciones, te asesoramos en la aplicación, recepción de tu I-20 oficial y preparación consular completa.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-white text-slate-700 border border-slate-200 text-xs font-medium shrink-0 shadow-2xs">
          Estado: Utah (USA)
        </span>
      </div>

      {/* Schools Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full min-w-0">
        {UTAH_SCHOOLS_CATALOG.map((school) => (
          <div
            key={school.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 min-w-0 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <School className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  SEVP Certificada
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                  {school.schoolName}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-normal">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{school.state}, Estados Unidos</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-normal">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Emisión Formulario I-20</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-normal">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cursos Intensivos de Inglés</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-normal">Tarifa de Admisión</span>
                <span className="text-base font-semibold text-slate-900">
                  ${school.price.toFixed(2)} <span className="text-xs text-slate-500 font-normal">USD</span>
                </span>
              </div>

              <Link href="/portal/tienda">
                <Button
                  size="sm"
                  className="rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-medium h-9 px-3.5"
                >
                  Aplicar
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
