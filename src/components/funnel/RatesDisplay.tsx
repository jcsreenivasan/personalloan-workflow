import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import type { FunnelData, RateData } from '../../types/funnel';
import { calculateRates, creditScoreBandLabel } from '../../utils/rateCalculator';

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

function RateRow({ rate, index }: { rate: RateData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06 }}
      className="bg-white rounded-xl border border-gray-200 px-5 py-4"
    >
      <div className="grid grid-cols-4 gap-4 items-start">
        {/* Rate / APR */}
        <div>
          <p className="text-lg font-black text-[#1E3569] leading-tight">
            {rate.interestRate.toFixed(2)}% / {rate.apr.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Rate/APR</p>
        </div>

        {/* Loan amount */}
        <div>
          <p className="text-lg font-black text-[#1E3569] leading-tight">
            {fmtCurrency(rate.loanAmount)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Loan amount</p>
        </div>

        {/* Est. payment */}
        <div>
          <p className="text-lg font-black text-[#1E3569] leading-tight">
            {fmtCurrency(rate.monthlyPayment)}/mo{' '}
            <Info size={13} className="inline text-gray-300 -mt-0.5" />
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Est. payment</p>
        </div>

        {/* Term */}
        <div>
          <p className="text-lg font-black text-[#1E3569] leading-tight">{rate.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">Term</p>
        </div>
      </div>
    </motion.div>
  );
}

export function RatesDisplay({ data }: RatesDisplayProps) {
  const { rates } = calculateRates(data);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'low-rate' | 'low-payment'>('low-rate');

  const filtered = activeFilter === null
    ? rates
    : rates.filter(r => r.termMonths === activeFilter);

  const sorted = [...filtered].sort((a, b) =>
    sortBy === 'low-rate'
      ? a.interestRate - b.interestRate
      : a.monthlyPayment - b.monthlyPayment
  );

  const termLabel = activeFilter === null
    ? 'any term'
    : TERM_FILTERS.find(f => f.months === activeFilter)?.label ?? '';

  return (
    <div className="px-4 py-5 bg-gray-50">

      {/* Filters row */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {/* Term pills */}
        <div className="flex items-center gap-2 flex-wrap">
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

        {/* Sort by */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-gray-400 mb-0.5">Sort By</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'low-rate' | 'low-payment')}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-sm font-semibold text-[#1E3569] focus:outline-none focus:border-[#233B86] cursor-pointer"
            >
              <option value="low-rate">Low Rate</option>
              <option value="low-payment">Low Payment</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth={2}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Summary line */}
      <p className="text-sm text-gray-500 mb-5">
        Viewing personal loan rates · <span className="font-semibold text-gray-800">{fmtCurrency(data.loanAmount)}</span> · {termLabel} · <span className="font-semibold text-gray-800">{creditScoreBandLabel(data.creditScore)}</span> credit · {data.loanPurpose ? humanize(data.loanPurpose) : 'Personal'}
      </p>

      {/* Rate rows */}
      <div className="space-y-3">
        {sorted.map((rate, i) => (
          <RateRow key={`${rate.termMonths}-${rate.interestRate}`} rate={rate} index={i} />
        ))}
      </div>
    </div>
  );
}
