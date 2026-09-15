'use client';

import React from 'react';
import { Lock } from 'lucide-react';
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
            <Input
              type="password"
              required
              placeholder="Ingresa la contraseña..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="h-11 bg-white border-slate-300 text-xs px-4 text-center text-slate-900 rounded-full focus:border-blue-600 focus:ring-blue-600"
            />
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
