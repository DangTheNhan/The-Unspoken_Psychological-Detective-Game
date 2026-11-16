# T-062 — Tài khoản, menu và vận hành (DEC-027)

Người dùng duyệt triển khai cả 4 giai đoạn T-061 ngày 16/11/2026, chỉ Google cho đăng nhập ngoài. Chưa có SMTP/Google Client ID: chuẩn bị cấu hình và hướng dẫn, không giả lập tích hợp trong sản phẩm. Bảo trì có thông báo trước và lịch bắt đầu; đến hẹn người chơi tự dừng, Admin vẫn truy cập để mở lại.

## Phạm vi thực hiện

1. Cleanup scene ở SHUTDOWN và DESTROY; giữ Phaser 4.2.1/StrictMode. Font đã duyệt, xác nhận logout, menu khi chơi/Settings, về menu giữ phiên tạm. Admin mặc định vào /admin.
2. Login trả thêm userId; báo lỗi có form và xác minh danh tính phía server. Save/load giữ path/payload và kiểm tra quyền sở hữu. Khi local/server khác nhau, người chơi chọn bản để tiếp tục; không tự ghi đè.
3. Phiên lưu MySQL, một phiên hiện hành cho mỗi tài khoản; login mới thay phiên cũ, logout chỉ thu hồi đúng phiên. Heartbeat 15s, online 60s, Admin poll 5s. Đếm tài khoản player duy nhất, tách người có bản lưu.
4. Reset mật khẩu qua email đã đăng ký, token một lần/hạn 30 phút/giới hạn gửi; Spring Boot Mail theo BOM 3.4.4. Google GIS + nonce một lần, server kiểm tra RS256/JWKS/iss/aud/exp/email/sub; tài khoản email trùng phải xác minh mật khẩu local để liên kết; Admin không đăng nhập bằng Google. Bảo trì lên lịch theo UTC, UI nhập giờ máy người dùng; ngừng game đến giờ, giữ local và server chặn API game; kết thúc do Admin.

## API bổ sung

- GET /api/auth/config: cờ khả dụng reset và Google client ID công khai.
- POST /api/auth/forgot-password {email}; POST /api/auth/reset-password {token,password}.
- POST /api/auth/google/challenge: nonce; POST /api/auth/google {credential,nonce,localPassword?}.
- POST /api/auth/session {area:WEB|PLAY}: xác thực phiên, heartbeat; POST /api/auth/logout: thu hồi phiên hiện hành.
- GET /api/system/status: serverNow và thông báo/lịch bảo trì; không yêu cầu đăng nhập.
- GET /api/admin/online: thống kê player online; GET/PUT/DELETE /api/admin/maintenance: xem/đặt lịch/kết thúc bảo trì, ROLE_ADMIN.

DB dùng SQL bổ sung account-operations.sql; không sửa schema.sql gốc. Mã phiên/reset/nonce lưu hash; không ghi token hoặc mật khẩu vào log. JWT cũ không có sid cần đăng nhập lại. Không đổi graph/state/chứng cứ/Story Content.

## Xác minh

Chạy frontend check; backend clean test; Chrome route/logout lặp, pause/resume, báo lỗi, phiên thứ hai, online, bảo trì theo lịch với DB thử riêng. Reset thử qua SMTP cục bộ; Google thử chữ ký/claim/nonce với khóa kiểm thử. Khi chưa có cấu hình thật, không báo đã đăng nhập Google hoặc gửi mail tới hộp thư thật.

