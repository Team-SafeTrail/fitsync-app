import type { SVGProps } from "react";

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 40 32" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" aria-hidden="true" {...props}><path d="M23 6h-7a10 10 0 0 0 0 20h1M17 6h7a10 10 0 0 1 0 20h-1M14 16h12" /></svg>;
}

export default function Brand({ className = "" }: { className?: string }) {
  return <span className={`coaching-brand ${className}`}><BrandMark /><span>fitsync</span></span>;
}
