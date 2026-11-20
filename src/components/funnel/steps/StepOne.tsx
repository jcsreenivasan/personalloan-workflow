import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, LoanPurpose } from '../../../types/funnel';

interface StepOneProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const LOAN_PURPOSES: { value: LoanPurpose; label: string; img: string }[] = [
  { value: 'debt-consolidation', label: 'Debt Consolidation', img: '/debt-consolidation.png' },
  { value: 'home-improvement',   label: 'Home Improvement',   img: '/home-improvement.png'   },
  { value: 'personal-use',       label: 'Personal Use',       img: '/personal-use.png'       },
  { value: 'other',              label: 'Other',              img: '/other.png'              },
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

export function StepOne({ data, onChange, onNext }: StepOneProps) {
  const { loanAmount, loanPurpose } = data;
  const MIN = 1000, MAX = 100000;
  const pct = ((loanAmount - MIN) / (MAX - MIN)) * 100;

  const canContinue = loanPurpose !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: Loan Amount */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">How much would you like to borrow?</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Loan Amount</span>
            <span className="text-2xl font-black text-[#1E3569]">{fmtCurrency(loanAmount)}</span>
          </div>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={500}
            value={loanAmount}
            onChange={e => onChange({ loanAmount: Number(e.target.value) })}
            className="slider-input w-full"
            style={{ background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)` }}
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: '#757575' }}>$1,000</span>
            <span className="text-xs" style={{ color: '#757575' }}>$100,000</span>
          </div>
        </div>
      </div>

      {/* Q2: Loan Purpose */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What is the purpose of this loan?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LOAN_PURPOSES.map(lp => {
            const selected = loanPurpose === lp.value;
            return (
              <motion.button
                key={lp.value}
                onClick={() => onChange({ loanPurpose: lp.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
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
                <img src={lp.img} alt={lp.label} className="w-10 h-10 object-contain flex-shrink-0" />
                <span className="text-sm font-bold text-gray-900 text-left">{lp.label}</span>
              </motion.button>
            );
          })}
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
