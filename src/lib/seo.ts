import type { Metadata } from "next";

export const SITE_URL = "https://udreamms.com";
export const SITE_NAME = "Udreamms";

export const DEFAULT_DESCRIPTION =
  "Asesoría experta para visas, estudios y nueva vida en Estados Unidos. Tecnología y soporte humano en un solo lugar.";

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export type SitemapEntry = {
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

/** Rutas públicas indexables (sitemap + SEO). */
export const PUBLIC_SITEMAP_ROUTES: SitemapEntry[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/visas/student", changeFrequency: "weekly", priority: 0.95 },
  { path: "/visas/tourist", changeFrequency: "weekly", priority: 0.95 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/destinos", changeFrequency: "monthly", priority: 0.8 },
  { path: "/courses", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.75 },
  { path: "/brochures", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/partnerships", changeFrequency: "monthly", priority: 0.65 },
  { path: "/referrals", changeFrequency: "monthly", priority: 0.65 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
];

const PAGE_SEO: Record<
  string,
  { title: string; description: string }
> = {
  "/": {
    title: "Udreamms | Tu Sueño en USA",
    description: DEFAULT_DESCRIPTION,
  },
  "/about": {
    title: "Acerca de Udreamms",
    description:
      "Conoce la historia, valores y equipo detrás de Udreamms. Transparencia y acompañamiento en tu proceso hacia Estados Unidos.",
  },
  "/destinos": {
    title: "Destinos en USA",
    description:
      "Explora ciudades y destinos populares para estudiar, trabajar y vivir en Estados Unidos con Udreamms.",
  },
  "/courses": {
    title: "Cursos de Inglés en USA",
    description:
      "Programas de inglés en escuelas aliadas en Estados Unidos. Planifica tu formación con asesoría Udreamms.",
  },
  "/services": {
    title: "Servicios en USA",
    description:
      "Vivienda, banca, SIM, transporte y más. Servicios esenciales para tu llegada a Estados Unidos.",
  },
  "/brochures": {
    title: "Brochures y Guías",
    description:
      "Descarga material informativo y da el primer paso en tu proceso con Udreamms.",
  },
  "/contact": {
    title: "Contáctanos",
    description:
      "Habla con el equipo Udreamms. Resolvemos dudas sobre visas, estudios y tu plan hacia USA.",
  },
  "/partnerships": {
    title: "Alianzas Institucionales",
    description:
      "Universidades y escuelas aliadas. Programas de partnership con Udreamms.",
  },
  "/referrals": {
    title: "Programa de Referidos",
    description:
      "Recomienda Udreamms y gana beneficios. Comparte tu experiencia con quienes sueñan con USA.",
  },
  "/faqs": {
    title: "Preguntas Frecuentes",
    description:
      "Respuestas sobre visas F-1, turismo B1/B2, pagos, procesos y soporte al estudiante.",
  },
  "/privacidad": {
    title: "Política de Privacidad",
    description: "Política de privacidad y tratamiento de datos de Udreamms.",
  },
  "/terminos": {
    title: "Términos y Condiciones",
    description: "Términos y condiciones de uso de los servicios Udreamms.",
  },
  "/visas/student": {
    title: "Visa de Estudiante F-1",
    description:
      "Planes y asesoría para visa de estudiante F-1. Estudia en USA con acompañamiento experto Udreamms.",
  },
  "/visas/tourist": {
    title: "Visa de Turismo B1/B2",
    description:
      "Asesoría para visa de turismo B1/B2. Prepara tu viaje a Estados Unidos con confianza.",
  },
};

function canonicalUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path}`;
}

export function pageMetadata(
  path: string,
  options?: { noindex?: boolean }
): Metadata {
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const entry = PAGE_SEO[normalized] ?? PAGE_SEO["/"];
  const url = canonicalUrl(normalized === "/" ? "" : normalized);
  const noindex = options?.noindex ?? false;

  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: url },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url,
      siteName: SITE_NAME,
      locale: "es_US",
      type: "website",
      images: [
        {
          url: "/icons/new-icon-udreamms.png",
          width: 512,
          height: 512,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
    },
    robots: noindex ? NOINDEX_ROBOTS : { index: true, follow: true },
  };
}

export function noindexMetadata(title: string): Metadata {
  return {
    title,
    robots: NOINDEX_ROBOTS,
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Udreamms | Tu Sueño en USA",
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Udreamms | Tu Sueño en USA",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/icons/new-icon-udreamms.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Udreamms | Tu Sueño en USA",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/icons/new-icon-udreamms.png",
    apple: "/icons/new-icon-udreamms.png",
  },
};
