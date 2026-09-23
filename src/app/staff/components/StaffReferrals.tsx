'use client';

import React, { useState, useEffect } from 'react';
import {
  Gift,
  Users,
  DollarSign,
  Search,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Clock,
  Trash2,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface ReferralRecord {
  id: string;
  referralName: string;
  referralPhone: string;
  referralEmail?: string;
  visaType: 'F-1' | 'B-2';
  referrerId?: string;
  referrerName?: string;
  referrerEmail?: string;
  status: 'pendiente' | 'contactado' | 'proceso_iniciado' | 'pagado' | 'descartado';
  rewardPaid: boolean;
  rewardAmount?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export const StaffReferrals: React.FC = () => {
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReferrals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/staff/referrals');
      const data = await res.json();
      if (res.ok) {
        setReferrals(data.referrals || []);
      } else {
        toast.error(data?.error || 'Error al cargar referidos.');
      }
    } catch (err) {
      console.error('Error loading referrals:', err);
      toast.error('Error al cargar la lista de referidos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/staff/referrals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setReferrals((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
        );
        toast.success('Estado actualizado correctamente.');
      } else {
        toast.error('No se pudo actualizar el estado.');
      }
    } catch {
      toast.error('Error de conexión al actualizar.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleRewardPaid = async (id: string, currentVal: boolean) => {
    setUpdatingId(id);
    const nextVal = !currentVal;
    try {
      const res = await fetch('/api/staff/referrals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, rewardPaid: nextVal }),
      });
      if (res.ok) {
        setReferrals((prev) =>
          prev.map((r) => (r.id === id ? { ...r, rewardPaid: nextVal } : r))
        );
        toast.success(nextVal ? '✓ Comisión de $50 marcada como PAGADA.' : 'Comisión marcada como PENDIENTE.');
      } else {
        toast.error('No se pudo actualizar el estado del pago.');
      }
    } catch {
      toast.error('Error de conexión al actualizar.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      await fetch('/api/staff/referrals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, notes }),
      });
      setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, notes } : r)));
    } catch {
      console.warn('Could not autosave notes');
    }
  };

  const handleDelete = async (referral: ReferralRecord) => {
    const ok = window.confirm(`¿Eliminar el registro de referido "${referral.referralName}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/staff/referrals?id=${encodeURIComponent(referral.id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReferrals((prev) => prev.filter((r) => r.id !== referral.id));
        toast.success('Registro de referido eliminado.');
      } else {
        toast.error('No se pudo eliminar el registro.');
      }
    } catch {
      toast.error('Error de conexión.');
    }
  };

  const filteredReferrals = referrals.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      r.referralName.toLowerCase().includes(q) ||
      (r.referralPhone && r.referralPhone.toLowerCase().includes(q)) ||
      (r.referralEmail && r.referralEmail.toLowerCase().includes(q)) ||
      (r.referrerName && r.referrerName.toLowerCase().includes(q)) ||
      (r.referrerEmail && r.referrerEmail.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const totalReferrals = referrals.length;
  const pendingContact = referrals.filter((r) => r.status === 'pendiente').length;
  const paidRewards = referrals.filter((r) => r.rewardPaid).length;

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6 w-full pb-16">
      {/* Top Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-medium uppercase tracking-widest inline-flex items-center gap-1.5">
            <Gift className="w-3 h-3 text-emerald-700" />
            Control de Prospectos y Comisiones
          </span>
          <h2 className="text-xl md:text-2xl font-medium tracking-tight text-slate-900 pt-1">
            Programa de Referidos
          </h2>
          <p className="text-xs text-slate-500 font-normal">
            Gestiona los prospectos enviados por los alumnos y asigna la comisión de $50 USD por cada cliente confirmado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchReferrals}
            disabled={isLoading}
            variant="outline"
            className="h-9 px-4 rounded-full border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-black ${isLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards (Clean numbers without heavy bold) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Total Referidos</span>
            <span className="text-2xl font-normal text-slate-900">{totalReferrals}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Pendientes de Contacto</span>
            <span className="text-2xl font-normal text-amber-600">{pendingContact}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Comisiones $50 Pagadas</span>
            <span className="text-2xl font-normal text-emerald-600">{paidRewards} (${paidRewards * 50} USD)</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nombre de referido, celular o cliente que refirió..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl focus:bg-white w-full font-normal"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto shrink-0">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pendiente', label: 'Pendientes' },
            { id: 'contactado', label: 'En Contacto' },
            { id: 'proceso_iniciado', label: 'En Trámite' },
            { id: 'pagado', label: 'Pagados' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Referrals List Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {filteredReferrals.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No se encontraron referidos</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
              Los referidos que los clientes registren en su portal aparecerán aquí de forma inmediata.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Referido (Prospecto)</th>
                  <th className="py-3 px-4">Trámite</th>
                  <th className="py-3 px-4">Cliente que Refirió</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Estado Asesoría</th>
                  <th className="py-3 px-4">Comisión ($50 USD)</th>
                  <th className="py-3 px-4">Notas Asesor</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredReferrals.map((r) => {
                  const cleanPhone = (r.referralPhone || '').replace(/[^0-9]/g, '');
                  const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hola ${r.referralName}, te saludamos de Udreamms. ${r.referrerName ? `${r.referrerName} nos recomendó contactarte` : 'Recibimos tu solicitud'} para asesorarte con tu ${r.visaType === 'F-1' ? 'Visa de Estudiante F-1' : 'Visa de Turista B-2'}. ¿En qué podemos ayudarte?`
                  )}`;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Referido Info */}
                      <td className="py-3.5 px-4 font-normal">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 text-sm">{r.referralName}</span>
                          {(r.referralName.includes('Ejemplo') || r.referrerId === 'demo_user_001') && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-normal bg-amber-50 border border-amber-200 text-amber-800">
                              Ejemplo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                          <span className="flex items-center gap-1 font-mono font-normal">
                            <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                            {r.referralPhone}
                          </span>
                          {r.referralEmail && (
                            <span className="flex items-center gap-1 font-normal">
                              <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                              {r.referralEmail}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Visa Type */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                            r.visaType === 'F-1'
                              ? 'bg-blue-50 border-blue-200 text-blue-800'
                              : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                          }`}
                        >
                          <span>{r.visaType === 'F-1' ? '🎓 Estudiante F-1' : '✈️ Turista B-2'}</span>
                        </span>
                      </td>

                      {/* Referrer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{r.referrerName || 'Cliente'}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{r.referrerEmail || '-'}</div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap font-normal">
                        {formatDate(r.createdAt)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={r.status}
                          disabled={updatingId === r.id}
                          onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                          className="h-8 px-2 rounded-lg bg-slate-50 border border-slate-300 text-xs font-medium text-slate-800 cursor-pointer focus:outline-none focus:border-blue-500 shadow-2xs"
                        >
                          <option value="pendiente">🟡 1. Pendiente Contacto</option>
                          <option value="contactado">🔵 2. En Contacto</option>
                          <option value="proceso_iniciado">🟣 3. Trámite Iniciado</option>
                          <option value="pagado">🟢 4. Servicio Pagado</option>
                          <option value="descartado">⚪ 5. Descartado / No Interesado</option>
                        </select>
                      </td>

                      {/* Reward Paid Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={updatingId === r.id}
                          onClick={() => handleToggleRewardPaid(r.id, r.rewardPaid)}
                          className={`h-7 px-2.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs ${
                            r.rewardPaid
                              ? 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                          }`}
                          title="Clic para alternar estado de pago de la comisión de $50 USD"
                        >
                          {r.rewardPaid ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>✓ $50 Pagados</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Pendiente ($50)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Internal Notes */}
                      <td className="py-3.5 px-4 min-w-[160px]">
                        <input
                          type="text"
                          defaultValue={r.notes || ''}
                          placeholder="Añadir nota..."
                          onBlur={(e) => {
                            if (e.target.value !== (r.notes || '')) {
                              handleUpdateNotes(r.id, e.target.value);
                            }
                          }}
                          className="w-full h-7 px-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-800 focus:bg-white focus:border-blue-400 transition-all font-normal"
                        />
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {cleanPhone && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                              title="Abrir chat de WhatsApp con el referido"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(r)}
                            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Eliminar referido"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
