# CHAPTER 1 — BỘ NHỚ GÓI `CHAPTER_1_COMPLETE` (SRC-5)

> Bản ghi nhớ đã đọc toàn bộ gói `CHAPTER_1_COMPLETE.zip` (người dùng cung cấp 13/10/2026). Mục đích: **không phải đọc lại gói** ở các lần làm việc sau. Nội dung trùng lặp không chép lại; chỗ cần nguyên văn thì trỏ tới file gốc trong `docs/sources/chapter1/`.
> Nhãn: [NGUỒN] = gói quy định · [THIẾU] = gói chưa có · [ĐỀ XUẤT] = AI đề xuất, chờ duyệt · [ĐÃ DUYỆT] = quyết định người dùng/người thiết kế ghi trong gói.

---

## 0. Kết quả đọc và kiểm tra gói

| Hạng mục | Kết quả |
|---|---|
| Số file | 29 file, tổng ≈ 1,8 MB. Đã đọc hết: 6 tài liệu gốc, 5 kịch bản, 8 file data, 4 file validation, 6 file reference |
| Toàn vẹn | SHA-256 của cả 28 file khớp `MANIFEST.json` |
| Validator của gói | Đã chạy lại `validation/validate_data.py` (bản sao): **PASS** — 1257 node, 43 Statement, 12 Evidence, 6255 assertion, 0 node không tới được, 0 target hỏng |
| Trùng lặp | `CHAPTER_1_ALL_SCRIPTS.md` = ghép nguyên văn 5 file `scripts/*.md` (+ 4 dòng đầu) → không lưu lại. `reference/Story.txt` giống hệt `docs/sources/Story.txt`. `data/source-map.json → runtimeText` = trùng nguyên văn `text` trong `chapter1.json` (chỉ để truy nguồn) |
| Chưa kiểm thử | Gói tự ghi: chưa chạy trên Phaser/React thật, chưa có tọa độ hotspot, chưa có asset thật |

### 0.1 Thứ tự ưu tiên khi dùng gói [NGUỒN — README_FIRST]
1. Bible 1.3 (đặc biệt mục J) + kịch bản `scripts/` quyết định **nội dung**.
2. `data/chapter1.json` quyết định **đường chạy runtime**; thứ tự node trong mảng không phải thứ tự chơi.
3. `reference/` chỉ để đối chiếu lịch sử; **không** lấy `Phase.docx` cũ ghi đè các sửa logic đã duyệt.
4. Không đưa Story/Bible toàn truyện vào state hiển thị (chứa bí mật Ch2–5).

### 0.2 Bản đồ file (đã lưu tại `docs/sources/chapter1/`)
| File | Vai trò |
|---|---|
| `README_FIRST.md` | Cách đọc gói, thứ tự ưu tiên |
| `CLAUDE_INTEGRATION_PROMPT.md` | 11 yêu cầu tích hợp (tóm ở mục 9) |
| `DATA_CONTRACT.md` | Hợp đồng engine 2.0 (tóm ở mục 7) |
| `STORY_AND_GAMEPLAY_BIBLE.md` | Bible 1.3 — canon + luật + quyết định D01–D18, I, J (tóm ở mục 2–6) |
| `scripts/CHAPTER_1_*.md` | Kịch bản đọc được cho người: P1 (bản 1.2), P2 (1.0), P3 (1.0), Final (1.0), P4 (1.0) |
| `data/chapter1.json` | **Dữ liệu runtime** (graph 1257 node, 836 KB) |
| `data/chapter.schema.json` | JSON Schema của graph |
| `data/evidence.json`, `statements.json`, `people.json` | Danh mục chỉ đọc (không phải đồ đã thu) |
| `data/game-state.definitions.json` | State ban đầu (schema v2), flags, phạt, checkpoint |
| `data/assets.integration.json` | Khung nối asset (toàn `null`) |
| `data/source-map.json` | Truy nguồn thoại + 26 nhãn nút điều khiển UI |
| `validation/` | Validator Python, kết quả, checklist playtest 12 mục |
| `reference/` | Project.docx **bản mới**, Phase.docx (F gốc), MASTER_PROMPT, 2 tài liệu lịch sử |

---

## 1. Thay đổi so với nguồn đang dùng (cần lưu ý)

