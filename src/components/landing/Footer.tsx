import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border-default)] bg-white py-8 px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--color-brand)] rounded-[var(--radius-sm)] flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">
            FitSync
          </span>
          <span className="text-[12px] text-[var(--color-text-muted)]">
            by SafeTrail • EXE202
          </span>
        </div>
        <p className="text-[12px] text-[var(--color-text-muted)]">
          © 2026 SafeTrail. Less Admin. More Coaching.
        </p>
      </div>
    </footer>
  );
}
