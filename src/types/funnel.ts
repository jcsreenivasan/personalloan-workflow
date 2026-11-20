export type LoanPurpose = 'debt-consolidation' | 'home-improvement' | 'personal-use' | 'other';
export type HousingStatus = 'rent' | 'own';
export type EmploymentStatus = 'full-time' | 'part-time' | 'self-employed' | 'unemployed' | 'other';

export interface FunnelData {
  // Step 1: Loan Info
  loanAmount: number;
  loanPurpose: LoanPurpose | null;

  // Step 2: Credit & Housing
  creditScore: number;
  housingStatus: HousingStatus | null;

  // Step 3: Employment & Income
  employmentStatus: EmploymentStatus | null;
  annualIncome: number;

  // Step 4: Location
  zipCode: string;

  // Lead Capture
  lead: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface RateData {
  label: string;
  badge?: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  loanAmount: number;
  termMonths: number;
  totalInterest: number;
}

export type FunnelStep =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'lead-capture'
  | 'loading'
  | 'rates';

export const STEP_ORDER: FunnelStep[] = [
  'step1',
  'step2',
  'step3',
  'step4',
  'lead-capture',
  'loading',
  'rates',
];

export const QUESTION_STEPS: FunnelStep[] = ['step1', 'step2', 'step3', 'step4'];
