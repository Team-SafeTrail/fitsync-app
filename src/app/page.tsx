import LandingNav from '@/components/landing/LandingNav';
import HeroSection from '@/components/landing/HeroSection';
import OCRDemoSection from '@/components/landing/OCRDemoSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ROICalculator from '@/components/landing/ROICalculator';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <OCRDemoSection />
        <ROICalculator />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
