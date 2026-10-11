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
  { href: '/app/dashboard', label: 'Góc nhìn PT', icon: LayoutDashboard },
  { href: '/app/trainee', label: 'Góc nhìn học viên', icon: Users },
];

export default function AppSidebar() {
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useApp();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fs-tour-sidebar fixed left-0 top-0 bottom-0 border-r border-[var(--color-border-default)] z-30 hidden md:flex flex-col transition-[width] duration-200',
        collapsed ? 'w-[76px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="h-[72px] flex items-center gap-2 px-4 border-b border-[var(--color-border-default)] shrink-0">
        <Link href="/" aria-label="FitSync, về trang giới thiệu" className="flex min-h-11 items-center gap-2 no-underline">
          <div className="w-9 h-9 bg-[var(--color-brand)] rounded-[var(--radius-base)] flex items-center justify-center shrink-0">
            <Activity size={18} className="text-[var(--color-brand-foreground)]" />
          </div>
          {!collapsed && (
            <span className="text-[16px] font-bold tracking-tight text-[var(--color-text-primary)]">
              fitsync
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav aria-label="Góc nhìn bản mẫu" className="flex-1 py-4 px-3 space-y-2">
        {!collapsed && <p className="fs-tour-nav-label">BẢN MẪU CÔNG KHAI</p>}
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 h-12 rounded-[var(--radius-base)] transition-colors no-underline',
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
          aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-[var(--radius-base)] text-[var(--color-text-muted)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-text-secondary)] transition-colors border-none bg-transparent cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && (
            <span className="text-[12px]">Thu gọn</span>
          )}
        </button>
      </div>

      {/* Coach Profile */}
      <div className="p-3 border-t border-[var(--color-border-default)]">
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[var(--color-brand-light)] border border-[var(--color-border-accent)] flex items-center justify-center shrink-0">
            <User size={14} className="text-[var(--color-text-muted)]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">
                Coach Nam
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Dữ liệu mẫu
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
