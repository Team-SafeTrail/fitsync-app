'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Activity } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'OCR Demo', href: '#demo' },
  { label: 'ROI Calculator', href: '#roi' },
  { label: 'Pricing', href: '#pricing' },
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 border-b border-[var(--color-border-default)]">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-[var(--color-brand)] rounded-[var(--radius-base)] flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight text-[var(--color-text-primary)]">
            FitSync
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
          <Link href="/app/dashboard" className="btn-primary text-[13px] h-[34px] no-underline">
            Open Dashboard
          </Link>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-1.5 rounded-[var(--radius-base)] hover:bg-[var(--color-canvas)] transition-colors border-none bg-transparent cursor-pointer"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border-default)] bg-white px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-[14px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/app/dashboard"
            className="btn-primary w-full text-center no-underline mt-2"
            onClick={() => setOpen(false)}
          >
            Open Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
}
