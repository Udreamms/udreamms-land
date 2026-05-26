"use client";

import YouTubeStoryCards, { type YouTubeStory } from "@/components/landing/YouTubeStoryCards";

const baseVideos = [
  "BMUmTjVBqxI",
  "4VLdkd8Slko",
  "YqSJmu3Au0k",
  "_YjuuYRG08c",
];

const studentVideos: YouTubeStory[] = [
  { id: 1, videoId: baseVideos[0], handle: "@udreamms", title: "Cumpliendo metas en USA 🇺🇸" },
  { id: 2, videoId: baseVideos[1], handle: "@udreamms", title: "Tu futuro empieza aquí ✨" },
  { id: 3, videoId: baseVideos[2], handle: "@udreamms", title: "Experiencias inolvidables 🎓" },
  { id: 4, videoId: baseVideos[3], handle: "@udreamms", title: "Viviendo el sueño americano 🗽" },
];

export default function SuccessStoriesSection() {
  return (
    <YouTubeStoryCards
      stories={studentVideos}
      heading="Historias de Éxito Reales"
      subheading="Descubre por qué cientos de personas confían en nosotros para su futuro."
      theme="light"
    />
  );
}
