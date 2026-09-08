'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface WalletCopyButtonProps {
  address: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export default function WalletCopyButton({ address, className = '', theme = 'dark' }: WalletCopyButtonProps) {
  const isLight = theme === 'light';
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Dirección de wallet copiada');
    } catch {
      toast.error('No se pudo copiar la dirección');
    }
  };

  return (
    <div className={`flex flex-col items-center gap-1.5 w-full ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-2 w-full max-w-sm px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
          isLight
            ? 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
            : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Copy className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
        <span className="truncate font-mono">{address}</span>
      </button>
      <p className={`text-[10px] text-center leading-relaxed max-w-sm px-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
        Toca para copiar la dirección. Pégala en Phantom para transferir si prefieres no escanear el QR.
      </p>
    </div>
  );
}
