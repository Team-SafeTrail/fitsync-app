import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./Button";
import styles from "./ui.module.css";

export type StateKind = "empty" | "loading" | "recoverable-error" | "fatal-error";

type StateAction = {
  label: string;
  onClick: NonNullable<ButtonProps["onClick"]>;
};

type StatePanelProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  kind: StateKind;
  title: string;
  description: string;
  icon?: ReactNode;
  action?: StateAction;
};

export function StatePanel({
  kind,
  title,
  description,
  icon,
  action,
  className,
  ...props
}: StatePanelProps) {
  const isLoading = kind === "loading";
  const isFatal = kind === "fatal-error";
  const role = isFatal ? "alert" : isLoading || kind === "recoverable-error" ? "status" : undefined;

  return (
    <div
      className={cn(styles.statePanel, styles[`state-${kind}`], className)}
      aria-busy={isLoading || undefined}
      role={role}
      {...props}
    >
      {icon ? <span className={styles.stateIcon} aria-hidden="true">{icon}</span> : null}
      <div>
        <h3 className={styles.stateTitle}>{title}</h3>
        <p className={styles.stateDescription}>{description}</p>
      </div>
      {action && !isLoading ? (
        <Button variant={isFatal ? "secondary" : "primary"} onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
