# PROGRESS_LOG.md — Nhật ký tiến trình & Điểm khôi phục

> Thứ tự đọc khi bắt đầu/tiếp tục: **PROJECT_MEMORY.md → mục "ĐIỂM KHÔI PHỤC" bên dưới → mục nhật ký của tác vụ đang dở.**
> File này do AI cập nhật sau **mỗi bước con** và **mỗi tác vụ** (DEC-002). Chỉ ghi việc đã thực sự làm.

---

## ĐIỂM KHÔI PHỤC (RESUME POINT) — luôn cập nhật mục này trước tiên

| Trường | Giá trị |
|---|---|
| Cập nhật lần cuối | 20/10/2026 — T-020 xong phần code (Menu chính + Cài đặt, DEC-012); chờ người dùng chạy `npm run check` + xem thử |
| Tác vụ đang làm | T-020 — chờ người dùng: (1) `cd frontend; npm run check`, (2) `npm run dev` xem menu, (3) thêm 2 font Playfair Display + Be Vietnam Pro (public/assets/fonts/README.md), (4) xác nhận Q-M1 = chỉ dịch giao diện. Còn chờ từ trước: T-017 `npm run check`; Q3–Q5 (CHAPTER1_PLAN mục 7) |
| Đã xong gần nhất | T-012: gói Chương 1 đọc hết (SHA khớp, validator PASS); lưu `docs/sources/chapter1/` + `docs/chapter1/CHAPTER1_MEMORY.md` (tóm tắt) + `CHAPTER1_PLAN.md` (kế hoạch WP-C1…C10). Trước đó: T-009..T-011 (tái cấu trúc áp dụng, MySQL, end-to-end đạt) |
| Trạng thái dở dang | Không có code dở. 43 file T-020 đã ghi lên máy (chưa git commit). AI chưa chạy được Vitest/ESLint/Vite thật (mạng chặn npm) — đã kiểm bằng bộ chạy thay thế + Phaser thật trong Chromium |
| Việc tiếp theo | (1) Người dùng báo kết quả `npm run check` → sửa nếu lỗi; (2) Q3–Q5 → WP-C1…C10 (CHAPTER1_PLAN); (3) đề xuất chờ duyệt: menu tạm dừng (Esc) mở Cài đặt khi đang chơi, i18n cho trang React |
| Đang bị chặn bởi | Q3–Q5 (T-012); ISS-29 (userId, cho phần lưu server ở WP-C8) |
| Lệnh/kiểm tra cần chạy lại khi tiếp tục | `git status` · `cd frontend; npm run check` · `python docs/sources/chapter1/validation/validate_data.py` (chạy trên bản sao vì script ghi đè `validation.results.json`) |
| Ghi chú cho phiên sau | Không cần mở lại zip: đọc `docs/chapter1/CHAPTER1_MEMORY.md`. "Ông chủ trọ" có ảnh `landlord-*` = **HÒA** trong dữ liệu. Present: lấy route khớp **đầu tiên theo thứ tự mảng** (đúng validator). Máy: Java 21, Maven 3.10.0, MySQL 8.0.46 (`C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`), `DB_PASSWORD` ở biến môi trường User |

---

## QUY TRÌNH CHECKPOINT (DEC-002)

### Khi nào lưu
1. **Sau mỗi bước con** của tác vụ (không đợi hết tác vụ).
2. **Trước** mọi thao tác dài/rủi ro (chạy build, cài thư viện, sửa nhiều file, migrate DB).
3. **Khi ngân sách token còn thấp**: AI không đo được chính xác thời điểm chạm giới hạn, nên áp dụng ngưỡng an toàn: khi ngân sách còn lại hiển thị cho AI xuống dưới **~10%**, hoặc hội thoại đã rất dài → **ngừng mở việc mới**, ghi điểm khôi phục đầy đủ rồi mới làm tiếp phần nhỏ còn lại.
4. Khi bị chặn, chờ người dùng trả lời.

> Giới hạn trung thực: nếu phiên bị cắt đột ngột giữa một bước con, phần việc của bước đó có thể mất; điểm khôi phục sẽ là bước con gần nhất đã lưu.

### Lưu những gì
- Cập nhật bảng **ĐIỂM KHÔI PHỤC**.
- Thêm/cập nhật mục nhật ký của tác vụ theo **Mẫu nhật ký** (bên dưới).
- Nếu trạng thái REQ/ISS/DEC thay đổi → cập nhật PROJECT_MEMORY.md mục C/E/F/G.

### Cách tiếp tục sau gián đoạn
1. Đọc PROJECT_MEMORY.md (bản hiện tại).
2. Đọc ĐIỂM KHÔI PHỤC → mở nhật ký tác vụ tương ứng.
3. Kiểm tra lại các file trong "File đã tạo/sửa" của bước con cuối có đúng như ghi không (file có thể đã bị người dùng sửa).
4. Trình bày ngắn yêu cầu liên quan rồi làm tiếp từ "Việc tiếp theo".

---

## MẪU NHẬT KÝ TÁC VỤ (sao chép cho mỗi tác vụ mới)

```
### T-xxx — <tên tác vụ>
- Ngày giao / người giao:
- Yêu cầu gốc (trích ngắn):
- REQ / WP / ISS liên quan:

#### Kế hoạch (DEC-003)
- Mục đích:
- Ảnh hưởng & thay đổi (file/module/dữ liệu/API):
- Rủi ro bug / lỗi phần mềm:
- Đề xuất hướng phát triển (chờ duyệt):

#### Bước con & checkpoint
| Bước | Nội dung | Trạng thái | File tạo/sửa | Kiểm tra đã chạy & kết quả |
|---|---|---|---|---|

#### Kết quả
- Đã hoàn thành:
- Chưa hoàn thành:
- Điểm cần xác nhận:
- Self-Check (A4): đạt / chưa đạt (lý do)
- Bước tiếp theo:
```

---

## NHẬT KÝ

### T-001 — Khởi tạo PROJECT_MEMORY.md, file tiến trình, tối ưu lộ trình thực thi
- Ngày giao: 08/10/2026 (21:18, Asia/Saigon) — người dùng
- Yêu cầu gốc (trích ngắn): dựa vào Story.txt và Project.docx, tuân thủ prompt → tối ưu PROJECT_MEMORY.md; tạo file lưu tiến trình sau mỗi công việc, kể cả lưu điểm kết thúc trước khi chạm ngưỡng token; tối ưu timeline để tận dụng hết token trong ngày, không dừng sau tuần đầu; trước mọi nhiệm vụ phải lập kế hoạch chi tiết (mục đích, ảnh hưởng/thay đổi, rủi ro bug, đề xuất hướng phát triển).
- REQ / WP liên quan: toàn bộ; WP-00

