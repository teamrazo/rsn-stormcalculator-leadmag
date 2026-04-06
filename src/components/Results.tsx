'use client';

import { motion } from 'framer-motion';
import ScoreGauge from './ScoreGauge';
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

      {/* CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
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
      </motion.div>
    </motion.div>
  );
}
