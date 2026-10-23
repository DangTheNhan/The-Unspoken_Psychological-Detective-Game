# KẾ HOẠCH — Phòng 201: di chuyển nhân vật + tutorial (T-021)

> Trạng thái: **ĐÃ CHỐT — DEC-013** (22/10/2026 18:13, người dùng trả lời Q-R1…Q-R9 — mục 7a). **Đã thực thi P1–P9 (T-022)** — chờ người dùng chạy `npm run check` + chơi thử.
> Ngày: 22/10/2026. Yêu cầu: "map đầu tiên sau intro … tutorial (di chuyển, tương tác, hướng dẫn cơ bản) … làm cả phần
> di chuyển cho nhân vật … trong phạm vi căn phòng, tránh xuyên tường hay xuyên qua các bố cục … chia ra thành các phase".
> Tài sản người dùng gửi: 1 ảnh nền phòng (2730×1536) + 3 tấm nhân vật (2752×1536 mỗi tấm: đi sang trái 6 hình,
> đi sang phải 6 hình, 4 góc đứng trước/trái/phải/sau).
> Ảnh xem trước vùng đi được / vật cản / điểm tương tác / tỉ lệ nhân vật: `docs/images/room201_overlay_preview.jpg`.

Nhãn: [NGUỒN] tài liệu quy định · [YÊU CẦU 22/10] người dùng yêu cầu lượt này · [ĐỀ XUẤT] chờ duyệt · [THIẾU] chưa có ·
[MÂU THUẪN] ảnh/nguồn lệch nhau.

---

## 1. Căn cứ

| Nội dung | Loại | Nguồn |
|---|---|---|
| Màn điều tra 2.5D: "Người chơi điều khiển nhân vật hoặc trỏ chuột tương tác với các điểm nóng (Hotspots)" | [NGUỒN] | Project.docx §3.2 RoomInvestigationScene |
| Nền phối cảnh sâu (Background Layer) → Hotspots → HUD | [NGUỒN] | Project.docx §3.2; code `RoomInvestigationScene` |
| New Game mở ở **phòng 201** (phòng của thám tử), 21:35, Hòa gõ cửa | [NGUỒN] | Bible 1.3 A3 + mốc 21:35; `CHAPTER_1_PHASE_1.md` P1_001 |
| Thám tử là nhân vật người chơi, **chưa nêu tên** | [NGUỒN] | Bible 1.3 A3 |
| Khóa ảnh nền `room201` trong gói Chương 1 đang `null` (chờ asset) | [NGUỒN] | `data/assets.integration.json` |
| Tutorial trong phòng: di chuyển, tương tác, hướng dẫn cơ bản | [YÊU CẦU 22/10] | — |
| Cách chia vùng đi được, phím, tỉ lệ, luồng tutorial | [ĐỀ XUẤT] | mục 3–4 |
| Lời mô tả khi xem từng đồ vật trong phòng | **[THIẾU]** — không được tự viết (quy tắc "không sáng tác lời thoại") | xem Q-R3 |

**Kết luận:** ảnh nền này khớp vai trò `room201` (phòng thám tử). Kế hoạch dùng **lại `RoomInvestigationScene`** (đúng §3.2)
và nạp phòng theo **dữ liệu cấu hình**, để các phòng sau (hành lang, 204) dùng chung cùng một bộ máy.

---

## 2. Phân tích tài sản (đã đo trên ảnh gốc)

### 2.1 Ảnh nền phòng
- 2730×1536 (16:9) → khớp khung game 1280×720 (hệ số 0,469). Phối cảnh một điểm tụ, camera cao, sàn chiếm nửa dưới.
- Sàn (tọa độ khung 1280×720): mép tường sau y≈442; mép trước đồ đạc y≈474; tường trái chéo từ (265,442) xuống (0,642);
  tường phải chéo từ (955,442) xuống (1135,550).
- Đồ đạc chạm sàn (vật cản): kệ giày, chồng sách, bàn làm việc, ghế đỏ, giường sắt, quạt, thùng gỗ, tủ thấp bên phải,
  tủ + thùng ở góc dưới phải.
