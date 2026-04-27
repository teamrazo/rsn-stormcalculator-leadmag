'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TrustBadgeRow from './TrustBadgeRow';

interface HeroLandingProps {
  onStart: () => void;
}

const steps = [
  {
    title: 'Answer 6 quick questions about your storm operations',
    description: 'Tell us how your storm ops run today across leads, follow-up, and fulfillment.',
    icon: (
      <path d="M8 6.5h8M8 12h8m-8 5.5h5M7 3h10a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V5a2 2 0 0 1 2-2Z" />
    ),
  },
  {
    title: 'Get your Storm Revenue Recovery Score instantly',
    description: 'See your score the moment you finish the assessment.',
    icon: (
      <>
        <path d="M12 3v4" />
        <path d="M12 17v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M3 12h4" />
        <path d="M17 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
  },
  {
    title: 'See exactly where you\'re losing revenue, time, and efficiency',
    description: 'Spot the hidden leaks holding your team back after every storm.',
    icon: (
      <>
        <path d="M4 19h16" />
        <path d="M7 15l3-3 3 2 4-5" />
        <path d="M17 9h3v3" />
      </>
    ),
  },
];

function StepIcon({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary-light shadow-[0_0_30px_rgba(168,58,196,0.16)]">
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
    </div>
  );
}

export default function HeroLanding({ onStart }: HeroLandingProps) {
  return (
    <motion.section
      key="landing"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/storm-hero-bg.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(10,10,15,0.95)_0%,rgba(10,10,15,0.7)_50%,rgba(10,10,15,0.3)_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,58,196,0.2),transparent_32%)]" aria-hidden="true" />

      <div className="relative px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
        <div className="flex min-h-[calc(100vh-3rem)] flex-col justify-start pt-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary-light">
              Storm Revenue Recovery Calculator
            </div>

            <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight text-brand-fg sm:text-5xl lg:text-6xl">
              Every Storm Creates Demand. Most Restoration Businesses Capture a Fraction of It.
            </h1>

            <p className="mt-2 max-w-2xl text-base leading-7 text-brand-muted-light sm:text-lg">
              Find out how much revenue, time, and efficiency you&apos;re leaving behind — in 90 seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.45 }}
            className="mt-4 flex flex-col items-start"
          >
            <motion.button
              onClick={onStart}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-accent px-8 py-5 text-lg font-bold text-white shadow-[0_0_30px_rgba(168,58,196,0.3)] transition-all hover:shadow-[0_0_42px_rgba(168,58,196,0.45)] sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Calculate Your Storm Revenue Gap — Free
            </motion.button>
            <TrustBadgeRow className="mt-4 justify-start" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45 }}
            className="mt-12 grid gap-4 lg:grid-cols-3"
          >
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/8 bg-brand-card/70 p-5 backdrop-blur-md"
              >
                <div className="flex items-start gap-4">
                  <StepIcon>{step.icon}</StepIcon>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary-light/90">
                      Step {index + 1}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-brand-fg">{step.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-brand-muted-light">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.45 }}
            className="mt-10 rounded-2xl border border-white/8 bg-brand-card/60 p-6 backdrop-blur-md"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-primary-light/90">
              Built for every storm restoration vertical
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Automotive Hail Repair', href: '/hail-damage-repair-dallas-tx' },
                { label: 'Roofing Contractors', href: '/hail-damage-repair-oklahoma-city-ok' },
                { label: 'Siding Companies', href: '/hail-damage-repair-denver-co' },
                { label: 'Gutter Companies', href: '/hail-damage-repair-colorado-springs-co' },
                { label: 'Window Companies', href: '/hail-damage-repair-kansas-city-mo' },
                { label: 'Commercial Roofing', href: '/hail-damage-repair-houston-tx' },
                { label: 'Water Damage Mitigation', href: '/hail-damage-repair-tulsa-ok' },
                { label: 'Wind Damage Repair', href: '/hail-damage-repair-wichita-ks' },
                { label: 'General Storm Restoration', href: '/hail-damage-repair-fort-worth-tx' },
                { label: 'Insurance Restoration Specialists', href: '/hail-damage-repair-san-antonio-tx' },
                { label: 'Property Restoration Companies', href: '/hail-damage-repair-omaha-ne' },
              ].map((v) => (
                <Link
                  key={v.label}
                  href={v.href}
                  className="rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 text-xs font-medium text-brand-primary-light transition-colors hover:bg-brand-primary/20 hover:border-brand-primary/40"
                >
                  {v.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
