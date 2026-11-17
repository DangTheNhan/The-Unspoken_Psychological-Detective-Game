# Kế hoạch sửa lỗi theo TEETS2

Ngày lập: 17/11/2026. Tác vụ kế hoạch T-064. Trạng thái: **G0/G1 hoàn tất T-065; G2 hoàn tất T-066; G4 hoàn tất T-068; G5 hoàn tất T-069; G3 chưa triển khai**.

> Cập nhật T-065 ngày 17/11/2026: người dùng đã giao **G0 và G1**, đã hoàn tất sửa và kiểm tra phần này. Các phần G2–G5 vẫn là kế hoạch chưa triển khai; G6 dưới đây là nghiệm thu toàn gói khi làm đủ các phần. Kết quả thực tế G0/G1: PROGRESS_LOG.md và docs/TEETS2_G0_G1_QA.md.

> Cập nhật T-066 ngày 17/11/2026: người dùng giao **G2**, đã chuẩn hóa giờ Việt Nam theo ngữ nghĩa DB/JPA xác minh thực tế và kiểm thử Chrome ở UTC/Việt Nam/New York. Không đổi schema, cấu hình JDBC hoặc định dạng timestamp API; không ghi lại dữ liệu cũ. Chi tiết: `docs/TEETS2_G2_QA.md`. G3–G5 chưa thực hiện; đoạn kế hoạch ban đầu dưới đây được giữ làm căn cứ.

> Cập nhật T-068 ngày 17/11/2026: người dùng giao **G4** sau phần làm rõ T-067. Đã sửa bộ lọc/nhãn/phạm vi tra cứu, thu gọn trợ giúp poll/TTL, ẩn success story text và tách cảnh báo khỏi kết quả lưu. Bảng từng dòng, ảnh và kiểm tra thực tế: `docs/TEETS2_G4_QA.md` (244 unit, 15 Chrome). Giữ các dòng Admin chưa chỉ rõ; không sửa online Tổng quan vì thuộc G3. G3/G5 chưa giao. Các đoạn kế hoạch ban đầu dưới đây được giữ làm căn cứ.

> Cập nhật T-069 ngày 17/11/2026: **G5 hoàn tất**. Phòng 204 dùng phối cảnh 201, sàn gần giới hạn y615, spawn/đứng cửa căn lại; giữ ảnh/rect hotspot/sprite/graph. Đã xem ba vị trí trước/sau, frontend check 248, validator 6290 assertion; hai lượt Chương 1 tới CH2_ENTRY và 3 ca Chrome G5 qua. Chi tiết lượt chạy/giới hạn: `docs/TEETS2_G5_QA.md`. G3 chưa thực hiện; chưa nghiệm thu toàn gói G6.

> Cập nhật T-070 theo phản hồi sau khi người dùng chơi: nhân vật204 còn lùn so với cửa/thi thể. Đã căn tăng25% riêng204, giữ nhịp phối cảnh/vận tốc tương đối201 và giới hạn sàn; đo alpha thật ở cửa388px/cạnh thi thể395px. Check248, validator6290, Chrome2043/3 và Chương1 gồm hai lượt tớiCH2_ENTRY3/3 qua. QA hiện hành: `docs/ROOM204_PROPORTION_QA.md`; ảnh/số đo T-069 vẫn giữ làm lịch sử.

## 1. Mục đích và căn cứ

Khắc phục thao tác menu/pause và nhập báo lỗi, thống nhất giờ Admin về Việt Nam, tinh giản những phần giao diện được nêu trong TEETS2, đưa online vào hồ sơ người chơi và chỉnh tỷ lệ phòng 204 theo phòng 201.

Nguồn chính là `C:/Users/dangt/Downloads/TEETS2.docx`: đã đọc phần chữ và xem 3 ảnh về Online, Hồ sơ Thám tử và Tổng quan. File không đánh số mục; các mã M01–M10 dưới đây chỉ dùng để đối chiếu kế hoạch. Các ghi chú và câu đề xuất trong file là đầu vào lập kế hoạch; yêu cầu hiện tại của người dùng là lập kế hoạch, chưa phải lệnh thực thi tất cả thay đổi.

