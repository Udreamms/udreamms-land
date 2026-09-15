'use client';

import React from 'react';
import { Lock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentCase, StaffTabType } from '../types';
import { DossierHeader } from './dossier/DossierHeader';
import { DossierToolbar } from './dossier/DossierToolbar';
import { DossierDocGrid } from './dossier/DossierDocGrid';
import { DossierFormSections } from './dossier/DossierFormSections';

interface StaffDossierModalProps {
  selectedCaseModal: StudentCase | null;
  caseModalGroup: StudentCase[];
  setSelectedCaseModal: React.Dispatch<React.SetStateAction<StudentCase | null>>;
  onClose: () => void;
  onMoveStatus: (caseId: string, newStatus: StaffTabType) => void;
  onCreateApplicant: (email: string, visaType: 'F-1' | 'B-2', name?: string) => void;
  onToggleEntitlement: (email: string, flag: string, currentVal: boolean) => void;
  onDeleteCase: (targetCase: StudentCase) => void;
  onStartChat: (targetCase: StudentCase) => void;
  onCopy: (text: string, label: string) => void;
  onCaseUpdated?: () => void;
  isCreatingApplicant: boolean;
  togglingFlags: Set<string>;
  deletingCaseId: string | null;
  isEditingDossier: boolean;
  editedFormData: Record<string, string>;
  setEditedFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  dossierSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  startEditingDossier: () => void;
  stopEditingDossier: () => void;
}

export const StaffDossierModal: React.FC<StaffDossierModalProps> = ({
  selectedCaseModal,
  caseModalGroup,
  setSelectedCaseModal,
  onClose,
  onMoveStatus,
  onCreateApplicant,
  onToggleEntitlement,
  onDeleteCase,
  onStartChat,
  onCopy,
  onCaseUpdated,
  isCreatingApplicant,
  togglingFlags,
  deletingCaseId,
  isEditingDossier,
  editedFormData,
  setEditedFormData,
  dossierSaveStatus,
  startEditingDossier,
  stopEditingDossier,
}) => {
  if (!selectedCaseModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-[1560px] max-h-[95vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modular Header */}
        <DossierHeader
          selectedCaseModal={selectedCaseModal}
          caseModalGroup={caseModalGroup}
          setSelectedCaseModal={setSelectedCaseModal}
          onClose={onClose}
          onCreateApplicant={onCreateApplicant}
          onToggleEntitlement={onToggleEntitlement}
          onDeleteCase={onDeleteCase}
          onCopy={onCopy}
          isCreatingApplicant={isCreatingApplicant}
          togglingFlags={togglingFlags}
          deletingCaseId={deletingCaseId}
          stopEditingDossier={stopEditingDossier}
        />

        {!selectedCaseModal.hasVisaService ? (
          <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Este cliente no ha comprado ningún servicio</h4>
            <p className="text-sm text-slate-500 max-w-md">
              Se registró en el portal pero todavía no ha adquirido un servicio de Visa Estudiante (F-1) o Visa Turista (B-2).
              El expediente y los formularios se activan automáticamente en cuanto compre uno de esos servicios.
            </p>
          </div>
        ) : (
          <>
            {/* Modular Toolbars (Status + Edit mode) */}
            <DossierToolbar
              currentStatus={selectedCaseModal.status}
              caseId={selectedCaseModal.id}
              onMoveStatus={onMoveStatus}
              isEditingDossier={isEditingDossier}
              dossierSaveStatus={dossierSaveStatus}
              startEditingDossier={startEditingDossier}
              stopEditingDossier={stopEditingDossier}
            />

            {/* Modal Body: Documents Grid & Form Sections */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-900">
              {/* 9 Documents Grid */}
              <DossierDocGrid
                selectedCaseModal={selectedCaseModal}
                setSelectedCaseModal={setSelectedCaseModal}
                onCaseUpdated={onCaseUpdated}
              />

              {/* 13 Form Sections */}
              <DossierFormSections
                selectedCaseModal={selectedCaseModal}
                isEditingDossier={isEditingDossier}
                editedFormData={editedFormData}
                setEditedFormData={setEditedFormData}
              />
            </div>
          </>
        )}

        {/* Modal Footer */}
        <div className="p-5 md:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => {
                const student = selectedCaseModal;
                onClose();
                onStartChat(student);
              }}
              className="h-10 px-4 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span>Chatear en Vivo con {selectedCaseModal.name || 'el Postulante'}</span>
            </Button>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Última actualización sincronizada con Firebase.
            </span>
          </div>
          <Button
            onClick={onClose}
            className="h-10 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Cerrar Formulario
          </Button>
        </div>
      </div>
    </div>
  );
};
