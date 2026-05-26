"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useTouchDevice } from "@/hooks/use-touch-device";
import {
  youtubeEmbedUrl,
  youtubeWatchUrl,
} from "@/lib/youtube";

type InlineYouTubeFeatureProps = {
  videoId: string;
  startSeconds?: number;
  posterSrc?: string;
  posterAlt?: string;
  className?: string;
};

/**
 * Bloque video vertical (home). En táctil: controles YouTube + enlace externo.
 * En escritorio: preview silenciada al entrar en viewport.
 */
export default function InlineYouTubeFeature({
  videoId,
  startSeconds,
  posterSrc,
  posterAlt = "Video",
  className = "",
}: InlineYouTubeFeatureProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-15% 0px -15% 0px" });
  const isTouch = useTouchDevice();

  return (
    <div
      ref={ref}
      className={`relative w-full h-full min-h-[280px] bg-[#0a0a0a] overflow-hidden ${className}`}
    >
      {isInView ? (
        <>
          <iframe
            key={`inline-yt-${videoId}-${isTouch ? "touch" : "desk"}`}
            src={youtubeEmbedUrl(videoId, isTouch ? "interactive" : "preview", {
              startSeconds,
            })}
            className={`absolute inset-0 w-full h-full border-0 ${
              isTouch ? "pointer-events-auto" : "pointer-events-none"
            }`}
            title={posterAlt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {isTouch && (
            <a
              href={youtubeWatchUrl(videoId, startSeconds)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              YouTube
            </a>
          )}
        </>
      ) : posterSrc ? (
        <img
          src={posterSrc}
          alt={posterAlt}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
          Desplázate para cargar el video
        </div>
      )}
    </div>
  );
}
