export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeShortsUrl(videoId: string) {
  return `https://www.youtube.com/shorts/${videoId}`;
}

export function youtubeEmbedUrl(
  videoId: string,
  mode: "preview" | "interactive" | "destinations-desktop" | "destinations-mobile"
) {
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;

  if (mode === "interactive" || mode === "destinations-mobile") {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: mode === "destinations-mobile" ? "0" : "0",
      playsinline: "1",
      controls: "1",
      modestbranding: "1",
      rel: "0",
      enablejsapi: "1",
    });
    return `${base}?${params}`;
  }

  if (mode === "destinations-desktop") {
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
      enablejsapi: "1",
    });
    return `${base}?${params}`;
  }

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
  return `${base}?${params}`;
}