Căn cứ dự án: Project.docx §3.2 (scene/menu/điều tra), §6.3 (giữ tiến trình khi mất kết nối); thiết kế menu DEC-012, phòng/nhân vật DEC-013/014, kịch bản Data Contract 2.0 DEC-016; tài liệu triển khai hiện có `docs/ACCOUNT_AND_OPERATIONS.md`, `docs/STORY_CONTENT.md` và các quyết định T-062. Mã DEC-024/025 hiện bị trùng giữa hai nhánh trong PROJECT_MEMORY, cần xử lý ở G0 trước khi ghi quyết định mới.

Phạm vi tác vụ này chỉ gồm kế hoạch và nhật ký. Không sửa code, asset, graph, API, SQL hoặc dữ liệu người chơi; không stage, commit, push hay giải quyết merge.

## 2. Đối chiếu các vấn đề và bằng chứng hiện tại

| Mã | Nội dung TEETS2 | Hiện trạng đã đọc trong code | Giai đoạn |
|---|---|---|---|
| M01 | Menu trong game phản hồi kém, bị treo khi bấm | Đã có modal React và bộ điều khiển pause/settings/resume; cần tái hiện chuỗi thao tác để xác định nguyên nhân, chưa kết luận runtime | G1 |
| M02 | Báo lỗi không gõ được a/w/d/s vì trùng phím di chuyển | RoomInvestigation đăng ký WASD; KeyboardManager của Phaser vẫn có thể preventDefault trên phím capture khi scene đã pause. Chưa thấy bước tách capture cho form React. E2E hiện dùng fill(), chưa kiểm tra gõ từng phím | G1 |
| M03 | Giờ trong Admin lệch; cần giờ Việt Nam | Users/Bug Reports/Story Content/SaveJsonModal có chỗ chỉ cắt chuỗi thời gian; Operations dùng giờ máy. Có DTO LocalDateTime và endpoint Instant. JDBC URL hiện khai báo serverTimezone=UTC; riêng thông tin này chưa đủ chứng minh mọi timestamp đều là UTC | G2 |
| M04 | Bộ lọc Loại phân đoạn có nhiều phần dư thừa | AdminStoryContentPage lấy danh sách loại từ toàn bộ nodes, kể cả node không có fields được sửa, dù mặc định đang bật editableOnly | G4 |
| M05 | ESC mở pause layout; bỏ nút Menu ngoài màn chính và trong game | GamePlayPage đang luôn có nút Menu trên header; ESC trong từng scene hiện dùng cho back/đóng/bỏ tutorial, chưa có luồng ESC chung mở pause | G1 |
| M06 | Dọn nội dung thừa trong Admin | Chưa có danh sách chỉ rõ từng dòng cần bỏ. Đã nhận diện phần online bị lặp và thông tin kỹ thuật dài; các mục khác cần bảng giữ/bỏ trước khi thực hiện | G4 |
| M07 | Tận dụng online ở Kết nối & Bảo trì để thêm trạng thái trong Hồ sơ Thám tử | GET /api/admin/online đã trả players với userId, username, lastSeenAt, area; AdminUsersPage chưa đọc nguồn này | G3 |
| M08 | Bỏ dòng online và link Kết nối & Bảo trì trên Tổng quan sau khi tích hợp vào Hồ sơ | AdminOverviewPage đang có riêng polling online và block liên kết tương ứng | G3 |
| M09 | Không hiển thị thông báo “Đã nạp nội dung kịch bản được xuất bản…” và các thông báo cùng loại | useGameBridge đưa trạng thái tải story text vào statusMessage; còn dùng lại trạng thái đó khi đổi ngôn ngữ | G4 |
| M10 | Phòng 204 chưa vừa tỷ lệ người; lấy phòng 201 làm chuẩn cố định | Cùng canvas 1280×720 nhưng depth/staging riêng. Phòng 201: 215px tại y474 → 330px tại y615. Phòng 204: 216px tại y532 → 315px tại y655; hai nền 204 thường/có Tùng và nhiều hotspot phụ thuộc tọa độ | G5 |

