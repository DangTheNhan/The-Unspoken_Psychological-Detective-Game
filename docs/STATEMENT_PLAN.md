# Statement — rà soát và kế hoạch hoàn thiện

Ngày rà soát 16/11/2026, nhánh `Nhan`, commit `18b6aa1`. Phạm vi là lời khai Chương 1 và lịch sử trò chuyện theo T-044/T-045. Tác vụ này lập kế hoạch, chưa triển khai thay đổi gameplay.

## 1. Kết luận và căn cứ

Chức năng cốt lõi đã triển khai. TD-23 và TD-24 đánh dấu hoàn thành phù hợp với code hiện tại. Các trạng thái REQ-024/028/029 trong PROJECT_MEMORY trước đợt rà soát này vẫn ghi tiến độ cũ.

Căn cứ gồm Project §2.1, §3.2–3.3, Data Contract 2.0 mục Press và Present, cùng quyết định N2-Q1/N2-Q2 tại T-044/T-045.

- Lịch sử trò chuyện lưu lời nhân vật để đọc lại. Tab Lời khai chỉ lưu những bản ghi quan trọng mà graph chỉ định.
- Danh mục 43 lời khai là template. State mới chưa có lời khai, bản ghi xuất hiện sau commit của đoạn thoại.
- Lời khai có người nói, nguồn và phase thu thực tế. Engine giữ giá trị trước lần sửa trong `revisions` và quan hệ `superseded_by` khi bị thay thế.
- Press/Present phải đúng điều kiện và nguồn thực có, route đúng đầu tiên quyết định kết quả. Blocked miễn phạt, wrong trừ điểm một lần.
- Notebook có bốn tab, Lịch sử trò chuyện mở bằng nút riêng.

## 2. Đối chiếu code hiện tại

| Nội dung | Hiện trạng | Vị trí kiểm tra |
|---|---|---|
| Danh mục và luật | 43 template, 38 statementRules | `frontend/public/assets/chapters/chapter1/` |
| Ghi nhận theo kịch bản | Có upsert, nguồn, chống tạo trùng và giao dịch | `frontend/src/game/narrative/effects.js`, `storyRunner.js` |
| Lịch sử trò chuyện | Có draft, đóng đoạn ở các hub đã định, đọc lại từng câu | `conversationHistory.js`, `NotebookScene.js` |
| Tab Lời khai | Có người nói, nội dung, nguồn, trạng thái và nội dung lời thay thế | `NotebookScene.js` |
| Lịch sử sửa | Engine giữ `revisions`, UI chưa đọc mảng này | `effects.js`, `NotebookScene.js` |
| Press/Present | Có guard, blocked miễn phạt, wrong trừ điểm, chặn thao tác cũ | `crossExam.js`, `storyRunner.js`, `StoryScene.js` |
| Nguồn Present Chương 1 | Các route hiện tại chỉ dùng Evidence ID `EV_*` | `chapter1.json`, `crossExam.js` |
| Lưu/tải cục bộ | Serialize toàn bộ story, gồm lời khai và lịch sử | `GameSession.js`, `saveService.js`, `useGameBridge.js` |
| Lưu/tải máy chủ | Luồng người chơi vướng ISS-29, login thiếu userId, bridge mới tải local | `AuthService.java`, `AuthContext.jsx`, `useGameBridge.js` |

Press từ tab Lời khai được nối khi Sổ tay mở qua node `notebook_view`. Đối chất thông thường chọn lời khai và nguồn trong `StoryScene`. Cần nghiệm thu cả hai đường vào này.

## 3. Kế hoạch phần còn lại

### S1. Nghiệm thu Lời khai và Lịch sử trò chuyện qua giao diện

Ưu tiên P1, cỡ M, nối TD-24 và TD-38.

- Mở Ván mới, xác nhận tab Lời khai trống. Chưa hỏi NPC thì lời của NPC đó chưa có.
- Hỏi Hòa, Linh, Hào, Minh, kiểm tra đúng bản ghi đã mở và đọc lại từng câu của đoạn đã kết thúc.
- Bổ sung kiểm tra trình duyệt cho tab Lời khai, nút Lịch sử, phân trang, quay lại và Press từ node Sổ tay. Hai lượt Playwright đang có kiểm Press/Present nhưng chưa trực tiếp nghiệm thu các màn này.
- Kiểm tra lời khai dài, nhiều trang và văn bản tiếng Việt để phát hiện nội dung bị che hoặc nút khó bấm.
- Rà ranh giới đoạn ở mở đầu mới. Hiện lời Hòa trước khi vào 204 giữ trong draft, đưa vào lịch sử khi về hub sau lượt hỏi Hòa. Test hiện tại xác nhận cách nhóm này. Nếu muốn đọc lại ngay tại `P1_HALL_204`, cần chốt ranh giới đoạn trước khi sửa.

File dự kiến tác động là `frontend/e2e/chapter1.spec.js`. Chỉ sửa `NotebookScene.js` hoặc `conversationHistory.js` khi tái hiện lỗi hoặc đã chốt thay đổi ranh giới đoạn.

Hoàn thành khi người chơi đọc được dữ liệu đã mở qua chuột/phím, không thấy lời chưa hỏi, không mất tiến trình khi đóng Sổ tay.

### S2. Nghiệm thu lời khai sửa và tương thích bản lưu

Ưu tiên P1, cỡ S–M, nối TD-24, TD-28 và TD-29.

