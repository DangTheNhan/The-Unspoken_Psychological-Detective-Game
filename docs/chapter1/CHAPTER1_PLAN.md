# KẾ HOẠCH TÍCH HỢP CHƯƠNG 1 (T-012 → các tác vụ sau)

> Căn cứ: gói `CHAPTER_1_COMPLETE` (SRC-5, tóm tại `docs/chapter1/CHAPTER1_MEMORY.md`), PROJECT_MEMORY (DEC-005..008), hiện trạng repo sau T-011 (cấu trúc mới đã áp dụng, backend + MySQL chạy, `npm run check` 30/30).
> Trạng thái: **[ĐỀ XUẤT — chờ người dùng duyệt]**. Chưa sửa code nào. Các gói việc phụ thuộc Q1–Q5 ghi rõ ở cột "Chờ".

---

## 1. Mục đích
Đưa toàn bộ Chương 1 (Phase 1 → 2 → 3 → Final → 4 → dừng ở CH2_ENTRY) vào game Phaser 4.2.1 + React hiện có, **chạy từ dữ liệu** `chapter1.json` đã được kiểm chứng, đúng luật Press/Present/Credibility/Checkpoint của gói, lưu được tiến trình (offline + server), đạt checklist playtest 12 mục.

## 2. Hướng đi tối ưu và lý do

**Chọn: "Narrative engine dùng chung" — một bộ chạy graph JS thuần + các Scene Phaser chỉ làm phần hiển thị.**

| Phương án | Mô tả | Đánh giá |
|---|---|---|
| **A (chọn)** | Port Data Contract 2.0 thành module JS thuần `game/narrative/` (điều kiện, effect, transaction, Press/Present, deduction, checkpoint). Scene đọc node hiện tại và vẽ UI. `chapter1.json` nạp nguyên vẹn | Dữ liệu đã PASS 6255 assertion → chỉ cần engine đúng hợp đồng. Không gõ lại 1257 node. Test được bằng Vitest không cần Phaser. Chương 2–5 chỉ cần thêm JSON cùng định dạng. Khớp kiến trúc hiện có (logic thuần ở `systems/`/`core/`, scene mỏng) |
| B | Viết tay từng scene theo kịch bản Markdown | Trái yêu cầu "không hardcode lời thoại"; 44 000 ký tự thoại + ~110 cờ → rất dễ lệch, khó sửa lời sau này |
| C | Chuyển `chapter1.json` sang định dạng hội thoại tạm của T-007 | Mất condition/effect/Press/Present; phải tự viết lại logic → rủi ro cao, không lợi gì |

Nguyên tắc kèm theo:
- **Đúng hợp đồng trước, đẹp sau:** engine + test vàng (port 2 lượt chơi trọn chương của `validate_data.py` sang Vitest) phải xanh trước khi làm giao diện.
- **Adapter cho phần trình bày, không sửa dữ liệu:** `speaker`/`expression` → ảnh/hoạt ảnh qua bảng ánh xạ; dữ liệu thiếu `position` thì dùng bên đứng mặc định theo nhân vật.
- **State v2 là nguồn sự thật duy nhất:** thay `GameSession` cũ; save = snapshot state v2 (khớp `game_saves.save_data_json` LONGTEXT).

## 3. Thay đổi dự kiến (ảnh hưởng)

| Khu vực | Thêm mới | Sửa | Bỏ/thay thế |
|---|---|---|---|
| Dữ liệu | `frontend/public/assets/chapters/chapter1/{chapter1.json, evidence.json, statements.json, people.json, game-state.definitions.json}` | — | `public/assets/dialogues/chapter-1.json` (rỗng) — thay bằng file trên (Q3) |
| Engine thuần | `game/narrative/{expr.js, statePath.js, effects.js, storyRunner.js, crossExam.js, deduction.js, checkpoints.js, saveMigration.js}` + `*.test.js` | — | `data/dialogueData.js` (format tạm) |
| Trình bày | `game/data/speakers.js` (ánh xạ speaker/expression → sprite, bên đứng), `ui/ChoiceMenu.js`, `ui/InspectModal.js`, `ui/PresentPicker.js`, `ui/ChecklistPanel.js` | `ui/DialogueBox.js` (render dialogue/narration/action/ui khác kiểu), `ui/CharacterStage.js`, `data/characters.js` (landlord → HÒA) | `debug/demoDialogue.js` (giữ cho F9 hoặc bỏ) |
| Scene | `scenes/StoryScene.js` (bộ điều phối node → mở đúng scene/overlay) | `DialogueScene`, `RoomInvestigationScene` (hotspot từ node `investigation`), `NotebookScene` (4 tab đọc record + nguồn + revision), `DeductionScene` (bảng 8 ô), `BadEndingScene` (load checkpoint thật), `MainMenuScene` (New/Load) | — |
| Core | — | `core/GameSession.js` → bọc state v2; `core/runtime.js`; `systems/autosave.js` (giữ, DEC-010) | `systems/notebook.js` (cấu trúc mảng cũ) |
| React | — | `features/play/services/saveService.js`, `hooks/useGameBridge.js` (payload state v2) | — |
| Backend | (tùy chọn WP-H) seed `evidence_master` 12 dòng Ch1 | (ISS-29) cách lấy `userId` | — |
| Công cụ | `scripts/validate-chapter.py` (bản validator của gói) hoặc test JS tương đương | `docs/ARCHITECTURE.md`, `CONVENTIONS.md`, README | — |

