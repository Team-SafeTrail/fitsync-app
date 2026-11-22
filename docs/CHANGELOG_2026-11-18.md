# FitSync — thay đổi ứng viên bàn giao18/11

Branch`agent/fitsync-final-product`, draft PR48; chưa merge hoặc triển khai production.

- Nâng Next15/React19 và đồng bộ dependency/async framework APIs; giữ form khi lỗi, sửa reset/native listener và navigation sau lưu.
- Tích hợp reset PKCE và vòng đời invite; thêm sửa/lưu trữ/khôi phục hồ sơ với kiểm version và nhật ký.
- Free tối đa3 hồ sơ chưa lưu trữ, Pro còn hạn unlimited cùng coaching; kiểm cap trong DB khi tạo đồng thời/restore và giữ hồ sơ cũ khi hết hạn.
- Admin dùng DB thật; finance ledger append-only, private PDF/ảnh/hash/nonce, đối soát và reversal; TEST không cấp Pro hoặc vào actual KPI. Billing request khác payment.
- Product events tối thiểu, self-reported source và tổng hợp tuần; synthetic bị loại. Không gửi health/chat/ảnh/URL/PII.
- Đổi/hủy lịch có request/decision/overlap/version; completion/đảo buổi với append-only ledger, không tự trừ khi tạo lịch hoặc check-in.
- Local demo project riêng, launcher không copy cloud env/reset DB khác;29 synthetic accounts và22 TEST entries được đối soát khi seed hai lần.
- Bộ nộp W8/W9/final/tài chính/CAP/gap/audit, Canva10 slide/script/PDF, database/product review và video thật có provenance.

Các kiểm theo revision ở[TEST_EVIDENCE](TEST_EVIDENCE.md). Cloud vẫn8 bảng so với20 source/14 migrations.0 paying actual theo owner, cost actual chưa đối soát; chưa đạt điều kiện20 paid. Full OCR/PDF và hợp đồng vận hành real-data còn giới hạn. Nhóm dừng sau học phần; không hứa tiếp tục thương mại.
