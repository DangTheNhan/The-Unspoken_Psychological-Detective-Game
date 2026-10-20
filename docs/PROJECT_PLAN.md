# KẾ HOẠCH DỰ ÁN — The Unspoken (cập nhật 20/10/2026, T-019 → T-020)

> Trạng thái: mục 1–2 **[ĐỀ XUẤT — chờ duyệt]**. Mục 3 (Menu & Cài đặt) **ĐÃ CHỐT — DEC-012** (20/10/2026 14:00: "tôi chốt thiết kế hiện tại … bỏ phần [Hiển thị] … giữ nguyên các phần còn lại, chốt phương án và thực thi"); kế hoạch code ở mục 3.9, đang thực thi (T-020).
> Căn cứ: Project.docx (§3.2, §3.3, §5.2, §6.1–6.3), Story.txt, PROJECT_MEMORY (DEC-000..011, ISS-xx), `docs/chapter1/CHAPTER1_PLAN.md`, hiện trạng code đã đọc ở T-015/T-018.
> Nhãn: [NGUỒN] tài liệu quy định · [YÊU CẦU 20/10] người dùng yêu cầu trong lượt này · [ĐỀ XUẤT] AI đề xuất, chờ duyệt · [THIẾU] tài liệu chưa có.

---

## 1. Hiện trạng (tóm tắt)

| Hạng mục | Trạng thái |
|---|---|
| Nền móng full-stack | Đã chạy thật (T-011): đăng ký/đăng nhập JWT, MySQL, React ↔ Phaser qua EventBus |
| Demo game | Menu chữ đơn giản → hội thoại (Hòa nửa thân + nhép miệng) → màn điều tra khung → Sổ tay 4 tab → lưu localStorage. Được đánh giá tích cực (20/10) |
| Chương 1 | Gói nội dung đầy đủ (SRC-5, 1257 node, validator PASS) — **chưa tích hợp**, chờ Q3–Q5 |
| Lưu server | Code có, chưa chạy được — ISS-29 (login không trả `userId`) |
| Admin Dashboard | Khung — chờ API admin (ISS-10/11/12) |
| Âm thanh, ảnh nền, sprite NPC khác | Chưa có asset (ISS-27); thư mục `audio/bgm`, `audio/sfx` đang trống |

## 2. Lộ trình còn lại (thứ tự đề xuất)

| Giai đoạn | Nội dung | Phụ thuộc / bị chặn bởi | Mốc §6.1 |
|---|---|---|---|
| **A — Menu chính & Cài đặt** (đang làm, mục 3) | Menu có phong cách trinh thám, màn Cài đặt (âm thanh, trò chơi, ngôn ngữ VI/EN) — bỏ tab Hiển thị (DEC-012) | Không bị chặn | Hoàn thiện REQ-020 (MainMenuScene) |
| **B — Tích hợp Chương 1** | WP-C1..C10 trong `docs/chapter1/CHAPTER1_PLAN.md`: bộ chạy kịch bản, hội thoại, khám 204, Press/Present, Notebook, Final, P4 | Q3, Q4, Q5 | Notebook & Deduction (Tuần 6) → Ch1 thông suốt |
| **C — Lưu/tải server + Load Game** | Save = state v2, Load Game ở menu, checkpoint, đồng bộ offline | ISS-29, ISS-05, ISS-18 | REQ-030, REQ-064 |
| **D — Admin Dashboard** | Số tài khoản hoạt động, % hoàn thành chương, bảng bug PENDING→RESOLVED | ISS-10, ISS-11, ISS-12 | Tuần 8 |
| **E — Kiểm thử E2E + hồ sơ bảo vệ GĐ1** | Kịch bản §5.2, biên bản chạy thật, đối chiếu REQ | B, C, D | Tuần 12 |
| F — Capstone 2/3 | Ch2–4, Complex Deduction Trees; Ch5, Flashback, bàn ráp chữ ký, BGM/SFX | Đặc tả + nội dung mới | C2, C3 |

Giai đoạn A **không bị chặn** bởi Q3–Q5 nên làm được ngay; các thiết lập của A (tốc độ chữ, âm lượng, ngôn ngữ) sẽ được giai đoạn B dùng lại.

