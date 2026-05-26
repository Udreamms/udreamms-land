"use client";

import Link from "next/link";
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
            <Button
              asChild
              className="mt-6 w-fit px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm"
            >
              <Link href="/visas/student">Saber más</Link>
            </Button>
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
