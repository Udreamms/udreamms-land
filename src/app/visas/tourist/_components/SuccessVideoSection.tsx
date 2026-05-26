"use client";

import YouTubeStoryCards, { type YouTubeStory } from "@/components/landing/YouTubeStoryCards";

const baseVideos = [
  "BMUmTjVBqxI",
  "4VLdkd8Slko",
  "YqSJmu3Au0k",
  "_YjuuYRG08c",
];

const touristVideos: YouTubeStory[] = [
  { id: 1, videoId: baseVideos[0], handle: "@udreamms", title: "Aventuras en USA 🇺🇸" },
  { id: 2, videoId: baseVideos[1], handle: "@udreamms", title: "Descubriendo nuevos lugares ✨" },
  { id: 3, videoId: baseVideos[2], handle: "@udreamms", title: "Vacaciones inolvidables 🌴" },
  { id: 4, videoId: baseVideos[3], handle: "@udreamms", title: "Viviendo el sueño 🗽" },
];

export default function SuccessVideoSection() {
  return (
    <YouTubeStoryCards
      stories={touristVideos}
      heading="Más Historias de Éxito"
      subheading="Descubre por qué cientos de turistas confían en nosotros para su viaje a USA."
      theme="dark"
    />
  );
}
