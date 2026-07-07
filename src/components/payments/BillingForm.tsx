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
}

const COUNTRIES = [
  'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica',
  'Cuba', 'República Dominicana', 'Ecuador', 'El Salvador', 'Guatemala',
  'Honduras', 'México', 'Nicaragua', 'Panamá', 'Paraguay', 'Perú',
  'Puerto Rico', 'Uruguay', 'Venezuela', 'España', 'Estados Unidos', 'Otros',
];

const contactRequiredFields: (keyof BillingData)[] = ['email', 'phone', 'fullName'];

const rowInputClass =
  'w-full h-10 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none';

const selectClass =
  'w-full h-10 bg-transparent text-sm text-white focus:outline-none appearance-none cursor-pointer [color-scheme:dark]';

const optionClass = 'bg-[#111] text-white';

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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-slate-400 mb-2">Datos de contacto</p>
        <div className="rounded-lg border border-white/10 bg-white/5">
          <div className="divide-y divide-white/10 overflow-hidden rounded-t-lg">
            <div className="flex items-center gap-2.5 px-4 h-11 focus-within:bg-white/[0.03]">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={1.5} />
              <input
                id="email"
                type="email"
                placeholder="correoelectrónico@ejemplo.com"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={rowInputClass}
              />
            </div>

            <div className="flex items-center gap-2.5 px-4 h-11 focus-within:bg-white/[0.03]">
              <User className="w-4 h-4 text-slate-500 shrink-0" strokeWidth={1.5} />
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

          <div className="relative z-30 border-t border-white/10 px-2 h-11 billing-phone-field">
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

      <div>
        <p className="text-xs font-medium text-slate-400 mb-2">Dirección de facturación</p>
        <div className="rounded-lg border border-white/10 overflow-hidden bg-white/5 divide-y divide-white/10">
          <div className="relative flex items-center px-4 h-11">
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
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 pointer-events-none" strokeWidth={1.5} />
          </div>

          {manualAddress ? (
            <>
              <div className="relative flex items-center px-4 h-11 gap-2">
                <input
                  type="text"
                  placeholder="Línea 1 de dirección"
                  value={data.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  className={`${rowInputClass} flex-1 min-w-0 placeholder:text-white/70`}
                />
                <button
                  type="button"
                  onClick={() => setManualAddress(false)}
                  className="shrink-0 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Ocultar dirección detallada"
                >
                  <ChevronDown className="w-4 h-4 rotate-180" strokeWidth={1.5} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Línea 2 de dirección"
                value={data.addressLine2}
                onChange={(e) => handleChange('addressLine2', e.target.value)}
                className={`${rowInputClass} px-4 placeholder:text-white/70`}
              />
              <div className="flex divide-x divide-white/10">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={data.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`${rowInputClass} px-4 w-1/2 placeholder:text-white/70`}
                />
                <input
                  type="text"
                  placeholder="Código postal"
                  value={data.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  className={`${rowInputClass} px-4 w-1/2 placeholder:text-white/70`}
                />
              </div>
              <input
                type="text"
                placeholder="Estado"
                value={data.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className={`${rowInputClass} px-4 placeholder:text-white/70`}
              />
            </>
          ) : (
            <div className="relative flex items-center px-4 h-11 gap-2">
              <input
                type="text"
                placeholder="Ingresar dirección"
                value={data.addressLine1}
                onChange={(e) => handleChange('addressLine1', e.target.value)}
                className={`${rowInputClass} flex-1 min-w-0 placeholder:text-white/80`}
              />
              <button
                type="button"
                onClick={() => setManualAddress(true)}
                className="shrink-0 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Ingresar dirección manualmente"
              >
                <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
