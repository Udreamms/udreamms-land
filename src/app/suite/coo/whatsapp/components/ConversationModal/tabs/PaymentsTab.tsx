import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, RefreshCw, CreditCard, Plus, ChevronDown, MoreVertical, Clock, CheckCheck, ChevronRight, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CardData, PaymentMethod } from '../types';

interface PaymentsTabProps {
    liveCardData: CardData | null;
    isAddingPayment: boolean;
    setIsAddingPayment: (val: boolean) => void;
    newPayment: {
        type: 'visa' | 'mastercard' | 'amex' | 'paypal' | 'bank_transfer' | 'other';
        last4: string;
        expiry: string;
        brand: string;
    };
    setNewPayment: React.Dispatch<React.SetStateAction<{
        type: 'visa' | 'mastercard' | 'amex' | 'paypal' | 'bank_transfer' | 'other';
        last4: string;
        expiry: string;
        brand: string;
    }>>;
    handleSavePaymentMethod: () => Promise<void>;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
    liveCardData,
    isAddingPayment,
    setIsAddingPayment,
    newPayment,
    setNewPayment,
    handleSavePaymentMethod
}) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            setShowScrollButton(scrollHeight - scrollTop > clientHeight + 50);
        }
    };

    React.useEffect(() => {
        const timer = setTimeout(checkScroll, 100);
        return () => clearTimeout(timer);
    }, [liveCardData, isAddingPayment]);

    const totalSpent = liveCardData?.transactions?.reduce((acc, curr) => {
        return curr.status === 'completed' ? acc + curr.amount : acc;
    }, 0) || 0;

    const today = new Date();
    const nextBillingSub = liveCardData?.subscriptions
        ?.filter(sub => sub.status === 'active' && sub.nextBillingDate?.toDate() > today)
        .sort((a, b) => a.nextBillingDate.toDate().getTime() - b.nextBillingDate.toDate().getTime())[0];

    const nextBillingDateStr = nextBillingSub
        ? nextBillingSub.nextBillingDate.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
        : '--';

    const nextBillingAmount = nextBillingSub ? `$${nextBillingSub.price.toFixed(2)}` : '--';

    return (
        <div className="relative flex-1 flex flex-col min-h-0 h-full overflow-hidden">
            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-24"
            >
                {/* Header / Summary Section */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="group p-3 border-l-2 border-emerald-500 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-r-md">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign size={10} className="text-emerald-500" />
                            <h5 className="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em]">Capital Consolidado</h5>
                        </div>
                        <p className="text-lg font-medium text-white tracking-tight font-mono">${totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="group p-3 border-l-2 border-blue-500 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-r-md">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={10} className="text-blue-500" />
                            <h5 className="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em]">Próximo Débito</h5>
                        </div>
                        <p className="text-lg font-medium text-white tracking-tight font-mono">{nextBillingDateStr}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* 0. SUSCRIPCIONES ACTIVAS */}
                    <div>
                        <h4 className="flex items-center gap-2 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em] px-1 mb-2 border-b border-neutral-800/50 pb-2">
                            SUSCRIPCIONES
                        </h4>

                        <div className="flex flex-col">
                            {liveCardData?.subscriptions && liveCardData.subscriptions.length > 0 ? (
                                liveCardData.subscriptions.map((sub) => (
                                    <div key={sub.id} className="group flex items-center justify-between px-2 py-3 hover:bg-white/[0.02] transition-colors rounded-md border-b border-transparent">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-medium text-neutral-200 text-sm">{sub.name}</h5>
                                                <span className={cn(
                                                    "text-[8px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-widest bg-neutral-800/50",
                                                    sub.status === 'active' ? "text-emerald-500" :
                                                        sub.status === 'past_due' ? "text-amber-500" :
                                                            "text-red-500"
                                                )}>
                                                    {sub.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[11px] text-neutral-400 font-medium">
                                                    ${sub.price.toFixed(2)} / {sub.interval === 'month' ? 'MES' : 'AÑO'}
                                                </p>
                                                <span className="text-[10px] text-neutral-700">|</span>
                                                <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">
                                                    Próximo: {sub.nextBillingDate?.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-neutral-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={14} />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-4 text-center opacity-30 italic text-[9px]">No subscriptions</div>
                            )}
                        </div>
                    </div>

                    {/* 1. MÉTODOS DE PAGO */}
                    <div>
                        <div className="flex items-center justify-between px-1 mb-2 border-b border-neutral-800/50 pb-2">
                            <h4 className="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em]">
                                BÓVEDA DE PAGOS
                            </h4>
                            <Button
                                variant="ghost"
                                onClick={() => setIsAddingPayment(true)}
                                className="h-5 w-5 p-0 text-neutral-600 hover:text-white rounded-full hover:bg-neutral-800"
                            >
                                <Plus size={12} />
                            </Button>
                        </div>

                        {isAddingPayment && (
                            <div className="mb-4 p-3 border border-white/10 bg-neutral-900/50">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="space-y-1">
                                        <label className="text-[8px] uppercase font-medium text-neutral-500">Proveedor</label>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="w-full h-7 text-left justify-start bg-transparent border-white/10 text-[10px] px-2 text-neutral-300">
                                                    {newPayment.type.toUpperCase()}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-[#0a0a0a] border-white/10">
                                                <DropdownMenuItem onClick={() => setNewPayment(p => ({ ...p, type: 'visa' }))} className="text-[10px]">VISA</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewPayment(p => ({ ...p, type: 'mastercard' }))} className="text-[10px]">MASTERCARD</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setNewPayment(p => ({ ...p, type: 'paypal' }))} className="text-[10px]">PAYPAL</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] uppercase font-medium text-neutral-500">Últimos 4</label>
                                        <Input
                                            maxLength={4}
                                            value={newPayment.last4}
                                            onChange={(e) => setNewPayment(p => ({ ...p, last4: e.target.value.replace(/\D/g, '') }))}
                                            className="h-7 bg-transparent border-white/10 text-[10px]"
                                            placeholder="4242"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setIsAddingPayment(false)} className="h-6 text-[9px] text-neutral-500 uppercase">Cancelar</Button>
                                    <Button onClick={handleSavePaymentMethod} className="h-6 bg-blue-600 text-[9px] uppercase px-3">Guardar</Button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col">
                            {liveCardData?.paymentMethods && liveCardData.paymentMethods.length > 0 ? (
                                liveCardData.paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className="group flex items-center justify-between px-2 py-3 hover:bg-white/[0.02] transition-colors rounded-md border-b border-transparent cursor-default"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-6 rounded-[4px] bg-neutral-800 flex items-center justify-center border border-neutral-700/50 shrink-0">
                                                {method.type === 'visa' ? <CreditCard size={12} className="text-blue-400" /> : <CreditCard size={12} className="text-neutral-400" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[13px] font-medium text-neutral-200 tracking-wider">
                                                    •••• {method.last4 || '0000'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">
                                                        EXP: {method.expiry || '--/--'}
                                                    </span>
                                                    {method.isDefault && <span className="text-[8px] text-blue-500 font-medium uppercase tracking-[0.1em]">PREDETERMINADA</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-neutral-600 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={14} />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-4 text-center opacity-30 italic text-[9px]" onClick={() => setIsAddingPayment(true)}>
                                    No payment methods
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. TRANSACTION HISTORY */}
                    <div>
                        <div className="flex items-center justify-between px-1 mb-2 border-b border-neutral-800/50 pb-2">
                            <h4 className="text-[10px] font-medium text-neutral-500 uppercase tracking-[0.15em]">
                                HISTORIAL
                            </h4>
                        </div>

                        <div className="space-y-0">
                            {liveCardData?.transactions && liveCardData.transactions.length > 0 ? (
                                <div className="flex flex-col">
                                    {liveCardData.transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between px-2 py-3 hover:bg-white/[0.02] transition-colors group rounded-md border-b border-transparent">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    tx.status === 'completed' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                                                        tx.status === 'pending' ? "bg-amber-500" : "bg-red-500"
                                                )} />
                                                <div>
                                                    <p className="text-[11px] font-medium text-neutral-200 tracking-tight">{tx.description.toUpperCase()}</p>
                                                    <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider mt-0.5">
                                                        {tx.date?.toDate ? tx.date.toDate().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-white tracking-tight font-mono">${tx.amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center">
                                    <p className="text-[9px] text-neutral-600 opacity-50 italic">No activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showScrollButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 10, x: '-50%' }}
                        className="absolute bottom-6 left-1/2 z-20"
                    >
                        <Button
                            onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-12 w-12 shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center border border-white/10 group animate-bounce"
                        >
                            <ChevronDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
