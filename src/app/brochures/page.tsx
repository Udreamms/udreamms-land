"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Brochures = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  const brochures = [
    {
      id: 1,
      title: "Estudia Inglés en Utah",
      description: "Orem, Salt Lake City",
      image: "/assets/brochure-utah.jpg"
    },
    {
      id: 2,
      title: "Estudia Inglés en Florida",
      description: "Miami, Orlando, Boca Ratón, Jacksonville, Aventura",
      image: "/assets/brochure-florida.jpg"
    },
    {
      id: 3,
      title: "Estudia Inglés en New York",
      description: "New York, New Jersey",
      image: "/assets/brochure-newyork.jpg"
    },
    {
      id: 4,
      title: "Estudia Inglés en California",
      description: "California",
      image: "/assets/brochure-california.jpg"
    },
    {
      id: 5,
      title: "Estudia Inglés en Washington D.C.",
      description: "Washington D.C. - La capital de Estados Unidos",
      image: "/assets/brochure-washington.jpg"
    },
    {
      id: 6,
      title: "Estudia Inglés en Virginia",
      description: "Virginia - Historia y belleza natural",
      image: "/assets/brochure-virginia.jpg"
    },
    {
      id: 7,
      title: "Estudia Inglés en Boston",
      description: "Boston - Cuna de la educación en Estados Unidos",
      image: "/assets/brochure-boston.jpg"
    },
    {
      id: 8,
      title: "Estudia Inglés en Georgia",
      description: "Atlanta",
      image: "/assets/brochure-georgia.jpg"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDownload = (brochureTitle: string) => {
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      toast.error("Por favor completa todos los campos antes de descargar");
      return;
    }

    toast.success(`Descargando: ${brochureTitle}`);
    
    // Aquí se implementaría la lógica real de descarga
    console.log("Descargando brochure:", brochureTitle, "Usuario:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary-glow to-secondary py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Descarga Nuestros Brochures
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Obtén información detallada sobre nuestros programas en diferentes destinos
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="shadow-elevated border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Tu nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido *</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Tu apellido"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Brochures Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Selecciona y Descarga</h2>
              <p className="text-lg text-muted-foreground">
                {!formData.nombre || !formData.apellido || !formData.email || !formData.telefono ? (
                  <span className="text-destructive font-semibold">
                    ⚠️ Completa el formulario arriba para habilitar las descargas
                  </span>
                ) : (
                  <span className="text-primary font-semibold">
                    ✓ Formulario completo - Ya puedes descargar los brochures
                  </span>
                )}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {brochures.map((brochure) => (
                <Card key={brochure.id} className="overflow-hidden hover:shadow-elevated transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={brochure.image}
                      alt={brochure.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{brochure.title}</CardTitle>
                    <CardDescription>{brochure.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleDownload(brochure.title)}
                      className="w-full"
                      size="lg"
                      disabled={!formData.nombre || !formData.apellido || !formData.email || !formData.telefono}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {!formData.nombre || !formData.apellido || !formData.email || !formData.telefono 
                        ? "Completa el formulario primero" 
                        : "Descargar Brochure"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Brochures;
