import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const SITE_URL = 'https://stormcalculator.razorsharpnetworks.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Storm Revenue Recovery Calculator | How Much Are You Leaving on the Table?',
  description:
    '6 questions. 90 seconds. See the exact dollar amount your storm restoration business is missing after every storm event.',
  keywords: [
    'storm restoration',
    'hail repair',
    'roofing leads',
    'revenue calculator',
    'storm damage',
    'restoration business',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Storm Revenue Recovery Calculator',
    description:
      'How much revenue are you leaving on the table after every storm? Find out in 90 seconds.',
    type: 'website',
    siteName: 'RazoRSharp Networks',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Storm Revenue Recovery Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Storm Revenue Recovery Calculator',
    description:
      'How much revenue are you leaving on the table after every storm? Find out in 90 seconds.',
    images: [`${SITE_URL}/twitter-image`],
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'theme-color': '#0A0A0F',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Storm Revenue Recovery Calculator',
      url: SITE_URL,
      description:
        '6 questions. 90 seconds. See the exact dollar amount your storm restoration business is missing after every storm event.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      creator: {
        '@type': 'Organization',
        name: 'RazoRSharp Networks',
        url: 'https://razorsharpnetworks.com',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much revenue am I losing after each storm?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most storm restoration businesses lose 20-40% of potential revenue due to slow follow-ups, lack of automation, and poor lead tracking. Our calculator shows your exact gap.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the Storm Revenue Recovery Calculator work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Answer 6 quick questions about your current operations — monthly leads, average ticket, close rate, follow-up speed, automation level, and tracking method. We calculate your Storm Readiness Score and revenue gap instantly.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the calculator free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, the Storm Revenue Recovery Calculator is completely free. Get your personalized score and revenue gap analysis in under 90 seconds.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="theme-color" content="#0A0A0F" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
