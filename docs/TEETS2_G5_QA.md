# G5 — Phối cảnh phòng 204 theo phòng 201

Tác vụ T-069, 17/11/2026, nhánh Nhan. Người dùng giao “thực thi G5”. Căn cứ: TEETS2.docx/SRC-7, docs/TEETS2_FIX_PLAN.md G5, DEC-014 (phối cảnh phòng 201), DEC-021 (sprite cũ), DEC-023 (vào 204 quan sát trước lấy lời khai), DEC-033.

> Cập nhật T-070: người dùng chơi và phản ánh nhân vật vẫn quá lùn so với cửa/thi thể. Tỷ lệ hiển thị hiện hành đã tăng25% riêng204; phần đồng nhất chiều cao tuyệt đối với201 trong tài liệu này là **kết quả lịch sử**. Số đo alpha/ảnh/bài kiểm tra mới: `docs/ROOM204_PROPORTION_QA.md`, DEC-034. Các phần sàn/hotspot/save vẫn giữ theo G5, hai điểm đứng được căn thêm theo footprint.

## Đối chiếu trước sửa

Đã mở xem nền room201.webp, room204.webp, Tunginroom.png và đọc toàn bộ dữ liệu room204/storyMap. Chụp reference 201/204 tại ba tọa độ chân y550/587/605, cùng canvas 1280×720 và atlas hiện có. Chờ scene mới và fade xong; có ảnh cả nền 204 có/không có Tùng. Chụp bằng technical fixture, không sửa state/graph sản phẩm hoặc ghi DB.

| Tọa độ chân y | Phòng 201 (px) | Phòng 204 trước sửa (px) | Phòng 204 sau sửa, đã đo (px) |
|---|---|---|---|
| 550 | 276.99 | 230.49 | 276.99 |
| 587 | 307.16 | 260.27 | 307.16 |
| 605 | 321.84 | 274.76 | 321.84 |

204 cũ cho tới y655 với thang riêng 216@y532→315@y655. 201 dùng DEC-014: 215@y474→330@y615. Vậy cùng vị trí trên canvas nhưng nhân vật 204 nhỏ hơn khoảng 47px; vùng đi lại gần camera hơn. Việc chỉnh nằm ở staging/phối cảnh của riêng phòng 204, không cần tạo hoặc sửa ảnh.

## Thay đổi

- `room204.depth` dùng đúng dữ liệu `ROOM_201.depth`; không sửa depth của phòng 201, sprite chung hoặc tốc độ/hoạt ảnh toàn game.
- Cắt đa giác sàn 204 cũ tại y615; biên trái/phải giao tại x≈129/1145. Giữ biên sau y532 theo đồ đạc thực tế của 204, không sao chép sàn 201.
- Spawn `[199,624]` → `[225,600]`; đứng xem khóa `[225,601]` → `[245,580]`; đứng ở cửa `[156,630]` → `[207,600]`, phù hợp footprint lớn hơn và mép sàn mới.
- Giữ nguyên rect của 10 hotspot, vị trí vật chứng trên ảnh, đa giác chặn thân/tay/chân Tùng, nền thường/nền có Tùng và ảnh crop cổ. Không có lớp che riêng trong 204 để biến đổi.
- Các hotspot hoạt động được lấy từ `ROOM_204_HOTSPOTS` qua `storyMap`: thay đổi áp dụng cả mở đầu `P1_SEE_TUNG`/`P1_LEAVE_204` và Phase 2/điều tra lại. Không thêm cửa tự do vượt logic kịch bản.
- Giữ cơ chế `nearestClearPoint` hiện có khi load tọa độ cũ; không đổi schema hoặc xóa bản lưu.

## Kiểm tra thực tế

Frontend `npm run check` đã qua **248/248** (37 file), ESLint/Prettier/build. `python scripts/chapter1/validate.py` qua **6290 assertion**, 1264 node, 43 statement, không broken target/unreachable.

20/20 unit phòng liên quan qua: 11 điểm (spawn + 10 stand) đi tới nhau chính xác; mọi đoạn làm mượt không xuyên thân Tùng/tường; WASD liên tục bị chặn; tọa độ save cũ `[199,624]`, `[156,630]`, `[640,650]`, `[830,544]` được đưa về sàn hợp lệ và có đường đến hotspot. Không dùng chỉ điều kiện path khác null để che đích không tới được.