#### Kế hoạch (DEC-003)
- **Mục đích:** có một bộ nhớ dự án đầy đủ, đúng cấu trúc A–G của prompt, trích nguyên văn SQL/API; có cơ chế ghi tiến trình & khôi phục; có lộ trình thực thi theo gói việc.
- **Ảnh hưởng & thay đổi:** chỉ thêm 2 file mới ở thư mục gốc repo (`PROJECT_MEMORY.md`, `PROGRESS_LOG.md`). Không sửa code, README, Project.docx; không commit git.
- **Rủi ro bug / lỗi:** trích xuất sai/thiếu từ docx (giảm thiểu: chuyển docx → text, đối chiếu từng mục, kiểm tra không có bảng/ảnh); repo lệch tài liệu (ghi ISS-25); không đọc được file Java do giới hạn độ sâu (ISS-26); AI không đo chính xác thời điểm hết token (giảm thiểu: checkpoint mỗi bước con).
- **Đề xuất hướng phát triển (chờ duyệt):** lộ trình gói việc ở PROJECT_MEMORY mục H; chốt API Contract + schema JSON trước khi code; căn chỉnh repo theo tài liệu (ISS-25).

#### Bước con & checkpoint
| Bước | Nội dung | Trạng thái | File tạo/sửa | Kiểm tra đã chạy & kết quả |
|---|---|---|---|---|
| B1 | Đọc Story.txt, attachment.txt (prompt) | Xong | — | Đọc toàn văn |
| B2 | Đọc Project.docx | Xong | — | pandoc → markdown (22.867 ký tự), đọc toàn bộ; python-docx: 98 đoạn, 0 bảng, 0 ảnh. Phát hiện thiếu mục 3.1, 4.1 |
| B3 | Khảo sát repo trên máy người dùng | Xong (một phần) | — | Liệt kê thư mục; đọc 20 file cấu hình/frontend. 14 file Java **không đọc được** (độ sâu > 7 cấp) |
| B4 | Soạn PROJECT_MEMORY.md (A–H) | Xong | `PROJECT_MEMORY.md` (mới) | Đối chiếu SQL/API với văn bản trích từ docx |
| B5 | Soạn PROGRESS_LOG.md | Xong | `PROGRESS_LOG.md` (mới) | — |
| B6 | Ghi 2 file vào thư mục gốc repo trên máy người dùng, đọc lại để kiểm tra | Xong | 2 file trên | Đọc lại bản trên máy; so khớp SQL với nguồn bằng script |

#### Kết quả
- **Đã hoàn thành:** B1–B6.
- **Chưa hoàn thành:** đọc nội dung 14 file Java (ISS-26); lộ trình mục H chưa được duyệt.
- **Điểm cần xác nhận:** ISS-01 → ISS-28 (ưu tiên P0: ISS-02, 05, 06, 07, 10, 25, 26).
- **Self-Check (A4):** đạt trong phạm vi tác vụ — không viết code, không sửa tài liệu, không thêm đặc tả; mọi điểm thiếu được ghi ở mục E; chưa có kiểm thử phần mềm nào được chạy (không tuyên bố kiểm thử).
- **Bước tiếp theo:** WP-01 — chờ người dùng trả lời câu hỏi P0 và duyệt mục H.

---

### T-002 — Tái cấu trúc dự án theo chuẩn studio nhỏ
- Ngày giao: 08/10/2026 21:33 — người dùng
- Yêu cầu gốc: "tối ưu lại structure của project theo hướng thật chuyên nghiệp cho việc làm game giống như một studio nhỏ, đảm bảo clean code, dễ debug, dễ fix, dễ update, đồng bộ lại tài liệu được nạp, dùng phaser 4.2.1, react và javascript."
- Quyết định kèm theo: DEC-005, DEC-006, DEC-007, DEC-008
- REQ / ISS liên quan: REQ-002..047, ISS-02, ISS-25, ISS-26, ISS-28

#### Kế hoạch (DEC-003)
- **Mục đích:** cấu trúc theo feature + layer; tách React web / Phaser game / logic thuần; mỗi API path, scene key, event name khai báo một chỗ.
- **Ảnh hưởng:** viết lại `frontend/src`, cấu hình frontend, backend Java theo package tính năng, thêm `docs/`, `scripts/apply-restructure.ps1`; cập nhật README, PROJECT_MEMORY, PROGRESS_LOG.
- **Rủi ro:** AI không xóa/di chuyển được file trên máy và không ghi được file Java sâu > 7 cấp → dùng script do người dùng chạy; React StrictMode tạo 2 game Phaser; khác biệt API Phaser 4; lockfile tạo trên Linux có thể lệch Windows (→ không ghi đè lockfile, để `npm install` trên máy tự cập nhật).
- **Đề xuất (chờ duyệt):** sau cấu trúc, làm WP-02/03.

#### Bước con & checkpoint
| Bước | Nội dung | Trạng thái | File tạo/sửa | Kiểm tra |
|---|---|---|---|---|
| B1 | Ghi DEC-005..008, mở T-002 | Xong | PROJECT_MEMORY.md, PROGRESS_LOG.md | — |
| B2 | Dựng frontend mới trong môi trường AI (`/home/claude/repo/frontend`, chưa ghi lên máy) | Xong | ~45 file trong `frontend/src`, config | Prettier check OK; ESLint (luật lõi) 0 lỗi; 130 import nội bộ đều resolve; 21/21 unit test pass (Node test runner + shim tương thích Vitest — **Vitest thật chưa chạy** vì registry npm bị chặn); smoke test Phaser **v4.2.1 WebGL** trong Chromium: Menu → New Game → Dialogue → Investigation → Notebook (N/Esc) → BadEnding → Menu, destroy sạch canvas, 0 lỗi runtime |
| B3 | Dựng backend Spring Boot theo package-by-feature (common, security, user, auth, game, report, evidence) + `db/schema.sql` nguyên văn §2.1–2.2 + application.yml | Xong | 31 file Java (main) + 1 test | `javac --release 17` với đúng jar trong `~/.m2` của người dùng (Spring Boot 3.4.4, Security 6.4.4, JJWT 0.12.6): **0 lỗi, 0 cảnh báo**; JwtTokenProviderTest **4/4 pass** (chạy bằng reflection harness, không qua Maven Surefire). **Chưa chạy**: khởi động Spring context, kết nối MySQL, ddl-auto=validate |
| B4 | Tài liệu + công cụ: `docs/ARCHITECTURE.md`, `docs/CONVENTIONS.md`, README, `.gitignore`, `.editorconfig`, `.gitattributes`, `scripts/apply-restructure.ps1` (ASCII, CRLF, PS 5.1); cập nhật PROJECT_MEMORY (D1, E: ISS-02/25/26/28 + ISS-29/30 mới, F: DEC-005..008, G, H4a) | Xong | như cột Nội dung | Script **chưa chạy thử** (môi trường AI không có PowerShell) — đã rà soát thủ công, không có ký tự ngoài ASCII |
| B5 | Ghi lên máy người dùng | Xong | 115 file (frontend 71, `_migration` 33, backend resources 2, docs 2, script 1, gốc repo 6) | device_commit: 115/115 written, 0 rejected; đối chiếu kích thước bằng liệt kê thư mục: khớp |
| B6 | Chạy script + kiểm thử thật | **Xong (09/10, T-009)** | xem T-009 | `npm run check` 30/30 + build OK; `mvn clean test` 4/4. Chưa chạy MySQL/Spring context |