### 1.1 `reference/Project.docx` là **phiên bản mới** của SRC-1 (45 326 byte, khác bản 39 613 byte đang ở `docs/sources/`)
| Điểm khác | Bản cũ (SRC-1 hiện tại) | Bản mới trong gói | Ảnh hưởng |
|---|---|---|---|
| §1.1 Backend | "Spring Boot & **Javascript**" | "Spring Boot & **Java**" | Khớp DEC-006 → đóng được ISS-02 |
| §3.1 Cấu trúc frontend | Không có | Có: `src/{api, components, game/{config.js, scenes, entities, managers}, pages, redux/slices}, App.jsx`; `public/assets/{images, audio, dialogues (chapter_1.json…)}` | **Mâu thuẫn** với cấu trúc đã áp dụng (DEC-007/T-009: `app, features, shared, game/{core,systems,ui,data…}`), có **Redux** (chưa dùng) |
| §4.1 Cấu trúc backend | Không có | Layered: `config, controller, dto, model, repository, service` (AuthController, GameProgressController, EvidenceController, BugReportController…) | **Mâu thuẫn** với package-by-feature đã áp dụng (T-009) |
| §5.2 kịch bản E2E | Có câu "save thủ công bất kỳ lúc nào / auto save mỗi 5 phút hoặc sự kiện quan trọng" | **Không còn** câu này | REQ autosave 5 phút (đã code `systems/autosave.js`) mất căn cứ trong bản mới |
| Cuối file | — | Có thêm khối "User prompt: tạo thành 1 file…" + bản Markdown lặp lại toàn báo cáo (kèm `[cite: 2]`) | Là bản lặp, không phải nguồn độc lập (Bible G32) |
→ Q1 đã chốt (DEC-009: giữ cấu trúc hiện tại). Q2 đã chốt (DEC-010: giữ autosave 5 phút + sự kiện quan trọng).

### 1.2 Các file reference khác
- `Phase.docx` = **F gốc** (Phase 1–3 + Final cũ). Đã bị Bible R/D01–D18 sửa (ví dụ: tráo 20:45–20:50 → 20:50–20:54; đồng xu túi quần → dưới nệm; Final cũ ống+hộp+giờ Linh → gói R). Chỉ dùng tham chiếu lịch sử.
- `MASTER_PROMPT.txt` = prompt viết kịch bản (vai trò, phong cách noir Việt, ngôi "bạn", quy tắc Press/Present, định dạng A–H). Đã được áp dụng vào kịch bản; không cần đọc lại trừ khi viết thêm nội dung.
- `LOGIC_REPAIR_HISTORICAL.md`, `PHASE_4_PROPOSALS_HISTORICAL.md` = hồ sơ đề xuất G01–G32/D01–D18 và Phase 4 A/B — **đã chốt** trong Bible (khuyến nghị B cho hầu hết D, Phase 4 = A+S1+S2).
- Gói ghi engine "React + **Phaser 3**"; dự án dùng **Phaser 4.2.1** (DEC-005). Gói cho phép viết adapter khi tên kỹ thuật khác — không đổi nội dung.

---

## 2. Canon Chương 1 (sự thật tác giả — KHÔNG hiển thị sớm cho người chơi)

- **Nạn nhân:** Tùng, phòng 204. Làm "khảo sát tiện ích" thật ra là thu thông tin người nợ/dễ bị ép bán cho mạng lưới; được trừ nợ + cấp **đồng xu thẻ nội bộ**; về sau áy náy, cảnh báo người thuê đừng ký giấy.
- **Thủ phạm trực tiếp:** **Minh** (bạn thân) — lấy ống hít cũ, đặt ống được giao (chất nhóm hóa chất vệ sinh), bị ép vì **nợ + con gái bị giữ**. Nguồn công cụ: công ty vệ sinh công trình thuộc mạng lưới [tên/người giao/nơi giữ con tin = THIẾU].
- **Hòa** (chủ trọ — chính là "ông chủ trọ" đã có ảnh `landlord-*`): vào 20:55 lấy tiền **nhiều hơn khoản nợ**, biên nhận chỉ ghi khoản nợ; nói dối chưa vào. Không thấy Tùng (Tùng sau vách).
- **Linh** (205): vào ~21:05 trộm đồng hồ, thấy Tùng gục/cào cổ còn sống, bỏ chạy. Nói dối ngủ từ 20:00.
- **Hào:** thu nợ phòng 203 cho **Vũ**, đứng hút thuốc sát 204, lượt ~21:20 có đối chứng; không ngoại phạm cả đêm; không nêu tên Vũ.
- Không ai di chuyển xác. Tùng dùng ống ở bàn, gục sàn cạnh giường. Giờ chết: sau lần Linh thấy, trước ~21:30 (không chốt phút).
- Main mystery gieo ở Ch1: đồng xu (giống hình vết máu nhà thám tử 15 năm trước), giấy khen chữ ký **Khang**, tờ khảo sát, Hào thuộc Vũ. Em gái: chỉ là **niềm tin đã chết** của thám tử, không xác nhận.

