import { SITE_NAME, SITE_URL } from "@/lib/seo";

const LOGO_URL = `${SITE_URL}/icons/new-icon-udreamms.png`;

export default function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: [
      "https://www.facebook.com/udreamms/",
      "https://www.instagram.com/udreamms/",
      "https://www.youtube.com/@udreamms",
      "https://x.com/udreamms",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
