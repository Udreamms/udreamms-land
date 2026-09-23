'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DOSSIER_SECTIONS, isSectionFilled } from '../../types';

interface DossierSectionNavProps {
  formData: Record<string, string>;
}

export const DossierSectionNav: React.FC<DossierSectionNavProps> = ({ formData }) => {
  const scrollToDossierSection = (anchor: string) => {
    if (typeof document === 'undefined') return;
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 gap-1.5 shrink-0">
      {DOSSIER_SECTIONS.map((sec) => {
        const filled = isSectionFilled(formData || {}, sec.fields);
        return (
          <button
            key={sec.anchor}
            type="button"
            onClick={() => scrollToDossierSection(sec.anchor)}
            className={`w-full py-1.5 px-1 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all border cursor-pointer text-center truncate shadow-2xs ${
              filled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
            title={sec.label}
          >
            {filled && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />}
            <span className="truncate">{sec.label}</span>
          </button>
        );
      })}
    </div>
  );
};
