'use client';

import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaffTabType, STAFF_TABS_LIST } from '../../types';

interface DossierToolbarProps {
  currentStatus: StaffTabType;
  caseId: string;
  onMoveStatus: (caseId: string, newStatus: StaffTabType) => void;
  isEditingDossier: boolean;
  dossierSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  startEditingDossier: () => void;
  stopEditingDossier: () => void;
}

export const DossierToolbar: React.FC<DossierToolbarProps> = ({
  currentStatus,
  caseId,
  onMoveStatus,
  isEditingDossier,
  dossierSaveStatus,
  startEditingDossier,
  stopEditingDossier,
}) => {
  return (
    <>
      {/* Quick Status Toolbar */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-700 mr-1">Cambiar estado a:</span>
          {STAFF_TABS_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onMoveStatus(caseId, tab.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                currentStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label.replace(/^\d+\.\s*/, '')}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Dossier Toolbar */}
      <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-200/60 shrink-0 flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1.5">
          {isEditingDossier ? (
            dossierSaveStatus === 'saving' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Guardando...
              </>
            ) : dossierSaveStatus === 'error' ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                No se pudo guardar el último cambio — revisa tu conexión.
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Todo guardado automáticamente.
              </>
            )
          ) : (
            'Puedes corregir o completar cualquier dato del expediente en nombre del cliente.'
          )}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {isEditingDossier ? (
            <Button
              type="button"
              onClick={stopEditingDossier}
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 cursor-pointer"
            >
              Terminar Edición
            </Button>
          ) : (
            <Button
              type="button"
              onClick={startEditingDossier}
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              Editar Expediente
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
