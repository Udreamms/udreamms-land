"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ArrowRight, Sparkles, Stars } from "lucide-react";
import { motion } from "framer-motion";

const destinations = [
  {
    name: "Miami, Florida",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop",
    description: "Ciudad vibrante con playas hermosas, vida nocturna y cultura latinoamericana.",
    tag: "Popular"
  },
  {
    name: "Orlando, Florida",
    image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&auto=format&fit=crop",
    description: "La capital mundial de los parques temáticos y entretenimiento familiar.",
    tag: "Familiar"
  },
  {
    name: "New York City",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
    description: "La Gran Manzana, el epicentro financiero y cultural del mundo.",
    tag: "Icónico"
  },
  {
    name: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop",
    description: "Centro tecnológico con el Golden Gate y cultura innovadora.",
    tag: "Tech"
  },
  {
    name: "Boston, MA",
    image: "https://images.unsplash.com/photo-1516832970803-325be7a92aa5?w=800&auto=format&fit=crop",
    description: "Ciudad histórica con las universidades más prestigiosas del mundo.",
    tag: "Académico"
  },
  {
    name: "Salt Lake City, Utah",
    image: "/assets/destino-saltlake.jpg",
    description: "Ciudad moderna rodeada de montañas, perfecta para deportes de invierno.",
    tag: "Naturaleza"
  },
  {
    name: "Seattle, Washington",
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop",
    description: "Ciudad innovadora, hogar de grandes empresas tecnológicas y paisajes únicos.",
    tag: "Innovación"
  },
  {
    name: "Washington, D.C.",
    image: "https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=800&auto=format&fit=crop",
    description: "La capital de EE.UU., centro del poder político y rica historia americana.",
    tag: "Histórico"
  },
  {
    name: "Fort Lauderdale, FL",
    image: "/assets/destino-fortlauderdale.jpg",
    description: "Ciudad costera con canales navegables y un ambiente relajado.",
    tag: "Playa"
  },
  {
    name: "Aventura, Florida",
    image: "/assets/destino-aventura.jpg",
    description: "Ciudad moderna con excelentes centros comerciales y ambiente multicultural.",
    tag: "Shopping"
  },
  {
    name: "Orem, Utah",
    image: "/assets/destino-orem.jpg",
    description: "Ciudad universitaria con paisajes montañosos espectaculares.",
    tag: "Estudiantes"
  },
  {
    name: "Atlanta, Georgia",
    image: "/assets/destino-atlanta.jpg",
    description: "Ciudad dinámica, capital del sur con gran cultura y oportunidades.",
    tag: "Negocios"
  }
];

export default function DestinosPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white">
        <div className="container px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
              <Stars className="w-3 h-3 text-primary" />
              Tu futuro comienza aquí
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Encuentra tu destino <br />
              ideal en USA
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Explora las ciudades donde puedes estudiar, crecer y vivir una experiencia inolvidable con el respaldo de Udreamms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 relative z-10 bg-white">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {destinations.map((destination, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index % 3 * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-slate-50 shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] group-hover:-translate-y-2">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  {/* Overlay Gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Contenido sobre la imagen */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <div className="translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                        {destination.tag}
                      </span>
                      <h3 className="text-4xl font-bold text-white mb-3 tracking-tight">
                        {destination.name}
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 max-w-[240px]">
                        {destination.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified & Centered CTA Section */}
      <section className="py-32 relative z-10 bg-white">
        <div className="container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
              ¿Listo para dar el <br />
              primer paso?
            </h2>
            <p className="text-xl text-slate-500 mb-12 leading-relaxed">
              No tienes que hacerlo solo. Agenda una asesoría gratuita hoy mismo y déjanos guiarte hacia tu futuro en Estados Unidos.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-12 py-6 rounded-full bg-primary text-white font-black text-xl shadow-[0_20px_50px_rgba(220,38,38,0.3)] hover:shadow-primary/50 transition-all mx-auto"
            >
              Me gustaría asesoría
              <Sparkles className="w-6 h-6" />
            </motion.button>
            
            <p className="mt-8 text-slate-400 font-medium text-sm">
              Asesoría 100% gratuita y personalizada
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
