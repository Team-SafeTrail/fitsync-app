'use client';

import { useState } from 'react';
import { ArrowRight, Play, Users, Zap, Clock } from 'lucide-react';

export default function HeroSection() {
  const [showLeadModal, setShowLeadModal] = useState(false);

  return (
    <>
      <section className="pt-28 pb-16 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="section-caption inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-brand-light)] text-[var(--color-brand)] rounded-[var(--radius-full)] border border-blue-100">
              B2B Health &amp; Fitness CRM • AI InBody Scanner
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-[clamp(32px,5vw,48px)] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--color-text-primary)] max-w-[720px] mx-auto mb-4">
            Less Admin.<br />More Coaching.
          </h1>

          {/* Subtitle */}
          <p className="text-center text-[16px] leading-[26px] text-[var(--color-text-secondary)] max-w-[580px] mx-auto mb-8">
            Eliminate 10+ hours of weekly spreadsheet and Zalo chaos. Digitize paper InBody
            sheets into structured Vietnamese macro nutrition plans in under 60 seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              className="btn-primary h-11 px-6 text-[15px]"
              onClick={() => setShowLeadModal(true)}
            >
              Get Early Access (Free 30-Day Pro)
              <ArrowRight size={16} />
            </button>
            <a
              href="#demo"
              className="btn-secondary h-11 px-6 text-[15px] no-underline"
            >
              <Play size={14} />
              Try Interactive OCR Demo
            </a>
          </div>

          {/* Proof Strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 border-t border-[var(--color-border-default)] pt-6">
            <ProofMetric icon={<Users size={16} />} value="104" label="Coaches Surveyed" />
            <div className="w-px h-8 bg-[var(--color-border-default)] hidden sm:block" />
            <ProofMetric icon={<Zap size={16} />} value="90%+" label="Faster InBody Entry" />
            <div className="w-px h-8 bg-[var(--color-border-default)] hidden sm:block" />
            <ProofMetric icon={<Clock size={16} />} value="< 60s" label="Processing" />
          </div>
        </div>
      </section>

      {/* Lead Modal */}
      {showLeadModal && <LeadCaptureModal onClose={() => setShowLeadModal(false)} />}
    </>
  );
}

function ProofMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--color-brand)]">{icon}</span>
      <span className="font-mono text-[18px] font-bold text-[var(--color-text-primary)]">
        {value}
      </span>
      <span className="text-[13px] text-[var(--color-text-muted)]">{label}</span>
    </div>
  );
}

function LeadCaptureModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/40"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => (e.key === 'Escape' || e.key === 'Enter') && onClose()}
        aria-label="Close dialog overlay"
      />
      <div className="modal-content relative z-10 p-6">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[var(--color-success-light)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap size={20} className="text-[var(--color-success)]" />
            </div>
            <h3 id="lead-modal-title" className="text-[18px] font-semibold mb-2">Welcome to FitSync!</h3>
            <p className="text-[14px] text-[var(--color-text-secondary)] mb-4">
              Your 30-day Pro trial is being activated. We&apos;ll reach out on Zalo within 24 hours.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 id="lead-modal-title" className="text-[18px] font-semibold">Get Early Access</h3>
                <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
                  Free 30-Day Pro Trial — No credit card required
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 hover:bg-[var(--color-canvas)] rounded-[var(--radius-base)] transition-colors border-none bg-transparent cursor-pointer text-[var(--color-text-muted)]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-name" className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1.5 cursor-pointer">
                  Full Name
                </label>
                <input
                  id="lead-name"
                  name="fullName"
                  type="text"
                  className="input"
                  placeholder="e.g. Nguyễn Văn Nam"
                  required
                />
              </div>
              <div>
                <label htmlFor="lead-phone" className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1.5 cursor-pointer">
                  Phone / Zalo
                </label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  className="input"
                  placeholder="e.g. 0901 234 567"
                  required
                />
              </div>
              <div>
                <label htmlFor="lead-role" className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1.5 cursor-pointer">
                  Role
                </label>
                <select id="lead-role" name="role" className="input cursor-pointer" required>
                  <option value="">Select your role</option>
                  <option value="freelance_pt">Freelance PT</option>
                  <option value="gym_coach">Gym Coach</option>
                  <option value="studio_owner">Studio Owner</option>
                </select>
              </div>
              <div>
                <label htmlFor="lead-volume" className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1.5 cursor-pointer">
                  How many active clients?
                </label>
                <input
                  id="lead-volume"
                  name="activeClients"
                  type="number"
                  className="input"
                  placeholder="e.g. 14"
                  min={1}
                  max={100}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Request Early Access
                <ArrowRight size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
