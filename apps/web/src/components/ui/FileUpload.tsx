"use client";

import { useId, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./ui.module.css";

type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> & {
  id?: string;
  label: string;
  hint: string;
  error?: string;
  actionLabel?: string;
};

export function FileUpload({
  id,
  label,
  hint,
  error,
  actionLabel = "Chọn tệp",
  className,
  onChange,
  ...props
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const hintId = `${inputId}-hint`;
  const errorId = error ? `${inputId}-error` : undefined;
  const [fileName, setFileName] = useState("Chưa chọn tệp");

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFileName(event.target.files?.[0]?.name ?? "Chưa chọn tệp");
    onChange?.(event);
  }

  return (
    <div className={cn(styles.field, className)}>
      <span id={labelId} className={styles.fieldLabel}>{label}</span>
      <label className={styles.fileUpload} htmlFor={inputId}>
        <input
          {...props}
          id={inputId}
          className={styles.visuallyHiddenInput}
          type="file"
          aria-labelledby={labelId}
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ")}
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
        />
        <span className={styles.fileAction}>
          <Upload size={18} aria-hidden="true" />
          {actionLabel}
        </span>
        <span className={styles.fileName}>{fileName}</span>
      </label>
      <p id={hintId} className={styles.fieldHint}>{hint}</p>
      {error ? <p id={errorId} className={styles.fieldError} role="alert">{error}</p> : null}
    </div>
  );
}
