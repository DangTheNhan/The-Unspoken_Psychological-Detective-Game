# TODO — The Unspoken (bảng việc sống)

> Cập nhật: **03/11/2026 (T-028)** — nhóm chốt thứ tự đầu tiên: TD-01 → TD-02 → TD-46 → TD-03. Đây là danh sách việc DUY NHẤT cần theo dõi; `docs/PROJECT_PLAN.md` mục 2a là bản chụp ngày 27/10.
> Mã `TD-xx` giữ nguyên số của PROJECT_PLAN 2a; việc mới từ TD-46 trở đi.
> Cột **Thứ tự (chốt)**: để trống — nhóm điền sau khi thống nhất làm việc nào trước. Cột **Đề xuất** là gợi ý của AI (chờ duyệt).

**Ký hiệu**
- Trạng thái: ⬜ chưa làm · 🔄 đang làm · ⏸ chờ (bị chặn) · ✅ xong · ❓ chưa rõ (cần người dùng báo)
- Ưu tiên: **P0** chặn việc khác / bảo mật · **P1** cần cho Capstone 1 · **P2** nên có · **P3** để sau
- Cỡ: S ≈ 1 phiên ngắn · M ≈ 2–3 phiên · L ≥ 4 phiên
- Ai: **Bạn** = người dùng/nhóm (quyết định, asset, nội dung, thao tác trên máy) · **AI** = Claude

---

## A. Dọn nền & đồng bộ (làm trước khi viết code mới)

| Mã | Việc | Ai | Ưu tiên | Cỡ | Chặn bởi | Trạng thái | Đề xuất | Thứ tự (chốt) |
|---|---|---|---|---|---|---|---|---|
| TD-01 | Đổi mật khẩu MySQL `root` (đã lộ trong commit `b744ce7` trên `master`), cập nhật biến môi trường `DB_PASSWORD` | Bạn | **P0** | S | — | ❓ | 1 | 1 |
| TD-02 | Trả `backend/src/main/resources/application.yml` về `${DB_PASSWORD:}` (không giá trị mặc định); commit qua nhánh + PR | AI soạn / Bạn đẩy | **P0** | S | — | 🔄 03/11: AI đã sửa file trên máy `C:\The-Unspoken…`, chờ commit + PR | 1 | 2 |
| TD-46 | **Đồng bộ hai máy**: máy Desktop có T-025 (PROJECT_PLAN/PROGRESS_LOG/PROJECT_MEMORY) chưa commit; máy `C:\The-Unspoken…` có commit phòng 204 + hoạt ảnh 6 khung (chưa chắc đã commit). Chọn 1 máy làm chính, commit/push, máy kia pull | Bạn | **P0** | S | — | ⬜ | 1 | 3 |
| TD-03 | Chạy `cd frontend; npm run check` và `cd backend; mvn clean test`, gửi log lỗi (nếu có) — code T-020 → T-026 chưa qua kiểm tra thật | Bạn → AI sửa | **P0** | S | TD-46 | ❓ | 2 | 4 |
| TD-04 | Sửa xuống dòng CRLF của `frontend/index.html` (Prettier báo lỗi) | AI / Bạn | P1 | S | — | ⬜ | 2 | |
| TD-05 | Xóa `package-lock.json` rỗng ở gốc (+ `node_modules/` gốc nếu còn), `git rm package-lock.json` | Bạn đồng ý → AI | P2 | S | Bạn đồng ý | ⬜ | | |
| TD-06 | Thống nhất phiên bản Node/npm cả nhóm để `frontend/package-lock.json` không đổi qua lại | Bạn | P2 | S | — | ⬜ | | |
| TD-07 | Quy trình git: mỗi việc 1 nhánh, PR vào `master`, không đẩy thẳng `master` | Nhóm | P1 | — | — | 🔄 | | |

## B. Quyết định cần chốt (gỡ chặn)

