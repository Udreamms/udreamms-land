"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(1, "Phone number is required").max(50),
  language: z.string().min(1, "Please select a language"),
  countryOfResidence: z.string().min(1, "Please select your country of residence"),
  nationality: z.string().min(1, "Please select your nationality"),
  hasPassport: z.string().min(1, "Please select if you have a valid passport"),
});

interface PreApplicationFormProps {
  onClose: () => void;
}

const PreApplicationForm = ({ onClose }: PreApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      language: "",
      countryOfResidence: "",
      nationality: "",
      hasPassport: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      console.log("Form submitted:", values);
      toast.success("¡Aplicación enviada exitosamente! Te contactaremos pronto.");
      form.reset();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      toast.error("Hubo un error al enviar la aplicación. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const countries = [
    "United States", "Mexico", "Brazil", "Colombia", "Argentina", 
    "Chile", "Peru", "Venezuela", "Ecuador", "Bolivia",
    "Paraguay", "Uruguay", "Costa Rica", "Panama", "Guatemala",
    "Honduras", "El Salvador", "Nicaragua", "Dominican Republic", "Cuba",
    "Puerto Rico", "Haiti", "Jamaica", "Trinidad and Tobago", "Canada",
    "Spain", "Portugal", "Other"
  ];

  const languages = ["English", "Español", "Português", "Other"];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-lg shadow-2xl max-w-2xl w-full my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-3">
              Pre-Aplicación
            </h2>
            <p className="text-muted-foreground">
              Completa este formulario para comenzar el proceso de visa.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name / Nome / Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name / Sobrenome / Apellido *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Phone / Celular / Telephono Movil *</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language / Idioma *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="- Select a Value -" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countryOfResidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Residence / País de Residencia *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="- Select a Country -" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality / Nacionalidade / Nacionalidad *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="- Select a Country -" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasPassport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Do you have a valid passport? / ¿Tienes un pasaporte válido? / Possui passaporte válido? *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="- Select a Value -" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="yes">Yes / Sí / Sim</SelectItem>
                        <SelectItem value="no">No / No / Não</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Aplicación"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PreApplicationForm;