## 4. Gói việc chi tiết

Thứ tự đã tính phụ thuộc; mỗi gói kết thúc bằng `npm run check` xanh + ghi PROGRESS_LOG.

### WP-C1 — Chốt quyết định & nhập dữ liệu *(Chờ: Q3, Q4 — Q1 đã chốt DEC-009)*
1. Ghi quyết định Q1–Q5 vào PROJECT_MEMORY (DEC mới), đóng ISS-02/07/15 nếu được duyệt.
2. Chép 5 file data vào `public/assets/chapters/chapter1/`; thêm kiểm tra SHA-256 theo MANIFEST.
3. Đưa validator vào repo (`scripts/validate-chapter.py`, chạy được bằng Python có sẵn) + lệnh trong README.
- **Xong khi:** validator PASS trên bản trong repo; Vite phục vụ được JSON.

### WP-C2 — Narrative engine thuần *(không chờ — làm được ngay sau khi Q3 duyệt)*
1. `expr.js`: AST đủ 15 toán tử + `literal/ref/predicate`; `ref` tới `/state`, `/input`, `/bindings`.
2. `statePath.js`: get/set theo JSON Pointer; flags vắng = false.
3. `effects.js`: set/increment/upsert_record/merge_record/collect_evidence/save_checkpoint với metadata nguồn (`source_node`, `source_step`, `collected_phase`, `source_kind`), revision, transaction all-or-nothing.
4. `storyRunner.js`: node hiện tại, `advance()`, `choose()`, router/next mảng, `__COMMIT`, khóa input theo event token, `committed_events` chống double commit, resume không phát lại effect, dừng ở `CH2_ENTRY`.
5. `crossExam.js`: Press (route đầu tiên), Present (chỉ thẻ đã thu có record; **route khớp đầu tiên theo thứ tự mảng**; refute/support/clarify 0 điểm, wrong −15 đúng một lần, blocked không submit).
6. `deduction.js`: draft 8 ô, thẻ chỉ hiện khi đủ điều kiện, nộp thiếu 0, sai −20 một lần + 1 phản hồi theo `feedbackPriority`, đúng → RECON; 4 nguồn EVIDENCE khác nhau.
7. `checkpoints.js`: lưu nguyên snapshot (không lồng), restore toàn bộ.
8. `saveMigration.js`: migrate khóa cũ (P1 1.1) + save hiện tại của game (chapter/credibility/notebook) → state v2; báo xung đột.
9. **Test vàng:** port 2 lượt chơi trọn chương + các ca chấm điểm của `validate_data.py` sang Vitest.
- **Xong khi:** test vàng xanh; ≥ các ca: wrong −15/support 0/blocked 0, Final thiếu/sai/đúng, restore checkpoint, P4 fallback ghi phase 4, P1 bỏ câu rửa mặt → mở ở P3.

### WP-C3 — Lớp trình bày hội thoại *(Chờ: Q5 cho ảnh thật)*
1. `speakers.js`: DETECTIVE (không hiện nhân vật hoặc chân dung nhỏ — đề xuất mục 6), HÒA → bộ `landlord` (ánh xạ 15 biểu cảm → smirk/stern/talk + kiểu nhép), LINH/HÀO/MINH/CẢNH SÁT → placeholder có nhãn "PLACEHOLDER"; "NGƯỜI ĐÀN ÔNG" dùng sprite Hào.
2. DialogueBox: 4 kiểu node (dialogue có tên, narration chữ nghiêng/không tên, action, ui dạng thông báo hệ thống); typewriter + nhép miệng giữ nguyên.
3. ChoiceMenu cho node `choice` + nút điều khiển (26 nhãn trong source-map).
- **Xong khi:** chạy trọn Phase 1 trong trình duyệt, đủ 4 lời khai, cảnh sát tới.