| Mã | Câu hỏi | Mở khóa | Ưu tiên | Trạng thái | Đề xuất | Thứ tự (chốt) |
|---|---|---|---|---|---|---|
| TD-08 | **Q3** — Dùng Data Contract 2.0 + `chapter1.json` của gói Chương 1 làm định dạng kịch bản chính thức (đóng ISS-07, bỏ định dạng tạm)? | C, D, E | **P0** | ⏸ chờ Bạn | 1 | |
| TD-09 | **Q4** — Văn bản Phase 2 / 3 / Final / 4 trong gói được đưa vào game nguyên văn? (chưa duyệt → chỉ làm Phase 1) | D | **P0** | ⏸ chờ Bạn | 1 | |
| TD-10 | **Q5** — Asset NPC/vật chứng: nhóm gửi, hay cho phép ảnh tạm có ghi nhãn "PLACEHOLDER" trong lúc chờ? | C, D | P1 | ⏸ chờ Bạn | 2 | |
| TD-47 | **Tốc độ đi lên/xuống** 88 px/giây (= 0,4 × đi ngang) — hoạt ảnh 4 hướng mới tính theo số này | F | P1 | ⏸ chờ Bạn | 2 | |
| TD-48 | **Thiết kế thám tử**: đổi hẳn sang bản mới (tóc rối, sổ tay, túi ô liu) cho hoạt ảnh, tư thế đứng và chân dung hội thoại? | F, G | P1 | ⏸ chờ Bạn | 2 | |
| TD-14 | **Hành lang / phòng 204**: cửa A204 dẫn vào phòng 204 (đi tự do hay chỉ theo kịch bản P2)? cầu thang đi đâu? giấy khen đặt ở đâu? có lưu vị trí phòng vào file lưu? điểm xem bảng Nội quy/Thông báo? | C, E | P1 | ⏸ chờ Bạn | 3 | |
| TD-49 | **Thi thể Tùng** ở phòng 204: lớp ảnh riêng (ẩn được khi cảnh sát xử lý / khi tái dựng) hay vẽ dính vào nền? | C | P2 | ⏸ chờ Bạn | 3 | |
| TD-11 | **ISS-29** — Cách lấy `userId` khi login chỉ trả `{token,type,username,role}` (đụng API §4.3) | E | P1 | ⏸ | 4 | |
| TD-12 | **ISS-05** — Mỗi user 1 bản lưu (ghi đè) hay nhiều bản (lịch sử/checkpoint)? | E | P1 | ⏸ | 4 | |
| TD-13 | **ISS-10/11/12** — API admin, ROLE_ADMIN, định nghĩa "tài khoản hoạt động" & "% hoàn thành chương", công nghệ "thời gian thực" | H | P1 (trước Tuần 8) | ⏸ | 5 | |
| TD-15 | Ngày bắt đầu Tuần 1 Capstone 1 (đang tạm tính 07/10 → Tuần 6 ≈ 11–17/11, Tuần 8 ≈ 25/11–01/12, Tuần 12 ≈ 23–29/12) + phân công TV1/TV2/TV3 | lịch | P2 | ⏸ | | |

## C. Map & phòng 2.5D

| Mã | Việc | Ai | Ưu tiên | Cỡ | Chặn bởi | Trạng thái | Đề xuất | Thứ tự (chốt) |
|---|---|---|---|---|---|---|---|---|
| TD-50 | Ảnh nền phòng 204 (`art-source/room204/room204.png`, `backgrounds/room204.webp`) | Bạn + AI | P1 | — | — | ✅ 31/10 | | |
| TD-51 | Sửa chi tiết ảnh 204 cho khớp gói Chương 1: tờ khảo sát (bỏ chữ + dấu X to → vài dòng gạch đỏ), gạt tàn bỏ khói, 1 tờ biên nhận dưới mép gạt tàn, hộp thuốc nhỏ NẰM TRONG thùng rác, vòng sạch trên bụi mặt tủ | AI (sửa ảnh) hoặc Bạn (vẽ lại) | P2 | S | — | ⬜ | | |
| TD-52 | **Map phòng 204**: vùng đi, vật cản (giường, bàn, tủ, cửa WC), lớp che, 9 hotspot đúng vị trí (HP_LOCK, SINK, NECK, INHALER, TRASH, RECEIPT, DUST, BED, BOARD), file `room204-inspect.json` | AI | P1 | M | (TD-14 cho cửa) | ⬜ | 3 | |
| TD-53 | Cửa A204 ⇄ phòng 204 (theo TD-14) | AI | P1 | S | TD-14 | ⏸ | | |
| TD-54 | Lớp thi thể Tùng (ảnh + vị trí) | Bạn (ảnh) → AI | P2 | S | TD-49 | ⏸ | | |
| TD-55 | Giấy khen chữ ký Khang trên tường hành lang (hotspot phụ cho `EV_KhangCertificate`) | Bạn (ảnh) → AI | P2 | S | TD-14 | ⏸ | | |
| TD-27 | Điền lời xem đồ vật: `room201-inspect.json`, `hallway-inspect.json` | Bạn | P2 | S | — | ⬜ | | |

## D. Tích hợp Chương 1 (chi tiết: `docs/chapter1/CHAPTER1_PLAN.md`)