Đây là khảo sát tĩnh. Tác vụ T-064 chưa khởi động ứng dụng để tái hiện lỗi, chưa chạy kiểm thử mới. Các kết quả 221 test frontend, 26 test backend và 10 E2E trong tài liệu T-062 là kết quả lịch sử, không phải xác nhận cho bản code đang merge hiện tại.

## 3. Thứ tự thực hiện đề xuất

**G0 → G1 → G2 → G3 → G4 → G5 → G6.** Ưu tiên G1 vì ảnh hưởng trực tiếp việc chơi và gửi báo lỗi. Phần phòng 204 làm sau khi input ổn định để đo tỷ lệ/điểm tương tác chính xác.

### G0 Xác nhận bản code và chuẩn bị kiểm thử

Mục tiêu: sửa trên đúng bản đã hợp nhất, không làm mất phần T-054 hoặc T-062.

- Xác nhận trạng thái merge hiện tại, giữ toàn bộ thay đổi của hai bên; đối chiếu các đoạn conflict trong PROGRESS_LOG và PROJECT_MEMORY, xử lý mã quyết định trùng khi được giao giải quyết merge.
- Nhánh thực tế hiện là `Nhan`, phù hợp AGENTS hiện tại. Không tự chuyển sang `duy` theo checkpoint cũ và không commit/push.
- Khi bắt đầu triển khai sau duyệt, hoàn tất merge trong phạm vi được giao rồi chạy baseline frontend/backend cần thiết, ghi lại lỗi có sẵn và phiên bản đang kiểm tra.
- Tạo môi trường/DB và tài khoản thử riêng nếu kiểm thử API thực tế; không dùng tài khoản hay lịch bảo trì thật để thử.

Nghiệm thu: có một trạng thái code rõ ràng để sửa và so sánh; các chức năng đã có của T-062 được giữ lại. Merge dở không ngăn việc lập kế hoạch này, nhưng cần được xử lý trước khi chốt bản sửa.

### G1 Pause bằng ESC và tách input game khỏi biểu mẫu

Mục tiêu: menu phản hồi được và người chơi gõ báo lỗi đầy đủ.

1. Tái hiện ở các ngữ cảnh: đi lại, đang thoại, danh sách lựa chọn, Sổ tay, Settings, báo lỗi; thử mở/đóng lặp lại và chuyển game ↔ Admin.
2. Bỏ nút Menu ở header `/play`, áp dụng cho cả màn menu chính và đang điều tra. Giữ các chức năng menu chính “Ván mới/Tiếp tục/Cài đặt”; ghi chú TEETS2 không yêu cầu xóa chúng.
3. Dùng pause layout hiện có làm nền, tinh chỉnh thay vì tạo thêm một lớp menu cạnh tranh. Các thao tác chính: Tiếp tục, Cài đặt, Báo lỗi, Về menu chính khi đang có phiên chơi.
4. Đề xuất quy tắc ESC: lớp trên cùng nhận phím trước. ESC trong Settings/Sổ tay/hộp thoại đóng hoặc quay lại đúng lớp đó; ESC từ gameplay mở pause; ESC ở pause tiếp tục chơi khi không bị khóa bởi bảo trì/phiên đăng nhập. Một lần nhấn không đồng thời kích hoạt hai hành động; bỏ qua key-repeat.
5. Form báo lỗi mở trên trạng thái pause. Khi gửi/hủy/đóng, đề xuất quay lại pause menu để người chơi chủ động tiếp tục. Không tự resume khi bảo trì hoặc phiên đăng nhập đang khóa game.
6. Khi một form React sở hữu input, khóa input gameplay và ngắt capture phím toàn cục của Phaser; giữ trạng thái input cũ để khôi phục đúng. Chỉ pause scene là chưa đủ. Xóa trạng thái phím đang giữ khi chuyển quyền input để tránh đóng form xong nhân vật tự chạy.
7. Tập trung xử lý ESC/control qua EventBus theo kiến trúc hiện có; kiểm soát listener lúc mount, shutdown và destroy. Không dùng cách thêm nhiều listener window độc lập để chữa từng trường hợp.
8. Giữ chức năng bỏ qua tutorial đã duyệt: đề xuất đưa thao tác “Bỏ qua hướng dẫn” vào pause khi tutorial đang hoạt động, thay vì để ESC trực tiếp mở hộp bỏ qua. Vị trí này là đề xuất cần chốt cùng quy tắc ESC.

