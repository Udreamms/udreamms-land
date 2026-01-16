"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// --- DATA ---
const reviews = [
  {
    name: "Carlos Mendoza",
    role: "Visa Estudiante F-1",
    text: "Pensé que me la negarían y Udreamms me preparó para preguntas que no esperaba. ¡Aprobada en 5 minutos!",
    stars: 5,
    avatar: "C"
  },
  {
    name: "Ana P.",
    role: "Visa Turismo B1/B2",
    text: "Excelente servicio. Me ayudaron con todo el formulario DS-160 y la entrevista fue tal cual me dijeron.",
    stars: 5,
    avatar: "A"
  },
  {
    name: "Familia Rodriguez",
    role: "Reubicación Familiar",
    text: "Llegar a Utah con casa y cuenta de banco lista no tiene precio. Udreamms hizo la diferencia.",
    stars: 5,
    avatar: "F"
  },
  {
    name: "Javier T.",
    role: "Curso de Inglés",
    text: "La escuela que me recomendaron es increíble. Mejoré mi inglés en 3 meses más que en 5 años en mi país.",
    stars: 5,
    avatar: "J"
  }
];

const Testimonial = () => {
  const [startIndex, setStartIndex] = useState(0);

  const nextReview = () => setStartIndex((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setStartIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  // Determinar los 4 reviews a mostrar (haciendo wrap around si es necesario)
  const visibleReviews = [
    reviews[startIndex],
    reviews[(startIndex + 1) % reviews.length],
    reviews[(startIndex + 2) % reviews.length],
    reviews[(startIndex + 3) % reviews.length],
  ];

  return (
    <section id="reviews" className="py-24 bg-black relative overflow-hidden w-full">
      <div className="w-full px-4 md:px-10 lg:px-20">
        
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            Ellos ya viven el <br />
            <span className="text-gray-400">sueño americano.</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Historias reales de personas que confiaron en Udreamms para cambiar su futuro.
          </p>
        </div>

        {/* Reviews Carousel - Ocupando todo el ancho disponible */}
        <div className="relative mb-24 w-full flex items-center gap-4">
           {/* Botón Izquierdo */}
           <button onClick={prevReview} className="shrink-0 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all z-10 border border-white/10">
              <ChevronLeft className="w-6 h-6 text-black" />
           </button>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {visibleReviews.map((review, idx) => (
                <div key={`${startIndex}-${idx}`} className="bg-white p-6 rounded-3xl shadow-lg border border-white/10 flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300">
                   <div>
                      <div className="flex justify-between items-center mb-4">
                         <div className="flex gap-0.5">
                           {[...Array(review.stars)].map((_, i) => (
                             <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                           ))}
                         </div>
                      </div>
                      <blockquote className="text-sm md:text-base font-medium text-gray-800 leading-relaxed mb-6">
                        "{review.text}"
                      </blockquote>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                         {review.avatar}
                      </div>
                      <div className="min-w-0">
                         <p className="font-bold text-black text-sm truncate">{review.name}</p>
                         <p className="text-[10px] text-gray-500 truncate">{review.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* Botón Derecho */}
           <button onClick={nextReview} className="shrink-0 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all z-10 border border-white/10">
              <ChevronRight className="w-6 h-6 text-black" />
           </button>
        </div>

      </div>
    </section>
  );
};

export default Testimonial;
