'use client';

import React, { useState } from 'react';
import {
  FileText,
  Camera,
  CreditCard,
  Building,
  GraduationCap,
  FileCheck,
  School,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Upload,
  Loader2,
  Trash2,
  Eye,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { StudentCase, isUsableDoc } from '../../types';

export type StaffDossierDocType =
  | 'photo'
  | 'passport'
  | 'bank'
  | 'sevis'
  | 'i20'
  | 'ds160'
  | 'acceptance'
  | 'affidavit'
  | 'embassyAppointment';

interface DossierDocGridProps {
  selectedCaseModal: StudentCase;
  setSelectedCaseModal: React.Dispatch<React.SetStateAction<StudentCase | null>>;
  onCaseUpdated?: () => void;
}

export const DossierDocGrid: React.FC<DossierDocGridProps> = ({
  selectedCaseModal,
  setSelectedCaseModal,
  onCaseUpdated,
}) => {
  const [uploadingDoc, setUploadingDoc] = useState<StaffDossierDocType | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<StaffDossierDocType | null>(null);

  const handleDirectDownload = async (url: string, filename: string) => {
    try {
      if (url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const compressImageFile = (file: File, maxDim = 800, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => resolve(e.target?.result as string);
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleStaffDocUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: StaffDossierDocType
  ) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCaseModal) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error('El archivo excede los 15MB permitidos.');
      e.target.value = '';
      return;
    }

    setUploadingDoc(docType);
    try {
      let dataUrl: string;
      if (file.type.startsWith('image/')) {
        dataUrl = await compressImageFile(file, 800, 0.85);
      } else {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const resUpload = await fetch('/api/portal/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataUrl,
          fileName: file.name,
          contentType: file.type || 'application/pdf',
          email: selectedCaseModal.email || 'staff_upload@udreamms.com',
          docType,
        }),
      });

      let storageUrl = '';
      if (resUpload.ok) {
        const upData = await resUpload.json().catch(() => ({}));
        storageUrl = upData?.url || '';
      }

      if (!storageUrl) {
        storageUrl = dataUrl;
      }

      const patchPayload: any = {
        caseId: selectedCaseModal.id,
        email: selectedCaseModal.email,
        name: selectedCaseModal.name,
        visaType: selectedCaseModal.visaType,
      };

      let updatedFields: Partial<StudentCase> = {};

      if (docType === 'photo') {
        patchPayload.photoUrl = storageUrl;
        updatedFields = { photoUrl: storageUrl };
      } else {
        const docObj = {
          name: file.name,
          type: file.type || 'application/pdf',
          size: file.size,
          url: storageUrl,
          uploadedAt: new Date().toISOString(),
        };
        if (docType === 'passport') {
          patchPayload.passportDoc = docObj;
          updatedFields = { passportDoc: docObj };
        } else if (docType === 'bank') {
          patchPayload.bankStatementDoc = docObj;
          updatedFields = { bankStatementDoc: docObj };
        } else if (docType === 'sevis') {
          patchPayload.sevisDoc = docObj;
          updatedFields = { sevisDoc: docObj };
        } else if (docType === 'i20') {
          patchPayload.i20Doc = docObj;
          updatedFields = { i20Doc: docObj };
        } else if (docType === 'ds160') {
          patchPayload.ds160Doc = docObj;
          updatedFields = { ds160Doc: docObj };
        } else if (docType === 'acceptance') {
          patchPayload.acceptanceLetterDoc = docObj;
          updatedFields = { acceptanceLetterDoc: docObj };
        } else if (docType === 'affidavit') {
          patchPayload.affidavitDoc = docObj;
          updatedFields = { affidavitDoc: docObj };
        } else if (docType === 'embassyAppointment') {
          patchPayload.embassyAppointmentDoc = docObj;
          updatedFields = { embassyAppointmentDoc: docObj };
        }
      }

      const resPatch = await fetch('/api/staff/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload),
      });

      if (!resPatch.ok) {
        const errPatch = await resPatch.json().catch(() => ({}));
        throw new Error(errPatch?.error || 'Error al vincular el documento al expediente');
      }

      setSelectedCaseModal((prev) => (prev ? { ...prev, ...updatedFields } : prev));
      toast.success('Documento adjuntado correctamente al expediente.');
      onCaseUpdated?.();
    } catch (err: any) {
      console.error('Error uploading staff doc:', err);
      toast.error(err?.message || 'No se pudo subir el archivo. Intenta de nuevo.');
    } finally {
      setUploadingDoc(null);
      e.target.value = '';
    }
  };

  const handleStaffDocDelete = async (docType: StaffDossierDocType) => {
    if (!selectedCaseModal) return;
    const labels: Record<StaffDossierDocType, string> = {
      photo: 'la Foto Oficial',
      passport: 'el Pasaporte',
      bank: 'el Estado de Cuenta',
      sevis: 'el Comprobante SEVIS (I-901)',
      i20: 'el Formulario I-20',
      ds160: 'la Confirmación DS-160',
      acceptance: 'la Carta de Aceptación',
      affidavit: 'el Affidavit of Support',
      embassyAppointment: 'el Comprobante de Cita Embajada',
    };
    const confirmed =
      typeof window !== 'undefined'
        ? window.confirm(`¿Estás seguro de eliminar ${labels[docType]} de este expediente?`)
        : false;
    if (!confirmed) return;

    setDeletingDoc(docType);
    try {
      const patchPayload: any = {
        caseId: selectedCaseModal.id,
        email: selectedCaseModal.email,
        name: selectedCaseModal.name,
        visaType: selectedCaseModal.visaType,
      };
      let updatedFields: Partial<StudentCase> = {};

      if (docType === 'photo') {
        patchPayload.photoUrl = null;
        updatedFields = { photoUrl: '' };
      } else if (docType === 'passport') {
        patchPayload.passportDoc = null;
        updatedFields = { passportDoc: undefined };
      } else if (docType === 'bank') {
        patchPayload.bankStatementDoc = null;
        updatedFields = { bankStatementDoc: undefined };
      } else if (docType === 'sevis') {
        patchPayload.sevisDoc = null;
        updatedFields = { sevisDoc: undefined };
      } else if (docType === 'i20') {
        patchPayload.i20Doc = null;
        updatedFields = { i20Doc: undefined };
      } else if (docType === 'ds160') {
        patchPayload.ds160Doc = null;
        updatedFields = { ds160Doc: undefined };
      } else if (docType === 'acceptance') {
        patchPayload.acceptanceLetterDoc = null;
        updatedFields = { acceptanceLetterDoc: undefined };
      } else if (docType === 'affidavit') {
        patchPayload.affidavitDoc = null;
        updatedFields = { affidavitDoc: undefined };
      } else if (docType === 'embassyAppointment') {
        patchPayload.embassyAppointmentDoc = null;
        updatedFields = { embassyAppointmentDoc: undefined };
      }

      const res = await fetch('/api/staff/cases', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Error al eliminar el documento');
      }

      setSelectedCaseModal((prev) => (prev ? { ...prev, ...updatedFields } : prev));
      toast.success('Documento eliminado del expediente.');
      onCaseUpdated?.();
    } catch (err: any) {
      console.error('Error deleting staff doc:', err);
      toast.error(err?.message || 'No se pudo eliminar el documento.');
    } finally {
      setDeletingDoc(null);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Documentos y Archivos Adjuntos del Expediente
          </h4>
          <p className="text-[11px] text-slate-500">
            Tanto el cliente como el staff pueden adjuntar, visualizar, reemplazar o eliminar documentos oficiales.
          </p>
        </div>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto shadow-2xs">
          9 Documentos Oficiales
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
              {selectedCaseModal.photoUrl ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunta
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Foto
                </span>
              )}
            </div>

            {selectedCaseModal.photoUrl ? (
              <a
                href={selectedCaseModal.photoUrl}
                target="_blank"
                rel="noreferrer"
                download="foto_oficial_5x5.jpg"
                className="w-20 h-20 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-inner group relative block cursor-pointer"
                title="Clic para abrir y descargar la foto"
              >
                <img src={selectedCaseModal.photoUrl} alt="Foto Oficial 5x5" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ExternalLink className="w-4 h-4" />
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
            {selectedCaseModal.photoUrl && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver foto oficial"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.photoUrl!, `${(selectedCaseModal.name || 'foto_5x5').replace(/\s+/g, '_')}_5x5.jpg`)}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar foto oficial"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('photo')}
                  disabled={deletingDoc === 'photo'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar foto"
                >
                  {deletingDoc === 'photo' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'photo' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{selectedCaseModal.photoUrl ? 'Reemplazar Foto' : 'Adjuntar Foto'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingDoc === 'photo'}
                onChange={(e) => handleStaffDocUpload(e, 'photo')}
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
              {isUsableDoc(selectedCaseModal.passportDoc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.passportDoc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.passportDoc!.name}>
                  {selectedCaseModal.passportDoc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.passportDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
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
            {isUsableDoc(selectedCaseModal.passportDoc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.passportDoc!.url || selectedCaseModal.passportDoc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver pasaporte"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.passportDoc!.url || selectedCaseModal.passportDoc!.dataUrl!, selectedCaseModal.passportDoc!.name || 'pasaporte.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar pasaporte"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('passport')}
                  disabled={deletingDoc === 'passport'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar pasaporte"
                >
                  {deletingDoc === 'passport' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'passport' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.passportDoc) ? 'Reemplazar Pasaporte' : 'Adjuntar Pasaporte'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'passport'}
                onChange={(e) => handleStaffDocUpload(e, 'passport')}
              />
            </label>
          </div>
        </div>

        {/* 3. Estado de Cuenta */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                3. Estado de Cuenta
              </span>
              {isUsableDoc(selectedCaseModal.bankStatementDoc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.bankStatementDoc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.bankStatementDoc!.name}>
                  {selectedCaseModal.bankStatementDoc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.bankStatementDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                </span>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                <Building className="w-6 h-6 text-slate-300" />
                <span>Sin estado de cuenta</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {isUsableDoc(selectedCaseModal.bankStatementDoc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.bankStatementDoc!.url || selectedCaseModal.bankStatementDoc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver estado de cuenta"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.bankStatementDoc!.url || selectedCaseModal.bankStatementDoc!.dataUrl!, selectedCaseModal.bankStatementDoc!.name || 'estado_cuenta.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar estado de cuenta"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('bank')}
                  disabled={deletingDoc === 'bank'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar estado de cuenta"
                >
                  {deletingDoc === 'bank' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'bank' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.bankStatementDoc) ? 'Reemplazar Estado' : 'Adjuntar Estado'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'bank'}
                onChange={(e) => handleStaffDocUpload(e, 'bank')}
              />
            </label>
          </div>
        </div>

        {/* 4. Comprobante SEVIS (I-901) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                4. SEVIS (I-901)
              </span>
              {isUsableDoc(selectedCaseModal.sevisDoc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.sevisDoc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.sevisDoc!.name}>
                  {selectedCaseModal.sevisDoc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.sevisDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
                </span>
              </div>
            ) : (
              <div className="py-4 text-center text-slate-400 text-[11px] flex flex-col items-center gap-1">
                <FileText className="w-6 h-6 text-slate-300" />
                <span>Sin SEVIS I-901</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 pt-1">
            {isUsableDoc(selectedCaseModal.sevisDoc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.sevisDoc!.url || selectedCaseModal.sevisDoc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver SEVIS"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.sevisDoc!.url || selectedCaseModal.sevisDoc!.dataUrl!, selectedCaseModal.sevisDoc!.name || 'sevis_i901.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar SEVIS"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('sevis')}
                  disabled={deletingDoc === 'sevis'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar SEVIS"
                >
                  {deletingDoc === 'sevis' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'sevis' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.sevisDoc) ? 'Reemplazar SEVIS' : 'Adjuntar SEVIS'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'sevis'}
                onChange={(e) => handleStaffDocUpload(e, 'sevis')}
              />
            </label>
          </div>
        </div>

        {/* 5. Formulario I-20 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                5. Formulario I-20
              </span>
              {isUsableDoc(selectedCaseModal.i20Doc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.i20Doc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.i20Doc!.name}>
                  {selectedCaseModal.i20Doc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.i20Doc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
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
            {isUsableDoc(selectedCaseModal.i20Doc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.i20Doc!.url || selectedCaseModal.i20Doc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver I-20"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.i20Doc!.url || selectedCaseModal.i20Doc!.dataUrl!, selectedCaseModal.i20Doc!.name || 'formulario_i20.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar I-20"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('i20')}
                  disabled={deletingDoc === 'i20'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar I-20"
                >
                  {deletingDoc === 'i20' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'i20' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.i20Doc) ? 'Reemplazar I-20' : 'Adjuntar I-20'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'i20'}
                onChange={(e) => handleStaffDocUpload(e, 'i20')}
              />
            </label>
          </div>
        </div>

        {/* 6. Confirmación DS-160 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                6. DS-160 (Confirmación)
              </span>
              {isUsableDoc(selectedCaseModal.ds160Doc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.ds160Doc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.ds160Doc!.name}>
                  {selectedCaseModal.ds160Doc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.ds160Doc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
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
            {isUsableDoc(selectedCaseModal.ds160Doc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.ds160Doc!.url || selectedCaseModal.ds160Doc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver DS-160"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.ds160Doc!.url || selectedCaseModal.ds160Doc!.dataUrl!, selectedCaseModal.ds160Doc!.name || 'ds160_confirmacion.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar DS-160"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('ds160')}
                  disabled={deletingDoc === 'ds160'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar DS-160"
                >
                  {deletingDoc === 'ds160' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'ds160' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.ds160Doc) ? 'Reemplazar DS-160' : 'Adjuntar DS-160'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'ds160'}
                onChange={(e) => handleStaffDocUpload(e, 'ds160')}
              />
            </label>
          </div>
        </div>

        {/* 7. Carta de Aceptación */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-blue-600" />
                7. Carta de Aceptación
              </span>
              {isUsableDoc(selectedCaseModal.acceptanceLetterDoc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunta
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.acceptanceLetterDoc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.acceptanceLetterDoc!.name}>
                  {selectedCaseModal.acceptanceLetterDoc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.acceptanceLetterDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
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
            {isUsableDoc(selectedCaseModal.acceptanceLetterDoc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.acceptanceLetterDoc!.url || selectedCaseModal.acceptanceLetterDoc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver carta de aceptación"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.acceptanceLetterDoc!.url || selectedCaseModal.acceptanceLetterDoc!.dataUrl!, selectedCaseModal.acceptanceLetterDoc!.name || 'carta_aceptacion.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar carta de aceptación"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('acceptance')}
                  disabled={deletingDoc === 'acceptance'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar carta"
                >
                  {deletingDoc === 'acceptance' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'acceptance' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.acceptanceLetterDoc) ? 'Reemplazar Carta' : 'Adjuntar Carta'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'acceptance'}
                onChange={(e) => handleStaffDocUpload(e, 'acceptance')}
              />
            </label>
          </div>
        </div>

        {/* 8. Affidavit Support */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                8. Affidavit of Support
              </span>
              {isUsableDoc(selectedCaseModal.affidavitDoc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.affidavitDoc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.affidavitDoc!.name}>
                  {selectedCaseModal.affidavitDoc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.affidavitDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
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
            {isUsableDoc(selectedCaseModal.affidavitDoc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.affidavitDoc!.url || selectedCaseModal.affidavitDoc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver affidavit"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.affidavitDoc!.url || selectedCaseModal.affidavitDoc!.dataUrl!, selectedCaseModal.affidavitDoc!.name || 'affidavit_support.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar affidavit"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('affidavit')}
                  disabled={deletingDoc === 'affidavit'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar affidavit"
                >
                  {deletingDoc === 'affidavit' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'affidavit' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.affidavitDoc) ? 'Reemplazar Affidavit' : 'Adjuntar Affidavit'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'affidavit'}
                onChange={(e) => handleStaffDocUpload(e, 'affidavit')}
              />
            </label>
          </div>
        </div>

        {/* 9. Comprobante Cita Embajada */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs relative">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                9. Cita Embajada (AIS)
              </span>
              {isUsableDoc(selectedCaseModal.embassyAppointmentDoc) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                  Adjunto
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9px] font-bold">
                  Sin Archivo
                </span>
              )}
            </div>

            {isUsableDoc(selectedCaseModal.embassyAppointmentDoc) ? (
              <div className="p-2 rounded-xl bg-blue-50/50 border border-blue-100 text-center">
                <p className="text-[11px] font-bold text-blue-950 truncate" title={selectedCaseModal.embassyAppointmentDoc!.name}>
                  {selectedCaseModal.embassyAppointmentDoc!.name}
                </p>
                <span className="text-[9px] font-bold text-blue-700 uppercase">
                  {selectedCaseModal.embassyAppointmentDoc!.type === 'application/pdf' ? 'Documento PDF' : 'Imagen'}
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
            {isUsableDoc(selectedCaseModal.embassyAppointmentDoc) && (
              <div className="flex items-center gap-1.5">
                <a
                  href={selectedCaseModal.embassyAppointmentDoc!.url || selectedCaseModal.embassyAppointmentDoc!.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Ver comprobante de cita"
                >
                  <Eye className="w-3 h-3 text-slate-600" />
                  Ver
                </a>
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedCaseModal.embassyAppointmentDoc!.url || selectedCaseModal.embassyAppointmentDoc!.dataUrl!, selectedCaseModal.embassyAppointmentDoc!.name || 'cita_embajada.pdf')}
                  className="flex-1 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                  title="Descargar comprobante de cita"
                >
                  <Download className="w-3 h-3 text-white" />
                  Descargar
                </button>
                <button
                  type="button"
                  onClick={() => handleStaffDocDelete('embassyAppointment')}
                  disabled={deletingDoc === 'embassyAppointment'}
                  className="h-7 w-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Eliminar comprobante de cita"
                >
                  {deletingDoc === 'embassyAppointment' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            <label className="w-full h-7 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer">
              {uploadingDoc === 'embassyAppointment' ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span>Subiendo...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-blue-600" />
                  <span>{isUsableDoc(selectedCaseModal.embassyAppointmentDoc) ? 'Reemplazar Cita' : 'Adjuntar Cita'}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                disabled={uploadingDoc === 'embassyAppointment'}
                onChange={(e) => handleStaffDocUpload(e, 'embassyAppointment')}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
