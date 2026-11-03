import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./auth.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitSync | Bớt việc quản lý. Thêm giờ huấn luyện.",
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
  colorScheme: "dark",
  themeColor: "#101113",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased font-sans grain-overlay">
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