### WP-C4 — Điều tra phòng 204 *(Chờ: Q5 — background room204)*
1. RoomInvestigationScene đọc node `investigation`: 9 hotspot (rect placeholder tới khi có nền thật), InspectModal (ảnh + text, đóng giữa chừng không commit).
2. Nút "Trở ra hỏi chuyện" sáng khi `P2_CORE`; xác nhận khi thiếu khăn/hộp; quay lại từ P3 hub tới khi `samples_submitted`.
- **Xong khi:** 5 core theo nhiều thứ tự → P3; quay lại lấy khăn/hộp ghi `collected_phase=3`.

### WP-C5 — Đối chất Press/Present + Notebook
1. Overlay đối chất cho node `cross_examination`: danh sách statement đang có, Press, Present (mở PresentPicker từ Notebook), thông báo blocked miễn phạt, cập nhật thanh Uy tín.
2. NotebookScene 4 tab đọc state v2: Evidence (ảnh, mô tả, trạng thái, nguồn, phase thu), People (kèm observation), Timeline (precision/"khoảng"), Statements (revision/superseded); Unknown là trạng thái trong Evidence.
3. Record/source view, checklist panel, time skip (fade + dòng chữ), cảnh sát kiểm đồ/thu ống cũ dạng popup.
- **Xong khi:** đi hết Phase 3 tới `P3_READY`; double click không trừ 2 lần.

### WP-C6 — Final Deduction + tái dựng
1. DeductionScene: 5 nhóm/8 ô, chọn thẻ rồi chọn ô (kéo thả tùy chọn), xem nguồn, Nộp.
2. RECON_01–06 trên nền 204 + caption nguồn; commit `commit_ch1_final_notebook` rồi mới đặt cờ.
- **Xong khi:** thiếu 0 / sai −20 giữ draft / đúng → tái dựng → P4.

### WP-C7 — Phase 4, Bad Ending, kết chương
1. P4 hub + fallback xu/khảo sát/giấy khen + ký ức; checklist khi thiếu.
2. Bad Ending (P3_BAD/FD_BAD) → load `ch1_phase3_start` / `ch1_pre_final`.
3. Title Chapter 2 → dừng ở CH2_ENTRY, lưu `chapter1_complete`.

### WP-C8 — Lưu/tải *(Q2 đã chốt DEC-010; chờ ISS-29 cho phần server)*
1. Save = state v2 (bỏ checkpoint lồng), localStorage + `POST /api/game/save` (`saveDataJson` = state v2).
2. Load Game ở MainMenu; resume đúng node.
3. Autosave theo DEC-010 (REQ-030): mỗi 5 phút + sự kiện quan trọng — `collect_evidence`, `save_checkpoint`; luôn lưu sau mỗi commit chuyển phase/checkpoint. Dùng lại `systems/autosave.js`.
4. ISS-29: đề xuất riêng cách lấy `userId` (sẽ hỏi khi tới bước này — đụng API §4.3).

### WP-C9 — Asset thật *(Chờ: Q5)*
Background room201/hallway/room204, sprite 5 nhân vật còn thiếu, ảnh Inspect 12 Evidence + ảnh đối chiếu/báo cáo/khảo sát/giấy khen; đo lại tọa độ 9 hotspot (+ giấy khen ở hành lang); SFX cơ bản.

### WP-C10 — Kiểm thử & bàn giao
1. Vitest (engine + adapter), validator Python, Playwright tự động đi 2 lượt chơi trong trình duyệt.
2. Playtest tay theo 12 mục `PLAYTEST_CHECKLIST.md` + font tiếng Việt/kích thước hộp thoại.
3. Cập nhật docs, PROGRESS_LOG, PROJECT_MEMORY mục G; commit theo từng WP trên nhánh `Nhan`.

### WP-H (tùy chọn, sau) — Backend
Seed `evidence_master` 12 dòng Ch1 từ `evidence.json` (đúng schema §2.1: chapter_id, evidence_code, evidence_name, description); Admin tỷ lệ hoàn thành chương dùng `chapter1_complete`.

## 5. Rủi ro bug/lỗi phần mềm và cách phòng

