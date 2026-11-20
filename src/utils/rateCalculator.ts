import type { FunnelData, RateData } from '../types/funnel';

type CreditBand = 'excellent' | 'good' | 'fair' | 'poor';

function scoreToBand(score: number): CreditBand {
  if (score >= 720) return 'excellent';
  if (score >= 680) return 'good';
  if (score >= 620) return 'fair';
  return 'poor';
}

function personalLoanRates(band: CreditBand): { primary: number; secondary: number } {
  const map: Record<CreditBand, { primary: number; secondary: number }> = {
    excellent: { primary: 7.99,  secondary: 9.99  },
    good:      { primary: 11.99, secondary: 13.99 },
    fair:      { primary: 15.99, secondary: 17.99 },
    poor:      { primary: 20.99, secondary: 24.99 },
  };
  return map[band];
}

function calcMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return (principal * r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export interface RateCalculationResult {
  rates: RateData[];
  loanAmount: number;
}

export function calculateRates(data: FunnelData): RateCalculationResult {
  const band = scoreToBand(data.creditScore);
  const rates = personalLoanRates(band);
  const loanAmount = data.loanAmount;
  const primaryTerm = 36;
  const secondaryTerm = 60;

  const primaryMonthly = calcMonthlyPayment(loanAmount, rates.primary, primaryTerm);
  const secondaryMonthly = calcMonthlyPayment(loanAmount, rates.secondary, secondaryTerm);

  return {
    loanAmount,
    rates: [
      {
        label: `Personal Loan · ${primaryTerm} months`,
        badge: 'Best Rate',
        interestRate: rates.primary,
        apr: rates.primary + 0.1,
        monthlyPayment: primaryMonthly,
        loanAmount,
        termMonths: primaryTerm,
        totalInterest: primaryMonthly * primaryTerm - loanAmount,
      },
      {
        label: `Personal Loan · ${secondaryTerm} months`,
        badge: 'Lower Payment',
        interestRate: rates.secondary,
        apr: rates.secondary + 0.1,
        monthlyPayment: secondaryMonthly,
        loanAmount,
        termMonths: secondaryTerm,
        totalInterest: secondaryMonthly * secondaryTerm - loanAmount,
      },
    ],
  };
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
