'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import CryptoCheckoutPanel from './CryptoCheckoutPanel';

export type VisaPlanId = 'basico' | 'premium' | 'vip';

const PLAN_TITLES: Record<VisaPlanId, string> = {
  basico: 'Plan Básico',
  premium: 'Plan Premium',
  vip: 'Experiencia VIP',
};

interface CryptoCheckoutModalProps {
  planId: VisaPlanId;
  open: boolean;
  onClose: () => void;
  onSuccess: (details: { requestId: string; email: string }) => void;
  sessionId: string;
}

export default function CryptoCheckoutModal({
  planId,
  open,
  onClose,
  onSuccess,
  sessionId,
}: CryptoCheckoutModalProps) {
  const planTitle = PLAN_TITLES[planId];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-[100vw] w-screen h-[100dvh] max-h-none bg-slate-50 border-none text-slate-900 sm:rounded-none p-0 overflow-hidden">
        <DialogTitle className="sr-only">Pago crypto — {planTitle}</DialogTitle>
        <div className="h-full overflow-y-auto lg:overflow-hidden">
          <CryptoCheckoutPanel
            planId={planId}
            sessionId={sessionId}
            onSuccess={onSuccess}
            className="min-h-full rounded-none border-none shadow-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
