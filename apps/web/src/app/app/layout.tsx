'use client';

import { AppProvider, useApp } from '@/lib/context';
import AppSidebar from '@/components/app/AppSidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutDashboard, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import './tour.css';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useApp();
  const pathname = usePathname();

  return (
    <div className="fs-tour-shell min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Mobile Top Navbar */}
      <header className="fs-tour-mobile-header md:hidden fixed top-0 left-0 right-0 h-16 border-b border-[var(--color-border-default)] px-4 flex items-center justify-between z-30">
        <Link href="/" aria-label="FitSync, về trang giới thiệu" className="flex min-h-11 items-center gap-2 no-underline">
          <div className="w-7 h-7 bg-[var(--color-brand)] rounded-[var(--radius-base)] flex items-center justify-center">
            <Activity size={16} className="text-[var(--color-brand-foreground)]" />
          </div>
          <span className="text-[16px] font-bold text-[var(--color-text-primary)]">
            fitsync
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="fs-tour-sample-pill">Bản mẫu</span>
          <div className="w-9 h-9 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
            <User size={14} className="text-[var(--color-text-muted)]" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={cn(
          'fs-tour-main min-h-screen transition-[margin] duration-200 pt-16 md:pt-0 pb-20 md:pb-0',
          sidebarCollapsed ? 'md:ml-[76px]' : 'md:ml-[260px]'
        )}
      >
        <div className="fs-tour-disclosure min-h-12 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border-accent)] bg-[var(--color-brand-light)] text-[12px] sm:text-[13px]">
          <span><strong>Bản mẫu công khai</strong><span aria-hidden="true"> · </span>Dữ liệu minh họa, chỉ tồn tại trong phiên xem này.</span>
          <Link href="/register" className="font-semibold no-underline">Tạo workspace PT <span aria-hidden="true">→</span></Link>
        </div>
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Chuyển góc nhìn bản mẫu" className="fs-tour-mobile-nav md:hidden fixed bottom-0 left-0 right-0 h-[68px] border-t border-[var(--color-border-default)] flex items-center justify-around z-30 px-2">
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
          <span>Góc nhìn PT</span>
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
          <span>Góc nhìn học viên</span>
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