---

## 3. Bước tiếp theo — Menu chính & Cài đặt

### 3.1 Mục đích
- Menu chính có "gu", hợp không khí trinh thám noir của khu trọ Chương 1; ít nút, dễ hiểu, không rối. [YÊU CẦU 20/10]
- Thêm màn **Cài đặt**: đồ họa, độ phân giải, âm thanh, ngôn ngữ (Tiếng Việt / English) và vài tùy chỉnh khác. [YÊU CẦU 20/10]
- Giữ đúng §3.2: MainMenuScene có **New Game**, **Load Game** (tải tiến trình từ CSDL), **bảng điều khiển âm thanh**. [NGUỒN]

### 3.2 Phân loại căn cứ
| Nội dung | Loại |
|---|---|
| New Game, Load Game, điều khiển âm thanh trong MainMenuScene | [NGUỒN] Project.docx §3.2 |
| Màn Cài đặt; tùy chỉnh đồ họa, độ phân giải, âm thanh, ngôn ngữ VI/EN | [YÊU CẦU 20/10] |
| Bố cục, màu, font, danh sách tùy chọn cụ thể, giá trị mặc định, menu tạm dừng | [ĐỀ XUẤT] |
| Bản tiếng Anh của lời thoại/kịch bản | [THIẾU] — nguồn chỉ có tiếng Việt (câu hỏi Q-M1) |
| Ảnh nền thật cho menu | [THIẾU] — ISS-27; ảnh xem trước dùng hình minh họa tạm |

### 3.3 Thiết kế — ĐÃ CHỐT (DEC-012)

**Định hướng hình ảnh — "21:35, đêm mưa ở khu trọ"**
- Lấy đúng không khí mở cảnh Chương 1 (Story.txt, P1_001–002): mưa, cửa sổ hở, bóng huỳnh quang chập chờn, hành lang tối, cửa 204 hé sáng. **Không** đặt đồng xu, chữ ký Khang hay chi tiết bí ẩn lên menu (tránh lộ manh mối).
- Bảng màu giữ theo `game/ui/theme.js` đã có: nền `#17151b`, khung `#241f2b`, viền `#5c5266`, nhấn hổ phách `#f2b84b`, chữ `#f4efe6`, chữ phụ `#a89f94`.
- Chữ: tiêu đề serif cổ điển, thân chữ không chân, nhãn nhỏ kiểu đánh máy — **cả ba phải có đủ dấu tiếng Việt** (đề xuất Playfair Display / Be Vietnam Pro / JetBrains Mono, giấy phép OFL, đóng gói trong `public/assets/fonts/`).

**Menu chính** — một cột bên trái, tối đa 4 mục, bên phải là khung cảnh:
| Mục | Hành vi |
|---|---|
| Ván mới | Bắt đầu chương 1. Nếu đã có bản lưu → hộp xác nhận "Bắt đầu lại sẽ thay bản lưu hiện tại" |
| Tiếp tục điều tra (Load Game) | Mở bản lưu gần nhất; mờ đi khi chưa có bản lưu. Tải từ server chờ ISS-29/ISS-05 |
| Cài đặt | Mở màn Cài đặt (chứa phần âm thanh của §3.2) |
| Nút loa nhỏ góc trên | Tắt/bật tiếng nhanh (giữ chức năng hiện có) |

Hover: chữ chuyển hổ phách + vạch nhỏ bên trái; điều khiển được bằng chuột và phím (↑ ↓ Enter, Esc để quay lại). Dòng nhỏ dưới cùng: "Chương 1 — Án mạng trong phòng trọ" và phiên bản.

**Màn Cài đặt** — một bảng giữa màn hình, **2 tab** (tab Hiển thị đã bỏ theo DEC-012 — game chạy trên web, trình duyệt tự lo cửa sổ/độ phân giải), mỗi tab ≤ 4 dòng:

