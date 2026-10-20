// Shared SEO and share-card metadata. One source so every page carries a card.
// Next.js replaces (does not merge) a parent's openGraph object, so a page that
// sets openGraph without images would publish no image. Use shareMeta().

import type { Metadata } from 'next';

export const SITE_URL = 'https://stormcalculator.razorsharpnetworks.com';
export const SITE_NAME = 'RazoRSharp Networks';

export const SHARE_TITLE = 'Storm Revenue Recovery Calculator | RazoRSharp Networks';
export const SHARE_SUBTITLE = 'Find the revenue every storm leaves behind.';
export const SHARE_DESCRIPTION =
  'Six questions. Ninety seconds. See your Storm Readiness Score and the dollar gap between the demand each storm creates and the work you capture.';

// 1200x630 cards rendered from the RSN card template (public/og).
export const CARDS = {
  primary: { url: '/og/og-storm.jpg', alt: 'Storm Revenue Recovery Calculator. Find the revenue every storm leaves behind.' },
  answers: { url: '/og/og-storm-answers.jpg', alt: 'Storm Revenue FAQ. Find the revenue every storm leaves behind.' },
  local: { url: '/og/og-storm-local.jpg', alt: 'Local storm markets. Find the revenue every storm leaves behind.' },
} as const;

type Card = (typeof CARDS)[keyof typeof CARDS];

export function shareMeta(opts: {
  path: string;
  title: string;
  description: string;
  card?: Card;
}): Pick<Metadata, 'alternates' | 'openGraph' | 'twitter'> {
  const card = opts.card ?? CARDS.primary;
  const url = `${SITE_URL}${opts.path === '/' ? '' : opts.path}`;
  const image = { url: `${SITE_URL}${card.url}`, width: 1200, height: 630, alt: card.alt, type: 'image/jpeg' };
  return {
    alternates: { canonical: url || SITE_URL },
    openGraph: {
      title: opts.title,
      description: opts.description,
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
      url: url || SITE_URL,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
