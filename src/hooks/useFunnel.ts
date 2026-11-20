import { useState, useCallback } from 'react';
import type { FunnelData, FunnelStep } from '../types/funnel';
import { STEP_ORDER, QUESTION_STEPS } from '../types/funnel';

const DEFAULT_DATA: FunnelData = {
  loanAmount: 10000,
  loanPurpose: null,
  creditScore: 700,
  housingStatus: null,
  employmentStatus: null,
  annualIncome: 75000,
  zipCode: '',
  lead: { name: '', email: '', phone: '' },
};

export function useFunnel() {
  const [currentStep, setCurrentStep] = useState<FunnelStep>('step1');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [data, setData] = useState<FunnelData>(DEFAULT_DATA);

  const updateData = useCallback((updates: Partial<FunnelData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const goNext = useCallback(() => {
    setDirection('forward');
    setCurrentStep(prev => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx !== -1 && idx < STEP_ORDER.length - 1) return STEP_ORDER[idx + 1];
      return prev;
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection('backward');
    setCurrentStep(prev => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx > 0) return STEP_ORDER[idx - 1];
      return prev;
    });
  }, []);

  const currentQuestionIndex = QUESTION_STEPS.indexOf(currentStep);
  const isQuestionStep = currentQuestionIndex !== -1;
  const totalQuestions = QUESTION_STEPS.length;
  const canGoBack =
    currentStep !== 'step1' &&
    currentStep !== 'loading' &&
    currentStep !== 'lead-capture' &&
    currentStep !== 'rates';

  return {
    currentStep,
    direction,
    data,
    updateData,
    goNext,
    goBack,
    currentQuestionIndex,
    isQuestionStep,
    totalQuestions,
    canGoBack,
  };
}
