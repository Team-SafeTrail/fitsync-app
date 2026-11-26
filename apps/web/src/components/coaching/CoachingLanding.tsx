"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, CheckCircle2, MessageSquareText, UsersRound } from "lucide-react";
import { BrandMark } from "@/components/brand/Brand";
import WeightPlot from "./WeightPlot";
import { IntakeJourney, CapabilityStatus, ResearchSnapshot, TeamDetails, CoachingOffer } from "./LandingContext";
import ReportSample from "./ReportSample";

type Sheet = "appointment" | "report" | "chat" | null;

export default function CoachingLanding() {
  const [role, setRole] = useState<"pt" | "trainee">("pt");
  const [sheet, setSheet] = useState<Sheet>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (sheet) {
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
      dialog.querySelector<HTMLButtonElement>("[data-close]")?.focus({ preventScroll: true });
    } else if (dialog.open) dialog.close();
  }, [sheet]);
  function openSheet(kind: NonNullable<Sheet>, opener: HTMLButtonElement) {
    if (!dialogRef.current?.open) openerRef.current = opener;
    setSheet(kind);
  }
  function closeSheet() {
    dialogRef.current?.close();
    setSheet(null);
    openerRef.current?.focus({ preventScroll: true });
  }
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const nodes = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled)")).filter(el => el.getClientRects().length);
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return (
    <div className="coaching-site">
      <main id="main-content">
        <section className="hero fs-hero compact-hero" aria-labelledby="hero-title">
          <Image className="hero-photo" src="/images/coaching-afternoon.webp" alt="Minh họa AI: PT và học viên trò chuyện giữa buổi tập trong một phòng gym Việt Nam" fill priority sizes="100vw" />
          <div className="hero-shade"></div>
          <header className="navigation">
            <Link className="brand" href="#" aria-label="FitSync, đầu trang"><BrandMark /><span>fitsync</span></Link>
            <nav aria-label="Điều hướng chính">
              <Link href="#bat-dau">Quy trình</Link>
              <Link href="#ho-so">Không gian PT</Link>
              <Link href="#du-lieu">Phiếu đo</Link>
              <Link href="#thong-tin">Hỏi đáp</Link>
            </nav>
            <div className="nav-actions-group">
              <Link className="nav-action is-register" href="/register">Đăng ký</Link>
              <Link className="nav-action is-login" href="/login">Đăng nhập</Link>
            </div>
          </header>
          <div className="hero-copy compact-hero-copy">
            <h1 id="hero-title">Cùng tập.<br />Cùng tiến xa.</h1>
            <p>Quản lý hồ sơ, chỉ số InBody, lịch hẹn và check-in học viên trong một không gian gọn nhẹ.</p>
          </div>
          <div className="appointment-peek arrive" data-ui>
            <div className="peek-top"><span className="linked-dot" aria-hidden="true"></span><span data-peek-title>Lịch mẫu · Xem nhanh</span><span className="live-mark" aria-hidden="true"></span></div>
            <div className="peek-main">
              <div className="date-stamp"><span>Tháng 10</span><strong>30</strong></div>
              <div><p>Khánh Linh &amp; PT Anh Nam</p><strong>16:00 <span>Buổi tập cùng PT</span></strong><span>60 phút · Đã xác nhận</span></div>
            </div>
          </div>
        </section>

        <section className="wrap landing-pillars" aria-label="Tính năng chính">
          <article className="pillar-tile">
            <span className="pillar-icon"><UsersRound size={20} /></span>
            <h3>Hồ sơ &amp; InBody</h3>
            <p>Mời học viên một lần, lưu biểu đồ 5 chỉ số đã xác nhận.</p>
          </article>
          <article className="pillar-tile">
            <span className="pillar-icon"><CalendarDays size={20} /></span>
            <h3>Lịch hẹn &amp; Số buổi</h3>
            <p>Đổi lịch có xác nhận hai chiều, sổ buổi rõ ràng.</p>
          </article>
          <article className="pillar-tile">
            <span className="pillar-icon"><CheckCircle2 size={20} /></span>
            <h3>Check-in hằng ngày</h3>
            <p>Ghi nhận bữa ăn riêng tư, nhắc khi quá 3 ngày vắng mặt.</p>
          </article>
          <article className="pillar-tile">
            <span className="pillar-icon"><MessageSquareText size={20} /></span>
            <h3>Chat &amp; Ghi chú</h3>
            <p>Trao đổi tập trung, tách riêng ghi chú nội bộ PT và học viên.</p>
          </article>
        </section>

        <IntakeJourney />

        <section className="profile-section compact-profile wrap" id="ho-so" aria-labelledby="profile-heading">
          <div className="section-heading">
            <div>
              <span className="landing-kicker">Trải nghiệm thực tế</span>
              <h2 id="profile-heading">Một người. Đủ ngữ cảnh.</h2>
            </div>
            <div className="role-control" role="group" aria-label="Chọn góc nhìn">
              <button data-role="pt" aria-pressed={role === "pt"} onClick={() => setRole("pt")}>Huấn luyện viên</button>
              <button data-role="trainee" aria-pressed={role === "trainee"} onClick={() => setRole("trainee")}>Học viên</button>
            </div>
          </div>
          <div className={role === "pt" ? "profile-surface" : "profile-surface learner-surface"} data-ui>
            <aside className="profile-rail" hidden={role !== "pt"}>
              <span className="rail-title">Học viên</span>
              <span className="rail-person selected"><span className="avatar">KL</span><span>Khánh Linh<small>Hôm nay · 16:00</small></span></span>
              <span className="rail-person"><span className="avatar">MK</span><span>Minh Khoa<small>Buổi PT · 09:00</small></span></span>
              <span className="rail-person"><span className="avatar">HN</span><span>Hoàng Nam<small>Tư vấn · 17:30</small></span></span>
            </aside>
            <article className="dossier">
              <header className="person-heading">
                <div className="person-name">
                  <span className="large-avatar">KL</span>
                  <div>
                    <p data-role-label>{role === "pt" ? "Không gian PT" : "Không gian học viên"}</p>
                    <h3>Khánh Linh</h3>
                    <span>Giảm mỡ · Giữ nhịp tập đều</span>
                  </div>
                </div>
              </header>
              <div className="profile-body">
                <div className="history">
                  <section className="history-entry current">
                    <div className="entry-mark"><span className="linked-dot" aria-hidden="true"></span></div>
                    <div className="entry-content">
                      <p className="entry-date">Hôm nay, 30 tháng 10</p>
                      <div className="session-row">
                        <span><strong>16:00</strong><small>60 phút</small></span>
                        <span><strong>Buổi tập cùng PT Anh Nam</strong><small>Đã xác nhận</small></span>
                      </div>
                    </div>
                  </section>
                  <section className="history-entry">
                    <div className="entry-mark"><span className="history-dot" aria-hidden="true"></span></div>
                    <div className="entry-content">
                      <div className="entry-date"><span>Lần đo 23/10</span><span className="verified">PT đã xác nhận</span></div>
                      <dl className="measurement-row">
                        <div><dt>Cân nặng</dt><dd>70,4 <span>kg</span></dd></div>
                        <div><dt>Cơ xương</dt><dd>30,2 <span>kg</span></dd></div>
                        <div><dt>Tỷ lệ mỡ</dt><dd>29,0 <span>%</span></dd></div>
                      </dl>
                      <div className="progress-plot">
                        <div className="plot-heading"><h4>Cân nặng</h4><span>Tháng 10 · kg</span></div>
                        <WeightPlot />
                      </div>
                    </div>
                  </section>
                </div>
                <aside className="context">
                  <section className="context-note" data-pt-only hidden={role !== "pt"}>
                    <div className="note-caption"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4" /></svg><span>Nội bộ PT</span></div>
                    <h4>Nhớ trước buổi tập</h4>
                    <p>Giảm tải phần cuối, kiểm tra mức độ thoải mái.</p>
                  </section>
                  <section className="context-note shared" data-trainee-only hidden={role !== "trainee"}>
                    <div className="note-caption"><span>Từ PT Anh Nam</span></div>
                    <h4>Giữ nhịp của bạn</h4>
                    <p>Nhắn PT nếu lịch sinh hoạt thay đổi nhé.</p>
                  </section>
                  <section className="package">
                    <div><p>Gói PT</p><strong>8 <span>/ 12 buổi</span></strong></div>
                    <div className="session-ticks" role="img" aria-label="4 buổi đã dùng, 8 buổi còn lại"><i className="used"></i><i className="used"></i><i className="used"></i><i className="used"></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                    <p>Membership đến 31/12/2026</p>
                  </section>
                  <div className="conversation">
                    <span className="tiny-avatar">AN</span>
                    <p>“Chiều nay gặp lúc 16:00 nhé.”</p>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        </section>

        <section className="data-section compact-data" id="du-lieu" aria-labelledby="data-heading">
          <div className="wrap data-layout">
            <div className="data-copy">
              <span className="linked-emblem" aria-hidden="true"><svg viewBox="0 0 40 32"><path d="M23 6h-7a10 10 0 0 0 0 20h1M17 6h7a10 10 0 0 1 0 20h-1M14 16h12" /></svg></span>
              <h2 id="data-heading">Số đo có nguồn.<br />Đối chiếu trước khi lưu.</h2>
              <p>Chỉ số luôn được PT kiểm tra đơn vị và xác nhận trước khi hiển thị cho học viên.</p>
            </div>
            <div className="document-scene" data-ui>
              <div className="source-page">
                <div className="source-header"><span>Phiếu đo mẫu</span><span>30/10/2026</span></div>
                <h3>Khánh Linh</h3>
                <dl>
                  <div><dt>Cân nặng</dt><dd>70,4 kg</dd></div>
                  <div><dt>Cơ xương</dt><dd>30,2 kg</dd></div>
                  <div><dt>Khối mỡ</dt><dd>20,4 kg</dd></div>
                  <div><dt>Tỷ lệ mỡ</dt><dd>29,0 %</dd></div>
                </dl>
              </div>
              <div className="draft-label"><span className="linked-dot" aria-hidden="true"></span><div><strong>Chờ PT duyệt</strong><p>Tách riêng bản nháp và dữ liệu chính.</p></div></div>
            </div>
          </div>
        </section>

        <CoachingOffer />
        <CapabilityStatus />
        <ResearchSnapshot />

        <section className="landing-readiness compact-faq wrap" id="thong-tin" aria-labelledby="readiness-heading">
          <div className="readiness-layout">
            <div>
              <span className="landing-kicker">Hỏi đáp</span>
              <h2 id="readiness-heading">Rõ từ lúc bắt đầu.</h2>
            </div>
            <div>
              <details><summary>Workspace hỗ trợ những gì?</summary><p>Quản lý hồ sơ &amp; mời học viên, nhập/xác nhận InBody, check-in hằng ngày, chat riêng, lịch chung, membership và sổ buổi PT.</p></details>
              <details><summary>Gói Free và Pro khác nhau thế nào?</summary><p>Gói Free dùng tối đa 3 học viên đang hoạt động; gói Pro 199.000đ/tháng không giới hạn hồ sơ và giữ nguyên toàn bộ chức năng.</p></details>
              <details id="contact-app"><summary>Học viên dùng trên thiết bị nào?</summary><p>Học viên dùng trực tiếp trên trình duyệt điện thoại hoặc máy tính qua link mời; bản Android U-01 đang kiểm thử cục bộ.</p></details>
              <TeamDetails />
            </div>
          </div>
        </section>

        <section className="closing compact-closing wrap">
          <div className="closing-banner">
            <div>
              <h2>Sẵn sàng gọn nhẹ hơn trong từng buổi tập.</h2>
              <p>Tạo tài khoản PT miễn phí trong 30 giây.</p>
            </div>
            <div className="closing-actions">
              <Link className="button sun" href="/register">Đăng ký ngay<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></Link>
              <Link className="hero-sample" href="/login">Đăng nhập</Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="wrap compact-footer">
        <Link className="brand" href="#">fitsync</Link>
        <p>© 2026 FitSync · Team SafeTrail.</p>
        <div className="footer-links">
          <Link href="/privacy">Quyền riêng tư</Link>
          <Link href="/terms">Điều khoản</Link>
        </div>
      </footer>

      <dialog id="coaching-detail-sheet" ref={dialogRef} aria-labelledby="sheet-heading" onCancel={(event) => { event.preventDefault(); closeSheet(); }} onKeyDown={trapFocus}>
        <div className="sheet-inner">
          <div className="sheet-top"><span className="sheet-context">FitSync · Chi tiết mẫu</span><button data-close onClick={closeSheet} aria-label="Đóng chi tiết"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
          <h2 id="sheet-heading">{sheet === "report" ? "Đối chiếu bản nháp" : sheet === "chat" ? "Trao đổi với Linh" : "Cùng một buổi hẹn"}</h2>
          <div data-sheet="appointment" hidden={sheet !== "appointment"}>
            <div className="sheet-appointment"><span className="linked-dot" aria-hidden="true"></span><p>Khánh Linh &amp; PT Anh Nam</p><strong>16:00</strong><span>30/10/2026 · 60 phút · Đã xác nhận</span></div>
            <p className="sheet-description">Lịch tập dùng chung hai vai trò; đặt lịch không tự trừ buổi PT.</p>
            <Link className="button forest" href="/register">Đăng ký trải nghiệm</Link>
          </div>
          <div data-sheet="report" hidden={sheet !== "report"}><ReportSample /></div>
          <div data-sheet="chat" hidden={sheet !== "chat"}>
            <div className="sheet-chat"><p className="chat-author">PT Anh Nam</p><p className="chat-line">Chiều nay mình gặp nhau lúc 16:00 nhé.</p><p className="chat-author learner-author">Khánh Linh</p><p className="chat-line learner-line">Dạ, em xem được lịch rồi ạ.</p><button className="chat-appointment" data-open="appointment" onClick={(event) => openSheet("appointment", event.currentTarget)}><span className="linked-dot" aria-hidden="true"></span><span><strong>16:00 · 30/10</strong><small>60 phút · Đã xác nhận</small></span></button></div>
            <Link className="button forest" href="/register">Đăng ký trải nghiệm</Link>
          </div>
        </div>
      </dialog>
      <p className="sr-only" id="page-status" role="status">{role === "pt" ? "Góc nhìn PT, dữ liệu minh họa." : "Góc nhìn học viên, dữ liệu minh họa."}</p>
    </div>
  );
}
