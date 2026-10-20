export interface Answers {
  monthly_leads: number;
  avg_ticket: number;
  close_rate: number;
  follow_up_speed: string;
  automation: string;
  tracking: string;
}

export interface CalculationResult {
  score: number;
  revenueGapLow: number;
  revenueGapHigh: number;
  currentAnnualRevenue: number;
  potentialAnnualRevenue: number;
  weakAreas: WeakArea[];
}

export interface WeakArea {
  category: 'speed' | 'automation' | 'tracking' | 'close_rate';
  severity: 'high' | 'medium' | 'low';
  label: string;
}

const INDUSTRY_BENCHMARK_CLOSE_RATE = 0.35;

const FOLLOW_UP_SPEED_PENALTY: Record<string, number> = {
  within_1_hour: 0,
  same_day: 0.05,
  next_day: 0.10,
  '2_3_days': 0.15,
  week_plus: 0.25,
};

const FOLLOW_UP_SPEED_SCORE: Record<string, number> = {
  within_1_hour: 25,
  same_day: 18,
  next_day: 12,
  '2_3_days': 6,
  week_plus: 0,
};

const AUTOMATION_PENALTY: Record<string, number> = {
  full: 0,
  partial: 0.10,
  none: 0.25,
};

const AUTOMATION_SCORE: Record<string, number> = {
  full: 25,
  partial: 15,
  none: 0,
};

const TRACKING_SCORE: Record<string, number> = {
  crm: 25,
  spreadsheets: 15,
  paper: 7,
  head: 0,
};

const TRACKING_PENALTY: Record<string, number> = {
  crm: 0,
  spreadsheets: 0.05,
  paper: 0.10,
  head: 0.15,
};

export function calculateResults(answers: Answers): CalculationResult {
  const {
    monthly_leads,
    avg_ticket,
    close_rate,
    follow_up_speed,
    automation,
    tracking,
  } = answers;

  const userCloseRate = close_rate / 100;

  // Revenue gap from close rate difference
  const closeRateGap = Math.max(0, INDUSTRY_BENCHMARK_CLOSE_RATE - userCloseRate);
  const baseGap = monthly_leads * avg_ticket * closeRateGap * 12;

  // Penalties from follow-up speed, automation, tracking
  // `??`, not `||`: a best-case answer has a penalty of 0, and `0 || 0.10`
  // silently charged it the fallback. Fallbacks apply only to unknown answers.
  const speedPenalty = FOLLOW_UP_SPEED_PENALTY[follow_up_speed] ?? 0.10;
  const autoPenalty = AUTOMATION_PENALTY[automation] ?? 0.10;
  const trackPenalty = TRACKING_PENALTY[tracking] ?? 0.05;

  // Penalty-based additional gap (applied to their current revenue)
  const currentMonthly = monthly_leads * avg_ticket * userCloseRate;
  const currentAnnual = currentMonthly * 12;
  const penaltyGap = currentAnnual * (speedPenalty + autoPenalty + trackPenalty);

  const totalGap = baseGap + penaltyGap;

  // Revenue gap range (±15%)
  const revenueGapLow = Math.round(totalGap * 0.85);
  const revenueGapHigh = Math.round(totalGap * 1.15);

  // Potential with systems = what they earn today + the gap we just measured.
  // The old benchmark-only figure (leads x ticket x 35%) fell below current
  // revenue for anyone closing above 35%, so the numbers did not add up.
  const potentialAnnual = currentAnnual + totalGap;

  // Score calculation (0-100)
  const closeRateScore = Math.min(25, (userCloseRate / INDUSTRY_BENCHMARK_CLOSE_RATE) * 25);
  const speedScore = FOLLOW_UP_SPEED_SCORE[follow_up_speed] ?? 12;
  const autoScore = AUTOMATION_SCORE[automation] ?? 15;
  const trackScore = TRACKING_SCORE[tracking] ?? 15;
  const score = Math.round(Math.min(100, closeRateScore + speedScore + autoScore + trackScore));

  // Weak areas
  const weakAreas: WeakArea[] = [];

  if (userCloseRate < 0.20) {
    weakAreas.push({ category: 'close_rate', severity: 'high', label: 'Close Rate' });
  } else if (userCloseRate < 0.30) {
    weakAreas.push({ category: 'close_rate', severity: 'medium', label: 'Close Rate' });
  }

  if (speedPenalty >= 0.15) {
    weakAreas.push({ category: 'speed', severity: 'high', label: 'Follow-Up Speed' });
  } else if (speedPenalty >= 0.05) {
    weakAreas.push({ category: 'speed', severity: 'medium', label: 'Follow-Up Speed' });
  }

  if (autoPenalty >= 0.20) {
    weakAreas.push({ category: 'automation', severity: 'high', label: 'Lead Automation' });
  } else if (autoPenalty >= 0.10) {
    weakAreas.push({ category: 'automation', severity: 'medium', label: 'Lead Automation' });
  }

  if (trackPenalty >= 0.10) {
    weakAreas.push({ category: 'tracking', severity: 'high', label: 'Lead Tracking' });
  } else if (trackPenalty >= 0.05) {
    weakAreas.push({ category: 'tracking', severity: 'medium', label: 'Lead Tracking' });
  }

  // Sort by severity
  weakAreas.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });

  return {
    score,
    revenueGapLow,
    revenueGapHigh,
    currentAnnualRevenue: Math.round(currentAnnual),
    potentialAnnualRevenue: Math.round(potentialAnnual),
    weakAreas,
  };
}
