import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, EmploymentStatus } from '../../../types/funnel';

interface StepThreeProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: 'full-time',     label: 'Full Time'     },
  { value: 'part-time',     label: 'Part Time'     },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'unemployed',    label: 'Unemployed'    },
  { value: 'other',         label: 'Other'         },
];

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export function StepThree({ data, onChange, onNext }: StepThreeProps) {
  const { employmentStatus, annualIncome } = data;
  const incomePct = (annualIncome / 250000) * 100;

  const canContinue = employmentStatus !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: Employment Status */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What is your employment status?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {EMPLOYMENT_OPTIONS.map(opt => {
            const selected = employmentStatus === opt.value;
            const isOdd = EMPLOYMENT_OPTIONS.length % 2 !== 0 && opt === EMPLOYMENT_OPTIONS[EMPLOYMENT_OPTIONS.length - 1];
            return (
              <motion.button
                key={opt.value}
                onClick={() => onChange({ employmentStatus: opt.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${isOdd ? 'col-span-2' : ''}`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                <span className="text-sm font-bold text-gray-900">{opt.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q2: Annual Income */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What's your annual income before taxes?</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Annual Income</span>
            <span className="text-2xl font-black text-[#1E3569]">{fmtCurrency(annualIncome)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={250000}
            step={2500}
            value={annualIncome}
            onChange={e => onChange({ annualIncome: Number(e.target.value) })}
            className="slider-input w-full"
            style={{ background: `linear-gradient(to right, #1E3569 ${incomePct}%, #E5E7EB ${incomePct}%)` }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: '#757575' }}>$0</span>
            <span className="text-xs" style={{ color: '#757575' }}>$250K+</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
