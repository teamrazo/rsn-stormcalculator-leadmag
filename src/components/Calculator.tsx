'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { questions } from '@/lib/questions';
import { calculateResults, type Answers } from '@/lib/calculator';
import { generateInsights } from '@/lib/insights';
import ProgressBar from './ProgressBar';
import Question from './Question';
import LeadCapture, { type LeadData } from './LeadCapture';
import Results from './Results';
import RainEffect from './RainEffect';
import HeroLanding from './HeroLanding';

type Step = 'landing' | 'questions' | 'capture' | 'results';

export default function Calculator() {
  const [step, setStep] = useState<Step>('landing');
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
    void _data;
    setStep('results');
  };

  const handleStart = () => {
    setStep('questions');
  };

  const result = calculateResults(answers as unknown as Answers);
  const insights = generateInsights(answers as unknown as Answers);

  return (
    <div className="min-h-screen relative tech-grid">
      <RainEffect />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hello Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#0A0A0F]/95 backdrop-blur-md">
          <div className="flex h-12 w-full items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Image
                src="/RS_Only_Purple_Logo_Transparent.png"
                alt="RazoRSharp Networks"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-sm font-semibold text-brand-fg">
                Storm Revenue Calculator
              </span>
            </div>
            <div className="flex items-center gap-4">
              {step === 'questions' && currentQuestion > 0 && (
                <button
                  onClick={handleBack}
                  className="text-sm text-brand-muted transition-colors hover:text-brand-fg"
                >
                  ← Back
                </button>
              )}
              <a
                href="tel:+14699662126"
                className="whitespace-nowrap text-sm font-semibold text-brand-fg transition-colors hover:text-brand-primary-light"
              >
                (469) 966-2126
              </a>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 ${step === 'landing' ? '' : 'px-4 py-3'}`}>
          <div className={`w-full ${step === 'landing' ? '' : 'mx-auto max-w-4xl'}`}>
            <AnimatePresence mode="wait">
              {step === 'landing' && <HeroLanding onStart={handleStart} />}

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
      </div>
    </div>
  );
}
