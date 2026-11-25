"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  idle,
  pending,
  icon,
  className = "workspace-button workspace-button-primary",
}: {
  idle: string;
  pending: string;
  icon?: ReactNode;
  className?: string;
}) {
  const status = useFormStatus();
  return (
    <button className={className} type="submit" disabled={status.pending}>
      {!status.pending && icon}
      {status.pending ? pending : idle}
    </button>
  );
}
