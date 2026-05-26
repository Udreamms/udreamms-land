"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, ArrowLeft, CreditCard, Plane, Building2, GraduationCap, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- INTERFACES Y DATOS (Sin cambios en tu lógica) ---
interface QuoteData {
  school: string;
  program: string;
  programDuration?: string;
  interculturalLocation?: string;
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
    price: 3000,
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

// --- COMPONENTE PRINCIPAL ---

export const QuoteCalculator = ({ onComplete }: { onComplete: (total: number) => void }) => {
  const [step, setStep] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  // Animación direccional
  const [direction, setDirection] = useState(0);

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "", cardName: "", expiryDate: "", cvv: "", email: "",
  });

  const [quoteData, setQuoteData] = useState<QuoteData>({
    school: "", program: "", programDuration: "", interculturalLocation: "",
    travelType: "", f1Count: 1, f2Count: 0, airportService: true, housingService: true, acceptDiscount: false,
  });

  const isOnlineProgram = quoteData.program === "Inglés Online";
  const isInterculturalProgram = quoteData.program === "Inglés Intercultural";

  const getAvailablePrograms = () => {
    const selectedSchool = schools.find(s => s.name === quoteData.school);
    if (!selectedSchool) return programs;
    return programs.filter(p => selectedSchool.programs.includes(p.name));
  };

  const calculateTotal = () => {
    if (isInterculturalProgram) return getProgramPrice();
    let total = BASE_SERVICES.sevis;
    const totalPersons = quoteData.f1Count + quoteData.f2Count;
    total += (quoteData.f1Count * 300) + (quoteData.f2Count * 200); // Udreamms
    total += totalPersons * 185; // Embassy
    const selectedSchool = schools.find(s => s.name === quoteData.school);
    if (selectedSchool) total += selectedSchool.price;
    if (quoteData.airportService) total += 150;
    if (quoteData.housingService) total += 250;
    return total;
  };

  const getProgramPrice = () => {
    const selectedProgram = programs.find(p => p.name === quoteData.program);
    if (!selectedProgram) return 0;
    if (selectedProgram.name === "Inglés Intercultural" && quoteData.programDuration) {
      return interculturalDurations.find(d => d.weeks === quoteData.programDuration)?.price || 0;
    }
    return selectedProgram.price || 0;
  };

  const progress = (step / 7) * 100;

  const navigate = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };

  const handleNext = () => {
    if (step === 2 && isInterculturalProgram) navigate(6);
    else if (step === 2 && isOnlineProgram) navigate(6);
    else if (step === 3 && isOnlineProgram) navigate(6);
    else if (step < 7) navigate(step + 1);
  };

  const handleBack = () => {
    if (step === 6 && isInterculturalProgram) navigate(2);
    else if (step === 6 && isOnlineProgram) navigate(2);
    else if (step > 1) navigate(step - 1);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(calculateTotal() - 80);
  };

  // Variantes de animación
  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-white font-sans">

      {/* Barra de Progreso Mejorada */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs uppercase tracking-widest text-blue-300/80 mb-2">
          <span>Paso {step} de 7</span>
          <span>{Math.round(progress)}% Completado</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Contenedor Principal Transparente */}
      <div className="bg-transparent"> {/* Quitamos el Card blanco */}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* STEP 1: ESCUELA */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">Selecciona tu Destino</h2>
                  <p className="text-white/70 font-normal">Elige la institución que será tu puerta de entrada a USA</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {schools.map((school) => (
                    <SelectionCard
                      key={school.name}
                      selected={quoteData.school === school.name}
                      onClick={() => setQuoteData({ ...quoteData, school: school.name })}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${quoteData.school === school.name ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-medium text-white">{school.name}</h3>
                          <p className="text-xs text-gray-400">{school.cities}</p>
                        </div>
                      </div>
                    </SelectionCard>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: PROGRAMA */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-medium mb-2 text-white tracking-tight">Elige tu Programa</h2>
                  <p className="text-white/70 font-normal">¿Cuál es tu objetivo académico?</p>
                </div>
                <div className="grid gap-4">
                  {getAvailablePrograms().map((program) => (
                    <SelectionCard
                      key={program.name}
                      selected={quoteData.program === program.name}
                      onClick={() => setQuoteData({ ...quoteData, program: program.name, programDuration: "" })}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="text-left">
                          <h3 className="font-medium text-white mb-1">{program.name}</h3>
                          <p className="text-sm text-gray-400">{program.description}</p>
                          <span className="inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded bg-white/10 text-blue-200 border border-white/5">
                            {program.level}
                          </span>
                        </div>
                        {quoteData.program === program.name && <CheckCircle />}
                      </div>
                    </SelectionCard>
                  ))}
                </div>

                {/* Sub-opciones Intercultural (condicional) */}
                {quoteData.program === "Inglés Intercultural" && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-purple-300 uppercase tracking-wider mb-3">Duración</h4>
                      <div className="flex flex-wrap gap-3">
                        {interculturalDurations.map((d) => (
                          <button
                            key={d.weeks}
                            onClick={() => setQuoteData({ ...quoteData, programDuration: d.weeks })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${quoteData.programDuration === d.weeks ? 'bg-purple-500/20 border-purple-500 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                          >
                            {d.weeks}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-300 uppercase tracking-wider mb-3">Ubicación</h4>
                      <div className="flex flex-wrap gap-3">
                        {interculturalLocations.map((l) => (
                          <button
                            key={l.value}
                            onClick={() => setQuoteData({ ...quoteData, interculturalLocation: l.value })}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${quoteData.interculturalLocation === l.value ? 'bg-blue-500/20 border-blue-500 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                          >
                            {l.location}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* STEP 3: VIAJE */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-medium mb-2 text-white tracking-tight">¿Quién viaja contigo?</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <SelectionCard
                    selected={quoteData.travelType === "solo"}
                    onClick={() => setQuoteData({ ...quoteData, travelType: "solo", f1Count: 1, f2Count: 0 })}
                  >
                    <div className="text-center py-4">
                      <Users className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                      <h3 className="font-medium text-lg mb-1">Viajo Solo</h3>
                      <p className="text-xs text-gray-400 font-medium">Visa F1 Individual</p>
                    </div>
                  </SelectionCard>

                  <SelectionCard
                    selected={quoteData.travelType === "family"}
                    onClick={() => setQuoteData({ ...quoteData, travelType: "family", f1Count: 1, f2Count: 0 })}
                  >
                    <div className="text-center py-4">
                      <Users className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                      <h3 className="font-medium text-lg mb-1">Viajo en Familia</h3>
                      <p className="text-xs text-gray-400 font-medium">Visa F1 + Dependientes F2</p>
                    </div>
                  </SelectionCard>
                </div>

                {quoteData.travelType === "family" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="grid gap-6">
                      <InputGroup label="Estudiantes (F1)" value={quoteData.f1Count} onChange={(v) => setQuoteData({ ...quoteData, f1Count: v })} />
                      <InputGroup label="Dependientes (F2)" value={quoteData.f2Count} onChange={(v) => setQuoteData({ ...quoteData, f2Count: v })} />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* STEP 4: AEROPUERTO */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                    <Plane className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-medium mb-2 text-white tracking-tight">Servicio de Aeropuerto</h2>
                  <p className="text-white/70 font-normal">Llegada VIP en Utah</p>
                </div>

                <div className="grid gap-4">
                  <SelectionCard selected={quoteData.airportService} onClick={() => setQuoteData({ ...quoteData, airportService: true })}>
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><Check className="w-5 h-5" /></div>
                      <div className="text-left">
                        <h3 className="font-medium">Sí, quiero que me recojan</h3>
                        <p className="text-sm text-gray-400">Incluye bienvenida y transporte al domicilio ($150)</p>
                      </div>
                    </div>
                  </SelectionCard>
                  <SelectionCard selected={!quoteData.airportService} onClick={() => setQuoteData({ ...quoteData, airportService: false })}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-2 rounded-lg text-gray-400"><Check className="w-5 h-5" /></div>
                      <div className="text-left">
                        <h3 className="font-medium">No, gracias</h3>
                        <p className="text-sm text-gray-400">Me transportaré por mi cuenta</p>
                      </div>
                    </div>
                  </SelectionCard>
                </div>
              </div>
            )}

            {/* STEP 5: VIVIENDA */}
            {step === 5 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                    <Building2 className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-medium mb-2 text-white tracking-tight">Búsqueda de Vivienda</h2>
                  <p className="text-white/70 font-normal">Evita estafas y asegura tu hogar antes de viajar</p>
                </div>

                <div className="grid gap-4">
                  <SelectionCard selected={quoteData.housingService} onClick={() => setQuoteData({ ...quoteData, housingService: true })}>
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><Check className="w-5 h-5" /></div>
                      <div className="text-left">
                        <h3 className="font-medium">Sí, ayúdenme a buscar</h3>
                        <p className="text-sm text-gray-400">Aplicación y gestión de contrato ($250)</p>
                      </div>
                    </div>
                  </SelectionCard>
                  <SelectionCard selected={!quoteData.housingService} onClick={() => setQuoteData({ ...quoteData, housingService: false })}>
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-2 rounded-lg text-gray-400"><Check className="w-5 h-5" /></div>
                      <div className="text-left">
                        <h3 className="font-medium">No, gracias</h3>
                        <p className="text-sm text-gray-400">Buscaré por mi cuenta</p>
                      </div>
                    </div>
                  </SelectionCard>
                </div>
              </div>
            )}

            {/* STEP 6: RESUMEN (El Recibo) */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-medium mb-2">Resumen de Inversión</h2>
                  <p className="text-gray-400">Revisa los detalles antes de continuar</p>
                </div>

                <div className="bg-white text-black rounded-xl overflow-hidden shadow-2xl max-w-md mx-auto relative">
                  {/* Dientes de sierra decorativos arriba */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                  <div className="p-6 space-y-4">
                    {isInterculturalProgram ? (
                      <>
                        <div className="flex justify-between items-center border-b border-dashed border-gray-300 pb-4">
                          <span className="font-medium text-lg">Programa Todo Incluido</span>
                          <span className="font-medium text-xl">${getProgramPrice()}</span>
                        </div>
                        <ul className="text-sm space-y-2 text-gray-600">
                          <li>• {quoteData.programDuration} en {quoteData.interculturalLocation}</li>
                          <li>• Alojamiento y Comidas</li>
                          <li>• Clases y Actividades</li>
                          <li>• Transporte local</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <SummaryItem label={`Aplicación ${quoteData.school}`} price={schools.find(s => s.name === quoteData.school)?.price || 0} />
                        <SummaryItem label="SEVIS Fee" price={BASE_SERVICES.sevis} />
                        <SummaryItem label="Servicios Udreamms" price={(quoteData.f1Count * 300) + (quoteData.f2Count * 200)} />
                        <SummaryItem label="Citas Consulares" price={(quoteData.f1Count + quoteData.f2Count) * 185} />
                        {quoteData.airportService && <SummaryItem label="Airport Pickup" price={150} />}
                        {quoteData.housingService && <SummaryItem label="Housing Service" price={250} />}

                        <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-300">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-500">Inversión Total Estimada</span>
                            <span className="font-medium text-2xl">${calculateTotal()}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Fondo gris para el total real a pagar hoy (simulado) */}
                  <div className="bg-gray-100 p-4 text-center text-xs text-gray-500">
                    Precios expresados en USD
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: OFERTA FINAL & PAGO */}
            {step === 7 && (
              <div className="space-y-8 max-w-md mx-auto">
                {!showCheckout ? (
                  <div className="text-center space-y-6">
                    <div className="inline-block p-4 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-2 animate-bounce">
                      <span className="text-3xl">🎉</span>
                    </div>
                    <h2 className="text-4xl font-medium text-white tracking-tight">¡Ahorra $80 USD!</h2>
                    <p className="text-white/80 font-normal">Si inicias tu proceso hoy, te descontamos $80 de los servicios de Udreamms.</p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                      <div className="flex justify-between text-gray-400 line-through">
                        <span>Precio Regular</span>
                        <span>${calculateTotal()}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-medium text-white mt-2 tracking-tight">
                        <span>Precio Hoy</span>
                        <span className="text-green-400">${calculateTotal() - 80}</span>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => { setQuoteData({ ...quoteData, acceptDiscount: true }); setShowCheckout(true); }}
                      className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_30px_rgba(37,99,235,0.5)] border-0"
                    >
                      Reclamar Descuento
                    </Button>

                    <button onClick={() => window.open('https://pay.hotmart.com/U102847033Y', '_blank')} className="text-sm text-gray-500 hover:text-white underline">
                      No gracias, prefiero comprar solo el Libro Digital
                    </button>
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                      <CreditCard className="text-blue-400" />
                      <h3 className="text-xl font-medium text-white">Pago Seguro</h3>
                    </div>
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Email</Label>
                        <DarkInput type="email" placeholder="tu@email.com" value={paymentData.email} onChange={e => setPaymentData({ ...paymentData, email: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Nombre en Tarjeta</Label>
                        <DarkInput placeholder="Como aparece en la tarjeta" value={paymentData.cardName} onChange={e => setPaymentData({ ...paymentData, cardName: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Número</Label>
                        <DarkInput placeholder="0000 0000 0000 0000" maxLength={19} value={paymentData.cardNumber} onChange={e => setPaymentData({ ...paymentData, cardNumber: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Expira</Label>
                          <DarkInput placeholder="MM/YY" maxLength={5} value={paymentData.expiryDate} onChange={e => setPaymentData({ ...paymentData, expiryDate: e.target.value })} required />
                        </div>
                        <div>
                          <Label className="text-gray-300">CVC</Label>
                          <DarkInput placeholder="123" maxLength={4} value={paymentData.cvv} onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value })} required />
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-medium h-12">
                        Pagar ${calculateTotal() - 80} USD
                      </Button>
                      <button type="button" onClick={() => setShowCheckout(false)} className="w-full text-center text-sm text-gray-500 mt-4 hover:text-white">
                        Cancelar y volver
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Botones de Navegación Footer */}
      <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 1}
          className="text-gray-400 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
        </Button>

        {step < 7 && (
          <Button
            onClick={handleNext}
            disabled={(step === 1 && !quoteData.school) || (step === 2 && !quoteData.program) || (step === 3 && !quoteData.travelType)}
            className="bg-white text-black hover:bg-gray-200 font-medium px-8"
          >
            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

    </div>
  );
};

// --- SUB-COMPONENTES PARA ESTILO ---

const SelectionCard = ({ selected, onClick, children }: { selected: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`
      w-full p-5 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group
      ${selected
        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
        : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
      }
    `}
  >
    {children}
    {/* Efecto de brillo en hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
  </button>
);

const CheckCircle = () => (
  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
    <Check className="w-3.5 h-3.5 text-white font-medium" />
  </div>
);

const DarkInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <Input
    {...props}
    className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
  />
);

const InputGroup = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-300 font-medium">{label}</span>
    <div className="flex items-center gap-3">
      <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">-</button>
      <span className="w-8 text-center text-white font-medium">{value}</span>
      <button onClick={() => onChange(Math.min(10, value + 1))} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">+</button>
    </div>
  </div>
);

const SummaryItem = ({ label, price }: { label: string, price: number }) => (
  <div className="flex justify-between text-sm border-b border-gray-100 last:border-0 py-2">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="font-medium text-gray-900">${price}</span>
  </div>
);
