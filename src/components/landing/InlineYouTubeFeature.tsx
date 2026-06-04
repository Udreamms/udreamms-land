"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/youtube";

type InlineYouTubeFeatureProps = {
  videoId: string;
  startSeconds?: number;
  posterSrc?: string;
  posterAlt?: string;
  className?: string;
};

/**
 * YouTube embebido con controles completos (volumen, pantalla completa, etc.).
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

  return (
    <div
      ref={ref}
      className={`relative w-full h-full min-h-[280px] bg-[#0a0a0a] overflow-hidden ${className}`}
    >
      {isInView ? (
        <>
          <iframe
            key={`inline-yt-${videoId}`}
            src={youtubeEmbedUrl(videoId, "player", { startSeconds })}
            className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
            title={posterAlt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />

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