Ảnh hưởng dự kiến: `features/play/pages/GamePlayPage.jsx`, `features/bug-report/BugReportDialog.jsx`, `shared/ui/Modal.jsx`, `game/core/gameControls.js`, các scene đang xử lý ESC, `game/data/uiText.js` VI/EN và các test liên quan. Logic thuần mới đặt trong module hiện có phù hợp; không thêm API báo lỗi khác.

Rủi ro chính: xử lý ESC hai lần; listener cũ còn sống; form đóng nhưng game vẫn nhận phím hoặc không nhận lại phím; pause làm mất node/vị trí; Settings resume cả scene vốn đang pause; bỏ nhầm đường bỏ qua tutorial.

Nghiệm thu:

- Gõ bằng sự kiện bàn phím thật cả `awds`, `WASD`, câu tiếng Việt, dấu cách, Enter và Backspace; kiểm tra chọn/sửa nội dung và phím tắt soạn thảo bình thường. Không chỉ dùng fill() để chứng minh sửa xong.
- Nội dung nhận ở Admin trùng nội dung đã gõ; giữ phím khi đóng form không làm nhân vật tiếp tục di chuyển.
- Đang pause không đi lại/tiến thoại/thay đổi điểm; tiếp tục giữ đúng node, vị trí, uy tín và dữ liệu đã thu. Timer/autosave khôi phục theo logic hiện có.
- Mỗi nút pause có kết quả đúng, không treo; lặp mở/đóng và vào game/Admin không tích lũy listener hay lỗi canvas.
- Bảo trì/thu hồi phiên không bị nút Tiếp tục, ESC hoặc đóng báo lỗi mở khóa nhầm.

### G2 Thống nhất thời gian Admin theo Việt Nam

Mục tiêu: cùng một thời điểm hiển thị nhất quán theo `Asia/Ho_Chi_Minh`, kể cả máy/browser dùng múi giờ khác.

- Đối chiếu một bản ghi lưu game/báo lỗi/nháp kịch bản thực tế qua DB → Java/DTO → JSON → UI; xác định timezone của chuỗi không có offset trước khi chuyển đổi.
- Tạo một cách định dạng dùng chung ở phần shared thích hợp, hiển thị giờ Việt Nam với nhãn múi giờ rõ ràng. Xử lý giá trị thiếu/hỏng nhất quán.
- Áp dụng cho Hồ sơ Thám tử, chi tiết bản lưu, Báo lỗi, lịch sử/nháp nội dung kịch bản, lần đồng bộ online và lịch bảo trì.
- Ô datetime-local của lịch bảo trì được giải thích và chuyển đổi theo giờ Việt Nam, không mặc định phụ thuộc timezone máy người nhập; dữ liệu lịch gửi lên vẫn là một thời điểm UTC chính xác.
- Không cộng 7 giờ hàng loạt, không tự thêm Z vào mọi chuỗi, không đổi timestamp cũ trong DB. Nếu xác minh cho thấy cần đổi định dạng timestamp của DTO/API, ghi contract cụ thể và xin duyệt phần thay đổi đó trước khi thực hiện.

Ảnh hưởng dự kiến: các trang Admin, `SaveJsonModal`, helper thời gian dùng chung; có thể cần chỉnh serialization/DTO phía backend sau khi xác minh, không đổi schema gốc.

Nghiệm thu: cùng instant hiển thị cùng giờ Việt Nam trong browser cấu hình UTC và Việt Nam; kiểm tra chuyển ngày, ví dụ `2026-11-16T18:00:00Z` thành 01:00 ngày 17/11/2026. Kiểm tra riêng thời gian nguồn không có offset theo ngữ nghĩa đã xác minh. Lịch bảo trì bắt đầu đúng thời điểm và không làm hỏng revision/deadline guard hiện có.

### G3 Online trong Hồ sơ Thám tử và bỏ dòng lặp ở Tổng quan

Mục tiêu: tra trạng thái online ngay trên danh sách người chơi, dùng lại nguồn dữ liệu hiện có.

