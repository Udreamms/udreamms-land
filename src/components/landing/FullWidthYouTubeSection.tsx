"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/youtube";

type FullWidthYouTubeSectionProps = {
  videoId: string;
  startSeconds?: number;
  heading: string;
  subheading?: string;
  theme?: "light" | "dark";
};

/**
 * Video YouTube a todo el ancho del viewport (sin max-width en el reproductor).
 */
export default function FullWidthYouTubeSection({
  videoId,
  startSeconds,
  heading,
  subheading,
  theme = "dark",
}: FullWidthYouTubeSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const isTouch = useTouchDevice();
  const isDark = theme === "dark";

  const embedOptions = { startSeconds };

  return (
    <section
      className={`w-full overflow-hidden ${isDark ? "bg-[#050507] text-white" : "bg-white text-black"}`}
    >
      <div className="container mx-auto px-6 pt-16 pb-8 md:pt-20 md:pb-10 max-w-4xl text-center">
        <h2
          className={`text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {heading}
        </h2>
        {subheading && (
          <p
            className={`text-base md:text-lg font-normal leading-relaxed ${
              isDark ? "text-slate-300" : "text-gray-600"
            }`}
          >
            {subheading}
          </p>
        )}
      </div>

      <div className="w-full px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto pb-16">
        <div
          ref={ref}
          className="relative w-full aspect-video min-h-[240px] sm:min-h-[360px] md:min-h-[500px] bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
        {isInView ? (
          <>
            <iframe
              key={`fullwidth-yt-${videoId}-${isTouch ? "touch" : "desk"}`}
              src={youtubeEmbedUrl(
                videoId,
                isTouch ? "interactive" : "preview",
                embedOptions
              )}
              className={`absolute inset-0 w-full h-full border-0 ${
                isTouch ? "pointer-events-auto" : "pointer-events-none"
              }`}
              title={heading}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {isTouch && (
              <a
                href={youtubeWatchUrl(videoId, startSeconds)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-2 text-xs font-medium text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                YouTube
              </a>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm">
            Cargando video…
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
