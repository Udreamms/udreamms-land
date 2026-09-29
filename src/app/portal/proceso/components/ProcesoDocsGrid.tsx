'use client';

import React from 'react';
import {
  Camera,
  CreditCard,
  Building2,
  Ticket,
  GraduationCap,
  FileCheck,
  School,
  ShieldCheck,
  Calendar,
  Eye,
  Download,
  Trash2,
  Upload,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { AttachedDoc, ApplicantInfo } from '../types';

interface ProcesoDocsGridProps {
  isSelectedStudent: boolean;
  currentApplicantData: ApplicantInfo | null;
  currentPhoto: string | null;
  setCurrentPhoto: (val: string | null) => void;
  currentPassport: AttachedDoc | null;
  setCurrentPassportDoc: (val: AttachedDoc | null) => void;
  currentBankStatement: AttachedDoc | null;
  setCurrentBankStatementDoc: (val: AttachedDoc | null) => void;
  currentSevis: AttachedDoc | null;
  setCurrentSevisDoc: (val: AttachedDoc | null) => void;
  currentI20: AttachedDoc | null;
  setCurrentI20Doc: (val: AttachedDoc | null) => void;
  currentDs160: AttachedDoc | null;
  setCurrentDs160Doc: (val: AttachedDoc | null) => void;
  currentAcceptance: AttachedDoc | null;
  setCurrentAcceptanceLetterDoc: (val: AttachedDoc | null) => void;
  currentAffidavit: AttachedDoc | null;
  setCurrentAffidavitDoc: (val: AttachedDoc | null) => void;
  currentEmbassy: AttachedDoc | null;
  setCurrentEmbassyAppointmentDoc: (val: AttachedDoc | null) => void;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassportUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBankStatementUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSevisUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleI20Upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDs160Upload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAcceptanceLetterUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAffidavitUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmbassyAppointmentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPreview: (title: string, doc: AttachedDoc) => void;
  onDownload: (url: string, filename: string) => void;
}

export default function ProcesoDocsGrid({
  isSelectedStudent,
  currentApplicantData,
  currentPhoto,
  setCurrentPhoto,
  currentPassport,
  setCurrentPassportDoc,
  currentBankStatement,
  setCurrentBankStatementDoc,
  currentSevis,
  setCurrentSevisDoc,
  currentI20,
  setCurrentI20Doc,
  currentDs160,
  setCurrentDs160Doc,
  currentAcceptance,
  setCurrentAcceptanceLetterDoc,
  currentAffidavit,
  setCurrentAffidavitDoc,
  currentEmbassy,
  setCurrentEmbassyAppointmentDoc,
  handlePhotoUpload,
  handlePassportUpload,
  handleBankStatementUpload,
  handleSevisUpload,
  handleI20Upload,
  handleDs160Upload,
  handleAcceptanceLetterUpload,
  handleAffidavitUpload,
  handleEmbassyAppointmentUpload,
  onPreview,
  onDownload,
}: ProcesoDocsGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Documentos y Archivos Adjuntos del Expediente</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Adjunta, visualiza, descarga o actualiza los documentos oficiales de tu expediente consular.
          </p>
        </div>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto shadow-2xs">
          {isSelectedStudent ? '9 Documentos Oficiales' : '5 Documentos Oficiales'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        {/* 1. Foto Oficial 5x5 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                1. Foto Oficial 5x5
              </span>
              {currentPhoto ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunta
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Foto
                </span>
              )}
            </div>

            {currentPhoto ? (
              <a
                href={currentPhoto}
                target="_blank"
                rel="noreferrer"
                className="w-20 h-20 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-inner group relative block cursor-pointer"
                title="Clic para ver foto"
              >
                <img
                  src={currentPhoto}
                  alt="Foto Oficial 5x5"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Eye className="w-4 h-4" />
                </span>
              </a>
            ) : (
              <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                <Camera className="w-6 h-6 text-slate-300" />
                <span>Sin fotografía</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {currentPhoto && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onPreview('Fotografía Oficial 5x5 cm', {
                      name: 'Foto_Oficial_5x5.jpg',
                      type: 'image/jpeg',
                      dataUrl: currentPhoto,
                    })
                  }
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver foto oficial"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDownload(
                      currentPhoto,
                      `${(currentApplicantData?.name || 'foto_5x5').replace(/\s+/g, '_')}_5x5.jpg`
                    )
                  }
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar foto oficial"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPhoto(null);
                    toast.info('Fotografía removida.');
                  }}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3 h-3 text-blue-600" />
              <span>{currentPhoto ? 'Reemplazar Foto' : 'Adjuntar Foto'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        {/* 2. Pasaporte */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                2. Pasaporte
              </span>
              {currentPassport ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {currentPassport ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={currentPassport.name}>
                  {currentPassport.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {currentPassport.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                </span>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                <CreditCard className="w-6 h-6 text-slate-300" />
                <span>Sin pasaporte</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {currentPassport && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onPreview('Pasaporte Oficial del Postulante', currentPassport)
                  }
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver pasaporte"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDownload(
                      currentPassport.url || currentPassport.dataUrl,
                      currentPassport.name || 'pasaporte.pdf'
                    )
                  }
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar pasaporte"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassportDoc(null);
                    toast.info('Pasaporte removido.');
                  }}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Eliminar pasaporte"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3 h-3 text-blue-600" />
              <span>{currentPassport ? 'Reemplazar Pasaporte' : 'Adjuntar Pasaporte'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handlePassportUpload}
              />
            </label>
          </div>
        </div>

        {/* 3. Estado de Cuenta */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                3. Estado de Cuenta
              </span>
              {currentBankStatement ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {currentBankStatement ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={currentBankStatement.name}>
                  {currentBankStatement.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {currentBankStatement.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                </span>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                <Building2 className="w-6 h-6 text-slate-300" />
                <span>Sin estado de cuenta</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {currentBankStatement && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onPreview('Estado de Cuenta Bancario', currentBankStatement)
                  }
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver estado de cuenta"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDownload(
                      currentBankStatement.url || currentBankStatement.dataUrl,
                      currentBankStatement.name || 'estado_cuenta.pdf'
                    )
                  }
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar estado de cuenta"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentBankStatementDoc(null);
                    toast.info('Estado de cuenta removido.');
                  }}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Eliminar estado de cuenta"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3 h-3 text-blue-600" />
              <span>{currentBankStatement ? 'Reemplazar Estado' : 'Adjuntar Estado'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleBankStatementUpload}
              />
            </label>
          </div>
        </div>

        {/* 4. SEVIS (I-901) - Estudiantes */}
        {isSelectedStudent && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 text-blue-600" />
                  4. SEVIS (I-901)
                </span>
                {currentSevis ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    Adjunto
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                    Sin Archivo
                  </span>
                )}
              </div>

              {currentSevis ? (
                <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                  <p className="text-[11px] font-bold text-blue-950 truncate" title={currentSevis.name}>
                    {currentSevis.name}
                  </p>
                  <span className="text-[9px] font-bold text-blue-700 uppercase">
                    {currentSevis.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                  </span>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                  <Ticket className="w-6 h-6 text-slate-300" />
                  <span>Sin SEVIS I-901</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              {currentSevis && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onPreview('Comprobante SEVIS (I-901)', currentSevis)
                    }
                    className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Ver SEVIS"
                  >
                    <Eye className="w-3 h-3 text-slate-600" />
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onDownload(
                        currentSevis.url || currentSevis.dataUrl,
                        currentSevis.name || 'sevis_i901.pdf'
                      )
                    }
                    className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="Descargar SEVIS"
                  >
                    <Download className="w-3 h-3 text-white" />
                    Descargar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentSevisDoc(null);
                      toast.info('Comprobante SEVIS removido.');
                    }}
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Eliminar SEVIS"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                <Upload className="w-3 h-3 text-blue-600" />
                <span>{currentSevis ? 'Reemplazar SEVIS' : 'Adjuntar SEVIS'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleSevisUpload}
                />
              </label>
            </div>
          </div>
        )}

        {/* 5. Formulario I-20 - Estudiantes */}
        {isSelectedStudent && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                  5. Formulario I-20
                </span>
                {currentI20 ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    Adjunto
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                    Sin Archivo
                  </span>
                )}
              </div>

              {currentI20 ? (
                <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                  <p className="text-[11px] font-bold text-blue-950 truncate" title={currentI20.name}>
                    {currentI20.name}
                  </p>
                  <span className="text-[9px] font-bold text-blue-700 uppercase">
                    {currentI20.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                  </span>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                  <GraduationCap className="w-6 h-6 text-slate-300" />
                  <span>Sin Formulario I-20</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              {currentI20 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onPreview('Formulario I-20 Oficial', currentI20)
                    }
                    className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Ver I-20"
                  >
                    <Eye className="w-3 h-3 text-slate-600" />
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onDownload(
                        currentI20.url || currentI20.dataUrl,
                        currentI20.name || 'formulario_i20.pdf'
                      )
                    }
                    className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="Descargar I-20"
                  >
                    <Download className="w-3 h-3 text-white" />
                    Descargar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentI20Doc(null);
                      toast.info('Formulario I-20 removido.');
                    }}
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Eliminar I-20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                <Upload className="w-3 h-3 text-blue-600" />
                <span>{currentI20 ? 'Reemplazar I-20' : 'Adjuntar I-20'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleI20Upload}
                />
              </label>
            </div>
          </div>
        )}

        {/* 6. Confirmación DS-160 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                {isSelectedStudent ? '6. DS-160 (Confirmación)' : '4. DS-160 (Confirmación)'}
              </span>
              {currentDs160 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {currentDs160 ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={currentDs160.name}>
                  {currentDs160.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {currentDs160.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                </span>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                <FileCheck className="w-6 h-6 text-slate-300" />
                <span>Sin DS-160</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {currentDs160 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onPreview('Hoja de Confirmación DS-160', currentDs160)
                  }
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver DS-160"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDownload(
                      currentDs160.url || currentDs160.dataUrl,
                      currentDs160.name || 'ds160_confirmacion.pdf'
                    )
                  }
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar DS-160"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentDs160Doc(null);
                    toast.info('Confirmación DS-160 removida.');
                  }}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Eliminar DS-160"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3 h-3 text-blue-600" />
              <span>{currentDs160 ? 'Reemplazar DS-160' : 'Adjuntar DS-160'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleDs160Upload}
              />
            </label>
          </div>
        </div>

        {/* 7. Carta de Aceptación - Estudiantes */}
        {isSelectedStudent && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <School className="w-3.5 h-3.5 text-blue-600" />
                  7. Carta de Aceptación
                </span>
                {currentAcceptance ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    Adjunta
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                    Sin Archivo
                  </span>
                )}
              </div>

              {currentAcceptance ? (
                <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                  <p className="text-[11px] font-bold text-blue-950 truncate" title={currentAcceptance.name}>
                    {currentAcceptance.name}
                  </p>
                  <span className="text-[9px] font-bold text-blue-700 uppercase">
                    {currentAcceptance.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                  </span>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                  <School className="w-6 h-6 text-slate-300" />
                  <span>Sin Carta Aceptación</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              {currentAcceptance && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onPreview('Carta de Aceptación de la Escuela', currentAcceptance)
                    }
                    className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Ver carta de aceptación"
                  >
                    <Eye className="w-3 h-3 text-slate-600" />
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onDownload(
                        currentAcceptance.url || currentAcceptance.dataUrl,
                        currentAcceptance.name || 'carta_aceptacion.pdf'
                      )
                    }
                    className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="Descargar carta de aceptación"
                  >
                    <Download className="w-3 h-3 text-white" />
                    Descargar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentAcceptanceLetterDoc(null);
                      toast.info('Carta de aceptación removida.');
                    }}
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Eliminar carta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                <Upload className="w-3 h-3 text-blue-600" />
                <span>{currentAcceptance ? 'Reemplazar Carta' : 'Adjuntar Carta'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleAcceptanceLetterUpload}
                />
              </label>
            </div>
          </div>
        )}

        {/* 8. Affidavit of Support - Estudiantes */}
        {isSelectedStudent && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  8. Affidavit of Support
                </span>
                {currentAffidavit ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                    Adjunto
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                    Sin Archivo
                  </span>
                )}
              </div>

              {currentAffidavit ? (
                <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                  <p className="text-[11px] font-bold text-blue-950 truncate" title={currentAffidavit.name}>
                    {currentAffidavit.name}
                  </p>
                  <span className="text-[9px] font-bold text-blue-700 uppercase">
                    {currentAffidavit.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                  </span>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                  <ShieldCheck className="w-6 h-6 text-slate-300" />
                  <span>Sin Affidavit</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              {currentAffidavit && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onPreview('Affidavit of Support (Patrocinio)', currentAffidavit)
                    }
                    className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Ver affidavit"
                  >
                    <Eye className="w-3 h-3 text-slate-600" />
                    Ver
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onDownload(
                        currentAffidavit.url || currentAffidavit.dataUrl,
                        currentAffidavit.name || 'affidavit_support.pdf'
                      )
                    }
                    className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="Descargar affidavit"
                  >
                    <Download className="w-3 h-3 text-white" />
                    Descargar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentAffidavitDoc(null);
                      toast.info('Affidavit of Support removido.');
                    }}
                    className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Eliminar affidavit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
                <Upload className="w-3 h-3 text-blue-600" />
                <span>{currentAffidavit ? 'Reemplazar Affidavit' : 'Adjuntar Affidavit'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleAffidavitUpload}
                />
              </label>
            </div>
          </div>
        )}

        {/* 9. Comprobante Cita Embajada */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {isSelectedStudent ? '9. Cita Embajada (AIS)' : '5. Cita Embajada (AIS)'}
              </span>
              {currentEmbassy ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {currentEmbassy ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={currentEmbassy.name}>
                  {currentEmbassy.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {currentEmbassy.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                </span>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                <Calendar className="w-6 h-6 text-slate-300" />
                <span>Sin Cita Embajada</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {currentEmbassy && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onPreview('Comprobante Cita Consular Embajada (AIS)', currentEmbassy)
                  }
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver comprobante de cita"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onDownload(
                      currentEmbassy.url || currentEmbassy.dataUrl,
                      currentEmbassy.name || 'cita_embajada.pdf'
                    )
                  }
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar comprobante de cita"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentEmbassyAppointmentDoc(null);
                    toast.info('Comprobante de cita consular removido.');
                  }}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Eliminar comprobante de cita"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3 h-3 text-blue-600" />
              <span>{currentEmbassy ? 'Reemplazar Cita' : 'Adjuntar Cita'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleEmbassyAppointmentUpload}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
