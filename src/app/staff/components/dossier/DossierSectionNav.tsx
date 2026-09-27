'use client';

import React from 'react';
import { CheckCircle2, FileText, Check } from 'lucide-react';
import { DOSSIER_SECTIONS, isSectionFilled } from '../../types';

interface DossierSectionNavProps {
  formData: Record<string, string>;
  isEditingDossier?: boolean;
  startEditingDossier?: () => void;
  stopEditingDossier?: () => void;
}

export const DossierSectionNav: React.FC<DossierSectionNavProps> = ({
  formData,
  isEditingDossier,
  startEditingDossier,
  stopEditingDossier,
}) => {
  const scrollToDossierSection = (anchor: string) => {
    if (typeof document === 'undefined') return;
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full flex items-center gap-1.5 overflow-x-auto sleek-scrollbar py-1 shrink-0 pr-8">
      {DOSSIER_SECTIONS.map((sec) => {
        const filled = isSectionFilled(formData || {}, sec.fields);
        return (
          <button
            key={sec.anchor}
            type="button"
            onClick={() => scrollToDossierSection(sec.anchor)}
            className={`shrink-0 h-7 px-2.5 rounded-full text-[11px] font-medium flex items-center justify-center gap-1 transition-all border cursor-pointer text-center whitespace-nowrap shadow-2xs ${
              filled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
            title={sec.label}
          >
            {filled && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
            <span>{sec.label}</span>
          </button>
        );
      })}

      {/* Button to edit card placed at the very end of all section capsules with clear margin */}
      {startEditingDossier && (
        isEditingDossier ? (
          <button
            type="button"
            onClick={stopEditingDossier}
            className="shrink-0 h-7 px-3.5 rounded-full text-[11px] font-bold bg-slate-900 hover:bg-black text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all border border-slate-900 ml-1 whitespace-nowrap"
            title="Terminar edición de la tarjeta"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminar Edición</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={startEditingDossier}
            className="shrink-0 h-7 px-3.5 rounded-full text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20 transition-all border border-blue-600 ml-1 whitespace-nowrap hover:scale-[1.02]"
            title="Editar los datos y formulario de esta tarjeta"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Editar Tarjeta</span>
          </button>
        )
      )}

      {/* End margin spacer to ensure Editar Tarjeta never touches border or gets clipped */}
      <div className="w-6 shrink-0" />
    </div>
  );
};
