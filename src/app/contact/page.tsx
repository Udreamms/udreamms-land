"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const contactSchema = z.object({
  nombre: z.string().trim().min(1, { message: "El nombre es requerido" }).max(100, { message: "El nombre debe tener menos de 100 caracteres" }),
  apellido: z.string().trim().min(1, { message: "El apellido es requerido" }).max(100, { message: "El apellido debe tener menos de 100 caracteres" }),
  pais: z.string().min(1, { message: "El país es requerido" }),
  email: z.string().trim().email({ message: "Email inválido" }).max(255, { message: "El email debe tener menos de 255 caracteres" }),
  telefono: z.string().trim().min(1, { message: "El teléfono es requerido" }).max(50, { message: "El teléfono debe tener menos de 50 caracteres" }),
  programa: z.string().min(1, { message: "El programa es requerido" }),
  ciudad: z.string().trim().min(1, { message: "La ciudad es requerida" }).max(100, { message: "La ciudad debe tener menos de 100 caracteres" }),
  preguntas: z.string().trim().max(1000, { message: "Las preguntas deben tener menos de 1000 caracteres" }).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      pais: "",
      email: "",
      telefono: "",
      programa: "",
      ciudad: "",
      preguntas: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Aquí puedes agregar la lógica para enviar el formulario
      console.log("Form data:", data);

      toast.success("¡Formulario enviado! Nos pondremos en contacto contigo pronto.");

      form.reset();
    } catch (error) {
      toast.error("Hubo un problema al enviar el formulario. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <section id="contact" className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mb-6">
              Contacta a un Asesor
            </h2>
            <div className="text-base md:text-lg text-white/90 max-w-3xl mx-auto space-y-4 text-left md:text-center mt-6">
              <p>
                Si ya cuentas con tu <strong>Pasaporte</strong> y <strong>Estado de Cuenta</strong>, y te gustaría empezar tu proceso, envíanos un correo a <a href="mailto:services@udreamms.com" className="font-semibold text-blue-400 hover:underline">services@udreamms.com</a> adjuntando ambos documentos escaneados (preferiblemente en formato PDF).
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-left mt-6 mb-6 w-full shadow-sm mx-auto">
                <p className="mb-4 font-semibold text-white">Por favor, incluye la siguiente información en tu correo:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-90 text-sm md:text-base ml-2">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Nombre y Apellido</li>
                    <li>País donde vives actualmente</li>
                    <li>Correo electrónico (Email)</li>
                    <li>Teléfono de contacto</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Programa de interés</li>
                    <li>Ciudad en la que deseas estudiar</li>
                    <li>Preguntas para nuestro equipo</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4">
                Una vez enviado el correo, completa y envía el formulario de abajo para contactar de manera directa con uno de nuestros asesores. Al conectarte, indícale que ya has enviado tus documentos para iniciar tu proceso y recibirás asistencia inmediata con los pasos a seguir.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="group hover:shadow-card transition-all duration-300 border border-white/10 shadow-soft bg-black">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu nombre" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="apellido"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apellido</FormLabel>
                            <FormControl>
                              <Input placeholder="Tu apellido" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="pais"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País donde vives actualmente</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona tu país" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mexico">México</SelectItem>
                              <SelectItem value="colombia">Colombia</SelectItem>
                              <SelectItem value="argentina">Argentina</SelectItem>
                              <SelectItem value="chile">Chile</SelectItem>
                              <SelectItem value="peru">Perú</SelectItem>
                              <SelectItem value="venezuela">Venezuela</SelectItem>
                              <SelectItem value="ecuador">Ecuador</SelectItem>
                              <SelectItem value="spain">España</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 234 567 8900" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="programa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Programa</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un programa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="licenciatura">Licenciatura</SelectItem>
                              <SelectItem value="maestria">Maestría</SelectItem>
                              <SelectItem value="doctorado">Doctorado</SelectItem>
                              <SelectItem value="ingles">Curso de Inglés</SelectItem>
                              <SelectItem value="certificacion">Certificación</SelectItem>
                              <SelectItem value="otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ciudad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad en la que quieres estudiar</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Nueva York, Los Ángeles, Miami..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preguntas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>¿Preguntas para nuestro equipo?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Escribe tus preguntas o comentarios aquí..."
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full font-medium"
                      size="lg"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Formulario"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
