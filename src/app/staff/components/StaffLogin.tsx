'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StaffLoginProps {
  passwordInput: string;
  setPasswordInput: (val: string) => void;
  onLogin: (e: React.FormEvent) => void;
}

export const StaffLogin: React.FC<StaffLoginProps> = ({
  passwordInput,
  setPasswordInput,
  onLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex items-center justify-center p-4 selection:bg-blue-500/20">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8 text-black" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest">
            Acceso Restringido Staff
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Password
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ingresa la contraseña de autorización para gestionar los procesos de alumnos.
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-4 pt-2">
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700 block">Contraseña de Staff</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Ingresa la contraseña..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="h-11 bg-white border-slate-300 text-xs px-10 text-center text-slate-900 rounded-full focus:border-blue-600 focus-visible:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:ring-offset-0 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all duration-300 cursor-pointer"
          >
            Ingresar al Portal Staff
          </Button>
        </form>
      </div>
    </div>
  );
};
