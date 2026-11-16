# T-062 — Kết quả kiểm thử (16/11/2026)

Nhánh duy, chưa commit/push. Phạm vi DEC-027 và hướng dẫn ở ACCOUNT_AND_OPERATIONS.md. Không sửa docs/sources, chapter JSON, graph/state contract hoặc schema.sql gốc.

## Kiểm tra tự động

| Kiểm tra | Kết quả thực tế |
|---|---|
| `frontend/npm run check` | ESLint/Prettier sạch; 32 file, **221/221 Vitest**; Vite build thành công, hết cảnh báo font. Phaser vẫn tải riêng khi vào game |
| `backend/mvn clean test` (repo Maven của người dùng) | **26/26** theo Surefire XML: 17 ca cũ + 5 ca Google signature/claims + 4 ca session/maintenance security |
| Chrome Playwright toàn bộ | **10/10**, lần cuối 4,8 phút: 3 account/operations, 3 evidence UI, 3 Chapter 1, 1 Story Content |
| API + MySQL + SMTP cục bộ | 7 nhóm qua: userId/session, online không cần save, ownership save/load/report, login thay phiên/stale logout, reset qua SMTP một lần/thu hồi phiên, Google chưa cấu hình, scheduled maintenance/server block/end |
| Reset đồng thời/hết hạn | 3 nhóm qua: hai yêu cầu đồng thời chỉ gửi một email; cùng token chỉ một reset commit; DB chỉ lưu hash và token hết hạn không sử dụng được |
| Chapter validator | Wrapper `scripts/chapter1/validate.py` qua **6290 assertion**, 1264 node/43 statement; broken targets/unreachable rỗng, nguồn không bị ghi lại |

Browser kiểm tra 20 vòng Admin↔game và logout/login trong cùng trang; pause/settings/resume/về menu giữ nguyên state; report từ player tới Admin; lưu từ Sổ tay lên MySQL; online trước save; lịch thông báo rồi dừng game và giữ local; server chặn API game trong bảo trì; Admin kết thúc để resume; browser thứ hai thay phiên; reset UI bằng email nhận thật ở SMTP localhost. Hai lượt chơi toàn Chương 1 và publish/restore Story Content đều qua.

## Môi trường và giới hạn

- Backend thật: Java 21 trên máy, target Java 17/Spring Boot 3.4.4, MySQL 8; DB dùng một lần `detective_t062_20261116_f512`. Frontend Vite 5196, API 18982; SMTP chỉ lắng nghe 127.0.0.1:25862, không gửi thư ra ngoài.
- Chưa có Google Client ID hoặc SMTP thật theo xác nhận người dùng. Không tuyên bố đã đăng nhập tài khoản Google thật hoặc gửi thư tới hộp thư bên ngoài. Google verifier dùng token RSA ký bằng khóa thử, kiểm tra cả chấp nhận hợp lệ và từ chối sai chữ ký/issuer/audience/azp/nonce/email_verified/expiry. UI/API báo chưa cấu hình khi thiếu dịch vụ.
- Playwright được khai báo trong package nhưng executable chưa cài trên máy; QA dùng bundle Playwright 1.62.1 thật và Chrome qua loader tooling ngoài repo, không thay dependency/lockfile frontend. SMTP capture có helper chuẩn thư viện Python ở scripts/qa_smtp_capture.py.
- Fake-auth canvas/evidence tests chỉ mock thêm heartbeat, vẫn đi giao diện thật. Story Content và account/operations dùng API + DB thật riêng; không dùng fake role để chứng minh quyền server.

## Kiểm tra giao diện

Đã mở xem ảnh Admin Operations ở 1280px/390px và màn game dừng theo lịch; không tràn ngang mobile. Đã xem riêng hộp “Bắt đầu ván mới?” sau hai postrender của Phaser: dấu/khoảng cách đúng, đủ 5 font face loaded. Ảnh chụp quá sớm trong E2E từng còn frame cũ; đã lấy probe đồng bộ render riêng để đánh giá font, không dùng frame cũ làm bằng chứng.

Ảnh và JSON chứng cứ nằm tại `C:/Users/Admin/.codex/visualizations/2026/11/16/01a1e1cf-f362-7163-89d7-571f1146147e/account-operations-qa/`: operations-desktop.png, operations-mobile.png, scheduled-maintenance.png, new-game-confirm-fonts.png, api-results.json, reset-edge-results.json, font-dialog-results.json.

## Lỗi tìm thấy và đã sửa trong QA

- JJWT không cho clear registry về rỗng trước khi thêm thuật toán: token hợp lệ bị từ chối. Đã giữ registry chuẩn, khóa header RS256 và dùng RSAPublicKey có kiểm tra chữ ký/claim; ca hợp lệ và ca giả mạo đều qua.
- Esc từ Settings có thể đóng cả modal vừa mở: đã ngăn default/propagation của phím trước khi mở lại menu.
- Kết thúc bảo trì trong Settings phải khôi phục Settings nhưng giữ gameplay đang pause; có unit kiểm tra trạng thái này và phiên nhớ trong menu.
- Bản lịch cũ về chậm không được mở lại game hoặc ghi đè hủy lịch mới; có revision/time-order guard và kiểm tra clock lệch/deadline latch.
- Cooldown reset cần locking current read sau khóa user để đúng cả với MySQL REPEATABLE READ; kiểm tra đồng thời bằng DB thật qua.
- Không giả định mục menu đang chọn khi chuột hover một vị trí: test chọn theo bounds của control thật.

## CSDL chính

Đã áp dụng SQL bổ sung account-operations.sql trên detective_game. Trước/sau: users=4, game_saves=0, evidence_master=12, bug_reports=0 không đổi; bảng phiên/reset/Google mới rỗng, bảo trì OFF/revision0. Không chép fixture, email hoặc lịch thử vào DB chính. Dọn môi trường thử được ghi tại checkpoint cuối T-062 trong PROGRESS_LOG.md.

DB thử đã được kiểm tra chỉ có tài khoản fixture rồi xóa; các server 18982/5196/25862 đã dừng và không còn listener. Không commit/push.
