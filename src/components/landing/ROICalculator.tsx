'use client';

import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { formatVND } from '@/lib/utils';

export default function ROICalculator() {
  const [clients, setClients] = useState(14);

  const metrics = useMemo(() => {
    // 2.85 hours saved per client per month on manual InBody entry, spreadsheets, and Zalo admin
    const hoursSaved = Math.round(clients * 2.85);
    // 1 unlocked coaching session per ~3.3 hours of administrative time reclaimed
    const sessionsUnlocked = Math.round(hoursSaved / 3.3);
    const revenuePerSession = 500_000; // 500,000 VND per 1-on-1 PT session
    const additionalRevenue = sessionsUnlocked * revenuePerSession;
    const proPlanCost = 199_000;
    const roi = Math.round(((additionalRevenue - proPlanCost) / proPlanCost) * 100);

    return { hoursSaved, sessionsUnlocked, additionalRevenue, proPlanCost, roi };
  }, [clients]);

  return (
    <section id="roi" className="py-16 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <span className="section-caption text-[var(--color-brand)] mb-2 block">
            ROI Calculator
          </span>
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] mb-3">
            See Your Return Before You Invest
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[500px] mx-auto">
            Drag the slider to see how FitSync transforms your coaching practice.
          </p>
        </div>

        <div className="card max-w-[700px] mx-auto">
          {/* Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="client-slider" className="text-[14px] font-medium text-[var(--color-text-primary)] cursor-pointer">
                How many active clients do you manage?
              </label>
              <span className="font-mono text-[22px] font-bold text-[var(--color-brand)]">
                {clients}
              </span>
            </div>
            <input
              id="client-slider"
              type="range"
              min={5}
              max={30}
              value={clients}
              onChange={(e) => setClients(Number(e.target.value))}
              aria-label="How many active clients do you manage?"
              className="w-full h-1.5 bg-[var(--color-surface-muted)] rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-brand)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)] [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--color-brand)] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] mt-1">
              <span>5 clients</span>
              <span>30 clients</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <MetricCard
              icon={<Clock size={18} />}
              label="Admin Hours Saved / Month"
              value={`${metrics.hoursSaved}h`}
              accent={false}
            />
            <MetricCard
              icon={<TrendingUp size={18} />}
              label="Extra Sessions Unlocked"
              value={`+${metrics.sessionsUnlocked}`}
              accent={false}
            />
            <MetricCard
              icon={<DollarSign size={18} />}
              label="Additional Revenue / Month"
              value={formatVND(metrics.additionalRevenue)}
              accent
            />
            <MetricCard
              icon={<Calculator size={18} />}
              label="ROI vs Pro Plan (199K ₫/mo)"
              value={`${metrics.roi.toLocaleString()}%`}
              accent
            />
          </div>

          {/* Bottom comparison */}
          <div className="bg-[var(--color-brand-light)] border border-blue-100 rounded-[var(--radius-md)] p-4 text-center">
            <p className="text-[13px] text-[var(--color-text-secondary)] mb-1">
              Pro Plan costs just{' '}
              <span className="font-mono font-semibold text-[var(--color-text-primary)]">
                199,000 ₫/mo
              </span>
            </p>
            <p className="text-[15px] font-semibold text-[var(--color-brand)]">
              You gain{' '}
              <span className="font-mono">+{formatVND(metrics.additionalRevenue)}</span> →{' '}
              <span className="font-mono">{metrics.roi.toLocaleString()}% ROI</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: boolean;
}) {
  return (
    <div className={`p-4 rounded-[var(--radius-md)] border ${
      accent
        ? 'bg-[var(--color-accent-light)] border-teal-100'
        : 'bg-[var(--color-canvas)] border-[var(--color-border-default)]'
    }`}>
      <div className={`mb-2 ${accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}>
        {icon}
      </div>
      <p className="text-[11px] text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className={`font-mono text-[18px] font-bold ${
        accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'
      }`}>
        {value}
      </p>
    </div>
  );
}