Tham chiếu kỹ thuật: [Google server verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token), [GIS JS API](https://developers.google.com/identity/gsi/web/reference/js-reference), [Spring Boot 3.4 mail](https://docs.spring.io/spring-boot/3.4/reference/io/email.html). Chỉ dùng để tích hợp tính năng đã được giao.

## Cấu hình trên Windows

Áp dụng `backend/src/main/resources/db/account-operations.sql` trên database đã có schema gốc và story-content.sql. Script bổ sung 5 bảng, có thể chạy lại, không xóa dữ liệu cũ. Khi triển khai cập nhật backend và frontend cùng lần; JWT phát hành trước DEC-027 cần đăng nhập lại.

Backend đọc biến môi trường, không tự đọc `.env` của frontend. Đặt trong cửa sổ PowerShell dùng để chạy backend, rồi chạy `mvn spring-boot:run` trong backend. Thay các giá trị mẫu bằng cấu hình thật, giữ bí mật SMTP ngoài Git/chat/log:

```powershell
$env:FRONTEND_URL = "http://localhost:5173"
$env:GOOGLE_CLIENT_ID = "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
$env:SMTP_HOST = "smtp.example.com"
$env:SMTP_PORT = "587"
$env:SMTP_USERNAME = "your-smtp-account"
$env:SMTP_PASSWORD = "YOUR_SMTP_PASSWORD"
$env:MAIL_FROM = "your-verified-sender@example.com"
$env:SMTP_AUTH = "true"
$env:SMTP_STARTTLS = "true"
$env:SMTP_SSL = "false"
mvn spring-boot:run
```

SMTP_HOST/PORT/USERNAME/PASSWORD/MAIL_FROM do dịch vụ gửi thư cung cấp. Địa chỉ gửi cần được dịch vụ cho phép. Mẫu trên dùng STARTTLS cổng 587; nếu dịch vụ yêu cầu TLS trực tiếp thì dùng cổng/cấu hình họ chỉ định (thường SMTP_SSL=true và SMTP_STARTTLS=false). Không dùng mật khẩu tài khoản cá nhân thay cho thông tin SMTP mà dịch vụ yêu cầu. SMTP có timeout 5 giây. Chỉ tắt TLS/AUTH cho máy chủ thử trên localhost.

Google: tạo OAuth client loại **Web application**, cấu hình **Authorized JavaScript origins** trùng frontend, ví dụ `http://localhost:5173`; `http://127.0.0.1:5173` là origin khác và phải khai báo riêng nếu sử dụng. Dùng Client ID, không dùng Client Secret hoặc service-account key trong frontend. Luồng này dùng GIS popup/credential callback nên không cần thêm endpoint redirect URI của ứng dụng. Hoàn thiện cấu hình màn hình đồng ý và người dùng thử theo [hướng dẫn thiết lập của Google](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

Server kiểm tra chữ ký, issuer, audience, expiration, email_verified, sub và nonce một lần; không chấp nhận ID hoặc email tự nhập làm bằng chứng Google. Nếu email đã có tài khoản local, người chơi nhập mật khẩu local để liên kết; không tự gộp theo email. Tài khoản quản trị dùng mật khẩu riêng.

Khi chưa có cấu hình: để các biến Google/SMTP trống. Game và đăng nhập bằng mật khẩu vẫn hoạt động; Google/email báo chưa cấu hình. GET /api/auth/config cho biết khả dụng, không trả bí mật. Mật khẩu mới tối thiểu 8 ký tự, tối đa 72 byte UTF-8 do encoder BCrypt hiện có; các phiên cũ bị thu hồi sau reset thành công.

## Sử dụng

- Người chơi: Menu trong trang game để tạm dừng, mở Cài đặt, gửi Báo lỗi hoặc về menu chính. Về menu giữ các scene/runner trong bộ nhớ; Tiếp tục điều tra quay lại phiên đó. Tải lại trang chỉ có thể lấy bản đã lưu. Lưu game vẫn nằm trong Sổ tay.
- Khi máy chủ và trình duyệt có tiến độ khác nhau, người chơi chọn bản để tiếp tục. Chọn chưa ghi đè bản còn lại; lần lưu sau cập nhật theo bản đang chơi. Bản local riêng theo username; bản cũ không có tên tài khoản được giữ trên đĩa nhưng không tự nạp sang một tài khoản khác.
- Admin: mở **Kết nối & Bảo trì** để xem người còn kết nối. Online khác với “người chơi có bản lưu”; số chương hoàn thành vẫn giữ cách tính trước.
- Bảo trì: nhập giờ tương lai và thông báo, công bố lịch. Người chơi nhận qua kiểm tra kết nối (tối đa khoảng 15 giây khi mạng bình thường); khi đã nhận lịch, đồng hồ được đối chiếu giờ server và tự dừng đến hẹn kể cả mất kết nối sau đó. Server tự chặn API game tại thời điểm bắt đầu. Bản local được cố gắng lưu khi dừng, trạng thái thành công/thất bại hiển thị trên trang. Admin chọn **Kết thúc bảo trì** để mở lại; trình duyệt player nhận cập nhật rồi resume. Có thể hủy lịch trước giờ hẹn.
- Login mới thay phiên hiện tại. Trình duyệt cũ nhận 401 ở request/heartbeat kế tiếp, giữ local rồi về đăng nhập. Nhiều tab cùng trình duyệt chia sẻ cùng token nên chỉ tính một người; đăng xuất được đồng bộ giữa các tab.

## Kiểm thử và giới hạn môi trường

Mail và Google cần cấu hình thật để thử với tài khoản/hộp thư thật. QA dùng DB dùng một lần, SMTP chỉ nhận trên localhost và khóa RSA thử cho verifier; không gửi thư tới bên ngoài. Rate limit public endpoints ở bộ nhớ của một backend (10 yêu cầu reset/IP/phút, 20 Google/IP/phút); cooldown reset theo tài khoản nằm trong DB. Nếu chạy nhiều backend cần đồng bộ giới hạn toàn cụm trước khi triển khai quy mô đó.

Để chạy browser test tài khoản: dùng backend trỏ database thử đã có cả 3 SQL, SMTP_HOST=127.0.0.1/SMTP_PORT=25862/SMTP_AUTH=false/SMTP_STARTTLS=false/MAIL_FROM=qa@example.test. Chạy `python scripts/qa_smtp_capture.py --port 25862 --output backend/target/mail-capture.json` trong một cửa sổ khác. Đặt ACCOUNT_TEST_API và STORY_TEST_API là URL API thử, SMTP_CAPTURE_PATH là đường dẫn tuyệt đối tới file capture; ACCOUNT_ADMIN_USER/ACCOUNT_ADMIN_PASSWORD trùng Admin của DB thử, ADMIN_USERNAME/ADMIN_PASSWORD dùng cho test Story Content. Vite test chạy 5196 và gọi đúng API thử; sau đó `npm run test:e2e`. Các test account không chạy khi thiếu ACCOUNT_TEST_API. Dùng đúng phiên bản Playwright được cài cho dự án; QA T-062 có ghi rõ runner bundle do máy hiện tại chưa có executable từ package.