- Ghép danh sách `/api/admin/online` vào bảng Users bằng userId, không bằng chỉ số hàng hay email/tên có thể thay đổi.
- Thêm cột “Trạng thái” với Online/Offline cho người chơi; giữ tài khoản đang online dù chưa có bản lưu. Endpoint online hiện chỉ đếm ROLE_PLAYER, nên không tự gắn Offline cho Admin; đề xuất hiển thị “Không áp dụng” cho hàng Admin.
- Tái sử dụng chu kỳ poll 5 giây và TTL 60 giây hiện có; không tự thiết kế một quy tắc online khác ở frontend. Không gửi request riêng cho từng hàng; dọn timer/request khi rời trang.
- Khi request lỗi, hiển thị trạng thái chưa cập nhật/chưa xác định thay vì kết luận mọi người đã offline. Tìm kiếm và xem Sổ tay vẫn hoạt động.
- Sau khi cột mới chạy đúng, bỏ block “Đang online: … / Xem kết nối & lịch bảo trì” và polling riêng của block này tại Tổng quan. Trang Kết nối & Bảo trì vẫn giữ chức năng bảo trì; TEETS2 chưa yêu cầu bỏ cả trang hoặc cả khu online ở đó.

Ảnh hưởng dự kiến: `AdminUsersPage.jsx`, `AdminOverviewPage.jsx`, `adminApi.js`/hook phù hợp trong feature Admin, test UI/API. Dùng endpoint hiện có; chưa có lý do cần thêm bảng hoặc API mới.

Nghiệm thu: người chơi login chưa save vẫn Online; logout/thu hồi/hết TTL đổi trạng thái đúng; lỗi mạng không thành Offline giả; không đếm Admin vào người chơi; Tổng quan không còn dòng lặp; bảng đọc được trên màn hình nhỏ.

### G4 Tinh giản Admin và thông báo kỹ thuật

Mục tiêu: bớt chi tiết không phục vụ thao tác hiện tại, giữ thông tin cần để biên tập và xử lý lỗi.

**Bộ lọc Nội dung kịch bản**

- Tạo danh sách loại phù hợp với danh sách node đang được phép xem/sửa; mặc định chỉ đưa các loại thực sự có trường text được sửa vào bộ lọc thường dùng.
- Khi đổi phạm vi lọc, nếu loại đang chọn không còn hợp lệ thì reset có kiểm soát, tránh danh sách rỗng gây hiểu nhầm.
- Đề xuất nhãn tiếng Việt gọn dựa trên type thực có. Các node thuần điều khiển và metadata kỹ thuật chuyển sang phần nâng cao/chỉ đọc nếu vẫn cần tra cứu.
- Giữ ID node để tìm/truy nguồn; không xóa node hoặc type trong JSON, không sửa allowlist, logic graph, quyền biên tập, hash hoặc quy trình nháp → kiểm tra → xem trước → xuất bản/khôi phục.

**Nội dung Admin dư thừa**

- Bỏ đúng phần online lặp đã nêu ở G3.
- Đề xuất thu gọn các dòng giải thích kỹ thuật như nhịp poll/TTL và metadata dài vào trợ giúp/chi tiết; không tự coi toàn bộ mô tả hoặc số liệu Admin là “rác”.
- Trước khi xóa thêm, lập bảng cụ thể “dòng hiện tại → giữ/bỏ/chuyển sang chi tiết” và ảnh xem trước để duyệt. Chưa có chỉ định đầy đủ trong TEETS2 cho các dòng ngoài ví dụ đã nêu.
- Giữ lỗi, validation, xác nhận thao tác có rủi ro, trạng thái đang gửi/lưu và kết quả hành động người dùng cần biết.

**Thông báo tải nội dung game**

- Bỏ thông báo nạp nội dung thành công khỏi UI thường trực, gồm câu được trích trong TEETS2; đề xuất áp dụng cả các trạng thái tải thành công tương tự.
- Giữ xử lý nạp/pin phiên bản, cache và sự kiện STORY_TEXT_RESULT. Không “tắt thông báo” bằng cách bỏ tải nội dung đã xuất bản.
- Tách trạng thái nạp story text khỏi thông báo lưu/báo lỗi để đổi ngôn ngữ không làm thông báo kỹ thuật đã ẩn xuất hiện lại hoặc ghi đè phản hồi cần thiết.
- Đề xuất giữ cảnh báo khi mất mạng/nội dung không tương thích vì người chơi có thể đang dùng bản khác; thông báo lỗi và lưu thất bại không thuộc nhóm bỏ tự động.

