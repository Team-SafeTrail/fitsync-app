'use client';

import { AppProvider, useApp } from '@/lib/context';
import AppSidebar from '@/components/app/AppSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutDashboard, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useApp();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-canvas)]">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Mobile Top Navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[var(--color-border-default)] px-4 flex items-center justify-between z-30">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-7 h-7 bg-[var(--color-brand)] rounded-[var(--radius-base)] flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <span className="text-[16px] font-bold text-[var(--color-text-primary)]">
            FitSync
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">Coach Nam</span>
          <div className="w-7 h-7 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
            <User size={14} className="text-[var(--color-text-muted)]" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={cn(
          'min-h-screen transition-[margin] duration-200 pt-14 md:pt-0 pb-20 md:pb-0',
          sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[240px]'
        )}
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[var(--color-border-default)] flex items-center justify-around z-30 px-2">
        <Link
          href="/app/dashboard"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 w-1/2 h-full text-[11px] font-medium no-underline transition-colors',
            pathname === '/app/dashboard'
              ? 'text-[var(--color-brand)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          )}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/app/trainee"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 w-1/2 h-full text-[11px] font-medium no-underline transition-colors',
            pathname === '/app/trainee'
              ? 'text-[var(--color-brand)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
          )}
        >
          <Users size={18} />
          <span>Trainee Portal</span>
        </Link>
      </nav>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </AppProvider>
  );
}
