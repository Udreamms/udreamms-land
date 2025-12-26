import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, ArrowLeft, CreditCard } from "lucide-react";

interface QuoteData {
  school: string;
  program: string;
  programDuration?: string; // For intercultural program
  interculturalLocation?: string; // For intercultural program location
  travelType: "solo" | "family" | "";
  f1Count: number;
  f2Count: number;
  airportService: boolean;
  housingService: boolean;
  acceptDiscount: boolean;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  email: string;
}

const programs = [
  { 
    name: "Inglés Intensivo Presencial", 
    description: "Todos los niveles - De principiante a avanzado",
    level: "Todos los niveles",
    price: 2200,
    duration: "4 meses"
  },
  { 
    name: "Inglés Online", 
    description: "Todos los niveles - Estudia desde cualquier lugar",
    level: "Todos los niveles",
    price: 79,
    monthly: 99,
    duration: "Aplicación + mensualidad"
  },
  { 
    name: "Inglés Intercultural", 
    description: "Todos los niveles - Inmersión cultural completa",
    level: "Todos los niveles",
    price: 3000, // Base price for 2 weeks
    hasDuration: true
  },
  { 
    name: "TOEFL Preparation", 
    description: "Inglés intermedio-avanzado requerido",
    level: "Intermedio-Avanzado",
    price: 2200,
    duration: "4 meses"
  },
  { 
    name: "IELTS Preparation", 
    description: "Inglés intermedio-avanzado requerido",
    level: "Intermedio-Avanzado",
    price: 2200,
    duration: "4 meses"
  },
  { 
    name: "Inglés de Negocios", 
    description: "Inglés intermedio-avanzado requerido",
    level: "Intermedio-Avanzado",
    price: 2200,
    duration: "4 meses"
  },
];

const interculturalDurations = [
  { weeks: "2 semanas", price: 3000 },
  { weeks: "3 semanas", price: 3740 },
  { weeks: "4 semanas", price: 4500 },
];

const schools = [
  { 
    name: "Lumos Language School", 
    cities: "Utah, Washington", 
    price: 100,
    programs: ["Inglés Intensivo Presencial", "Inglés Intercultural", "TOEFL Preparation"]
  },
  { 
    name: "MILA Academy", 
    cities: "Miami, Orlando, Jacksonville, Atlanta, Fort Lauderdale", 
    price: 260,
    programs: ["Inglés Intensivo Presencial", "Inglés de Negocios"]
  },
  { 
    name: "TALK School", 
    cities: "San Francisco, Aventura, Boston, Atlanta, Fort Lauderdale, Miami", 
    price: 150,
    programs: ["Inglés Intensivo Presencial", "TOEFL Preparation", "IELTS Preparation"]
  },
  { 
    name: "UCEDA International", 
    cities: "New York, New Jersey, Virginia, Washington", 
    price: 150,
    programs: ["Inglés Intensivo Presencial", "Inglés Online", "TOEFL Preparation"]
  },
];

const interculturalLocations = [
  { location: "Miami (Verano)", value: "miami" },
  { location: "Utah (Invierno)", value: "utah" },
];

const BASE_SERVICES = {
  sevis: 350,
  udreamms: 380,
  consular: 185,
};