Ảnh hưởng dự kiến: `AdminStoryContentPage.jsx`, `storyContent.css`, các trang/nhãn Admin đã duyệt, `useGameBridge.js`, `uiText.js` VI/EN và test story-content. Không thay đổi nội dung lời thoại.

Nghiệm thu: lọc không còn các lựa chọn vô ích trong phạm vi mặc định; vẫn tìm và sửa được mọi trường đã được phép; xuất bản/khôi phục vẫn đúng; không có câu nạp thành công dư thừa khi vào chơi/đổi ngôn ngữ; lỗi thật và kết quả lưu vẫn thấy được.

### G5 Chỉnh tỷ lệ phòng 204 theo chuẩn phòng 201

Mục tiêu: nhân vật và phòng 204 có tỷ lệ hợp lý khi chuyển từ 201 sang 204, đồng thời giữ đủ các tương tác điều tra.

- Dùng canvas 1280×720, sprite thám tử hiện tại và staging/depth của phòng 201 làm mốc đo cố định. So sánh cửa, bàn, giường, vùng sàn và chiều cao nhân vật ở xa/giữa/gần; không lấy cỡ ảnh gốc làm cỡ hiển thị trực tiếp.
- Chuẩn hóa tỷ lệ/bố cục hiển thị của phòng 204 theo mốc đó, không đổi sprite toàn game chỉ để chữa riêng một phòng. Không sao chép nguyên đa giác sàn của 201 sang 204 vì đồ đạc và lối đi khác nhau.
- Nếu dịch/co giãn nền, cập nhật đồng bộ cả nền thường và nền có Tùng, walkArea, obstacles, spawn/entrances, hotspot rect/stand, depth và lớp che liên quan. Giữ ảnh xem vết cổ đúng chức năng, không đổi nội dung vật chứng.
- Rà toàn bộ hotspot theo kịch bản, gồm mở đầu quan sát Tùng, phòng khám hiện trường và quay lại sau này. Không chỉ kiểm tra danh sách hotspots rỗng trong ROOM_204.
- Thử bản lưu vị trí trước/sau đổi bố cục; dùng cơ chế đưa về điểm đứng hợp lệ hiện có khi cần, không đổi schema save hoặc tự xóa tiến trình.
- Chuẩn bị ảnh so sánh 201/204 ở ba vị trí trước khi chốt tỷ lệ mới. Tài liệu chưa quy định con số biến đổi chính xác của nền 204; con số cụ thể phải dựa trên đo/ảnh xem trước, không ghi như đặc tả đã duyệt.

Ảnh hưởng dự kiến: `data/rooms/room204.js`, các điểm tương tác kịch bản liên quan và asset 204 nếu phép biến đổi bằng bố cục chưa đủ; scene chỉ chỉnh khi cần hỗ trợ bố cục. Không đổi graph hoặc tự sáng tác ảnh/nội dung mới.

Rủi ro cao hơn các thay đổi Admin: vùng bấm lệch đồ, nhân vật xuyên xác/giường, không tới được vật chứng, cửa bị kẹt, bản lưu cũ đặt nhân vật ngoài sàn.

Nghiệm thu: xem được ảnh nhân vật/phòng đồng tỷ lệ với 201; đi được bằng WASD và chuột; mọi hotspot quan trọng tới/bấm được, cửa vào/ra đúng, không xuyên vật cản; lưu/tải trong 204 không kẹt hoặc thu vật chứng lặp; hai lượt Chương 1 vẫn hoàn thành.

### G6 Kiểm thử hồi quy và bàn giao

