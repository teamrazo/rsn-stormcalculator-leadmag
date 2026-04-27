import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locations } from '@/data/locations';

const SITE_URL = 'https://stormcalculator.razorsharpnetworks.com';

export const dynamicParams = false;

function TrustIcon({ children }: { children: any }) {
  return (
    <span
      style={{
        width: 14,
        height: 14,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8b8b95',
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
    </span>
  );
}

function TrustBadgeRow({ items }: { items: Array<{ label: string; icon: any }> }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px 18px',
        marginTop: 12,
        color: '#888',
        fontSize: '12.5px',
        lineHeight: 1.5,
      }}
    >
      {items.map((item) => (
        <div key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <TrustIcon>{item.icon}</TrustIcon>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function ProofLayer() {
  const proofItems = [
    'Leads contacted in 5 min convert 100× more',
    'Most contractors lose 20–40% of storm revenue to slow follow-up',
    'Speed-to-contact is the #1 driver of close rate',
  ];

  return (
    <div
      className="mb-14 rounded-2xl p-4 sm:p-5 border"
      style={{
        background: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: '0 18px 45px rgba(0, 0, 0, 0.18)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div className="flex flex-wrap gap-3">
        {proofItems.map((item) => (
          <div
            key={item}
            className="flex-1 min-w-[190px] rounded-xl px-4 py-3 border text-xs sm:text-sm"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'var(--brand-fg)',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const seen = new Set<string>();
  return locations
    .filter((loc) => {
      const key = loc.stateCode.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((loc) => ({ state: loc.stateCode.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const stateUpper = state.toUpperCase();
  const stateLocs = locations.filter((loc) => loc.stateCode === stateUpper);
  if (stateLocs.length === 0) return {};

  const stateName = stateLocs[0].state;
  const title = `Storm & Hail Damage Revenue Calculator — ${stateName} Cities | RazoRSharp Networks`;
  const description = `Find the Storm Revenue Calculator for your ${stateName} city. RazoRSharp Networks helps ${stateName} restoration contractors see exactly how much revenue they leave on the table after every storm.`;

  return {
    title,
    description,
    keywords: [
      `storm restoration ${stateName}`,
      `hail damage repair ${stateUpper}`,
      `${stateName} roofing storm calculator`,
      `storm revenue gap ${stateName}`,
      `RazoRSharp Networks ${stateName}`,
    ],
    alternates: {
      canonical: `${SITE_URL}/states/${state}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'RazoRSharp Networks',
      url: `${SITE_URL}/states/${state}`,
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const stateUpper = state.toUpperCase();
  const stateLocs = locations.filter((loc) => loc.stateCode === stateUpper);
  if (stateLocs.length === 0) notFound();

  const stateName = stateLocs[0].state;

  const faqItems = [
    {
      q: `How much storm revenue are ${stateName} restoration companies losing?`,
      a: `Most ${stateName}-area restoration businesses lose 20–40% of potential storm revenue due to slow lead follow-up, no automation, and manual tracking. The RazoRSharp Storm Revenue Calculator shows your exact gap in under 90 seconds.`,
    },
    {
      q: `What cities in ${stateName} does RazoRSharp Networks serve?`,
      a: `RazoRSharp Networks provides Storm Readiness Scores and revenue gap analysis for restoration contractors in ${stateLocs.map((l) => l.city).join(', ')} and other ${stateName} markets.`,
    },
    {
      q: `What is the TimeBACK system for ${stateName} contractors?`,
      a: `The RazoRSharp TimeBACK system automates sub-5-minute text and email follow-up for ${stateName} storm restoration contractors, turning missed response windows into captured revenue.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: stateName, item: `${SITE_URL}/states/${state}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main
        className="min-h-screen tech-grid"
        style={{ background: 'var(--brand-bg)', color: 'var(--brand-fg)' }}
      >
        <div className="max-w-3xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--brand-primary)' }}
            >
              RazoRSharp Networks &mdash; {stateName}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: 'var(--brand-fg)' }}>
              {stateName} Storm &amp; Hail Damage Revenue Calculator
            </h1>
            <div className="space-y-4 text-lg" style={{ color: 'var(--brand-muted)' }}>
              <p>
                {stateName} restoration contractors face some of the most concentrated storm seasons in the country.
                Select your city below to see your personalized Storm Readiness Score and the exact dollar amount
                your business is leaving on the table after every storm event.
              </p>
              <p>
                RazoRSharp Networks&apos; TimeBACK system helps {stateName} roofing, siding, and multi-trade
                restoration companies automate lead follow-up, score their operational readiness, and close the
                revenue gap — starting in under 90 seconds.
              </p>
            </div>
          </div>

          <ProofLayer />

          {/* City list */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-fg)' }}>
              {stateName} Cities ({stateLocs.length})
            </h2>
            <ul className="space-y-3">
              {stateLocs.map((loc) => (
                <li key={loc.slug}>
                  <Link
                    href={`/${loc.slug}`}
                    className="flex items-center justify-between rounded-xl px-5 py-4 border transition-colors hover:border-current group"
                    style={{ background: 'var(--brand-card)', borderColor: 'var(--brand-border)' }}
                  >
                    <div>
                      <span
                        className="font-semibold group-hover:underline"
                        style={{ color: 'var(--brand-fg)' }}
                      >
                        {loc.city}
                      </span>
                      <span className="text-sm ml-2" style={{ color: 'var(--brand-muted)' }}>
                        {loc.annualStorms}+ storms/yr &bull; {loc.peakSeason}
                      </span>
                    </div>
                    <span style={{ color: 'var(--brand-primary)' }}>&#8594;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div
            className="rounded-xl p-8 border mb-14 text-center"
            style={{ background: 'var(--brand-card)', borderColor: 'var(--brand-border)' }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--brand-primary)' }}
            >
              Free &bull; 90 Seconds &bull; No Fluff
            </p>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--brand-fg)' }}>
              See Your {stateName} Storm Revenue Gap
            </h2>
            <p className="mb-6" style={{ color: 'var(--brand-muted)' }}>
              6 questions. Instant results. Your personalized Storm Readiness Score and the exact
              dollar amount your {stateName} business is missing after every storm.
            </p>
            <Link
              href="/calculator"
              className="inline-block px-8 py-4 rounded-xl font-bold text-white text-lg transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))' }}
            >
              Calculate Your Storm Revenue Gap &rarr;
            </Link>
            <TrustBadgeRow
              items={[
                { label: 'Private & secure', icon: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 1 1 8 0v3" /></> },
                { label: '90-second results', icon: <><path d="M13 2 5 14h6l-1 8 8-12h-6l1-8Z" /></> },
                { label: '100% free', icon: <><circle cx="12" cy="12" r="8" /><path d="M9 10c.3-1.3 1.4-2 3-2 1.7 0 2.8.8 3 2-.4 1.1-1.3 1.8-3 2-1.8.2-2.7.9-3 2" /><path d="M12 17h.01" /></> },
              ]}
            />
          </div>

          {/* FAQ section */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-fg)' }}>
              Frequently Asked Questions &mdash; {stateName}
            </h2>
            <ol className="space-y-6">
              {faqItems.map(({ q, a }, i) => (
                <li
                  key={i}
                  className="rounded-xl p-6 border"
                  style={{ background: 'var(--brand-card)', borderColor: 'var(--brand-border)' }}
                >
                  <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--brand-fg)' }}>
                    {q}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{a}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Nav footer */}
          <div className="mt-10 text-center text-sm" style={{ color: 'var(--brand-muted)' }}>
            <Link
              href="/calculator"
              className="hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              &larr; Back to Calculator
            </Link>
            <span className="mx-3">&bull;</span>
            <Link
              href="/answers"
              className="hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              Storm Restoration FAQ
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