### 2.1 Actual timeline [ĐÃ DUYỆT — Bible B1]
| Giờ | Sự kiện |
|---|---|
| ~20:45 | Minh tới 204 (đã có ống được giao) |
| 20:50–20:55 | Tùng rửa mặt **sau vách/rèm** góc phòng |
| trong 20:50–20:54 | Minh tráo ống, bóc hộp bỏ thùng rác, sót mảnh nắp giấy trong túi áo khoác |
| ~20:54 | Minh rời; Hòa thấy Minh xuống cầu thang; Minh giấu ống cũ ở hốc chân cầu thang tầng trệt |
| 20:55–20:56 | Hòa vào khu bàn lấy tiền, để biên nhận 20:55; Tùng còn lau mặt sau vách |
| ~20:57 | Tùng ra khu bàn |
| ~21:03–21:05 | Cơn khó thở, dùng ống ở bàn, gục sàn cạnh giường |
| ~21:05 | Linh lấy đồng hồ, thấy Tùng còn sống, bỏ chạy |
| ~21:20 | Hào thu nợ 203, hút thuốc sát 204 |
| ~21:30 | Hòa phát hiện, báo cảnh sát + gọi Minh |
| 21:35 | Mở cảnh: Hòa gõ cửa phòng 201 (thám tử) |
| ~21:45 | Cảnh sát tới (chỉ là nhịp thiết kế; Player Timeline ghi "Sau lượt hỏi") |

**Quy tắc kiến thức người chơi:** chỉ ghi giờ có nguồn lời/giấy; không bao giờ hiển thị "20:50–20:54", "20:54", "21:00 lên cơn", "chết 21:20". Slot WHEN của Final dùng **quan hệ sự kiện**.

### 2.2 Lời khai ban đầu (Phase 1)
Hòa: chỉ lên một lần ~21:30, chưa vào · Linh: ngủ từ ~20:00, không biết gì · Hào: chỉ đi ngang 204 để thu nợ 203, ~21:20 · Minh: tới ~20:45, rời trước 21:00, Tùng bình thường; chuyện riêng; Tùng bảo đi rửa mặt.

---

## 3. Evidence (12 ID — giữ nguyên chữ hoa/thường)

Cảnh sát giữ vật thật; "thu" = lưu ảnh/bản ghi được phép. Mỗi ID một thẻ. Danh mục ≠ đã thu.

| ID | Nơi / cách có | Phase thu | Bắt buộc | Chứng minh được / KHÔNG đủ |
|---|---|---|---|---|
| EV_LooseLock | Ổ khóa tay nắm tròn mặt trong cửa 204 (HP_LOCK) | P2 | Core thoát P2 | Vào được không phá cửa / không chỉ ra ai, không ngoại phạm |
| EV_WetTowel | Khăn ướt lạnh, vòi nhỏ giọt, bồn **sau vách/rèm** (HP_SINK) | P2 (hoặc quay lại P3a) | Trước Minh R2 | Có dùng bồn / không đo phút, không chỉ người |
| EV_NeckScratches | Ba vết cào cổ, ảnh cảnh sát (HP_NECK) | P2 | Core | Phù hợp tự cào khi khó thở / không pháp y |
| EV_Inhaler | Ống hít xanh nhạt, nắp mở, trên bàn (HP_INHALER) | P2 | Core | Hiện trạng / không biết nội dung, ai dùng |
| EV_InhalerBox | Hộp ống hít mới đã bóc, thùng rác dưới bàn (HP_TRASH) | P2 (hoặc P3a) | Trước Minh R2 | Có mở hộp / không chỉ người, giờ |
| EV_RentReceipt | Biên nhận giấy than hồng, chữ ký Hòa, **20:55**, dưới gạt tàn (HP_RECEIPT) | P2 | Core | Bác lời Hòa (cùng lời nhận) / không ngoại phạm thuốc |
| EV_MissingWatch | Vòng sạch trên bụi mặt tủ đầu giường, cạnh đồng hồ báo thức nứt (HP_DUST) | P2 | Core | Có đồ bị lấy / không tự chỉ Linh |
| EV_BoundaryCoin | Đồng xu xỉn khắc mốc ranh giới, **dưới nệm** (HP_BED, phải chọn "Nhờ cảnh sát kiểm tra") | P2/P3 hoặc fallback P4 | Trước kết Ch1 | `status=unknown`; không dùng buộc Minh |
| EV_PackagingMatch | Mảnh nắp giấy trong áo khoác Minh khớp mép rách hộp 204 (P3_POLICE_CHECK) | P3a | Final | Minh từng xử lý hộp / không độc tính, giờ, ý định |
| EV_OriginalInhaler | Ống cũ ở hốc chân cầu thang theo chỉ dẫn Minh; nhãn khớp hồ sơ thuốc Tùng (P3_RECOVER) | P3a | Final | Kiểm chứng lời nhận / không chỉ người pha chất |
| EV_MedicineAnalysis | Báo cáo sau time skip: ống bàn ≠ thuốc nhãn (nhóm hóa chất vệ sinh); ống cũ phù hợp; **có phần liên hệ nạn nhân** (P3_REPORT) | P3b | Final | Bác "thay thuốc bình thường" / không tên công ty, ý thức Minh |
| EV_KhangCertificate | Ảnh giấy khen quỹ hỗ trợ khu trọ, chữ ký Khang, tường hành lang (P3_CERTIFICATE hoặc fallback P4) | P3/P4 | Trước kết Ch1 | Mẫu chữ ký cho Ch4–5 / không buộc tội, không zoom nét khuyên |