- Làm Hòa sửa lời qua đường chơi thật. Xác nhận lời cũ có `status=superseded`, `superseded_by`, lời mới chỉ xuất hiện sau commit.
- Kiểm tra nhiều lần merge, merge không đổi giá trị và đọc lại lời cũ. Revision không nhân đôi, denial cũ không phát lại.
- Lưu giữa cuộc trò chuyện, sau thu lời khai và sau sửa lời. Tải lại phải giữ nguồn, revisions, draft/history và quyền Press/Present.
- Thử bản lưu schema v2 cũ chưa có `revisions` hoặc `conversation_history`, cùng trường hợp bản ghi thay thế bị thiếu.
- Bổ sung assertion vào bộ test hiện có cho trường hợp chúng chưa bắt được.

File dự kiến tác động gồm `chapter1.golden.test.js`, `effects.test.js`, `GameSession.test.js` và bài trình duyệt. Runtime chỉ sửa khi có lỗi tái hiện.

Hoàn thành khi lưu/tải không phát lại thu thập, không nhân đôi lịch sử và giữ đúng kết quả đối chất.

### S3. Lưu/tải máy chủ sau khi chốt ISS-29

Ưu tiên P1, cỡ M, theo TD-11/12, TD-28/29 và TD-37 đã có.

- Chốt cách xác định tài khoản cho API lưu/tải, phù hợp hợp đồng API và JWT trước khi đổi response hoặc tham số.
- Nối auth, bridge và save/load để snapshot chứa nguyên statements, revisions và conversation draft/history được lưu, tải qua máy chủ.
- Kiểm tra tài khoản A chỉ lưu/tải dữ liệu của A kể cả khi client sửa userId, và kiểm tra quyền sở hữu khi hoàn thiện các API đang có.
- Nghiệm thu bằng tài khoản thử, so sánh JSON tải về, thử phiên trình duyệt mới, token hết hạn và mất mạng.
- Chốt quy tắc chọn bản local/server trong ISS-18 trước khi triển khai đồng bộ tự động.

Thành phần dự kiến ảnh hưởng gồm auth, API game save/load, `AuthContext.jsx`, `useGameBridge.js`, `saveService.js` và kiểm tra tích hợp. Lời khai tiếp tục lưu trong snapshot JSON theo Project §2.1.

Hoàn thành khi lời khai và lịch sử khôi phục đúng từ server cho đúng tài khoản, có kiểm tra lưu → tải → so sánh state.

### S4. Các điểm cần chốt nếu mở rộng giao diện

Các mục dưới là đề xuất, chưa tính là chức năng đã được duyệt để triển khai.

1. Hiển thị `revisions` trong chi tiết lời khai để xem lần sửa và nguồn cập nhật. Cần chốt mức thông tin muốn cho người chơi thấy. Hiện UI đã hiện trạng thái và nội dung lời thay thế, engine giữ revisions để bảo toàn lịch sử.
2. Dùng Statement làm nguồn Present. Project mô tả trường hợp này, nhưng gói Chương 1 chỉ có route Evidence. Cần nguồn và luật đối chiếu cụ thể trước khi thêm khả năng chọn Statement làm nguồn.

## 4. Thứ tự và rủi ro

Thực hiện S1 → S2. Chuẩn bị quyết định ISS-29 để làm S3. S4 triển khai sau khi phạm vi tương ứng được chốt.

Rủi ro cần theo dõi gồm ghi lời khai sớm hơn commit, mở dữ kiện chưa hỏi, xử lý sai lời đã thay thế, trừ điểm lặp, mất draft khi tải và truy cập nhầm bản lưu tài khoản khác. Dùng đường chơi thật và bản lưu cũ để kiểm tra, giữ ID và điều kiện graph đã duyệt.

## 5. Kiểm tra tại thời điểm rà soát

- `npm run check` đạt lint, format, 183 test và build. Build báo thiếu bốn file font đã ghi ở TD-43, trình duyệt dùng font dự phòng.
- `python scripts/chapter1/validate.py` đạt 6.290 assertion, 1.264 node, 43 lời khai, không có đích hỏng hoặc node không tới được.
- `npm run test:e2e` đạt 3/3 bài trên Chrome, gồm hoạt ảnh và hai lượt chơi Chương 1. Các lượt chơi có kiểm Press/Present, lời khai bị thay thế, wrong trừ một lần và blocked miễn phạt. Chúng chưa thay thế nghiệm thu S1/S2 cho giao diện Sổ tay và toàn bộ trường hợp bản lưu.
- Chưa kiểm chứng lưu/tải máy chủ cho statement. S3 ghi nhận giới hạn này.

## 6. Phần Dòng thời gian được duyệt và triển khai ở T-053

Ngày 16/11/2026, người dùng duyệt cách trình bày để giảm đọc lặp với Lịch sử trò chuyện. Tab Dòng thời gian hiện tên sự kiện ngắn và trạng thái kiểm chứng, nhóm mốc có giờ được sắp theo thời điểm, nhóm quan hệ trước/sau hiển thị riêng. Nguồn đầy đủ mở qua nút Xem nguồn và chỉ lấy bản ghi thực có trong state. Bản lưu thiếu thời điểm có nhóm dự phòng riêng. Không suy giờ cho quan hệ chỉ biết trước/sau.

Phần này hoàn thiện cách đọc Dòng thời gian. Các việc nghiệm thu Lời khai/Lịch sử, revisions và lưu máy chủ ở S1–S4 vẫn theo phạm vi nêu trên. Kết quả kiểm tra cuối của thay đổi ghi ở T-053 trong PROGRESS_LOG.
