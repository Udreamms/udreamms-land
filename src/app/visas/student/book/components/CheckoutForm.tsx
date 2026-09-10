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
      const successUrl = `${origin}/portal?stripe=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/visas/student/book?stripe=cancelled`;

      const response = await fetch('/api/payments/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email || '',
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
                  src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Libro%20Digital%20F1.png?alt=media&token=8e9bc7e6-1469-42b7-a36c-941da7247738"
                  alt="Libro Digital Visa de Estudiante F-1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Información y Precio */}
              <div className="flex flex-col justify-center font-sans text-left">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1 font-sans">
                  Guía Oficial Udreamms
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white leading-snug font-sans">
                  Visa de Estudiante F-1
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-2 font-sans font-medium">
                  Ebook digital de descarga inmediata
                </p>
                <div className="flex items-baseline gap-2 font-sans">
                  <span className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
                    $29.99
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase font-sans">USD</span>
                  <span className="text-xs text-slate-500 line-through font-sans ml-1">$49.99</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Botón Directo a Stripe Checkout y Garantías */}
          <div className="lg:col-span-7 flex flex-col space-y-4 font-sans">
            <button
              type="button"
              onClick={handleDirectStripeCheckout}
              disabled={loadingStripe}
              suppressHydrationWarning
              className="w-full bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-[1.01] active:scale-95 shadow-md text-center tracking-wider text-sm md:text-base font-sans font-semibold py-4 md:py-4.5 px-8 rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Lock className="w-4 h-4 text-black" />
              {loadingStripe ? 'Conectando con Stripe...' : 'QUIERO MI LIBRO AHORA'}
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
          </div>

        </div>
      </div>
    </div>
  );
}
