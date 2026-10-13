import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FoundationPreview from "../__ui-foundation/FoundationPreview";

export const metadata: Metadata = {
  title: "FitSync UI Foundation Preview",
  robots: { index: false, follow: false },
};

export default function FoundationPreviewPage() {
  if (process.env.NEXT_PUBLIC_E2E_TEST !== "true") notFound();
  return <FoundationPreview />;
}
