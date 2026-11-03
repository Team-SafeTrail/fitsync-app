import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./auth.css";

const beVietnam = localFont({
  src: [
    { path: "./fonts/be-vietnam-pro-0.ttf", weight: "400", style: "normal" },
    { path: "./fonts/be-vietnam-pro-1.ttf", weight: "500", style: "normal" },
    { path: "./fonts/be-vietnam-pro-2.ttf", weight: "600", style: "normal" },
    { path: "./fonts/be-vietnam-pro-3.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitSync | Cùng tập. Cùng tiến xa.",
  description:
    "Workspace FitSync dành cho PT Việt: tạo hồ sơ, mời học viên và xác nhận chỉ số InBody trong một luồng được phân quyền.",
  keywords: [
    "FitSync",
    "Personal Trainer CRM",
    "InBody Records",
    "Fitness CRM Vietnam",
    "PT Workspace Vietnam",
    "Trainee Management",
  ],
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#143e38",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={beVietnam.variable}
    >
      <body className="antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-[var(--color-surface)] focus:text-[var(--color-brand)] focus:border focus:border-[var(--color-brand)] focus:rounded-md focus:shadow-md"
        >
          Bỏ qua đến nội dung chính
        </a>
        {children}
      </body>
    </html>
  );
}
