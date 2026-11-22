"use client";
import { useCallback, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

// A business validation result is still a successful Promise to React Actions.
// Keep input/file selections until our action explicitly confirms a saved result.
export function usePreservedForm() {
  const ref = useRef<HTMLFormElement>(null);
  const explicit = useRef(false);
  useEffect(() => {
    const form=ref.current;
    // React resets action forms during commit, when synthetic event dispatch is
    // disabled. A native listener must cancel that implicit reset as well.
    const preserve=(event:Event)=>{if(!explicit.current)event.preventDefault();};
    form?.addEventListener("reset",preserve);
    return ()=>form?.removeEventListener("reset",preserve);
  },[]);
  const onReset = useCallback((event: FormEvent<HTMLFormElement>) => {
    if (!explicit.current) event.preventDefault();
  }, []);
  const reset = useCallback(() => {
    explicit.current = true;
    try { ref.current?.reset(); } finally { explicit.current = false; }
  }, []);
  return { ref, onReset, reset };
}

export function PendingFields({ children, disabled=false }: { children: ReactNode; disabled?:boolean }) {
  const { pending } = useFormStatus();
  return <fieldset className="workspace-submit-fields" disabled={pending||disabled}>{children}</fieldset>;
}
