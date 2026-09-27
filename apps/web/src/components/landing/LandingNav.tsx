"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Activity } from "lucide-react";

const links = [
  ["Sản phẩm", "#product"],
  ["Cách hoạt động", "#workflow"],
  ["Bằng chứng", "#evidence"],
  ["Câu hỏi", "#faq"],
];

export function Brand() {
  return (
    <Link href="/" className="fs-brand" aria-label="FitSync, trang chủ">
      <Activity size={26} strokeWidth={2.5} />
      <span>
        fit<span>sync</span>
      </span>
    </Link>
  );
}

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="fs-header">
      <nav className="fs-container fs-nav" aria-label="Điều hướng chính">
        <Brand />
        <div className="fs-nav-links">
          {links.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </div>
        <Link
          className="fs-button fs-button-small fs-nav-cta"
          href="/register"
        >
          Tạo workspace PT <ArrowUpRight size={15} />
        </Link>
        <button
          ref={toggle}
          className="fs-menu-button"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        {open && (
          <div id="mobile-navigation" className="fs-mobile-nav">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <Link href="/register" className="fs-button">
              Tạo workspace PT <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
