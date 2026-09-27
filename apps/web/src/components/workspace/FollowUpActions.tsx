"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

export default function FollowUpActions({ message, zaloUrl }: { message: string; zaloUrl: string | null }) {
  const [copied, setCopied] = useState(false);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = message;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="workspace-followup-actions">
      <button className="workspace-button workspace-button-primary" type="button" onClick={copyMessage} data-testid="copy-followup">
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Đã sao chép" : "Sao chép tin nhắn"}
      </button>
      {zaloUrl ? (
        <a className="workspace-button workspace-button-secondary" href={zaloUrl} target="_blank" rel="noreferrer" data-testid="open-zalo">
          <ExternalLink size={16} /> Mở Zalo có chủ đích
        </a>
      ) : <span className="workspace-muted-copy">Thêm số điện thoại để mở Zalo.</span>}
    </div>
  );
}
