# Kết quả G0 và G1 theo TEETS2

Tác vụ T-065, ngày 17/11/2026. Căn cứ: người dùng giao G0/G1 trong `TEETS2_FIX_PLAN.md`, DEC-030. Nhánh Nhan. Không commit/push, không triển khai G2–G5.

## G0

- Đã hợp nhất PROGRESS_LOG.md và PROJECT_MEMORY.md, giữ cả các tác vụ của Nhan và duy. Hai checkpoint cũ được lưu nguyên trong phần lịch sử T-065.
- T-052/053/054 của mỗi nhánh được phân biệt bằng hậu tố Nhan/duy. DEC-024/025 về Admin giữ nguyên mã; các quyết định Timeline/menu của Nhan dùng DEC-028/029, có bảng ánh xạ mã cũ. Không đổi nội dung quyết định.
- REQ-028/029 giữ thông tin Press/Present đã có; REQ-030 giữ kết quả lưu máy chủ T-062. Bổ sung SRC-7 và DEC-030 cho phạm vi người dùng vừa giao.
- Đã stage đúng hai file để đánh dấu resolved; không còn file unmerged. Những file đã staged từ trước và chỉnh sửa application.yml của người dùng được giữ nguyên. Chưa tạo merge commit.
- Baseline frontend: lint/format, **229/229 test**, build qua. Backend `mvn clean test`: **26/26**, không failure/error/skipped. Maven dùng cache .m2 với quyền đã được chấp thuận; không kết nối/sửa DB để chạy bộ unit test.

## G1

- Bỏ nút Menu trên header trang chơi. ESC mở pause từ gameplay; lớp Settings/Sổ tay/lựa chọn/confirm đang mở nhận ESC trước, không làm hai thao tác trong một lần nhấn.
- Pause giữ runner/node/vị trí/uy tín. Khi tiếp tục mà không thay cài đặt, StoryScene giữ nguyên view và tiến độ chạy chữ. Về menu chính ẩn scene đã pause bằng API Systems.setVisible; không gọi sleep sai trạng thái hoặc phát resume giả lên scene phía sau.
- Bàn phím được quản lý theo quyền sở hữu: khi overlay React mở, KeyboardManager ngừng capture/preventDefault, xóa trạng thái phím giữ và hàng đợi; khôi phục cấu hình gốc khi hết khóa. Auto-repeat của phím còn giữ từ form bị chặn đến khi nhả/bấm lại.
- Ô báo lỗi nhận focus sau khi native dialog mở. Nhập/chọn/xóa nội dung, Enter, W/A/S/D và tiếng Việt hoạt động. Gửi/hủy/ESC đóng form về pause, không tự mở khóa bảo trì/phiên đăng nhập.
- Bỏ qua tutorial nằm trong pause khi tutorial đang hoạt động, dùng hộp xác nhận cũ. Có hướng dẫn VI/EN tương ứng. Không thêm phím lưu hay thay nội dung kịch bản.
- Dọn native listeners khi game bị hủy; giữ cảnh vốn pause từ trước ở trạng thái đó; ngăn mở Settings lặp do nhấn nhiều lần. Confirm dialog chỉ xử lý kết quả một lần, bỏ qua key-repeat.

## Kiểm tra bản cuối

| Kiểm tra | Kết quả |
|---|---|
| Frontend `npm run check` | **237/237** test (34 file), lint/format/build qua |
| Riêng gameControls | 12 ca trong tổng số trên: input/capture, giữ phím, ESC/lớp con, Settings, scene gốc, bảo trì/phiên và cleanup |
| Chrome Playwright | **13/13 ca khả dụng qua** sau đồng bộ test menu; **4 ca tích hợp riêng skip** vì thiếu môi trường. Lượt đầy đủ qua 10 ca và 3 ca menu có kỳ vọng cũ; sửa kỳ vọng để giữ mục Báo lỗi T-062, chạy lại nhóm menu 4/4 qua. Mã chức năng không thay đổi giữa hai lượt |
| Git | Hết unmerged; không commit/push |

Các ca Chrome G1 gõ bằng sự kiện bàn phím thật, không dùng fill() để chứng minh WASD hoạt động. Kiểm tra payload POST báo lỗi chính xác với userId của fixture; không ghi vào MySQL thật. Ca giữ W khi đóng form kiểm tra cả auto-repeat và việc di chuyển bình thường sau khi nhả/bấm lại. Có kiểm tra submit/cancel/ESC, Settings/Sổ tay/confirm tutorial, 3 vòng menu-memory và khóa bảo trì.

Đã xem 3 ảnh QA và lưu bản ổn định trong `frontend/node_modules/.cache/teets2-g1-qa/`: pause-menu.png, report-keyboard.png và memory-main-menu.png. Bố cục sạch, chữ đúng dấu, form hiện đủ nội dung gõ; menu-memory không bị cảnh cũ che. Đây là ảnh kiểm tra nội bộ, không phải asset game.

## Giới hạn và phạm vi

- Các E2E mới dùng API fixture riêng nhưng React, Phaser, dialog, input DOM, canvas và timer bảo trì chạy thật trong Chrome. Không dùng fixture để tuyên bố đã kiểm tra bảo mật/ghi DB thực tế.
- Các bài account/operations và xuất bản Story Content cần backend/DB/SMTP QA riêng; khi chưa cung cấp biến môi trường tương ứng chúng tự skip. Không thử Google/SMTP bên ngoài hoặc gửi thư thật trong tác vụ này.
- G0/G1 không sửa backend/API/SQL, asset, tọa độ phòng 204, graph/state, xử lý giờ hay cột Online. Các phần đó thuộc giai đoạn khác.
- ESC cần bàn phím; phương án pause cho thiết bị không có bàn phím chưa được bổ sung khi chưa có lựa chọn mới của người dùng.
