"use client";
import Link from "next/link";
export default function CalendarError({reset}:{reset:()=>void}) {
  return <main id="main-content" className="workspace-main"><h1>Chưa mở được lịch</h1><p>Hãy kiểm tra kết nối rồi thử lại. Nếu vừa đặt lịch, hãy kiểm tra lịch trước khi gửi lại.</p><button type="button" className="workspace-button" onClick={reset}>Thử tải lại</button><Link href="/workspace">Về workspace</Link></main>;
}