export const QuoteCalculator = ({ onComplete }: { onComplete: (total: number) => void }) => {
  const [step, setStep] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: "",
  });
  const [quoteData, setQuoteData] = useState<QuoteData>({
    school: "",
    program: "",
    programDuration: "",
    interculturalLocation: "",
    travelType: "",
    f1Count: 1,
    f2Count: 0,
    airportService: true,
    housingService: true,
    acceptDiscount: false,
  });

  const isOnlineProgram = quoteData.program === "Inglés Online";
  const isInterculturalProgram = quoteData.program === "Inglés Intercultural";
  
  const getAvailablePrograms = () => {
    const selectedSchool = schools.find(s => s.name === quoteData.school);
    if (!selectedSchool) return programs;
    
    // Filter programs based on what the school offers
    const schoolPrograms = programs.filter(p => 
      selectedSchool.programs.includes(p.name)
    );
    
    return schoolPrograms;
  };

  const calculateTotal = () => {
    // For Intercultural program, only return the program price (includes everything)
    if (isInterculturalProgram) {
      return getProgramPrice();
    }
    
    let total = BASE_SERVICES.sevis;
    
    // Calculate Udreamms services based on F1 and F2 counts
    const totalPersons = quoteData.f1Count + quoteData.f2Count;
    const udreammsF1Cost = quoteData.f1Count * 300;
    const udreammsF2Cost = quoteData.f2Count * 200;
    const udreammsTotal = udreammsF1Cost + udreammsF2Cost;
    
    // Calculate embassy appointments (185 per person)
    const embassyTotal = totalPersons * 185;
    
    total += udreammsTotal + embassyTotal;
    
    const selectedSchool = schools.find(s => s.name === quoteData.school);
    if (selectedSchool) {
      total += selectedSchool.price;
    }
    
    if (quoteData.airportService) {
      total += 150;
    }
    
    if (quoteData.housingService) {
      total += 250;
    }
    
    return total;
  };

  const getProgramPrice = () => {
    const selectedProgram = programs.find(p => p.name === quoteData.program);
    if (!selectedProgram) return 0;
    
    if (selectedProgram.name === "Inglés Intercultural" && quoteData.programDuration) {
      const duration = interculturalDurations.find(d => d.weeks === quoteData.programDuration);
      return duration?.price || 0;
    }
    
    return selectedProgram.price || 0;
  };

  const progress = (step / 7) * 100;

  const handleNext = () => {
    // For Intercultural program, skip directly to summary after program selection
    if (step === 2 && isInterculturalProgram) {
      setStep(6);
    }
    // For Online program, skip to summary after program selection
    else if (step === 2 && isOnlineProgram) {
      setStep(6);
    }
    // Skip steps 4 and 5 for Online program (but not for Intercultural)
    else if (step === 3 && isOnlineProgram) {
      setStep(6);
    } else if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your payment processor
    alert("Procesando pago... (integrar con procesador de pagos real)");
    // Simulate success
    onComplete(calculateTotal() - 80);
  };

  const handleBack = () => {
    // For Intercultural program, go back directly to program selection from summary
    if (step === 6 && isInterculturalProgram) {
      setStep(2);
    }
    // For Online program, go back directly to program selection from summary
    else if (step === 6 && isOnlineProgram) {
      setStep(2);
    }
    // Skip steps 4 and 5 when going back for Online program
    else if (step === 6 && isOnlineProgram) {
      setStep(3);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Paso {step} de 7</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8 shadow-[var(--shadow-elevated)]">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Selecciona tu escuela</h2>
              <p className="text-muted-foreground">
                Elige la institución donde deseas estudiar en Estados Unidos
              </p>
            </div>
            <div className="grid gap-4">
              {schools.map((school) => (
                <button
                  key={school.name}
                  onClick={() => setQuoteData({ ...quoteData, school: school.name })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    quoteData.school === school.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{school.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {school.cities}
                      </p>
                    </div>
                    {quoteData.school === school.name && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Selecciona tu Programa</h2>
              <p className="text-muted-foreground">
                Elige el programa de inglés que mejor se adapte a tus necesidades
              </p>
            </div>
            <div className="grid gap-4">
              {getAvailablePrograms().map((program) => (
                <button
                  key={program.name}
                  onClick={() => {
                    setQuoteData({ ...quoteData, program: program.name, programDuration: "" });
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    quoteData.program === program.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{program.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {program.description}
                      </p>
                      <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {program.level}
                      </span>
                    </div>
                    {quoteData.program === program.name && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center ml-4">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {quoteData.program === "Inglés Intercultural" && (
              <>
                <div className="space-y-4 mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">Selecciona la duración</h3>
                  <div className="grid gap-3">
                    {interculturalDurations.map((duration) => (
                      <button
                        key={duration.weeks}
                        onClick={() => setQuoteData({ ...quoteData, programDuration: duration.weeks })}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          quoteData.programDuration === duration.weeks
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{duration.weeks}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {quoteData.programDuration && (
                  <div className="space-y-4 mt-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold">Selecciona la ubicación</h3>
                    <div className="grid gap-3">
                      {interculturalLocations.map((loc) => (
                        <button
                          key={loc.value}
                          onClick={() => setQuoteData({ ...quoteData, interculturalLocation: loc.value })}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            quoteData.interculturalLocation === loc.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{loc.location}</span>
                            {quoteData.interculturalLocation === loc.value && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Información de Viaje</h2>
              <p className="text-muted-foreground">
                ¿Viajarás solo o en familia?
              </p>
            </div>
            <div className="grid gap-4">
              <button
                onClick={() => setQuoteData({ ...quoteData, travelType: "solo", f1Count: 1, f2Count: 0 })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  quoteData.travelType === "solo"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Viajo Solo</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Solo yo necesito la visa de estudiante
                    </p>
                  </div>
                  {quoteData.travelType === "solo" && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={() => setQuoteData({ ...quoteData, travelType: "family", f1Count: 1, f2Count: 0 })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  quoteData.travelType === "family"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Viajo en Familia</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Necesito visas para mi familia (cónyuge e/o hijos)
                    </p>
                  </div>
                  {quoteData.travelType === "family" && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {quoteData.travelType === "family" && (
              <div className="space-y-4 mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">¿Cuántas personas en total?</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="f1Count">Estudiantes F1 (Principal)</Label>
                    <p className="text-xs text-muted-foreground">
                      Personas que estudiarán con visa F1
                    </p>
                    <Input
                      id="f1Count"
                      type="number"
                      min="1"
                      max="10"
                      value={quoteData.f1Count}
                      onChange={(e) => setQuoteData({ ...quoteData, f1Count: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="f2Count">Dependientes F2 (Cónyuge e hijos)</Label>
                    <p className="text-xs text-muted-foreground">
                      Familiares que viajarán con visa F2 de dependiente
                    </p>
                    <Input
                      id="f2Count"
                      type="number"
                      min="0"
                      max="10"
                      value={quoteData.f2Count}
                      onChange={(e) => setQuoteData({ ...quoteData, f2Count: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      Total de personas: {quoteData.f1Count + quoteData.f2Count}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Servicios Udreamms: ${quoteData.f1Count * 300} (F1) + ${quoteData.f2Count * 200} (F2) = ${quoteData.f1Count * 300 + quoteData.f2Count * 200}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Citas de embajada: {quoteData.f1Count + quoteData.f2Count} × $185 = ${(quoteData.f1Count + quoteData.f2Count) * 185}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Servicio de Aeropuerto</h2>
              <p className="text-muted-foreground">
                ¿Necesitas que te recojamos y llevemos al aeropuerto? (Solo disponible en Utah)
              </p>
            </div>
            <div className="grid gap-4">
              <button
                onClick={() => setQuoteData({ ...quoteData, airportService: true })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  quoteData.airportService
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Incluir Servicio</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Incluye recogida y entrega en tu domicilio
                    </p>
                  </div>
                  {quoteData.airportService && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={() => setQuoteData({ ...quoteData, airportService: false })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  !quoteData.airportService
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">No, gracias</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Me encargaré del transporte por mi cuenta
                    </p>
                  </div>
                  {!quoteData.airportService && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Servicio de Vivienda</h2>
              <p className="text-muted-foreground">
                Te ayudamos a encontrar y aplicar a tu vivienda ideal
              </p>
            </div>
            <div className="grid gap-4">
              <button
                onClick={() => setQuoteData({ ...quoteData, housingService: true })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  quoteData.housingService
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Incluir Servicio</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Encontramos tu vivienda y hacemos la aplicación
                    </p>
                  </div>
                  {quoteData.housingService && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={() => setQuoteData({ ...quoteData, housingService: false })}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  !quoteData.housingService
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">No, gracias</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Buscaré vivienda por mi cuenta
                    </p>
                  </div>
                  {!quoteData.housingService && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Resumen de tu Cotización</h2>
              <p className="text-muted-foreground">
                {isInterculturalProgram 
                  ? "Tu programa todo incluido con visa de turista"
                  : "Aquí está el desglose completo de tu inversión"}
              </p>
            </div>
            <div className="space-y-4">
              {isInterculturalProgram ? (
                <>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Programa Intercultural Todo Incluido
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{quoteData.program}</span>
                          {quoteData.programDuration && (
                            <span className="text-sm text-muted-foreground ml-2">
                              - {quoteData.programDuration}
                            </span>
                          )}
                          {quoteData.interculturalLocation && (
                            <span className="text-sm text-muted-foreground ml-2">
                              - {interculturalLocations.find(l => l.value === quoteData.interculturalLocation)?.location}
                            </span>
                          )}
                        </div>
                        <span className="font-medium text-lg">
                          ${getProgramPrice()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-primary">
                      ✓ Incluye Todo lo Siguiente
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Alojamiento y alimentos</strong> durante toda tu estadía</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Curso de inglés</strong> completo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Actividades culturales</strong> y recreativas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span><strong>Transporte</strong> (recogida en aeropuerto, despedida, y transporte para todas las actividades del programa)</span>
                      </li>
                    </ul>
                    <p className="text-xs text-muted-foreground italic mt-3 pt-3 border-t">
                      * Este programa es para personas con visa de turista. No requiere visa de estudiante F1.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total de tu Inversión</span>
                      <span className="text-3xl font-bold">${calculateTotal()}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Servicios Migratorios Base
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Aplicación ({quoteData.school})</span>
                        <span className="font-medium">
                          ${schools.find(s => s.name === quoteData.school)?.price}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>SEVIS</span>
                        <span className="font-medium">${BASE_SERVICES.sevis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Servicios Udreamms ({quoteData.f1Count} F1 × $300 + {quoteData.f2Count} F2 × $200)</span>
                        <span className="font-medium">${quoteData.f1Count * 300 + quoteData.f2Count * 200}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Citas Consulares ({quoteData.f1Count + quoteData.f2Count} personas × $185)</span>
                        <span className="font-medium">${(quoteData.f1Count + quoteData.f2Count) * 185}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      Programa de Inglés Seleccionado
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{quoteData.program}</span>
                        </div>
                        <span className="font-medium line-through opacity-60">
                          ${getProgramPrice()}
                        </span>
                      </div>
                    </div>
                    {!isOnlineProgram && (
                      <p className="text-xs text-muted-foreground italic mt-2 pt-2 border-t">
                        * El programa de inglés se paga DESPUÉS de que tu visa sea aprobada
                      </p>
                    )}
                  </div>

                  {(quoteData.airportService || quoteData.housingService) && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Servicios Adicionales
                      </h3>
                      <div className="space-y-2">
                        {quoteData.airportService && (
                          <div className="flex justify-between">
                            <span>Servicio de Aeropuerto</span>
                            <span className="font-medium">$150</span>
                          </div>
                        )}
                        {quoteData.housingService && (
                          <div className="flex justify-between">
                            <span>Servicio de Vivienda</span>
                            <span className="font-medium">$250</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total de tu Inversión</span>
                      <span className="text-3xl font-bold">${calculateTotal()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">🎉 ¡Oferta Especial!</h2>
              <p className="text-muted-foreground">
                Aprovecha esta promoción exclusiva solo por hoy
              </p>
            </div>
            
            {/* Cost breakdown with discount */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Tu Inversión Total</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Aplicación ({quoteData.school})</span>
                  <span>${schools.find(s => s.name === quoteData.school)?.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>SEVIS</span>
                  <span>${BASE_SERVICES.sevis}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Servicios Udreamms ({quoteData.f1Count} F1 + {quoteData.f2Count} F2)</span>
                  <span>${quoteData.f1Count * 300 + quoteData.f2Count * 200}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Citas Consulares ({quoteData.f1Count + quoteData.f2Count} personas)</span>
                  <span>${(quoteData.f1Count + quoteData.f2Count) * 185}</span>
                </div>
                {quoteData.airportService && (
                  <div className="flex justify-between text-sm">
                    <span>Servicio de Aeropuerto</span>
                    <span>$150</span>
                  </div>
                )}
                {quoteData.housingService && (
                  <div className="flex justify-between text-sm">
                    <span>Servicio de Vivienda</span>
                    <span>$250</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="line-through opacity-60">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-primary">
                  <span>Descuento especial de hoy</span>
                  <span>-$80</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-2 border-t">
                  <span>Total a pagar</span>
                  <span>${calculateTotal() - 80}</span>
                </div>
              </div>
            </div>
            
            {!showCheckout ? (
              <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg p-6 space-y-4 border-2 border-primary/20">
                <div className="text-center">
                  <p className="text-sm font-medium mb-4">✓ Ahorra $80 USD comprando ahora</p>
                  <Button
                    onClick={() => {
                      setQuoteData({ ...quoteData, acceptDiscount: true });
                      setShowCheckout(true);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    Sí, quiero aprovechar esta oferta
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border-2 border-primary/20 rounded-lg p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <h3 className="text-xl font-bold">Información de Pago</h3>
                </div>
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                    <Input
                      id="cardName"
                      placeholder="Juan Pérez"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        if (/^\d*$/.test(value) && value.length <= 16) {
                          const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                          setPaymentData({ ...paymentData, cardNumber: formatted });
                        }
                      }}
                      required
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            const formatted = value.length >= 2 
                              ? `${value.slice(0, 2)}/${value.slice(2)}` 
                              : value;
                            setPaymentData({ ...paymentData, expiryDate: formatted });
                          }
                        }}
                        required
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setPaymentData({ ...paymentData, cvv: value });
                          }
                        }}
                        required
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button type="submit" className="w-full" size="lg">
                      Pagar ${calculateTotal() - 80} USD
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCheckout(false)}
                    className="w-full"
                  >
                    Volver
                  </Button>
                </form>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">o si prefieres hacerlo por tu cuenta...</p>
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Libro Digital Udreamms</h3>
                <p className="text-sm text-muted-foreground">
                  Aprende el paso a paso para hacer el trámite migratorio por ti mismo/a
                </p>
                <Button
                  onClick={() => {
                    window.open('https://pay.hotmart.com/U102847033Y', '_blank');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Prefiero hacerlo yo mismo/a con el libro
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Button>
          {step === 6 ? (
            <Button
              onClick={() => window.open('https://wa.link/hu9dub', '_blank')}
              className="gap-2"
            >
              Hablar con un Agente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !quoteData.school) || 
                (step === 2 && !quoteData.program) ||
                (step === 2 && quoteData.program === "Inglés Intercultural" && (!quoteData.programDuration || !quoteData.interculturalLocation)) ||
                (step === 3 && !quoteData.travelType)
              }
              className="gap-2"
            >
              {step === 7 ? "" : "Siguiente"}
              {step !== 7 && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
