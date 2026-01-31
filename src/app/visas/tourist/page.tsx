"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Plane, AlertTriangle } from "lucide-react";

export default function TouristVisaPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sky-400 font-bold tracking-wider uppercase text-sm mb-4 block">Visa B1/B2 Turismo y Negocios</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Tramita tu Visa de Turista sin errores que cuesten la aprobación.
            </h1>
            
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-8 flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-1" />
              <p className="text-red-200 text-sm">
                El 40% de las visas se niegan por errores simples en el formulario DS-160. No seas uno más de la estadística.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-sky-400" /> Revisión de expertos formulario DS-160</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-sky-400" /> Preparación simulacro de entrevista</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-sky-400" /> Adelanto de citas (según disponibilidad)</li>
            </ul>

            <Button onClick={() => document.getElementById('quiz')?.scrollIntoView({behavior:'smooth'})} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-6 text-lg rounded-full w-full sm:w-auto">
              Iniciar Trámite Seguro
            </Button>
          </div>
          
          <div className="relative h-[400px] bg-gray-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
             <img src="/assets/hero-newyork.jpg" alt="USA Tourism" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
            {step === 1 && (
              <div className="space-y-6 fade-in">
                <h2 className="text-2xl font-bold text-center mb-2">Pre-Cualificación Rápida</h2>
                <p className="text-center text-gray-500 mb-8">Responde 3 preguntas para saber si tu perfil es apto.</p>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">¿Tienes familiares directos viviendo en USA?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="h-12">Sí</Button>
                    <Button variant="outline" onClick={() => setStep(2)} className="h-12">No</Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 fade-in">
                <h2 className="text-2xl font-bold text-center mb-8">Situación Laboral</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">¿Trabajas o estudias actualmente?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => setStep(3)} className="h-12">Sí, trabajo/estudio</Button>
                    <Button variant="outline" onClick={() => setStep(3)} className="h-12">No actualmente</Button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
               <div className="text-center fade-in">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="w-8 h-8 text-green-600" />
                 </div>
                 <h2 className="text-2xl font-bold mb-4">¡Tienes un perfil apto!</h2>
                 <p className="text-gray-600 mb-8">Tu perfil muestra lazos fuertes. Vamos a blindarlo para asegurar esa aprobación.</p>
                 
                 <div className="bg-slate-50 p-6 rounded-xl mb-8 text-left">
                   <h3 className="font-bold mb-2">Asesoría Inicial + Revisión</h3>
                   <div className="flex justify-between items-center">
                     <span className="text-gray-500">Precio especial hoy:</span>
                     <span className="text-xl font-bold text-sky-600">$49 USD</span>
                   </div>
                 </div>

                 <Button className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg rounded-xl">
                   Agendar Asesoría Ahora
                 </Button>
                 
                 <p className="text-xs text-gray-400 mt-4 italic">
                   "Pensé que me la negarían y Udreamms me preparó para preguntas que no esperaba" - Cliente Satisfecho
                 </p>
               </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
