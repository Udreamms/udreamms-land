'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface BillingData {
  email: string;
  phonePrefix: string;
  phone: string;
  fullName: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
}

interface BillingFormProps {
  initialEmail?: string;
  onDataChange: (data: BillingData) => void;
  onValidChange: (valid: boolean) => void;
}

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Cuba', 'República Dominicana', 'Ecuador', 'El Salvador', 'Guatemala',
  'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú',
  'Puerto Rico', 'Uruguay', 'Venezuela', 'España', 'Estados Unidos', 'Otros'
];

const inputClass =
  'bg-white/5 border-white/10 h-9 text-sm text-white placeholder:text-slate-500 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50';

const selectClass =
  'bg-transparent text-sm text-white focus:outline-none appearance-none cursor-pointer [color-scheme:dark]';

const optionClass = 'bg-[#111] text-white';

export default function BillingForm({
  initialEmail = '',
  onDataChange,
  onValidChange,
}: BillingFormProps) {
  const [data, setData] = useState<BillingData>({
    email: initialEmail,
    phonePrefix: '+1',
    phone: '',
    fullName: '',
    country: 'Estados Unidos',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const requiredFields: (keyof BillingData)[] = ['email', 'phone', 'fullName', 'country', 'addressLine1', 'city', 'state', 'zipCode'];

  const handleChange = (field: keyof BillingData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);

    const isValid = requiredFields.every((f) => {
      const val = f === field ? value : newData[f];
      return val.trim() !== '';
    });

    const isEmailValid = newData.email.includes('@');

    onValidChange(isValid && isEmailValid);
    onDataChange(newData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fullName" className="text-xs font-semibold text-slate-300 mb-1.5 block">
          Nombre completo
        </Label>
        <Input
          id="fullName"
          placeholder="Juan Pérez"
          value={data.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-xs font-semibold text-slate-300 mb-1.5 block">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={data.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-xs font-semibold text-slate-300 mb-1.5 block">
          Teléfono
        </Label>
        <div className="flex bg-white/5 border border-white/10 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50 overflow-hidden h-9">
          <select
            value={data.phonePrefix}
            onChange={(e) => handleChange('phonePrefix', e.target.value)}
            className={`${selectClass} border-r border-white/10 text-xs text-white/80 px-2 shrink-0`}
          >
            <option value="+1" className={optionClass}>🇺🇸 +1</option>
            <option value="+34" className={optionClass}>🇪🇸 +34</option>
            <option value="+52" className={optionClass}>🇲🇽 +52</option>
            <option value="+54" className={optionClass}>🇦🇷 +54</option>
            <option value="+57" className={optionClass}>🇨🇴 +57</option>
            <option value="+51" className={optionClass}>🇵🇪 +51</option>
            <option value="+56" className={optionClass}>🇨🇱 +56</option>
            <option value="+58" className={optionClass}>🇻🇪 +58</option>
            <option value="+593" className={optionClass}>🇪🇨 +593</option>
            <option value="+507" className={optionClass}>🇵🇦 +507</option>
          </select>
          <Input
            id="phone"
            type="tel"
            placeholder="555 123 4567"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="flex-1 border-none bg-transparent h-9 text-sm text-white placeholder:text-slate-500 focus-visible:ring-0 rounded-none shadow-none px-3"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold text-slate-300 mb-1.5 block">
          Dirección de facturación
        </Label>
        <div className="flex flex-col border border-white/10 rounded-lg overflow-hidden bg-white/5 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/50 transition-all">
          <select
            value={data.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={`w-full h-9 px-3 border-b border-white/10 ${selectClass}`}
          >
            <option value="" disabled className={optionClass}>
              Selecciona país
            </option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country} className={optionClass}>
                {country}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Dirección línea 1"
            value={data.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            className="w-full h-9 bg-transparent px-3 text-sm text-white placeholder:text-slate-500 border-b border-white/10 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Dirección línea 2 (opcional)"
            value={data.addressLine2}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            className="w-full h-9 bg-transparent px-3 text-sm text-white placeholder:text-slate-500 border-b border-white/10 focus:outline-none"
          />

          <div className="flex border-b border-white/10">
            <input
              type="text"
              placeholder="Ciudad"
              value={data.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-1/2 h-9 bg-transparent px-3 text-sm text-white placeholder:text-slate-500 border-r border-white/10 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Código postal"
              value={data.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              className="w-1/2 h-9 bg-transparent px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Estado / Provincia"
            value={data.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full h-9 bg-transparent px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