| Tab | Tùy chọn | Kiểu | Mặc định |
|---|---|---|---|
| ~~Hiển thị~~ | ~~Chế độ hiển thị, độ phân giải, chất lượng đồ họa, FPS, giảm nhấp nháy~~ — **BỎ (DEC-012)**. Đèn chập chờn ở menu tự tắt khi hệ điều hành bật "giảm chuyển động" (`prefers-reduced-motion`) | — | — |
| Âm thanh | Âm lượng tổng / Nhạc nền / Hiệu ứng | Thanh trượt 0–100 | 80 / 70 / 80 |
| | Tắt toàn bộ âm thanh | Bật/Tắt | Tắt |
| Trò chơi | Ngôn ngữ: Tiếng Việt / English | Chọn 1 | Tiếng Việt |
| | Tốc độ chữ: Chậm / Vừa / Nhanh / Hiện ngay | Chọn 1 | Vừa (= 30 ms/ký tự hiện tại) |
| | Tự động chuyển thoại | Bật/Tắt | Tắt |
| | Cỡ chữ hội thoại: Vừa / Lớn | Chọn 1 | Vừa |

Hai nút dưới bảng: **Khôi phục mặc định** · **Lưu** (Esc hoặc nút X = đóng không lưu). Âm lượng nghe thử ngay khi kéo; đóng không lưu thì trả về mức cũ. Chọn English thì nhãn trong bảng đổi ngay để xem trước; bấm Lưu mới áp dụng cho cả game.

**Menu tạm dừng trong game** [ĐỀ XUẤT, có thể làm sau]: phím Esc khi đang chơi → Tiếp tục / Cài đặt / Lưu / Về menu chính — dùng lại màn Cài đặt.

**Lưu thiết lập**: localStorage theo trình duyệt (khóa mới `theUnspoken.settings.v1`). Không thêm API hay bảng CSDL (§4.3 không có API cài đặt).

### 3.4 Ảnh hưởng dự kiến (bản trước DEC-012 — bản chốt từng file: mục 3.9)
| Khu vực | Thay đổi dự kiến |
|---|---|
| Scene | Làm lại `MainMenuScene`; thêm `SettingsScene` (lớp phủ); có thể thêm `PauseMenuScene`; cập nhật `sceneKeys`, `gameConfig` |
| Logic thuần (có test) | `systems/settings.js` (mặc định, kiểm tra hợp lệ, gộp bản cũ); bộ chuỗi ngôn ngữ VI/EN + test đủ khóa |
| UI dùng lại | Nút menu, thanh trượt, công tắc, nhóm lựa chọn, hộp xác nhận trong `game/ui/` |
| Áp dụng thiết lập | `DialogueBox` (tốc độ chữ, cỡ chữ), `sound` (âm lượng), Scale/renderer (độ phân giải, FPS, toàn màn hình) |
| Asset | Font (3 họ, OFL), ảnh nền menu (tạm: vẽ bằng code/placeholder có nhãn tới khi có ảnh thật) |
| Lưu trữ | `shared/storage/storageKeys.js` thêm khóa settings |
| Tài liệu | ARCHITECTURE, CONVENTIONS, CLAUDE.md, PROJECT_MEMORY (DEC mới) |
| **Không đổi** | Backend, API §4.3, CSDL, nội dung cốt truyện |

### 3.5 Rủi ro bug / lỗi phần mềm (bản trước DEC-012 — các dòng về độ phân giải/toàn màn hình/chất lượng không còn áp dụng; bản chốt: mục 3.9)
| Rủi ro | Mức | Cách phòng |
|---|---|---|
| Đổi độ phân giải khi đang chạy làm lệch bố cục: code hiện đặt cứng nhiều số (khung thoại cao 220, nhân vật cao 660, cỡ chữ px) | Cao | Đề xuất giữ **khung logic 1280×720**, độ phân giải chỉ đổi độ nét khi render (xem Q-M2); nếu muốn đổi thật thì phải sửa toàn bộ bố cục theo tỉ lệ |
| Font chưa tải xong khi Phaser vẽ chữ → hiện font dự phòng, dấu tiếng Việt lệch/cắt | TB | Chờ `document.fonts.load` ở Preload; thêm khoảng đệm trên/dưới cho Text |
| Toàn màn hình bị trình duyệt chặn nếu không do người bấm | TB | Chỉ gọi trong sự kiện click; báo lỗi nhẹ nếu bị từ chối |
| Thanh âm lượng chưa có gì để nghe (chưa có file âm thanh) | Thấp | Ghi rõ trong UI dev; nối sẵn để khi có asset là chạy |
| Thiếu khóa dịch → hiện mã chuỗi | TB | Test bắt buộc hai ngôn ngữ cùng bộ khóa |
| localStorage bị chặn/xóa → mất thiết lập | Thấp | Dùng `storage` an toàn có sẵn, rơi về mặc định |
| Menu quá nhiều hiệu ứng làm nặng máy yếu | TB | Chất lượng "Thấp" tắt mưa/hạt phim; FPS 30 |
| Nhấp nháy đèn gây khó chịu | Thấp | Tùy chọn "Giảm hiệu ứng nhấp nháy" |