#### Kết quả
- **Đã hoàn thành:** B1–B5.
- **Chưa hoàn thành:** B6 (phía người dùng). Chưa chạy thật: `npm install`, Vitest, `vite build`, ESLint với plugin React, `mvn test`, khởi động Spring + MySQL, script PowerShell.
- **Rủi ro còn lại:** (1) dải phiên bản `@tailwindcss/vite`/`vitest`/`react-router-dom` có thể xung đột peer với Vite 8 → script gợi ý `--legacy-peer-deps`; (2) `ddl-auto=validate` sẽ dừng backend nếu DB cũ lệch schema → README hướng dẫn; (3) `.gitattributes` mới → cần `git add --renormalize .`.
- **Điểm cần xác nhận:** ISS-02 (Java), ISS-29 (userId), ISS-30 (giá trị tạm), cùng các ISS P0 cũ.
- **Self-Check (A4):** tên scene §3.2, endpoint/payload §4.3, SQL §2.1–2.2 (nguyên văn trong schema.sql), công thức §3.3, autosave §5.2, 4 tab §3.2 đã đối chiếu; không thêm tính năng gameplay hay nội dung cốt truyện; mọi giá trị tự đặt được liệt kê ở ISS-30; trạng thái kiểm thử ghi đúng phạm vi đã chạy.
- **Bước tiếp theo:** B6 → WP-02/03.

---

### T-003 — Thêm hướng dẫn Bước 6 (áp dụng tái cấu trúc) vào README
- Ngày giao: 08/10/2026 22:20 — người dùng: "thêm phần này vào readme giúp tôi"
- **Kế hoạch:** mục đích — người dùng/nhóm có hướng dẫn B6 ngay trong repo; ảnh hưởng — chỉ sửa `README.md` (thêm mục "Áp dụng tái cấu trúc T-002"); rủi ro — trùng nội dung với mục "Khởi tạo CSDL" (chấp nhận, mục mới chỉ dùng một lần); đề xuất — xóa mục này khỏi README sau khi cả nhóm đã áp dụng xong.
- **Bước con:** B1 đọc lại README trên máy (khớp bản AI đã ghi) → B2 chèn mục mới trước "Chạy frontend" → B3 ghi lên máy.
- **Ghi chú:** lần ghi PROGRESS_LOG trước đã sinh bản sao `PROGRESS_LOG-1.md` (lỗi đồng bộ); `PROGRESS_LOG.md` đã được khôi phục bản mới nhất; README Bước 1 có lệnh xóa bản sao.
- **Self-Check:** chỉ thêm hướng dẫn vận hành, không đổi đặc tả. Trạng thái: xong.

### T-005 — Thêm 3 ảnh nhân vật "ông chủ trọ" (Ch1)
- Ngày giao: 09/10/2026 — người dùng: "thêm 3 ảnh này vào project đây là nhân vật chủ trọ"
- **Kế hoạch:** mục đích — đưa asset nhân vật vào repo đúng thư mục chuẩn; ảnh hưởng — chỉ thêm 3 file PNG vào `frontend/public/assets/images/portraits/`, **không sửa code**; rủi ro — ảnh nặng (~7 MB/ảnh, 1536×2752) làm chậm tải game và phình git; nền kem đặc (không trong suốt); ảnh toàn thân, khung chân dung `DialogueBox` 160×160 sẽ bị méo nếu dùng thẳng; đề xuất — xác nhận tên biểu cảm, sau đó tối ưu ảnh (WebP/thu nhỏ, tách nền) và nạp trong `PreloadScene`.
- **Kết quả:** `landlord-smirk.png` (cười nhếch mép), `landlord-angry.png` (cau mày, đang nói), `landlord-talk.png` (đang nói, bình thường). Tên biểu cảm do AI đặt theo hình — chờ người dùng xác nhận. Đã kiểm tra trên máy: 3 file có mặt, kích thước khớp bản gốc.
- **Chưa làm (chờ xác nhận):** đăng ký texture key trong `PreloadScene`, mã nhân vật trong dữ liệu hội thoại (ISS-07), tối ưu ảnh.
- **Self-Check:** không đổi đặc tả/cốt truyện; chưa chạy game với ảnh mới. Trạng thái: xong phần thêm file.
- **Sửa (09/10, trong T-006):** đối chiếu lại khuôn mặt — tên ở T-005 bị lệch: `landlord-angry.png` thực ra là miệng **mở to** (nay gọi `talk`), `landlord-talk.png` thực ra là **cau mày, miệng hé** (nay gọi `stern`). Bản dùng trong game là `.webp` mới (tên đúng); 3 file `.png` trong `public/.../portraits/` cần người dùng xóa.

