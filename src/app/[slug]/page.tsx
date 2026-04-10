import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { locations, getLocationBySlug, getNearbyCities } from '@/data/locations';

const SITE_URL = 'https://stormcalculator.razorsharpnetworks.com';

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((loc) => ({ slug: loc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};

  const { city, state, annualStorms, avgHailSize, peakSeason } = location;
  const title = `Storm & Hail Damage Revenue Calculator for ${city}, ${state} | RazoRSharp Networks`;
  const description = `${city} restoration businesses face ${annualStorms}+ storm events per year with ${avgHailSize}-sized hail peaking ${peakSeason}. See exactly how much revenue your ${city} company is leaving on the table after every storm.`;

  return {
    title,
    description,
    keywords: [
      `hail damage repair ${city}`,
      `storm restoration ${city} ${state}`,
      `${city} roofing storm damage`,
      `hail damage ${city} ${state}`,
      `storm revenue calculator ${city}`,
      `storm restoration revenue ${state}`,
      `${city} storm damage contractor`,
      `hail repair business ${city}`,
      `storm readiness score ${city}`,
      'storm revenue gap calculator',
      'RazoRSharp Networks',
    ],
    alternates: {
      canonical: `${SITE_URL}/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'RazoRSharp Networks',
      url: `${SITE_URL}/${slug}`,
    },
  };
}

function buildFaqs(city: string, state: string, stateCode: string, annualStorms: number, avgHailSize: string, peakSeason: string, topServices: string[]) {
  const primaryService = topServices[0] ?? 'roofing';
  const secondaryService = topServices[1] ?? 'siding';
  return [
    {
      q: `How much revenue are ${city} storm restoration companies losing after each event?`,
      a: `Most ${city}-area restoration businesses lose 20–40% of potential storm revenue due to slow lead follow-up, no automation, and manual tracking. With ${annualStorms}+ storm events per year in the ${state} region, even a 10% improvement in conversion can add tens of thousands of dollars per season. The RazoRSharp Storm Revenue Calculator shows your exact gap in under 90 seconds.`,
    },
    {
      q: `When is hail season in ${city}, ${stateCode}?`,
      a: `The peak hail and storm season in ${city} runs ${peakSeason}. During this window, ${city}-area contractors typically see ${avgHailSize}-sized hail that causes significant ${primaryService} and ${secondaryService} damage. Preparation — automated follow-up, CRM pipelines, and rapid-response crews — before the season starts is the single biggest driver of revenue capture.`,
    },
    {
      q: `What is a Storm Readiness Score for a ${city} restoration business?`,
      a: `A Storm Readiness Score (developed by RazoRSharp Networks) measures how efficiently your business converts storm leads into paid jobs. It evaluates your monthly lead volume, average ticket size, close rate, follow-up speed, automation level, and tracking method — all the variables that determine how much of ${city}'s storm-season revenue you actually capture versus leave on the table.`,
    },
    {
      q: `How fast should a ${city} restoration contractor follow up with storm leads?`,
      a: `Research consistently shows that leads contacted within 5 minutes are 100× more likely to convert than those reached after 30 minutes. In competitive markets like ${city}, where multiple contractors are targeting the same storm-damaged neighborhoods, speed-to-contact is often the difference between winning and losing the job. RazoRSharp's TimeBACK system automates sub-5-minute text and email follow-up for ${city} contractors.`,
    },
    {
      q: `What services do storm restoration companies in ${city} typically offer?`,
      a: `The most in-demand storm restoration services in ${city} include ${topServices.join(', ')}. After major ${avgHailSize} hail events, homeowners and commercial property managers search for contractors immediately. Companies that have automated intake funnels and instant follow-up systems capture significantly more of this demand than those relying on manual callbacks.`,
    },
  ];
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  const { city, state, stateCode, regionName, annualStorms, avgHailSize, peakSeason, topServices, population } = location;
  const nearbyCities = getNearbyCities(location);
  const faqs = buildFaqs(city, state, stateCode, annualStorms, avgHailSize, peakSeason, topServices);

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

  const primaryService = topServices[0] ?? 'roofing';
  const secondaryService = topServices[1] ?? 'siding';
  const populationFormatted = population >= 1_000_000
    ? `${(population / 1_000_000).toFixed(1)}M`
    : `${Math.round(population / 1_000)}K`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              RazoRSharp Networks &mdash; {regionName}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: 'var(--brand-fg)' }}>
              {city} Storm &amp; Hail Damage Revenue Calculator
            </h1>

            {/* Intro copy */}
            <div className="space-y-4 text-lg" style={{ color: 'var(--brand-muted)' }}>
              <p>
                The {regionName} is one of the most storm-active regions in the country. {city}, {state}
                {' '}businesses face an average of <strong style={{ color: 'var(--brand-fg)' }}>{annualStorms}+ storm events per year</strong>, with
                {' '}<strong style={{ color: 'var(--brand-fg)' }}>{avgHailSize}-sized hail</strong> most common during the{' '}
                <strong style={{ color: 'var(--brand-fg)' }}>{peakSeason}</strong> peak season.
                For restoration contractors in the {city} area, that window is worth millions in potential revenue — but only if your operation is built to capture it.
              </p>
              <p>
                Most {city} storm restoration companies are leaving 20–40% of that revenue on the table right now.
                Not from lack of leads — {city}&apos;s {populationFormatted}+ population generates massive demand after every major event.
                The gap comes from slow follow-ups, manual tracking, and no automation. The RazoRSharp Storm Revenue Calculator
                quantifies your exact gap in 6 questions and under 90 seconds.
              </p>
              <p>
                Whether you run a {primaryService} crew, a {secondaryService} operation, or a multi-trade restoration firm serving the {regionName},
                your Storm Readiness Score tells you precisely where you're losing money and what fixing it is worth in annual revenue.
              </p>
            </div>
          </div>

          {/* Primary CTA */}
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
              See Your {city} Storm Revenue Gap
            </h2>
            <p className="mb-6" style={{ color: 'var(--brand-muted)' }}>
              6 questions. Instant results. Your personalized Storm Readiness Score and the exact
              dollar amount your {city} business is missing after every storm.
            </p>
            <Link
              href="/calculator"
              className="inline-block px-8 py-4 rounded-xl font-bold text-white text-lg transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-accent))' }}
            >
              Calculate Your Storm Revenue Gap &rarr;
            </Link>
          </div>

          {/* Why section */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-fg)' }}>
              Why {city} Restoration Companies Need This
            </h2>
            <ul className="space-y-4">
              {[
                {
                  icon: '⚡',
                  title: `${annualStorms}+ storm events per year`,
                  body: `The ${regionName} averages more storm events annually than most US markets. Each one is a revenue event — but only for contractors with systems that activate instantly. Manual processes mean you lose the race to competitors who respond in minutes.`,
                },
                {
                  icon: '🧊',
                  title: `${avgHailSize.charAt(0).toUpperCase() + avgHailSize.slice(1)} hail means high-ticket damage`,
                  body: `${avgHailSize.charAt(0).toUpperCase() + avgHailSize.slice(1)} hail causes significant ${primaryService} and ${secondaryService} damage across ${city} neighborhoods. Each claim represents thousands in potential revenue. Conversion rate and follow-up speed determine whether that revenue goes to you or your competition.`,
                },
                {
                  icon: '📅',
                  title: `Compressed ${peakSeason} window`,
                  body: `Storm season in ${city} concentrates the bulk of annual opportunity into a few months. Contractors who enter ${peakSeason} without automated lead capture and follow-up systems consistently underperform. The calculator shows how much that bottleneck is costing you.`,
                },
                {
                  icon: '🏙️',
                  title: `${populationFormatted}+ population means real volume`,
                  body: `${city}'s ${populationFormatted} residents generate substantial post-storm demand for ${topServices.slice(0, 3).join(', ')} services. The companies that capture that volume systematically — not by chance — are the ones growing year over year in the ${regionName}.`,
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex gap-4 rounded-xl p-5 border"
                  style={{ background: 'var(--brand-card)', borderColor: 'var(--brand-border)' }}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--brand-fg)' }}>{item.title}</p>
                    <p className="text-sm" style={{ color: 'var(--brand-muted)' }}>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ section */}
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--brand-fg)' }}>
              Frequently Asked Questions — {city}, {stateCode}
            </h2>
            <ol className="space-y-6">
              {faqs.map(({ q, a }, i) => (
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

          {/* Nearby cities */}
          {nearbyCities.length > 0 && (
            <section className="mb-14">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--brand-fg)' }}>
                Serving the {regionName} Area
              </h2>
              <p className="mb-5 text-sm" style={{ color: 'var(--brand-muted)' }}>
                RazoRSharp Networks also helps storm restoration companies in these nearby {state} markets:
              </p>
              <div className="flex flex-wrap gap-3">
                {nearbyCities.map((nearby) => (
                  <Link
                    key={nearby.slug}
                    href={`/${nearby.slug}`}
                    className="rounded-lg px-4 py-2 text-sm font-medium border transition-colors hover:border-current"
                    style={{
                      background: 'var(--brand-card)',
                      borderColor: 'var(--brand-border)',
                      color: 'var(--brand-muted)',
                    }}
                  >
                    {nearby.city}, {nearby.stateCode}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Footer CTA */}
          <div
            className="rounded-xl p-8 border text-center"
            style={{ background: 'var(--brand-card)', borderColor: 'var(--brand-border)' }}
          >
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-fg)' }}>
              Ready to find your number?
            </h2>
            <p className="mb-6" style={{ color: 'var(--brand-muted)' }}>
              See how much revenue your {city} business is leaving on the table &rarr;
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
