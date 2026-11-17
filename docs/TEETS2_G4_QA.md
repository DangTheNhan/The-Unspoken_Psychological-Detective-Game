# G4 — Tinh giản Admin và thông báo nội dung

Tác vụ T-068, ngày 17/11/2026, nhánh Nhan. Người dùng giao “thực thi G4” sau phần làm rõ T-067. Nguồn: TEETS2.docx/SRC-7 và docs/TEETS2_FIX_PLAN.md G4; DEC-032.

## Bảng nội dung giao diện

| Vị trí / hiện tại | Xử lý G4 | Căn cứ / ảnh hưởng |
|---|---|---|
| Loại phân đoạn lấy mọi type của graph dù bật chỉ hiện chữ được sửa | Mặc định chỉ liệt kê loại có fields được phép biên tập; 8 loại thay cho 16 ở Chương 1 hiện tại | TEETS2 yêu cầu tinh chỉnh loại dư thừa; dùng fields từ API, không thay allowlist |
| Các type kỹ thuật/không có fields | Giữ khả năng tra cứu trong Tra cứu nâng cao; bỏ chọn giới hạn để xem cả 16 loại; không tạo ô sửa cho node chỉ đọc | Giữ ID/graph/chức năng tra cứu đã có |
| Tên type bằng mã tiếng Anh | Nhãn tiếng Việt trên dropdown, danh sách, tiêu đề và xem trước; vẫn tìm bằng mã gốc/ID hoặc nhãn | Chỉ đổi nhãn, không sửa type trong JSON |
| Chọn loại không tồn tại trong phạm vi mới | Trở về Tất cả loại; editor chọn một mục trong kết quả hoặc báo không có kết quả | Tránh danh sách rỗng và chỉnh nhầm node không hiện trong danh sách |
| Thay đổi nháp khi lọc/tìm kiếm | Giữ toàn bộ edits; tìm cả chữ gốc và chữ chưa lưu | Không bỏ nội dung người dùng đang sửa |
| Nút báo lỗi “Tự động cập nhật (5s): Bật” | Giữ Bật/Tắt; đưa chu kỳ 5 giây vào trợ giúp Cách cập nhật báo lỗi | Thu gọn đúng thông tin kỹ thuật đã nêu trong kế hoạch; không đổi timer |
| Operations: lời giải thích chu kỳ 5 giây/TTL 60 giây | Thu gọn vào Cách cập nhật trạng thái; người dùng mở để đọc | Giữ quy tắc online và toàn bộ chức năng bảo trì |
| Thành công nạp nội dung gốc/đã xuất bản trên màn chơi | Không hiển thị thông báo thường trực; vẫn tải/áp dụng/cache/pin nội dung | TEETS2 nêu trực tiếp câu success dư thừa |
| Mất mạng/cache/không tương thích nội dung | Giữ cảnh báo riêng và dịch theo ngôn ngữ UI | Không che việc nội dung đang dùng khác với server |
| Kết quả lưu/lỗi, trạng thái chưa lưu, validation/preview/xuất bản/restore và xác nhận nguy cơ | Giữ hiển thị và hành vi hiện có | Phục vụ quyết định của Admin/người chơi, không phải phần dư thừa |
| Khối online lặp ở Tổng quan | Chưa sửa trong G4 | Thuộc G3, cần tích hợp online vào Hồ sơ Thám tử trước |
| Các dòng Admin khác chưa được chỉ rõ trong nguồn | Giữ hiện trạng | Không tự xóa số liệu, mô tả hoặc chức năng khác |

Không sửa backend/API, SQL, dữ liệu nguồn/runtime graph, allowlist, nội dung hội thoại hoặc quyền biên tập. Việc thêm nhãn dựa trên type đang có, không thêm loại node mới.

## Kiểm tra

| Lệnh / kiểm tra | Kết quả thực tế |
|---|---|
| frontend: `npm run check` bản cuối | ESLint/Prettier qua, **244/244 test** (36 file), Vite build qua |
| `npm run test:e2e -- g4-interface.spec.js` | **6/6** qua |
| `npm run test:e2e -- g4-interface.spec.js pause-controls.spec.js vietnam-time.spec.js` bản cuối | **15/15** qua: 6 G4, 3 G1, 6 G2 |
| ESLint/Prettier riêng file E2E sau chỉnh đợi ảnh | Qua |
| `git diff --check`, `git ls-files -u` | Không lỗi whitespace; không còn file unmerged |