### T-006 — Hoạt ảnh nhép miệng cho ông chủ trọ (Phaser)
- Ngày giao: 09/10/2026 17:28 — người dùng: "được hãy giúp tôi" (đồng ý đề xuất: cắt/nén ảnh, sửa PreloadScene + DialogueBox, demo, test)
- **Kế hoạch:** mục đích — chân dung nhép miệng trong lúc chữ chạy; ảnh hưởng — thêm `data/characters.js`, `systems/lipSync.js`, `debug/demoDialogue.js` (+2 test); sửa `DialogueBox` (image→sprite, phát/dừng hoạt ảnh), `PreloadScene` (nạp ảnh + tạo hoạt ảnh), `dialogueData` (trường `talk`), `DialogueScene` (`data.lines`/`data.nextScene` cho debug), `DebugScene` (F9 demo, nhãn chuyển lên góc trên phải); docs + README; asset `.webp` mới; ảnh gốc chuyển vào `art-source/`. Rủi ro — trường `talk` là đề xuất trong lúc ISS-07 chưa chốt; tách nền tự động có thể sót viền ở chỗ khó; lời thoại demo chỉ là chữ `[DEMO]`, không phải kịch bản.
- **Bước con:** B1 đồng bộ code từ máy (khớp) → B2 tách nền + cắt chân dung 512×512 + toàn thân 518×900 (.webp ~42 KB / ~80 KB) → B3 sửa code → B4 kiểm tra → B5 ghi lên máy.
- **Kiểm tra đã chạy (container):** 27/27 unit test (Node shim cho Vitest), ESLint 0 lỗi, Prettier sạch; Chromium + Phaser 4.2.1 thật: 3 texture + 2 hoạt ảnh tồn tại, F9 mở demo, khung hình đổi smirk↔talk khi chữ chạy, dừng ở dấu phẩy, chữ xong/bấm bỏ qua → về ảnh đứng yên, hết demo về MainMenu; luồng New Game cũ không đổi, không có lỗi console. **Chưa chạy** `npm run check` thật (Vitest/Vite) trên máy người dùng.
- **Người dùng cần làm:** xóa `frontend/public/assets/images/portraits/landlord-{smirk,talk,angry}.png`; `cd frontend; npm run check`; `npm run dev` → bấm F9.
- **Self-Check:** không thêm lời thoại cốt truyện; tốc độ nhép miệng ghi TẠM. Trạng thái: xong phía AI.

### T-007 — Chủ trọ hiện nửa thân trên bên trái/phải màn hình (kiểu Visual Novel)
- Ngày giao: 09/10/2026 18:48 — người dùng: "khi trò chuyện, khung chat vẫn hiện ở dưới, còn ông chủ trọ đứng ở bên trái hoặc phải của màn hình, hiện nửa thân trên và nhép miệng, thay cho ô ảnh đại diện nhỏ"
- **Kế hoạch:** mục đích — thay ô chân dung 160×160 bằng nhân vật nửa thân đứng cạnh khung thoại; ảnh hưởng — ảnh `images/characters/*.webp` đổi từ toàn thân sang nửa thân 783×990; thêm `ui/CharacterStage.js`; viết lại `ui/DialogueBox.js` (nhép miệng chuyển sang CharacterStage, ô chân dung chỉ hiện khi câu dùng `portrait`); `data/characters.js` (key `char-<id>-<biểu cảm>`, `resolveStageLine`, `defaultSide`); `dialogueData` đọc `character/expression/talk/position`; `DialogueScene` tạo sân khấu; `theme.DEPTH.CHARACTER`; demo F9; docs/README. Rủi ro — định dạng câu thoại đổi so với T-006 (`talk` nay là tên kiểu nhép, không phải animation key) — vẫn chờ ISS-07; ảnh chân dung vuông trong `portraits/` hiện không nạp (giữ cho Sổ tay về sau).
- **Hành vi:** câu có `character` → nhân vật trượt vào ở bên `position` (mặc định phải), nhép miệng khi chữ chạy, dừng ở dấu câu; câu của người khác → nhân vật tối đi; đổi bên → trượt vào bên mới.
- **Kiểm tra đã chạy (container):** 30/30 unit test (Node shim), ESLint 0 lỗi, Prettier sạch; Chromium + Phaser 4.2.1: nửa thân 522×660 đứng phải (x≈995) / trái (x≈285), khung hình đổi smirk↔talk khi chữ chạy, câu người khác → tối, bấm bỏ qua → về ảnh đứng yên, không có ô chân dung, chữ dùng hết bề ngang; luồng New Game cũ không lỗi. **Chưa chạy** `npm run check` thật trên máy người dùng.
- **Self-Check:** không thêm lời thoại cốt truyện (chỉ câu `[DEMO]`); kích thước/vị trí/tốc độ ghi TẠM. Trạng thái: xong phía AI.

### T-008 — Chuẩn bị chuyển sang Claude Code: CLAUDE.md + docs/sources/
- Ngày giao: 09/10/2026 19:06 — người dùng: "hãy tạo claude.md và thư mục cùng với di chuyển các file vào thư mục giúp tôi trước"
- **Kế hoạch:** mục đích — Claude Code trên máy người dùng tự nạp quy tắc làm việc và tìm được tài liệu gốc; ảnh hưởng — thêm `CLAUDE.md` (gốc repo, ~100 dòng, không @import PROJECT_MEMORY để tránh tốn ngữ cảnh), thư mục `docs/sources/` (Project.docx, Project.md, Story.txt, working-rules.md), cập nhật README (bảng tài liệu) và PROJECT_MEMORY mục B; không đổi code. Rủi ro — `Project.md` là bản chuyển đổi tự động (đã ghi chú: bản .docx có giá trị cao nhất); tài liệu gốc vào git (≈ 90 KB, chấp nhận được).
- **Ghi chú:** tài liệu gốc trước đây chỉ là file đính kèm trong cuộc trò chuyện, chưa nằm trên máy người dùng → "di chuyển" thực hiện bằng cách chép bản đã nhận vào `docs/sources/`.
- **Self-Check:** nội dung CLAUDE.md lấy từ working-rules.md (SRC-3), DEC-000..008, README/docs hiện có; không thêm đặc tả mới. Trạng thái: xong phía AI.
- **Việc tiếp theo (trong Claude Code):** người dùng cài Claude Code → commit → chạy `claude` tại gốc repo → áp dụng tái cấu trúc T-002 (xóa file cũ gây lỗi ESLint `react-refresh/only-export-components`) → `npm run check`.

### T-009 — Áp dụng tái cấu trúc T-002 (bước B6) bằng Claude Code
- Ngày giao: 09/10/2026 — người dùng: "thực thi việc còn dang dở T-002 bước B6 nếu không ảnh hưởng hay có rủi ro gì thì thực thi … nhớ cập nhật tiến trình sau khi hoàn thành"
- REQ / WP / ISS liên quan: T-002, ISS-26, DEC-007

#### Kế hoạch (DEC-003)
- **Mục đích:** xóa file cũ, đưa Java từ `_migration/` vào package, kiểm thử thật frontend + backend.
- **Ảnh hưởng:** xóa `package.json`/`package-lock.json` gốc, `frontend/src/{App.jsx,index.css,api,context,pages,components,utils}`, `frontend/src/game/{config.js,entities,managers}`, package Java cũ `config/controller/dto/model/repository/service`, `backend/target`, `_migration/`; thêm 32 file Java main + 1 test vào package; `npm install` frontend.
- **Rủi ro & kiểm tra trước khi chạy:** mọi đường dẫn bị xóa đều đã được git theo dõi, không có sửa đổi chưa commit (HEAD `66b4c80` = điểm khôi phục, nên không tạo commit snapshot riêng); chỉ `backend/target/` là file chưa theo dõi (build output). Code mới không import đường dẫn cũ; `_migration` không tham chiếu package Java cũ; không có test backend cũ. Dry-run khớp README (không lỗi).
- **Không làm (chưa được đồng ý):** xóa `PROGRESS_LOG-1.md`, commit.

