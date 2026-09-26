'use client';

import { ScanLine, Bell, Smartphone } from 'lucide-react';

const pillars = [
  {
    icon: <ScanLine size={22} />,
    title: 'AI InBody & Scale Scanner',
    description:
      'Upload any InBody 270/370/570 sheet or smart scale screenshot. Get instant biometric extraction with editable verification drawer — no manual data entry ever again.',
    accent: 'bg-[var(--color-brand-light)] text-[var(--color-brand)]',
    features: ['< 60s processing', '96%+ extraction accuracy', 'Manual override drawer'],
  },
  {
    icon: <Bell size={22} />,
    title: 'Smart PT Hub',
    description:
      'Your centralized command center. Red-flag alerts highlight clients missing check-ins for 3+ consecutive days. Session pack tracking with auto-renewal reminders.',
    accent: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
    features: ['3-day inactivity alerts', 'Session depletion tracker', 'Zalo nudge integration'],
  },
  {
    icon: <Smartphone size={22} />,
    title: 'Mobile PWA Trainee Portal',
    description:
      'Trainees get a dead-simple mobile experience: photo-based meal logging, daily calorie targets with Protein/Carb/Fat bars, and habit streak accountability.',
    accent: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
    features: ['Food photo logging', 'Habit streak tracking', 'Body recomp charts'],
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 px-6 bg-[var(--color-canvas)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-10">
          <span className="section-caption text-[var(--color-brand)] mb-2 block">
            Core Platform
          </span>
          <h2 className="text-[28px] font-bold tracking-[-0.02em] text-[var(--color-text-primary)] mb-3">
            Three Pillars. One Unified System.
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[500px] mx-auto">
            Everything a Vietnamese PT needs to run a modern, scalable coaching practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="card hover:shadow-[var(--shadow-sm)] transition-shadow"
            >
              <div className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4 ${pillar.accent}`}>
                {pillar.icon}
              </div>
              <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-2">
                {pillar.title}
              </h3>
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-[20px] mb-4">
                {pillar.description}
              </p>
              <ul className="space-y-1.5">
                {pillar.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-[12px] text-[var(--color-text-muted)]"
                  >
                    <div className="w-1 h-1 rounded-full bg-[var(--color-border-strong)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
