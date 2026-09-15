'use client';

import React from 'react';
import {
  X,
  Mail,
  Phone,
  Copy,
  Plus,
  Unlock,
  Lock,
  Trash2,
  User,
} from 'lucide-react';
import { StudentCase, getStatusLabel } from '../../types';

interface DossierHeaderProps {
  selectedCaseModal: StudentCase;
  caseModalGroup: StudentCase[];
  setSelectedCaseModal: React.Dispatch<React.SetStateAction<StudentCase | null>>;
  onClose: () => void;
  onCreateApplicant: (email: string, visaType: 'F-1' | 'B-2', name?: string) => void;
  onToggleEntitlement: (email: string, flag: string, currentVal: boolean) => void;
  onDeleteCase: (targetCase: StudentCase) => void;
  onCopy: (text: string, label: string) => void;
  isCreatingApplicant: boolean;
  togglingFlags: Set<string>;
  deletingCaseId: string | null;
  stopEditingDossier: () => void;
}

export const DossierHeader: React.FC<DossierHeaderProps> = ({
  selectedCaseModal,
  caseModalGroup,
  setSelectedCaseModal,
  onClose,
  onCreateApplicant,
  onToggleEntitlement,
  onDeleteCase,
  onCopy,
  isCreatingApplicant,
  togglingFlags,
  deletingCaseId,
  stopEditingDossier,
}) => {
  const isStudentTab = selectedCaseModal.visaType === 'F-1';
  const extras: { flag: string; label: string }[] = [
    {
      flag: isStudentTab ? 'purchased_curso_estudiante' : 'purchased_curso_turista',
      label: 'Master Class Express',
    },
    {
      flag: isStudentTab ? 'purchased_libro_estudiante' : 'purchased_libro_turista',
      label: 'Libro Digital',
    },
    {
      flag: isStudentTab ? 'purchased_recursos_estudiante' : 'purchased_recursos_turista',
      label: 'Recursos Adicionales',
    },
  ];

  return (
    <>
      {/* Top Bar with Avatar, Contact, Entitlements and Actions */}
      <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
            {selectedCaseModal.photoUrl ? (
              <img
                src={selectedCaseModal.photoUrl}
                alt={selectedCaseModal.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-400" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedCaseModal.name || 'Sin nombre asignado'}
              </h3>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                {selectedCaseModal.visaType === 'F-1' ? 'Visa de Estudiante (F-1)' : 'Visa de Turista (B-2)'}
              </span>
              <span className="px-3 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {getStatusLabel(selectedCaseModal.status)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Mail className="w-3.5 h-3.5 text-black" />
                {selectedCaseModal.email || 'Sin email'}
                {selectedCaseModal.email && (
                  <button
                    onClick={() => onCopy(selectedCaseModal.email, 'Email')}
                    className="hover:text-blue-600 p-0.5 cursor-pointer"
                    title="Copiar email"
                  >
                    <Copy className="w-3 h-3 text-black" />
                  </button>
                )}
              </span>
              {selectedCaseModal.phone && (
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-black" />
                  {selectedCaseModal.phone}
                  <button
                    onClick={() => onCopy(selectedCaseModal.phone, 'Teléfono')}
                    className="hover:text-blue-600 p-0.5 cursor-pointer"
                    title="Copiar teléfono"
                  >
                    <Copy className="w-3 h-3 text-black" />
                  </button>
                </span>
              )}
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                Expediente: {selectedCaseModal.id}
              </span>
            </div>

            {/* Client Products & Card Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => onCreateApplicant(selectedCaseModal.email, 'F-1', selectedCaseModal.name)}
                disabled={isCreatingApplicant || !selectedCaseModal.email}
                className="h-6 px-2.5 rounded-full text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Tarjeta F-1
              </button>
              <button
                type="button"
                onClick={() => onCreateApplicant(selectedCaseModal.email, 'B-2', selectedCaseModal.name)}
                disabled={isCreatingApplicant || !selectedCaseModal.email}
                className="h-6 px-2.5 rounded-full text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                Tarjeta B-2
              </button>
              <span className="w-px h-4 bg-slate-300 mx-0.5" />
              {extras.map((product) => {
                const unlocked = Boolean(selectedCaseModal.entitlements?.[product.flag]);
                const isToggling = togglingFlags.has(product.flag);
                return (
                  <button
                    key={product.flag}
                    type="button"
                    onClick={() => onToggleEntitlement(selectedCaseModal.email, product.flag, !unlocked)}
                    disabled={!selectedCaseModal.email || isToggling}
                    className={`h-6 px-2.5 rounded-full text-[10px] font-bold flex items-center gap-1 border transition-colors cursor-pointer disabled:cursor-not-allowed ${
                      isToggling
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-70'
                        : unlocked
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 hover:bg-emerald-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50'
                    }`}
                    title={
                      selectedCaseModal.email
                        ? unlocked
                          ? 'Clic para bloquear'
                          : 'Clic para desbloquear'
                        : 'Este cliente no tiene cuenta registrada aún'
                    }
                  >
                    {isToggling ? (
                      <span className="w-2.5 h-2.5 shrink-0 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
                    ) : unlocked ? (
                      <Unlock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    )}
                    {product.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onDeleteCase(selectedCaseModal)}
            disabled={deletingCaseId === selectedCaseModal.id}
            className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            title={`Eliminar expediente de ${selectedCaseModal.name || 'este cliente'}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>

      {/* Multi-card group tabs if client has multiple cards */}
      {caseModalGroup.length > 1 && (
        <div className="px-6 pt-3 bg-white border-b border-slate-200 shrink-0 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-600 mr-1">Tarjetas de este cliente:</span>
          {caseModalGroup.map((c, idx) => {
            const sameTypeIndex = caseModalGroup.slice(0, idx).filter((o) => o.visaType === c.visaType).length;
            const sameTypeTotal = caseModalGroup.filter((o) => o.visaType === c.visaType).length;
            const visaLabel = c.visaType === 'F-1' ? 'Estudiante F-1' : 'Turista B-2';
            const tabLabel = sameTypeTotal > 1 ? `${visaLabel} (${sameTypeIndex + 1})` : visaLabel;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseModal(c);
                  stopEditingDossier();
                }}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedCaseModal?.id === c.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.visaType === 'F-1' ? '🎓' : '✈️'} {tabLabel}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
