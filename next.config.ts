import type { NextConfig } from "next";

// Content-Security-Policy. Third-party code is limited to Google Tag Manager
// and the tags the GTM-TMHF7F container loads today, found by testing:
// Google Analytics, Google Ads conversion (google.com/ccm, doubleclick) and
// ZoomInfo (zi-scripts.com, zoominfo.com, and its Clickagy data tag). 'unsafe-inline' is needed for
// the GTM bootstrap and Next.js inline JSON-LD; it does not open other origins.
// If a new GTM tag loads another vendor, add that origin here or it is blocked.
const isDev = process.env.NODE_ENV !== 'production';
const GTM_HOSTS = 'https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://analytics.google.com';
const GOOGLE_ADS = 'https://www.google.com https://*.doubleclick.net https://www.googleadservices.com';
const CSP = [
  "default-src 'self'",
  // blob: is required by ZoomInfo's zi-tag.js, which builds its loader as blob scripts.
  `script-src 'self' 'unsafe-inline' blob:${isDev ? " 'unsafe-eval'" : ''} ${GTM_HOSTS} https://js.zi-scripts.com https://*.zoominfo.com https://*.clickagy.com https://www.googleadservices.com https://googleads.g.doubleclick.net`,
  "style-src 'self' 'unsafe-inline'",
  // Images from any HTTPS host: ZoomInfo/Clickagy sync pixels with an open-ended
  // set of ad exchanges. Images cannot execute code; scripts stay allowlisted.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${GTM_HOSTS} ${GOOGLE_ADS} https://js.zi-scripts.com https://*.zoominfo.com https://*.clickagy.com`,
  "frame-src https://www.googletagmanager.com https://td.doubleclick.net https://*.zoominfo.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ');

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
