// next.config.mjs
var nextConfig = {
  images: {
    remotePatterns: [
      // From next.config.mjs
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/random/**"
      },
      // From next.config.ts
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**"
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups"
          }
        ]
      }
    ];
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
