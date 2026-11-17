# T-070 — Căn nhân vật phòng 204 theo cửa và thi thể

17/11/2026, Nhan. Người dùng chạy bản G5 và phản ánh nhân vật còn quá lùn so với cửa/thi thể (gọi nhầm giai đoạn G4). Đây là chỉnh tiếp G5 theo phản hồi thực tế; không sửa Admin.

## Căn cứ và cách sửa

T-069 đã dùng cùng depth với 201, nhưng chỉ bằng số đo nhân vật chưa bảo đảm tỷ lệ đồ vật trong nền 204. Cửa có khung tương tác cao454px; tại điểm đứng khóa y580, nhân vật bản cũ cao301.45px (~66%). Cạnh thi thể y587 cao307.16px, trong khi hình thi thể dài khoảng350px theo mốc trên ảnh. Các số này là mốc trình bày game, không phải thông số cơ thể/cửa trong kịch bản.

Đã chụp thử riêng trong browser +25% và mở xem ở cửa, cạnh Tùng, giữa sàn. Tỷ lệ thử cho chiều cao logic376.82px ở cửa và383.95px cạnh Tùng. Sau khi xem ảnh đã áp dụng hệ số1.25 vào **hai height của depth riêng204**; vẫn lấy mốc farY/nearY của201, giữ giới hạn sàn y615. Nhân đồng thời hai height giữ nguyên hệ số tốc độ tương đối; không đổi chiều cao phòng201 hoặc sprite/atlas toàn game.

Footprint lớn hơn cần dời đứng khóa `[245,580]`→`[255,580]`, thùng rác `[527,559]`→`[511,575]`. Giữ mọi rect bấm, vùng thân Tùng, ảnh nền có/không có Tùng, nội dung điều tra, API/DB và schema save. Không kéo dài cơ thể theo một trục.

Kiểm tra hình bổ sung đọc alpha thực của frame sprite để đo **visibleHeight**, phân biệt với height logic/headY; kiểm tại cửa và sát thi thể. Số đo logic/khớp201 ở QA T-069 là kết quả lịch sử, không còn là tiêu chí đủ cho tỷ lệ204 sau phản hồi này.

## Kiểm tra và ảnh

| Kiểm tra T-070 | Kết quả |
|---|---|
| Preview +25% trước khi sửa data | Chrome1/1 qua; đã xem ảnh cửa/cạnh thi thể |
| Unit room204 + rooms | 20/20 qua: mọi cặp stand, đoạn path làm mượt, footprint và save cũ |
| `npm run check` | 248/248 (37file), ESLint/Prettier/build qua |
| `python scripts/chapter1/validate.py` | 6290 assertion,1264node,43statement; không target hỏng/không tới được |
| `npm run test:e2e -- room204-scale.spec.js` | 3/3 qua: alpha thật/phối cảnh, WASD+arrows+chuột, load save cũ→Sổ tay lưu→reload |
| `npm run test:e2e -- chapter1.spec.js` | 3/3 qua sau tăng footprint: nhép miệng, hai lượt Chương1 đều tớiCH2_ENTRY |

Số đo từ alpha>=128 của frame thực, trong tọa độ canvas1280×720:

| Vị trí | Tọa độ chân thực | Chiều cao logic | Phần người nhìn thấy |
|---|---|---|---|
| Xa, room204 | 400/550 | 346.23px | 356.54px |
| Giữa, room204 | 400/587 | 383.95px | 395.39px |
| Gần, room204 | 397.17/602.17 | 399.42px | 411.31px |
| Cửa | 255/580 | 376.82px | 388.04px (~85.47% khung454px) |
| Cạnh thi thể | 582/587 | 383.95px | 395.39px |

Điểm ảnh thử gần y605 được cơ chế an toàn đưa về y602.17 để footprint lớn vẫn nằm trọn trong sàn; không đổi schema. Alpha kiểm phần hình người thay vì tính padding của ô atlas là chiều cao. Phòng201 vẫn có height logic307.16px tại y587, giữ nguyên.

Không ghi DB người dùng; Chrome dùng React/Phaser thật, dữ liệu Chương1 thật và API fixture, save local riêng. Chưa kiểm live server save/MySQL trong T-070.

Các mốc80–90% cửa và350–405px cạnh thi thể là ngưỡng QA triển khai dựa trên ảnh preview/feedback, không phải thông số chiều cao vật thể/cốt truyện do nguồn quy định. 6ca Chrome khác nhau qua trong hai lệnh sạch trên cùng mã chức năng. Không có pageerror ở các ca; cảnh báo mạng của endpoint ngoài fixture Chương1 không được coi là API thật đã kiểm. Không chạy Maven vì không sửa backend.

Ảnh/JSON ignored ở `frontend/node_modules/.cache/teets2-g5-qa/`: giữ `before-*`/`after-*` của T-069, bản thử `preview125-*`, bản áp dụng mới `calibrated-*`.

Đã mở xem ảnh preview và ảnh áp dụng ở cửa/cạnh thi thể. Xem [nhân vật tại cửa](C:/The-Unspoken_Psychological-Detective-Game/frontend/node_modules/.cache/teets2-g5-qa/calibrated-room204-door.png), [nhân vật cạnh Tùng](C:/The-Unspoken_Psychological-Detective-Game/frontend/node_modules/.cache/teets2-g5-qa/calibrated-room204-body.png). JSON `calibrated-measurements.json` có cả logical height, visibleHeight, vị trí và hotspot.

T-070 hoàn tất phần sửa theo phản hồi; tỷ lệ mới thay phần đồng nhất chiều cao tuyệt đối204/201 của DEC-033. Giữ dữ liệu/nội dung/API/schema và mọi thay đổi/staging trước tác vụ. Không commit/push; G3 chưa thực hiện. Tải lại frontend để lấy bản sửa; không xóa save.
