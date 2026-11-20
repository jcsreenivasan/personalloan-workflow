import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, HousingStatus } from '../../../types/funnel';

interface StepTwoProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const HOUSING_OPTIONS: { value: HousingStatus; label: string; desc: string; img: string }[] = [
  { value: 'rent', label: 'I Rent', desc: 'Renting from a landlord',              img: '/rent-home.png' },
  { value: 'own',  label: 'I Own',  desc: 'Own my home outright or w/ mortgage',  img: '/own-home.png'  },
];

const BANDS = [
  { label: 'Poor',      range: '500–619', min: 500, max: 619, color: '#DC2626' },
  { label: 'Fair',      range: '620–679', min: 620, max: 679, color: '#EA580C' },
  { label: 'Good',      range: '680–719', min: 680, max: 719, color: '#CA8A04' },
  { label: 'Excellent', range: '720–850', min: 720, max: 850, color: '#16A34A' },
];

const BAND_MESSAGES: Record<string, string> = {
  Poor:      'Some options may still be available.',
  Fair:      'You may qualify for competitive rates.',
  Good:      "You're in a solid range for good rates.",
  Excellent: 'You qualify for our best rates!',
};

function getActiveBand(score: number) {
  return BANDS.find(b => score >= b.min && score <= b.max) ?? BANDS[2];
}

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

export function StepTwo({ data, onChange, onNext }: StepTwoProps) {
  const { creditScore, housingStatus } = data;
  const active = getActiveBand(creditScore);
  const MIN = 500, MAX = 850;
  const pct = ((creditScore - MIN) / (MAX - MIN)) * 100;

  const canContinue = housingStatus !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: Credit Score */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-4">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What's your estimated credit score?</h2>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#757575' }}>Your Score</p>
            <p className="text-5xl font-black leading-none" style={{ color: active.color }}>{creditScore}</p>
          </div>
          <div className="text-right mt-1">
            <p className="text-xl font-bold" style={{ color: active.color }}>{active.label}</p>
            <p className="text-sm mt-1 leading-relaxed max-w-[180px] text-gray-900">{BAND_MESSAGES[active.label]}</p>
          </div>
        </div>

        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={creditScore}
          onChange={e => onChange({ creditScore: Number(e.target.value) })}
          className="slider-input w-full"
          style={{ background: `linear-gradient(to right, ${active.color} ${pct}%, #E5E7EB ${pct}%)` }}
        />
        <div className="flex justify-between mt-2 mb-5">
          <span className="text-xs" style={{ color: '#757575' }}>500</span>
          <span className="text-xs" style={{ color: '#757575' }}>850</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {BANDS.map(band => {
            const isActive = creditScore >= band.min && creditScore <= band.max;
            return (
              <div
                key={band.label}
                className={`rounded-xl px-2 py-2 text-center border-2 transition-all ${isActive ? '' : 'border-transparent bg-gray-50'}`}
                style={isActive ? { borderColor: band.color + '50', backgroundColor: band.color + '15' } : {}}
              >
                <p className="text-xs font-bold" style={{ color: band.color }}>{band.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: '#757575' }}>{band.range}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Q2: Housing Status */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">Do you rent or own a home?</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {HOUSING_OPTIONS.map(opt => {
            const selected = housingStatus === opt.value;
            return (
              <motion.button
                key={opt.value}
                onClick={() => onChange({ housingStatus: opt.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl border-2 transition-all ${
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
                <img src={opt.img} alt={opt.label} className="w-12 h-12 object-contain" />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{opt.desc}</p>
                </div>
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
