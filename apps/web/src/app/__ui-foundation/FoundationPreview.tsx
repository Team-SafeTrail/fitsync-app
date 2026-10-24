"use client";

import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, LoaderCircle, Mail, Users } from "lucide-react";
import { Alert, Button, Dialog, Field, FileUpload, StatePanel, TextInput } from "@/components/ui";
import styles from "./preview.module.css";

type Theme = "system" | "light" | "dark";

export default function FoundationPreview() {
  const [theme, setTheme] = useState<Theme>("system");
  const [dialogOpen, setDialogOpen] = useState(false);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  return (
    <main
      id="main-content"
      className={`fs-ui-theme ${styles.preview}`}
      data-theme={theme === "system" ? undefined : theme}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>FitSync Adaptive Interface v4.0</p>
            <h1>Nền tảng rõ ràng cho từng quyết định huấn luyện.</h1>
            <p className={styles.lead}>Trang thử nghiệm nội bộ cho token, trạng thái và tương tác dùng chung. Không chứa dữ liệu người dùng.</p>
          </div>
          <div className={styles.themeControl} aria-label="Chế độ màu">
            {(["system", "light", "dark"] as const).map((value) => (
              <Button
                key={value}
                variant={theme === value ? "primary" : "secondary"}
                aria-pressed={theme === value}
                onClick={() => setTheme(value)}
              >
                {value === "system" ? "Hệ thống" : value === "light" ? "Sáng" : "Tối"}
              </Button>
            ))}
          </div>
        </header>

        <section className={styles.section} aria-labelledby="actions-title">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>Hành động</p>
            <h2 id="actions-title">Phản hồi ngay, không phô trương.</h2>
          </div>
          <div className={styles.row}>
            <Button onClick={() => setDialogOpen(true)}>Mở tác vụ mẫu</Button>
            <Button variant="secondary">Hành động phụ</Button>
            <Button variant="ghost">Xem chi tiết</Button>
            <Button variant="danger">Xóa bản nháp</Button>
            <Button disabled>Đang xử lý</Button>
          </div>
        </section>

        <section className={styles.twoColumn} aria-label="Trường nhập và trạng thái">
          <div className={styles.panel}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Trường nhập</p>
              <h2>Luôn có nhãn và hướng dẫn.</h2>
            </div>
            <div className={styles.stack}>
              <Field id="preview-email" label="Email học viên" hint="FitSync chỉ dùng địa chỉ này để tạo lời mời bảo mật." required>
                <TextInput type="email" placeholder="hocvien@example.test" leading={<Mail size={18} />} />
              </Field>
              <Field id="preview-error" label="Số buổi còn lại" error="Số buổi còn lại không thể lớn hơn tổng số buổi.">
                <TextInput type="number" defaultValue="14" />
              </Field>
              <FileUpload
                label="Phiếu InBody thử nghiệm"
                hint="JPG, PNG hoặc WEBP. OCR luôn là bản nháp cần PT xác nhận."
                accept="image/jpeg,image/png,image/webp"
              />
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.sectionHeading}>
              <p className={styles.eyebrow}>Phản hồi hệ thống</p>
              <h2>Nói rõ điều gì vừa xảy ra.</h2>
            </div>
            <div className={styles.stack}>
              <Alert tone="success" title="Đã lưu bản ghi" icon={<CheckCircle2 size={19} />}>Năm chỉ số đã được PT đối chiếu và xác nhận.</Alert>
              <Alert tone="warning" title="Cần xem lại" icon={<AlertTriangle size={19} />}>Khối mỡ và tỷ lệ mỡ đang chênh lệch ngoài giới hạn.</Alert>
              <Alert tone="info" title="Dữ liệu mẫu" icon={<Info size={19} />}>Nội dung này không được lưu vào workspace thật.</Alert>
            </div>
          </div>
        </section>

        <section className={styles.stateGrid} aria-label="Trạng thái nội dung">
          <StatePanel
            kind="empty"
            title="Chưa có học viên"
            description="Tạo hồ sơ đầu tiên để gửi lời mời bảo mật."
            icon={<Users size={24} />}
            action={{ label: "Tạo học viên", onClick: () => setDialogOpen(true) }}
          />
          <StatePanel
            kind="loading"
            title="Đang tải dữ liệu"
            description="FitSync đang lấy thông tin workspace mới nhất."
            icon={<LoaderCircle size={24} />}
          />
          <StatePanel
            kind="recoverable-error"
            title="Chưa thể xử lý ảnh"
            description="Bạn vẫn có thể nhập năm chỉ số theo cách thủ công."
            icon={<AlertTriangle size={24} />}
            action={{ label: "Nhập thủ công", onClick: () => undefined }}
          />
        </section>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Tạo học viên mẫu"
        description="Tác vụ này chỉ kiểm tra tương tác của dialog và không lưu dữ liệu."
        initialFocusRef={initialFocusRef}
      >
        <div className={styles.stack}>
          <Field id="dialog-trainee-name" label="Tên học viên" hint="Dùng tên mà PT nhận biết trong roster.">
            <TextInput ref={initialFocusRef} autoComplete="off" />
          </Field>
          <div className={styles.dialogActions}>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => setDialogOpen(false)}>Lưu học viên mẫu</Button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
