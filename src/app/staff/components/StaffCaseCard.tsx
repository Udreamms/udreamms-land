'use client';

import React from 'react';
import {
  User,
  Users,
  Mail,
  Phone,
  School,
  Copy,
  Camera,
  CreditCard,
  Building,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentCase, StaffTabType, isUsableDoc } from '../types';

interface StaffCaseCardProps {
  student: StudentCase;
  groupSize: number;
  onSelectCase: (student: StudentCase) => void;
  onMoveStatus: (caseId: string, newStatus: StaffTabType) => void;
  onStartChat: (student: StudentCase) => void;
  onCopy: (text: string, label: string) => void;
}

export const StaffCaseCard: React.FC<StaffCaseCardProps> = ({
  student,
  groupSize,
  onSelectCase,
  onMoveStatus,
  onStartChat,
  onCopy,
}) => {
  const hasPhoto = Boolean(student.photoUrl);
  const hasPassport = isUsableDoc(student.passportDoc);
  const hasBankStatement = isUsableDoc(student.bankStatementDoc);
  const hasSevis = isUsableDoc(student.sevisDoc);

  return (
    <div
      onClick={() => onSelectCase(student)}
      className="w-full bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-2xl p-4 md:p-5 transition-all duration-200 cursor-pointer flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 group relative overflow-hidden"
    >
      {/* Left side: Photo + Compact Detailed Info */}
      <div className="flex items-start md:items-center gap-4 min-w-0 flex-1">
        {/* 5x5 Photo Thumbnail */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-100 border border-slate-200 group-hover:border-blue-500 overflow-hidden shrink-0 flex items-center justify-center shadow-xs transition-colors">
          {student.photoUrl ? (
            <img
              src={student.photoUrl}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400">
              <User className="w-7 h-7" />
              <span className="text-[9px] font-bold">Sin foto</span>
            </div>
          )}
        </div>

        {/* Student Details */}
        <div className="space-y-1.5 min-w-0 flex-1">
          {/* Row 1: Full Name + Visa Badge + Case ID */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
              {student.name || 'Postulante sin nombre registrado'}
            </h4>

            {student.hasVisaService === false ? (
              <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold uppercase tracking-wide inline-flex items-center gap-1 bg-slate-200 text-slate-600">
                🔒 Sin Servicio Comprado
              </span>
            ) : (
              <span
                className={`h-6 px-2.5 rounded-full text-[10px] font-semibold uppercase tracking-wide inline-flex items-center gap-1 ${
                  student.visaType === 'F-1' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
                }`}
              >
                {student.visaType === 'F-1' ? '🎓 F-1 Estudiante' : '✈️ B-2 Turista'}
              </span>
            )}

            {groupSize > 1 && (
              <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
                <Users className="w-3 h-3" />
                {groupSize} Tarjetas
              </span>
            )}

            <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 font-mono inline-flex items-center">
              {student.id}
            </span>
          </div>

          {/* Row 2: Contact Info & School (Email, Phone, School) */}
          <div className="flex items-center gap-x-4 gap-y-1 text-xs text-slate-600 flex-wrap">
            {/* Email */}
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{student.email || 'Sin correo'}</span>
              {student.email && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(student.email, 'Correo');
                  }}
                  className="p-0.5 hover:text-blue-600 rounded transition-colors cursor-pointer"
                  title="Copiar correo"
                >
                  <Copy className="w-3 h-3 text-slate-400 hover:text-blue-600" />
                </button>
              )}
            </div>

            {/* Phone */}
            {student.phone ? (
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{student.phone}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopy(student.phone, 'Teléfono');
                  }}
                  className="p-0.5 hover:text-emerald-600 rounded transition-colors cursor-pointer"
                  title="Copiar teléfono"
                >
                  <Copy className="w-3 h-3 text-slate-400 hover:text-emerald-600" />
                </button>
              </div>
            ) : (
              <span className="text-slate-400 text-xs italic">Sin teléfono</span>
            )}

            {/* School / State */}
            {student.hasVisaService !== false && (
              <div className="h-6 flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 rounded-full text-xs">
                <School className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{student.schoolName || student.schoolState || 'Utah'}</span>
              </div>
            )}
          </div>

          {/* Row 3: Document Attachment Status Badges & Form Progress */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            {/* Form completion badge */}
            {(() => {
              const filledCount = Object.values(student.formData || {}).filter(Boolean).length;
              if (filledCount >= 10) {
                return (
                  <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border bg-emerald-50 text-emerald-800 border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {filledCount} Datos Consulares Llenos
                  </span>
                );
              } else if (filledCount > 0) {
                return (
                  <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border bg-amber-50 text-amber-800 border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    {filledCount} Datos en Proceso
                  </span>
                );
              } else {
                return (
                  <span className="h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border bg-slate-100 text-slate-600 border-slate-200">
                    <User className="w-3 h-3 text-slate-500" />
                    Cliente Registrado
                  </span>
                );
              }
            })()}

            {/* Document badges */}
            {student.hasVisaService !== false && (
              <>
                <span
                  className={`h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${
                    hasPhoto
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  {hasPhoto ? 'Foto 5x5 ✓' : 'Sin Foto 5x5'}
                </span>

                <span
                  className={`h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${
                    hasPassport
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  <CreditCard className="w-3 h-3" />
                  {hasPassport ? 'Pasaporte ✓' : 'Sin Pasaporte'}
                </span>

                {student.visaType === 'F-1' && (
                  <span
                    className={`h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${
                      hasBankStatement
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                  >
                    <Building className="w-3 h-3" />
                    {hasBankStatement ? 'Edo. Cuenta ✓' : 'Sin Edo. Cuenta'}
                  </span>
                )}

                <span
                  className={`h-6 px-2.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 border ${
                    hasSevis
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  {hasSevis ? 'SEVIS ✓' : 'Sin SEVIS'}
                </span>
              </>
            )}
          </div>

          {/* Notes if available */}
          {student.notes && (
            <p className="text-[11px] text-slate-500 italic truncate max-w-xl">
              {student.notes}
            </p>
          )}
        </div>
      </div>

      {/* Right side: State Selector + Chat Button */}
      <div
        className="flex flex-col sm:flex-row xl:flex-col items-stretch sm:items-center xl:items-end gap-2 w-full xl:w-auto shrink-0 border-t xl:border-t-0 pt-3 xl:pt-0 border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* State selector dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 shrink-0">
            Estado:
          </label>
          <select
            value={student.status}
            onChange={(e) => onMoveStatus(student.id, e.target.value as StaffTabType)}
            className="h-9 px-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-white text-slate-900 text-xs font-semibold transition-all cursor-pointer focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs w-full sm:w-auto"
            title="Cambiar estado del trámite"
          >
            <option value="nuevos">📥 1. Usuarios Registrados</option>
            <option value="aplicacion_escuela">🏫 2. Solicitud de Admisión</option>
            <option value="i20_entregado">📄 3. I-20 Recibido</option>
            <option value="ds160">📝 4. Preparación de Documentos</option>
            <option value="sevis">💳 5. Tasa SEVIS (I-901)</option>
            <option value="comprar_cita">🎟️ 6. Comprar Cita Embajada</option>
            <option value="simulacro_entrevista">🎙️ 7. Simulacro Entrevista</option>
            <option value="entrevista">📅 8. Cita en Embajada</option>
            <option value="aprobados">✅ 9. Aprobados</option>
            <option value="negados">❌ 10. Negados</option>
          </select>
        </div>

        {/* Buttons row: Chat bubble with live notification dot */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            type="button"
            onClick={() => onStartChat(student)}
            className={`relative h-9 w-9 p-0 rounded-xl border font-semibold transition-all shrink-0 flex items-center justify-center shadow-xs cursor-pointer ${
              (student.unreadCount || 0) > 0
                ? 'border-red-300 bg-red-50 hover:bg-red-100 text-red-600 ring-2 ring-red-400/30'
                : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
            }`}
            title={
              (student.unreadCount || 0) > 0
                ? `¡${student.unreadCount} mensaje(s) nuevo(s) de ${student.name || 'este cliente'}!`
                : `Chatear en vivo con ${student.name || 'el postulante'}`
            }
          >
            <MessageCircle
              className={`w-4 h-4 ${(student.unreadCount || 0) > 0 ? 'text-red-600' : 'text-blue-600'}`}
            />

            {/* Live Unread Notification Dot / Badge */}
            {(student.unreadCount || 0) > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 text-[8px] font-black text-white items-center justify-center border-2 border-white shadow-xs">
                  {student.unreadCount! > 9 ? '9+' : student.unreadCount}
                </span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
