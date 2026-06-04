"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Copy, Percent, Star, Zap, CheckCircle2, MessageCircle, Image as ImageIcon } from "lucide-react";
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
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* VIDEO BACKGROUND PLACEHOLDER */}
        {/* Instrucción: Agrega la ruta de tu video en el atributo 'src' debajo (ej. src="/videos/tu-video.mp4") */}
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay 
          loop 
          muted 
          playsInline
          src="" // <-- ¡Pon la ruta de tu video aquí!
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        
        <div className="relative z-20 container mx-auto px-4 text-center mt-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            LUXOR <span className="text-purple-500">Token</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light">
            El poder de la blockchain para optimizar tu proceso en Udreamms.
          </p>
        </div>
      </section>

      {/* DEFINITION & VALUE PROPOSITION */}
      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-4">
          
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-sm mb-20 text-center md:text-left">
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">¿Qué es un Utility Token?</h2>
            <p className="text-lg text-white/70 leading-relaxed mb-6">
              Un utility token es un activo digital basado en tecnología blockchain que otorga a su poseedor el derecho a acceder de manera exclusiva a los productos, servicios o funciones específicas que ofrece una empresa dentro de su propio ecosistema. 
            </p>
            <p className="text-lg text-white/70 leading-relaxed">
              No representa acciones de una compañía ni una promesa de ganancias; es una herramienta utilitaria diseñada para interactuar con una plataforma.
            </p>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">¿Cómo funciona y aporta valor LUXOR?</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">Aplicado directamente al caso real en nuestro ecosistema:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 rounded-3xl hover:border-purple-500/50 transition-colors">
              <div className="bg-purple-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Percent className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Mecanismo de Incentivo y Descuentos</h3>
              <p className="text-white/60 leading-relaxed text-base">
                La función principal de LUXOR dentro de nuestra plataforma es actuar como un optimizador de costos. Al utilizar esta moneda digital como método de pago directo para adquirir nuestros servicios tecnológicos, de desarrollo o consultoría, el usuario recibe automáticamente descuentos preferenciales. Esto reduce el costo operativo para el cliente y premia su fidelidad.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 rounded-3xl hover:border-blue-500/50 transition-colors">
              <div className="bg-blue-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">2. Acceso a Funciones y Herramientas Premium</h3>
              <p className="text-white/60 leading-relaxed text-base">
                Poseer y utilizar LUXOR desbloquea un nivel superior dentro del ecosistema. Da acceso a módulos avanzados, automatizaciones, herramientas de software exclusivas o servicios de soporte prioritario que no están disponibles mediante pagos con moneda tradicional. Funciona como la llave de entrada a nuestra infraestructura tecnológica más avanzada.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-8 rounded-3xl hover:border-green-500/50 transition-colors">
              <div className="bg-green-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">3. Fluidez y Eficiencia en las Transacciones</h3>
              <p className="text-white/60 leading-relaxed text-base">
                Al operar sobre una red blockchain, el uso de LUXOR elimina intermediarios financieros tradicionales. Esto significa que las transacciones dentro de la plataforma son:
                <br/><br/>
                • <strong>Inmediatas:</strong> Sin tiempos de espera bancarios.<br/>
                • <strong>Transparentes y seguras:</strong> Registradas de forma inmutable en el libro contable digital.<br/>
                • <strong>Globales:</strong> Permite a cualquier cliente, sin importar su ubicación, acceder a nuestros servicios bajo las mismas condiciones.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center max-w-4xl mx-auto p-8 bg-purple-900/20 border border-purple-500/30 rounded-3xl">
            <h4 className="text-xl font-semibold text-white mb-3">En resumen</h4>
            <p className="text-lg text-white/80 leading-relaxed">
              LUXOR es una moneda digital diseñada específicamente para maximizar el valor dentro de nuestra plataforma, permitiendo a los usuarios reducir sus costos mediante descuentos directos y acceder a servicios tecnológicos avanzados de forma eficiente y segura.
            </p>
          </div>

        </div>
      </section>

      {/* GUÍA DE PAGO (Step-by-step with image placeholders) */}
      <section className="py-24 bg-[#050505] relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Guía de Pago con Descuento en Udreamms usando LUXOR</h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Realizar tu pago con nuestra moneda digital LUXOR en la red de Solana es la forma más rápida de obtener un descuento exclusivo en nuestros servicios. Sigue estos pasos detallados para completar tu transacción:
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-24">
            
            {/* Paso 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center justify-center shrink-0 w-14 h-14 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-400 font-bold text-2xl">1</div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">Configura tu Billetera Digital</h3>
                </div>
                <div className="space-y-6 text-lg text-white/70">
                  <p className="flex gap-4 items-start">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Busca y descarga la aplicación <strong>Phantom</strong> desde la App Store (iPhone) o Play Store (Android).</span>
                  </p>
                  <p className="flex gap-4 items-start">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Abre la aplicación y selecciona la opción para crear una nueva cuenta. Sigue las instrucciones de seguridad que te indica la app para activarla.</span>
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 overflow-hidden relative group">
                  <ImageIcon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform text-white/30" />
                  <span className="font-medium text-lg">Imagen del Paso 1</span>
                  <span className="text-sm mt-2 opacity-60 px-8 text-center">Para reemplazar este cuadro, inserta aquí tu etiqueta <code className="text-purple-400">&lt;img src="..." /&gt;</code> en el código.</span>
                </div>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center justify-center shrink-0 w-14 h-14 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-2xl">2</div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">Adquiere tus Monedas LUXOR</h3>
                </div>
                <div className="space-y-6 text-lg text-white/70">
                  <p className="flex gap-4 items-start">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Dentro de Phantom, ve a la barra de búsqueda del navegador o al módulo de intercambio (Swap).</span>
                  </p>
                  <div className="flex gap-4 items-start">
                    <span className="text-blue-400 mt-1">•</span>
                    <div className="w-full">
                      <span>Copia y pega exactamente este número (dirección oficial de nuestro token):</span>
                      <div className="mt-4 flex items-center gap-3 bg-black/60 p-4 rounded-xl border border-white/10 w-full">
                        <code className="text-sm md:text-base text-purple-400 break-all flex-1">7Qm6qUCXGZfGBYYFzq2kTbwTDah5r3d9DcPJHRT8Wdth</code>
                        <button onClick={copyToClipboard} className="p-3 hover:bg-white/10 rounded-lg transition-colors border border-white/5 shrink-0 bg-white/5" title="Copiar">
                          {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-white/80" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="flex gap-4 items-start">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Selecciona LUXOR e ingresa el monto equivalente al servicio que vas a contratar.</span>
                  </p>
                  <p className="flex gap-4 items-start">
                    <span className="text-blue-400 mt-1">•</span>
                    <span>Presiona el botón de Comprar (o intercambiar) para transferir los fondos a tu billetera.</span>
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 overflow-hidden relative group">
                  <ImageIcon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform text-white/30" />
                  <span className="font-medium text-lg">Imagen del Paso 2</span>
                  <span className="text-sm mt-2 opacity-60 px-8 text-center">Para reemplazar este cuadro, inserta aquí tu etiqueta <code className="text-purple-400">&lt;img src="..." /&gt;</code> en el código.</span>
                </div>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center justify-center shrink-0 w-14 h-14 rounded-full bg-green-600/20 border border-green-500/30 text-green-400 font-bold text-2xl">3</div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white">Escanea y Paga en Udreamms</h3>
                </div>
                <div className="space-y-6 text-lg text-white/70">
                  <p className="flex gap-4 items-start">
                    <span className="text-green-400 mt-1">•</span>
                    <span>En esta pantalla de Udreamms, completa el formulario con tus datos personales.</span>
                  </p>
                  <p className="flex gap-4 items-start">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Al avanzar, el sistema te mostrará un código QR único para tu pago.</span>
                  </p>
                  <p className="flex gap-4 items-start">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Abre tu app Phantom, presiona el botón Enviar y selecciona la opción para escanear código.</span>
                  </p>
                  <p className="flex gap-4 items-start">
                    <span className="text-green-400 mt-1">•</span>
                    <span>Apunta la cámara de tu teléfono al código QR de la pantalla de Udreamms y confirma el envío de tus monedas LUXOR.</span>
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 w-full">
                {/* Image Placeholder */}
                <div className="aspect-[4/3] w-full rounded-3xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 overflow-hidden relative group">
                  <ImageIcon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform text-white/30" />
                  <span className="font-medium text-lg">Imagen del Paso 3</span>
                  <span className="text-sm mt-2 opacity-60 px-8 text-center">Para reemplazar este cuadro, inserta aquí tu etiqueta <code className="text-purple-400">&lt;img src="..." /&gt;</code> en el código.</span>
                </div>
              </div>
            </div>

          </div>

          {/* Conclusion */}
          <div className="mt-28 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 text-green-400 rounded-full mb-8 border border-green-500/30">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">¡Listo!</h3>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Nuestro sistema de Udreamms detectará el pago en la blockchain de forma automática e iniciaremos tu proceso de inmediato.
            </p>
          </div>

        </div>
      </section>

      {/* WHATSAPP CTA SUPPORT */}
      <section className="py-24 bg-black relative border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/20 p-10 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
            
            {/* Decorative background flare */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <MessageCircle className="w-20 h-20 text-purple-400 mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">📱 ¿Soporte en vivo?</h2>
              <p className="text-xl text-white/70 mb-12 leading-relaxed">
                Si te trabas en algún paso o prefieres asistencia personalizada para asegurar tu descuento, escríbenos directamente por WhatsApp al <strong className="text-white">+1 (385) 416-2224</strong>. Te guiaremos paso a paso.
              </p>
              <a
                href="https://wa.me/13854162224?text=Hola,%20necesito%20ayuda%20para%20realizar%20mi%20pago%20con%20LUXOR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-4 gap-4 text-xl font-medium text-white overflow-hidden rounded-full bg-purple-600 hover:bg-purple-500 transition-all duration-300 shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] hover:-translate-y-1 w-full sm:w-auto"
              >
                Escríbenos por WhatsApp
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
