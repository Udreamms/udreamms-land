'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentCase, StaffTabType } from '../types';
import { DossierHeader } from './dossier/DossierHeader';
import { DossierToolbar } from './dossier/DossierToolbar';
import { DossierSectionNav } from './dossier/DossierSectionNav';
import { DossierDocGrid } from './dossier/DossierDocGrid';
import { DossierFormSections } from './dossier/DossierFormSections';
import { DossierChatFooter } from './dossier/DossierChatFooter';

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
      <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-[1560px] h-[95vh] max-h-[95vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modular Header */}
        <DossierHeader
          selectedCaseModal={selectedCaseModal}
          caseModalGroup={caseModalGroup}
          setSelectedCaseModal={setSelectedCaseModal}
          onClose={onClose}
          onMoveStatus={onMoveStatus}
          onCreateApplicant={onCreateApplicant}
          onToggleEntitlement={onToggleEntitlement}
          onDeleteCase={onDeleteCase}
          onCopy={onCopy}
          isCreatingApplicant={isCreatingApplicant}
          togglingFlags={togglingFlags}
          isEditingDossier={isEditingDossier}
          editedFormData={editedFormData}
          startEditingDossier={startEditingDossier}
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
            {/* Auto-save & Edit Notice Bar (Only visible while editing) */}
            {isEditingDossier && (
              <DossierToolbar
                isEditingDossier={isEditingDossier}
                dossierSaveStatus={dossierSaveStatus}
                startEditingDossier={startEditingDossier}
                stopEditingDossier={stopEditingDossier}
              />
            )}

            {/* Modal Body: Navigation Capsules, Documents Grid & Form Sections */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-900 flex-1 min-h-0 sleek-scrollbar">
              {/* 13 Section Navigation Capsules (Full Width) */}
              <DossierSectionNav
                formData={isEditingDossier ? editedFormData : selectedCaseModal.formData}
                isEditingDossier={isEditingDossier}
                startEditingDossier={startEditingDossier}
                stopEditingDossier={stopEditingDossier}
              />

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

        {/* Modal Footer: Live Embedded Chat with Client */}
        {selectedCaseModal.email && (
          <DossierChatFooter
            clientEmail={selectedCaseModal.email}
            clientName={selectedCaseModal.name}
            onCaseUpdated={onCaseUpdated}
          />
        )}
      </div>
    </div>
  );
};
