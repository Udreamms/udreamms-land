'use client';

import React from 'react';
import { CreditCard, ExternalLink, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SEVIS_FEE_URL } from './resourcesData';

export const SevisPaymentStep: React.FC = () => {
  return (
    <div className="bg-white border-2 border-indigo-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header of Step 2 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 font-black text-lg">
            2
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Paso 2: Pago de Tasa SEVIS (I-901 Fee)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-extrabold uppercase border border-indigo-200">
                $350 USD Obligatorio
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Portal Oficial de Pago del Departamento de Seguridad Nacional (DHS / FMJfee).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={SEVIS_FEE_URL}
            target="_blank"
            rel="noreferrer"
            className="h-10 px-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer self-start md:self-auto shrink-0"
          >
            <span>Ir a Pagar SEVIS (fmjfee.com)</span>
            <ExternalLink className="w-4 h-4 text-white" />
          </a>
        </div>
      </div>

      {/* Info Callout */}
      <div className="bg-gradient-to-r from-indigo-50/90 to-blue-50/70 border border-indigo-200 rounded-2xl p-5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-indigo-950 font-bold">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <span>Requisitos Previos para el Pago SEVIS:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
          <li>
            Tener el <strong>Formulario I-20</strong> emitido por la escuela con el <strong>SEVIS ID (N00...)</strong> en la esquina superior derecha.
          </li>
          <li>
            Código de Escuela (School Code) que figura en la sección 2 del I-20 del alumno.
          </li>
          <li>
            Tarjeta de crédito/débito internacional habilitada para compras en dólares ($350 USD).
          </li>
        </ul>
      </div>

      {/* Step by Step Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
              1
            </span>
            <strong className="text-slate-900 font-bold text-xs">Ingresar Datos del I-20</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            En <em>fmjfee.com</em> hacer clic en <strong>"PAY I-901 FEE"</strong>, ingresar SEVIS ID, Apellidos y Fecha de Nacimiento exactamente como figuran en el I-20.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
              2
            </span>
            <strong className="text-slate-900 font-bold text-xs">Seleccionar Visa F-1 & Pagar</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Elegir la categoría <strong>F-1 Student ($350)</strong>, ingresar el código de la escuela y procesar el pago con tarjeta.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
              3
            </span>
            <strong className="text-slate-900 font-bold text-xs">Descargar Comprobante</strong>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Descargar el recibo oficial con código de barras y adjuntarlo en el recuadro <strong>4. SEVIS (I-901)</strong> del expediente.
          </p>
        </div>
      </div>
    </div>
  );
};
