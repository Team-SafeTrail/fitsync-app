import {
  cloneElement,
  forwardRef,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import styles from "./ui.module.css";

type FieldControlProps = {
  id?: string;
  required?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactElement<FieldControlProps>;
  className?: string;
};

export function Field({ id, label, hint, error, required = false, children, className }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [children.props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn(styles.field, className)}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
        {required ? <span className={styles.required} aria-hidden="true">*</span> : null}
      </label>
      {cloneElement(children, {
        id,
        required: required || children.props.required,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}
      {hint ? <p id={hintId} className={styles.fieldHint}>{hint}</p> : null}
      {error ? <p id={errorId} className={styles.fieldError} role="alert">{error}</p> : null}
    </div>
  );
}

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  leading?: ReactNode;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { className, leading, ...props },
  ref,
) {
  if (!leading) {
    return <input ref={ref} className={cn(styles.control, className)} {...props} />;
  }

  return (
    <span className={styles.controlWithLeading}>
      <span className={styles.controlLeading} aria-hidden="true">{leading}</span>
      <input ref={ref} className={cn(styles.control, styles.controlHasLeading, className)} {...props} />
    </span>
  );
});