| Rủi ro | Mức | Phòng / phát hiện |
|---|---|---|
| Engine hiểu sai hợp đồng (thứ tự route, increment, upsert giữ nguồn) → game chạy nhưng sai luật | Cao | Test vàng port từ validator; so kết quả từng bước với bản Python |
| Trừ điểm 2 lần do double click / rerender React / tween | Cao | Event token + `committed_events`; test riêng; khóa input khi đang commit |
| Load giữa đoạn phát lại effect (thu Evidence 2 lần, trừ điểm lại) | Cao | `resume` từ `current_node`, không replay; test load ở REPORT/RECOVER/RECON |
| File 836 KB làm chậm tải | Thấp | Nạp 1 lần ở Preload, cache; có thể bỏ `source-map.json` khỏi runtime (trùng text) |
| Save cũ (GameSession/notebook mảng) không đọc được | TB | `saveMigration.js` + test; báo xung đột, không tự chọn |
| Thiếu ảnh → hotspot lệch vật thể, placeholder lẫn vào bản nộp | TB | Nhãn "PLACEHOLDER" rõ; checklist asset trong WP-C9 |
| Font tiếng Việt lỗi dấu trong canvas | TB | Kiểm tra sớm ở WP-C3 (font hệ thống hiện đang dùng) |
| Lộ spoiler (đáp án/ giờ actual) qua UI debug hoặc tooltip | TB | Không render `answerKey`, metadata; debug overlay chỉ ở dev |
| Cấu trúc lệch Project.docx bản mới §3.1/§4.1 | Thấp | Đã chốt DEC-009 (giữ cấu trúc); bảng ánh xạ ở `docs/ARCHITECTURE.md` mục 3a |
| Phạm vi lớn → làm dở dang nhiều phần | TB | Mỗi WP chạy được độc lập, commit riêng, điểm khôi phục rõ |

## 6. Đề xuất hướng phát triển (chờ duyệt, không tự áp dụng)
- Thám tử không có sprite đứng: chỉ hiện tên "Bạn"/không tên khi nói (hợp ngôi thứ hai) — hoặc chân dung nhỏ nếu có ảnh.
- Bên đứng mặc định: NPC đang nói đứng phải; khi hai NPC luân phiên trong một cảnh, người mới vào đứng trái.
- Dùng tiếng "bíp" theo nhân vật cho thoại (đã đề xuất trước) thay lồng tiếng.
- Thêm "Lịch sử thoại" (backlog) — tiện đối chiếu lời khai, không đổi dữ liệu.
- Validator chạy trong `npm run check` (qua test JS) để mọi chỉnh sửa lời thoại sau này không làm gãy graph.

## 7. Điểm cần người dùng xác nhận

| # | Câu hỏi | Mục đích | Ảnh hưởng | Rủi ro nếu không chốt |
|---|---|---|---|---|
| ~~Q1~~ **ĐÃ TRẢ LỜI 13/10 → DEC-009: giữ nguyên cấu trúc hiện tại** (ánh xạ ở `docs/ARCHITECTURE.md` mục 3a) | `reference/Project.docx` (bản mới, có §3.1/§4.1, Java) có thay SRC-1 không? Nếu thay: **giữ cấu trúc đã áp dụng** (ghi là sai khác được duyệt) hay **đổi lại** theo §3.1 (api/pages/redux…) và §4.1 (controller/service…)? | Thống nhất nguồn kỹ thuật | Đổi lại = làm lại toàn bộ tái cấu trúc T-002 + thêm Redux; giữ = chỉ ghi DEC + bảng ánh xạ | Tài liệu và code mâu thuẫn khi bảo vệ đồ án |
| ~~Q2~~ **ĐÃ TRẢ LỜI 13/10 → DEC-010: giữ autosave** (5 phút + sự kiện quan trọng, REQ-030) | Bản mới bỏ câu "auto save 5 phút / sự kiện quan trọng". Giữ autosave hay chỉ lưu thủ công + lưu khi chuyển phase/checkpoint? | Quyết định REQ autosave | Sửa `systems/autosave.js`, runtime | Code còn tính năng không có căn cứ, hoặc mất tiến trình khi crash |
| Q3 | Dùng Data Contract 2.0 + `chapter1.json` làm định dạng kịch bản chính thức (đóng ISS-07), bỏ định dạng tạm T-007? | Có dữ liệu chạy thật | Thêm engine, đổi DialogueScene; định dạng tạm bị thay | Không thể tích hợp Chương 1 |
| Q4 | Văn bản Phase 2/3/Final/4 trong gói được đưa vào game như hiện có (Bible ghi P2/P3 "chờ duyệt văn bản")? | Không tự ý dùng nội dung chưa duyệt | Nếu chưa duyệt: chỉ tích hợp P1 trước | Phải chỉnh lại sau; lỡ dùng nội dung bạn chưa đồng ý |
| Q5 | Asset: bạn gửi background/sprite (gói ghi "đã có demo, background và nhân vật cơ bản" nhưng repo mới có ảnh Hòa), hay cho phép placeholder có nhãn trong lúc chờ? | Chạy được giao diện | Placeholder: làm tiếp được ngay, thay ảnh sau | Không có ảnh thì không đo được hotspot thật |
