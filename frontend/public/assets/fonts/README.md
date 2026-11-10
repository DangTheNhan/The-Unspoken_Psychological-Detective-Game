# Font chữ của menu (DEC-012)

Ba họ chữ trong bản thiết kế đã chốt — đều có đủ dấu tiếng Việt, giấy phép **SIL Open Font License 1.1**
(được phép đóng gói kèm game, phải giữ file giấy phép bên cạnh).

| Họ chữ | Dùng cho | File cần có trong thư mục này | Trạng thái |
|---|---|---|---|
| JetBrains Mono | Nhãn nhỏ kiểu đánh máy, số phòng, phím tắt | `JetBrainsMono-Regular.woff` + `OFL-JetBrainsMono.txt` | **Đã có** (bản rút gọn: Latin + tiếng Việt, 29 KB) |
| Playfair Display | Tiêu đề "THE UNSPOKEN", tiêu đề bảng | `PlayfairDisplay-Bold.ttf` + `OFL-PlayfairDisplay.txt` | **Cần thêm** |
| Be Vietnam Pro | Chữ thường, mục menu, nút | `BeVietnamPro-Regular.ttf`, `BeVietnamPro-Medium.ttf`, `BeVietnamPro-SemiBold.ttf` + `OFL-BeVietnamPro.txt` | **Cần thêm** |

## Cách thêm 2 font còn thiếu
1. Mở https://fonts.google.com/specimen/Playfair+Display → **Get font** → **Download all**. Trong file zip lấy
   `static/PlayfairDisplay-Bold.ttf` và `OFL.txt` (đổi tên thành `OFL-PlayfairDisplay.txt`).
2. Mở https://fonts.google.com/specimen/Be+Vietnam+Pro → **Get font** → **Download all**. Lấy
   `BeVietnamPro-Regular.ttf`, `BeVietnamPro-Medium.ttf`, `BeVietnamPro-SemiBold.ttf` và `OFL.txt`
   (đổi tên thành `OFL-BeVietnamPro.txt`).
3. Chép vào thư mục này (`frontend/public/assets/fonts/`), giữ đúng tên file ở bảng trên → tải lại trang (Ctrl+F5).

Chưa thêm thì game **vẫn chạy**: tiêu đề dùng Georgia, chữ thường dùng font hệ thống (khai báo trong
`src/game/ui/theme.js` → `FONTS`); console trình duyệt có thể báo 404 cho 2 file còn thiếu.
`@font-face` khai báo trong `src/styles/index.css`; game chờ font tải xong ở `src/game/core/fonts.js`.