Không phải Evidence: tờ "Khảo sát Cư dân Khu Trọ" (bảng nỉ, HP_BOARD) → observation `OBS_P2_SURVEY`; quan sát dép/túi Hòa, cổ tay/eyeliner Linh, vị trí Hào, ánh nhìn Minh → observation.

Bộ danh sách: P2 core = LooseLock, NeckScratches, Inhaler, RentReceipt, MissingWatch · CASE7 = core + WetTowel + InhalerBox · Gửi mẫu cần CASE7 + PackagingMatch + OriginalInhaler · Final cần thêm MedicineAnalysis.

---

## 4. Statements (43 ID), Observations, Timeline, People

- **P1 (11):** ST_P1_HOA_INITIAL / HOA_CALLS / HOA_DOOR · LINH_INITIAL / LINH_TIME · HAO_INITIAL / HAO_TIME / HAO_STANDING · MINH_INITIAL / MINH_TOPIC / MINH_WASH.
- **P3 (27):** HOA_REPEAT, HOA_RECEIPT_DEFENSE, HOA_ENTRY, HOA_EXCESS, HOA_SAW_MINH · LINH_REPEAT, LINH_WATCH_DEFENSE, LINH_THEFT, LINH_DISTRESS, LINH_FLED · HAO_VISIT, HAO_EMPLOYER, 203_CORROB (POLICE) · MINH_VISIT_DETAIL, MINH_WASH_SCOPE, MINH_MEDICINE, MINH_BOX_UNKNOWN, MINH_NO_HANDLING, MINH_OPPORTUNITY, MINH_PARTIAL, MINH_OLD_LOCATION, POLICE_OLD_RECORD, MINH_NORMAL_REPLACEMENT, MINH_ACT, MINH_COERCION, MINH_IGNORANCE, REPORT_SCOPE.
- **P4 (5):** ST_P4_MINH_DEBT, MINH_HOSTAGE, HAO_COIN_TYPE (S1), LINH_SURVEY_ACCOUNT, LINH_WARNING (S2 — `claimed_indirect`).
- Nội dung 1 dòng mỗi statement: `docs/sources/chapter1/data/statements.json`. Trạng thái: `claimed`, `corroborated_visit`, `professional_record`, `claimed_indirect`; statement bị sửa → `superseded` (giữ lịch sử/revision).
- `statementRules` có cho 38/43 statement (5 statement P4 không có Press/Present — Phase 4 không đối chất).
- **Observations (10):** OBS_HOA_SHOES, OBS_HOA_POCKET, OBS_LINH_WRIST, OBS_LINH_MAKEUP, OBS_HAO_POSITION, OBS_MINH_GAZE, OBS_P2_SINK, OBS_P2_SURVEY, OBS_P3_LINH_WATCH, OBS_P4_COIN_MEMORY.
- **Timeline (13):** TL_P1_OPENING (21:35, quan sát), TL_P1_HOA_DISCOVERY, TL_P1_LINH_SLEEP, TL_P1_HAO_ARRIVAL, TL_P1_MINH_VISIT, TL_P1_POLICE ("Sau lượt hỏi"), TL_P2_RECEIPT (giờ ghi trên giấy), TL_P3_HOA_ENTRY, TL_P3_MINH_BEFORE_HOA, TL_P3_LINH_THEFT, TL_P3_LINH_DISTRESS, TL_P3_HAO_VISIT, TL_P3_SWAP (quan hệ, không phút). Mỗi thẻ có `precision`, `source`, `status`, `display_time`; giờ ước lượng luôn hiện "khoảng".
- **People (5):** PEO_HOA (Chủ trọ), PEO_LINH (Hàng xóm 205), PEO_HAO (Đến thu nợ theo lời khai — chỉ ghi tên sau khi Hào tự giới thiệu; trước đó UI là "NGƯỜI ĐÀN ÔNG", cùng sprite Hào), PEO_MINH (Bạn thân Tùng), PEO_TUNG.
- `case_conclusions.CH1` = kết luận sau Final (không phải Evidence, không tab thứ 5).

