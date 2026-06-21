'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface WalletCopyButtonProps {
  address: string;
  className?: string;
}

export default function WalletCopyButton({ address, className = '' }: WalletCopyButtonProps) {
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
        className="inline-flex items-center gap-2 w-full max-w-sm px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
      >
        <Copy className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate font-mono">{address}</span>
      </button>
      <p className="text-[11px] text-slate-400 text-center leading-relaxed max-w-sm px-2">
        Toca para copiar la dirección de la wallet. Pégala en Phantom y envía el pago manualmente si no puedes escanear el código QR.
      </p>
    </div>
  );
}