| Mã | Việc | WP | Ai | Ưu tiên | Cỡ | Chặn bởi | Trạng thái | Đề xuất | Thứ tự (chốt) |
|---|---|---|---|---|---|---|---|---|---|
| TD-16 | Nhập 5 file dữ liệu vào `public/assets/chapters/chapter1/` + kiểm SHA-256 + đưa validator vào repo | C1 | AI | P1 | S | TD-08 | ⏸ | 3 | |
| TD-17 | Narrative engine thuần `game/narrative/` (điều kiện, effect, storyRunner, Press/Present, deduction, checkpoint, migrate save) | C2 | AI | P1 | L | TD-08 | ⏸ | 3 | |
| TD-18 | Test vàng: port 2 lượt chơi trọn chương của `validate_data.py` sang Vitest | C2 | AI | P1 | M | TD-17 | ⏸ | 3 | |
| TD-19 | Bảng ánh xạ speaker/expression → ảnh, DialogueBox 4 kiểu node, ChoiceMenu | C3 | AI | P1 | M | TD-17 | ⏸ | 4 | |
| TD-20 | Phase 1 chơi được: phòng 201 lúc 21:35 → hành lang → hỏi Hòa/Linh/Hào/Minh → cảnh sát tới | C3 | AI | P1 | M | TD-19, TD-10 | ⏸ | 4 | |
| TD-21 | Ảnh tạm có nhãn cho NPC chưa có ảnh | C3/C9 | AI | P2 | S | TD-10 | ⏸ | | |
| TD-22 | Phase 2: khám phòng 204 (9 hotspot, InspectModal, nút "Trở ra hỏi chuyện" khi đủ 5 core) | C4 | AI | P1 | L | TD-09, TD-52 | ⏸ | 5 | |
| TD-23 | Đối chất Press/Present + chọn vật chứng; trừ −15 đúng một lần, blocked không phạt | C5 | AI | P1 | M | TD-17 | ⏸ | 5 | |
| TD-24 | Sổ tay 4 tab đọc state v2 (nguồn, phase thu, revision, Unknown) | C5 | AI | P1 | M | TD-17 | ⏸ | 5 | |
| TD-25 | Final Deduction 8 ô + tái dựng RECON_01–06 | C6 | AI | P1 | M | TD-17, TD-09 | ⏸ | 6 | |
| TD-26 | Phase 4 + fallback xu/khảo sát/giấy khen; Bad Ending → load checkpoint; title Chương 2 → dừng CH2_ENTRY | C7 | AI | P1 | M | TD-25 | ⏸ | 6 | |

## E. Lưu / tải

| Mã | Việc | Ai | Ưu tiên | Cỡ | Chặn bởi | Trạng thái | Thứ tự (chốt) |
|---|---|---|---|---|---|---|---|
| TD-28 | Save = snapshot state v2 vào localStorage + `POST /api/game/save` | AI | P1 | M | TD-17, TD-11 | ⏸ | |
| TD-29 | "Tiếp tục điều tra" tải thật, resume đúng node (không phát lại effect) | AI | P1 | M | TD-28, TD-12 | ⏸ | |
| TD-30 | Autosave 5 phút + sự kiện quan trọng (DEC-010) | AI | P1 | S | TD-28 | ⏸ | |
| TD-31 | Hybrid Storage/offline (REQ-064) | AI | P2 | M | ISS-18 | ⏸ | |

## F. Nhân vật & hoạt ảnh

| Mã | Việc | Ai | Ưu tiên | Cỡ | Chặn bởi | Trạng thái | Thứ tự (chốt) |
|---|---|---|---|---|---|---|---|
| TD-56 | Hoạt ảnh đi ngang 6 khung (thiết kế cũ) đưa vào game, 8 hình/giây | AI | P1 | — | — | ✅ 31/10 (bản tạm) | |
| TD-57 | Bộ đi 4 hướng thiết kế mới: GPT làm V6b (giữ khung xương V5 + thân trên chuyển động + vẽ lại thân dưới hướng lên/xuống) | Bạn (GPT) | P1 | M | — | 🔄 | |
| TD-58 | AI đo lại V6b trên ảnh xuất (trượt chân, tay chân thừa, nhấp nhô, chỗ nối hông, thứ tự tư thế) + GIF so sánh | AI | P1 | S | TD-57 | ⏸ | |
| TD-59 | Tích hợp 4 hướng: ô 448×720, 4 ảnh riêng (bỏ lật gương), tư thế đứng mới, tốc độ lật hình theo hướng, tốc độ dọc; chạy thử 201 + hành lang | AI | P1 | M | TD-58, TD-47, TD-48 | ⏸ | |
| TD-60 | Phương án dự phòng: nếu V6b không đạt → đưa V5 vào game tạm, sửa hoạt ảnh sau | Bạn quyết | P2 | S | TD-58 | ⏸ | |
| TD-61 | Chân dung hội thoại thám tử theo thiết kế mới (6 biểu cảm dùng trong Chương 1: Attentive, Calm, Gentle, Neutral, Quiet, Thoughtful) | Bạn (ảnh) → AI | P1 | M | TD-48 | ⏸ | |
| TD-62 | Chân dung hội thoại NPC: Linh (14 biểu cảm), Hào (7), Minh (13), Cảnh sát (2); Hòa đã có 3 ảnh → cần bảng ánh xạ 15 biểu cảm | Bạn (ảnh) → AI | P1 | L | TD-10 | ⏸ | |
| TD-45 | Quyết định dùng/bỏ `characters/main1–3.png` (5,2 MB, không code nào dùng) | Bạn | P3 | S | — | ⬜ | |

