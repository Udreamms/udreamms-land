"use client";

import { Instagram, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const studentVideos = [
  {
    id: 1,
    handle: "@udreamms",
    title: "Nuestros estudiantes logrando sus metas.",
    thumb: "/assets/hero-campus.jpg",
    video: "/assets/chatbot_media/9.mp4"
  },
  {
    id: 2,
    handle: "@udreamms",
    title: "Tu éxito es nuestra prioridad.",
    thumb: "/assets/hero-newyork.jpg",
    video: "/assets/chatbot_media/8.mp4"
  },
  {
    id: 3,
    handle: "@udreamms",
    title: "Acompañamiento en cada paso.",
    thumb: "/assets/hero-living-space.jpg",
    video: "/assets/chatbot_media/7.mp4"
  },
  {
    id: 4,
    handle: "@udreamms",
    title: "Viviendo el sueño americano.",
    thumb: "/assets/hero-campus.jpg",
    video: "/assets/chatbot_media/6.mp4"
  },
  {
    id: 5,
    handle: "@udreamms",
    title: "Explorando la ciudad.",
    thumb: "/assets/hero-newyork.jpg",
    video: "/assets/chatbot_media/9.mp4"
  },
  {
    id: 6,
    handle: "@udreamms",
    title: "Mi nueva vida en USA.",
    thumb: "/assets/hero-living-space.jpg",
    video: "/assets/chatbot_media/8.mp4"
  }
];

export default function JoinOurStudents() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden w-full">
      <div className="container px-6 md:px-12 mx-auto">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 text-black">
              Historias de Éxito <br className="hidden md:block" />
              <span className="text-black font-medium">Reales.</span>
            </h2>
            <p className="text-xl text-black font-normal leading-relaxed">
              Descubre por qué cientos de estudiantes confían en nosotros para su futuro.
            </p>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Stories Grid/Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {studentVideos.map((story) => (
            <div
              key={story.id}
              className="relative shrink-0 snap-center w-[280px] md:w-[320px] aspect-[9/16] rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={story.thumb}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <Instagram className="w-5 h-5 text-white" />
                  <span className="font-medium text-sm tracking-wide">{story.handle}</span>
                </div>

                <p className="font-medium text-lg leading-snug text-white/90">
                  {story.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="md:hidden flex justify-center gap-4 mt-2 mb-12">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center">
          <Button
            className="rounded-full bg-slate-900 hover:bg-black text-white font-medium px-10 py-6 text-lg shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            onClick={() => window.open('https://instagram.com/udreamms', '_blank')}
          >
            Ver más en Instagram
            <Instagram className="w-5 h-5" />
          </Button>
        </div>

      </div>
    </section>
  );
}
