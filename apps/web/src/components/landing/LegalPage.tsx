import Link from "next/link";
import { ArrowLeft, Activity } from "lucide-react";

type Section = {
  title: string;
  paragraphs: string[];
};

export default function LegalPage({
  title,
  updated,
  summary,
  sections,
}: {
  title: string;
  updated: string;
  summary: string;
  sections: Section[];
}) {
  return (
    <div className="fs-landing fs-legal-page">
      <header className="fs-legal-nav fs-container">
        <Link href="/" className="fs-brand" aria-label="FitSync, trang chủ">
          <Activity size={26} strokeWidth={2.5} aria-hidden="true" />
          <span>
            fit<span>sync</span>
          </span>
        </Link>
        <Link href="/" className="fs-text-link">
          <ArrowLeft size={16} aria-hidden="true" /> Trở về trang chủ
        </Link>
      </header>
      <main id="main-content" className="fs-container fs-legal-content">
        <p className="fs-eyebrow">THÔNG TIN BẢN MẪU</p>
        <h1>{title}</h1>
        <p className="fs-legal-updated">Cập nhật: {updated}</p>
        <p className="fs-legal-summary">{summary}</p>
        <div className="fs-legal-sections">
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