## G. Asset khác & âm thanh

| Mã | Việc | Ai | Ưu tiên | Chặn bởi | Trạng thái | Thứ tự (chốt) |
|---|---|---|---|---|---|---|
| TD-63 | Ảnh xem cận 12 vật chứng Chương 1 (+ ảnh đối chiếu mảnh hộp, báo cáo phân tích, tờ khảo sát, ảnh đồng xu, giấy khen) | Bạn → AI | P1 | TD-10 | ⏸ | |
| TD-42 | WC phòng 201 (Q-R7), intro trước phòng 201 | Bạn → AI | P2 | nội dung | ⏸ | |
| TD-43 | Font Playfair Display + Be Vietnam Pro (OFL) vào `public/assets/fonts/` | Bạn | P2 | — | ⬜ | |
| TD-44 | BGM/SFX (mưa, gõ cửa, bước chân, bật lửa, còi, bộ đàm) nối với âm lượng trong Cài đặt | Bạn → AI | P3 | asset | ⏸ | |

## H. Admin Dashboard (mốc Tuần 8)

| Mã | Việc | Ai | Ưu tiên | Cỡ | Chặn bởi | Trạng thái | Thứ tự (chốt) |
|---|---|---|---|---|---|---|---|
| TD-32 | API Contract admin (văn bản) + ROLE_ADMIN | AI soạn / Bạn duyệt | P1 | S | TD-13 | ⏸ | |
| TD-33 | Backend: thống kê tài khoản hoạt động, % hoàn thành Ch1–5, danh sách bug, PENDING → RESOLVED | AI | P1 | M | TD-32 | ⏸ | |
| TD-34 | Frontend Admin (Tailwind): 3 khối §5.1 + biểu đồ (thư viện cần chốt — ISS-28) | AI | P1 | M | TD-33 | ⏸ | |
| TD-35 | Seed `evidence_master` 12 dòng Ch1 từ `evidence.json` | AI | P3 | S | TD-16 | ⏸ | |

## I. Kiểm thử & hồ sơ (mốc Tuần 12)

| Mã | Việc | Ai | Ưu tiên | Cỡ | Chặn bởi | Trạng thái | Thứ tự (chốt) |
|---|---|---|---|---|---|---|---|
| TD-36 | Playwright tự đi 2 lượt chơi Chương 1 trong trình duyệt | AI | P1 | M | D | ⏸ | |
| TD-37 | E2E §5.2: lưu → JWT → MySQL → kiểm JSON → Admin thấy số liệu; biên bản có log thật | AI + Bạn | P1 | M | E, H | ⏸ | |
| TD-38 | Playtest tay 12 mục `PLAYTEST_CHECKLIST.md` + font tiếng Việt + cỡ hộp thoại | Bạn | P1 | M | D | ⏸ | |
| TD-39 | Cập nhật trạng thái REQ (PROJECT_MEMORY mục C) + bảng đối chiếu REQ ↔ code ↔ test | AI | P2 | M | — | ⬜ | |
| TD-40 | Test backend cho 5 endpoint §4.3 (controller + repository) | AI | P2 | M | — | ⬜ | |

---

## Gợi ý thứ tự (chờ nhóm thống nhất)

1. **Dọn nền:** TD-01, TD-02, TD-46 → TD-03, TD-04.
2. **Chốt quyết định:** TD-08 (Q3), TD-09 (Q4) trước tiên; rồi TD-10, TD-47, TD-48, TD-14, TD-49.
3. **Việc AI làm được ngay, không cần chờ asset:** TD-52 (map phòng 204) và — khi có Q3 — TD-16 → TD-17 → TD-18.
4. **Phase 1 chơi được:** TD-19 → TD-20 (dùng phòng 201 + hành lang đã có).
5. **Mốc Tuần 6:** TD-22 → TD-23, TD-24 → TD-25 → TD-26.
6. **Song song phía nhóm:** TD-57 (hoạt ảnh V6b), TD-61/62/63 (ảnh), TD-27 (lời xem đồ vật), TD-11/12 (backend).
7. **Sau đó:** E (lưu/tải) → H (Admin, Tuần 8) → I (kiểm thử, Tuần 12).

Ghi chú: các mốc tuần tính tạm từ Tuần 1 = 07/10/2026 (TD-15). Theo DEC-004, mốc tuần chỉ để tham khảo.
