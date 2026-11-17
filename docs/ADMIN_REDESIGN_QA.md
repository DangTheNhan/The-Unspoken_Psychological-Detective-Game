# Admin redesign — QA T-072 / DEC-035

Ngày: 17/11/2026. Nhánh `Nhan`, nền ban đầu `ba0bbe9`. Căn cứ: yêu cầu trực tiếp thiết kế lại Admin bằng design-taste-frontend; phạm vi và danh mục luồng ở `docs/ADMIN_REDESIGN_PLAN.md`. Không commit/push.

## Phần giao diện đã thay đổi

Áp dụng trên đủ sáu route hiện có: Tổng quan, Hồ sơ Thám tử, Báo lỗi, Chứng cứ, Nội dung kịch bản, Kết nối & Bảo trì.

- Shell dùng sidebar graphite, nền làm việc sáng, surface trắng, điểm nhấn hổ phách. Token giới hạn trong `.admin-shell`; giữ font Be Vietnam Pro/JetBrains Mono có sẵn, không thêm dependency.
- Điều hướng đủ sáu mục, icon SVG cục bộ, active state; thu gọn bằng nút có tên truy cập/aria-expanded ở mobile. Header tài khoản, quay game và xác nhận logout giữ thao tác cũ. Thêm breadcrumb và skip link dùng bàn phím.
- Chuẩn hóa thẻ số liệu, biểu đồ hiện có, bảng, badge, bộ lọc, nút, form và thông báo. Bảng cuộn trong khung có thể focus; không thêm sort/pagination hoặc thao tác mới.
- Chứng cứ giữ danh mục dạng thẻ và tất cả nội dung trạng thái nạp; form, xem trước ảnh, upload/gỡ ảnh, xác nhận CRUD vẫn có đủ.
- Editor dùng cùng màu/chữ/control; index và manuscript có phân cấp, xếp một cột ở màn hình hẹp; đối chiếu gốc, tra cứu nâng cao, bản nháp/duyệt/xuất bản/lịch sử giữ nguyên nội dung.
- Sổ tay dùng native dialog, có tên truy cập, focus trong hộp, Escape, trả focus về nút mở sau khi tải async. Hai chế độ structured/raw và logic đọc JSON/sổ tay không đổi. Không sửa Modal chung của game.
- Nút/control rõ focus, vùng bấm lớn hơn trên mobile, màu trạng thái thống nhất; tôn trọng reduced-motion và bỏ chấm nhấp nháy liên tục của báo lỗi.

## Kiểm tra đã thực sự chạy

| Kiểm tra | Kết quả |
|---|---|
| `npm run check` bản mã cuối | Qua ESLint, Prettier, 248/248 Vitest (37 file), Vite production build |
| Chrome: admin-redesign + admin-evidence + g4-interface + vietnam-time | 27/27 qua, 1.7 phút |
| Sau chỉnh cách ẩn skip link và dừng transition khi chụp ảnh | Chạy lại toàn bộ admin-redesign: 12/12 qua; check bản cuối cũng qua |
| Bố cục đủ6 trang | 1440×900, 1024×768, 768×1024, 390×844; stress320×844: cả30 lượt không tràn ngang tài liệu; bảng cuộn riêng |
| Chữ/focus/reduced-motion | Qua kiểm tra màu chữ đang hiện trong viewport1440 trên6 trang: chữ thường≥4.5:1/chữ lớn≥3:1, bỏ qua disabled và iconẩn; outline control≥2px và transition0s khi reduced-motion |
| Đối chiếu mã | AST của6 page + ChapterFunnelChart khớp phần nghiệp vụ sau khi bỏ class/ARIA/scroll focus, ref trả focus và whitespace do formatter; API adapter, helper lọc/tính toán và auth/route/backend không có diff |
| `git diff --check` | Sạch ở bước nghiệm thu |

Chrome chạy headless qua Playwright hiện có: browser/profile tạm do Playwright tạo riêng cho lượt chạy, context mới cho từng test; không mở hoặc tái sử dụng profile cá nhân. Không chạy build/prepare manifest cùng lúc với browser. Fixture API chỉ nằm trong E2E; graph và danh mục chứng cứ lấy từ asset hiện có, không đưa dữ liệu giả vào sản phẩm.

Các luồng đã kiểm tra:

