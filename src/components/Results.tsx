'use client';

import { motion } from 'framer-motion';
import ScoreGauge from './ScoreGauge';
import TrustBadgeRow from './TrustBadgeRow';
import type { CalculationResult } from '@/lib/calculator';
import type { Insight } from '@/lib/insights';

interface ResultsProps {
  result: CalculationResult;
  insights: Insight[];
}

function formatCurrency(num: number): string {
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  }
  return `$${num.toLocaleString()}`;
}

export default function Results({ result, insights }: ResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-brand-fg mb-2">
          🌩️ Your Storm Revenue Recovery Score
        </h1>
        <p className="text-brand-muted text-lg">
          Here&apos;s what the numbers say about your business.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-10"
      >
        <TrustBadgeRow className="mx-auto max-w-2xl" />
      </motion.div>

      {/* Score Gauge */}
      <motion.div
        className="flex justify-center mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <ScoreGauge score={result.score} />
      </motion.div>

      {/* Revenue Gap */}
      <motion.div
        className="glass-card rounded-2xl p-8 mb-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-brand-muted text-sm uppercase tracking-wider mb-2 font-medium">
          ⚡ Estimated Annual Revenue Gap
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl md:text-6xl font-bold text-orange-400 glow-text">
            {formatCurrency(result.revenueGapLow)}
          </span>
          <span className="text-2xl text-brand-muted">–</span>
          <span className="text-4xl md:text-6xl font-bold text-orange-400 glow-text">
            {formatCurrency(result.revenueGapHigh)}
          </span>
        </div>
        <p className="text-lg text-brand-muted-light">
          You&apos;re potentially leaving this on the table <strong className="text-brand-fg">every year</strong>.
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-brand-border/50">
          <div>
            <p className="text-sm text-brand-muted mb-1">Current Estimated Revenue</p>
            <p className="text-xl md:text-2xl font-bold text-brand-muted-light">
              {formatCurrency(result.currentAnnualRevenue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-muted mb-1">Potential With Systems</p>
            <p className="text-xl md:text-2xl font-bold text-brand-green">
              {formatCurrency(result.potentialAnnualRevenue)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Proof Layer */}
      <motion.div
        className="glass-card mb-10 rounded-2xl p-6 md:p-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-brand-primary-light">
              Proof from the field
            </p>
            <h3 className="text-2xl font-bold text-brand-fg">What this looks like in a real business</h3>
          </div>
          <p className="max-w-xl text-sm text-brand-muted-light md:text-right">
            These numbers are built around the same operational leaks we fix for service businesses every week.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            'Leads followed up in 5 min convert 100× more',
            'Most restoration businesses lose 20–40% of storm revenue',
            'Speed-to-contact is the #1 driver of close rate',
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-brand-primary/15 bg-brand-primary/10 px-4 py-4 text-sm font-medium text-brand-fg shadow-[0_0_20px_rgba(168,58,196,0.08)]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-brand-border/60 bg-brand-card/70 p-6 shadow-[0_0_24px_rgba(168,58,196,0.08)]">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-muted-light">
            Texas Dent Company
          </p>
          <h4 className="mb-4 text-2xl font-bold text-brand-fg">
            Texas Dent Company reclaimed 40+ hours/month of manual follow-up
          </h4>

          <div className="mb-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-brand-border/60 bg-brand-bg/40 p-4">
              <p className="text-sm text-brand-muted">Time reclaimed</p>
              <p className="mt-1 text-lg font-semibold text-brand-fg">40+ hours/month back from manual follow-up</p>
            </div>
            <div className="rounded-xl border border-brand-border/60 bg-brand-bg/40 p-4">
              <p className="text-sm text-brand-muted">Owner workload replaced</p>
              <p className="mt-1 text-lg font-semibold text-brand-fg">8-10+ hours/week of reminder work automated</p>
            </div>
          </div>

          <blockquote className="border-l-2 border-brand-primary pl-4 text-base italic leading-relaxed text-brand-muted-light md:text-lg">
            “Before RazoRSharp Networks, I was the reminder system for the whole company. Now the follow-up is getting handled by the business itself.”
          </blockquote>
          <p className="mt-3 text-sm font-semibold text-brand-fg">— Cody Wilson, Texas Dent Company</p>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        className="space-y-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h3 className="text-xl font-bold text-brand-fg mb-4">⚡ Storm Recovery Insights</h3>
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            className="glass-card rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 + index * 0.2 }}
          >
            <div className="flex gap-4">
              <span className="text-3xl flex-shrink-0">{insight.icon}</span>
              <div>
                <h4 className="text-lg font-bold text-brand-fg mb-1">{insight.title}</h4>
                <p className="text-brand-muted text-sm leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Smart CTA — score-based routing */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        {result.score >= 60 ? (
          // High scorers → AI Audit (ready to buy)
          <>
            <p className="text-brand-muted mb-4">
              Your systems are strong — but you&apos;re still leaving {formatCurrency(result.revenueGapLow)}+ on the table. A personalized AI Audit shows you exactly where to plug the remaining leaks.
            </p>
            <motion.a
              href="https://aiaudit.razorsharpnetworks.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-auto px-10 py-5 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold text-xl rounded-xl shadow-[0_0_24px_rgba(168,58,196,0.25)] hover:shadow-[0_0_32px_rgba(168,58,196,0.4)] transition-all"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Your Personalized AI Audit →
            </motion.a>
            <p className="text-xs text-brand-muted mt-3">
              See the exact systems that close the gap — built for your business.
            </p>
            <p className="text-xs text-brand-muted mt-6">
              Or{' '}
              <a href="https://webclass.razorsharpnetworks.com/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                watch the free webclass first
              </a>
            </p>
          </>
        ) : (
          // Low/mid scorers → Webclass (need education first)
          <>
            <p className="text-brand-muted mb-4">
              See exactly how top restoration companies are closing the gap — and how you can too.
            </p>
            <motion.a
              href="https://webclass.razorsharpnetworks.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full md:w-auto px-10 py-5 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold text-xl rounded-xl shadow-[0_0_24px_rgba(168,58,196,0.25)] hover:shadow-[0_0_32px_rgba(168,58,196,0.4)] transition-all"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Watch the Free Webclass — Close Your Revenue Gap →
            </motion.a>
            <p className="text-xs text-brand-muted mt-3">
              Free training. Learn the systems that capture every storm opportunity.
            </p>
          </>
        )}
      </motion.div>

      {/* Cross-sell: Free Audit */}
      <motion.div
        className="glass-card rounded-xl p-6 mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
      >
        <p className="text-sm text-brand-muted mb-2">📊 Want a deeper look at your operations?</p>
        <a
          href="https://freeaudit.razorsharpnetworks.com/audit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-primary font-semibold hover:underline"
        >
          Take the Free AI Growth Audit — 8 questions, 2 minutes →
        </a>
      </motion.div>
    </motion.div>
  );
}
