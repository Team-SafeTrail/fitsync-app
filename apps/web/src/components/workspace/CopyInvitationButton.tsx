"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyInvitationButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copyInvitation() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      const input = document.getElementById("created-invitation") as HTMLInputElement | null;
      input?.focus();
      input?.select();
      if (!input || !document.execCommand("copy")) return;
      setCopied(true);
    }
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <button className="workspace-button workspace-button-primary" type="button" onClick={copyInvitation}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Đã sao chép" : "Sao chép link"}
    </button>
  );
}
