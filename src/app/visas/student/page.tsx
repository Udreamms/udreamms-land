"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, GraduationCap, ArrowRight, Play } from "lucide-react";

export default function StudentVisaPage() {
  const [showVideo, setShowVideo] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero / Landing */}
      <section className="relative pt-32 pb-20 px-6 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/hero-campus.jpg')] bg-cover bg-center opacity-30" />
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Visa F-1 de Estudiante</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ¿Sueñas con estudiar en USA pero te aterra el papeleo?
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubre el método de 5 Fases de Udreamms para asegurar tu futuro académico sin errores costosos.
          </p>
          
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4">Descubre tus probabilidades de aprobación en 2 minutos con nuestra IA</h3>
            <Button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
              Evaluación Gratuita
            </Button>
          </div>
        </div>
      </section>

      {/* VSL Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-black">No vendemos visas, vendemos tu futuro.</h2>
            <p className="text-gray-600 mb-6 text-lg">
              Más que un trámite, te ofrecemos un acompañamiento integral. Desde la elección de la universidad hasta tu llegada al aeropuerto y tu primer día de clases.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                "Asesoría personalizada para elegir programa",
                "Gestión completa de documentos I-20",
                "Preparación intensiva para entrevista consular",
                "Ecosistema de llegada (Vivienda, Banco, Móvil)"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full">
              Agendar Sesión de Admisión
            </Button>
          </div>
          
          <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer" onClick={() => setShowVideo(true)}>
             {/* Placeholder for Video Thumbnail */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
             </div>
             <img src="/assets/hero-campus.jpg" alt="Video Thumbnail" className="w-full h-full object-cover opacity-60" />
          </div>
        </div>
      </section>

      {/* Automated Guide Trigger (Conceptual) */}
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
           {/* Nueva imagen añadida */}
           <div className="w-48 h-48 mb-6 rounded-2xl overflow-hidden shadow-xl border-4 border-gray-50">
             <img 
               src="/assets/c.jpg" 
               alt="Guía Udreamms" 
               className="w-full h-full object-cover" 
             />
           </div>

           {/* Nuevo video añadido debajo de la imagen */}
           <div className="w-full max-w-[450px] aspect-[9/16] mb-8 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-100 bg-black">
              <video 
                src="https://firebasestorage.googleapis.com/v0/b/udreamms-platform-1.firebasestorage.app/o/chatbot_media%2Fcaminando.mp4?alt=media&token=23aa3c50-49ff-4689-9246-3bb06ec26437"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
           </div>
           
           <h2 className="text-2xl font-bold mb-8">¿Aún no estás listo?</h2>
           <p className="text-gray-600 mb-8 max-w-md">Descarga nuestra guía de universidades aliadas y comienza a planear.</p>
           <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white px-10 h-14 rounded-full font-bold">
             Descargar Guía PDF
           </Button>
        </div>
      </section>

      <Footer />

      {/* Lead Gen Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Evaluación de Perfil F-1</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre Completo</label>
              <Input placeholder="Tu nombre" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp</label>
              <Input placeholder="+1 234 567 890" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nivel de Estudios Actual</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highschool">Secundaria / Bachillerato</SelectItem>
                  <SelectItem value="university">Universitario</SelectItem>
                  <SelectItem value="professional">Profesional / Postgrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
              Ver Probabilidades
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
