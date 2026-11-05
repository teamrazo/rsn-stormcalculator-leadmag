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
  const [error, setError] = useState('');

  const isValid = form.name.trim() && form.email.trim() && form.company.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError('');

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
        body: JSON.stringify({
          ...payload,
          attribution: (window as unknown as { RSNAttribution?: { get: (f: string) => unknown } }).RSNAttribution?.get('storm calculator'),
        }),
      });
      if (!res.ok) {
        setError('We could not save your results. Check your connection and try again.');
        setLoading(false);
        return;
      }
    } catch {
      setError('We could not save your results. Check your connection and try again.');
      setLoading(false);
      return;
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
          <span className="text-brand-primary text-sm font-medium">Your results are ready</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-brand-fg mb-2">
          Where should we send your report?
        </h2>
        <p className="text-brand-muted">
          Enter your details to unlock your Storm Revenue Recovery Score and see exactly how much you're leaving on the table.
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

        {error && (
          <p className="text-sm text-brand-fg" role="alert">{error}</p>
        )}

        <motion.button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-4 mt-4 bg-gradient-to-r from-brand-primary to-brand-accent disabled:from-brand-border disabled:to-brand-border disabled:text-brand-muted text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_24px_rgba(168,58,196,0.25)] hover:shadow-[0_0_32px_rgba(168,58,196,0.4)]"
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          {loading ? 'Saving...' : 'Reveal My Revenue Gap'}
        </motion.button>

        <p className="text-center text-xs text-brand-muted mt-3">
          Your info is private. No spam.
        </p>
      </form>
    </motion.div>
  );
}