Ba unit mới kiểm tra phạm vi loại theo fields, loại tương lai do server cấp, tìm nhãn Việt/mã/nháp chưa lưu và giữ phân đoạn chỉ đọc đúng phạm vi. Chrome dùng graph Chương 1 thật và API fixture trên localhost; kiểm tra:

1. Dropdown có 9 option mặc định (8 loại + Tất cả), 17 option khi mở tra cứu toàn bộ; router chỉ đọc không có textarea. Tìm “Hội thoại” trả 542 đoạn hiện có; ID gốc vẫn tìm được.
2. Đổi loại/phạm vi/tìm kiếm không mất nháp; loại không còn hợp lệ được reset. Reload fixture không còn loại đang chọn vẫn hiển thị đúng. Editor không giữ node ngoài kết quả.
3. Lưu thất bại vẫn hiện lỗi và giữ chữ đang sửa. Lưu → kiểm tra → xem trước → rà soát → xuất bản → khôi phục nháp hoạt động; payload baseHash/revision/fingerprint/overrides đúng contract hiện có, xuất bản bị khóa trước rà soát và sau restore. Bản nháp/khôi phục không tự thay phiên bản đang dùng.
4. Help thu gọn/mở được; nút bật/tắt polling và làm mới vẫn hoạt động, quy tắc online 5/60 giây còn đọc được, biểu mẫu bảo trì vẫn hiện.
5. Bản base/published vẫn tải đúng graph/overrides và pin đúng version nhưng không có success banner VI/EN. Đổi ngôn ngữ hoặc request nội dung tiếp không ghi đè kết quả lưu; request tiếp không thay version đang pin của phiên chơi.
6. Cached, offlineBase và rejected vẫn cảnh báo; cảnh báo đổi sang tiếng Anh qua settings store đầy đủ mà không làm mất lỗi lưu. Lỗi lưu và cảnh báo nội dung có thể hiện đồng thời.
7. Hồi quy ESC/pause/form/Sổ tay/Settings/tutorial/khóa bảo trì G1 và giờ Việt Nam G2 qua. G2 kiểm ở UTC, Việt Nam, New York; nhập lịch gửi đúng UTC và khóa đúng deadline.

Lượt đầu đã sửa lỗi fixture chọn nhầm node, response publish/restore chưa khớp API và settings thiếu volume; không thay API để chiều theo fixture. Tên truy cập dropdown được khai báo rõ. Các lỗi 409/400/503 trong test là tình huống cố ý để xác minh UI; 404 load là fixture chưa có save. Bản cuối không có pageerror.

G4 không ghi DB người dùng, không xuất bản lên backend thật. Chưa chạy live E2E account/story, SMTP/Google hoặc hai lượt Chương 1 trong G4. Không chạy Maven lại vì không thay backend; kết quả 30 test backend ở T-066 là lịch sử, không phải kiểm tra mới G4.

## Ảnh và bàn giao

Đã mở xem ảnh desktop/mobile: nhãn/bộ lọc rõ, không tràn ngang ở 390 px; các nút lưu/xuất bản vẫn đọc được. Đã chụp lại Operations sau khi tải xong và ảnh đầy đủ cho hai thông báo độc lập. File QA ở thư mục ignored `frontend/node_modules/.cache/teets2-g4-qa/`:

- `g4-editor-desktop.png`
- `g4-editor-mobile.png`
- `g4-operations-help.png`
- `g4-independent-warnings.png`

G4 hoàn tất trong phạm vi bảng trên. Bảng và ảnh là bản thay đổi cụ thể để người dùng rà soát; không tự xóa thêm các dòng Admin chưa chỉ rõ. Tải lại frontend để áp dụng. Không commit/push, không tạo merge commit; giữ staging/application.yml có sẵn. G3/G5 chưa thực hiện.