### 3.6 Đề xuất hướng phát triển (chờ duyệt)
- Dùng chung bộ ngôn ngữ cho cả trang web React (đăng nhập, đăng ký, nút Đăng xuất) để đổi ngôn ngữ là đổi toàn bộ, không chỉ trong khung game.
- Lần đầu vào game hiện hộp chọn ngôn ngữ một lần.
- Tiếng "gõ máy chữ" nhỏ khi chữ chạy (bật/tắt trong Âm thanh) — chỉ khi có file âm thanh được duyệt.
- Về sau: đồng bộ thiết lập lên tài khoản — cần API mới, chưa đề xuất làm bây giờ.

### 3.7 Câu hỏi — trạng thái sau DEC-012
| # | Câu hỏi | Mục đích | Ảnh hưởng | Rủi ro nếu chưa chốt |
|---|---|---|---|---|
| Q-M1 | **Tiếng Anh áp dụng tới đâu?** (a) chỉ giao diện: menu, cài đặt, HUD, Sổ tay, thông báo; lời thoại vẫn tiếng Việt · (b) cả lời thoại — nhóm cung cấp bản dịch · (c) cả lời thoại — cho phép AI dịch nháp để nhóm duyệt | Phạm vi công việc | (b)/(c): thêm bản dịch cho 1257 node Chương 1 (~44 000 ký tự), phải giữ đúng ID và điều kiện | Làm (c) khi chưa duyệt = tự tạo nội dung ngoài nguồn |
| Q-M2 | **"Độ phân giải" hiểu theo cách nào?** (a) giữ khung 1280×720, chỉ tăng độ nét khi render (ít rủi ro) · (b) đổi kích thước khung game thật, sửa toàn bộ bố cục theo tỉ lệ | Chọn cách làm | (b) đụng mọi scene/UI hiện có; ảnh nhân vật 783×990 vẫn đủ nét tới 1080p | (b) dễ lệch bố cục, tốn công |
| Q-M3 | Danh sách tùy chọn mục 3.3 có cần thêm/bớt gì? | Chốt phạm vi | Số dòng trong 3 tab | Thêm dần làm menu rối |
| Q-M4 | Cho phép đóng gói 3 font OFL (Playfair Display, Be Vietnam Pro, JetBrains Mono) vào game? | Chữ đẹp, đủ dấu | Thêm vài trăm KB asset (ước tính, đo lại khi chọn đúng các nét chữ cần dùng) | Không duyệt → dùng font hệ thống như hiện tại |
| Q-M5 | Tên hiển thị: giữ "Ván mới / Tiếp tục điều tra / Cài đặt" hay dùng "New Game / Load Game / Settings" như §3.2 cho bản tiếng Việt? | Văn phong | Chuỗi giao diện | — |

