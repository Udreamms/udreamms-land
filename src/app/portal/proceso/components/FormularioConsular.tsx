'use client';

import React, { useState, useEffect } from "react";
import { 
  User, 
  BookOpen, 
  Heart, 
  CreditCard, 
  Home, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Plane, 
  PhoneCall, 
  CheckCircle2, 
  Save, 
  ChevronDown, 
  ChevronUp,
  CloudCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePortal } from "../../PortalContext";

interface FormularioConsularProps {
  isStudent: boolean;
  onNameChange?: (name: string) => void;
}

export default function FormularioConsular({ isStudent, onNameChange }: FormularioConsularProps) {
  const { user } = usePortal();
  const storageKey = `udreamms_form_${isStudent ? 'f1' : 'b2'}`;

  // Form State initialized from localStorage if available
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return {}; }
      }
    }
    return {};
  });

  // Background sync to cloud/Firebase
  useEffect(() => {
    if (Object.keys(formData).length === 0) return;

    const timer = setTimeout(async () => {
      try {
        const photoKey = isStudent ? 'udreamms_photo_f1' : 'udreamms_photo_b2';
        const photoUrl = typeof window !== 'undefined' ? localStorage.getItem(photoKey) : null;

        await fetch('/api/portal/submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visaType: isStudent ? 'F-1' : 'B-2',
            formData,
            photoUrl,
            userEmail: user?.email || formData.email_contacto || '',
            userName: user?.displayName || `${formData.nombres || ''} ${formData.apellidos || ''}`.trim(),
            userId: user?.uid || '',
          })
        });
      } catch (err) {
        console.error('Error auto-syncing form to cloud:', err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, isStudent, user]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sec1: true,
    sec2: true,
    sec3: false,
    sec4: false,
    sec5: false,
    sec6: false,
    sec7: false,
    sec8: false,
    sec9: false,
    sec10: false,
    sec11: false,
    sec12: false,
    sec13: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }

      if (field === 'nombres' || field === 'apellidos') {
        const fullName = `${updated.nombres || ''} ${updated.apellidos || ''}`.trim();
        if (onNameChange) {
          onNameChange(fullName);
        }
      }

      return updated;
    });
  };

  return (
    <div className="space-y-6 pt-2">
      
      {/* Auto-save Status Indicator */}
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Guardado automático activado
        </div>
      </div>

      {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec1')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">1. Información Personal</h4>
          </div>
          {openSections.sec1 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec1 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Apellidos</label>
              <Input placeholder="Ej. Pérez Gómez" value={formData['apellidos'] || ''} onChange={e => handleChange('apellidos', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Nombres</label>
              <Input placeholder="Ej. Juan Carlos" value={formData['nombres'] || ''} onChange={e => handleChange('nombres', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de Nacimiento</label>
              <Input type="date" value={formData['fecha_nacimiento'] || ''} onChange={e => handleChange('fecha_nacimiento', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Lugar de Nacimiento</label>
              <Input placeholder="Lugar o clínica/hospital" value={formData['lugar_nacimiento'] || ''} onChange={e => handleChange('lugar_nacimiento', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Ciudad</label>
              <Input placeholder="Ciudad de nacimiento" value={formData['ciudad_nacimiento'] || ''} onChange={e => handleChange('ciudad_nacimiento', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Estado - Departamento - Provincia</label>
              <Input placeholder="Estado o provincia" value={formData['estado_nacimiento'] || ''} onChange={e => handleChange('estado_nacimiento', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">País</label>
              <Input placeholder="País de nacimiento" value={formData['pais_nacimiento'] || ''} onChange={e => handleChange('pais_nacimiento', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Tienes alguna otra nacionalidad?</label>
              <select value={formData['otra_nacionalidad'] || ''} onChange={e => handleChange('otra_nacionalidad', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            {formData['otra_nacionalidad'] === 'Sí' && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">¿Qué País(es)?</label>
                <Input placeholder="Menciona las otras nacionalidades" value={formData['cuales_nacionalidades'] || ''} onChange={e => handleChange('cuales_nacionalidades', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Eres residente permanente de algún otro país?</label>
              <select value={formData['residente_otro_pais'] || ''} onChange={e => handleChange('residente_otro_pais', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            {formData['residente_otro_pais'] === 'Sí' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">¿Qué País(es)?</label>
                <Input placeholder="Menciona el país de residencia" value={formData['que_pais_residencia'] || ''} onChange={e => handleChange('que_pais_residencia', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
              </div>
            )}

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Número de Identificación Nacional de tu país (CURP, DNI, etc.)</label>
              <Input placeholder="Ingresa tu número de documento nacional" value={formData['num_identificacion_nacional'] || ''} onChange={e => handleChange('num_identificacion_nacional', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Te han rechazado la visa? Si la respuesta anterior fue SI, indícanos el motivo, lugar, fecha y tipo de visa rechazada.</label>
              <textarea 
                rows={3}
                placeholder="Detalla si has tenido algún rechazo previo de visa..." 
                value={formData['rechazo_visa_detalle'] || ''} 
                onChange={e => handleChange('rechazo_visa_detalle', e.target.value)} 
                className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" 
              />
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 2: INFORMACIÓN ADICIONAL (SÓLO PARA ESTUDIANTES) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec2')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">
              2. Información adicional (Sólo para estudiantes)
            </h4>
          </div>
          {openSections.sec2 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec2 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Por qué quieres estudiar inglés?</label>
              <textarea 
                rows={3}
                placeholder="Explica las razones académicas o profesionales para estudiar en EE.UU." 
                value={formData['motivo_estudio_ingles'] || ''} 
                onChange={e => handleChange('motivo_estudio_ingles', e.target.value)} 
                className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" 
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Cuánto tiempo quieres estudiar inglés? (3, 6, 12 meses)</label>
              <select value={formData['duracion_estudio'] || ''} onChange={e => handleChange('duracion_estudio', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="3 meses">3 meses</option>
                <option value="6 meses">6 meses</option>
                <option value="12 meses">12 meses</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿En qué horario quieres estudiar? (Mañana, tarde, noche)</label>
              <select value={formData['horario_estudio'] || ''} onChange={e => handleChange('horario_estudio', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
                <option value="Noche">Noche</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Qué semestre quieres comenzar? (Enero, Mayo, Septiembre)</label>
              <select value={formData['semestre_inicio'] || ''} onChange={e => handleChange('semestre_inicio', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="Enero">Enero</option>
                <option value="Mayo">Mayo</option>
                <option value="Septiembre">Septiembre</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Te han rechazado la visa antes?</label>
              <select value={formData['rechazo_estudiante_previo'] || ''} onChange={e => handleChange('rechazo_estudiante_previo', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            {formData['rechazo_estudiante_previo'] === 'Sí' && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">Si la respuesta anterior fue SI, indícanos el motivo, lugar, fecha y tipo de visa rechazada.</label>
                <textarea 
                  rows={3}
                  placeholder="Detalles del rechazo anterior..." 
                  value={formData['detalle_rechazo_estudiante'] || ''} 
                  onChange={e => handleChange('detalle_rechazo_estudiante', e.target.value)} 
                  className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" 
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Estado de los EE.UU. donde estudiarás</label>
              <select 
                value="Utah"
                disabled
                className="w-full h-10 px-3 rounded-md border border-slate-300 bg-slate-100 text-xs text-slate-900 font-bold cursor-not-allowed"
              >
                <option value="Utah">Utah</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Nombre de la escuela en la que estudiarás</label>
              <select 
                value={formData['nombre_escuela'] || ''} 
                onChange={e => handleChange('nombre_escuela', e.target.value)} 
                className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium"
              >
                <option value="">Selecciona una escuela en Utah...</option>
                <option value="Uceda School of Utah (Provo)">Uceda School of Utah (Provo)</option>
                <option value="LANGUAGE ON (Salt Lake City)">LANGUAGE ON (Salt Lake City)</option>
                <option value="Internexus Provo (Campus 1 - Provo)">Internexus Provo (Campus 1 - Provo)</option>
                <option value="Internexus Provo (Campus 2 - Provo)">Internexus Provo (Campus 2 - Provo)</option>
                <option value="American One English Schools INC (West Valley)">American One English Schools INC (West Valley)</option>
                <option value="Lumos Language School (Salt Lake City)">Lumos Language School (Salt Lake City)</option>
                <option value="Lumos Language School (Orem)">Lumos Language School (Orem)</option>
                <option value="INX Academy (Salt Lake City)">INX Academy (Salt Lake City)</option>
                <option value="PACE International Academy (Orem)">PACE International Academy (Orem)</option>
                <option value="U.S. Ling Institute (Murray)">U.S. Ling Institute (Murray)</option>
                <option value="Brigham Young University - Provo">Brigham Young University (Provo)</option>
                <option value="BYU Salt Lake Center (Salt Lake City)">BYU Salt Lake Center (Salt Lake City)</option>
                <option value="Utah Valley University (Orem)">Utah Valley University (Orem)</option>
                <option value="UVU School of Aviation Science (Provo)">UVU School of Aviation Science (Provo)</option>
                <option value="University of Utah (Salt Lake City)">University of Utah (Salt Lake City)</option>
                <option value="Utah State University (Logan)">Utah State University (Logan)</option>
                <option value="Utah State University Eastern (Price)">Utah State University Eastern (Price)</option>
                <option value="Utah State University Flight Training (Logan)">Utah State University Flight Training (Logan)</option>
                <option value="Utah State Univ. Eastern Flight Training (Price)">Utah State Univ. Eastern Flight Training (Price)</option>
                <option value="Southern Utah University (Cedar City)">Southern Utah University (Cedar City)</option>
                <option value="Southern Utah University Aviation (Cedar City)">Southern Utah University Aviation (Cedar City)</option>
                <option value="Weber State University (Ogden)">Weber State University (Ogden)</option>
                <option value="Weber State University Davis (Layton)">Weber State University Davis (Layton)</option>
                <option value="Utah Tech University (St. George)">Utah Tech University (St. George)</option>
                <option value="Snow College">Snow College</option>
                <option value="Salt Lake Community College (Taylorsville Redwood Campus)">Salt Lake Community College (Taylorsville Redwood Campus)</option>
                <option value="Salt Lake Community College (South City Campus)">Salt Lake Community College (South City Campus)</option>
                <option value="Salt Lake Community College (Jordan Campus)">Salt Lake Community College (Jordan Campus)</option>
                <option value="Salt Lake Community College (Miller Campus)">Salt Lake Community College (Miller Campus)</option>
                <option value="Salt Lake Community College (Library Square Center)">Salt Lake Community College (Library Square Center)</option>
                <option value="Salt Lake Community College (Meadowbrook Campus)">Salt Lake Community College (Meadowbrook Campus)</option>
                <option value="Salt Lake Community College (Westpointe Center)">Salt Lake Community College (Westpointe Center)</option>
                <option value="Salt Lake Community College (International Aerospace/Aviation)">Salt Lake Community College (International Aerospace/Aviation)</option>
                <option value="Otra Escuela">Otra Escuela (Ingresar manualmente)</option>
              </select>
            </div>

            {formData['nombre_escuela'] === 'Otra Escuela' && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">Especifica el nombre de la escuela</label>
                <Input 
                  placeholder="Ingresa el nombre oficial de tu institución" 
                  value={formData['escuela_manual_nombre'] || ''} 
                  onChange={e => handleChange('escuela_manual_nombre', e.target.value)} 
                  className="bg-white border-slate-300 text-xs h-10" 
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN 3: ESTADO CIVIL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec3')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">3. Estado Civil</h4>
          </div>
          {openSections.sec3 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec3 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Estado Civil</label>
              <select value={formData['estado_civil'] || ''} onChange={e => handleChange('estado_civil', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="Soltero">Soltero / Soltera</option>
                <option value="Casado">Casado / Casada</option>
                <option value="Divorciado">Divorciado / Divorciada</option>
                <option value="Viudo">Viudo / Viuda</option>
                <option value="Unión Libre">Unión Libre</option>
              </select>
            </div>

            {formData['estado_civil'] === 'Casado' && (
              <>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Nombre del cónyuge</label>
                  <Input placeholder="Nombre completo de tu cónyuge" value={formData['nombre_conyuge'] || ''} onChange={e => handleChange('nombre_conyuge', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Fecha de Matrimonio</label>
                  <Input type="date" value={formData['fecha_matrimonio'] || ''} onChange={e => handleChange('fecha_matrimonio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Fecha de Nacimiento del Cónyuge</label>
                  <Input type="date" value={formData['fecha_nacimiento_conyuge'] || ''} onChange={e => handleChange('fecha_nacimiento_conyuge', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Lugar de Nacimiento del Cónyuge</label>
                  <Input placeholder="Lugar de nacimiento" value={formData['lugar_nacimiento_conyuge'] || ''} onChange={e => handleChange('lugar_nacimiento_conyuge', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Ciudad</label>
                  <Input placeholder="Ciudad" value={formData['ciudad_conyuge'] || ''} onChange={e => handleChange('ciudad_conyuge', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Estado - Departamento - Provincia</label>
                  <Input placeholder="Estado o provincia" value={formData['estado_conyuge'] || ''} onChange={e => handleChange('estado_conyuge', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">País</label>
                  <Input placeholder="País" value={formData['pais_conyuge'] || ''} onChange={e => handleChange('pais_conyuge', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN 4: PASAPORTE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec4')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">4. Pasaporte</h4>
          </div>
          {openSections.sec4 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec4 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Número de Pasaporte</label>
              <Input placeholder="Número oficial de pasaporte" value={formData['num_pasaporte'] || ''} onChange={e => handleChange('num_pasaporte', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Ciudad donde obtuviste tu pasaporte</label>
              <Input placeholder="Ciudad de emisión" value={formData['ciudad_pasaporte'] || ''} onChange={e => handleChange('ciudad_pasaporte', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Estado-Departamento-Provincia donde obtuviste tu pasaporte</label>
              <Input placeholder="Estado o provincia de emisión" value={formData['estado_pasaporte'] || ''} onChange={e => handleChange('estado_pasaporte', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de emisión del pasaporte</label>
              <Input type="date" value={formData['fecha_emision_pasaporte'] || ''} onChange={e => handleChange('fecha_emision_pasaporte', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de expiración del pasaporte</label>
              <Input type="date" value={formData['fecha_expiracion_pasaporte'] || ''} onChange={e => handleChange('fecha_expiracion_pasaporte', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Has perdido tu pasaporte alguna vez?</label>
              <select value={formData['perdio_pasaporte'] || ''} onChange={e => handleChange('perdio_pasaporte', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Tienes visa de turista?</label>
              <select value={formData['tiene_visa_turista'] || ''} onChange={e => handleChange('tiene_visa_turista', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 5: DIRECCIÓN DE DOMICILIO ACTUAL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec5')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">5. Dirección de domicilio actual</h4>
          </div>
          {openSections.sec5 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec5 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Dirección</label>
              <Input placeholder="Calle, número, colonia/barrio" value={formData['direccion_domicilio'] || ''} onChange={e => handleChange('direccion_domicilio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Ciudad</label>
              <Input placeholder="Ciudad actual" value={formData['ciudad_domicilio'] || ''} onChange={e => handleChange('ciudad_domicilio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Estado - Departamento - Provincia</label>
              <Input placeholder="Estado o provincia" value={formData['estado_domicilio'] || ''} onChange={e => handleChange('estado_domicilio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">País</label>
              <Input placeholder="País de residencia" value={formData['pais_domicilio'] || ''} onChange={e => handleChange('pais_domicilio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Código Postal</label>
              <Input placeholder="Código postal" value={formData['cp_domicilio'] || ''} onChange={e => handleChange('cp_domicilio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Número de Celular</label>
              <Input placeholder="+1 234 567 8900" value={formData['celular_contacto'] || ''} onChange={e => handleChange('celular_contacto', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email</label>
              <Input type="email" placeholder="correo@ejemplo.com" value={formData['email_contacto'] || ''} onChange={e => handleChange('email_contacto', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 6: PATROCINADOR / SPONSOR */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec6')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">6. Patrocinador / Sponsor (Sí o No)</h4>
          </div>
          {openSections.sec6 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec6 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Tienes Patrocinador / Sponsor?</label>
              <select value={formData['tiene_patrocinador'] || ''} onChange={e => handleChange('tiene_patrocinador', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            {formData['tiene_patrocinador'] === 'Sí' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Apellidos</label>
                  <Input placeholder="Apellidos del patrocinador" value={formData['sponsor_apellidos'] || ''} onChange={e => handleChange('sponsor_apellidos', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Nombres</label>
                  <Input placeholder="Nombres del patrocinador" value={formData['sponsor_nombres'] || ''} onChange={e => handleChange('sponsor_nombres', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Número de Celular</label>
                  <Input placeholder="Teléfono del patrocinador" value={formData['sponsor_celular'] || ''} onChange={e => handleChange('sponsor_celular', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Email</label>
                  <Input type="email" placeholder="Email del patrocinador" value={formData['sponsor_email'] || ''} onChange={e => handleChange('sponsor_email', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Dirección</label>
                  <Input placeholder="Dirección del patrocinador" value={formData['sponsor_direccion'] || ''} onChange={e => handleChange('sponsor_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Parentesco (Papá, Mamá, Tío, Primo, etc.)</label>
                  <Input placeholder="Relación o parentesco" value={formData['sponsor_parentesco'] || ''} onChange={e => handleChange('sponsor_parentesco', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* SECCIÓN 7: HIJOS */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec7')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">7. Hijos</h4>
          </div>
          {openSections.sec7 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec7 && (
          <div className="p-5 md:p-6 space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Tienes hijos que vendrán contigo? ¿Cuántos?</label>
              <select 
                value={formData['hijos_count'] || '0'} 
                onChange={e => handleChange('hijos_count', e.target.value)} 
                className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium"
              >
                <option value="0">0 (Ninguno)</option>
                <option value="1">1 Hijo</option>
                <option value="2">2 Hijos</option>
                <option value="3">3 Hijos</option>
                <option value="4">4 Hijos</option>
                <option value="5">5 Hijos</option>
                <option value="6">6 Hijos</option>
                <option value="7">7 Hijos</option>
                <option value="8">8 Hijos</option>
                <option value="9">9 Hijos</option>
                <option value="10">10 Hijos</option>
              </select>
            </div>

            {/* Dynamic Children Cards */}
            {Array.from({ length: parseInt(formData['hijos_count'] || '0', 10) || 0 }).map((_, index) => {
              const hijoNum = index + 1;
              return (
                <div key={hijoNum} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hijo N° {hijoNum}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Apellidos</label>
                      <Input 
                        placeholder="Apellidos" 
                        value={formData[`hijo${hijoNum}_apellidos`] || ''} 
                        onChange={e => handleChange(`hijo${hijoNum}_apellidos`, e.target.value)} 
                        className="bg-white border-slate-300 text-xs h-9" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Nombres</label>
                      <Input 
                        placeholder="Nombres" 
                        value={formData[`hijo${hijoNum}_nombres`] || ''} 
                        onChange={e => handleChange(`hijo${hijoNum}_nombres`, e.target.value)} 
                        className="bg-white border-slate-300 text-xs h-9" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Fecha de Nacimiento</label>
                      <Input 
                        type="date" 
                        value={formData[`hijo${hijoNum}_fecha_nac`] || ''} 
                        onChange={e => handleChange(`hijo${hijoNum}_fecha_nac`, e.target.value)} 
                        className="bg-white border-slate-300 text-xs h-9" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-600 block">Número de Pasaporte</label>
                      <Input 
                        placeholder="Número de Pasaporte" 
                        value={formData[`hijo${hijoNum}_pasaporte`] || ''} 
                        onChange={e => handleChange(`hijo${hijoNum}_pasaporte`, e.target.value)} 
                        className="bg-white border-slate-300 text-xs h-9" 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECCIÓN 8: NOMBRE DE TUS PADRES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec8')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">8. Nombre de tus Padres</h4>
          </div>
          {openSections.sec8 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec8 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Nombre Completo Mamá</label>
              <Input placeholder="Nombre completo de la madre" value={formData['nombre_mama'] || ''} onChange={e => handleChange('nombre_mama', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de Nacimiento Mamá</label>
              <Input type="date" value={formData['fecha_nac_mama'] || ''} onChange={e => handleChange('fecha_nac_mama', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Nombre Completo Papá</label>
              <Input placeholder="Nombre completo del padre" value={formData['nombre_papa'] || ''} onChange={e => handleChange('nombre_papa', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de Nacimiento Papá</label>
              <Input type="date" value={formData['fecha_nac_papa'] || ''} onChange={e => handleChange('fecha_nac_papa', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 9: INFORMACIÓN DE TRABAJO */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec9')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">9. Información de Trabajo</h4>
          </div>
          {openSections.sec9 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec9 && (
          <div className="p-5 md:p-6 space-y-6">
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Empleo Actual</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Nombre de la empresa</label>
                  <Input placeholder="Empresa o empleador actual" value={formData['trabajo_empresa'] || ''} onChange={e => handleChange('trabajo_empresa', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Dirección</label>
                  <Input placeholder="Dirección laboral" value={formData['trabajo_direccion'] || ''} onChange={e => handleChange('trabajo_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Ciudad</label>
                  <Input placeholder="Ciudad" value={formData['trabajo_ciudad'] || ''} onChange={e => handleChange('trabajo_ciudad', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Estado</label>
                  <Input placeholder="Estado o provincia" value={formData['trabajo_estado'] || ''} onChange={e => handleChange('trabajo_estado', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Código Postal</label>
                  <Input placeholder="Código postal" value={formData['trabajo_cp'] || ''} onChange={e => handleChange('trabajo_cp', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">País</label>
                  <Input placeholder="País" value={formData['trabajo_pais'] || ''} onChange={e => handleChange('trabajo_pais', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Número de teléfono</label>
                  <Input placeholder="Teléfono de la empresa" value={formData['trabajo_telefono'] || ''} onChange={e => handleChange('trabajo_telefono', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Fecha de Inicio</label>
                  <Input type="date" value={formData['trabajo_fecha_inicio'] || ''} onChange={e => handleChange('trabajo_fecha_inicio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Salario mensual en moneda local</label>
                  <Input placeholder="Monto mensual expresado en moneda local" value={formData['trabajo_salario'] || ''} onChange={e => handleChange('trabajo_salario', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Descripción completa de tu trabajo</label>
                  <textarea rows={3} placeholder="Describe tus responsabilidades principales..." value={formData['trabajo_descripcion'] || ''} onChange={e => handleChange('trabajo_descripcion', e.target.value)} className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">¿Tienes más fuentes de ingreso? Explica</label>
                  <textarea rows={2} placeholder="Otras actividades, rentas, negocios..." value={formData['trabajo_otras_fuentes'] || ''} onChange={e => handleChange('trabajo_otras_fuentes', e.target.value)} className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" />
                </div>
              </div>
            </div>

            {/* Empleo Anterior */}
            <div className="space-y-4 border-t border-slate-200 pt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">¿Tuviste un empleo anterior al actual? (sí/no)</label>
                <select value={formData['trabajo_anterior_si'] || ''} onChange={e => handleChange('trabajo_anterior_si', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                  <option value="">Selecciona...</option>
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </div>

              {formData['trabajo_anterior_si'] === 'Sí' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">Nombre de la Empresa</label>
                    <Input placeholder="Empresa anterior" value={formData['trabajo_ant_empresa'] || ''} onChange={e => handleChange('trabajo_ant_empresa', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">Dirección</label>
                    <Input placeholder="Dirección de la empresa" value={formData['trabajo_ant_direccion'] || ''} onChange={e => handleChange('trabajo_ant_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Ciudad</label>
                    <Input placeholder="Ciudad" value={formData['trabajo_ant_ciudad'] || ''} onChange={e => handleChange('trabajo_ant_ciudad', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Estado</label>
                    <Input placeholder="Estado" value={formData['trabajo_ant_estado'] || ''} onChange={e => handleChange('trabajo_ant_estado', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Código Postal</label>
                    <Input placeholder="Código postal" value={formData['trabajo_ant_cp'] || ''} onChange={e => handleChange('trabajo_ant_cp', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Título de la profesión/labor que desempeñabas</label>
                    <Input placeholder="Cargo desempeñador" value={formData['trabajo_ant_cargo'] || ''} onChange={e => handleChange('trabajo_ant_cargo', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">Nombre y apellido de tu supervisor</label>
                    <Input placeholder="Nombre de supervisor directo" value={formData['trabajo_ant_supervisor'] || ''} onChange={e => handleChange('trabajo_ant_supervisor', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block">Describe un poco lo que hacías</label>
                    <textarea rows={2} placeholder="Resumen de labores anteriores..." value={formData['trabajo_ant_descripcion'] || ''} onChange={e => handleChange('trabajo_ant_descripcion', e.target.value)} className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Fecha de Inicio</label>
                    <Input type="date" value={formData['trabajo_ant_fecha_inicio'] || ''} onChange={e => handleChange('trabajo_ant_fecha_inicio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Fecha de término</label>
                    <Input type="date" value={formData['trabajo_ant_fecha_fin'] || ''} onChange={e => handleChange('trabajo_ant_fecha_fin', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 10: INSTITUCIÓN SECUNDARIA */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec10')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">10. Institución en la que estudiaste (Secundaria)</h4>
          </div>
          {openSections.sec10 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec10 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Nombre de la Institución</label>
              <Input placeholder="Nombre de la colegio o colegio secundario" value={formData['secundaria_nombre'] || ''} onChange={e => handleChange('secundaria_nombre', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Dirección</label>
              <Input placeholder="Dirección de la institución" value={formData['secundaria_direccion'] || ''} onChange={e => handleChange('secundaria_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Indica el nombre del curso o programa</label>
              <Input placeholder="Título de bachiller o diploma obtenido" value={formData['secundaria_programa'] || ''} onChange={e => handleChange('secundaria_programa', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de inicio</label>
              <Input type="date" value={formData['secundaria_fecha_inicio'] || ''} onChange={e => handleChange('secundaria_fecha_inicio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de término</label>
              <Input type="date" value={formData['secundaria_fecha_fin'] || ''} onChange={e => handleChange('secundaria_fecha_fin', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 11: INSTITUCIÓN UNIVERSIDAD/INSTITUTO */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec11')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">11. Institución en la que estudiaste (Universidad / Instituto)</h4>
          </div>
          {openSections.sec11 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec11 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Nombre de la Institución</label>
              <Input placeholder="Nombre de la Universidad o Instituto" value={formData['universidad_nombre'] || ''} onChange={e => handleChange('universidad_nombre', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Dirección</label>
              <Input placeholder="Dirección del campus universitario" value={formData['universidad_direccion'] || ''} onChange={e => handleChange('universidad_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Indica el nombre del curso o programa</label>
              <Input placeholder="Carrera, Licenciatura, Maestría o Programa" value={formData['universidad_programa'] || ''} onChange={e => handleChange('universidad_programa', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de inicio</label>
              <Input type="date" value={formData['universidad_fecha_inicio'] || ''} onChange={e => handleChange('universidad_fecha_inicio', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de término</label>
              <Input type="date" value={formData['universidad_fecha_fin'] || ''} onChange={e => handleChange('universidad_fecha_fin', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 12: INFORMACIÓN REQUERIDA ANTES DE ENTRAR A EE.UU. */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec12')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Plane className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">12. Información requerida antes de entrar a los Estados Unidos</h4>
          </div>
          {openSections.sec12 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec12 && (
          <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Dirección donde te hospedarás en Estados Unidos</label>
              <Input placeholder="Hotel, residencia escolar o domicilio en EE.UU." value={formData['usa_hospedaje_direccion'] || ''} onChange={e => handleChange('usa_hospedaje_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de llegada</label>
              <Input type="date" value={formData['usa_fecha_llegada'] || ''} onChange={e => handleChange('usa_fecha_llegada', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Fecha de Salida</label>
              <Input type="date" value={formData['usa_fecha_salida'] || ''} onChange={e => handleChange('usa_fecha_salida', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Has estado alguna vez en los Estados Unidos? (indicar al menos hasta 5 fechas de inicio a término si corresponde)</label>
              <textarea rows={3} placeholder="Detalla fechas de viajes anteriores a EE.UU..." value={formData['usa_viajes_anteriores'] || ''} onChange={e => handleChange('usa_viajes_anteriores', e.target.value)} className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Has tenido o tienes una visa Americana? (nombre de la embajada donde fue la entrevista, tipo de visa, fecha de emisión, fecha de caducidad, número de visa)</label>
              <textarea rows={3} placeholder="Detalles de visas anteriores obtenidas..." value={formData['usa_visas_anteriores_detalle'] || ''} onChange={e => handleChange('usa_visas_anteriores_detalle', e.target.value)} className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Has cambiado tu número de celular en los últimos 5 años?</label>
              <select value={formData['cambio_celular_5anos'] || ''} onChange={e => handleChange('cambio_celular_5anos', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Ingresa el link de tu Instagram personal</label>
              <Input placeholder="https://instagram.com/tu_usuario" value={formData['link_instagram'] || ''} onChange={e => handleChange('link_instagram', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">Ingresa el link de tu Facebook personal</label>
              <Input placeholder="https://facebook.com/tu_perfil" value={formData['link_facebook'] || ''} onChange={e => handleChange('link_facebook', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">¿Tienes familia viviendo en los Estados Unidos?</label>
              <select value={formData['familia_en_usa'] || ''} onChange={e => handleChange('familia_en_usa', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>

            {formData['familia_en_usa'] === 'Sí' && (
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">Nombre Familiar / Relación / Estado migratorio</label>
                <textarea rows={2} placeholder="Ej: Juan Pérez - Hermano - Residente Permanente" value={formData['familia_usa_detalle'] || ''} onChange={e => handleChange('familia_usa_detalle', e.target.value)} className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" />
              </div>
            )}

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Qué idiomas hablas?</label>
              <Input placeholder="Español, Inglés, Portugués, etc." value={formData['idiomas_habla'] || ''} onChange={e => handleChange('idiomas_habla', e.target.value)} className="bg-white border-slate-300 text-xs h-10" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Has viajado a otros países en los últimos 5 años? (indicar países y fechas de entrada y salida)</label>
              <textarea rows={3} placeholder="Menciona viajes internacionales realizados..." value={formData['viajes_otros_paises_5anos'] || ''} onChange={e => handleChange('viajes_otros_paises_5anos', e.target.value)} className="w-full p-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600" />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block">¿Has servido en el servicio militar?</label>
              <select value={formData['servicio_militar'] || ''} onChange={e => handleChange('servicio_militar', e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 font-medium">
                <option value="">Selecciona...</option>
                <option value="No">No</option>
                <option value="Sí">Sí</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN 13: DOS CONTACTOS DE EMERGENCIA (NO FAMILIARES) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sec13')}
          className="w-full p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-black" />
            <h4 className="text-sm md:text-base font-bold text-slate-900">13. DOS contactos de emergencia (NO FAMILIARES)</h4>
          </div>
          {openSections.sec13 ? <ChevronUp className="w-5 h-5 text-black" /> : <ChevronDown className="w-5 h-5 text-black" />}
        </button>

        {openSections.sec13 && (
          <div className="p-5 md:p-6 space-y-6">
            
            {/* Contacto 1 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contacto de Emergencia N° 1</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Nombre Completo" value={formData['c1_nombre'] || ''} onChange={e => handleChange('c1_nombre', e.target.value)} className="bg-white border-slate-300 text-xs h-9 md:col-span-2" />
                <Input placeholder="Dirección" value={formData['c1_direccion'] || ''} onChange={e => handleChange('c1_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-9 md:col-span-2" />
                <Input placeholder="Ciudad" value={formData['c1_ciudad'] || ''} onChange={e => handleChange('c1_ciudad', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="Estado" value={formData['c1_estado'] || ''} onChange={e => handleChange('c1_estado', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="País" value={formData['c1_pais'] || ''} onChange={e => handleChange('c1_pais', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="Código Postal" value={formData['c1_cp'] || ''} onChange={e => handleChange('c1_cp', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="Número de teléfono" value={formData['c1_telefono'] || ''} onChange={e => handleChange('c1_telefono', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input type="email" placeholder="Correo electrónico" value={formData['c1_email'] || ''} onChange={e => handleChange('c1_email', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
              </div>
            </div>

            {/* Contacto 2 */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contacto de Emergencia N° 2</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input placeholder="Nombre Completo" value={formData['c2_nombre'] || ''} onChange={e => handleChange('c2_nombre', e.target.value)} className="bg-white border-slate-300 text-xs h-9 md:col-span-2" />
                <Input placeholder="Dirección" value={formData['c2_direccion'] || ''} onChange={e => handleChange('c2_direccion', e.target.value)} className="bg-white border-slate-300 text-xs h-9 md:col-span-2" />
                <Input placeholder="Ciudad" value={formData['c2_ciudad'] || ''} onChange={e => handleChange('c2_ciudad', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="Estado" value={formData['c2_estado'] || ''} onChange={e => handleChange('c2_estado', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="País" value={formData['c2_pais'] || ''} onChange={e => handleChange('c2_pais', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="Código Postal" value={formData['c2_cp'] || ''} onChange={e => handleChange('c2_cp', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input placeholder="Número de teléfono" value={formData['c2_telefono'] || ''} onChange={e => handleChange('c2_telefono', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
                <Input type="email" placeholder="Correo electrónico" value={formData['c2_email'] || ''} onChange={e => handleChange('c2_email', e.target.value)} className="bg-white border-slate-300 text-xs h-9" />
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
