import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitSync — Less Admin. More Coaching.",
  description:
    "AI-powered CRM & InBody Scanner for Vietnamese Personal Trainers. Digitize paper InBody sheets into structured macro nutrition plans in under 60 seconds.",
  keywords: [
    "FitSync",
    "Personal Trainer CRM",
    "InBody Scanner",
    "Fitness CRM Vietnam",
    "AI OCR",
    "Macro Nutrition",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-white focus:text-[var(--color-brand)] focus:border focus:border-[var(--color-brand)] focus:rounded-md focus:shadow-md"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
