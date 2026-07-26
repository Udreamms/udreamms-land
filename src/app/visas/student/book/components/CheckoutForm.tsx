import React from "react";
import { User, Mail, Lock } from "lucide-react";
import BookCheckoutFlow, { type BookFormData } from "@/components/payments/BookCheckoutFlow";

interface CheckoutFormProps {
  formData: BookFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookFormData>>;
  onStartCheckout: () => void;
  checkoutActive?: boolean;
  onResetCheckout?: () => void;
}

export default function CheckoutForm({
  formData,
  setFormData,
  onStartCheckout,
  checkoutActive = false,
  onResetCheckout,
}: CheckoutFormProps) {
  const [loadingStripe, setLoadingStripe] = React.useState(false);

  const handleDirectStripeCheckout = async () => {
    onStartCheckout();
    setLoadingStripe(true);
    try {
      const origin = window.location.origin;
      const successUrl = `${origin}/visas/student/book?stripe=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/visas/student/book?stripe=cancelled`;

      const response = await fetch('/api/payments/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: '',
          itemIds: ['libro-estudiante'],
          successUrl,
          cancelUrl,
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoadingStripe(false);
      }
    } catch {
      setLoadingStripe(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 font-sans text-white">
      <div className="bg-slate-950/40 border border-white/5 rounded-3xl p-6 md:p-10 w-full font-sans text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center font-sans">
          
          {/* Bloque Izquierdo: Libro y Precios */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center font-sans mx-auto w-full">
            <div className="flex flex-row items-center gap-6 justify-center w-full font-sans">
              {/* Portada Libro */}
              <div className="relative w-28 md:w-40 aspect-[3/4] rounded-xl overflow-hidden shadow-lg shrink-0">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Book%2FMuckup%20(1).png?alt=media&token=90d03452-cb19-47fc-9e75-1d84cf6ba50c"
                  alt="Libro Digital Udreamms - Paso a paso para tu visa"
                  className="w-full h-full object-contain origin-center"
                />
              </div>

              {/* Precios */}
              <div className="flex flex-col justify-center text-left font-sans">
                <span className="text-xs md:text-sm font-medium text-slate-500 line-through font-sans">
                  Antes $49 USD
                </span>
                <div className="flex items-baseline gap-1 mt-1 font-sans">
                  <span className="text-[10px] font-normal text-slate-400 uppercase font-sans">Hoy solo</span>
                  <span className="text-2xl md:text-3xl font-medium text-white tracking-tight font-sans">
                    $29.99
                  </span>
                  <span className="text-base font-normal text-slate-400 font-sans">USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Únicamente el Botón Directo y Garantías */}
          <div className="lg:col-span-7 flex flex-col space-y-4 font-sans">
            <button
              onClick={onStartCheckout}
              type="button"
              suppressHydrationWarning
              className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md text-center tracking-wider text-sm md:text-base font-sans font-semibold py-4 md:py-4.5 px-8 rounded-full flex items-center justify-center gap-2"
            >
              QUIERO MI LIBRO AHORA
            </button>

            {/* Garantías de confianza */}
            <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs text-slate-400 font-medium pt-2 border-t border-white/5 font-sans">
              <div className="flex items-center gap-1 font-sans">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-sans">Pago 100% seguro</span>
              </div>
              <span>•</span>
              <span className="font-sans font-medium">Acceso inmediato</span>
              <span>•</span>
              <span className="font-sans font-medium">Descarga digital</span>
            </div>

            {checkoutActive ? (
              <BookCheckoutFlow
                formData={formData}
                autoStart
                onReset={onResetCheckout}
              />
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