- Lối ra: cửa gỗ bên trái (ra hành lang). Cửa WC bên phải (mở, thấy bồn rửa).

### 2.2 Nhân vật
| Tấm | Nội dung | Ghi chú kỹ thuật |
|---|---|---|
| Ảnh 2 | Đi **sang trái**, 6 hình | Các hình **chồng lên nhau theo chiều ngang** (bước chân lấn sang hình bên cạnh) → không cắt theo lưới đều được; phải cắt theo khung từng người |
| Ảnh 3 | Đi **sang phải**, 6 hình | Như trên; túi đeo ở vai còn lại (đúng vì túi đeo chéo) |
| Ảnh 4 | Đứng: trước / trái / phải / sau | Dùng làm tư thế đứng yên 4 hướng |

- Nền là màu be đặc (~#EDD9BD), **không trong suốt** → phải tách nền. Một số vùng da gần màu nền → cần kiểm tay sau khi tách.
- Chiều cao người trong tấm ≈ 1360–1415 px; trên màn hình cần 200–550 px → dư độ nét, xuất lại ~620 px.
- **[THIẾU]** Không có **chu kỳ bước đi lên (quay lưng) và đi xuống (quay mặt)** — ảnh 4 chỉ là tư thế đứng (xem Q-R5).
- Các hình do công cụ AI vẽ nên **không đồng nhất** giữa các khung (chiều cao, nếp áo, độ mở áo; hình thứ 6 ảnh 2 khác hẳn
  5 hình còn lại) → sẽ rung khi chạy hoạt ảnh nếu không chuẩn hóa (xem rủi ro R2).
- Ảnh nền và ảnh 2, 3, 4 đều có **dấu ✦ của công cụ tạo ảnh ở góc**; ở ảnh nền nó nằm đè lên thùng gỗ góc dưới phải,
  ở ảnh 2/3 nằm sát giày (xem Q-R8).

### 2.3 Tỉ lệ phối cảnh (đã thử trên ảnh xem trước)
Chiều cao nhân vật theo vị trí chân y (khung 1280×720), nội suy tuyến tính — **TẠM**, tinh chỉnh khi chạy:

| Vị trí chân | Cao nhân vật | Mốc so sánh |
|---|---|---|
| y = 474 (sát giường/bàn) | ≈ 245 px | cao gấp ~2 ghế nhựa |
| y = 585 (giữa phòng) | ≈ 410 px | ~0,8 cửa ra vào |
| y = 690 (sát mép dưới) | ≈ 560 px | đầu vẫn trong khung |

Tốc độ đi cũng nhân theo tỉ lệ này (ở xa đi chậm hơn trên màn hình) để cảm giác không bị "trượt".

---

## 3. Thiết kế đề xuất [ĐỀ XUẤT]

### 3.1 Điều khiển
| Thao tác | Phím / chuột | Ghi chú |
|---|---|---|
| Di chuyển 8 hướng | Mũi tên **và** W A S D | Chéo được chuẩn hóa tốc độ |
| Đi tới chỗ bấm | Bấm chuột trái lên sàn | Tìm đường vòng qua đồ đạc; bấm vào đồ vật → đi tới điểm đứng rồi tương tác |
| Tương tác | **E**, Space hoặc Enter khi đứng gần | Hiện nhãn nhỏ "E" trên đầu nhân vật + viền sáng vật thể |
| Sổ tay | N (giữ như hiện tại) | |
| Lưu thủ công | **Đổi S → F5** (vì S trùng với đi xuống) | Xem Q-R6 |
| Tạm dừng / bỏ qua hướng dẫn | Esc | |

### 3.2 Va chạm — không xuyên tường, không xuyên đồ
- Không dùng thân vật lý hình hộp (Arcade) vì tường phòng **chéo theo phối cảnh**. Dùng **đa giác vùng sàn đi được** + danh sách
  **đa giác chân đồ đạc** (vật cản).
- Nhân vật va chạm bằng **"bàn chân"**: elip nhỏ ở gốc sprite (rộng ≈ 18% chiều cao, co giãn theo phối cảnh), không dùng cả
  thân người → đi sát đồ vật trông tự nhiên.
- Mỗi khung hình: thử đi theo trục X, rồi trục Y riêng (trượt dọc tường thay vì kẹt cứng). Bước dài thì chia nhỏ để không
  "nhảy" qua vật cản khi máy giật.
- Đường biên trên của sàn đặt ở **mép trước đồ đạc (y≈474)**: nhân vật không chui vào khe giữa bàn và giường → không cần cắt
  lớp che cho đồ đạc phía sau.
- Chỉ góc **dưới phải** (tủ + thùng) có thể đứng sau → cắt riêng lớp ảnh che (occluder) vẽ đè lên nhân vật theo chiều sâu.
- Thứ tự vẽ: nền → nhân vật (depth = y chân) → lớp che → HUD.

### 3.3 Điểm tương tác (vị trí đề xuất, xem ảnh preview)
| Mã | Vật | Hành động | Nội dung hiển thị |
|---|---|---|---|
| R201_DOOR | Cửa ra hành lang (trái) | Kết thúc tutorial / mở P1 | Theo luồng 3.4 |
| R201_BOARD | Bảng ghim ảnh + chỉ đỏ | Xem | **[THIẾU]** |
| R201_DESK | Bàn, máy chữ, cuốn sổ | Xem | Có thể lấy câu P1_001 (Q-R3 phương án B) |
| R201_WINDOW | Cửa sổ | Xem | Có thể lấy câu P1_001 (nước rỉ) |
| R201_CALENDAR | Lịch treo tường | Xem | **[THIẾU]** |
| R201_COATS | Móc áo | Xem | Có thể lấy câu P1_001 (lấy áo) |
| R201_WC | Cửa WC | Không vào (cửa đóng) | **[THIẾU]** — Q-R7 |

### 3.4 Luồng tutorial (máy trạng thái, logic thuần có test)
1. **Di chuyển** — gợi ý góc trên trái: "Dùng ← ↑ → ↓ / W A S D hoặc bấm chuột lên sàn để đi". Xong khi đi đủ quãng hoặc chạm
   vòng sáng đánh dấu trên sàn.
2. **Tương tác** — "Đến gần vật có viền sáng và nhấn E (hoặc bấm vào nó)". Xong khi xem 1 vật.
3. **Sổ tay** — "Nhấn N để mở Sổ tay, Esc để đóng". Xong khi mở rồi đóng sổ.
4. **Tự do quan sát** — các vật còn lại vẫn xem được; gợi ý "Khi sẵn sàng, ra cửa".
5. **Kết** — đến cửa trái nhấn E → chuyển sang P1_001/P1_002 (khi chưa tích hợp Chương 1: sang `DialogueScene` như hiện tại).

- Có thể **bỏ qua hướng dẫn** (Esc → xác nhận). Đã xong một lần thì lần sau không hiện lại (cờ `tutorial.room201.done`).
- Chuỗi gợi ý là **chuỗi giao diện** (VI/EN trong `data/uiText.js`), không phải lời thoại. Lời mô tả đồ vật là nội dung
  truyện → chỉ lấy từ nguồn đã duyệt hoặc nhóm cung cấp (Q-R3).

### 3.5 Hai phương án nội dung (Q-R3)
| | A — Tutorial riêng trước P1_001 | **B — Biến P1_001 thành phần chơi được** (khuyên dùng) |
|---|---|---|
| Cách làm | Phòng tự do, mỗi vật có câu mô tả riêng | Chia các câu **đã có** của P1_001 cho vật tương ứng (cửa sổ rỉ nước, cuốn sổ, áo); tiếng gõ cửa của Hòa phát khi đã xem đủ/ra cửa |
| Nội dung mới | Cần nhóm viết mô tả ~6 vật | **Không thêm chữ**; chỉ thêm chuỗi gợi ý giao diện |
| Ảnh hưởng | Không đổi kịch bản | Đổi **cách trình bày** P1_001 (từ đoạn kể liền thành tương tác) → cần duyệt |
| Rủi ro | Lời tự viết lệch Bible | Ảnh nền phải có đủ vật được nhắc (Q-R4) |

---

## 4. Các phase

| Phase | Nội dung | Đầu ra | Phụ thuộc | Khối lượng |
|---|---|---|---|---|
| **P0 — Chốt** | Trả lời Q-R1…Q-R9; chốt phương án A/B, phím, tài sản thiếu | DEC mới | Người dùng | Nhỏ |
| **P1 — Xử lý tài sản** | Tách nền 16 hình; chọn khung tốt; chuẩn hóa cùng chiều cao + cùng đường chân; đóng gói 1 ảnh atlas + JSON (Phaser `load.atlas`); nền phòng xuất WebP 1920×1080; cắt lớp che góc dưới phải; bản gốc vào `art-source/` | `images/backgrounds/room201.webp`, `images/characters/detective-walk.{png,json}`, `room201-occluder.webp` | P0 (Q-R5, Q-R8) | Vừa |
| **P2 — Dữ liệu phòng + công cụ đo** | `data/rooms/room201.js`: ảnh nền, đa giác sàn, vật cản, lớp che, điểm tương tác, điểm xuất hiện, bảng tỉ lệ phối cảnh. Chế độ debug (phím F8): vẽ đa giác, bấm để in tọa độ → nhóm tự chỉnh không cần sửa code | Dữ liệu + overlay debug | P1 | Vừa |
| **P3 — Logic thuần + test** | `systems/walkArea.js` (điểm trong đa giác, đi có trượt tường, chia bước), `systems/depthScale.js`, `systems/facing.js` (hướng → hoạt ảnh), `systems/pathfinding.js` (A* lưới 16 px + làm mượt đường), `systems/tutorial.js` (máy trạng thái) | 5 module + test Vitest | P2 | Lớn |
| **P4 — Nhân vật** | `game/entities/Player.js`: sprite gốc ở chân, 2 hoạt ảnh đi trái/phải (~10 khung/giây), 4 tư thế đứng; đi lên/xuống dùng tư thế trước/sau + nhún nhẹ **tạm** tới khi có hình (Q-R5); co giãn + tốc độ theo y; phím + bấm chuột | Nhân vật đi được trong phòng | P3 | Lớn |
| **P5 — Tương tác** | Phát hiện vật gần nhất trong bán kính; nhãn "E" + viền sáng; bấm vật → đi tới điểm đứng, quay mặt đúng hướng, mở `DialogueBox`; khóa di chuyển khi đang đọc | Xem được đồ vật | P4 | Vừa |
| **P6 — Tutorial** | Bảng gợi ý gọn (góc trên trái, 1 dòng + biểu tượng phím), vòng sáng chỉ chỗ, các bước 3.4, bỏ qua bằng Esc, cờ hoàn thành; chuỗi VI/EN | Tutorial chạy trọn | P5 + Q-R3 | Vừa |
| **P7 — Nối luồng game** | Ván mới → [Intro — người dùng bổ sung sau, để chỗ trống có nhãn] → phòng 201 → P1 (hoặc DialogueScene hiện tại). Đổi phím lưu S→F5; HUD Uy tín/Sổ tay giữ nguyên | Luồng chơi liền mạch | P6 | Nhỏ |
| **P8 — Kiểm thử & tinh chỉnh** | Test logic; chạy thật: đi sát mọi góc/tường/đồ, đi chéo, giữ 2 phím ngược, bấm vào chỗ không tới được, bấm liên tục, đổi tab trình duyệt khi đang giữ phím, 30/60 FPS, VI/EN; `npm run check` trên máy | Biên bản kiểm tra | P7 | Vừa |
| **P9 — Tài liệu** | ARCHITECTURE (bộ máy phòng), CONVENTIONS (cách thêm phòng mới), PROJECT_MEMORY (DEC), PROGRESS_LOG | — | P8 | Nhỏ |

**Mốc chơi thử sớm:** hết P4 đã có nhân vật đi trong phòng không xuyên tường (chưa có tutorial) → gửi bạn xem trước.

---

## 5. Ảnh hưởng (file dự kiến)

| Loại | File |
|---|---|
| Mới | `game/data/rooms/room201.js` · `game/entities/Player.js` · `game/systems/{walkArea,depthScale,facing,pathfinding,tutorial}.js` + test · `game/ui/{InteractPrompt,TutorialHint,FloorMarker}.js` · asset trong `public/assets/images/{backgrounds,characters}/` · `art-source/room201/`, `art-source/characters/detective/` |
| Sửa | `RoomInvestigationScene` (nạp phòng theo dữ liệu, thêm nhân vật/tương tác) · `PreloadScene` (nạp nền + atlas) · `data/uiText.js` (chuỗi tutorial VI/EN) · `constants/gameplay.js` (tốc độ, bán kính tương tác — TẠM) · `MainMenuScene.startNewGame` (vào phòng 201) · `DebugScene` (overlay vùng đi) · `GameSession` (cờ tutorial, nếu Q-R9 đồng ý lưu vào save) |
| Không đổi | Backend, API §4.3, CSDL, nội dung kịch bản (trừ cách trình bày P1_001 nếu chọn phương án B) |

---

## 6. Rủi ro bug / lỗi phần mềm

| # | Rủi ro | Mức | Cách phòng |
|---|---|---|---|
| R1 | Xuyên tường/đồ khi máy giật (bước lớn) hoặc ở góc nhọn của đa giác | Cao | Chia bước ≤ 4 px; thử trục X/Y riêng; test góc lồi/lõm |
| R2 | Hoạt ảnh rung vì các hình AI không đồng nhất | Cao | Chuẩn hóa chiều cao + đường chân; bỏ khung lệch (vd hình 6 ảnh 2); nếu vẫn rung → xin bộ hình vẽ lại |
| R3 | Tách nền ăn vào da/áo (màu gần nền be) | TB | Chỉ loang từ mép ảnh; kiểm từng khung; viền mờ 1 px |
| R4 | Kẹt nhân vật (xuất hiện/đứng trong vật cản sau khi đổi dữ liệu) | TB | Test: điểm xuất hiện + mọi điểm đứng của hotspot phải nằm trong vùng đi được; nếu kẹt → đẩy về điểm hợp lệ gần nhất |
| R5 | Bấm chuột vào chỗ không tới được / trên đồ đạc | TB | Đi tới điểm đi được gần nhất; bấm lên đồ có hotspot → điểm đứng của hotspot |
| R6 | Phím bị "dính" khi đổi tab/mở Sổ tay | TB | Xóa trạng thái phím khi mất focus/khi scene tạm dừng |
| R7 | Trùng phím S (lưu) với đi xuống | Cao | Đổi lưu sang F5 (Q-R6) |
| R8 | Thứ tự vẽ sai (nhân vật đè lên đồ phía trước) | TB | depth = y chân; lớp che cho góc dưới phải; đường biên trên y≈474 |
| R9 | Ảnh nặng làm tải chậm | Thấp | Nền WebP ~1920×1080; atlas ≤ 2048×2048 |
| R10 | Lộ nội dung cốt truyện qua bảng ghim ảnh | TB | Không viết mô tả nội dung bảng khi chưa có nguồn; không zoom ảnh mặt người |
| R11 | Dấu ✦ của công cụ tạo ảnh hiện trong game | TB | Cần bản ảnh không có dấu (Q-R8) |

---

## 7. Câu hỏi cần xác nhận

| # | Câu hỏi | Vì sao cần |
|---|---|---|
| Q-R1 | Nhân vật trong ảnh 2–4 là **thám tử** (nhân vật người chơi, chưa nêu tên)? | Đặt tên asset, gắn với `DETECTIVE` trong gói Ch1 |
| Q-R2 | Ảnh nền này là **phòng 201** của thám tử? | Gắn khóa `room201`; luồng New Game |
| Q-R3 | Nội dung khi xem đồ vật: phương án **A** (nhóm viết mô tả) hay **B** (dùng câu P1_001, không thêm chữ)? | Quy tắc không tự sáng tác lời thoại |
| Q-R4 | **[MÂU THUẪN]** P1_001 nhắc: đồng hồ 21:35, bát nhựa hứng nước dưới cửa sổ, áo trên lưng ghế, nước rỉ qua cửa sổ, trời mưa — ảnh nền chưa có đồng hồ, bát, áo trên ghế. Sửa ảnh hay chấp nhận lệch? | Phương án B cần các vật này |
| Q-R5 | Có bổ sung **2 tấm đi lên (quay lưng) và đi xuống (quay mặt)**, 6 hình mỗi tấm, cùng phong cách? Chưa có thì tạm dùng tư thế đứng + nhún nhẹ | Hoạt ảnh 4 hướng đầy đủ |
| Q-R6 | Phím: di chuyển = mũi tên + WASD, tương tác = E/Space/Enter, **lưu đổi S → F5**, Sổ tay = N, Esc = tạm dừng/bỏ qua. Đồng ý? | Tránh trùng phím |
| Q-R7 | Cửa WC: chỉ là vật xem (không vào) hay có phòng riêng? | Phạm vi map |
| Q-R8 | Có bản ảnh **không có dấu ✦** ở góc không? | Không để dấu công cụ trong game |
| Q-R9 | Tutorial: cho bỏ qua, chỉ hiện lần đầu, lưu cờ vào bản lưu (save) của người chơi? | Lưu trữ |

---

## 7a. Trả lời của người dùng (22/10/2026 18:13) → DEC-013

| # | Trả lời | Áp dụng |
|---|---|---|
| Q-R1, Q-R2 | Nhân vật là **thám tử**, ảnh nền là **phòng 201** | Asset `detective-*`, `room201` |
| Q-R3 | **Để trống** chữ khi xem đồ vật, bổ sung khi được yêu cầu | Hotspot có `textKey: null` → hiện khung trống có nhãn `[Chờ nội dung]`; không lấy câu P1_001 |
| Q-R4 | **Chốt theo ảnh** vừa gửi (không sửa ảnh theo P1_001) | Ghi nhận lệch ảnh ↔ P1_001 là chấp nhận |
| Q-R5 | Ảnh đi lên/xuống **bổ sung sau** | Tạm: tư thế trước/sau + nhún nhẹ khi đi dọc |
| Q-R6 | **Lưu game đặt trong Sổ tay** của thám tử; **bỏ phím tắt** lưu | Nút "Lưu" trong NotebookScene; bỏ phím S; WASD dùng cho di chuyển |
| Q-R7 | WC **bổ sung sau** | Cửa WC là vật cản, chưa có hotspot |
| Q-R8 | **Xóa** biểu tượng ✦ | Xóa trên ảnh nền và 3 tấm nhân vật (vá bằng màu/nền xung quanh) |
| Q-R9 | Trạng thái tutorial là **một phần file lưu bình thường** | Lưu trong `GameSession` → `saveDataJson` |

## 8. Đề xuất hướng phát triển (chờ duyệt)
- Bộ máy phòng dùng dữ liệu → hành lang và phòng 204 (P2 của Chương 1) chỉ cần thêm file dữ liệu + ảnh.
- Công cụ đo đa giác trong chế độ debug → nhóm tự chỉnh vùng đi/hotspot khi đổi ảnh nền.
- Tiếng bước chân + mưa ngoài cửa sổ khi có âm thanh được duyệt (nối sẵn với âm lượng trong Cài đặt).
- Hiệu ứng ánh đèn bàn/đèn tuýp nhẹ bằng lớp phủ (tắt khi hệ điều hành bật giảm chuyển động).
