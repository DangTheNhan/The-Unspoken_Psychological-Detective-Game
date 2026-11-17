# Thiết kế lại Admin — T-072

Loại: ứng dụng quản trị vận hành của The Unspoken, React19/JavaScript + Tailwindv4 + react-router-dom + Axios; component tự xây, không có thư viện UI riêng. Nguồn: yêu cầu người dùng hiện tại, DEC-024/026/027/031/032 và các tài liệu triển khai Admin. Chỉ thay giao diện.

## Hướng thiết kế và phạm vi

Sidebar graphite, nền làm việc xám sáng, surface trắng và điểm nhấn hổ phách; font Be Vietnam Pro hiện có, số liệu tabular, kích thước chữ đọc được. Một bộ token dùng riêng trong Admin, không đổi giao diện game/auth. Điều hướng gọn trên mobile; bảng cuộn trong khung, không kéo tràn trang; form/modal/bộ lọc có focus rõ, target chạm đủ lớn, hỗ trợ reduced-motion. Giữ nội dung và mật độ dữ liệu phục vụ thao tác.

Áp dụng skill `C:/Users/dangt/.agents/skills/design-taste-frontend/SKILL.md` về hệ thống, phân cấp, mép thẳng hàng, tương phản, control và hoàn thiện trên browser. Theo yêu cầu người dùng, không áp dụng hero/section toàn màn hình, ảnh trang trí, shader, animation phức tạp hoặc viết lại nội dung nghiệp vụ. Không đưa kit marketing/system.js vào form đang có vì sẽ thay handler/validation. Kiểm tra tương tác bằng Playwright hiện có với context/profile tạm riêng; không dùng profile browser cá nhân.

## Danh mục thao tác thực tế phải giữ

| Trang/component | Route / thao tác đã khảo sát |
|---|---|
| Tổng quan | /admin; tải/làm mới số liệu, online/link Operations polling5s, 4thẻ số liệu, biểu đồ tiến độ và 3quicklinks |
| Hồ sơ | /admin/users; lọc ID/tên/email tại client, refresh, mở save, trạng thái chưa chơi/không có save; không có sort/pagination UI |
| Sổ tay | modal structured/raw JSON,4nhóm hồ sơ, ảnh/tên từ danh mục, lỗi JSON, nút đóng; dữ liệu chỉ đọc |
| Báo lỗi | /admin/bugs; ALL/PENDING/RESOLVED, bật/tắt polling5s, refresh, cập nhật trạng thái, sync giờ Việt Nam, lỗi/loading/empty/disabled |
| Chứng cứ | /admin/evidence; client search/chapter filter, refresh inventory, nạp thiếu có confirm; create/edit/delete có confirm; URLảnh/chọn file→resize DataURL/xem trước/gỡ ảnh; required/maxLength/trim/cast/payload giữ nguyên |
| Kịch bản | /admin/story-content; chương/tìm/type/tra cứu nâng cao, đối chiếu gốc/published, sửa text, chữ còn trống/giới hạn; dirty guard, save/reload/reset, validate/preview/review/publish/history/restore; revision/hash/fingerprint và quyền giữ nguyên |
| Vận hành | /admin/operations; online5s/TTL60s và trợ giúp, refresh; lịch giờ Việt Nam→UTC, confirm công bố/hủy/kết thúc, trạng thái trước/đang bảo trì và message |
| Khung | đủ6link đúng route/current page; username/role, quay lại game, confirm logout; AdminRoute/ProtectedRoute/auth/API không sửa |

Không có thao tác download hoặc sort/pagination riêng trong các trang đã đọc; không tự thêm. Upload ảnh chứng cứ là luồng có thật, phải kiểm thử lại. Dữ liệu mẫu chỉ được dùng trong API fixture kiểm thử, không đi vào sản phẩm.

## Bước thực hiện / rủi ro / nghiệm thu

1. Lưu snapshot nguồn UI để đối chiếu, tạo token/shell/nav và component trình bày chung. Không đổi route/API/dependency.
2. Chuẩn hóa màu/chữ/control/card/table/modal/editor trên đủ6trang; giữ nguyên mọi callback/điều kiện/validation/tính toán/payload. Cải thiện tên control, focus và modal keyboard trong phạm vi giao diện.
3. `npm run check`; Chrome tất cả trang ở1440,1024,768,390 (thêm320 nếu cần); keyboard/focus, modal, lỗi/empty/loading, CRUD/upload, editor review/publish/restore, bảo trì, role guard và điều hướng/quay game/logout.
4. Xem ảnh, sửa lỗi layout thật, ghi QA/giới hạn, cập nhật bộ nhớ. Không commit/push.

Rủi ro: đổi màu làm mất contrast, bảng/mobile tràn, control bị che, thay CSS lọt sang game, modal mất focus, vô tình sửa callback/payload. Giới hạn xác minh: API fixture không chứng minh transaction MySQL hoặc dịch vụ bên ngoài; chỉ báo kết quả đã chạy và đối chiếu source thật. Không tự ghi DB người dùng để thử CRUD/publish/bảo trì.