---

## 5. Luồng chơi từng Phase (cốt lõi; nguyên văn ở `scripts/`)

**Phase 1 — Mở cảnh & lời khai (≈203 node).** 201 lúc 21:35 → nhìn 204 từ bậu cửa (không vào) → Hòa bắt buộc trước → HUB tự do Linh/Hào/Minh + Notebook + Hỏi lại Hòa + Kết thúc. Mỗi NPC menu A/B (hỏi 1 lần rồi ẩn) + C kết. Không Press/Present/Evidence, credibility 100. Gate `P1_ALL_INITIAL` (4 initial). Thiếu → `P1_WAIT_LOCKED` không phạt. Kết: cảnh sát tới, giăng băng → P2.

**Phase 2 — Khám 204 (≈161 node).** Cảnh sát cho quan sát, tự xử lý/chụp. 9 hotspot độc lập (HP_LOCK, SINK, NECK, INHALER, TRASH, RECEIPT, DUST, BED, BOARD), mỗi cái mở Inspect 12 trường. Đủ 5 core mới sáng nút "Trở ra hỏi chuyện" (không tự chuyển). Thiếu khăn/hộp: cảnh báo có thể quay lại. Kết → P3, mở Press/Present, **checkpoint `ch1_phase3_start`**.

**Phase 3 — Đối chất (≈692 node; 3a → time skip → 3b).**
- HUB: Hòa/Linh/Hào/Minh, Notebook, **Quay lại 204** (đến khi gửi mẫu), Làm việc với cảnh sát, Giấy khen (tùy chọn), Mở Final khi đủ.
- **Hòa:** Press H1 → Present EV_RentReceipt (H2 → nhận vào) → H3 phạm vi/tiền vượt → H4 thấy Minh xuống trước → `hoa_resolved`. EV_LooseLock = support 0 điểm.
- **Linh:** Press L1 → Present EV_MissingWatch (L2, lộ đồng hồ, chống chế "của tôi") → Press L3 nhận trộm ~21:05 → L4 thấy Tùng gục/cào, không thấy dùng ống → `linh_resolved`.
- **Hào:** Press A1 vị trí, A2 thu nợ/giờ, A3 người thuê (từ chối) → đề nghị/nhận đối chứng 203 (A4) → `hao_resolved`. **Present refute bị tắt** cho Hào (không thẻ bác hợp lệ).
- **Minh:** R1 (giờ; nếu chưa có thì mở ST_P1_MINH_WASH, recovery) → R2 (cần CASE7; Present khăn = support) → R3A EV_Inhaler (clarify) → R3B EV_InhalerBox (clarify, mở NO_HANDLING) → R4 (cần 3 vai xong; đối chiếu 3 lời Hòa/Linh/Hào) → **Cảnh sát kiểm đồ** → EV_PackagingMatch → R5A Present mảnh (refute) → nhận từng phần + "thay thuốc bình thường" → Press chỗ giấu → cảnh sát thu → EV_OriginalInhaler → OLD_REVIEW (support) → **Gửi mẫu** (khóa quay lại 204) → time skip "Một thời gian sau…" → báo cáo → EV_MedicineAnalysis (`victim_link_confirmed`) → R5B Present báo cáo (refute NORMAL_REPLACEMENT) → nhận hành vi → R5C Press → nhận bị ép + "không biết sẽ chết" (claimed).
- Kết: `P3_READY` → chọn mở Final → **checkpoint `ch1_pre_final`**.

**Final Deduction (≈78 node + RECON 16).** Bảng 5 nhóm/8 ô: WHO, WHAT, WHEN, WHY (1 thẻ mỗi nhóm) + EVIDENCE 4 vai (ED_CONTACT, ED_REMOVAL, ED_CONTENT, ED_ACCOUNT). Chỉ chấm khi **Nộp**; thiếu ô 0 điểm; sai đủ ô **−20 một lần**, giữ draft, 1 phản hồi theo thứ tự ưu tiên WHAT→WHO→WHEN→WHY→ED_CONTACT→REMOVAL→CONTENT→ACCOUNT, không lộ đáp án. Đúng → RECON_01–06 → `commit_ch1_final_notebook` → P4.
- **Answer key:** WHO `DC_WHO_MINH` · WHAT `DC_WHAT_SWAP` · WHEN `DC_WHEN_WASH_BEFORE_EXIT` · WHY `DC_WHY_COERCION_CLAIM` · ED_CONTACT `EV_PackagingMatch` · ED_REMOVAL `EV_OriginalInhaler` · ED_CONTENT `EV_MedicineAnalysis` · ED_ACCOUNT `ST_P3_MINH_ACT` (4 nguồn phải khác nhau). Thẻ sai/thiếu và câu phản hồi: `scripts/CHAPTER_1_FINAL_DEDUCTION.md` mục B, D.

