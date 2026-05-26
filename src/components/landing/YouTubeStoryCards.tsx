"use client";

import { Instagram, Play, ExternalLink } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";

export type YouTubeStory = {
  id: number;
  videoId: string;
  handle: string;
  title: string;
};

function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: none) and (pointer: coarse)");
    const update = () => setIsTouch(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isTouch;
}

function youtubeShortsUrl(videoId: string) {
  return `https://www.youtube.com/shorts/${videoId}`;
}

/** Vista previa silenciada en desktop (hover). */
function previewEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    playsinline: "1",
    controls: "0",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

/** Reproducción en móvil con controles nativos de YouTube (sin recargar al tocar). */
function interactiveEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "0",
    playsinline: "1",
    controls: "1",
    modestbranding: "1",
    rel: "0",
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

type YouTubeStoryCardsProps = {
  stories: YouTubeStory[];
  heading: string;
  subheading: string;
  theme?: "light" | "dark";
  instagramHref?: string;
};

export default function YouTubeStoryCards({
  stories,
  heading,
  subheading,
  theme = "light",
  instagramHref = "https://www.instagram.com/_udreamms/",
}: YouTubeStoryCardsProps) {
  const isTouch = useTouchDevice();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const isDark = theme === "dark";
  const headingClass = isDark ? "text-white" : "text-black";
  const subClass = isDark ? "text-slate-300" : "text-black";

  const openInYouTube = (videoId: string, e?: MouseEvent) => {
    e?.stopPropagation();
    window.open(youtubeShortsUrl(videoId), "_blank", "noopener,noreferrer");
  };

  const handleCardActivate = (story: YouTubeStory) => {
    if (isTouch) {
      setActiveId(story.id);
      return;
    }
    openInYouTube(story.videoId);
  };

  return (
    <section
      className={`py-24 overflow-hidden w-full ${isDark ? "md:py-32 bg-transparent" : "bg-white"}`}
    >
      <div className="w-full max-w-[1600px] px-6 md:px-12 mx-auto">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2
            className={`text-2xl md:text-4xl font-medium tracking-tight mb-4 ${headingClass}`}
          >
            {heading}
          </h2>
          <p className={`text-base md:text-lg font-normal leading-relaxed ${subClass}`}>
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center w-full">
          {stories.map((story) => {
            const isPlayingOnMobile = isTouch && activeId === story.id;
            const isPreviewOnDesktop = !isTouch && hoveredId === story.id;
            const showEmbed = isPlayingOnMobile || isPreviewOnDesktop;

            return (
              <article
                key={story.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCardActivate(story)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardActivate(story);
                  }
                }}
                onMouseEnter={() => !isTouch && setHoveredId(story.id)}
                onMouseLeave={() => !isTouch && setHoveredId(null)}
                className={`relative w-full max-w-[400px] aspect-[9/16] rounded-[2rem] overflow-hidden group cursor-pointer transition-all duration-500 bg-black ${
                  isDark
                    ? "shadow-2xl border border-white/10"
                    : "shadow-lg hover:shadow-2xl"
                }`}
              >
                <div className="absolute inset-0 bg-black">
                  {showEmbed ? (
                    <iframe
                      key={`embed-${story.id}`}
                      src={
                        isTouch
                          ? interactiveEmbedUrl(story.videoId)
                          : previewEmbedUrl(story.videoId)
                      }
                      className={`w-[300%] h-full -ml-[100%] object-cover transition-opacity duration-300 ${
                        isTouch ? "pointer-events-auto" : "pointer-events-none"
                      }`}
                      title={story.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src={`https://img.youtube.com/vi/${story.videoId}/hqdefault.jpg`}
                      alt={story.title}
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100 brightness-110 contrast-[1.15] saturate-[1.2]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                </div>

                {isTouch && !isPlayingOnMobile && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                    <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
                      Toca para reproducir
                    </span>
                  </div>
                )}

                {isTouch && isPlayingOnMobile && (
                  <button
                    type="button"
                    onClick={(e) => openInYouTube(story.videoId, e)}
                    className="absolute top-4 right-4 z-30 flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md px-3 py-2 text-xs font-medium text-white hover:bg-black/90 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir en YouTube
                  </button>
                )}

                {!isTouch && (
                  <button
                    type="button"
                    onClick={(e) => openInYouTube(story.videoId, e)}
                    className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3 py-2 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    YouTube
                  </button>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="/icons/new-icon-udreamms.png"
                      alt="Udreamms"
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="font-medium text-sm tracking-wide">{story.handle}</span>
                  </div>
                  <p className="font-medium text-lg leading-snug text-white/90">{story.title}</p>
                  {isTouch && !isPlayingOnMobile && (
                    <p className="text-xs text-white/60 mt-2">
                      Si no reproduce aquí, usa &quot;Abrir en YouTube&quot;
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex justify-center mt-16 md:mt-32">
          <Button
            className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-medium px-10 py-6 text-lg shadow-xl shadow-orange-500/20 transition-all hover:scale-105 flex items-center gap-2"
            onClick={() => window.open(instagramHref, "_blank", "noopener,noreferrer")}
          >
            Ver más en Instagram
            <Instagram className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
