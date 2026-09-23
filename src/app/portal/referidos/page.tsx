'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Users,
  DollarSign,
  Sparkles,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Wallet,
  AlertCircle,
  MessageCircle,
  Clock,
  Phone,
  Mail,
  RefreshCw,
} from 'lucide-react';
import { usePortal } from '../PortalContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ClientReferralItem {
  id: string;
  referralName: string;
  referralPhone: string;
  referralEmail?: string;
  visaType: 'F-1' | 'B-2';
  status: 'pendiente' | 'contactado' | 'proceso_iniciado' | 'pagado' | 'descartado';
  rewardPaid: boolean;
  rewardAmount?: number;
  createdAt: string;
}

export default function ReferidosPage() {
  const { user } = usePortal();
  const [simulatedReferrals, setSimulatedReferrals] = useState(5);

  // Form states for direct referral submission
  const [referralName, setReferralName] = useState('');
  const [referralPhone, setReferralPhone] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const [referralVisaType, setReferralVisaType] = useState<'F-1' | 'B-2'>('F-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client's submitted referrals list
  const [myReferrals, setMyReferrals] = useState<ClientReferralItem[]>([]);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(false);

  const fetchMyReferrals = async () => {
    if (!user) return;
    setIsLoadingReferrals(true);
    try {
      const url = `/api/portal/referrals?userId=${encodeURIComponent(user.uid || '')}&email=${encodeURIComponent(user.email || '')}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setMyReferrals(data.referrals || []);
      }
    } catch (err) {
      console.error('Error fetching my referrals:', err);
    } finally {
      setIsLoadingReferrals(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyReferrals();
    }
  }, [user]);

  const handleOpenWhatsAppChat = () => {
    const text = encodeURIComponent(
      `👋 *Registro de Referido - Programa Udreamms*\n\n` +
      `Hola equipo de Udreamms, soy ${user?.displayName || 'cliente registrado'} (${user?.email || 'N/A'}).\n` +
      `Quiero notificar que recomendé a una persona para su trámite de visa.`
    );
    window.open(`https://wa.me/13854162224?text=${text}`, '_blank');
  };

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralName || !referralPhone) {
      toast.error('Por favor completa el nombre y teléfono de tu referido.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save directly to Firestore database via API
      const res = await fetch('/api/portal/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralName,
          referralPhone,
          referralEmail,
          visaType: referralVisaType,
          referrerId: user?.uid || '',
          referrerName: user?.displayName || user?.email || 'Cliente',
          referrerEmail: user?.email || '',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || 'No se pudo guardar el referido');
      }

      // 2. Open WhatsApp optionally to notify immediately
      const message = encodeURIComponent(
        `👋 *Nuevo Referido Registrado desde el Portal*\n\n` +
        `👤 *Cliente Referidor:* ${user?.displayName || 'Cliente Registrado'} (${user?.email || 'N/A'})\n\n` +
        `📌 *Datos del Referido:*\n` +
        `• Nombre: ${referralName}\n` +
        `• Teléfono / WhatsApp: ${referralPhone}\n` +
        `• Correo: ${referralEmail || 'No especificado'}\n` +
        `• Trámite de Interés: ${referralVisaType === 'F-1' ? '🎓 Visa Estudiante (F-1)' : '✈️ Visa Turista (B-2)'}\n\n` +
        `Por favor asesórenlo para iniciar su proceso y vincular mi comisión de $50 USD.`
      );

      // Open WhatsApp notification
      window.open(`https://wa.me/13854162224?text=${message}`, '_blank');

      toast.success('¡Gracias por tu referido! Ha sido registrado correctamente en el sistema.');
      
      // Reset form fields immediately so user can submit another one
      setReferralName('');
      setReferralPhone('');
      setReferralEmail('');
      setReferralVisaType('F-1');

      // Refresh list
      fetchMyReferrals();
    } catch (error: any) {
      toast.error(error?.message || 'Hubo un error al registrar el referido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalReferralsCount = myReferrals.length;
  const paidCount = myReferrals.filter((r) => r.rewardPaid).length;
  const earnedAmount = paidCount * 50;

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '-';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  const getStatusBadge = (status: string, rewardPaid: boolean) => {
    if (rewardPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 border border-emerald-300 text-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>✓ $50 USD Pagados</span>
        </span>
      );
    }

    switch (status) {
      case 'pagado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle2 className="w-3 h-3" />
            <span>Servicio Pagado (Listo para Cobrar)</span>
          </span>
        );
      case 'proceso_iniciado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50 border border-purple-200 text-purple-700">
            <Clock className="w-3 h-3" />
            <span>Trámite en Proceso</span>
          </span>
        );
      case 'contactado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 border border-blue-200 text-blue-700">
            <Clock className="w-3 h-3" />
            <span>En Contacto con Asesor</span>
          </span>
        );
      case 'descartado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-500">
            <span>No Interesado</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 border border-amber-200 text-amber-700">
            <Clock className="w-3 h-3" />
            <span>Pendiente de Contacto</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 text-slate-900 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Programa Oficial de Referidos</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-slate-900">
            Gana $50 USD por cada persona recomendada
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-1 max-w-2xl font-normal">
            Solo debes escribirnos por el chat de tu portal o por WhatsApp indicando a quién referiste, y te entregaremos el valor de $50 USD apenas la persona cubra el valor de su servicio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenWhatsAppChat}
            className="h-10 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Avisar por WhatsApp</span>
          </Button>
        </div>
      </div>

      {/* Important Notice Alert Box */}
      <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-950 shadow-2xs">
        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="space-y-1 leading-relaxed font-normal">
          <p className="font-medium text-amber-900">Condiciones y validez del programa:</p>
          <p className="text-amber-800">
            Esta bonificación de $50 USD aplica por cada persona que contrate un servicio de asesoría de Udreamms, ya sea el servicio básico de Visa Estudiante (F-1) o Visa Turista (B-2) valorado en $380 USD o cualquier paquete de asesoría superior. <em>Nota: Esto no aplica a productos o materiales sueltos que no sean servicios de asesoría migratoria completa.</em>
          </p>
        </div>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: $50 USD Reward */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-emerald-300 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-slate-900">$50 USD por Cliente</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Recibe $50 USD en cuanto tu referido cubra el valor de su servicio de asesoría de Visa F-1 (Estudiante) o Visa B-2 (Turista) a partir del plan básico de $380 USD o cualquier plan superior.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
            <span>Pago directo</span>
            <span>Servicios de Asesoría</span>
          </div>
        </div>

        {/* Card 2: 100% Unlimited */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-blue-300 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-slate-900">Programa Ilimitado</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Puedes ganar con todas las personas que refieras, sin ningún límite: si refieres a 1 persona ganas $50 USD, si refieres a 10 ganas $500 USD ($50 USD por cada una).
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-700 font-medium">
            <span>Sin tope de personas</span>
            <span>Ganancias acumulables</span>
          </div>
        </div>

        {/* Card 3: Fast Payouts */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-purple-300 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-medium text-slate-900">Entrega Inmediata</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Entregamos tu dinero de inmediato mediante Zelle, PayPal, Transferencia Bancaria o Cripto (USDT) apenas tu referido confirme su pago.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-medium">
            <span>Zelle / PayPal / Banco</span>
            <span>Al confirmar el pago</span>
          </div>
        </div>
      </div>

      {/* Quick Direct Actions Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-xs font-normal text-emerald-400 uppercase tracking-wider flex items-center justify-center md:justify-start gap-1.5">
            <MessageCircle className="w-4 h-4" />
            Sin Enlaces Complicados
          </span>
          <h3 className="text-xl md:text-2xl font-medium text-white">
            Solo escríbenos por el chat o por WhatsApp
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            No necesitas enlaces especiales. Solo avísanos quién es tu amigo interesado a través del chat en vivo de tu portal o por nuestro canal de WhatsApp y nosotros nos encargamos de todo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <Button
            onClick={handleOpenWhatsAppChat}
            className="w-full sm:w-auto h-11 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Escribir por WhatsApp</span>
          </Button>
        </div>
      </div>

      {/* Interactive Calculator + Direct Registration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Interactive Earnings Simulator */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              Calculadora de Ganancias
            </div>
            <h3 className="text-2xl font-medium text-slate-900 tracking-tight">
              ¿Cuánto puedes ganar refiriendo?
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Calcula tu ganancia total en dólares en función de cuántas personas recomiendes a Udreamms.
            </p>
          </div>

          {/* Big Number Display - Clean without heavy bold */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-1">
            <span className="text-xs font-normal text-slate-500 uppercase tracking-wider">
              Tus Ganancias Estimadas
            </span>
            <div className="text-5xl md:text-6xl font-normal text-emerald-600 tracking-tight">
              ${simulatedReferrals * 50} <span className="text-2xl font-normal text-slate-400">USD</span>
            </div>
            <p className="text-xs text-slate-600 font-normal pt-1">
              Por referir a <span className="text-slate-900 font-medium">{simulatedReferrals} {simulatedReferrals === 1 ? 'persona' : 'personas'}</span>
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-normal text-slate-700">
              <span>Número de personas recomendadas:</span>
              <span className="text-base text-blue-600 font-medium">{simulatedReferrals} personas</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={simulatedReferrals}
              onChange={(e) => setSimulatedReferrals(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-normal">
              <span>1 persona ($50)</span>
              <span>10 personas ($500)</span>
              <span>20 personas ($1,000)</span>
              <span>30 personas ($1,500)</span>
            </div>
          </div>

          {/* Quick Examples Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { count: 1, amount: '$50 USD' },
              { count: 10, amount: '$500 USD' },
              { count: 20, amount: '$1,000 USD' },
            ].map((tier) => (
              <button
                key={tier.count}
                type="button"
                onClick={() => setSimulatedReferrals(tier.count)}
                className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  simulatedReferrals === tier.count
                    ? 'bg-blue-50 border-blue-400 text-blue-900 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-normal'
                }`}
              >
                <div className="text-[11px] font-normal">{tier.count} {tier.count === 1 ? 'Referido' : 'Referidos'}</div>
                <div className="text-xs font-normal text-emerald-700">{tier.amount}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Referral Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 uppercase tracking-wider">
              <Send className="w-4 h-4" />
              Registrar un Referido Directamente
            </div>
            <h3 className="text-2xl font-medium text-slate-900 tracking-tight">
              ¿Tienes un amigo interesado?
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Ingresa sus datos aquí y nuestro equipo de asesores lo contactará de forma personalizada para brindarle la información y vincular la comisión de $50 USD a tu nombre.
            </p>
          </div>

          <form onSubmit={handleSubmitReferral} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Nombre Completo del Referido</label>
              <Input
                type="text"
                required
                placeholder="Ej. Carlos Mendoza"
                value={referralName}
                onChange={(e) => setReferralName(e.target.value)}
                className="h-11 rounded-xl bg-slate-50 border-slate-200 text-xs text-slate-900 focus:bg-white transition-all font-normal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Celular / WhatsApp</label>
                <Input
                  type="tel"
                  required
                  placeholder="Ej. +51 987 654 321"
                  value={referralPhone}
                  onChange={(e) => setReferralPhone(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-xs text-slate-900 focus:bg-white transition-all font-normal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Correo Electrónico (Opcional)</label>
                <Input
                  type="email"
                  placeholder="carlos@gmail.com"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 border-slate-200 text-xs text-slate-900 focus:bg-white transition-all font-normal"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Tipo de Trámite de Interés</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReferralVisaType('F-1')}
                  className={`h-11 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    referralVisaType === 'F-1'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-normal'
                  }`}
                >
                  <span>🎓</span>
                  <span>Visa Estudiante (F-1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReferralVisaType('B-2')}
                  className={`h-11 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    referralVisaType === 'B-2'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-normal'
                  }`}
                >
                  <span>✈️</span>
                  <span>Visa Turista (B-2)</span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-medium flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-2"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Guardando...' : 'Registrar y Notificar a Asesores'}</span>
            </Button>
          </form>
        </div>
      </div>

      {/* How it Works 3 Steps (Clean Numbers, No heavy bold) */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-medium text-emerald-600 uppercase tracking-widest">
            Flujo Simple
          </span>
          <h3 className="text-2xl font-medium text-slate-900">
            ¿Cómo funciona el cobro de comisiones?
          </h3>
          <p className="text-xs text-slate-500 font-normal">
            3 pasos sencillos para empezar a recibir ingresos por tus recomendaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-normal text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="text-base font-medium text-slate-900">Avísanos por el Chat o WhatsApp</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Solo debes escribir por el chat de tu portal o enviarnos un mensaje de WhatsApp indicando a quién referiste (nombre y contacto).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-normal text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="text-base font-medium text-slate-900">Tu referido inicia su servicio</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              El cliente contrata su servicio de asesoría de Visa F-1 o B-2 (a partir del servicio básico de $380 USD o cualquier plan superior).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-2xs">
            <span className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 font-normal text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="text-base font-medium text-slate-900">¡Recibes tus $50 USD!</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Apenas la persona cubra el valor de su servicio, nuestro equipo te entregará los $50 USD directamente por Zelle, PayPal, transferencia o USDT.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-slate-600" />
          <h3 className="text-xl font-medium text-slate-900">Preguntas Frecuentes sobre el Programa</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-1.5">
            <h5 className="font-medium text-slate-900">¿Necesito tener un plan activo para referir?</h5>
            <p className="text-slate-600 leading-relaxed font-normal">
              Todos aplican, incluso si no compras nada. No es necesario haber contratado ningún servicio ni plan previo; con solo haberte registrado en el portal de Udreamms ya tienes acceso total e inmediato al programa de referidos para generar ingresos recomendando nuestros servicios.
            </p>
          </div>

          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-1.5">
            <h5 className="font-medium text-slate-900">¿Qué servicios califican para los $50 USD?</h5>
            <p className="text-slate-600 leading-relaxed font-normal">
              Aplica exclusivamente para los servicios completos de asesoría de visa de Udreamms (Servicio Básico de Visa F-1 Estudiante o Visa B-2 Turista valorado en $380 USD o cualquier plan superior). <em>No aplica a productos o materiales digitales sueltos que no sean servicios de asesoría.</em>
            </p>
          </div>

          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-1.5">
            <h5 className="font-medium text-slate-900">¿Cómo y cuándo entregan mi dinero?</h5>
            <p className="text-slate-600 leading-relaxed font-normal">
              Apenas tu referido cubra el valor de su servicio de asesoría, nuestro equipo te entregará el valor de $50 USD de inmediato mediante Zelle, PayPal, Transferencia bancaria o Cripto USDT.
            </p>
          </div>

          <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-1.5">
            <h5 className="font-medium text-slate-900">¿Existe algún límite de personas a referir?</h5>
            <p className="text-slate-600 leading-relaxed font-normal">
              No, el programa es 100% ilimitado. Puedes ganar $50 USD por cada persona que refieras: si refieres a 10 personas recibirás $500 USD, a 20 recibirás $1,000 USD y así sucesivamente.
            </p>
          </div>
        </div>
      </div>

      {/* Client's Submitted Referrals Tracking Table */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              Tus Referidos Registrados
            </div>
            <h3 className="text-xl md:text-2xl font-medium text-slate-900">
              Historial y Control de tus Recomendaciones
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Consulta en tiempo real a quiénes has recomendado y el estado de tu comisión de $50 USD.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800">
              Total: <span className="text-blue-600 font-medium">{totalReferralsCount}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-800">
              Ganado: <span className="text-emerald-700 font-medium">${earnedAmount} USD</span>
            </div>
            <Button
              onClick={fetchMyReferrals}
              disabled={isLoadingReferrals}
              variant="outline"
              className="h-8 px-3 rounded-lg border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReferrals ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>

        {myReferrals.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <Gift className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-medium text-slate-800">Aún no has registrado ningún referido</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto font-normal">
              Ingresa los datos de tu primer amigo o familiar en el formulario de arriba para que nuestro equipo lo asesore y recibas tus primeros $50 USD.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Nombre del Referido</th>
                  <th className="py-3 px-4">Teléfono / WhatsApp</th>
                  <th className="py-3 px-4">Trámite</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Estado del Proceso</th>
                  <th className="py-3 px-4 text-right">Comisión ($50 USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">{item.referralName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 font-normal">{item.referralPhone}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          item.visaType === 'F-1'
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                        }`}
                      >
                        {item.visaType === 'F-1' ? '🎓 Estudiante F-1' : '✈️ Turista B-2'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-normal">{formatDate(item.createdAt)}</td>
                    <td className="py-3 px-4">{getStatusBadge(item.status, item.rewardPaid)}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      {item.rewardPaid ? (
                        <span className="text-emerald-600 font-medium">✓ $50 USD Entregados</span>
                      ) : (
                        <span className="text-slate-500 font-normal">Pendiente ($50 USD)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
