'use client';

import { useState } from 'react';
import Link from 'next/link';
import { pricingTiers } from '@/lib/mock-data';
import { Check, ArrowRight, X, Copy, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';

export default function PricingSection() {
  const [showQR, setShowQR] = useState(false);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);

  return (
    <>
      <section id="pricing" className="py-16 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <span className="section-caption text-[var(--color-brand)] mb-2 block">
              Pricing
            </span>
            <h2 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[480px] mx-auto">
              Start free. Upgrade when you&apos;re ready to unlock unlimited scans and smart alerts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[900px] mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`card relative flex flex-col justify-between ${
                  tier.highlighted
                    ? 'border-[var(--color-brand)] border-2 shadow-[var(--shadow-sm)]'
                    : ''
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 badge bg-[var(--color-brand)] text-white border-[var(--color-brand)]">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-[28px] font-bold text-[var(--color-text-primary)]">
                        {tier.price_label}
                      </span>
                      <span className="text-[13px] text-[var(--color-text-muted)]">
                        {tier.period}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check
                          size={14}
                          className={`mt-0.5 shrink-0 ${
                            tier.highlighted
                              ? 'text-[var(--color-brand)]'
                              : 'text-[var(--color-success)]'
                          }`}
                        />
                        <span className="text-[13px] text-[var(--color-text-secondary)]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.highlighted ? (
                  <button
                    className="w-full btn-primary"
                    onClick={() => setShowQR(true)}
                  >
                    {tier.cta_label}
                    <ArrowRight size={14} />
                  </button>
                ) : tier.name === 'Freemium' ? (
                  <Link
                    href="/app/dashboard"
                    className="w-full btn-secondary text-center no-underline"
                  >
                    {tier.cta_label}
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button
                    className="w-full btn-secondary"
                    onClick={() => setShowEnterpriseModal(true)}
                  >
                    {tier.cta_label}
                    <Building2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VietQR Modal */}
      {showQR && <VietQRModal onClose={() => setShowQR(false)} />}

      {/* Enterprise Contact Modal */}
      {showEnterpriseModal && (
        <EnterpriseContactModal onClose={() => setShowEnterpriseModal(false)} />
      )}
    </>
  );
}

function VietQRModal({ onClose }: { onClose: () => void }) {
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const memo = 'FITSYNC PRO NAM 0901234567';
  const accountNumber = '1028475928';

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vietqr-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/40"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => (e.key === 'Escape' || e.key === 'Enter') && onClose()}
        aria-label="Close dialog overlay"
      />
      <div className="modal-content relative z-10 max-w-[480px] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
            <h3 id="vietqr-modal-title" className="text-[17px] font-semibold text-[var(--color-text-primary)]">
              VietQR Instant Activation
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 hover:bg-[var(--color-canvas)] rounded-[var(--radius-base)] transition-colors border-none bg-transparent cursor-pointer"
          >
            <X size={18} className="text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* VietQR Card Mockup */}
        <div className="bg-white border border-[var(--color-border-strong)] rounded-[var(--radius-md)] p-4 shadow-sm mb-4">
          {/* Header strip */}
          <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[15px] tracking-tight text-[var(--color-brand)]">
                VietQR
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-blue-50 text-[var(--color-brand)] rounded">
                NAPAS 24/7
              </span>
            </div>
            <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">
              Vietcombank (VCB)
            </span>
          </div>

          {/* Crisp QR SVG Mockup */}
          <div className="flex justify-center my-3">
            <div className="p-3 bg-white border border-[var(--color-border-default)] rounded-[var(--radius-base)] shadow-xs">
              <svg
                width="168"
                height="168"
                viewBox="0 0 168 168"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[168px] h-[168px]"
              >
                <rect width="168" height="168" fill="white" />
                {/* Top-Left Finder */}
                <rect x="12" y="12" width="40" height="40" rx="4" fill="#0F172A" />
                <rect x="18" y="18" width="28" height="28" fill="white" />
                <rect x="24" y="24" width="16" height="16" rx="2" fill="#1E40AF" />

                {/* Top-Right Finder */}
                <rect x="116" y="12" width="40" height="40" rx="4" fill="#0F172A" />
                <rect x="122" y="18" width="28" height="28" fill="white" />
                <rect x="128" y="24" width="16" height="16" rx="2" fill="#1E40AF" />

                {/* Bottom-Left Finder */}
                <rect x="12" y="116" width="40" height="40" rx="4" fill="#0F172A" />
                <rect x="18" y="122" width="28" height="28" fill="white" />
                <rect x="24" y="128" width="16" height="16" rx="2" fill="#1E40AF" />

                {/* Matrix Dots */}
                <g fill="#0F172A">
                  <rect x="60" y="14" width="6" height="6" />
                  <rect x="74" y="14" width="6" height="6" />
                  <rect x="88" y="14" width="6" height="6" />
                  <rect x="102" y="14" width="6" height="6" />
                  <rect x="66" y="26" width="6" height="6" />
                  <rect x="80" y="26" width="6" height="6" />
                  <rect x="94" y="26" width="6" height="6" />
                  <rect x="60" y="38" width="6" height="6" />
                  <rect x="86" y="38" width="6" height="6" />
                  <rect x="100" y="38" width="6" height="6" />
                  
                  {/* Center Pattern */}
                  <rect x="16" y="60" width="6" height="6" />
                  <rect x="28" y="66" width="6" height="6" />
                  <rect x="42" y="60" width="6" height="6" />
                  <rect x="56" y="60" width="6" height="6" />
                  <rect x="70" y="54" width="6" height="6" />
                  <rect x="84" y="60" width="6" height="6" />
                  <rect x="98" y="54" width="6" height="6" />
                  <rect x="112" y="60" width="6" height="6" />
                  <rect x="126" y="66" width="6" height="6" />
                  <rect x="144" y="60" width="6" height="6" />

                  {/* Center Badge */}
                  <rect x="68" y="68" width="32" height="32" rx="4" fill="#1E40AF" />
                  <path d="M78 84L82 88L90 80" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Bottom Half Matrix */}
                  <rect x="16" y="80" width="6" height="6" />
                  <rect x="36" y="84" width="6" height="6" />
                  <rect x="48" y="90" width="6" height="6" />
                  <rect x="112" y="80" width="6" height="6" />
                  <rect x="128" y="86" width="6" height="6" />
                  <rect x="142" y="80" width="6" height="6" />
                  <rect x="120" y="100" width="6" height="6" />
                  <rect x="136" y="106" width="6" height="6" />
                  <rect x="60" y="116" width="6" height="6" />
                  <rect x="76" y="122" width="6" height="6" />
                  <rect x="90" y="116" width="6" height="6" />
                  <rect x="104" y="122" width="6" height="6" />
                  <rect x="66" y="136" width="6" height="6" />
                  <rect x="82" y="142" width="6" height="6" />
                  <rect x="96" y="136" width="6" height="6" />
                  <rect x="120" y="136" width="6" height="6" />
                  <rect x="134" y="142" width="6" height="6" />
                  <rect x="148" y="136" width="6" height="6" />
                </g>
              </svg>
            </div>
          </div>

          <div className="text-center">
            <span className="font-mono text-[20px] font-bold text-[var(--color-brand)]">
              199,000 ₫
            </span>
            <span className="text-[12px] text-[var(--color-text-muted)] block mt-0.5">
              Pro Plan (1 Month Subscription)
            </span>
          </div>
        </div>

        {/* Bank Details Table */}
        <div className="bg-[var(--color-canvas)] border border-[var(--color-border-default)] rounded-[var(--radius-base)] p-3 space-y-2 mb-3">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[var(--color-text-muted)]">Bank</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              Vietcombank (VCB) - CN Tân Bình
            </span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[var(--color-text-muted)]">Account Name</span>
            <span className="font-semibold text-[var(--color-text-primary)]">
              CONG TY FITSYNC VIETNAM
            </span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-[var(--color-text-muted)]">Account Number</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-[var(--color-text-primary)]">
                {accountNumber}
              </span>
              <button
                onClick={handleCopyAccount}
                className="p-1 hover:bg-slate-200 rounded text-[var(--color-text-secondary)] border-none bg-transparent cursor-pointer"
                title="Copy account number"
              >
                {copiedAccount ? <CheckCircle2 size={12} className="text-emerald-600" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Transfer Memo */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 p-2.5 bg-[var(--color-canvas)] border border-[var(--color-border-default)] rounded-[var(--radius-base)]">
            <p className="text-[11px] text-[var(--color-text-muted)] mb-0.5 font-medium uppercase tracking-wider">
              Transfer Memo (Nội dung CK)
            </p>
            <p className="font-mono text-[13px] font-semibold text-[var(--color-brand)]">{memo}</p>
          </div>
          <button
            onClick={handleCopyMemo}
            className="btn-secondary h-[44px] px-3.5"
          >
            {copiedMemo ? <CheckCircle2 size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span className="text-[12px]">{copiedMemo ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 justify-center text-[11px] text-[var(--color-text-muted)]">
          <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
          <span>Automated 24/7 activation. System activates within 30-60 seconds after transfer.</span>
        </div>
      </div>
    </div>
  );
}

function EnterpriseContactModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enterprise-modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/40"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => (e.key === 'Escape' || e.key === 'Enter') && onClose()}
        aria-label="Close dialog overlay"
      />
      <div className="modal-content relative z-10 max-w-[440px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 id="enterprise-modal-title" className="text-[17px] font-semibold">Enterprise Studio Plan</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 hover:bg-[var(--color-canvas)] rounded-[var(--radius-base)] transition-colors border-none bg-transparent cursor-pointer"
          >
            <X size={18} className="text-[var(--color-text-muted)]" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={20} className="text-emerald-600" />
            </div>
            <p className="text-[15px] font-semibold mb-1">Inquiry Received</p>
            <p className="text-[13px] text-[var(--color-text-secondary)] mb-4">
              Our B2B enterprise specialist will reach out to you within 2 hours.
            </p>
            <button className="btn-primary w-full" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-3"
          >
            <div>
              <label htmlFor="ent-studio-name" className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer">
                Studio / Gym Name
              </label>
              <input id="ent-studio-name" name="studioName" className="input" placeholder="e.g. Apex Private Fitness" required />
            </div>
            <div>
              <label htmlFor="ent-contact" className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer">
                Contact Person &amp; Zalo Phone
              </label>
              <input id="ent-contact" name="contactPerson" className="input" placeholder="e.g. Hoàng Tuấn - 0988 123 456" required />
            </div>
            <div>
              <label htmlFor="ent-coaches" className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-1 cursor-pointer">
                Number of Coaches / Locations
              </label>
              <select id="ent-coaches" name="coachesCount" className="input cursor-pointer" required>
                <option value="3-5">3 to 5 Coaches (1 Location)</option>
                <option value="6-15">6 to 15 Coaches (2-3 Locations)</option>
                <option value="15+">15+ Coaches (Multi-city Chain)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full mt-2">
              Request Studio Demo &amp; Quote
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