**Phase 4 — Hậu quả (≈104 node).** Không Present, không phạt. Hỏi Minh nợ + con tin; xem ảnh xu (fallback P4_COIN_RECORD nếu chưa có) → ký ức hình vết máu (OBS_P4_COIN_MEMORY); xem ảnh khảo sát (fallback); Hào nhận loại thẻ (S1); Linh thuật lời Tùng + cảnh báo (S2); Hòa phản ứng (tùy chọn); giấy khen (fallback). Gate `P4_CLOSE_READY` thiếu → checklist, không phạt. Kết: `chapter1_complete` → title "CHAPTER 2 — CON HẺM NƠI QUÁN BAR" → dừng ở **`CH2_ENTRY`** (ranh giới ngoài, chưa có nội dung).

---

## 6. Luật gameplay chốt [ĐÃ DUYỆT — Bible D16, E; game-state.definitions]

| Luật | Giá trị |
|---|---|
| Credibility | Bắt đầu 100; `max(0, c − ΔP)`; không thưởng, không reset khi qua phase/load |
| Press / đọc sổ / Inspect / Phase 4 | 0 |
| Present đúng (refute/support/clarify) | 0 |
| Present sai thật vào target đang mở | **−15**, đúng một lần mỗi sự kiện |
| Present vào thẻ chưa thu / vòng khóa (`blocked`) | 0, không submit |
| Final nộp sai đủ ô | **−20**/lượt nộp (không theo ô) |
| Uy tín = 0 | Bad Ending (P3_BAD / FD_BAD) → Load checkpoint thật (`ch1_phase3_start`, `ch1_pre_final`), khôi phục **nguyên snapshot** |
| Checkpoint | 2 cái; `overwrite=false`; không lồng snapshot |
| Chống double click | Mỗi event 1 token, khóa input, commit transaction một lần |

Các ΔP trên nằm trong khoảng 15–30 của Project.docx §3.3 → đóng ISS-15 (bảng ΔP).

---

## 7. Data Contract 2.0 (tóm tắt để code engine)

- **Node types (16):** dialogue(speaker, expression, text, next) · narration · action · ui · router · choice(choices{text,condition,targetNode}) · investigation(hotspots, choices) · cross_examination(speaker, statementIds, statementRules, choices) · notebook_view · record_view/source_view · deduction · notebook_update(commitHandlerId) · checklist(predicateId) · checkpoint_restore(checkpointId) · transition(conditions, effects, next).
- Thống kê: dialogue 542, router 466, action 100, narration 79, source_view 20, choice 16, ui 12, transition 7, cross_examination 4, record_view 4, checkpoint_restore 2, còn lại 1 mỗi loại. Node `…__COMMIT` gom effect ở cuối đoạn.
- **next:** string hoặc mảng `{conditions, targetNode}` → lấy cái đúng đầu tiên.
- **Condition AST:** `literal`, `ref` (`/state/...`, `/input/sourceId`, `/bindings/...`), `predicate`, `op` ∈ all, any, not, exists, contains, eq, ne, gt, gte, lt, lte, add, subtract, max, min. Flag vắng = false; **không dựng record thiếu để vượt guard**.
- **19 predicate:** P1_ALL_INITIAL, P2_CORE, CASE7, ROLES_DONE, R4_READY, PACKAGING_READY, SAMPLES_READY, FINAL_READY, P4_CLOSE_READY, R4_ALL, P4_ENTRY_READY, PEOPLE_BINDINGS_READY, SOURCES_READY, ENTRY_READY, DRAFT_COMPLETE, ANSWER_CORRECT, HANDOFF_READY, SOURCE_SELECTED_AVAILABLE, SELECTIONS_AVAILABLE.
- **Effects:** set, increment (after là giá trị cuối), upsert_record (tạo 1 lần, lưu `source_node`, `source_step`, `collected_phase`, `source_kind`; không đổi nguồn lần đầu), merge_record (giữ revision), collect_evidence (record + thêm ID vào `evidence_collected` cùng transaction), save_checkpoint. Thống kê: set 145, upsert 80, merge 22, collect 14, save_checkpoint 2, increment 2.
- **Press/Present:** `statementRules[sid]` = condition + press.routes + present{enabled, condition, routes[{evidenceId, condition, targetNode, result: refute|support|clarify|wrong|blocked, credibilityPenalty}]}. **Lấy route khớp đầu tiên theo thứ tự mảng** (đúng như validator; 5 route `blocked` đứng sau route `wrong` cùng thẻ ở NO_HANDLING/NORMAL_REPLACEMENT là không bao giờ tới — không được tự sắp xếp lại theo loại).
- **Bindings:** people (`/people/PEO_*`, chỉ tồn tại khi record có), checkpoints (`/checkpoints/ch1_*`), notebook.finalUpdate = handler `commit_ch1_final_notebook` (phải có thật trong engine).
- **runtimePolicy:** inputLock atomic_event · restoreCheckpoint whole_snapshot · resume tại current_node, không phát lại effect đã commit · sourceView chỉ record đã có · dừng nếu target chưa triển khai (CH2_ENTRY) · phase3RevisitEnds = samples_submitted · 4 tab Notebook.
- **State v2** (`game-state.definitions.json#/initialState`): `schema_version, chapter, current_phase, current_node, credibility, phase3_segment, scene_location, evidence_collected[], evidence_records{}, statements{}, observations{}, timeline{}, people{}, case_conclusions{}, flags{~110 cờ}, checkpoints{}, deduction{draft, attempt_count, result, reconstruction_node}, committed_events[]`.
- Migrate save cũ (P1 bản 1.1): phase→current_phase, node→current_node, notebookUnlocked→flags.notebook_unlocked, room204Entered→flags.room204_entered, evidence→evidence_collected; xung đột → báo, không tự chọn.

