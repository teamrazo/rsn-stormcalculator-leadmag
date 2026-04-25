'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import TrustBadgeRow from './TrustBadgeRow';

interface HeroLandingProps {
  onStart: () => void;
}

const socialProof = [
  '4,200+ businesses diagnosed',
  '47% avg reduction in repeat work',
  '11 hrs/week reclaimed on average',
];

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
      className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-brand-card/70 shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/storm-hero-bg.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.18)_0%,rgba(10,10,15,0.72)_30%,rgba(10,10,15,0.94)_100%),linear-gradient(110deg,rgba(10,10,15,0.9)_12%,rgba(10,10,15,0.58)_48%,rgba(139,63,217,0.2)_100%)]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,58,196,0.2),transparent_32%)]" aria-hidden="true" />

      <div className="relative px-6 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-6xl flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary-light">
              Storm Revenue Recovery Calculator
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-brand-fg sm:text-5xl lg:text-6xl">
              Every Storm Creates Demand. Most Restoration Businesses Capture a Fraction of It.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-brand-muted-light sm:text-lg">
              Find out how much revenue, time, and efficiency you&apos;re leaving behind — in 90 seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-white/8 bg-black/20 px-5 py-4 text-sm text-brand-fg backdrop-blur-sm"
          >
            {socialProof.map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                {index > 0 && <span className="hidden h-1 w-1 rounded-full bg-brand-primary/70 sm:block" aria-hidden="true" />}
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.45 }}
            className="mt-8 grid gap-4 lg:grid-cols-3"
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
            className="mt-10 flex flex-col items-start"
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
        </div>
      </div>
    </motion.section>
  );
}
