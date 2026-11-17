# G2 — Giờ Việt Nam trong Admin và lịch bảo trì

Ngày thực hiện: 17/11/2026. Tác vụ T-066, DEC-031, nhánh `Nhan`.
Căn cứ: TEETS2.docx (SRC-7, M03), `docs/TEETS2_FIX_PLAN.md` G2 và yêu cầu người dùng “thực thi G2”.

## 1. Kết quả

- Hồ sơ Thám tử, chi tiết bản lưu, báo lỗi/lần đồng bộ, nháp/lịch sử kịch bản, online và lịch bảo trì dùng giờ `Asia/Ho_Chi_Minh`, có nhãn giờ Việt Nam.
- Ô `datetime-local` luôn nhận giờ Việt Nam, kể cả browser dùng UTC hoặc New York; gửi `startsAt` dưới dạng UTC có `Z` như trước. Hộp xác nhận và banner game cũng hiển thị theo Việt Nam.
- Timestamp thiếu/không hợp lệ hiển thị `—`; input bảo trì không hợp lệ không được gửi. Có kiểm tra ngày thực, năm nhuận, giây/fraction và chuyển ngày.
- Không đổi endpoint, schema, tên/kiểu/định dạng JSON timestamp, dữ liệu cũ hoặc cấu hình JDBC. Không thay đồng hồ/revision/deadline guard của bảo trì.

## 2. Bằng chứng DB → Java → JSON

Audit chỉ đọc DB MySQL cục bộ hiện có: truy vấn timestamp/epoch và ID để ràng buộc query; không đọc nội dung báo lỗi, save hoặc thông tin tài khoản. Không INSERT/UPDATE/DELETE/DDL. Connection audit `setReadOnly(true)`; Hibernate audit dùng `hbm2ddl.auto=none`, read-only và MANUAL flush.

| Điểm đối chiếu | Giá trị thực tế |
|---|---|
| JVM | Asia/Saigon |
| MySQL global/session ban đầu | SYSTEM; NOW 09:10:49, UTC_TIMESTAMP 02:10:49 |
| JDBC URL hiện có | `serverTimezone=UTC` |
| Timestamp báo lỗi SQL raw / getObject(LocalDateTime) | `2026-11-17 08:55:47` |
| Epoch DB của cùng timestamp | `1794880547` |
| JDBC getTimestamp().toLocalDateTime() / Hibernate HQL | `2026-11-17T15:55:47` — lệch +7 giờ |
| Helper mới đọc epoch → Việt Nam | `2026-11-17T08:55:47` |
| Jackson serialize giá trị mới | `"2026-11-17T08:55:47"` — giữ dạng LocalDateTime không offset |

Có thử `SET SESSION time_zone='+00:00'` **chỉ trên connection audit**, sau đó đóng connection; không sửa cấu hình hoặc timezone global. Kết quả chứng minh lỗi diễn giải JDBC/JPA; không dùng thử nghiệm này làm bản sửa vì đổi timezone toàn ứng dụng có thể ảnh hưởng dữ liệu application-written/session/bảo trì đã có.

### Phân biệt nguồn timestamp

- `users.created_at`, `game_saves.updated_at`, `bug_reports.created_at` do MySQL tạo, entity có `insertable=false, updatable=false`. `AdminTimestamps` đọc `UNIX_TIMESTAMP(...)` theo lô ID, bind tham số, chuyển epoch sang Việt Nam. Một query mỗi tập timestamp, không query từng hàng; không đổi session timezone. DTO không còn dùng LocalDateTime đã bị JDBC dịch lệch.
- Draft/version dùng `LocalDateTime.now()` của Java. Giữ nguyên cách ghi và round-trip Hibernate đang có; ở DTO tái dựng thời điểm theo zone JVM rồi chuyển sang Việt Nam bằng `VietnamTime.fromApplicationLocal`. Không lấy epoch DB để áp dụng cách sửa của nhóm DB-generated vào các trường này.
- Prepared `SELECT CAST(? AS DATETIME(6))` với `setTimestamp(Timestamp.valueOf(local))` và `getTimestamp().toLocalDateTime()` xác minh round-trip giờ application 09:29:29, không ghi hàng thử. Unit kiểm thêm nguồn UTC và Việt Nam qua ranh giới ngày.
- Online và bảo trì vốn là `Instant`: giữ nguyên giá trị/offset và định dạng API, chỉ đổi cách trình bày hoặc diễn giải input phía frontend.

Tại thời điểm audit, game_saves, story_text_drafts và story_text_versions chưa có bản ghi thực tế để đối chiếu từng hàng. Không tạo dữ liệu trên DB người dùng để bổ sung mẫu. G2 chưa chạy HTTP end-to-end với backend thật và chưa chạy vòng publish/restore thật trên MySQL; bằng chứng DB/JPA/Jackson, unit và API fixture được ghi riêng, không xem là cùng một ca tích hợp.