---

## 8. Asset cần nối [NGUỒN — assets.integration.json]

| Loại | Cần | Hiện có trong repo |
|---|---|---|
| Background | room201, hallway (có cửa 204, lan can, cầu thang, giấy khen trên tường), room204 (cửa, bàn+thùng rác, bồn sau vách/rèm, giường+tủ, bảng nỉ) | Chưa có |
| Sprite | DETECTIVE, HÒA, LINH, HÀO (= NGƯỜI ĐÀN ÔNG trước khi biết tên), MINH, CẢNH SÁT | **Chỉ HÒA** (`landlord-smirk/stern/talk`) |
| Biểu cảm dùng trong thoại | HÒA 15 · LINH 14 · MINH 13 · HÀO 7 · DETECTIVE 6 (Attentive, Calm, Gentle, Neutral, Quiet, Thoughtful) · NGƯỜI ĐÀN ÔNG 2 · CẢNH SÁT 2 | Hòa có 3 ảnh → cần bảng ánh xạ |
| Ảnh Inspect/hồ sơ | 12 Evidence + ảnh đối chiếu mảnh hộp + báo cáo + ảnh khảo sát | Chưa có |
| Hotspot geometry | 9 hotspot room204 (+ giấy khen ở hallway) | `null` — phải đo theo background thật |
| Âm thanh gợi ý | mưa, gõ cửa, bước chân, bật lửa, còi, bộ đàm | Chưa có |
Thiếu ảnh → dùng placeholder **có đánh dấu**, không tạo thông tin điều tra mới. Gói cho phép dùng biểu cảm mặc định và giữ `expression` trong data để thay sau.

---

## 9. Yêu cầu tích hợp (CLAUDE_INTEGRATION_PROMPT — 11 điểm, rút gọn)
1. Kiểm tra demo hiện có, báo file/Scene dùng, rồi triển khai thật. 2. Bộ đọc graph dùng chung, tách logic khỏi JSON, **không hardcode lời thoại**. 3. Nối sprite/background theo assets.integration; hotspot theo nền 204 thật; thiếu ảnh dùng placeholder đánh dấu. 4. Chạy đủ P1→P2→P3→Final→P4, giữ tự do thứ tự. 5. Notebook 4 tab, lưu node nguồn/phase thu/revision, không hồi tố. 6. Press miễn phạt; Present đúng luật mục 6. 7. Final đúng luật mục 5. 8. Bad Ending + load checkpoint thật, khóa input khi commit. 9. Gửi mẫu khóa quay lại 204; báo cáo sau time skip có phần nạn nhân; P4 fallback xu/khảo sát/giấy khen, không phát Evidence tùy chọn tự động. 10. Dừng ở CH2_ENTRY, giữ save. 11. Chạy kiểm tra + playtest theo `validation/PLAYTEST_CHECKLIST.md`; báo đã kiểm chứng gì, thiếu asset gì.
Tên flag/key khác code hiện tại → viết adapter có giải thích; thiếu điều kiện nội dung thật → chỉ ra node/ID và dừng nhánh đó, không bịa.