- Theo từng nhóm thay đổi, bổ sung test hành vi có ý nghĩa: quyền input/capture và ESC, trạng thái pause/resume, chuyển giờ Việt Nam, ghép online theo userId, lọc loại theo editable fields, điểm đứng/path/hotspot 204.
- Chạy `npm run check` trong frontend sau thay đổi; chạy Maven tests nếu chạm backend/time contract, và kiểm thử API thực khi cần chứng minh timestamp/online/report/lưu.
- Cập nhật E2E đang dựa vào nút Menu để dùng ESC; kiểm tra gõ bàn phím thật. Giữ test bảo trì, thay phiên, Save/Load, Admin/game lifecycle và Story Content publish/restore.
- Chạy đủ hai lượt Chương 1 đến CH2_ENTRY sau thay đổi 204. Chạy wrapper `scripts/chapter1/validate.py` khi thay dữ liệu runtime hoặc để đối chiếu trước bàn giao; không chạy validator gốc theo cách ghi lại nguồn.
- Chụp và xem ảnh: pause, báo lỗi khi đang gõ, Users có online/giờ Việt Nam, bộ lọc kịch bản, phòng 201/204. Ghi kết quả thực tế và giới hạn; không lấy số test lịch sử làm kết quả mới.
- Cập nhật PROGRESS_LOG/PROJECT_MEMORY sau khi hai file được hợp nhất; chỉ commit/push khi người dùng yêu cầu.

## 4. Các điểm cần chốt và đánh đổi

| Điểm | Hướng đề xuất | Lợi ích | Đánh đổi hoặc thông tin còn thiếu |
|---|---|---|---|
| Quy tắc ESC và đóng báo lỗi | Lớp trên cùng xử lý trước; gameplay mở pause; báo lỗi đóng về pause; bỏ tutorial là hành động riêng trong pause | Tránh một phím tác động hai lớp và không tự chơi tiếp ngoài ý muốn | Đã duyệt và thực hiện trong G1/T-065 |
| Thiết bị không có bàn phím | Thực hiện yêu cầu bỏ nút Menu trên giao diện desktop; chưa tự thêm cử chỉ/nút mới cho mobile | Đúng yêu cầu giao diện gọn và ESC | TEETS2 chưa cung cấp cách mở pause trên thiết bị không có ESC. Cần chốt phạm vi thiết bị hoặc phương án thao tác thay thế trước khi nghiệm thu mobile |
| Những dòng “dư thừa” khác của Admin | Giữ lỗi/xác nhận/trạng thái cần thiết; metadata kỹ thuật đưa vào chi tiết; xóa theo bảng cụ thể đã xem | Dọn UI có kiểm soát | File chưa liệt kê hết từng dòng cần bỏ, không thể kết luận tùy ý |
| Timestamp không có offset | Xác minh DB/API trước, định dạng bằng múi giờ Việt Nam sau | Tránh đổi sai hoặc lệch giờ hai lần | Có thể cần duyệt thay đổi định dạng DTO/API nếu dữ liệu hiện tại không đủ rõ |
| Kích cỡ nền 204 | Đo theo phòng 201 và duyệt ảnh so sánh | Giữ tỷ lệ và tương tác đồng bộ | Chưa có hệ số co/giãn hay crop cụ thể trong nguồn |

Không đưa tính năng mới ngoài TEETS2 vào gói này; không thay công nghệ, dữ liệu gốc hoặc cấu trúc API/CSDL khi chưa có căn cứ và phê duyệt tương ứng.

## 5. Kết quả của tác vụ lập kế hoạch T-064 trước triển khai

- Đã ánh xạ đủ M01–M10 vào thứ tự sửa, file/module ảnh hưởng, rủi ro và tiêu chí nghiệm thu.
- Đã phân biệt lỗi quan sát được trong code với lỗi cần tái hiện trong trình duyệt, và thay đổi được tài liệu nêu với đề xuất cần chốt.
- Chỉ tạo kế hoạch này và bổ sung checkpoint ngoài các khối conflict trong PROGRESS_LOG. PROJECT_MEMORY và mọi file chức năng được giữ nguyên trong T-064.
- Chưa triển khai sửa lỗi, chưa chạy test/build, chưa thay dữ liệu hoặc thực hiện thao tác Git làm thay đổi lịch sử/index. Bước tiếp theo là duyệt phạm vi và các điểm ở mục 4 trước khi giao triển khai.
