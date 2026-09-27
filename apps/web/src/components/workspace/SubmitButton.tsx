"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ idle, pending, className = "workspace-button workspace-button-primary" }: { idle: string; pending: string; className?: string }) {
  const status = useFormStatus();
  return (
    <button className={className} type="submit" disabled={status.pending}>
      {status.pending ? pending : idle}
    </button>
  );
}
