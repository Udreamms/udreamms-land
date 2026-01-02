"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, ArrowRight, Sparkles, CheckCircle2, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />
      
      <main>
        {/* Hero Section - Apple Display Style */}
        <section className="relative pt-40 pb-24 bg-[#F5F5F7]">
          <div className="container mx-auto px-6 md:px-12 max-w-[1400px]">
            <div className="max-w-4xl text-left">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-600 font-bold tracking-tight text-xl mb-4 block"
              >
                Programa de Referidos
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-bold text-[#1d1d1f] tracking-tighter leading-[0.9] mb-8"
              >
                Refiere a un amigo. <br />
                Gana $50 USD.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-[#86868b] font-medium max-w-3xl leading-relaxed"
              >
                Ayuda a tus amigos a cumplir su sueño de estudiar en EE. UU. y recibe una recompensa por cada proceso iniciado con éxito.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8">
               {[
                 { title: "Ganas tú", desc: "Recibe $50 USD directo a tu cuenta por cada referido calificado.", icon: Gift, color: "text-emerald-500", bg: "bg-emerald-50" },
                 { title: "Ganan ellos", desc: "Tus amigos obtienen acceso a la mejor asesoría estratégica de USA.", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
                 { title: "Sin Límites", desc: "No hay tope de referidos. Entre más ayudes, más ganas.", icon: Users, color: "text-blue-500", bg: "bg-blue-50" }
               ].map((item, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.1 }}
                   className="p-10 rounded-[3rem] bg-[#F5F5F7] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all duration-500"
                 >
                    <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                       <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-[#1d1d1f] mb-4">{item.title}</h3>
                    <p className="text-[#86868b] font-medium leading-relaxed">{item.desc}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* Form Section - Modern Apple Style */}
        <section className="py-24 bg-[#F5F5F7]">
          <div className="container mx-auto px-6 max-w-3xl">
             <div className="bg-white rounded-[3.5rem] p-8 md:p-16 shadow-sm border border-slate-100">
                <div className="text-center mb-12">
                   <h2 className="text-4xl font-bold text-[#1d1d1f] tracking-tight">Formulario de Referido</h2>
                   <p className="text-[#86868b] font-medium mt-2">Ingresa los datos para registrar tu recomendación</p>
                </div>

                <form className="space-y-8">
                   <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1d1d1f] border-b border-slate-100 pb-2">Tus Datos (Referidor)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="Tu Nombre Completo" className="h-14 rounded-2xl bg-[#F5F5F7] border-0 text-lg shadow-sm" />
                        <Input placeholder="Tu WhatsApp" className="h-14 rounded-2xl bg-[#F5F5F7] border-0 text-lg shadow-sm" />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#1d1d1f] border-b border-slate-100 pb-2">Datos de tu Amigo (Referido)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input placeholder="Nombre de tu Amigo" className="h-14 rounded-2xl bg-[#F5F5F7] border-0 text-lg shadow-sm" />
                        <Input placeholder="Su WhatsApp" className="h-14 rounded-2xl bg-[#F5F5F7] border-0 text-lg shadow-sm" />
                      </div>
                      <Input type="email" placeholder="Su Correo Electrónico" className="h-14 rounded-2xl bg-[#F5F5F7] border-0 text-lg shadow-sm" />
                   </div>

                   <Button className="w-full h-16 rounded-full bg-[#1d1d1f] hover:bg-[#333] text-white font-bold text-xl transition-all shadow-xl hover:shadow-2xl mt-4">
                      Registrar Referido
                      <ArrowRight className="w-6 h-6 ml-2" />
                   </Button>
                </form>
             </div>
          </div>
        </section>

        {/* Support Footer */}
        <section className="py-32 bg-white text-center">
           <div className="container px-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                 <Sparkles className="w-12 h-12 text-[#1d1d1f] mx-auto mb-8 animate-pulse" />
                 <h2 className="text-4xl md:text-8xl font-bold text-[#1d1d1f] mb-8 tracking-tighter leading-[0.9]">
                   Hagamos que suceda <br />
                   para todos.
                 </h2>
                 <p className="text-xl text-[#86868b] mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
                   Si tienes una red de contactos grande o eres influencer, contáctanos para un plan de comisiones personalizado.
                 </p>
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="px-14 py-7 rounded-full bg-[#1d1d1f] text-white font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all"
                 >
                   Contacto para Embajadores
                 </motion.button>
              </motion.div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
