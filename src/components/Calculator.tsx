'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { questions } from '@/lib/questions';
import { calculateResults, type Answers } from '@/lib/calculator';
import { generateInsights } from '@/lib/insights';
import ProgressBar from './ProgressBar';
import Question from './Question';
import LeadCapture, { type LeadData } from './LeadCapture';
import Results from './Results';
import RainEffect from './RainEffect';

type Step = 'questions' | 'capture' | 'results';

export default function Calculator() {
  const [step, setStep] = useState<Step>('questions');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});

  const handleAnswer = useCallback(
    (value: number | string) => {
      const question = questions[currentQuestion];
      const newAnswers = { ...answers, [question.id]: value };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setStep('capture');
      }
    },
    [currentQuestion, answers]
  );

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleLeadSubmit = (_data: LeadData) => {
    setStep('results');
  };

  const result = calculateResults(answers as unknown as Answers);
  const insights = generateInsights(answers as unknown as Answers);

  return (
    <div className="min-h-screen relative tech-grid">
      <RainEffect />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-6 pb-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/RS_Only_Purple_Logo_Transparent.png"
                alt="RazoRSharp Networks"
                className="h-8 w-auto"
              />
              <span className="text-brand-fg font-semibold text-sm hidden sm:inline">
                Storm Revenue Calculator
              </span>
            </div>
            {step === 'questions' && currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="text-sm text-brand-muted hover:text-brand-fg transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        </header>

        {/* Tagline on first question */}
        {step === 'questions' && currentQuestion === 0 && (
          <div className="text-center px-4 -mb-4">
            <p className="text-brand-muted-light text-sm italic tracking-wide">
              ⚡ Every Storm Is an Opportunity.
            </p>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex items-center px-4 py-8">
          <div className="w-full max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {step === 'questions' && (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProgressBar current={currentQuestion} total={questions.length} />
                  <Question
                    question={questions[currentQuestion]}
                    value={answers[questions[currentQuestion].id]}
                    onAnswer={handleAnswer}
                  />
                </motion.div>
              )}

              {step === 'capture' && (
                <motion.div
                  key="capture"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <LeadCapture onSubmit={handleLeadSubmit} answers={answers} result={result} />
                </motion.div>
              )}

              {step === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Results result={result} insights={insights} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 text-center border-t border-brand-border/30">
          <p className="text-xs text-brand-muted mb-1">
            © 2026 • Legacy Media LLC DBA RazoRSharp Networks • All Rights Reserved.
          </p>
          <p className="text-xs text-brand-muted">
            Powered By:{' '}
            <a
              href="https://pillar.razorsharpnetworks.com/webassetfx-smart-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted-light hover:text-brand-primary transition-colors"
            >
              WebAssetFX
            </a>
            {' & '}
            <a
              href="https://pillar.razorsharpnetworks.com/automate-ai-agents-overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted-light hover:text-brand-primary transition-colors"
            >
              AutoMATE™ AI Technology
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