1. Sáu trang/điều hướng mobile/active route; skip link/focus, xác nhận logout hủy và chấp nhận; chặn người chưa đăng nhập và ROLE_PLAYER khỏi Admin. Link quay game giữ đúng `/play` (test mới kiểm href, không mô tả là đã chơi lại toàn bộ qua link này).
2. Tổng quan: làm mới sau lỗi API, bốn thẻ số liệu, biểu đồ, online shortcut và quick link Hồ sơ.
3. Hồ sơ: loading, tìm theo email, kết quả rỗng, tài khoản chưa có save, lỗi/làm mới phục hồi. Sổ tay đọc từ danh mục thật của fixture, raw JSON, Tab trong modal, Escape, focus trở về nút gọi và JSON lỗi; mobile không tràn dialog.
4. Báo lỗi: bộ lọc gửi status như cũ, bật/tắt polling; PENDING→RESOLVED→PENDING giữ PATCH `{status}`; refresh/trạng thái rỗng. G4 hiện có kiểm thêm polling/trợ giúp.
5. Chứng cứ: nạp/hủy nạp, xóa/hủy xóa/lỗi xóa, thiếu→đủ→thiếu sau xóa/reload; thêm/sửa có confirm, payload và ảnh chỉ gửi khi lưu; upload PNG→DataURL WebP; lỗi máy chủ và nguồn chuẩn. Mobile kiểm required/maxLength50/100, upload/xem trước/gỡ ảnh/hủy và khả năng truy cập form.
6. Kịch bản: tìm tiếng Việt/ID, 8loại biên tập và16loại tra cứu, chỉ đọc, giữ nháp khi lọc; save→validate→preview→review→publish→history/restore, payload cũ và lỗi lưu hiện rõ; G4 kiểm cả phản hồi nội dung/lưu khi sang game.
7. Bảo trì: lịch Việt Nam→UTC giữ cùng instant ở UTC/Việt Nam/New York, hiển thị giờ Admin/sổ tay/lịch sử; hủy/kết thúc có confirm. Bộ cũ kiểm cả thông báo và dừng game đúng deadline.

## Những lỗi QA đã phát hiện và sửa

- Tab của native dialog có thể đi tới browser chrome: thêm vòng focus với vùng nội dung có thể cuộn bằng bàn phím.
- Nút mở sổ tay bị disabled trong lúc tải nên `document.activeElement` không còn là nút gọi: giữ ref của nút bằng handler trình bày onClickCapture, không sửa request/handleInspectSave.
- Chữ placeholder “Chưa có ảnh” có tương phản4.34:1 trên nền phụ: đổi token subtle, kiểm lại qua.
- Ảnh full-page khi đang cuộn có thể bắt skip link nằm ngoài viewport và màu giữa transition: đổi skip link sang clip khi chưa focus; screenshot dừng transition hữu hạn. Đã chụp/xem lại modal và form mobile sau sửa.
- Ca Tab đầu trang từng chạy trước lazy mount: test đợi h1 trước khi gửi phím; không thêm logic tự focus ngoài yêu cầu.

## Ảnh và chứng cứ

Thư mục local ignored: `frontend/node_modules/.cache/admin-redesign-qa/`.

- 24ảnh: `{overview,users,bugs,evidence,story,operations}-{1440,1024,768,390}.png`.
- `save-mobile.png`, `evidence-form-mobile.png`. Ảnh upload trong fixture là PNG kỹ thuật1×1 nên preview là ô đen; không thay ảnh sản phẩm hoặc dữ liệu thật.
- `source-audit.json`: kết quả đối chiếu AST và phạm vi loại bỏ thuộc tính trình bày.

Đã mở xem ảnh đại diện của cả sáu trang trên desktop và các bố cục tablet/mobile, gồm bảng, editor, form ảnh và dialog. Bảng nhỏ màn hình cần cuộn ngang để xem các cột bên phải; hành vi được giữ và vùng cuộn có thể focus.

## Giới hạn và cách áp dụng skill

Không chạy gate marketing của skill hoặc báo `GATE: PASS`: các yêu cầu hero/dealt moments/section toàn màn hình, viết lại copy và kit form mâu thuẫn với yêu cầu dashboard giữ nghiệp vụ/nội dung. Áp dụng phần hệ thống/token/phân cấp/căn lề/contrast/focus/hoàn thiện; dùng bộ E2E của dự án cho Admin có đăng nhập. Không dùng các script browser của skill hay profile cá nhân.

Không kiểm CRUD/publish/bảo trì bằng backend/MySQL thật, SMTP/Google thật, dữ liệu quy mô sản xuất, trình duyệt khác hoặc thiết bị cảm ứng thật. Fixture chứng minh hành vi frontend và payload của các luồng đã chạy, không chứng minh transaction/live permission phía server. Không chạy Maven trong tác vụ chỉ thay UI này. Kiểm tra contrast là phạm vi tự động nêu trên, không phải chứng nhận WCAG toàn phần hoặc audit screen reader.

Không có yêu cầu đặc tả cần xác nhận trong phạm vi đã giao. G3 của TEETS2 vẫn chưa được giao; khối online ở Tổng quan được giữ. Backend, database, auth, router/API contract, dữ liệu nguồn và package dependencies không sửa.
