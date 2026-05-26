export function youtubeWatchUrl(videoId: string, startSeconds?: number) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  if (startSeconds == null || startSeconds <= 0) return url;
  return `${url}&t=${startSeconds}s`;
}

export function youtubeShortsUrl(videoId: string) {
  return `https://www.youtube.com/shorts/${videoId}`;
}

type YoutubeEmbedOptions = {
  startSeconds?: number;
};

export function youtubeEmbedUrl(
  videoId: string,
  mode: "preview" | "interactive" | "destinations-desktop" | "destinations-mobile",
  options?: YoutubeEmbedOptions
) {
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const start =
    options?.startSeconds != null && options.startSeconds > 0
      ? String(Math.floor(options.startSeconds))
      : undefined;

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
    if (start) params.set("start", start);
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
    if (start) params.set("start", start);
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
  if (start) params.set("start", start);
  return `${base}?${params}`;
}
