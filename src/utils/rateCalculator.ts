import type { FunnelData, RateData } from '../types/funnel';

type CreditBand = 'excellent' | 'good' | 'fair' | 'poor';

function scoreToBand(score: number): CreditBand {
  if (score >= 720) return 'excellent';
  if (score >= 680) return 'good';
  if (score >= 620) return 'fair';
  return 'poor';
}

function baseRate(band: CreditBand): number {
  const map: Record<CreditBand, number> = {
    excellent: 7.24,
    good:      10.24,
    fair:      14.24,
    poor:      19.24,
  };
  return map[band];
}

function calcMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

const TERMS = [
  { months: 12, label: '1 year',  years: 1 },
  { months: 24, label: '2 years', years: 2 },
  { months: 36, label: '3 years', years: 3 },
  { months: 48, label: '4 years', years: 4 },
  { months: 60, label: '5 years', years: 5 },
];

export interface RateCalculationResult {
  rates: RateData[];
  loanAmount: number;
}

export function calculateRates(data: FunnelData): RateCalculationResult {
  const band = scoreToBand(data.creditScore);
  const base = baseRate(band);
  const loanAmount = data.loanAmount;

  const rates: RateData[] = TERMS.map((term, i) => {
    const interestRate = +(base + i * 1.0).toFixed(2);
    const apr = +(interestRate + 0.25).toFixed(2);
    const monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, term.months);

    return {
      label: term.label,
      interestRate,
      apr,
      monthlyPayment,
      loanAmount,
      termMonths: term.months,
      totalInterest: monthlyPayment * term.months - loanAmount,
    };
  });

  return { loanAmount, rates };
}

export function creditScoreLabel(score: number): string {
  const band = scoreToBand(score);
  const labels: Record<CreditBand, string> = {
    excellent: `Excellent (${score})`,
    good:      `Good (${score})`,
    fair:      `Fair (${score})`,
    poor:      `Poor (${score})`,
  };
  return labels[band];
}

export function creditScoreBandLabel(score: number): string {
  const band = scoreToBand(score);
  const labels: Record<CreditBand, string> = {
    excellent: 'Excellent (720+)',
    good:      'Good (680+)',
    fair:      'Fair (620+)',
    poor:      'Below 620',
  };
  return labels[band];
}
