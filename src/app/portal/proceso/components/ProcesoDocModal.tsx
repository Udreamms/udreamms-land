'use client';

import React from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttachedDoc } from '../types';

interface ProcesoDocModalProps {
  previewDocModal: {
    title: string;
    doc: AttachedDoc;
  } | null;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export default function ProcesoDocModal({
  previewDocModal,
  onClose,
  onDownload,
}: ProcesoDocModalProps) {
  if (!previewDocModal) return null;

  const isPdf =
    previewDocModal.doc.type === 'application/pdf' ||
    previewDocModal.doc.name.toLowerCase().endsWith('.pdf');

  const fileUrl = previewDocModal.doc.url || previewDocModal.doc.dataUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {isPdf ? 'PDF' : 'IMG'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {previewDocModal.title}
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-sm sm:max-w-md">
                {previewDocModal.doc.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onDownload(fileUrl, previewDocModal.doc.name)}
              className="h-9 px-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Descargar archivo"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Descargar</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-1 overflow-auto bg-slate-100/50 flex items-center justify-center min-h-[400px]">
          {isPdf ? (
            <iframe
              src={fileUrl}
              title={previewDocModal.doc.name}
              className="w-full h-[65vh] rounded-2xl border border-slate-200 bg-white shadow-sm"
            />
          ) : (
            <div className="max-h-[65vh] flex items-center justify-center">
              <img
                src={fileUrl}
                alt={previewDocModal.doc.name}
                className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-md border border-slate-200"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <Button
            onClick={onClose}
            className="h-9 px-5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold"
          >
            Cerrar Visor
          </Button>
        </div>
      </div>
    </div>
  );
}
