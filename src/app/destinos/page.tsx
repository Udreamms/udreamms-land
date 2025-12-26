"use client";

import TopBar from "@/components/landing/TopBar";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { MapPin } from "lucide-react";

const Destinos = () => {
  const destinations = [
    {
      name: "Miami, Florida",
      image: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=800&auto=format&fit=crop",
      description: "Ciudad vibrante con playas hermosas, vida nocturna y cultura latinoamericana"
    },
    {
      name: "Orlando, Florida",
      image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=800&auto=format&fit=crop",
      description: "La capital mundial de los parques temáticos y entretenimiento familiar"
    },
    {
      name: "Fort Lauderdale, Florida",
      image: "/assets/destino-fortlauderdale.jpg",
      description: "Ciudad costera con hermosas playas, canales navegables y ambiente relajado"
    },
    {
      name: "Aventura, Florida",
      image: "/assets/destino-aventura.jpg",
      description: "Ciudad moderna con excelentes centros comerciales y ambiente multicultural"
    },
    {
      name: "Jacksonville, Florida",
      image: "/assets/destino-jacksonville.jpg",
      description: "La ciudad más grande de Florida con hermosas playas y vida cultural"
    },
    {
      name: "San Francisco, California",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop",
      description: "Centro tecnológico con el Golden Gate, colinas pintorescas y cultura innovadora"
    },
    {
      name: "New York City",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop",
      description: "La Gran Manzana, centro financiero y cultural del mundo"
    },
    {
      name: "New Jersey",
      image: "/assets/destino-newjersey.jpg",
      description: "Estado diverso con hermosas costas, ciudades vibrantes y cercanía a Nueva York"
    },
    {
      name: "Salt Lake City, Utah",
      image: "/assets/destino-saltlake.jpg",
      description: "Ciudad moderna rodeada de montañas, perfecta para estudiantes y deportes de invierno"
    },
    {
      name: "Orem, Utah",
      image: "/assets/destino-orem.jpg",
      description: "Ciudad universitaria con paisajes montañosos espectaculares y ambiente familiar"
    },
    {
      name: "Seattle, Washington",
      image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop",
      description: "Ciudad innovadora, hogar de grandes empresas tecnológicas y naturaleza espectacular"
    },
    {
      name: "Boston, Massachusetts",
      image: "https://images.unsplash.com/photo-1516832970803-325be7a92aa5?w=800&auto=format&fit=crop",
      description: "Ciudad histórica con las universidades más prestigiosas del mundo"
    },
    {
      name: "Atlanta, Georgia",
      image: "/assets/destino-atlanta.jpg",
      description: "Ciudad dinámica, capital del sur con gran cultura, historia y oportunidades"
    },
    {
      name: "Washington, D.C.",
      image: "https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=800&auto=format&fit=crop",
      description: "La capital de Estados Unidos, centro del poder político y rica historia americana"
    },
    {
      name: "Virginia",
      image: "/assets/destino-virginia.jpg",
      description: "Estado histórico con ciudades vibrantes, playas y montañas, cerca de Washington D.C."
    }
  ];

  return (
    <div className="min-h-screen">
      <TopBar onGetQuote={() => window.location.href = '/?calculator=true'} />
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Destinos para Estudiar en USA
            </h1>
            <p className="text-xl text-white/90">
              Descubre las mejores ciudades donde tenemos escuelas aliadas para comenzar tu aventura americana
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {destinations.map((destination, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] transition-all overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                    {destination.name}
                  </h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground">
                    {destination.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-glow">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para elegir tu destino?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Contáctanos y te ayudaremos a encontrar la escuela perfecta en la ciudad de tus sueños
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white text-primary rounded-lg shadow-lg hover:scale-105 transition-all"
          >
            Solicitar Información
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Destinos;
