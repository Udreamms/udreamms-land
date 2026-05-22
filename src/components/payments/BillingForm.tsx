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
  'bg-white border-slate-200 h-9 text-sm text-slate-900 placeholder:text-slate-400 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-blue-400';

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
        <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 mb-1.5 block">
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
        <Label htmlFor="email" className="text-xs font-semibold text-slate-700 mb-1.5 block">
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
        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 mb-1.5 block">
          Teléfono
        </Label>
        <div className="flex bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 overflow-hidden h-9">
          <select
            value={data.phonePrefix}
            onChange={(e) => handleChange('phonePrefix', e.target.value)}
            className="bg-slate-50 border-r border-slate-200 text-xs text-slate-700 px-2 focus:outline-none appearance-none cursor-pointer"
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+34">🇪🇸 +34</option>
            <option value="+52">🇲🇽 +52</option>
            <option value="+54">🇦🇷 +54</option>
            <option value="+57">🇨🇴 +57</option>
            <option value="+51">🇵🇪 +51</option>
            <option value="+56">🇨🇱 +56</option>
            <option value="+58">🇻🇪 +58</option>
            <option value="+593">🇪🇨 +593</option>
            <option value="+507">🇵🇦 +507</option>
          </select>
          <Input
            id="phone"
            type="tel"
            placeholder="555 123 4567"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="flex-1 border-none bg-transparent h-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 rounded-none shadow-none px-3"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
          Dirección de facturación
        </Label>
        <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
          <select
            value={data.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className="w-full h-9 bg-slate-50 px-3 text-sm text-slate-900 focus:outline-none border-b border-slate-200 appearance-none cursor-pointer"
          >
            <option value="" disabled>Selecciona país</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Dirección línea 1"
            value={data.addressLine1}
            onChange={(e) => handleChange('addressLine1', e.target.value)}
            className="w-full h-9 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 border-b border-slate-200 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Dirección línea 2 (opcional)"
            value={data.addressLine2}
            onChange={(e) => handleChange('addressLine2', e.target.value)}
            className="w-full h-9 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 border-b border-slate-200 focus:outline-none"
          />

          <div className="flex border-b border-slate-200">
            <input
              type="text"
              placeholder="Ciudad"
              value={data.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-1/2 h-9 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 border-r border-slate-200 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Código postal"
              value={data.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              className="w-1/2 h-9 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Estado / Provincia"
            value={data.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full h-9 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
