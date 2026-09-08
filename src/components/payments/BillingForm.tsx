'use client';

import { useState } from 'react';
import { ChevronDown, Mail, User } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './billing-form-phone.css';

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
  initialFullName?: string;
  onDataChange: (data: BillingData) => void;
  onValidChange: (valid: boolean) => void;
  theme?: 'light' | 'dark';
  compact?: boolean;
  showAddress?: boolean;
}

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Cuba', 'República Dominicana', 'Ecuador', 'El Salvador', 'Guatemala',
  'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú',
  'Puerto Rico', 'Uruguay', 'Venezuela', 'España', 'Estados Unidos', 'Otros',
];

const contactRequiredFields: (keyof BillingData)[] = ['email', 'phone', 'fullName'];

function validateContact(data: BillingData) {
  const isContactValid = contactRequiredFields.every((f) => data[f].trim() !== '');
  const isEmailValid = data.email.includes('@');
  const hasPhone = data.phone.trim().length >= 6;
  return isContactValid && isEmailValid && hasPhone;
}

export default function BillingForm({
  initialEmail = '',
  initialFullName = '',
  onDataChange,
  onValidChange,
  theme = 'dark',
  compact = false,
  showAddress = true,
}: BillingFormProps) {
  const [manualAddress, setManualAddress] = useState(false);
  const [data, setData] = useState<BillingData>({
    email: initialEmail,
    phonePrefix: '+1',
    phone: '',
    fullName: initialFullName,
    country: 'Estados Unidos',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const phoneInputValue = `${data.phonePrefix.replace(/\D/g, '')}${data.phone.replace(/\D/g, '')}`;

  const commitData = (newData: BillingData) => {
    setData(newData);
    onValidChange(validateContact(newData));
    onDataChange(newData);
  };

  const handleChange = (field: keyof BillingData, value: string) => {
    commitData({ ...data, [field]: value });
  };

  const handlePhoneChange = (value: string, country: { dialCode: string }) => {
    const dialCode = country.dialCode;
    const prefix = `+${dialCode}`;
    const local = value.startsWith(dialCode) ? value.slice(dialCode.length) : value;
    commitData({ ...data, phonePrefix: prefix, phone: local });
  };

  const isLight = theme === 'light';

  const rowInputClass = isLight
    ? `w-full ${compact ? 'h-9 text-xs' : 'h-10 text-sm'} bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none`
    : `w-full ${compact ? 'h-9 text-xs' : 'h-10 text-sm'} bg-transparent text-white placeholder:text-slate-500 focus:outline-none`;

  const selectClass = isLight
    ? `w-full ${compact ? 'h-9 text-xs' : 'h-10 text-sm'} bg-transparent text-slate-900 focus:outline-none appearance-none cursor-pointer [color-scheme:light]`
    : `w-full ${compact ? 'h-9 text-xs' : 'h-10 text-sm'} bg-transparent text-white focus:outline-none appearance-none cursor-pointer [color-scheme:dark]`;

  const optionClass = isLight ? 'bg-white text-slate-900' : 'bg-[#111] text-white';

  return (
    <div className={compact ? 'space-y-3' : 'space-y-5'} suppressHydrationWarning>
      <div>
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-400'} mb-1.5`}>
          Datos de contacto
        </p>
        <div className={`rounded-xl border ${isLight ? 'border-slate-200/90 bg-slate-50/70 shadow-2xs' : 'border-white/10 bg-transparent'}`}>
          <div className={`divide-y ${isLight ? 'divide-slate-200/70' : 'divide-white/10'} overflow-hidden rounded-t-xl`}>
            <div className={`flex items-center gap-2.5 px-3.5 ${compact ? 'h-9' : 'h-11'} ${isLight ? 'focus-within:bg-white' : 'focus-within:bg-white/[0.03]'}`}>
              <Mail className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'} shrink-0`} strokeWidth={1.5} />
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={rowInputClass}
              />
            </div>

            <div className={`flex items-center gap-2.5 px-3.5 ${compact ? 'h-9' : 'h-11'} ${isLight ? 'focus-within:bg-white' : 'focus-within:bg-white/[0.03]'}`}>
              <User className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'} shrink-0`} strokeWidth={1.5} />
              <input
                id="fullName"
                type="text"
                placeholder="Nombre completo"
                value={data.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={rowInputClass}
              />
            </div>
          </div>

          <div className={`relative z-30 border-t ${isLight ? 'border-slate-200/70' : 'border-white/10'} px-2 ${compact ? 'h-9.5' : 'h-11'} billing-phone-field ${isLight ? 'light' : ''}`}>
            <PhoneInput
              country="us"
              value={phoneInputValue}
              onChange={handlePhoneChange}
              enableSearch
              searchPlaceholder="Buscar país..."
              preferredCountries={['us', 'mx', 'co', 've', 'ar', 'cl', 'pe', 'es', 'ec', 'pa']}
              placeholder="(201) 555-0123"
              inputProps={{ id: 'phone', name: 'phone' }}
              dropdownClass="billing-phone-dropdown"
            />
          </div>
        </div>
      </div>

      {showAddress && (
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-400'} mb-1.5`}>
            Dirección de facturación
          </p>
          <div className={`rounded-xl border ${isLight ? 'border-slate-200/90 bg-slate-50/70' : 'border-white/10 bg-transparent'} overflow-hidden divide-y ${isLight ? 'divide-slate-200/70' : 'divide-white/10'}`}>
            <div className={`relative flex items-center px-3.5 ${compact ? 'h-9' : 'h-11'}`}>
              <select
                value={data.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className={`${selectClass} pr-8`}
                aria-label="País"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country} className={optionClass}>
                    {country}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-4 h-4 ${isLight ? 'text-slate-400' : 'text-slate-500'} absolute right-4 pointer-events-none`} strokeWidth={1.5} />
            </div>

            <div className={`flex items-center px-3.5 ${compact ? 'h-9' : 'h-11'}`}>
              <input
                type="text"
                placeholder="Dirección (calle y número)"
                value={data.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                className={rowInputClass}
              />
            </div>

            <div className={`flex items-center px-3.5 ${compact ? 'h-9' : 'h-11'}`}>
              <input
                type="text"
                placeholder="Apartamento, suite, unidad, etc. (opcional)"
                value={data.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
                className={rowInputClass}
              />
            </div>

            <div className={`flex divide-x ${isLight ? 'divide-slate-200/70' : 'divide-white/10'}`}>
              <input
                type="text"
                placeholder="Ciudad"
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`${rowInputClass} px-3.5 w-1/3`}
              />
              <input
                type="text"
                placeholder="Estado"
                value={data.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className={`${rowInputClass} px-3.5 w-1/3`}
              />
              <input
                type="text"
                placeholder="C. Postal"
                value={data.zipCode}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                className={`${rowInputClass} px-3.5 w-1/3`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
