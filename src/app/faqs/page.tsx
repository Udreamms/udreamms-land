"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, GraduationCap, MapPin, Home } from "lucide-react";
import { useState } from "react";

const FAQs = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "visa",
      title: "Proceso de Visa",
      icon: FileText,
      color: "from-primary to-primary-glow",
      faqs: [
        {
          question: "¿Qué tipo de visa necesito para estudiar en Estados Unidos?",
          answer: "Necesitas una visa F-1 para estudios académicos. Te ayudamos con todo el proceso de solicitud y preparación para la entrevista."
        },
        {
          question: "¿Cuánto tiempo toma obtener la visa de estudiante?",
          answer: "El proceso generalmente toma de 4 a 8 semanas desde la solicitud hasta la entrevista. Te recomendamos aplicar al menos 3 meses antes de tu fecha de inicio."
        },
        {
          question: "¿Qué documentos necesito para la visa?",
          answer: "Necesitas: formulario I-20, pasaporte válido, comprobante de pago SEVIS, fotos, comprobante de fondos financieros, y carta de aceptación de la escuela."
        },
        {
          question: "¿Puedo trabajar con visa de estudiante?",
          answer: "Sí, puedes trabajar hasta 20 horas semanales en el campus durante el semestre y tiempo completo en vacaciones. Después de un año, puedes aplicar a CPT/OPT."
        }
      ]
    },
    {
      id: "programs",
      title: "Programas",
      icon: GraduationCap,
      color: "from-secondary to-primary",
      faqs: [
        {
          question: "¿Cuánto dura el programa de inglés?",
          answer: "Los programas varían de 12 a 52 semanas dependiendo de tus objetivos. Ofrecemos desde cursos cortos hasta programas académicos completos."
        },
        {
          question: "¿Qué nivel de inglés necesito para empezar?",
          answer: "Nuestros programas aceptan desde nivel principiante hasta avanzado. Realizamos una prueba de nivelación para ubicarte en el nivel correcto."
        },
        {
          question: "¿Los programas incluyen certificación?",
          answer: "Sí, al finalizar recibes un certificado oficial de la institución. Los programas TOEFL incluyen preparación para el examen oficial."
        },
        {
          question: "¿Puedo cambiar de programa una vez en Estados Unidos?",
          answer: "Sí, es posible cambiar de programa o extender tu estadía. Te ayudamos con todos los trámites necesarios con inmigración."
        }
      ]
    },
    {
      id: "destinations",
      title: "Destinos",
      icon: MapPin,
      color: "from-accent to-primary-glow",
      faqs: [
        {
          question: "¿En qué ciudades tienen programas?",
          answer: "Tenemos programas en New York, Los Angeles, Miami, Orlando, Boston, San Francisco, y más de 20 ciudades en Estados Unidos."
        },
        {
          question: "¿Cómo elijo la mejor ciudad para mí?",
          answer: "Te ayudamos a elegir basándonos en tus intereses, presupuesto, clima preferido y oportunidades profesionales. Cada ciudad tiene sus ventajas únicas."
        },
        {
          question: "¿Puedo transferirme a otra ciudad durante mi programa?",
          answer: "Sí, muchas escuelas tienen campus en varias ciudades. Podemos coordinar tu transferencia manteniendo tu visa activa."
        },
        {
          question: "¿Hay actividades culturales incluidas?",
          answer: "Sí, la mayoría de programas incluyen actividades semanales como tours, deportes, y eventos culturales para practicar inglés."
        }
      ]
    },
    {
      id: "housing",
      title: "Vivienda",
      icon: Home,
      color: "from-primary-glow to-secondary",
      faqs: [
        {
          question: "¿Ayudan con el alojamiento?",
          answer: "Sí, te ayudamos a encontrar opciones de homestay, residencias estudiantiles o apartamentos compartidos cerca de tu escuela."
        },
        {
          question: "¿Cuánto cuesta el alojamiento?",
          answer: "Varía según la ciudad y tipo: homestay $800-1200/mes, residencias $1000-1500/mes, apartamentos compartidos $700-1500/mes."
        },
        {
          question: "¿Puedo elegir mi compañero de cuarto?",
          answer: "En muchos casos sí. Te conectamos con otros estudiantes y puedes elegir vivir con personas de intereses similares."
        },
        {
          question: "¿El alojamiento incluye comidas?",
          answer: "No incluye comidas."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary via-primary-glow to-secondary py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre estudiar en Estados Unidos
            </p>
          </div>
        </section>

        {/* Categories Selection */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Selecciona una Categoría
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      isSelected ? "ring-2 ring-primary shadow-elevated" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs Display */}
        {selectedCategory && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 max-w-4xl">
              {categories
                .filter((cat) => cat.id === selectedCategory)
                .map((category) => (
                  <div key={category.id}>
                    <h2 className="text-3xl font-bold text-center mb-12">
                      {category.title}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.faqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="bg-card rounded-lg px-6 shadow-soft"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-semibold">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <Card className="max-w-3xl mx-auto shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">¿No encuentras tu respuesta?</CardTitle>
                <CardDescription className="text-base">
                  Nuestro equipo está listo para ayudarte con cualquier pregunta adicional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Contáctanos directamente y te responderemos en menos de 24 horas
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:info@udreamms.com" className="text-primary hover:underline font-medium">
                    info@udreamms.com
                  </a>
                  <span className="hidden sm:inline text-muted-foreground">|</span>
                  <a href="tel:+16507840581" className="text-primary hover:underline font-medium">
                    +1 650 784 0581
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