#### Bước con & checkpoint
| Bước | Nội dung | Trạng thái | File tạo/sửa | Kiểm tra đã chạy & kết quả |
|---|---|---|---|---|
| B1 | Rà soát rủi ro + `apply-restructure.ps1 -DryRun` | Xong | — | 19 mục xóa, 33 file Java chép, không lỗi |
| B2 | Chạy thật (`-Force`, đã tự rà soát thay cho lời nhắc YES) | Xong | như Ảnh hưởng | `_migration` đã xóa; `npm install`: 0 lỗ hổng |
| B3 | `git add -A` + `git add --renormalize .` (chỉ stage) | Xong | — | 44 D, 32 R, 3 M — **chưa commit** |
| B4 | Sửa xuống dòng: 6 file trên máy là CRLF trong khi git yêu cầu LF (`frontend/index.html` làm `prettier --check` báo lỗi) → lấy lại từ index | Xong | `backend/pom.xml`, `backend/src/main/resources/data.sql`, `docs/sources/{Story.txt,working-rules.md}`, `frontend/index.html`, `frontend/public/assets/dialogues/chapter-1.json` (chỉ đổi CRLF→LF, nội dung giữ nguyên) | `git ls-files --eol`: chỉ còn `.ps1` là CRLF (đúng ý định) |
| B5 | `cd frontend; npm run check` | Xong | — | ESLint 0 lỗi (2 lỗi `react-refresh` cũ đã hết), Prettier sạch, Vitest **30/30**, Vite build OK |
| B6 | `cd backend; mvn clean test` (Java 21.0.12, Maven 3.10.0) | Xong | — | `Tests run: 4, Failures: 0` — **BUILD SUCCESS**; không còn tham chiếu package cũ |
| B7 | MySQL `schema.sql` + `spring-boot:run` + end-to-end (README Bước 5–7) | **Chưa làm** | — | Máy chưa có MySQL (không có lệnh `mysql`, không có service) |

#### Kết quả
- Đã hoàn thành: B1–B6. T-002 coi như xong phần cấu trúc; ISS-26 hết hiệu lực.
- Chưa hoàn thành: B7 (cần MySQL); commit (chờ người dùng).
- Điểm cần xác nhận: (1) **đề xuất** sửa `.gitattributes` — dòng `*.{ps1,cmd,bat} text eol=crlf` không có tác dụng vì gitattributes không hỗ trợ `{…}` (`git check-attr` cho `.ps1` ra `eol: lf`) → tách thành 3 dòng `*.ps1`, `*.cmd`, `*.bat`; (2) commit T-009; (3) xóa `PROGRESS_LOG-1.md` và 3 file `landlord-*.png` thừa.
- Self-Check (A4): đạt — không đổi đặc tả, code, API hay schema; chỉ áp dụng script đã duyệt ở T-002 và chuẩn hóa xuống dòng; kết quả kiểm thử ghi đúng phạm vi đã chạy.
- Bước tiếp theo: commit → MySQL + README Bước 5–7 → WP-02/03.


### T-010 — Sửa `.gitattributes`, dọn file thừa, commit T-009
- Ngày giao: 09/10/2026 — người dùng: "tôi xác nhận toàn bộ hãy làm đi" (đồng ý 4 điểm cần xác nhận của T-009)
- **Kế hoạch:** mục đích — đóng các điểm chờ của T-009; ảnh hưởng — `.gitattributes` (tách `*.{ps1,cmd,bat}` thành 3 dòng), xóa `PROGRESS_LOG-1.md`, `frontend/public/assets/images/portraits/landlord-{angry,smirk,talk}.png`, commit trên nhánh `Nhan`; rủi ro — xóa nhầm dữ liệu (đã kiểm tra: `PROGRESS_LOG-1.md` là bản cũ chỉ có T-001/T-002, đều có trong `PROGRESS_LOG.md`; 3 PNG không còn được tham chiếu và trùng MD5 với bản trong `art-source/characters/landlord/`).
- **Bước con:** B1 sửa `.gitattributes` → `git check-attr` cho `.ps1` = `eol: crlf` → B2 `git rm` 4 file → B3 `npm run check` lại: 30/30, build OK, exit 0 → B4 cập nhật log → B5 commit (chưa push).
- **Chưa làm:** cài MySQL — cần người dùng tự cài và đặt mật khẩu root (AI không tự đặt/nhập mật khẩu cho tài khoản quản trị CSDL); push/PR — chưa được yêu cầu.
- **Self-Check:** không đổi đặc tả, code, API, schema. Trạng thái: xong.

### T-011 — Tạo CSDL MySQL, chạy backend, thử end-to-end (README Bước 5–7)
- Ngày giao: 09/10/2026 — người dùng: "tôi đã cài đặt my sql rồi bây giờ bạn cần gì" → cung cấp mật khẩu root
- **Kế hoạch:** mục đích — hoàn tất kiểm thử thật còn thiếu của T-002/T-009; ảnh hưởng — tạo database `detective_game` trên MySQL cục bộ, đặt biến môi trường `DB_PASSWORD` (User), không sửa file mã nguồn; rủi ro — README dùng `DROP DATABASE` (đã kiểm tra: DB chưa tồn tại → chỉ `CREATE`); mật khẩu root đã xuất hiện trong chat → khuyên người dùng không dùng lại cho dịch vụ khác, không ghi vào repo.
- **Bước con & kiểm tra:**
  - B1 kết nối MySQL 8.0.46: OK; `detective_game` chưa có → `CREATE DATABASE` + chạy `db/schema.sql` → 4 bảng `bug_reports, evidence_master, game_saves, users`.
  - B2 `mvn spring-boot:run`: `Tomcat started on port 8080`, `ddl-auto=validate` qua (entity khớp schema), log không có WARN/ERROR.
  - B3 `npm run dev` (Vite 8.3.3) + trình duyệt tích hợp: Đăng ký (tài khoản test `e2e_tester01`, mật khẩu lưu ở scratchpad phiên, không ghi vào repo) → tự sang Đăng nhập → Đăng nhập → `/play` menu Phaser → New Game → hội thoại (câu hệ thống "chưa có lời thoại", đúng ISS-07) → InvestigationScene, Uy tín 100 → N: Sổ tay 4 tab (Evidence/People/Timeline/Statements) → Esc → S: "Đã lưu tạm trên trình duyệt (offline)" (đúng ISS-29) → F9: chủ trọ nửa thân bên phải nhép miệng, câu người khác → tối đi. Console: 0 lỗi suốt quá trình.
  - B4 DB: `users` có 1 dòng (`ROLE_PLAYER`, mật khẩu `{bcrypt}`); `game_saves` = 0 (đúng, save đang offline).
