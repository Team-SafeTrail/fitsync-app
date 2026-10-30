import type { Metadata } from "next";
import CoachingLanding from "@/components/coaching/CoachingLanding";
import "./coaching.css";

export const metadata: Metadata = {
  title: "FitSync | Cùng tập. Cùng tiến xa.",
  description: "Không gian làm việc cho PT và học viên: hồ sơ, chỉ số đã xác nhận và theo dõi hoạt động. Khám phá FitSync và bản mẫu được ghi nhãn rõ ràng.",
  openGraph: {title:"FitSync | Cùng tập. Cùng tiến xa.",description:"Một nơi để PT hiểu học viên hơn.",locale:"vi_VN",type:"website"},
};

export default function LandingPage() { return <CoachingLanding />; }
