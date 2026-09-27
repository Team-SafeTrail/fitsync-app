import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import OCRDemoSection from "@/components/landing/OCRDemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ROICalculator from "@/components/landing/ROICalculator";
import PricingSection from "@/components/landing/PricingSection";
import Footer, { ClosingSections } from "@/components/landing/Footer";
import SurveyEvidence from "@/components/landing/SurveyEvidence";
import ProductScope from "@/components/landing/ProductScope";
import VerifiedWorkflowSection from "@/components/landing/VerifiedWorkflowSection";
import "./landing.css";

export const metadata: Metadata = {
  title: "FitSync | Bớt việc quản lý. Thêm giờ huấn luyện.",
  description:
    "FitSync giúp PT Việt tạo hồ sơ, mời học viên và xác nhận chỉ số InBody trong một workspace được phân quyền rõ ràng.",
  openGraph: {
    title: "FitSync | Thêm thời gian đồng hành",
    description:
      "Từ lời mời học viên đến bản ghi InBody đã xác nhận trong cùng một workspace.",
    locale: "vi_VN",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="fs-landing">
      <LandingNav />
      <main id="main-content">
        <HeroSection />
        <VerifiedWorkflowSection />
        <FeaturesSection />
        <SurveyEvidence />
        <ProductScope />
        <OCRDemoSection />
        <PricingSection />
        <ROICalculator />
        <ClosingSections />
      </main>
      <Footer />
    </div>
  );
}
