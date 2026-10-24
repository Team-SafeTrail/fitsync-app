"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./Button";
import styles from "./ui.module.css";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  initialFocusRef?: RefObject<HTMLElement>;
  closeLabel?: string;
  dismissible?: boolean;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  initialFocusRef,
  closeLabel = "Đóng",
  dismissible = true,
  className,
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onOpenChangeRef = useRef(onOpenChange);
  const [mounted, setMounted] = useState(false);
  const [present, setPresent] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { onOpenChangeRef.current = onOpenChange; }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setPresent(true);
      setClosing(false);
      return;
    }
    if (!present) return;
    setClosing(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setPresent(false), reducedMotion ? 0 : 160);
    return () => window.clearTimeout(timeout);
  }, [open, present]);

  useEffect(() => {
    if (!open || !present) return;

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const backgroundElements = Array.from(document.body.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement && element !== portalRef.current && !element.inert,
    );
    backgroundElements.forEach((element) => { element.inert = true; });

    const focusDialog = window.requestAnimationFrame(() => {
      const target = initialFocusRef?.current
        ?? dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ?? dialogRef.current;
      target?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && dismissible) {
        event.preventDefault();
        onOpenChangeRef.current(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusDialog);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach((element) => { element.inert = false; });
      returnFocusRef.current?.focus();
    };
  }, [dismissible, initialFocusRef, open, present]);

  if (!mounted || !present) return null;

  return createPortal(
    <div
      ref={portalRef}
      className={cn(styles.dialogOverlay, closing && styles.dialogClosing)}
      aria-hidden={closing || undefined}
      onPointerDown={(event) => {
        if (dismissible && event.target === event.currentTarget) onOpenChangeRef.current(false);
      }}
    >
      <div
        ref={dialogRef}
        className={cn(styles.dialog, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <header className={styles.dialogHeader}>
          <div>
            <h2 id={titleId} className={styles.dialogTitle}>{title}</h2>
            {description ? <p id={descriptionId} className={styles.dialogDescription}>{description}</p> : null}
          </div>
          {dismissible ? (
            <IconButton label={closeLabel} onClick={() => onOpenChangeRef.current(false)}>
              <X size={20} aria-hidden="true" />
            </IconButton>
          ) : null}
        </header>
        <div className={styles.dialogBody}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
