import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import OCRDemoSection from "@/components/landing/OCRDemoSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ROICalculator from "@/components/landing/ROICalculator";
import PricingSection from "@/components/landing/PricingSection";
import Footer, { ClosingSections } from "@/components/landing/Footer";
import SurveyEvidence from "@/components/landing/SurveyEvidence";
import ProgressJourney from "@/components/landing/ProgressJourney";
import ProductScope from "@/components/landing/ProductScope";
import "./landing.css";

export const metadata: Metadata = {
  title: "FitSync | Bớt việc quản lý. Thêm giờ huấn luyện.",
  description:
    "Khám phá FitSync: không gian quản lý học viên, theo dõi chỉ số và đồng hành mỗi ngày dành cho huấn luyện viên Việt Nam. Trải nghiệm bản mẫu tương tác.",
  openGraph: {
    title: "FitSync | Thêm thời gian đồng hành",
    description:
      "Từ phiếu InBody đến từng buổi tập. Khám phá không gian huấn luyện FitSync.",
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
        <SurveyEvidence />
        <OCRDemoSection />
        <FeaturesSection />
        <ProgressJourney />
        <ProductScope />
        <PricingSection />
        <ROICalculator />
        <ClosingSections />
      </main>
      <Footer />
    </div>
  );
}