| Lệnh / nhóm kiểm tra | Kết quả |
|---|---|
| `npm run check` | **248/248**, 37 file; lint/format/build qua |
| `python scripts/chapter1/validate.py` | **6290 assertion**, 1264 node, 43 statement; không target hỏng/node không tới được |
| Vitest `room204.test.js` + `rooms.test.js` | **20/20** qua |
| Chrome `room204-scale.spec.js chapter1.spec.js` lượt đầu | 5 qua/1 lỗi selector fixture: nhép miệng + hai lượt Chương 1 + ảnh phối cảnh + di chuyển đều qua; ca save đã load đúng nhưng fixture tìm sai nút Lưu |
| Chrome `room204-scale.spec.js` sau sửa selector | **3/3 qua** trên cùng mã game; không sửa code game sau lượt Chương 1 |
| ESLint/Prettier riêng test sau sửa selector | Qua |
| `git diff --check`, `git ls-files -u` | Không lỗi whitespace, không còn unmerged |

Sáu ca Chrome khác nhau đã qua trên cùng bản mã chức năng; không coi lượt đầu có lỗi fixture là một lượt chạy sạch. Không chạy lại hai lượt Chương 1 sau khi chỉ đổi selector test từ `text` sang `text.text` của PanelButton.

### Nội dung đã xác minh trên Chrome

- Hai lượt chơi đầy đủ (thu nguồn tùy chọn sớm / bổ sung qua hồ sơ Phase 4) đều đến **CH2_ENTRY**. Có vào 204 quan sát Tùng trước lấy lời khai, ra hành lang, khám 204, kiểm điều kiện rời hiện trường, các vật chứng/ảnh cổ và quay lại 204 ở nhánh tương ứng. Cốt truyện, uy tín và nguồn thu thập vẫn đúng assertions hiện có.
- Ba độ sâu có cùng chiều cao logic với 201; 201 giữ nguyên số đo trước sửa. Cả nền thường và nền có Tùng hiển thị nguyên bố cục, rect hotspot không bị co/dịch. Đã mở xem ảnh trước/sau và ảnh đối chiếu 201.
- Giữ W vào thân Tùng bị chặn; ArrowDown không xuống vùng gần camera; phím D vẫn đi bình thường. Chuột đi từ `[400,550]` tới `[1000,580]` vòng qua vật cản; ghi từng frame để xác minh toàn bộ footprint luôn trên sàn và ngoài thân Tùng.
- Bản lưu cũ `[199,624]` được tải bằng **Tiếp tục điều tra**, về sàn hợp lệ và giữ nguyên state điều tra. Bấm **Lưu tiến trình** trong Sổ tay ghi vị trí đã chỉnh; tải lại lần nữa giữ đúng vị trí/state. Không gọi trực tiếp handler lưu để thay thao tác UI.
- Unit còn kiểm thêm ba điểm cũ/điểm trong vật cản, mọi cặp spawn/stand và mọi đoạn path đã làm mượt; không sửa thuật toán di chuyển/tìm đường hoặc schema save.

Chrome dùng React/Phaser thật và API fixture localhost. Test ảnh dùng technical scene fixture; các lượt Chương 1 dùng chuột/phím thật, ca save dùng localStorage riêng của browser test. Không ghi tài khoản/bảo trì/save vào MySQL người dùng, không kiểm live API/server save trong G5. Các log mạng từ endpoint ngoài fixture Chương 1 không phải backend thật và không được tính là kiểm thử API; assertions/pageerror đều qua ở các ca đạt. Không chạy Maven lại vì không đổi backend.

## Ảnh đối chiếu và bàn giao

Đã mở xem ảnh ba vị trí trước/sau, reference 201 và hai biến thể nền. File ở thư mục ignored `frontend/node_modules/.cache/teets2-g5-qa/`:

- `before-room201-{far,middle,near}.png`, `after-room201-{far,middle,near}.png`
- `before-room204-{far,middle,near}.png`, `after-room204-{far,middle,near}.png`
- `before-room204-empty.png`, `after-room204-empty.png`
- `before-measurements.json`, `after-measurements.json` — tọa độ, chiều cao logic, depth và hotspot thực tế.

Xem [204 trước sửa, giữa sàn](C:/The-Unspoken_Psychological-Detective-Game/frontend/node_modules/.cache/teets2-g5-qa/before-room204-middle.png), [204 sau sửa, giữa sàn](C:/The-Unspoken_Psychological-Detective-Game/frontend/node_modules/.cache/teets2-g5-qa/after-room204-middle.png), [201 làm chuẩn](C:/The-Unspoken_Psychological-Detective-Game/frontend/node_modules/.cache/teets2-g5-qa/after-room201-middle.png).

G5 hoàn tất. Chỉ thay dữ liệu bố trí riêng 204 và thêm kiểm thử/tài liệu; ảnh, sprite, graph, lời thoại, schema/API/DB giữ nguyên. Tải lại frontend để áp dụng; bản lưu cũ được xử lý bằng cơ chế sàn an toàn đã có. Giữ Nhan/staging/application.yml có sẵn, không commit/push; G3 chưa thực hiện.
