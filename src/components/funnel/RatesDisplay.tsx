import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { FunnelData, RateData } from '../../types/funnel';
import { calculateRates, creditScoreLabel } from '../../utils/rateCalculator';

interface RatesDisplayProps {
  data: FunnelData;
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function humanize(val: string): string {
  return val.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const TERM_FILTERS = [
  { label: 'All',  months: null },
  { label: '1 Yr', months: 12   },
  { label: '2 Yr', months: 24   },
  { label: '3 Yr', months: 36   },
  { label: '4 Yr', months: 48   },
  { label: '5 Yr', months: 60   },
];

function LoanProfile({ data }: { data: FunnelData }) {
  const [open, setOpen] = useState(false);

  const rows = [
    { label: 'Loan Amount',       value: fmtCurrency(data.loanAmount) },
    { label: 'Loan Purpose',      value: data.loanPurpose ? humanize(data.loanPurpose) : '—' },
    { label: 'Credit Score',      value: creditScoreLabel(data.creditScore) },
    { label: 'Housing Status',    value: data.housingStatus ? humanize(data.housingStatus) : '—' },
    { label: 'Employment',        value: data.employmentStatus ? humanize(data.employmentStatus) : '—' },
    { label: 'Annual Income',     value: fmtCurrency(data.annualIncome) },
    { label: 'ZIP Code',          value: data.zipCode || '—' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-[#EEF1FB] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5"
      >
        <div className="flex items-center gap-2">
          <Check size={16} className="text-[#233B86]" />
          <span className="text-sm font-bold text-[#233B86]">Your Personal Loan Profile</span>
        </div>
        {open
          ? <ChevronUp size={16} className="text-[#233B86]" />
          : <ChevronDown size={16} className="text-[#233B86]" />}
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-4">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`flex justify-between items-center px-3 py-2.5 rounded-md ${i % 2 === 0 ? 'bg-white/60' : ''}`}
            >
              <span className="text-sm text-gray-900">{r.label}</span>
              <span className="text-sm font-bold text-[#1E3569]">{r.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RateRow({ rate, index }: { rate: RateData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06 }}
      className="bg-white rounded-xl border border-gray-200 px-5 py-4"
    >
      <div className="grid grid-cols-4 gap-4 items-start">
        <div>
          <p className="text-lg font-black text-[#1E3569] leading-tight">
            {rate.interestRate.toFixed(2)}% / {rate.apr.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Rate/APR</p>
        </div>
        <div>
          <p className="text-lg text-[#1E3569] leading-tight">
            {fmtCurrency(rate.loanAmount)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Loan amount</p>
        </div>
        <div>
          <p className="text-lg text-[#1E3569] leading-tight">
            {fmtCurrency(rate.monthlyPayment)}/mo{' '}
            <Info size={13} className="inline text-gray-300 -mt-0.5" />
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Est. payment</p>
        </div>
        <div>
          <p className="text-lg text-[#1E3569] leading-tight">{rate.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">Term</p>
        </div>
      </div>
    </motion.div>
  );
}

export function RatesDisplay({ data }: RatesDisplayProps) {
  const { rates } = calculateRates(data);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const filtered = activeFilter === null
    ? rates
    : rates.filter(r => r.termMonths === activeFilter);

  const sorted = [...filtered].sort((a, b) => a.interestRate - b.interestRate);

  return (
    <div className="px-4 py-5 bg-gray-50">

      {/* Heading */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-2 h-2 rounded-full bg-[#EA2523]"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-[#EA2523]">
            Live Estimates · Updated Today
          </span>
        </div>
        <h2 className="text-xl font-black text-gray-900">Your Personalized Personal Loan Options</h2>
        {data.lead.name && (
          <p className="text-sm text-gray-500 mt-0.5">
            Hi {data.lead.name.split(' ')[0]}! Here's your estimated personal loan breakdown:
          </p>
        )}
      </motion.div>

      {/* Profile summary */}
      <div className="mb-5">
        <LoanProfile data={data} />
      </div>

      {/* Term filter pills */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-sm font-bold text-[#233B86]">Loan term:</span>
        {TERM_FILTERS.map(f => {
          const isActive = activeFilter === f.months;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.months)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                isActive
                  ? 'bg-[#233B86] text-white border-[#233B86]'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Rate rows */}
      <div className="space-y-3">
        {sorted.map((rate, i) => (
          <RateRow key={`${rate.termMonths}-${rate.interestRate}`} rate={rate} index={i} />
        ))}
      </div>
    </div>
  );
}
