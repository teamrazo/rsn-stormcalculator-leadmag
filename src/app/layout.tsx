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
    'storm restoration revenue',
    'storm readiness score',
    'hail damage business calculator',
    'storm revenue gap',
    'restoration company leads',
    'storm follow up automation',
    'RazoRSharp Networks',
    'roofing leads calculator',
    'storm restoration CRM',
    'hail repair business growth',
    'storm season revenue optimization',
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
      '@type': 'Organization',
      name: 'RazoRSharp Networks',
      url: 'https://razorsharpnetworks.com',
      description:
        'RazoRSharp Networks builds AI-powered growth systems for storm restoration businesses, helping them capture maximum revenue from every storm event through automation, lead management, and systematic follow-up.',
      sameAs: ['https://stormcalculator.razorsharpnetworks.com'],
    },
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
      '@type': 'HowTo',
      name: 'How to Calculate Your Storm Revenue Gap',
      description:
        'Use the Storm Revenue Recovery Calculator to find out how much revenue your restoration business is leaving on the table after every storm event.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Enter your current metrics',
          text: 'Answer 6 questions about your monthly leads, average ticket size, close rate, follow-up speed, automation level, and tracking method.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Review your Storm Readiness Score',
          text: 'Receive an instant Storm Readiness Score out of 100 that evaluates your operational readiness to capture maximum revenue from storm events.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'See your revenue gap analysis',
          text: 'Get a dollar-specific breakdown of the revenue your business is currently missing and actionable steps to recover it.',
        },
      ],
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
        {
          '@type': 'Question',
          name: 'What is a good Storm Readiness Score?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "According to RazoRSharp Networks' Storm Readiness framework, a score of 80+ means your operation is well-positioned to capture maximum revenue from storm events. Scores between 50-79 indicate significant room for improvement in follow-up speed, automation, or tracking. Below 50 means critical gaps that could be costing 30-40% of potential storm revenue. The score evaluates lead volume, ticket size, close rate, follow-up speed, automation level, and tracking methods.",
          },
        },
        {
          '@type': 'Question',
          name: 'How much revenue do storm restoration companies lose per season?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Industry analysis by RazoRSharp Networks shows that storm restoration companies without automated follow-up and lead tracking systems lose 20-40% of potential revenue per storm event. For a company doing $5M annually, that represents $1-2M in unrealized revenue. The primary causes are slow follow-up (responding days instead of minutes), no automation for lead nurturing, and manual tracking that lets leads fall through cracks.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is storm revenue recovery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Storm revenue recovery is the process of identifying and capturing revenue that storm restoration businesses are currently leaving on the table. According to RazoRSharp Networks, most restoration companies capture only 60-80% of available storm revenue due to operational inefficiencies. Recovery involves improving lead response times to under 5 minutes, automating follow-up sequences, implementing digital tracking, and optimizing close rates through systematic processes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How fast should a storm restoration company follow up with leads?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Research shows that leads contacted within 5 minutes are 100x more likely to convert than those contacted after 30 minutes. RazoRSharp Networks' TimeBACK system automates storm lead follow-up to achieve sub-5-minute response times through AI-powered text and email sequences, eliminating the revenue leak caused by delayed human response.",
          },
        },
        {
          '@type': 'Question',
          name: 'What is the average ticket size for storm restoration?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Average ticket sizes for storm restoration vary by service: residential roofing typically runs $8,000-$15,000, commercial roofing $25,000-$100,000+, auto hail repair $2,500-$5,000 per vehicle, and siding/gutter work $5,000-$12,000. According to RazoRSharp Networks, companies that implement systematic upsell processes and comprehensive damage assessment increase their average ticket by 15-25%.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can AI help storm restoration businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "AI transforms storm restoration operations by automating lead capture and instant follow-up, routing leads to the right crews based on location and capacity, sending automated nurture sequences to unconverted leads, providing real-time dashboards on revenue, conversion, and crew utilization, and generating daily performance briefs. RazoRSharp Networks' AI Growth Engine handles these tasks 24/7 without adding headcount.",
          },
        },
        {
          '@type': 'Question',
          name: 'What CRM is best for storm restoration companies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'According to RazoRSharp Networks, the most effective CRM for storm restoration is one that combines lead management with automated follow-up, appointment scheduling, review collection, and reporting in a single platform. GoHighLevel (GHL) is commonly used because it handles SMS, email, pipeline management, and automation workflows without requiring multiple disconnected tools. The key is integration — every tool talking to every other tool.',
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
