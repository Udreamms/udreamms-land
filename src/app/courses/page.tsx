"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Globe, BookOpen } from "lucide-react";
import Link from "next/link";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Inglés Intensivo Presencial",
      description: "Programa intensivo de inglés con clases presenciales en Estados Unidos. Ideal para quienes buscan una inmersión total en el idioma.",
      icon: GraduationCap,
      features: [
        "18-20 horas de clase por semana",
        "Grupos reducidos",
        "Certificación oficial"
      ],
      duration: "12-52 semanas",
      level: "Todos los niveles"
    },
    {
      id: 2,
      title: "Inglés Online",
      description: "Aprende inglés desde cualquier lugar con nuestras clases en vivo. Flexibilidad total con resultados garantizados.",
      icon: Globe,
      features: [
        "Clases en vivo con profesores nativos",
        "Horarios flexibles",
        "Plataforma interactiva",
        "Material digital incluido"
      ],
      duration: "Flexible",
      level: "Todos los niveles"
    },
    {
      id: 3,
      title: "Inglés Intercultural",
      description: "Exclusivo para personas con visa de turista. El programa incluye clases de inglés, alojamiento, transporte y actividades culturales.",
      icon: Globe,
      features: [
        "Inmersión cultural completa",
        "Visitas a lugares históricos",
        "Interacción con nativos",
        "Ciudades: Florida (verano) o Utah (invierno)"
      ],
      duration: "4 semanas",
      level: "Todos los niveles"
    },
    {
      id: 4,
      title: "TOEFL Preparación",
      description: "Curso especializado para prepararte para el examen TOEFL. Estrategias y práctica intensiva para alcanzar tu mejor puntaje.",
      icon: BookOpen,
      features: [
        "Enfoque en las 4 secciones del examen",
        "Exámenes de práctica oficiales",
        "Técnicas y estrategias comprobadas",
        "Seguimiento personalizado"
      ],
      duration: "12-24 semanas",
      level: "Intermedio-Avanzado"
    },
    {
      id: 5,
      title: "IELTS Program",
      description: "Preparación especializada para el examen IELTS. Disponible en San Francisco, Atlanta, Aventura, Boston, Fort Lauderdale y Miami.",
      icon: BookOpen,
      features: [
        "Preparación para Academic y General Training",
        "Práctica intensiva de Speaking",
        "Simulacros de examen oficial",
        "Ciudades: San Francisco, Atlanta, Aventura, Boston, Fort Lauderdale, Miami"
      ],
      duration: "4-12 semanas",
      level: "Intermedio-Avanzado"
    },
    {
      id: 6,
      title: "Inglés de Negocios",
      description: "Programa especializado en inglés corporativo y profesional. Disponible en San Francisco, Atlanta, Aventura, Boston, Fort Lauderdale y Miami.",
      icon: GraduationCap,
      features: [
        "Vocabulario de negocios y finanzas",
        "Presentaciones y negociaciones",
        "Correspondencia profesional",
        "Ciudades: San Francisco, Atlanta, Aventura, Boston, Fort Lauderdale, Miami"
      ],
      duration: "8-24 semanas",
      level: "Intermedio-Avanzado"
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
              Nuestros Cursos de Inglés
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Encuentra el programa perfecto para alcanzar tus objetivos académicos y profesionales
            </p>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => {
                const Icon = course.icon;
                return (
                  <Card key={course.id} className="hover:shadow-elevated transition-shadow">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{course.title}</CardTitle>
                      <CardDescription className="text-base">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2">Características:</h4>
                        <ul className="space-y-2">
                          {course.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">Duración:</span>
                          <span className="text-muted-foreground">{course.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Nivel:</span>
                          <span className="text-muted-foreground">{course.level}</span>
                        </div>
                      </div>
                      <Link href="/?calculator=true" className="block">
                        <Button className="w-full" size="lg">
                          Solicitar una Cotización
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              ¿Listo para comenzar tu aventura?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nuestro equipo está listo para ayudarte a elegir el curso perfecto para ti
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/?calculator=true">
                <Button size="lg" className="px-8">
                  Solicitar Cotización
                </Button>
              </Link>
              <Link href="/brochures">
                <Button size="lg" variant="outline" className="px-8">
                  Descargar Brochures
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
