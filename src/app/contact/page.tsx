"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Mail, FileText, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <section id="contact" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-10">
              Contacta a un Asesor
            </h2>
            
            <div className="text-left w-full max-w-4xl mx-auto space-y-6">
              {/* Paso 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:bg-white/10 transition-colors duration-300 shadow-sm">
                 <div className="bg-purple-600/20 p-4 rounded-full border border-purple-500/30 flex-shrink-0 text-purple-400">
                    <FileText className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-semibold text-white mb-3">1. Prepara tus Documentos</h3>
                    <p className="text-white/80 text-lg leading-relaxed">
                      Si te gustaría empezar tu proceso, asegúrate de contar con tu <strong>Pasaporte</strong> y tu <strong>Estado de Cuenta</strong>, preferiblemente escaneados en formato PDF.
                    </p>
                 </div>
              </div>
              
              {/* Paso 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:bg-white/10 transition-colors duration-300 shadow-sm">
                 <div className="bg-blue-600/20 p-4 rounded-full border border-blue-500/30 flex-shrink-0 text-blue-400">
                    <Mail className="w-8 h-8" />
                 </div>
                 <div className="w-full">
                    <h3 className="text-2xl font-semibold text-white mb-3">2. Envíanos tu Información</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-6">
                      Envía un correo a <a href="mailto:services@udreamms.com" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors font-medium">services@udreamms.com</a> adjuntando ambos documentos e incluyendo la siguiente información:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-black/40 p-6 rounded-xl border border-white/5 text-base text-white/90">
                      <ul className="list-disc list-inside space-y-3">
                        <li>Nombre y Apellido</li>
                        <li>País donde vives actualmente</li>
                        <li>Correo electrónico (Email)</li>
                        <li>Teléfono de contacto</li>
                      </ul>
                      <ul className="list-disc list-inside space-y-3">
                        <li>Programa de interés</li>
                        <li>Ciudad en la que deseas estudiar</li>
                        <li>Preguntas para nuestro equipo</li>
                      </ul>
                    </div>
                 </div>
              </div>

              {/* Paso 3 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:bg-white/10 transition-colors duration-300 shadow-sm">
                 <div className="bg-green-600/20 p-4 rounded-full border border-green-500/30 flex-shrink-0 text-green-400">
                    <MessageCircle className="w-8 h-8" />
                 </div>
                 <div className="w-full">
                    <h3 className="text-2xl font-semibold text-white mb-3">3. Habla con un Asesor</h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      Una vez enviado el correo, contacta directamente a uno de nuestros asesores en vivo. Al conectarte, indícale que ya has enviado tus documentos para iniciar tu proceso y recibirás asistencia inmediata con los pasos a seguir.
                    </p>
                    <div className="flex justify-start">
                      <a
                        href="https://wa.me/13854162224?text=Hola,%20ya%20envi%C3%A9%20mi%20pasaporte%20y%20estado%20de%20cuenta%20por%20correo.%20Me%20gustar%C3%ADa%20iniciar%20mi%20proceso."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 gap-3 text-lg font-medium text-white overflow-hidden rounded-full bg-transparent border-2 border-white/40 hover:bg-purple-600 hover:border-purple-600 hover:scale-[1.02] transition-all duration-300 shadow-lg"
                      >
                        Comunicarme con un asesor en Vivo
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                      </a>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
