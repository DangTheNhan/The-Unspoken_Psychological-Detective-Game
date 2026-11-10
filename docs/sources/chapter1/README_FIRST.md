# Chapter 1 — gói đầy đủ để tích hợp vào demo

**Gói này chứa toàn bộ Chapter 1:** Phase 1 → Phase 2 → Phase 3 → Final Deduction → Phase 4. ZIP Final Deduction trước đây chỉ chứa màn suy luận cuối; dùng gói này cho cả chương.

Các file đã có lời dẫn, lời thoại tiếng Việt, biểu cảm, lựa chọn, Inspect, Press, Present và phản hồi chọn sai. Khi code, đọc dữ liệu để hiển thị; không cần sáng tác lời thoại cho mỗi Scene. Bạn có thể chỉnh cảm xúc/lời thoại sau này, nhưng phải giữ Evidence ID, Statements, điều kiện mở khóa và phạm vi kiến thức.

Phase 4 triển khai khuyến nghị **A + S1 + S2**, theo yêu cầu “nếu phase 4 chưa chọn thì cứ theo proposal fix”. Bible đã cập nhật phiên bản 1.3. Hào biết loại thẻ qua việc thu nợ; Linh thuật điều Tùng từng kể. Các thông tin này được ghi đúng nguồn lời khai, không tự thành chứng minh toàn bộ mạng lưới.

## Đọc file nào?

| File/thư mục | Công dụng |
| --- | --- |
| `CLAUDE_INTEGRATION_PROMPT.md` | Nội dung có thể gửi cho Claude cùng ZIP để tích hợp vào demo có sẵn |
| `CHAPTER_1_ALL_SCRIPTS.md` | Toàn bộ lời thoại và kịch bản Chapter 1 trong **một file Markdown** để đọc/chỉnh sửa |
| `scripts/` | Bản riêng của từng Phase và Final Deduction, dễ tra node khi chỉnh |
| `STORY_AND_GAMEPLAY_BIBLE.md` | Canon, quy tắc, các sửa logic đã duyệt; **mục J là cập nhật mới về Phase 4** |
| `data/chapter1.json` | Một graph dữ liệu chung cho tất cả Phase; dùng làm dữ liệu runtime |
| `data/chapter.schema.json` | JSON Schema của graph; hỗ trợ kiểm tra cấu trúc dữ liệu |
| `data/evidence.json` | Danh mục 12 Evidence; danh mục không có nghĩa người chơi đã thu chúng |
| `data/statements.json` | Danh mục 43 Statements; chỉ mở sau node nguồn |
| `data/people.json` | ID nhân vật dùng cho Notebook; không chứa bí mật tác giả để tự hiện cho người chơi |
| `data/game-state.definitions.json` | State ban đầu, flags, checkpoint và cách giữ nguồn dữ kiện |
| `data/source-map.json` | Truy nguồn lời thoại và phân biệt nhãn điều khiển UI do chuyển đổi kỹ thuật |
| `data/assets.integration.json` | Những asset/biểu cảm/hotspot cần nối với demo; chưa có tên key và tọa độ thật của dự án của bạn |
| `DATA_CONTRACT.md` | Cách engine diễn giải node, condition, effect, Press/Present, Notebook và checkpoint |
| `validation/` | Báo cáo kiểm tra graph và hai đường chơi toàn chương; hướng dẫn playtest trong Phaser |
| `reference/` | Story, Project, Phase và Master Prompt; đề xuất/sửa logic cũ được đánh dấu lịch sử |
| `MANIFEST.json` | Danh sách file và SHA-256 để kiểm tra ZIP có đủ nội dung |

## Phần code còn phải làm

Đây là **gói kịch bản và dữ liệu**, chưa phải bản game Phaser chạy độc lập. Claude cần nối data với demo React + Phaser 3 của bạn: hộp thoại, sprite/biểu cảm, hotspot, Notebook, Press/Present, bảng Deduction, save/load và chuyển Scene. Chưa có mã nguồn demo của bạn nên gói không giả rằng việc tích hợp đã được kiểm thử.

Tên asset, tọa độ hotspot và cách lưu snapshot cần dùng theo dự án hiện tại. Những ô `null` trong file asset là chỗ nối asset kỹ thuật; không phải sự kiện cốt truyện còn thiếu. Có thể dùng biểu cảm mặc định của sprite trong demo nếu chưa vẽ đủ bộ cảm xúc, đồng thời giữ `expression` trong dữ liệu để thay asset sau.

## Thứ tự ưu tiên khi tích hợp

1. Bible 1.3, các quyết định đã duyệt và các kịch bản hiện hành trong `scripts/` xác định nội dung. Mục J cập nhật trạng thái Phase 4, thay ghi chú cũ “chưa chọn Phase 4”.
2. `data/chapter1.json` xác định đường chạy thống nhất; mọi flags và dữ kiện phải có node nguồn. Thứ tự node trong mảng không phải thứ tự bắt buộc của gameplay.
3. `reference/` để kiểm tra nguồn và lịch sử; không lấy bản Phase.docx cũ ghi đè các sửa logic đã duyệt.
4. Không import Story/Bible toàn truyện vào state hiển thị người chơi: chúng chứa bí mật cho các chương sau.

Gói này hoàn thiện **các Phase của Chapter 1**, không viết thêm Chapter 2–5. `CH2_ENTRY` là điểm dừng có khai báo rõ ở ranh giới chương tiếp theo. Chương 2 chỉ hiện tiêu đề chuyển tiếp, chưa có các node chơi của chương đó.
