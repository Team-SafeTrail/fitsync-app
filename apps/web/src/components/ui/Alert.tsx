import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./ui.module.css";

export type AlertTone = "info" | "success" | "warning" | "danger";

type AlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: AlertTone;
  title?: string;
  icon?: ReactNode;
};

export function Alert({ className, tone = "info", title, icon, children, role, ...props }: AlertProps) {
  return (
    <div
      className={cn(styles.alert, styles[`alert-${tone}`], className)}
      role={role ?? (tone === "danger" ? "alert" : "status")}
      {...props}
    >
      {icon ? <span className={styles.alertIcon} aria-hidden="true">{icon}</span> : null}
      <div>
        {title ? <p className={styles.alertTitle}>{title}</p> : null}
        <div className={styles.alertBody}>{children}</div>
      </div>
    </div>
  );
}
