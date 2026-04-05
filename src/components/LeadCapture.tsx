'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CalculationResult } from '@/lib/calculator';

interface LeadCaptureProps {
  onSubmit: (data: LeadData) => void;
  answers: Record<string, number | string>;
  result: CalculationResult;
}

export interface LeadData {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export default function LeadCapture({ onSubmit, answers, result }: LeadCaptureProps) {
  const [form, setForm] = useState<LeadData>({
    name: '',
    email: '',
    company: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const isValid = form.name.trim() && form.email.trim() && form.company.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      company: form.company.trim(),
      phone: form.phone.trim(),
      answers,
      score: result.score,
      revenueGapLow: result.revenueGapLow,
      revenueGapHigh: result.revenueGapHigh,
      currentRevenue: result.currentAnnualRevenue,
      potentialRevenue: result.potentialAnnualRevenue,
      weakAreas: result.weakAreas.map(w => w.label),
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log('[storm-calc] Submission result:', data);
    } catch (err) {
      console.error('[storm-calc] Submission error:', err);
    }

    setLoading(false);
    onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full px-4 py-2 mb-4">
          <span className="text-brand-primary text-sm font-medium">✨ Your results are ready</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-fg mb-2">
          Where should we send your report?
        </h2>
        <p className="text-brand-muted">
          Enter your details to unlock your Storm Revenue Recovery Score and see exactly how much you&apos;re leaving on the table.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-5 py-4 bg-brand-card border border-brand-border rounded-xl text-brand-fg placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-5 py-4 bg-brand-card border border-brand-border rounded-xl text-brand-fg placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Company Name *"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full px-5 py-4 bg-brand-card border border-brand-border rounded-xl text-brand-fg placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
            required
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-5 py-4 bg-brand-card border border-brand-border rounded-xl text-brand-fg placeholder-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
          />
        </div>

        <motion.button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-4 mt-4 bg-gradient-to-r from-brand-primary to-brand-accent disabled:from-brand-border disabled:to-brand-border disabled:text-brand-muted text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_24px_rgba(168,58,196,0.25)] hover:shadow-[0_0_32px_rgba(168,58,196,0.4)]"
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Calculating...
            </span>
          ) : (
            'Reveal My Revenue Gap →'
          )}
        </motion.button>

        <p className="text-center text-xs text-brand-muted mt-3">
          🔒 Your info is private. No spam, ever.
        </p>
      </form>
    </motion.div>
  );
}
