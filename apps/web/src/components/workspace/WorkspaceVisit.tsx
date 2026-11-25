"use client";
import { useEffect } from "react";
import { recordWorkspaceVisit } from "@/features/billing/actions";

export default function WorkspaceVisit() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void recordWorkspaceVisit().catch(() => {});
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
