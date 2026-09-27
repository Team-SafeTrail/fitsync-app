"use client";

import { ArrowRight, Plus } from "lucide-react";

export default function OpenCreateTraineeButton({ compact = false }: { compact?: boolean }) {
  function openForm() {
    window.dispatchEvent(new Event("fitsync:open-trainee-form"));
    document.getElementById("new-trainee")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (compact) {
    return <button className="workspace-inline-link" type="button" onClick={openForm}>Mở biểu mẫu <ArrowRight size={15} /></button>;
  }

  return <button className="workspace-button workspace-button-primary workspace-heading-action" type="button" onClick={openForm}><Plus size={16} /> Thêm học viên</button>;
}