- **Kết quả:** README Bước 5–7 đạt. T-002 hoàn tất toàn bộ phần kiểm thử.
- **Điểm cần xác nhận:** commit/push/PR; tài khoản test `e2e_tester01` trong DB cục bộ có thể giữ để thử tiếp hoặc xóa.
- **Self-Check:** không sửa code, API, schema; kết quả ghi đúng phạm vi đã chạy. Trạng thái: xong.

### T-012 — Đọc gói `CHAPTER_1_COMPLETE`, lưu bộ nhớ, lập kế hoạch tích hợp Chương 1
- Ngày giao: 13/10/2026 — người dùng: "đọc hết tất cả các file có trong zip hiện tại, lưu lại toàn bộ nội dung để không cần đọc lại ở lần làm việc sau, từ những nội dung hãy tìm một hướng đi tối ưu nhất sau đó hãy lên 1 plan chi tiết từng phần cần hoàn thành. những nội dung trùng lặp không cần ghi lại vào bộ nhớ, nếu có gì xảy ra nằm ngoài yêu cầu hiện tại của tôi hãy hỏi lại tôi…"
- **Kế hoạch:** mục đích — nắm toàn bộ Chương 1, lưu để phiên sau không đọc lại, chọn hướng tích hợp; ảnh hưởng — chỉ thêm tài liệu (`docs/sources/chapter1/`, `docs/chapter1/CHAPTER1_MEMORY.md`, `CHAPTER1_PLAN.md`), cập nhật PROJECT_MEMORY (SRC-5, ISS-31, ghi chú ISS-02/06/07/15), CLAUDE.md (trỏ tới bộ nhớ Ch1), PROGRESS_LOG; **không sửa code**; rủi ro — tóm tắt sai so với gốc (giảm bằng cách giữ gói gốc trong repo, dẫn file/mục).
- **Bước con & kiểm tra:** B1 giải nén vào thư mục riêng, kiểm SHA-256 theo MANIFEST: 28/28 khớp · B2 chạy `validate_data.py` trên bản sao: PASS (1257 node, 43 ST, 12 EV, 6255 assertion) · B3 đọc README_FIRST, MANIFEST, INTEGRATION_PROMPT, DATA_CONTRACT, validation/* · B4 đọc Bible 1.3 (602 dòng), Project.docx mới (so diff với bản cũ), Phase.docx, MASTER_PROMPT, 2 hồ sơ lịch sử · B5 đọc 5 kịch bản; xác nhận ALL_SCRIPTS = ghép nguyên văn 5 file · B6 phân tích `chapter1.json` (loại node, 19 predicate, 38 statementRules, deduction, runtimePolicy), danh mục, state v2, source-map (runtimeText trùng text node), assets · B7 kiểm hiện trạng repo trên máy (T-009..T-011 của Claude Code) · B8 viết bộ nhớ + kế hoạch · B9 ghi lên máy.
- **Phát hiện chính:** (1) `reference/Project.docx` là **bản mới** của SRC-1 — Java (đóng ISS-02), thêm §3.1/§4.1 mâu thuẫn cấu trúc đã áp dụng, bỏ câu autosave → ISS-31; (2) gói cung cấp đủ định dạng + lời thoại → giải ISS-07/ISS-06; ΔP −15/−20 → giải ISS-15; (3) 5 route `blocked` ở NO_HANDLING/NORMAL_REPLACEMENT không bao giờ tới vì đứng sau route `wrong` cùng thẻ — validator dùng first-match theo mảng → engine phải theo đúng như vậy; (4) gói ghi Phaser 3, dự án Phaser 4.2.1 (DEC-005) — chỉ cần adapter; (5) repo mới có ảnh Hòa, thiếu toàn bộ background + 5 nhân vật + ảnh Evidence.
- **Hướng đề xuất:** narrative engine JS thuần chạy `chapter1.json` + scene Phaser làm phần hiển thị (chi tiết `CHAPTER1_PLAN.md`).
- **Cần xác nhận:** Q1–Q5 (mục 7 kế hoạch).
- **Self-Check:** chỉ dùng nội dung gói + repo; không thêm đặc tả/lời thoại; các đề xuất ghi [ĐỀ XUẤT]. Trạng thái: xong phần đọc/lưu/kế hoạch; triển khai chờ duyệt.

### T-013 — Ghi quyết định Q1: giữ nguyên cấu trúc dự án
- Ngày giao: 13/10/2026 — người dùng: "ở Q1 giữ nguyên cấu trúc hiện tại của đồ án"
- **Kế hoạch:** mục đích — ghi quyết định để mọi phiên sau theo đúng; ảnh hưởng — PROJECT_MEMORY (thêm DEC-009; ISS-01 đã xử lý, ISS-02 đóng, ISS-31 một phần), `docs/ARCHITECTURE.md` (thêm mục 3a bảng ánh xạ Project.docx bản mới §3.1/§4.1 → cấu trúc hiện tại), `docs/chapter1/CHAPTER1_PLAN.md` + `CHAPTER1_MEMORY.md` (đánh dấu Q1 đã trả lời), `CLAUDE.md` (dòng SRC-5 bỏ "chờ Q1", trỏ DEC-009); **không sửa code**; rủi ro — hiểu sai phạm vi câu trả lời (đã ghi rõ cách hiểu trong DEC-009 để người dùng sửa nếu cần).
- **Cách hiểu đã ghi:** giữ cấu trúc hiện tại, không theo §3.1/§4.1, không thêm Redux; Project.docx bản mới được dùng làm bản tham chiếu kỹ thuật (ví dụ backend Java).
- **Còn mở:** Q2 (autosave), Q3 (định dạng dữ liệu Chương 1), Q4 (văn bản P2–P4), Q5 (asset).
- **Self-Check:** chỉ ghi quyết định người dùng vừa đưa và bảng ánh xạ thực tế; không đổi code/đặc tả khác. Trạng thái: xong.

### T-014 — Ghi quyết định Q2: giữ tính năng autosave
- Ngày giao: 13/10/2026 — người dùng: "Q2 vẫn giữ tính năng auto save"
- **Kế hoạch:** mục đích — ghi quyết định để phiên sau và WP-C8 làm đúng; ảnh hưởng — PROJECT_MEMORY (thêm DEC-010; ISS-31 đóng; REQ-030 ghi căn cứ giữ theo DEC-010), `docs/chapter1/CHAPTER1_PLAN.md` (Q2 đã trả lời, WP-C8 bước 3 cụ thể hóa), `CHAPTER1_MEMORY.md` (Q2 đã trả lời); **không sửa code** — `game/systems/autosave.js` + test đã đúng REQ-030 nên giữ nguyên; rủi ro — hiểu sai phạm vi (đã ghi rõ cách hiểu trong DEC-010).
- **Cách hiểu đã ghi:** giữ đúng REQ-030 (lưu thủ công bất kỳ lúc nào + tự động mỗi 5 phút + khi có sự kiện quan trọng); khi tích hợp Chương 1, sự kiện quan trọng = hiệu ứng `collect_evidence` và `save_checkpoint`.
- **Còn mở:** Q3 (định dạng dữ liệu Chương 1), Q4 (văn bản P2–P4), Q5 (asset).
- **Self-Check:** chỉ ghi quyết định người dùng vừa đưa; không đổi code/đặc tả khác. Trạng thái: xong.

### T-015 — Flow tổng hợp và các flow chi tiết kèm code
- Ngày giao: 16/10/2026 — người dùng: "với những gì đã chạy được trong project, làm ra cái flow tổng hợp và các flow chi tiết bao gồm code."
- **Kế hoạch:** mục đích — tài liệu luồng hệ thống dựa trên code thật; ảnh hưởng — **không sửa file nào trong repo**, chỉ tạo trang Artifact riêng (riêng tư, của người dùng); rủi ro — mô tả sai trạng thái "đã chạy" (giảm bằng cách lấy trạng thái từ T-009..T-011 và đọc code thật), đoạn code lệch file (giảm bằng script cắt theo số dòng từ bản đã đối chiếu với máy).
- **Bước con & kiểm tra:** B1 stage `frontend/src` (50 file) từ máy, `cmp` với bản sao: khớp; Java quá sâu để stage → dùng bản sao, 32/32 file trùng kích thước với máy · B2 đọc toàn bộ code + PROGRESS_LOG T-009..T-011 · B3 viết 14 flow (sơ đồ Mermaid, các bước, trạng thái, 70+ đoạn code trích nguyên văn có đường dẫn + số dòng) + bảng API, EventBus, test · B4 kiểm tra: ranh giới từng đoạn trích (in dòng đầu/cuối), bố cục desktop/điện thoại/sáng/tối bằng Playwright (không tràn ngang). **Chưa kiểm được:** Mermaid render thật (mạng chặn cdnjs/npm) — đã rà cú pháp bằng tay.
- **Phát hiện ghi lại:** `DeductionScene`, `BadEndingScene` chưa có đường vào; `runtime.penalize` / `collectEvidence` chưa được gọi; `Hotspot` chưa đặt vào scene; sự kiện `ui:toast` và `notebook:entry-added` chưa có bên nghe; API save/load/bug report có code nhưng chưa có request thật (ISS-29, chưa có UI).
- **Self-Check:** không đổi code/đặc tả/API; không chạy lại test (dùng kết quả T-009/T-010 và ghi rõ). Trạng thái: xong.

### T-016 — Xác định vị trí lưu dữ liệu hội thoại
- Ngày giao: 16/10/2026 — người dùng hỏi: "đoạn hội thoại của nhân vật hiện đang được lưu ở vị trí nào"
- **Kế hoạch:** mục đích — đối chiếu vị trí dữ liệu hội thoại runtime với nguồn kịch bản Chương 1; ảnh hưởng — không sửa code, chỉ cập nhật nhật ký; rủi ro — nhầm file runtime rỗng với dữ liệu nguồn đầy đủ.
- **Bước con & kiểm tra:** đọc `dialogueData.js`, `PreloadScene.js`, `DialogueScene.js`; kiểm tra `frontend/public/assets/dialogues/chapter-1.json`; đối chiếu `docs/sources/chapter1/data/chapter1.json` và các file `scripts/`.
- **Kết quả:** runtime đang nạp `frontend/public/assets/dialogues/chapter-1.json`, nhưng `dialogues` hiện rỗng; dữ liệu Chương 1 đầy đủ đang ở `docs/sources/chapter1/data/chapter1.json` và nội dung kịch bản đọc được ở `docs/sources/chapter1/scripts/`.
- **Self-Check:** không đổi code/đặc tả/API; chưa chạy test vì chỉ tra cứu vị trí dữ liệu. Trạng thái: xong.

### T-017 — Đổi tên thư mục `features/game` → `features/play`
- Ngày giao: 16/10/2026 — người dùng: "2 folder game nằm ở vị trí dể bị nhầm lẫn, hãy đỗi tên để dể phân biệt hơn"; chọn phương án "Chỉ đổi features/game → features/play".
- **Kế hoạch:** mục đích — phân biệt trang React `/play` với thư mục Phaser `game/`; ảnh hưởng — `AppRouter.jsx` (1 import), `game/index.js` (1 chú thích), `docs/ARCHITECTURE.md`, `docs/chapter1/CHAPTER1_PLAN.md`, `CLAUDE.md` (thêm dòng phân biệt), PROJECT_MEMORY (DEC-011); rủi ro — sót import làm build lỗi (đã grep: không còn `features/game` trong code/tài liệu đang dùng), mất lịch sử git (dùng `git mv`).
- **Bước con:** B1 sửa import + tài liệu, ghi lên máy (xong) · B2 **người dùng** chạy `git mv` (phiên này không di chuyển/xóa được thư mục trên máy) · B3 **người dùng** chạy `npm run check` · B4 xác nhận lại.
- **Lưu ý:** giữa B1 và B2, `npm run dev` sẽ báo không tìm thấy `@/features/play/...` — bình thường, hết sau khi chạy `git mv`.
- **Self-Check:** không đổi logic, API, CSDL, test; lịch sử T-xxx cũ giữ nguyên đường dẫn cũ. Trạng thái: chờ B2–B3.

### T-018 — Đọc lại tài liệu và nguồn trước phần chính theo cốt truyện
- Ngày giao: 20/10/2026 — người dùng: "phần demo vừa rồi được đánh giá khá tích cực bây giờ chúng tôi sẽ bắt tay vào làm phần chính đúng với tuyến cốt truyện của game, trước tiên hãy đọc lại cái file .md và các file source để nắm rõ hướng đi và chờ yêu cầu của tôi"
- **Đã đọc (bản trên máy không đổi từ 16/10, bản sao khớp kích thước):** CLAUDE.md, PROJECT_MEMORY.md (toàn bộ A–H), PROGRESS_LOG.md, docs/ARCHITECTURE.md, docs/CONVENTIONS.md, docs/chapter1/CHAPTER1_MEMORY.md + CHAPTER1_PLAN.md; docs/sources: working-rules.md, Story.txt, Project.md; gói chapter1: README_FIRST, CLAUDE_INTEGRATION_PROMPT, DATA_CONTRACT, STORY_AND_GAMEPLAY_BIBLE (602 dòng), 5 kịch bản P1/P2/P3/FINAL/P4 (đủ), PLAYTEST_CHECKLIST.
- **Phát hiện:** `docs/ARCHITECTURE.md` dòng 61 (cây thư mục) còn `features/game/` — sót ở T-017; `docs/CONVENTIONS.md` mục 7 ghi nhánh `main/feature/*` trong khi thực tế làm trên `Nhan` → PR vào `master` (CLAUDE.md).
- **Self-Check:** chỉ đọc, không sửa code/tài liệu ngoài log. Trạng thái: xong, chờ yêu cầu.

### T-019 — Kế hoạch dự án + thiết kế Menu chính & Cài đặt (ảnh xem trước)
- Ngày giao: 20/10/2026 — người dùng: "hãy lên một bản kế hoạch chi tiết cho dự án hiện tại, bước tiếp theo tôi muốn là thiết kế một menu game trông có gu và hợp với game trinh thám … thêm vào phần lựa chọn setting … độ phân giải và cả ngôn ngữ gồm có tiếng việt và tiếng anh. sau đó hãy tạo ra một bức ảnh về phần menu để cho tôi xem trước. nếu tôi đồng ý thì mới bắt đầu lên kế hoạch code"
- REQ / nguồn: Project.docx §3.2 (New Game / Load Game / điều khiển âm thanh); yêu cầu 20/10 (cài đặt đồ họa, âm thanh, độ phân giải, ngôn ngữ VI/EN); bảng màu `game/ui/theme.js`.
- **Bước con 1 (xong):** tạo `docs/PROJECT_PLAN.md` [ĐỀ XUẤT — chờ duyệt]: hiện trạng, lộ trình A–F (A = Menu & Cài đặt, B = tích hợp Chương 1 WP-C1…C10, C = lưu server + Load Game, D = Admin, E = E2E + bảo vệ giai đoạn 1, F = Capstone 2/3), đặc tả Menu/Cài đặt, ảnh hưởng, rủi ro, đề xuất, câu hỏi Q-M1…Q-M5, các bước M1…M4.
- **Bước con 2 (xong):** ảnh xem trước = artifact Design "Menu The Unspoken" (2 artboard 1280×720, bấm được): Menu chính (Ván mới / Tiếp tục điều tra / Cài đặt, nút tắt tiếng, cảnh hành lang mưa + cửa 204 — ảnh nền là hình minh họa tạm dựng bằng CSS) và Cài đặt (3 tab Hiển thị / Âm thanh / Trò chơi; chọn English đổi nhãn giao diện ngay). Nhãn tiếng Anh chỉ là giao diện; KHÔNG dịch lời thoại. Không có tiết lộ cốt truyện.
- **File đã tạo/sửa:** `docs/PROJECT_PLAN.md` (mới), `PROGRESS_LOG.md` (mục này + ĐIỂM KHÔI PHỤC). Không sửa code, API, CSDL, cốt truyện.
- **Self-Check:** đặc tả trong bản thiết kế khớp PROJECT_PLAN §3.3; phần [ĐỀ XUẤT] (bố cục, phông, mặc định) chờ duyệt; số phiên bản để `[phiên bản]` (chưa có nguồn). Trạng thái: chờ duyệt ảnh + Q-M1…Q-M5.

### T-020 — Thực thi Menu chính & Cài đặt (DEC-012)
- Ngày giao: 20/10/2026 14:00 — người dùng: "tôi chốt thiết kế hiện tại, về phần tùy chĩnh setting về display, vì là game trên web nên tôi nghĩ nó không cần thiết hãy bỏ phần đó đi và giữ nguyên các phần còn lại, chốt phướng án và thực thi"
- **Bước con 1 (xong):** `docs/PROJECT_PLAN.md` — mục 3 đánh dấu ĐÃ CHỐT (DEC-012), bỏ tab Hiển thị, trạng thái Q-M1…Q-M5, kế hoạch code 3.9 (file mới/sửa, rủi ro, thứ tự). Bản thiết kế "Menu The Unspoken" cập nhật: màn Cài đặt còn 2 tab.
- **Bước con 2 (xong):** logic thuần + test — `game/systems/settings.js`, `i18n.js`, `menuNavigation.js`, `game/core/settingsStore.js`, `game/data/uiText.js` (VI/EN) + 4 file test.
- **Bước con 3 (xong):** giao diện — `MainMenuScene` làm lại, `SettingsScene` mới (2 tab), `ui/{MenuItem, IconButton, PanelButton, SegmentedControl, Slider, Toggle, ConfirmDialog, MenuBackdrop}.js`; áp dụng thiết lập vào `DialogueBox`/`DialogueScene` (tốc độ chữ, cỡ chữ, tự chuyển thoại) và âm thanh (`game/index.js`); i18n Preload/Room/Notebook/BadEnding/CredibilityBar; `useGameBridge` gửi `save:availability`; font JetBrains Mono (rút gọn 29 KB, OFL) + `@font-face` 3 font + README cách thêm 2 font còn thiếu.
- **Bước con 4 (xong):** tài liệu — ARCHITECTURE (cây thư mục, sửa dòng `features/game` sót từ T-017, luồng thiết lập), CLAUDE.md, PROJECT_MEMORY (DEC-012, REQ-020).
- **File đã tạo/sửa (đã ghi lên máy, 43 file):** xem `docs/PROJECT_PLAN.md` mục 3.9; thêm `game/ui/CredibilityBar.js` (nhãn uy tín theo ngôn ngữ).
- **Self-Check (thật sự đã chạy):** 11 file test / 63 ca qua (bộ chạy thay thế giả lập describe/it/expect — KHÔNG phải Vitest); ESLint 10 với bộ luật tối thiểu: 0 lỗi; Prettier 3.8.1 `--check src`: đạt; chạy game thật (Phaser 4.2.1 lấy từ node_modules trên máy) trong Chromium không giao diện: menu, hộp xác nhận Ván mới, Cài đặt 2 tab, đổi English + Lưu + tải lại trang (giữ English), thanh trượt nghe thử 0.4 rồi Esc trả 0.8, nút loa (mute + lưu), ↑ ↓ bỏ qua mục khóa, hội thoại cỡ 26 px / hiện ngay / tự chuyển sang màn điều tra, HUD + Sổ tay tiếng Anh — đều đúng. **Chưa chạy:** `npm run check` (Vitest, ESLint đầy đủ, Vite build) và trang React `/play` thật (dev server trên máy không mở được từ trình duyệt của AI). Trạng thái: chờ người dùng kiểm tra.
