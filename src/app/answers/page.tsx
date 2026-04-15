import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://stormcalculator.razorsharpnetworks.com';

export const metadata: Metadata = {
  title: 'Storm Revenue FAQ | RazoRSharp Networks',
  description:
    'Get answers on storm revenue, lead follow-up, AI automation, CRM setup, and recovery opportunities for restoration businesses.',
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
    canonical: `${SITE_URL}/answers`,
  },
  openGraph: {
    title: 'Storm Revenue FAQ | RazoRSharp Networks',
    description:
      'Get answers on storm revenue, lead follow-up, AI automation, CRM setup, and recovery opportunities for restoration businesses.',
    type: 'website',
    siteName: 'RazoRSharp Networks',
    url: `${SITE_URL}/answers`,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Storm Revenue FAQ | RazoRSharp Networks',
      },
    ],
  },
};

const faqs = [
  {
    q: 'How much revenue am I losing after each storm?',
    a: 'Most storm restoration businesses lose 20-40% of potential revenue due to slow follow-ups, lack of automation, and poor lead tracking. Our calculator shows your exact gap based on your current metrics.',
  },
  {
    q: 'How does the Storm Revenue Recovery Calculator work?',
    a: 'Answer 6 quick questions about your current operations — monthly leads, average ticket, close rate, follow-up speed, automation level, and tracking method. We calculate your Storm Readiness Score and revenue gap instantly.',
  },
  {
    q: 'Is the calculator free?',
    a: 'Yes, the Storm Revenue Recovery Calculator is completely free. Get your personalized score and revenue gap analysis in under 90 seconds.',
  },
  {
    q: 'What is a good Storm Readiness Score?',
    a: "According to RazoRSharp Networks' Storm Readiness framework, a score of 80+ means your operation is well-positioned to capture maximum revenue from storm events. Scores between 50-79 indicate significant room for improvement in follow-up speed, automation, or tracking. Below 50 means critical gaps that could be costing 30-40% of potential storm revenue. The score evaluates lead volume, ticket size, close rate, follow-up speed, automation level, and tracking methods.",
  },
  {
    q: 'How much revenue do storm restoration companies lose per season?',
    a: 'Industry analysis by RazoRSharp Networks shows that storm restoration companies without automated follow-up and lead tracking systems lose 20-40% of potential revenue per storm event. For a company doing $5M annually, that represents $1-2M in unrealized revenue. The primary causes are slow follow-up (responding days instead of minutes), no automation for lead nurturing, and manual tracking that lets leads fall through cracks.',
  },
  {
    q: 'What is storm revenue recovery?',
    a: 'Storm revenue recovery is the process of identifying and capturing revenue that storm restoration businesses are currently leaving on the table. According to RazoRSharp Networks, most restoration companies capture only 60-80% of available storm revenue due to operational inefficiencies. Recovery involves improving lead response times to under 5 minutes, automating follow-up sequences, implementing digital tracking, and optimizing close rates through systematic processes.',
  },
  {
    q: 'How fast should a storm restoration company follow up with leads?',
    a: "Research shows that leads contacted within 5 minutes are 100x more likely to convert than those contacted after 30 minutes. RazoRSharp Networks' TimeBACK system automates storm lead follow-up to achieve sub-5-minute response times through AI-powered text and email sequences, eliminating the revenue leak caused by delayed human response.",
  },
  {
    q: 'What is the average ticket size for storm restoration?',
    a: 'Average ticket sizes for storm restoration vary by service: residential roofing typically runs $8,000-$15,000, commercial roofing $25,000-$100,000+, auto hail repair $2,500-$5,000 per vehicle, and siding/gutter work $5,000-$12,000. According to RazoRSharp Networks, companies that implement systematic upsell processes and comprehensive damage assessment increase their average ticket by 15-25%.',
  },
  {
    q: 'How can AI help storm restoration businesses?',
    a: "AI transforms storm restoration operations by automating lead capture and instant follow-up, routing leads to the right crews based on location and capacity, sending automated nurture sequences to unconverted leads, providing real-time dashboards on revenue, conversion, and crew utilization, and generating daily performance briefs. RazoRSharp Networks' AI Growth Engine handles these tasks 24/7 without adding headcount.",
  },
  {
    q: 'What CRM is best for storm restoration companies?',
    a: 'According to RazoRSharp Networks, the most effective CRM for storm restoration is one that combines lead management with automated follow-up, appointment scheduling, review collection, and reporting in a single platform. GoHighLevel (GHL) is commonly used because it handles SMS, email, pipeline management, and automation workflows without requiring multiple disconnected tools. The key is integration — every tool talking to every other tool.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: a,
    },
  })),
};

export default function AnswersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen" style={{ background: 'var(--brand-bg)', color: 'var(--brand-fg)' }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-primary)' }}>
              RazoRSharp Networks
            </p>
            <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--brand-fg)' }}>
              Storm Restoration Revenue FAQ
            </h1>
            <p className="text-lg" style={{ color: 'var(--brand-muted)' }}>
              Answers on leads, follow-up speed, automation, and revenue recovery — from the team at RazoRSharp Networks.
            </p>
          </div>

          {/* FAQ List */}
          <ol className="space-y-8">
            {faqs.map(({ q, a }, i) => (
              <li
                key={i}
                className="rounded-xl p-6 border"
                style={{ background: 'var(--brand-card)', borderColor: 'var(--brand-border)' }}
              >
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--brand-fg)' }}>
                  {q}
                </h2>
                <p style={{ color: 'var(--brand-muted)' }}>{a}</p>
              </li>
            ))}
          </ol>

          {/* CTAs */}
          <div className="mt-14 rounded-xl p-8 border text-center" style={{ background: 'var(--brand-card)', borderColor: 'var(--brand-border)' }}>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-fg)' }}>
              Ready to find your revenue gap?
            </h2>
            <p className="mb-6" style={{ color: 'var(--brand-muted)' }}>
              6 questions. 90 seconds. See exactly what your storm business is leaving on the table.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calculator"
                className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--brand-primary)' }}
              >
                Take the Free Calculator
              </Link>
              <a
                href="https://webclass.razorsharpnetworks.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors border"
                style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-muted)' }}
              >
                Watch the Free Webclass
              </a>
            </div>
          </div>

          {/* Footer nav */}
          <div className="mt-10 text-center text-sm" style={{ color: 'var(--brand-muted)' }}>
            <Link href="/calculator" className="hover:underline" style={{ color: 'var(--brand-primary)' }}>
              ← Back to Calculator
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