**Trả lời theo DEC-012** ("chốt thiết kế hiện tại … giữ nguyên các phần còn lại"):
- Q-M1 → AI hiểu là **(a) chỉ giao diện** — bản thiết kế đã chốt chỉ có nhãn giao diện tiếng Anh; lời thoại giữ tiếng Việt (không có nguồn tiếng Anh). *Cần người dùng xác nhận lại nếu muốn (b)/(c).*
- Q-M2 → **không còn** (tab Hiển thị đã bỏ). Khung game giữ 1280×720 + `Scale.FIT` như cũ.
- Q-M3 → bỏ tab Hiển thị; giữ nguyên các tùy chọn còn lại.
- Q-M4 → dùng 3 font như bản thiết kế. JetBrains Mono đóng gói ngay (có sẵn, OFL). Playfair Display + Be Vietnam Pro: môi trường AI không tải được → người dùng tải về `public/assets/fonts/` (hướng dẫn trong `public/assets/fonts/README.md`); thiếu file thì tự dùng font dự phòng (Georgia / system-ui).
- Q-M5 → nhãn tiếng Việt như bản thiết kế: Ván mới / Tiếp tục điều tra / Cài đặt.

### 3.8 Các bước
| Bước | Nội dung | Đầu ra | Trạng thái |
|---|---|---|---|
| M1 | Ảnh xem trước Menu + Cài đặt | Bản thiết kế "Menu The Unspoken" | Xong (T-019), đã chốt (DEC-012) |
| M2 | Kế hoạch code chi tiết | Mục 3.9 | Xong (T-020) |
| M3 | Viết code theo mục 3.9 | Menu + Cài đặt chạy trong game | T-020 |
| M4 | Kiểm tra: test logic, Prettier, chạy thử trình duyệt (chuột/phím, VI/EN, lưu thiết lập); người dùng chạy `npm run check` trên máy | Biên bản kiểm tra | T-020 |

### 3.9 Kế hoạch code (M2) — DEC-003

**Mục đích:** thay menu chữ đơn giản bằng menu đã chốt; thêm màn Cài đặt 2 tab; thiết lập được lưu và áp dụng thật vào âm thanh, hội thoại, ngôn ngữ giao diện.

**File mới**
| File | Vai trò |
|---|---|
| `game/systems/settings.js` + test | Danh sách thiết lập, mặc định, `normalizeSettings` (bỏ khóa lạ, giá trị sai → mặc định, kẹp 0–100 theo bước 5), `applyChange`, quy đổi: âm lượng → `sound.volume/mute`, tốc độ chữ → ms/ký tự, cỡ chữ → px |
| `game/systems/i18n.js` + test | `translate(lang, key, params)`: thay `{tham số}`, thiếu khóa → rơi về tiếng Việt → trả về khóa |
| `game/systems/menuNavigation.js` + test | Chọn mục kế/trước bằng ↑ ↓, bỏ qua mục bị khóa, vòng tròn |
| `game/data/uiText.js` | Chuỗi giao diện VI/EN (menu, cài đặt, hộp xác nhận, HUD, Sổ tay, Bad Ending, màn tải). Test bắt buộc 2 ngôn ngữ cùng bộ khóa |
| `game/core/settingsStore.js` + test | Đọc/ghi `localStorage['theUnspoken.settings.v1']` an toàn (không ném lỗi), phát `settings:changed` |
| `game/core/fonts.js` | Chờ font tải xong (tối đa 3 giây) trước khi vẽ menu |
| `game/scenes/SettingsScene.js` | Lớp phủ Cài đặt, làm trên bản nháp; Lưu / Khôi phục mặc định / Esc |
| `game/ui/MenuItem.js`, `IconButton.js`, `PanelButton.js`, `SegmentedControl.js`, `Slider.js`, `Toggle.js`, `ConfirmDialog.js`, `MenuBackdrop.js` | Thành phần giao diện dùng lại; `MenuBackdrop` = cảnh hành lang mưa vẽ bằng code (**tạm**, có nhãn, thay bằng ảnh khi có asset — ISS-27) |
| `public/assets/fonts/` | `JetBrainsMono-*.woff` + `OFL.txt`; `README.md` hướng dẫn thêm 2 font còn lại |

