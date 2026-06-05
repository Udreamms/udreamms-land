"use client";

import Link from "next/link";
import { sendMetaEvent } from "@/lib/meta-events";
import { Button } from "@/components/ui/button";
import InlineYouTubeFeature from "@/components/landing/InlineYouTubeFeature";

/** https://www.youtube.com/watch?v=t-tP6hhtCO4&t=72s */
const STUDENT_SHOWCASE_VIDEO_ID = "t-tP6hhtCO4";
const STUDENT_SHOWCASE_START_SECONDS = 72;
const STUDENT_SHOWCASE_POSTER = "/assets/generated/student_showcase_campus.png";

export default function StudentShowcase() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white text-black overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-[1500px]">
        <div className="flex flex-col lg:flex-row-reverse gap-6 lg:gap-24 items-center lg:items-center">
          <div className="w-full lg:w-[35%] flex flex-col pt-2 lg:pt-10 pl-0 lg:pl-8">
            <h2 className="font-normal tracking-tight text-black mb-6 leading-[1.1]">
              <span className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl block mb-2">
                Visa de Estudiante
              </span>
              <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl font-light">
                Tu futuro académico empieza aquí
              </span>
            </h2>
            <p className="text-gray-600 text-base leading-[1.7] font-light">
              Gestionamos todo tu proceso migratorio para que obtengas tu visa F-1:
              preparación profesional de documentos, seguimiento personalizado y
              simulaciones de entrevista consular.
              <br />
              <br />
              Acceso a instituciones reconocidas en Estados Unidos con programas de
              inglés ESL, TOEFL, inglés de negocios y preparación académica. Te
              ayudamos a elegir el programa ideal que se adapte a tus objetivos.
            </p>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed">
              *Nota: Si tienes alguna duda o pregunta puedes agendar una asesoría gratuita para responder a todas tus dudas, intenta tener a la mano una copia de tu estado de cuenta y tu pasaporte.*
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="w-full sm:w-64 px-5 py-2.5 bg-gradient-to-r from-[#2d1b4e] to-[#9b4dca] border border-[#2d1b4e] text-white rounded-full hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm"
              >
                <Link href="/visas/student" onClick={() => sendMetaEvent('Lead', { source: 'StudentShowcase: Quiero saber más' })}>Quiero saber más</Link>
              </Button>
              <Button
                asChild
                className="w-full sm:w-64 px-5 py-2.5 bg-transparent border border-black text-black rounded-full hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] transition-all flex justify-center items-center hover:scale-105 hover:shadow-lg text-sm"
              >
                <a href="https://calendar.app.google/wvmELP7dKEmZKtL37" target="_blank" rel="noopener noreferrer" onClick={() => sendMetaEvent('Lead', { source: 'StudentShowcase: Agendar reunión virtual' })}>Agendar reunión virtual</a>
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-2/3 relative h-[280px] sm:h-[350px] lg:h-[650px] rounded-3xl overflow-hidden shadow-2xl">
            <InlineYouTubeFeature
              videoId={STUDENT_SHOWCASE_VIDEO_ID}
              startSeconds={STUDENT_SHOWCASE_START_SECONDS}
              posterSrc={STUDENT_SHOWCASE_POSTER}
              posterAlt="Visa de estudiante F-1"
              className="rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
