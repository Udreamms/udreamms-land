"use client";

import FullWidthYouTubeSection from "@/components/landing/FullWidthYouTubeSection";

/** https://www.youtube.com/watch?v=fzrRzLDcm0c&t=374s */
const FEATURED_VIDEO_ID = "fzrRzLDcm0c";
const FEATURED_START_SECONDS = 374;

export default function FeaturedSuccessVideoSection() {
  return (
    <FullWidthYouTubeSection
      videoId={FEATURED_VIDEO_ID}
      startSeconds={FEATURED_START_SECONDS}
      heading="Historias de Éxito Reales"
      subheading="Mira cómo nuestros clientes lograron su visa de turismo y cumplieron su sueño de viajar a Estados Unidos."
      theme="dark"
    />
  );
}
