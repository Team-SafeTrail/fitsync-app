'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context';
import {
  Activity,
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/trainee', label: 'Trainee Portal', icon: Users },
];

export default function AppSidebar() {
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useApp();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 bg-white border-r border-[var(--color-border-default)] z-30 hidden md:flex flex-col transition-[width] duration-200',
        collapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-[var(--color-border-default)] shrink-0">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-[var(--color-brand)] rounded-[var(--radius-base)] flex items-center justify-center shrink-0">
            <Activity size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-[16px] font-bold tracking-tight text-[var(--color-text-primary)]">
              FitSync
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 h-[38px] rounded-[var(--radius-base)] transition-colors no-underline',
                collapsed ? 'justify-center px-0' : 'px-3',
                active
                  ? 'bg-[var(--color-brand-light)] text-[var(--color-brand)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-text-primary)]'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-[13px] font-medium">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-[var(--color-border-default)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-[34px] flex items-center justify-center gap-2 rounded-[var(--radius-base)] text-[var(--color-text-muted)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-text-secondary)] transition-colors border-none bg-transparent cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && (
            <span className="text-[12px]">Collapse</span>
          )}
        </button>
      </div>

      {/* Coach Profile */}
      <div className="p-3 border-t border-[var(--color-border-default)]">
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center shrink-0">
            <User size={14} className="text-[var(--color-text-muted)]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">
                Coach Nam
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Pro Plan
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
