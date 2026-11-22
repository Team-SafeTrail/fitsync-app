"use client";
import { useEffect } from "react";
import { recordWorkspaceVisit } from "@/features/billing/actions";
export default function WorkspaceVisit() {
  useEffect(() => { void recordWorkspaceVisit().catch(() => {}); }, []);
  return null;
}
