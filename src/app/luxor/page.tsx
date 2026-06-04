"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Copy, CheckCircle2, MessageCircle, Image as ImageIcon, Percent, Star, Zap, Users } from "lucide-react";
import { useState } from "react";

export default function LuxorPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* 1. SECCIÓN HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Video con el enlace sin la capa oscura pesada */}
        <video 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
          src="https://firebasestorage.googleapis.com/v0/b/landluxor.firebasestorage.app/o/Monedas.mp4?alt=media&token=42bc8f9a-21e1-4f92-bce0-f6375138a2a1"
        />
        
        <div className="absolute bottom-16 left-8 md:bottom-24 md:left-24 z-20 w-full flex">
          {/* Texto más pequeño, sin bold en el título, separado del borde */}
          <div className="max-w-xl text-left pr-4">
            <span className="text-blue-500 font-semibold tracking-[0.3em] text-[8px] md:text-[10px] uppercase mb-3 block drop-shadow-md">
              ECOSISTEMA EN SOLANA
            </span>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-5 drop-shadow-lg leading-tight">
              Bienvenido a la <br />
              Economía <span className="text-blue-500">Luxor</span>
            </h1>
            <p className="text-xs md:text-sm text-white/80 max-w-lg font-light leading-relaxed drop-shadow-md">
              LUXOR es el token de utilidad (Moneda Digital) que sirve como motor dentro del ecosistema Luxor, diseñado para que cada negocio que lo utilice pueda otorgar descuentos a sus clientes en cualquiera de sus productos o servicios.
            </p>
          </div>
        </div>
        
        {/* Difuminado inferior para conectar suavemente con la siguiente sección */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </section>

      {/* 2. SECCIÓN: QUÉ ES LUXOR */}
      <section className="py-32 md:py-40 bg-black relative">
        <div className="w-full max-w-6xl px-6 md:px-12 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
            
            {/* Columna Izquierda: Texto */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end text-left w-full">
              <div className="w-full max-w-lg">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                  ¿Qué es exactamente Luxor?
                </h2>
                <p className="text-white/70 text-xs md:text-sm mb-3 font-light leading-relaxed">
                  Luxor (LXR) es el token de utilidad nativo del ecosistema Luxor. No es un activo pasivo; es una herramienta activa diseñada para quienes crean, emprenden y consumen en la nueva economía digital.
                </p>
                <p className="text-white/70 text-xs md:text-sm mb-10 font-light leading-relaxed">
                  Al usar LXR, no solo posees un activo en Solana; obtienes superpoderes dentro de nuestra red:
                </p>

                <div className="space-y-6">
                  {/* Item 1 */}
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-5 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center shrink-0">
                        <Percent className="w-[10px] h-[10px] text-white/80" />
                      </div>
                      <h4 className="text-white font-medium text-xs md:text-sm">Descuentos Exclusivos</h4>
                    </div>
                    <p className="text-white/50 text-[10px] md:text-xs font-light pl-8">
                      Paga por servicios de administración empresarial y personal con beneficios directos.
                    </p>
                  </div>
                  {/* Item 2 */}
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-5 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center shrink-0">
                        <Star className="w-[10px] h-[10px] text-white/80" />
                      </div>
                      <h4 className="text-white font-medium text-xs md:text-sm">Acceso a Experiencias</h4>
                    </div>
                    <p className="text-white/50 text-[10px] md:text-xs font-light pl-8">
                      Tu saldo de LXR es tu entrada a eventos, herramientas avanzadas y funciones premium del ecosistema.
                    </p>
                  </div>
                  {/* Item 3 */}
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-5 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center shrink-0">
                        <Zap className="w-[10px] h-[10px] text-white/80" />
                      </div>
                      <h4 className="text-white font-medium text-xs md:text-sm">Ahorros en el Consumo</h4>
                    </div>
                    <p className="text-white/50 text-[10px] md:text-xs font-light pl-8">
                      Obtén beneficios en comercios asociados, desde cafeterías hasta tecnología, a través de nuestra pasarela de pago.
                    </p>
                  </div>
                  {/* Item 4 */}
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-5 h-5 bg-white/5 border border-white/10 rounded flex items-center justify-center shrink-0">
                        <Users className="w-[10px] h-[10px] text-white/80" />
                      </div>
                      <h4 className="text-white font-medium text-xs md:text-sm">Gobernanza Activa</h4>
                    </div>
                    <p className="text-white/50 text-[10px] md:text-xs font-light pl-8">
                      Participa en el desarrollo de nuevas funciones. Tu voz ayuda a decidir hacia dónde crece el motor.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Imagen */}
            <div className="lg:w-1/2 w-full flex justify-center lg:justify-start">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Gemini_Generated_Image_ywjuiywjuiywjuiy.png?alt=media&token=586e7830-e75e-4dee-b6fc-56131cc20bc5" 
                alt="Luxor Coin" 
                className="w-[80%] sm:w-[70%] lg:w-[85%] max-w-[450px] h-auto rounded-[2rem] object-cover border border-white/5 shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: CÓMO OBTENERLO Y PAGAR */}
      <section className="py-32 md:py-40 bg-[#050505] relative border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">Guía de Pago con Descuento</h2>
            <p className="text-xs md:text-sm text-white/60 max-w-2xl mx-auto font-light">
              Realizar tu pago con LUXOR en la red de Solana es muy sencillo. Sigue estos 4 pasos:
            </p>
          </div>

          <div className="space-y-24">
            
            {/* Paso 1 */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <div className="text-blue-500 font-semibold text-[10px] md:text-xs tracking-[0.2em] uppercase mb-3">Paso 1</div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4">Descarga e Instala Phantom y recárgalo con solana</h3>
                <p className="text-white/70 text-xs md:text-sm mb-4 font-light leading-relaxed">
                  Busca y descarga la aplicación <strong>Phantom</strong> desde la App Store o Play Store. Crea tu cuenta, guarda tus frases de seguridad y recarga tu billetera con Solana (SOL).
                </p>
              </div>
              <div className="md:w-1/2 w-full flex gap-4 justify-center">
                <img src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2F1.jpeg?alt=media&token=a2a4339f-a54a-428d-945b-52a15753d88b" alt="Phantom app" className="w-[45%] max-w-[220px] rounded-2xl border border-white/10 shadow-lg object-contain" />
                <img src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2F2.jpeg?alt=media&token=8be6669d-b9c2-4d4d-bcce-85e1f3748eb2" alt="Crear billetera" className="w-[45%] max-w-[220px] rounded-2xl border border-white/10 shadow-lg object-contain" />
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="md:w-1/2">
                <div className="text-blue-500 font-semibold text-[10px] md:text-xs tracking-[0.2em] uppercase mb-3">Paso 2</div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4">Encuentra la Moneda Oficial e intercambia tus Monedas por LUXOR</h3>
                <p className="text-white/70 text-xs md:text-sm mb-4 font-light leading-relaxed">
                  Dentro de Phantom, ve al módulo de intercambio (Swap). Pega nuestra dirección oficial en el buscador y realiza el intercambio para obtener tus LUXOR de forma segura.
                </p>
                <div className="mt-4 flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 w-full">
                  <code className="text-[10px] md:text-xs text-blue-400 break-all flex-1">7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth</code>
                  <button onClick={copyToClipboard} className="p-3 hover:bg-white/10 rounded-lg transition-colors border border-white/5 bg-white/10 shrink-0" title="Copiar código">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/80" />}
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 w-full flex gap-4 justify-center">
                <img src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2F3.jpeg?alt=media&token=16db46e2-3bd9-4105-a3d3-72514fe9e121" alt="Buscar moneda" className="w-[45%] max-w-[220px] rounded-2xl border border-white/10 shadow-lg object-contain" />
                <img src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2F4.jpeg?alt=media&token=226b935d-1ea2-4020-9a73-6934efe2cd1f" alt="Contrato oficial" className="w-[45%] max-w-[220px] rounded-2xl border border-white/10 shadow-lg object-contain" />
              </div>
            </div>

            {/* Paso 3 */}
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="md:w-1/2">
                <div className="text-blue-500 font-semibold text-[10px] md:text-xs tracking-[0.2em] uppercase mb-3">Paso 3</div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4">Escanea el código de tu servicio y paga con descuento</h3>
                <p className="text-white/70 text-xs md:text-sm mb-4 font-light leading-relaxed">
                  Escanea el código del servicio que elegiste aquí en la plataforma de Udreamms y paga tu servicio con el descuento adquirido utilizando tus monedas LUXOR.
                </p>
              </div>
              <div className="md:w-1/2 w-full flex gap-4 justify-center">
                <img src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2F5.jpeg?alt=media&token=03c30daf-a2d6-416b-8c07-a53bad22121e" alt="Monto de Swap" className="w-[45%] max-w-[220px] rounded-2xl border border-white/10 shadow-lg object-contain" />
                <img src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2F6.jpeg?alt=media&token=e0a6af33-c6df-4798-89d1-3f2c6b637d3c" alt="Confirmar Swap" className="w-[45%] max-w-[220px] rounded-2xl border border-white/10 shadow-lg object-contain" />
              </div>
            </div>

            {/* Paso 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10">
              <div className="md:w-1/2">
                <div className="text-blue-500 font-semibold text-[10px] md:text-xs tracking-[0.2em] uppercase mb-3">Paso 4</div>
                <h3 className="text-xl md:text-2xl font-medium text-white mb-4">Recibe tus accesos y comienza</h3>
                <p className="text-white/70 text-xs md:text-sm mb-4 font-light leading-relaxed">
                  Después de pagar y que en Phantom veas el mensaje de pago realizado, regresa a tu plataforma y abre tu correo electrónico. Te llegará el usuario y contraseña para que ingreses a tu portal, donde podrás adjuntar documentos, recibir notificaciones de cómo está tu proceso y adquirir videos de preparación, productos de Udreamms y acceso a miles de herramientas para ser exitoso al llegar a Estados Unidos.
                </p>
              </div>
              <div className="md:w-1/2 w-full flex gap-4 justify-center">
                <img src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/Phantom%2F7.jpeg?alt=media&token=37b84958-fe14-4282-972f-53cf1691fcee" alt="Enviar pago" className="w-[45%] max-w-[220px] rounded-2xl border border-white/10 shadow-lg object-contain" />
              </div>
            </div>

          </div>

          {/* Soporte WhatsApp */}
          <div className="mt-32 max-w-3xl mx-auto text-center">
            <MessageCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">¿Soporte en vivo?</h2>
            <p className="text-white/70 mb-8 text-sm md:text-base font-light">
              ¿Te trabaste en algún paso? Escríbenos directamente y te guiaremos personalmente para que accedas a tu servicio con descuento 
            </p>
            <a
              href="https://wa.me/13854162224?text=Hola,%20necesito%20ayuda%20para%20realizar%20mi%20pago%20con%20LUXOR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 text-sm md:text-base font-medium text-white rounded-full bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1"
            >
              Contactar por WhatsApp
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