**File sửa**
| File | Thay đổi |
|---|---|
| `game/scenes/MainMenuScene.js` | Làm lại theo thiết kế: 3 mục + loa + chân trang, chuột + phím ↑ ↓ Enter, hộp xác nhận khi đã có bản lưu, "Tiếp tục điều tra" mờ khi chưa có bản lưu |
| `game/core/runtime.js` | Thêm `settings` (kho thiết lập) và `saveAvailable` (React báo qua EventBus) |
| `game/constants/gameEvents.js` | Thêm `SETTINGS_CHANGED` (nội bộ Phaser), `SAVE_AVAILABILITY` (React → Phaser, payload `{ hasSave }`) |
| `game/constants/sceneKeys.js`, `game/config/gameConfig.js` | Đăng ký `SettingsScene` |
| `game/constants/gameplay.js` | Thông số TẠM: tốc độ chữ Chậm 50 / Vừa 30 / Nhanh 15 / Hiện ngay 0 ms; tự chuyển thoại sau 1500 ms; cỡ chữ Vừa 22 / Lớn 26 px |
| `game/ui/theme.js` | Thêm họ font (tiêu đề / thân / đánh máy) + màu phụ dùng trong thiết kế |
| `game/ui/DialogueBox.js`, `game/scenes/DialogueScene.js` | Tốc độ chữ, cỡ chữ, tự động chuyển thoại |
| `game/index.js`, `game/scenes/BootScene.js` | Áp dụng âm lượng khi khởi động và mỗi khi thiết lập đổi |
| `PreloadScene`, `RoomInvestigationScene`, `NotebookScene`, `BadEndingScene` | Chuỗi giao diện qua i18n (không đổi nội dung cốt truyện; tên tab Sổ tay giữ đúng §3.2) |
| `features/play/hooks/useGameBridge.js` | Báo `save:availability` cho Phaser lúc mở trang và sau mỗi lần lưu (dựa trên bản sao lưu localStorage hiện có) |
| `shared/storage/storageKeys.js` | Ghi chú khóa settings (khóa khai báo trong `game/core/settingsStore.js` vì `game/` không được import `shared/storage` — ARCHITECTURE mục 2) |
| `src/styles/index.css` | `@font-face` 3 font |
| Tài liệu | ARCHITECTURE (cây thư mục + sửa dòng 61 còn `features/game/`), CLAUDE.md, PROJECT_MEMORY (DEC-012), PROGRESS_LOG |

**Không đổi:** backend, API §4.3, CSDL, nội dung cốt truyện, thư viện (không thêm package).

**Rủi ro bug và cách phòng**
| Rủi ro | Cách phòng |
|---|---|
| Font chưa tải → chữ vẽ bằng font dự phòng rồi không đổi lại | Preload chờ `document.fonts.load` (tối đa 3 s) rồi mới vào menu |
| Thiếu file font Playfair/Be Vietnam → lỗi 404 trong console | Không làm hỏng game (font dự phòng); hết khi thêm file |
| Scene Cài đặt chồng lên menu nhận phím 2 lần | Menu bị `pause` khi Cài đặt mở; Cài đặt tự gỡ phím khi đóng |
| Kéo thanh trượt ra ngoài thanh | Kẹp giá trị trong `normalizeSettings` + tính theo vị trí con trỏ |
| Hiện ngay (0 ms) gây vòng lặp `repeat = -1` | Nhánh riêng: hiện đủ câu, không tạo timer |
| Tự chuyển thoại chạy chồng với bấm tay | Hủy hẹn giờ mỗi lần chuyển câu / rời scene |
| localStorage bị chặn | Kho thiết lập bắt lỗi, dùng mặc định trong bộ nhớ |
| Thiếu khóa dịch | Test so khớp bộ khóa VI/EN + rơi về tiếng Việt |
| Giới hạn kiểm tra: máy AI không cài được package (mạng chặn npm) | AI chạy test logic bằng bộ chạy thay thế + chạy Phaser thật trong trình duyệt; **người dùng chạy `npm run check` trên máy để xác nhận cuối** |

**Thứ tự:** systems + test → kho thiết lập/i18n → UI component → MainMenu → Settings → áp dụng vào hội thoại/âm thanh → i18n các scene → React bridge → font → tài liệu → kiểm tra.

**Đề xuất hướng phát triển (chờ duyệt):** menu tạm dừng (Esc) để mở Cài đặt khi đang chơi; dùng chung bộ ngôn ngữ cho trang React; cho `game/` dùng `shared/storage` (đổi quy tắc import ở ARCHITECTURE mục 2) để bỏ trùng code đọc/ghi localStorage.