## 3. Vị trí sửa

- Backend: `common/VietnamTime.java`, `admin/AdminTimestamps.java`, DTO mapping trong `AdminService.java`, `admin/story/StoryTextService.java`.
- Frontend: `shared/time/vietnamTime.js`; AdminUsersPage, SaveJsonModal, AdminBugReportsPage, AdminStoryContentPage, AdminOperationsPage; banner trong GamePlayPage.
- Test mới: VietnamTimeTest, AdminTimestampsTest, vietnamTime.test.js, vietnam-time.spec.js. Bổ sung AdminServiceTest xác minh cùng giờ trước/sau resolve báo lỗi và danh sách/chi tiết save. Điều chỉnh test live account-operations nhập lịch theo Việt Nam thay vì timezone máy.
- Tài liệu: kế hoạch G2, hướng dẫn vận hành, PROGRESS_LOG và PROJECT_MEMORY.

Frontend dùng `Intl.DateTimeFormat` với `timeZone` chỉ định. Chuỗi Admin không offset được hiểu là giờ Việt Nam đã chuẩn hóa ở DTO; chuỗi có `Z`/offset là thời điểm tuyệt đối. Không gán `Z` hay cộng/trừ 7 giờ lên mọi giá trị. Với dữ liệu lịch sử, quy tắc IANA được áp dụng thay vì giả định UTC+7 cho mọi năm.

## 4. Kiểm thử đã chạy

| Lệnh / kiểm tra | Kết quả |
|---|---|
| `frontend`: `npm run check` bản cuối | ESLint + Prettier qua; Vitest **241/241**, 35 file; Vite build qua |
| `backend`: `mvn test` bản cuối | **30/30**, 8 lớp test; 0 failure/error/skip; release 17 |
| `npm run test:e2e -- vietnam-time.spec.js` lượt đầu | **6/6** qua; đối chiếu timestamp Admin, input UTC và banner |
| `npm run test:e2e -- vietnam-time.spec.js pause-controls.spec.js main-menu.spec.js` bản cuối | **13/13** qua: 6 G2 + 3 G1 + 4 menu; bổ sung kiểm deadline vào 6 ca G2 |
| MySQL/JDBC/Hibernate/Jackson audit chỉ đọc | Xác nhận sai lệch và giá trị chuẩn hóa như bảng mục 2 |
| `git diff --check`, `git ls-files -u` | Không lỗi whitespace; không còn file unmerged |

Chrome dùng API giả lập trên localhost, mỗi ca tạo context riêng với UTC, Asia/Ho_Chi_Minh hoặc America/New_York. Kiểm tra được:

1. Cùng instant `2026-11-16T18:00:00Z`, chuỗi `2026-11-17T01:00:00+07:00` và Admin không offset đều hiển thị **17/11/2026 01:00:00** trong danh sách/save/bug/draft/version; lần đồng bộ và online là 01:00:00.
2. Nhập **17/11/2030 01:00:00** ở cả ba browser gửi chính xác `2030-11-16T18:00:00.000Z`; hộp xác nhận, trạng thái Admin và banner player khớp giờ Việt Nam.
3. Trước deadline một giây hiển thị còn một giây và chưa khóa; đến đúng instant UTC hiện “Game tạm dừng để bảo trì”, keyboard game bị khóa dù fixture server vẫn trả scheduled/active=false. Unit bảo trì hiện có cũng qua: revision cũ không ghi đè, phản hồi chậm không mở khóa deadline, dùng clock offset server và hủy lịch revision mới được mở lại.
4. Hồi quy G1/menu: WASD/tiếng Việt trong form, ESC/pause/Settings/Sổ tay/tutorial, menu giữ tiến trình, tài khoản mới/cũ và bảo trì không bị ESC/đóng form mở khóa.

Test menu/G1 cũ có log cảnh báo mạng do các endpoint ngoài phạm vi fixture; assertions đều qua. G2 không dùng backend/SMTP/Google thật. Các ca live account/story cần DB thử và biến ACCOUNT_TEST_API/STORY_TEST_API không được chạy trong lệnh chọn lọc này. Không tuyên bố đã kiểm toàn bộ Chương 1 hay G3–G5 trong G2.

## 5. Kiểm tra hình và áp dụng

Đã mở xem hai ảnh Chrome (browser UTC): modal bản lưu và trang lịch bảo trì sau công bố. Giờ/nhãn đọc được, không chồng nhau. Bản QA ở thư mục ignored `frontend/node_modules/.cache/teets2-g2-qa/`:

- `save-time-vietnam.png`
- `maintenance-vietnam-input.png`

Khởi động lại backend và tải lại frontend cùng lần để dùng mapping mới. Không cần chạy SQL hoặc migrate timestamp. Giữ `application.yml` và staging có sẵn; không commit/push hoặc tạo merge commit. G2 hoàn tất; G3–G5 chưa thực hiện.
