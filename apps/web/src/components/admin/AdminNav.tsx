"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  Users,
  CreditCard,
} from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      href: "/admin",
      label: "Tổng quan KPI",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      href: "/admin/finance",
      label: "Tài chính thực tế",
      icon: CheckCircle2,
      isActive: pathname === "/admin/finance",
    },
    {
      href: "/admin/users",
      label: "Tài khoản hệ thống",
      icon: Users,
      isActive: pathname === "/admin/users",
    },
    {
      href: "/admin/transactions",
      label: "Sổ thu chi & chứng từ",
      icon: CreditCard,
      isActive: pathname === "/admin/transactions",
    },
  ];

  // Prime router cache for instant switching
  useEffect(() => {
    const timer = setTimeout(() => {
      for (const item of navItems) {
        if (!item.isActive) {
          router.prefetch(item.href);
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname, router]);

  return (
    <nav className="admin-nav" aria-label="Menu quản trị">
      {navItems.map(({ href, label, icon: Icon, isActive }) => (
        <Link
          key={href}
          href={href}
          prefetch={true}
          onMouseEnter={() => router.prefetch(href)}
          className={`admin-nav-item${isActive ? " active" : ""}`}
          aria-current={isActive ? "page" : undefined}
        >
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