### 9.1 Checklist playtest (12 mục — nguyên văn ở `validation/PLAYTEST_CHECKLIST.md`)
New Game 201/21:35 · P1 không Evidence/Press/Present · P2 5 core nhiều thứ tự, bỏ khăn/hộp vẫn thoát · quay lại P3 lấy khăn/hộp ghi phase 3 · NPC thứ tự khác nhau, Hòa/Linh/Hào đúng phạm vi · wrong −15 một lần, double click không trừ 2 lần, thẻ khóa 0 điểm · Minh không nhảy R1→thú nhận · gửi mẫu khóa 204, báo cáo có phần nạn nhân · Final thiếu 0 / sai −20 / đúng mới tái dựng · uy tín 0 → Bad Ending → load đúng snapshot · P4 fallback ghi phase 4 · nợ/con tin chỉ mở P4, ký ức không lộ Khang/em gái · CH2 title rồi dừng, không crash. Thêm: font tiếng Việt, kích thước hộp thoại, chuột/phím, hotspot khớp nền, Notebook không mất state.

---

## 10. Ranh giới kiến thức & quyết định đã duyệt trong gói
- **D01–D18** [ĐÃ DUYỆT 10/10/2026]: gói R 3 thẻ; tráo khi rửa mặt 20:50–20:54; biên nhận 20:55; xu dưới nệm; dùng ống ở bàn, gục sàn; cảnh sát xử lý/chụp; 5 core mở P3 + khăn/hộp bổ sung; Hào đối chứng lượt 203; Hòa lấy vượt nợ; Minh nhận hành vi bị ép (không xác nhận "không biết"); P3a→chờ→P3b→Final; kết Ch1 mở nợ/con tin/khảo sát/mạng lưới; giấy khen hotspot + fallback; em gái chết = niềm tin; Present tuần tự; phạt −15/−20 + 2 checkpoint; React/Phaser, 4 tab, Unknown là trạng thái; hoãn G29–G31.
- **ML-P1-01–08** [ĐÃ DUYỆT 09/10/2026]: schema v2 snake_case, flags Boolean; "Người đàn ông" đến khi Hào tự giới thiệu; giờ Minh "khoảng"; cảnh sát tới chỉ ghi thứ tự; lời Hào hiện tại không là ngoại phạm; Press P3 mở ST_P1_MINH_WASH nếu bỏ qua; LINH_03 chỉ là sắc thái (cờ `linh_reassured`).
- **J** [ĐÃ DUYỆT 10/10/2026]: Phase 4 = A + S1 (Hào biết loại thẻ) + S2 (Linh được Tùng kể) — là kiến thức nhân vật mới theo quyết định thiết kế, ghi `claimed/indirect`.
- **Không được lộ ở Ch1:** Khang là chủ mưu, Vũ (tên), MG-07, trâm, vi phim, số phận em gái, tên công ty/người giao/nơi giữ con tin, phút tráo/phút chết.
- Văn phong: ngôi "bạn", noir Việt, không đọc nội tâm NPC, biểu cảm = điều nhìn thấy.
- Trạng thái văn bản: Bible ghi "Phase 1 đã duyệt; Phase 2/3 là bản thảo chờ duyệt văn bản"; README_FIRST/Integration prompt yêu cầu tích hợp toàn bộ, được chỉnh lời sau nhưng giữ ID/điều kiện → xem Q4.

---

## 11. Điểm cần người dùng xác nhận (đã nêu trong kế hoạch T-012)
- ~~**Q1**~~ **Đã trả lời 13/10/2026 → DEC-009: giữ nguyên cấu trúc hiện tại** (không theo §3.1/§4.1, không Redux); ISS-02 đóng. Bảng ánh xạ: `docs/ARCHITECTURE.md` mục 3a.
- ~~**Q2**~~ **Đã trả lời 13/10 → DEC-010: giữ autosave** (5 phút + sự kiện quan trọng).
- **Q3** Dùng Data Contract 2.0 + `chapter1.json` làm định dạng hội thoại chính thức (đóng ISS-07, thay đề xuất tạm `character/expression/talk/position`)?
- **Q4** Coi toàn bộ văn bản P1–P4 trong gói là nội dung được phép đưa vào game (dù Bible ghi P2/P3 "chờ duyệt văn bản")?
- **Q5** Asset: cung cấp background/sprite (demo "đã có" chưa nằm trong repo) hay cho phép placeholder đánh dấu?
