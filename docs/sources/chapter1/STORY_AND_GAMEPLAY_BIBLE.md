# STORY AND GAMEPLAY BIBLE

Nguồn tham chiếu cho dự án **2D Detective Visual Novel & Investigation Puzzle System**. Tài liệu dành cho người thiết kế và người viết, chứa toàn bộ spoiler hiện có. Chưa phải kịch bản tiểu thuyết hoặc hội thoại mới.

**Phiên bản 1.3 — cập nhật Phase 4 và gói toàn Chapter 1 ngày 10/10/2026.** Lời duyệt “duyệt các phần giải quyết của chương 1 và cập nhật bible” được áp dụng cho các phương án AI khuyến nghị D01–D18 trong `CHAPTER_1_LOGIC_REPAIR.md`. G29–G31 được duyệt hoãn, không phải duyệt dữ kiện mới Ch2–5. Những thay đổi có nguồn gốc đề xuất nay là [CANON] hoặc [GAMEPLAY] **theo quyết định thiết kế**, không giả nhận rằng chúng vốn có trong S/P/F.

Nguồn bổ sung: **R** = Logic Repair đã duyệt; **M** = MASTER PROMPT trong `Văn bản đã dán (1).txt`. S/P/F vẫn giữ nguồn gốc của nội dung chưa thay đổi. Các tệp S/P/F gốc chưa được chỉnh sửa; nội dung cũ trái quyết định đã duyệt là lịch sử nguồn, không phải luật đang vận hành. Chỉ các thay đổi liệt kê tại đây được ưu tiên theo lời duyệt của người thiết kế.

Không dùng đáp án tác giả biết để giả làm điều người chơi đã chứng minh. Thời gian theo lời nhận phù hợp vật chứng không được đổi thành timestamp đo độc lập.

### Nhật ký phê duyệt

| Decision | Phương án đã duyệt |
| --- | --- |
| D01 B | Ba thẻ gói R; lời nhận được vật chứng kiểm chứng |
| D02 B | Tới 20:45; rửa mặt sau vách 20:50–20:55; tráo trước rời khoảng 20:54 |
| D03 A | Biên nhận 20:55; bỏ mốc lên cơn 21:00 đã xác minh |
| D04 B | Đồng xu dưới nệm, cảnh sát ghi nhận |
| D05 B | Dùng ống ở bàn, gục sàn cạnh giường; không ai di chuyển xác |
| D06 B | Cảnh sát xử lý/chụp, thám tử dùng bản ghi |
| D07 A, cập nhật yêu cầu mới | Năm Evidence gốc mở Phase 3; khăn/hộp thu bổ sung trước vòng Minh cần chúng; mỗi ID một thẻ |
| D08 B | Đối chứng lượt thu nợ 203, không ngoại phạm toàn đêm |
| D09 B | Hòa lấy tiền vượt khoản nợ, chỉ ghi khoản nợ trên biên nhận |
| D10 B | Minh nhận hành vi nguy hiểm bị ép; không xác nhận bào chữa không biết gây chết |
| D11 B | Phase 3a → chờ kết quả → Phase 3b → Final Deduction |
| D12 B | Kết Ch1 mở nợ/con tin/khảo sát/mạng lưới; nguồn cung tiếp tục kiểm tra |
| D13 B | Hotspot giấy khen phụ, fallback lưu ảnh trước kết Ch1 |
| D14 A | Em gái chết là niềm tin ban đầu; hen/trộm là giả thuyết cảnh sát |
| D15 A | Present tuần tự, statement đích rõ |
| D16 A | Press miễn phạt, Present sai −15, Final sai −20/lượt; checkpoint |
| D17 A | React/Phaser; bốn tab; Unknown là trạng thái; bảng nguồn |
| D18 A | Hoãn G29–G31; không thêm sự kiện các chương sau |

**Phạm vi sáng tác hiện tại:** Phase 1 đã duyệt; Phase 2/3 được yêu cầu viết tiếp. Các bản thảo Phase 2/3 không tự trở thành văn bản đã duyệt chỉ vì được tạo trong lượt này. Chi tiết cử chỉ/ngôn ngữ/nhịp được M cho phép khi không thêm chứng cứ quyết định.

## Nguồn và cách sử dụng bắt buộc

Đã đọc toàn bộ ba tệp đính kèm thực tế. Tên bản tải lên khác tên được gọi trong yêu cầu:

| Mã nguồn | Tệp đã đọc | Tên được gọi trong yêu cầu | Cách dẫn trong tài liệu |
| --- | --- | --- | --- |
| S | `Story(1).txt` | Story.txt | S, Bối cảnh hoặc Chương 1–5 |
| P | `Project(2).docx` | Project(1).docx | P, mục và đoạn p001–p194 |
| F | `Phase(1).docx` | Phase.docx | F, Phase và đoạn p001–p217 |

Số p là thứ tự đoạn văn trong phần thân DOCX, tính cả đoạn trống, không phải số trang. P chứa báo cáo kỹ thuật ở p001–p104 và bản lặp/đóng gói lại ở p111–p193; không coi hai bản lặp là hai xác nhận độc lập. Không dùng các nội dung từ hội thoại cũ hoặc tệp khác.

### Nhãn thông tin

| Nhãn | Ý nghĩa |
| --- | --- |
| [CANON] | Sự thật được nguồn kể ở cấp tác giả hoặc kết quả vụ án xác nhận. Không có nghĩa người chơi hay mọi NPC đã biết. |
| [GAMEPLAY] | Luật, dữ liệu hoặc đáp án game được nguồn quy định. Đáp án game không tự chứng minh tính hợp lý của suy luận. |
| [INFERENCE] | Suy luận từ dữ kiện; phải ghi phạm vi và giới hạn. |
| [PROPOSAL] | Đề xuất xử lý hoặc quy trình, chưa được chấp thuận; không phải sự kiện đã xảy ra. |
| [CONFLICT] | Hai mô tả không khớp hoặc kết luận mạnh hơn dữ kiện mà nguồn cung cấp. |
| [UNKNOWN] | Nguồn chưa nói, chưa xác minh, hoặc chỉ có lời khai chưa được kiểm chứng. |

**Quy tắc biên soạn [GAMEPLAY — M và lời duyệt]:** trước mỗi nhiệm vụ sáng tác tiếp theo, đọc lại tài liệu này và phần nguồn liên quan. Giữ riêng sự thật tác giả, quan sát, lời khai và kiến thức người chơi. Các mục [CONFLICT]/[UNKNOWN] chưa được chốt phải giữ nguyên trạng thái, không lấp bằng sự kiện mới. Khi người thiết kế xác nhận thay đổi, cập nhật Bible và nguồn tương ứng rồi mới viết phần phụ thuộc. Không tự lấy S, P hoặc F làm quy tắc ưu tiên tuyệt đối để xóa một xung đột.

## A. CANON STORY

### A1. Bối cảnh và bí ẩn K-Estate

- [CANON — S, Bối cảnh] Nhân vật chính là thám tử tư sống ẩn dật trong khu trọ xập xệ, kiếm sống từ theo dõi ngoại tình và tìm đồ thất lạc. Ám ảnh gia đình giữ anh lại với nghề và việc rèn quan sát.
- [CANON — S, Bối cảnh] Hồ sơ vụ gia đình bị cảnh sát khép vì thiếu chứng cứ. Câu mở đầu mô tả bố mẹ và em gái bị sát hại; các chương sau điều chỉnh sự thật về em gái. Không viết câu mở đầu thành xác nhận khách quan rằng em gái đã chết.
- [CANON — S, Ch1/Ch3] Khu trọ hiện tại nằm trong vùng quy hoạch K-Estate. Mạng lưới thu thông tin nợ nần và khả năng ép bán, dùng đường dây cho vay để thu gom. Đạt từng giúp Khang hợp thức hóa các phi vụ đất nhạy cảm 15 năm trước, gồm đất gia đình thám tử.
- [CANON — S, Ch1] Khang là chủ tịch công khai đáng kính, từng khởi nghiệp là trắc địa viên nghèo. Bài báo cũ và giấy khen tài trợ khu trọ có chữ ký ông là dấu vết môi trường đầu tiên.
- [CANON — S, Ch3] Theo lệ mạng lưới, đội thực thi nộp vật cá nhân của mục tiêu để chứng minh đã xử lý. Trâm gỗ của em gái được Đạt giữ trong két cùng hồ sơ đất, như bằng chứng hoàn thành nhiệm vụ.
- [INFERENCE — S, Ch3] Trâm tồn tại gợi rằng em gái không chết tại chỗ mà bị mang đi. Bản thân việc giữ một vật cá nhân chưa chứng minh được toàn bộ hành trình, người mang đi hoặc sự sống hiện tại.
- [CANON — S, Ch4–5] Có người ở trên Vũ; chuỗi ráp chứng cứ cuối hướng đến Khang. Vũ không biết toàn bộ câu chuyện 15 năm trước, thể hiện qua phản ứng lúc cao trào.
- [CANON — S, Ch5] Khang bị bắt nhờ báo động ông Tư cài trước khi chết. Khang nói em gái lớn lên tin ông cứu mình và liên quan đến đường dây Ch1.
- [UNKNOWN — S, Ch5] Độ trung thực đầy đủ của lời Khang, em gái hiện ở đâu, biết bao nhiêu, có đồng lõa hay chống từ bên trong đều chưa được xác nhận. S chủ ý để mở mức độ trách nhiệm của cô.
- [UNKNOWN] Người trực tiếp sát hại bố mẹ, trình tự chính xác đêm 15 năm trước, ý nghĩa đầy đủ MG-07, cách có cassette/tọa độ, và bằng chứng cụ thể chứng minh Khang trực tiếp có mặt đêm đó chưa được mô tả.

### A2. Sự thật từng vụ án và toàn bộ manh mối được nêu

#### Chương 1 Án mạng trong phòng trọ

[CANON — S/F, R đã duyệt] Tùng phòng 204 là nạn nhân; Minh là người trực tiếp lấy ống cũ và đặt ống được giao có hóa chất, bị ép vì nợ và con gái bị giữ. Công ty vệ sinh công trình thuộc mạng lưới là nguồn công cụ theo S; tên cụ thể/người giao/địa điểm con tin chưa được chốt. Không thay đổi thủ phạm hoặc cưỡng ép.

[CANON — S] Tùng giả nhân viên tiện ích khảo sát người nợ và dễ bị ép bán, được xóa một phần nợ và cấp đồng xu thẻ nội bộ. Anh áy náy, cảnh báo người thuê đừng ký giấy, đe dọa tiến độ thu gom của vùng quy hoạch K-Estate.

[CANON — R] Minh tới khoảng 20:45, thay ống trong khoảng 20:50–20:54 khi Tùng ở bồn sau vách/rèm góc phòng, rời khoảng 20:54. Hòa nhìn thấy anh xuống trước lần vào 20:55; Hòa không thấy Tùng ở khu bàn, không xác nhận cả phòng trống. Tùng còn lau mặt sau vách khi Hòa lấy tiền rồi đi. Hòa lấy nhiều hơn khoản nợ nhưng biên nhận chỉ ghi khoản nợ.

[CANON — R] Tùng dùng ống ở bàn khi phát cơn rồi gục sàn cạnh giường. Linh vào khoảng 21:05 lấy đồng hồ, thấy Tùng cào cổ/gục, bỏ chạy. Không mặc định cô thấy xịt thuốc. Không ai di chuyển xác. Giờ tử vong chỉ nằm sau lần Linh thấy sống, trước phát hiện khoảng 21:30; không chốt phút chết.

[CANON — S/F/R] Hào thu nợ 203 cho Vũ, đứng hút thuốc sát 204; lượt khoảng 21:20 có đối chứng ở Phase 3. Không gây cái chết, nhưng không có ngoại phạm toàn đêm. Cảnh sát đầu tiên chỉ có giả thuyết trộm/hen, chưa kết luận khi chưa pháp y.

[GAMEPLAY — R] Hộp mới/ống mở/vết cào chỉ tạo nghi vấn cần kiểm tra. Mảnh hộp trong đồ Minh khớp hộp hiện trường bác phủ nhận xử lý thuốc; Minh nhận từng phần, chỉ chỗ giấu ống cũ, cảnh sát tìm/đối chiếu nhận dạng. Sau chuyển thời gian và báo cáo thuốc/nạn nhân, người chơi phản bác lý do thay thuốc bình thường, mở lời nhận hành vi/cưỡng ép và ráp Final Deduction. Thú nhận có kiểm chứng vẫn là mắt xích quyết định; Hòa/Linh không bị loại chỉ vì nhận trộm.

**Manh mối:** tám ID gốc giữ nguyên; thêm ba ID đã duyệt `EV_PackagingMatch`, `EV_OriginalInhaler`, `EV_MedicineAnalysis`; mẫu giấy khen `EV_KhangCertificate`. Đồng xu dưới nệm, do cảnh sát xử lý; nó nối mạng lưới/quá khứ, không trực tiếp xác định người tráo. Tờ khảo sát vẫn là môi trường, không tự giải mã toàn bộ đường dây.

[GAMEPLAY — M/R] Phase 1 chỉ quan sát từ hành lang/bậu cửa và thu lời khai. Không khám cổ, thử khóa, xem thùng rác, bóc hộp, lấy xu, chụp mẫu chữ ký hoặc thu Evidence thật; bài báo/giấy khen có thể nằm trong nền, chưa ghi thẻ. Ngôi thứ hai “bạn”, khu trọ Việt Nam, sprite/background tĩnh, không đọc suy nghĩ NPC.

#### Chương 2 Con hẻm nơi quán bar

[CANON — S, Ch2] Lâm buôn tin để bán hoặc tống tiền; chết trong hẻm sau bar ngầm, hiện trường giả vụ cướp. Chủ quán giết Lâm vì Lâm phát hiện con gái đang trốn truy nã và định tống tiền. MG-07 không phải lý do giết.

[CANON] Tay bảo kê nói dối bảo vệ chủ, không giết người. Đối thủ buôn tin có động cơ/cơ hội đáng ngờ nhưng bị bằng chứng loại trừ. Vũ là khách quen dùng phòng riêng nói chuyện làm ăn, không liên quan vụ giết Lâm.

**Manh mối:** sổ tay có nhiều bí mật, trang MG-07 từ người giao hàng nội bộ từng được mua chuộc; phác thảo khu giải tỏa; máu lau vội ở phòng VIP; biên nhận cầm đồ trong lớp lót áo; timeline dẫn đến chủ quán. [UNKNOWN] Cách giết cụ thể, giờ giết, người di chuyển xác, nội dung biên nhận, chứng cứ ngoại phạm đối thủ và ID thu thập chưa có. [CANON — S, Ch4–5] Chữ ký Khang còn xuất hiện rải ở Ch2–3 qua ảnh báo/hóa đơn tài trợ, chưa phân bổ từng vật cho từng chương.

#### Chương 3 Phản bội

[CANON — S, Ch3] Đạt là doanh nhân bất động sản, đối tác tài chính ban đầu của Khang. Ông chết nghẹt trong phòng làm việc khóa kín. Một đối tác khác siết cổ ông trong cơn hoảng loạn vì phát hiện Đạt định biến mình thành vật tế cho gian lận sổ sách. Không đồng nhất người này với Khang.

[CANON] Vợ Đạt khai đọc sách phòng khách, thực tế lén tắt điện ra ngoài gặp nhân tình, tạo kẽ hở thời gian. Kế toán trưởng biết gian lận nên đáng ngờ nhưng có ngoại phạm vững. Ghi hình cũ cho thấy Vũ gặp Đạt vài tuần trước trong cuộc nói chuyện căng thẳng; không liên quan trực tiếp vụ giết.

**Manh mối:** phòng khóa kín, việc tắt điện, hồ sơ bảo hiểm Đạt giữ để mặc cả/phòng Khang loại bỏ, hồ sơ đất 15 năm trước, trâm gỗ trong két, ghi hình Vũ, ngoại phạm kế toán trưởng, chữ ký Khang rải ở Ch2–3. [UNKNOWN] Cách tạo phòng khóa kín, chi tiết chứng cứ buộc đối tác và mốc giờ chưa có.

#### Chương 4 Mối đe dọa

[CANON — S, Ch4] Ông Tư là cựu cảnh sát từng bị cấp trên khuyên ngừng đào vụ gia đình. Ông âm thầm giữ vi phim do người kiểm toán nội bộ K-Estate ăn năn, sợ hãi gửi rồi biến mất. Khi thám tử lật lại vụ án, ông thành mối đe dọa với hệ thống.

[CANON] Ông chết trong kho lưu trữ; sọ bị đập vỡ trước khi lửa cháy, không phải chập điện. Thủ thư là hung thủ, bị ép bởi nhu cầu ghép thận của vợ và lời hứa ca hiến tạng mạng lưới thu xếp. Thủ thư tiết lộ người ra lệnh ở trên cả Vũ. Cảnh sát trực ban ký chập điện quá nhanh do lười/áp lực khép hồ sơ, không phải âm mưu hối lộ được xác nhận.

**Manh mối:** pháp y sọ; kho cháy; vi phim cháy xém còn chữ ký với khuyên tròn cuối nét; lời khai thủ thư; kết luận chập điện vội. [UNKNOWN] Danh tính người trực tiếp truyền lệnh, cách thu xếp thận thực tế, số phận kiểm toán viên và cách thủ thư gây cháy chưa có.

#### Chương 5 Bằng chứng thép

[CANON — S, Ch5; GAMEPLAY — P, 3.2] Không có án mạng mới. Thám tử theo tọa độ cassette về nền đất gia đình, dùng chuyển Hiện tại/Quá khứ cùng không gian 2.5D để đối chiếu dấu vết với báo cáo giả.

[GAMEPLAY] Người chơi kéo đặt, phóng to, xoay và so khớp chữ ký Khang Ch1–3 với mảnh cháy Ch4. Ráp đồng xu + MG-07 + hồ sơ đất/trâm + lời khai người trên Vũ + đối chiếu chữ ký để lập theory Khang. Khang cùng Vũ xuất hiện; đối chất cuối yêu cầu chứng minh ông trực tiếp có mặt đêm đó. Báo động ông Tư dẫn đến bắt Khang; lời kết về em gái để mở.

[UNKNOWN] Chuỗi bằng chứng đáp ứng thách thức trực tiếp có mặt chưa được liệt kê. So khớp chữ ký không tự chứng minh hiện diện tại một địa điểm và thời gian. Không tự tạo dấu giày, nhân chứng, băng ghi âm hoặc tài liệu mới.

### A3. Danh sách nhân vật và vai trò

| Nhân vật | Vai trò đã có trong nguồn | Phạm vi |
| --- | --- | --- |
| [CANON] Thám tử chưa nêu tên | Nhân vật người chơi; sống phòng 201 theo F; người sống sót theo đuổi vụ gia đình | Toàn game |
| [CANON] Bố mẹ thám tử | Nạn nhân thảm kịch 15 năm trước | Bí ẩn chính |
| [CANON] Em gái thám tử | Người anh tưởng đã chết; nhận trâm anh tự đẽo lúc anh 7 tuổi; mức độ liên quan đường dây để mở | Ch3–5 và quá khứ |
| [CANON] Khang | Chủ tịch, từng làm trắc địa; trung tâm theory cuối, bị bắt | Bí ẩn chính |
| [CANON] Vũ | Thế lực đòi nợ/ngầm, Hào làm cho hắn; có cấp trên; không biết toàn bộ chuyện cũ | Ch1–5 |
| [CANON] Tùng | Người trọ phòng 204, khảo sát cho mạng lưới rồi áy náy; nạn nhân | Ch1 |
| [CANON] Minh | Bạn thân, người tráo ống hít, bị ép vì nợ và con gái | Ch1 |
| [CANON] Con gái Minh | Con tin; chưa nêu tên, tuổi hoặc nơi giam | Ch1 |
| [CANON] Hòa | Chủ trọ, lấy tiền, che việc vào phòng | Ch1 |
| [CANON] Linh | Hàng xóm phòng 205, trộm đồng hồ và bỏ chạy | Ch1 |
| [CANON] Hào | Đòi nợ phòng 203 cho Vũ, nghi phạm giả | Ch1 |
| [CANON] Người phòng 203 | Mục tiêu đòi nợ theo Hào; chưa nêu tên | Ch1 |
| [CANON] Cảnh sát Ch1 | Hai người đến hiện trường; người trẻ gác cửa cho phép quan sát | Ch1 |
| [CANON] Lâm | Buôn tin, nạn nhân | Ch2 |
| [CANON] Chủ quán bar | Hung thủ bảo vệ con gái | Ch2 |
| [CANON] Con gái chủ quán | Trốn truy nã, bị Lâm phát hiện | Ch2 |
| [CANON] Tay bảo kê | Nói dối bảo vệ chủ, không giết Lâm | Ch2 |
| [CANON] Đối thủ buôn tin | Nghi phạm bị loại trừ | Ch2 |
| [CANON] Người giao hàng nội bộ | Nguồn mã MG-07 của Lâm, từng được mua chuộc | Ch2 |
| [CANON] Đạt | Doanh nhân, giữ hồ sơ phòng thân; nạn nhân | Ch3 |
| [CANON] Vợ Đạt và nhân tình | Việc gặp nhau tạo khoảng trống; nhân tình chưa có vai trò khác | Ch3 |
| [CANON] Đối tác của Đạt | Hung thủ siết cổ; chưa nêu tên | Ch3 |
| [CANON] Kế toán trưởng | Nghi phạm có ngoại phạm | Ch3 |
| [CANON] Ông Tư | Cựu cảnh sát, giữ vi phim, cài báo động; nạn nhân | Ch4–5 |
| [CANON] Kiểm toán viên K-Estate | Gửi vi phim rồi biến mất | Ch4/quá khứ |
| [CANON] Thủ thư | Hung thủ bị ép, tiết lộ cấp trên Vũ | Ch4 |
| [CANON] Vợ thủ thư | Cần ghép thận | Ch4 |
| [CANON] Cảnh sát trực ban/cấp trên ông Tư | Người ký kết luận vội / người khuyên ngừng điều tra; không có căn cứ đồng nhất | Ch4/quá khứ |
| [UNKNOWN] Người truyền lệnh cho Minh, đội thực thi cũ, người ra lệnh thủ thư | Có chức năng trong mạng lưới nhưng chưa đủ danh tính | Bí ẩn chính |

### A4. Thông tin không được tiết lộ sớm cho người chơi

| Nội dung tác giả biết | Điểm tiết lộ theo nguồn | Giới hạn |
| --- | --- | --- |
| [CANON] Minh thực hiện, con gái bị bắt, nguồn hóa chất | F Phase 3 chỉ chốt tráo thuốc/bị ép; S Ch1 có động cơ đầy đủ | [UNKNOWN] Cảnh tiết lộ con tin/nguồn hóa chất chưa có trong F |
| [CANON] Đồng xu là thẻ nội bộ, Tùng tham gia thu gom | S Ch1; F Phase 2 coi đồng xu chưa rõ | [UNKNOWN] Thời điểm người chơi hiểu công dụng trong Ch1 |
| [CANON] MG-07 không phải động cơ giết Lâm | S Ch2 dẫn vật lý/timeline về chủ quán | Không dùng mã để buộc chủ quán hoặc Vũ giết Lâm |
| [CANON] Trâm gắn với em gái và lệ nộp vật cá nhân | S Ch3 | Ch1 chưa biết em gái còn sống từ trâm |
| [CANON] Người trên Vũ và chữ ký quen | S Ch4 | Chưa tự động thông báo Khang là hung thủ từ một nét bút |
| [CANON] Theory về Khang do người chơi ráp | S Ch5 | NPC không kể hộ toàn bộ lời giải |
| [UNKNOWN] Trách nhiệm/ý định hiện tại của em gái | Kết Ch5 vẫn để mở | Không xác nhận cô là phản diện hoặc người cứu anh |

## B. CHAPTER 1 TIMELINE

### B1. Actual Timeline theo quyết định đã duyệt

| Giờ/khoảng | Sự thật tác giả biết | Nguồn xác minh cho người chơi |
| --- | --- | --- |
| 20:00–20:44 | [UNKNOWN] Không chốt hoạt động tất cả NPC; Minh đã có ống được giao trước cuộc gặp | Không lấy câu Linh ngủ thành sự thật |
| Khoảng 20:45 | [CANON — F/R] Minh tới 204 | Ban đầu lời Minh |
| 20:50–20:55 | [CANON — R] Tùng rửa mặt sau vách/rèm trong góc 204 | Khăn hỗ trợ hoạt động, không đo phút |
| Trong 20:50–20:54 | [CANON — R] Minh lấy ống cũ/đặt ống khác, bỏ hộp; giữ sót mảnh nắp giấy trong túi áo khoác | Mảnh hộp, thu ống cũ, báo cáo, lời nhận |
| Khoảng 20:54 | [CANON — R] Minh rời; Hòa thấy đi xuống cầu thang trước khi mình vào | Lời Hòa + nhận Minh, không timestamp độc lập |
| Sau rời, trước quay lại | [CANON — R] Minh giấu ống cũ ở hốc khuất chân cầu thang tầng trệt | Thu đúng nơi theo chỉ dẫn; phút giấu [UNKNOWN] |
| 20:55–20:56 | [CANON — R] Hòa lấy tiền khu bàn, để biên nhận; Tùng còn lau mặt sau vách | Giấy + Hòa nhận; không ngoại phạm thuốc |
| Khoảng 20:57 | [CANON — R] Tùng ra khu bàn | [UNKNOWN] Phút không được chứng minh độc lập |
| Khoảng 21:03–21:05 | [CANON — R] Cơn khó thở, dùng ống ở bàn, gục sàn cạnh giường | Lời Linh chỉ chứng kiến đoạn gục/cào; nguyên nhân xác nhận sau |
| Khoảng 21:05 | [CANON — F/R] Linh lấy đồng hồ, thấy sống, bỏ chạy | Lời cô, đồng hồ/vệt bụi; không đo phút chết |
| Sau lần Linh thấy, trước khoảng 21:30 | [CANON — R] Tùng chết | Không ghi đã chết 21:20 |
| Khoảng 21:20 | [CANON — F/R] Hào thu nợ 203, hút thuốc sát 204 | Phase 1 tự khai; Phase 3 có đối chứng lượt này |
| Khoảng 21:30 | [CANON — F/R] Hòa phát hiện, báo | Ban đầu lời Hòa |
| Khoảng 21:31–21:34 | [CANON — R] Hòa báo cảnh sát/gọi Minh, tới 201 | Không có log cuộc gọi làm Evidence đã chốt |
| 21:35 | [CANON — F] Đồng hồ mở cảnh; Hòa báo bạn ở 201; bạn nhìn 204 từ bậu cửa | Quan sát trực tiếp |
| Sau đó | [CANON — F/R] Minh tới từ cầu thang, bốn người lấy lời khai | Giờ tới Minh chưa chốt phút |
| Khoảng 21:45 | [CANON — R] Cảnh sát tới cuối Phase 1 | Nhịp cảnh theo node, không đồng hồ chơi thật |

### B2. Claimed Timeline ban đầu phải giữ

| Người | Nội dung statement đầu | Trạng thái |
| --- | --- | --- |
| Hòa | Chỉ lên một lần khoảng 21:30, chưa bước vào | [CANON] Nội dung lời khai, không phải sự thật đã kiểm |
| Linh | Ngủ từ tám giờ, không nghe/biết gì | [CANON] Nội dung lời khai; ngủ “suốt đêm” nghĩa lời cô về khoảng trước lúc được gọi |
| Hào | Qua 204 để thu nợ 203, khoảng 21:20 | [CANON] Lời khai; vị trí đứng không bằng chứng gây án |
| Minh | Tới khoảng 20:45, rời trước 21:00, Tùng bình thường; chuyện cá nhân, Tùng bảo rửa mặt | [CANON] Nội dung lời khai; không cho biết 20:54 ở Phase 1 |

### B3. Player Timeline và kiến thức theo Phase

[GAMEPLAY] Phase 1: 21:35/hiện diện nhìn thấy là quan sát; các giờ trước đều có nhãn người khai. Phase 2: ghi nội dung giấy/khăn/ống/hộp/vết cào, chưa kết nguyên nhân. Phase 3a: lời sửa Hòa/Linh/Hào, mảnh hộp và lời nhận từng phần. Thu ống đúng vị trí hỗ trợ nhận. Phase 3b: báo cáo đủ phạm vi + lời nhận cuối. Quan hệ thời điểm tráo theo nhận phù hợp thứ tự, không đo độc lập. Khoảng phút actual chỉ đưa vào Player Timeline nếu có nguồn lời cụ thể; kịch bản Phase 3 hiện chỉ xác lập quan hệ sự kiện, không tự gán Minh đã nói khoảng 20:50–20:54. Phase 4: lời về nợ/con tin/nguồn cung và công dụng xu; phần tổ chức vẫn cần kiểm.

[GAMEPLAY] Không đồng nhất người nói dối với hung thủ. Tùng sống ở 20:55 không được chứng nhận bởi Hòa nếu ông không thấy. Khăn không xác định ai dùng hoặc phút nếu thiếu lời liên quan. Không dùng sự bình thường khi Minh rời để bác anh; việc tráo trước cơn phù hợp.

## C. EVIDENCE DATABASE

### C1. Quy tắc dữ liệu

[GAMEPLAY — F/R] Có **8 Evidence ID gốc**, thêm **3 ID điều tra đã duyệt** và **1 ID mẫu chữ ký đã duyệt**. Tờ khảo sát không có Evidence ID. `EV_MissingWatch` là dấu vết món đồ mất, chưa phải một vật “đồng hồ thu hồi” riêng. Giữ nguyên chữ hoa/thường và dấu gạch dưới. Các Statements/Timeline trong F chưa có ID máy; bản Phase 1 mới cấp mã triển khai riêng và ghi rõ đó không phải Evidence.

[GAMEPLAY — yêu cầu mới thay gate R] Mỗi ID một thẻ. Gate Phase 2 cần năm ID: EV_LooseLock, EV_NeckScratches, EV_Inhaler, EV_RentReceipt, EV_MissingWatch. EV_WetTowel và EV_InhalerBox tùy chọn khi rời Phase 2 nhưng bắt buộc trước vòng Minh sử dụng chúng; quay lại cùng phòng 204 trong Phase 3a để Inspect bổ sung. Không gộp ống/hộp. Xu và giấy khen không bắt buộc lúc khám nhưng phải lưu qua fallback trước kết Ch1. Chỉ ghi thẻ sau đúng hành động/nguồn.

[GAMEPLAY — R] Inspect mở ảnh/ghi nhận từ cảnh sát; người chơi thu thông tin, không tự lấy vật thật. Cảnh sát xử lý nệm, thi thể, thùng rác và đồ cá nhân theo quy trình thế giới game, ghi nguồn ảnh. Present luôn dùng hồ sơ/ảnh. Phase 1 chưa mở Inspect hoặc thao tác này.

### C2. Các vật chứng Chapter 1

#### EV_LooseLock

- **Tên/mô tả [GAMEPLAY]:** ổ khóa cửa; chốt tự động lỏng, vết xước mờ, có thể vặn ngoài nếu không chủ động bấm chốt.
- **Nơi [CANON]:** cụm khóa tay nắm tròn mặt trong cửa 204.
- **Thu thập [GAMEPLAY]:** Inspect bản ghi/ảnh ổ khóa theo kiểm tra của cảnh sát; thám tử không tự thử chốt.
- **Statement:** [GAMEPLAY] Hỗ trợ Hòa/Linh; lời “cửa khóa nên không vào được” chỉ là tình huống dự kiến ở F p066, không phải câu NPC đã nói.
- **Chứng minh [INFERENCE]:** có khả năng tiếp cận không phá cửa trong điều kiện chốt mô tả.
- **Không đủ chứng minh:** ai đã vào, chốt lúc xảy ra án, giờ vào, ai tráo thuốc; không phải ngoại phạm hay bằng chứng cá nhân.
- **Nguồn:** F p060–p068.

#### EV_WetTowel

- **Tên/mô tả [GAMEPLAY]:** khăn ướt lạnh; vòi đóng chưa chặt, nhỏ giọt.
- **Nơi [CANON]:** giá khăn cạnh bồn ở góc phòng 204.
- **Thu thập [GAMEPLAY]:** Inspect ảnh/ghi nhận bồn sau vách/rèm; không cần lấy khăn thật.
- **Statement:** [GAMEPLAY] Minh nói Tùng đi rửa mặt lúc anh về; hỗ trợ lời này, không trực tiếp phản bác nó.
- **Chứng minh [INFERENCE]:** bồn/khăn có dấu sử dụng gần đây; kết hợp lời khai mới gán người dùng là Tùng.
- **Không đủ chứng minh:** chính xác người dùng, 20:45–20:50 hoặc 20:50–20:55, cả phòng không người, Minh còn ở đó, cơ hội duy nhất.
- **Nguồn:** F p069–p077, p196; R đã xử lý G02–G03, giữ giới hạn chứng minh của khăn.

#### EV_NeckScratches

- **Tên/mô tả [GAMEPLAY]:** ba vết cào đỏ rướm máu, cổ áo xộc xệch; Inspect diễn giải Tùng tự cào để thở.
- **Nơi [CANON]:** cổ/ngực áo thi thể.
- **Thu thập [GAMEPLAY]:** Inspect ảnh vùng cổ do cảnh sát cung cấp; lúc đầu chưa có báo cáo pháp y.
- **Statement:** [UNKNOWN] Không có statement đích riêng; [GAMEPLAY] chống hướng nghi bóp cổ, nhấn mạnh tìm thuốc.
- **Chứng minh [INFERENCE]:** phù hợp một cơn khó thở và tự cào theo cách diễn giải nguồn.
- **Không đủ chứng minh:** nguyên nhân y khoa cuối cùng, độc chất, thuốc đã dùng, người gây án; chưa đủ tự loại mọi ngoại lực chỉ bằng ảnh vết cào.
- **Nguồn:** F p078–p085/p140; S Ch1.

#### EV_Inhaler

- **Tên/mô tả [GAMEPLAY]:** ống hít xanh nhạt mở nắp, trông được sử dụng khẩn cấp; Minh nhìn chăm chú từ hành lang.
- **Nơi [CANON]:** bàn làm việc 204.
- **Thu thập [GAMEPLAY]:** Inspect bản ghi bàn/ống hít; sau yêu cầu ở Phase 3 cảnh sát thu/gửi kiểm tra, không có kết quả tức thì.
- **Statement:** [GAMEPLAY] Minh nói cuộc gặp bình thường/không có chuyện gì; F p092 là nguồn gốc hướng hỏi thuốc; R dùng câu hỏi/Present tuần tự và gói bổ sung, không kết bằng ống/hộp một mình.
- **Chứng minh [INFERENCE]:** thuốc ở bàn, nắp mở; ánh nhìn Minh là gợi ý tâm lý theo F.
- **Không đủ chứng minh:** đã xịt vào người, bị thay, có hóa chất, hóa chất nguồn nào, ai thay và lúc nào. S xác nhận thủ đoạn ở cấp tác giả; thẻ này một mình chưa có xét nghiệm. EV_MedicineAnalysis chỉ mở sau đúng bước R.
- **Nguồn:** F p086–p094/p198–p201; S Ch1.

#### EV_InhalerBox

- **Tên/mô tả [GAMEPLAY]:** hộp giấy ống hít loại mới, nát, đã bóc; không xác định tối nay chỉ bằng nhìn hộp.
- **Nơi [CANON]:** thùng rác nhựa dưới bàn.
- **Thu thập [GAMEPLAY]:** Inspect ảnh thùng rác/hộp do cảnh sát xử lý; thám tử không tự lấy.
- **Statement:** [GAMEPLAY] Ống/hộp tạo hướng kiểm tra; EV_PackagingMatch dùng bác phủ nhận xử lý hộp mở ở Phase 3, không tự đặt câu phủ nhận đó tại Phase 1.
- **Chứng minh [INFERENCE]:** có dấu vết thay mới/bóc hộp, làm giả thuyết tráo đáng điều tra.
- **Không đủ chứng minh:** giờ chính xác, ai bóc, hộp đúng ống trên bàn, thay thuốc hợp lệ hay độc, trách nhiệm Minh. Không gán vân tay, lô thuốc hoặc biên lai mua hàng chưa có.
- **Nguồn:** F p095–p102/p198–p210.

#### EV_RentReceipt

- **Tên/mô tả [GAMEPLAY]:** liên biên nhận giấy than hồng nhạt, chữ ký Hòa mục người thu, giờ 20:55.
- **Nơi [CANON]:** trên bàn, dưới mép gạt tàn.
- **Thu thập [GAMEPLAY]:** Inspect ảnh biên nhận cảnh sát ghi; Present hồ sơ, không rút giấy thật từ sổ.
- **Statement:** [GAMEPLAY] Hòa chỉ lên một lần 21:30 và chưa bước vào.
- **Chứng minh [GAMEPLAY]:** F dùng giấy để ép Hòa thừa nhận lần vào lấy tiền trước phát hiện xác. [INFERENCE] Chữ ký/giờ ghi cùng lời nhận tạo chuỗi mạnh hơn riêng giấy.
- **Không đủ chứng minh:** giấy một mình đảm bảo Hòa đích thân để tại bàn lúc ghi, Tùng ở ngoài phòng/còn sống, khoản tiền là trộm hay khoản thu có quyền, hoặc Hòa không thể động vào ống hít.
- **Nguồn:** F p103–p111/p160–p168; R đã xử lý G04/G12/G18; giấy vẫn không tự là ngoại phạm.

#### EV_MissingWatch

- **Tên/mô tả [GAMEPLAY]:** vòng bụi trống sạch cỡ mặt đồng hồ đeo tay; bên cạnh đồng hồ báo thức nứt.
- **Nơi [CANON]:** mặt tủ đầu giường.
- **Thu thập [GAMEPLAY]:** Inspect vòng bụi; Phase 3 Linh lộ đồng hồ nam xước trên tay, không có ID đồng hồ riêng hoặc bước thu hồi.
- **Statement:** [GAMEPLAY] Linh ngủ suốt từ tám giờ, không biết gì.
- **Chứng minh [INFERENCE]:** vật từng đặt trên bụi đã bị lấy; cổ tay giấu và đồng hồ lộ, cộng lời nhận, hỗ trợ việc Linh trộm/vào phòng.
- **Không đủ chứng minh:** riêng vòng bụi xác định Linh, tài sản đúng của Tùng hoặc giờ trộm; không chứng minh Linh không tráo thuốc, không chứng minh người tráo là Minh.
- **Nguồn:** F p112–p120/p171–p180.

#### EV_BoundaryCoin

- **Tên/mô tả [GAMEPLAY]:** đồng xu kim loại xỉn, nặng, khắc hình mốc ranh giới, không giống tiền tệ.
- **Nơi [CANON — R]:** dưới nệm. Mô tả túi áo/túi quần F đã bị thay thế bởi D04-B.
- **Thu thập [GAMEPLAY — R]:** cảnh sát xử lý giường, cung cấp ảnh đồng xu. Nếu chưa ghi trong Phase 2, fallback Phase 4; không thu trong Phase 1.
- **Statement [GAMEPLAY — R]:** không dùng xác định Minh trực tiếp tráo. Unknown là trạng thái trong Evidence. Phase 4 nối công dụng thẻ/mạng lưới ở phạm vi lời khai và sự nhận ra hình quen của thám tử.
- **Chứng minh [CANON ở cấp tác giả — S]:** thẻ nội bộ Tùng được cấp; nối hình với vết máu quá khứ.
- **Không đủ chứng minh đối với người chơi:** người cấp, Khang có mặt, Minh giết, quan hệ đồng xu với con tin, em gái tham gia. Ý nghĩa thẻ/hồi tưởng mở Phase 4 theo R, không tự có ở Phase 1.
- **Nguồn:** S Ch1/Ch5; F p121–p128/p215.

### C3. Dữ liệu hỗ trợ chưa có Evidence ID

| Dữ liệu | Cách/nơi thấy | Vai trò và giới hạn |
| --- | --- | --- |
| [GAMEPLAY] Tờ khảo sát cư dân | Inspect bảng nỉ 204, tên gạch đỏ | F p132 ghi không phải Evidence. [CANON — S] Công cụ khảo sát ép bán; người chơi chưa có chứng cứ giải mã từng tên |
| [GAMEPLAY] Quan sát Hòa | Túi áo cộm, bụi than dép ở Phase 1 | Không có ID; bụi được kể là loại quanh bếp 204 nhưng chưa có đối chiếu/thu mẫu |
| [GAMEPLAY] Quan sát Linh | Che cổ tay, eyeliner nhòe/kẻ dở | Gợi nghi, không dùng nét trang điểm để định giờ hay chứng minh trộm |
| [GAMEPLAY] Quan sát Hào | Tàn thuốc, đứng sát 204 | Chống câu chỉ đi ngang; không định giờ đến độc lập |
| [GAMEPLAY] Quan sát Minh | Nhìn ống hít | Gợi nghi; không phải bằng chứng hành vi tráo |
| [GAMEPLAY] Lời nhận Hòa/Linh, giờ Hào, lời Minh | Notebook Statements/Timeline Phase 3 | Chưa có ID; phải giữ nguồn phát ngôn và mức độ kiểm chứng |
| [GAMEPLAY] Ảnh cận thùng rác | Minh vòng 3 | R quy định cảnh sát chụp/cung cấp hồ sơ sau Inspect, không đạo cụ xuất hiện vô nguồn |
| [CANON] Bài báo Khang/giấy khen | Tường khu trọ theo S | R cấp EV_KhangCertificate cho giấy khen; hotspot/fallback trước hết Ch1, chưa thu Phase 1 |

[UNKNOWN] Ch2–5 chưa được F cấp Evidence ID. Các vật nêu ở A2/Foreshadowing là danh mục nội dung, không phải mã dữ liệu đã chốt.

### C3a. Evidence bổ sung theo R đã duyệt

| ID | Tên/nguồn và cách ghi nhận | Statement/công dụng | Giới hạn |
| --- | --- | --- | --- |
| EV_PackagingMatch | Cảnh sát ghi mảnh nắp giấy trong đồ Minh giao kiểm tra; khớp mép rách/họa tiết hộp 204, ảnh đối chiếu | Bác phủ nhận chưa xử lý hộp/thuốc; mở nhận từng phần | Không định giờ, độc tính hoặc ý định; có thể từng cầm vì lý do khác |
| EV_OriginalInhaler | Cảnh sát tìm hốc khuất chân cầu thang theo chỉ dẫn Minh; nhãn cá nhân Tùng đối chiếu hồ sơ thuốc, ảnh và nguồn trong thẻ | Kiểm chứng chi tiết nhận trước lúc tìm; cho thấy ống cũ bị mang đi | Không độc lập định giờ hoặc người chuẩn bị hóa chất |
| EV_MedicineAnalysis | Báo cáo sau gửi kiểm tra/chuyển thời gian; chất trong ống bàn khác thuốc ghi nhãn, nhóm hóa chất vệ sinh; ống cũ phù hợp thuốc cấp; có phần liên hệ nạn nhân | Bác thay thuốc bình thường; xác nhận nguyên nhân khi phần nạn nhân đủ | Chưa chỉ tên công ty, người ra lệnh hoặc ý thức Minh |
| EV_KhangCertificate | Ảnh giấy khen khu trọ, hotspot phụ/fallback trước kết Ch1 | Mẫu chữ ký cho Ch4–5, chưa nhấn nét khuyên ở Ch1 | Không chứng minh Khang giết hoặc có mặt đêm cũ |

[GAMEPLAY — R] Chỉ ba thẻ điều tra bổ sung là mắt xích vụ án; giấy khen là mẫu dài hạn. Không thẻ nào được phát trước hành động/điều kiện mở.

### C4. Chuỗi chứng minh đã duyệt và giới hạn

[GAMEPLAY — R] Quan sát/ống/hộp tạo nghi vấn → phản bác Hòa/Linh chỉ làm rõ lần vào và vụ lấy đồ → đối chứng lượt Hào → Press mở phủ nhận cụ thể Minh → Present mảnh hộp → nhận thay/mang ống cũ nhưng biện hộ giúp đổi thuốc → chỉ chỗ, thu và nhận dạng ống cũ → chờ kết quả → Present báo cáo bác thay bình thường → lời nhận hành vi/cưỡng ép → Final Deduction.

[INFERENCE] Hòa/Linh có cơ hội, không bị loại chỉ bằng việc trộm. Gói R quy hành vi trực tiếp cho Minh nhờ vật chứng + nhận kiểm chứng; không chứng minh tuyệt đối mọi người không từng chạm thuốc hoặc không đồng phạm. Hào được đối chứng lượt thu nợ, không ngoại phạm toàn đêm.

[UNKNOWN] Giờ thao tác không đo độc lập, mức hiểu độc tính, nguồn cung cụ thể, con tin và người cưỡng ép cần ghi phạm vi lời nhận. Chỉ phân tích chất trong ống chưa đủ xác định nó gây chết; phải có phần liên hệ nạn nhân trước gate kết luận nguyên nhân. Không có kiểm tra hóa chất tức thì bằng mắt/mùi.

## D. CHARACTER KNOWLEDGE

### D1. Nhân vật trực tiếp Chapter 1

#### Thám tử

- **Biết [CANON]:** mất gia đình theo hiểu biết ban đầu; sống bằng nghề điều tra; lời khai Phase 1, quan sát Phase 2, lời khai sửa Phase 3. S cho anh nhận ra hình đồng xu giống vết máu 15 năm trước, Theo R, phản ứng nhận hình quen ở Phase 4, không phải Phase 1.
- **Che giấu [UNKNOWN]:** chưa có bí mật anh cố tình giấu NPC được xác nhận; không đồng nhất sống ẩn dật với nói dối.
- **Tin [CANON/UNKNOWN]:** ban đầu tin em gái chết; thay đổi từ Ch3–5. Không biết đầy đủ mạng lưới ở Ch1.
- **Nói dối [UNKNOWN]:** chưa có câu nói dối cụ thể.
- **Thái độ với thám tử:** không áp dụng cho chính anh.
- **Giao tiếp [CANON — F]:** trầm tĩnh, hỏi ngắn, quan sát, không cao giọng ở đối chất Hòa.
- **Điều kiện đổi nhận định [GAMEPLAY]:** thu evidence, lời khai mới, đối chiếu và Deduction; chưa có luật đổi niềm tin riêng.

#### Tùng

- **Biết [CANON — S]:** công việc thật, việc xóa nợ/thẻ đồng xu, người bị khảo sát; áy náy trước án.
- **Che giấu [CANON]:** vai khảo sát mạng lưới dưới danh nhân viên tiện ích. [UNKNOWN] Che với ai và có kể Minh hay không.
- **Tin [UNKNOWN]:** không được khẳng định anh tin Minh an toàn hoặc biết ai sẽ giết.
- **Nói dối [CANON/UNKNOWN]:** vỏ bọc tiện ích là sự giả dạng đã nêu; không có nguyên văn phát ngôn cụ thể.
- **Thái độ/giao tiếp [UNKNOWN]:** không có cảnh nói với thám tử để chốt giọng.
- **Đổi lời khai:** không áp dụng sau khi chết; [CANON] trước đó đã chuyển từ khảo sát sang cảnh báo, chưa có điều kiện gameplay.

#### Minh

- **Biết [CANON]:** cuộc gặp, hành động tráo, việc bị ép; con gái bị giữ và khoản nợ. [UNKNOWN] Danh tính người ra lệnh, mức biết về hóa chất/Khang/Vũ.
- **Che giấu [CANON]:** tráo thuốc, cưỡng ép và con tin; F cuối Phase 3 chỉ hé cưỡng ép.
- **Tin [UNKNOWN]:** nói không biết gây chết người nhưng S không xác nhận niềm tin đó là thật; không biến lời bào chữa thành sự thật.
- **Lời dối [CANON/UNKNOWN]:** phủ nhận có chuyện đáng kể, gọi cuộc gặp chỉ tán gẫu trong khi che tráo. Câu Tùng bình thường khi về **không nhất thiết sai**: thuốc có thể bị tráo trước cơn. Giờ actual đã duyệt tại B; Phase 1 chỉ ghi tới 20:45/rời trước 21:00 theo anh.
- **Thái độ [CANON — F]:** đau khổ, tránh mắt, chú ý ống hít, phòng thủ rồi hoảng loạn; [UNKNOWN] không xác định toàn bộ đau buồn là giả.
- **Giao tiếp [CANON]:** ngập ngừng, thề, lảng chuyện cá nhân, đổ khả năng thời tiết, vỡ khi bị dồn.
- **Đổi lời [GAMEPLAY]:** Press cuộc gặp/thuốc → Present mảnh hộp → nhận từng phần/thu ống cũ → báo cáo sau thời gian chờ → nhận cuối theo R. Không viết anh biết mọi cấp trên.

#### Hòa

- **Biết [CANON — F]:** đã vào lấy tiền và để biên nhận, rồi báo phát hiện/gọi Minh. [UNKNOWN] Tùng còn sống lúc vào nếu ông không thấy cậu.
- **Che giấu [CANON]:** lần vào trước và việc lấy tiền; sợ bị quy trộm/giết.
- **Tin [UNKNOWN]:** lời rằng Tùng vừa ra ngoài/còn sống không có nguồn tri giác rõ.
- **Lời dối [CANON]:** chỉ lên một lần 21:30 và chưa bước qua cửa.
- **Thái độ [CANON]:** nhờ thám tử làm chứng, lo cảnh sát, giật mình và hoảng khi giấy lộ.
- **Giao tiếp [CANON]:** rền rĩ gượng, thề, biện hộ “phần của tôi”, khai khi bị ép.
- **Đổi lời [GAMEPLAY]:** Press số lần lên + Present `EV_RentReceipt`. [CANON — R] Giờ đúng 20:55; lấy quá tiền nợ; không xác nhận thấy Tùng sống lúc đó.

#### Linh

- **Biết [CANON]:** trộm đồng hồ, thấy Tùng quay lại/gục/cào cổ khoảng 21:05, bỏ chạy.
- **Che giấu [CANON]:** việc vào 204, đồng hồ và việc không giúp.
- **Tin [CANON theo lời cô]:** tưởng cơn hen như thường, không biết sẽ chết. [UNKNOWN] Không có xác nhận độc lập suy nghĩ này.
- **Lời dối [CANON]:** ngủ suốt từ tám giờ, không nghe/biết gì, không rời phòng.
- **Thái độ [CANON]:** tránh nhìn, co rúm, che cổ tay, sợ bị phát hiện.
- **Giao tiếp [CANON]:** lời đầu trôi chảy; sau bằng chứng run/nấc và khai đứt quãng.
- **Đổi lời [GAMEPLAY]:** Press giấc ngủ + Present `EV_MissingWatch`, lộ đồng hồ, nhận trộm/chứng kiến. [UNKNOWN] Không có xác nhận cô thấy Tùng dùng ống hít.

#### Hào

- **Biết [CANON]:** việc đòi nợ và người thuê; S/F xác định làm cho Vũ. [UNKNOWN] Biết phương thức giết Tùng không.
- **Che giấu [CANON]:** tên thế lực thuê; đứng sát 204 thay vì chỉ lướt qua.
- **Tin [UNKNOWN]:** không có niềm tin nội tâm được nêu.
- **Lời dối [CANON]:** mô tả chỉ đi ngang không khớp đứng hút thuốc sát cửa. Câu tới đòi nợ 203 phù hợp S, không được tự đổi thành dối.
- **Thái độ [CANON]:** lạnh, thách thức và cảnh báo thám tử về tên không nên hỏi.
- **Giao tiếp [CANON]:** đều, sắc, ít hoảng loạn, không nêu tên Vũ trực tiếp.
- **Đổi lời [GAMEPLAY]:** Press vị trí đứng/khóa lỏng và người thuê; thừa nhận đứng hút thuốc, vẫn không khai tên. [GAMEPLAY — R] Cảnh sát đối chứng lượt 203/biên nhận trong Phase 3; không mở tên Vũ trực tiếp ở Phase 1, không ngoại phạm toàn đêm.

#### Cảnh sát tại hiện trường

- **Biết [CANON — F]:** có thi thể, thám tử ở 201 qua Hòa; đang chờ pháp y.
- **Che giấu/tin/nói dối [UNKNOWN]:** không có dữ kiện để gán tham nhũng hoặc âm mưu. S có kết luận sơ bộ về trộm/hen nhưng chưa đồng bộ với thời điểm F.
- **Thái độ/giao tiếp [CANON]:** người trẻ cho quan sát, yêu cầu không xáo trộn, nhắc cấp trên không thích người ngoài chạm vật chứng.
- **Đổi lời [UNKNOWN]:** không có nhánh thẩm vấn hoặc điều kiện công nhận kết quả/bắt Minh trong phần F đã cho.

### D2. Các nhân vật còn lại

Mỗi ô không có thông tin được ghi [UNKNOWN]; không suy tính cách từ nghề hoặc giới tính. “Đổi lời” gồm cả điều kiện tiết lộ, không tự coi họ có lời khai trong Ch1.

| Nhân vật | Sự thật biết và che giấu | Tin là thật và lời dối cụ thể | Thái độ với thám tử và giao tiếp | Điều kiện đổi lời/tiết lộ |
| --- | --- | --- | --- | --- |
| Bố mẹ | [UNKNOWN] Biết gì về thu gom | [UNKNOWN] | [UNKNOWN] | Không có lời khai hiện tại |
| Em gái | [UNKNOWN] Mức biết/che giấu; [CANON] có liên quan đường dây theo lời Khang cuối | [UNKNOWN] Khang nói cô tin được cứu, chưa độc lập xác nhận; lời dối chưa có | [UNKNOWN] | [UNKNOWN] Chưa có cảnh trực tiếp |
| Khang | [CANON] Liên hệ các phi vụ cũ/Đạt; [UNKNOWN] toàn bộ kiến thức cá nhân và bí mật cụ thể ngoài vai trò tổng thể | [UNKNOWN] Lời về em gái không được mặc định khách quan; chưa có câu dối cuối để bác cụ thể | [CANON] Thách thức chứng minh có mặt; [UNKNOWN] giọng chi tiết | [CANON] Hứa nói chuyện em gái nếu chứng minh hiện diện; [UNKNOWN] chuỗi Present cuối |
| Vũ | [CANON] Biết việc ngầm của mình; không biết toàn bộ quá khứ; [UNKNOWN] phần đã biết/giấu | [UNKNOWN] | [CANON] Sững/tay run cuối; [UNKNOWN] cách nói | [UNKNOWN] |
| Con gái Minh/người 203 | [UNKNOWN] | [UNKNOWN] | [UNKNOWN] | [UNKNOWN] |
| Lâm | [CANON] Bí mật con gái chủ quán, MG-07 và nhiều tin khác; dùng tin tống tiền | [UNKNOWN] Giải nghĩa mã đến đâu; lời dối cụ thể chưa có | [UNKNOWN] | Nạn nhân; thông tin từ sổ/timeline |
| Chủ quán | [CANON] Con gái trốn truy nã, việc giết Lâm; [CANON] hiện trường giả cướp | [UNKNOWN] Lời khai cụ thể | [UNKNOWN] | [GAMEPLAY/S] Vật lý + timeline dẫn về động cơ, chưa có ngưỡng đổi lời |
| Con gái chủ quán | [CANON] Đang trốn truy nã; [UNKNOWN] biết việc giết/che giấu gì khác | [UNKNOWN] | [UNKNOWN] | [UNKNOWN] |
| Bảo kê | [CANON] Che để bảo vệ chủ; [UNKNOWN] biết hành động giết cụ thể tới đâu | [CANON] Có nói dối; [UNKNOWN] nguyên văn/nội dung chính xác | [UNKNOWN] | [UNKNOWN] |
| Buôn tin đối thủ | [UNKNOWN] Biết/che giấu; [CANON] không giết | [UNKNOWN] | [UNKNOWN] | [CANON] Có bằng chứng loại trừ, chưa chi tiết |
| Giao hàng nội bộ | [CANON] Là nguồn MG-07, từng được mua chuộc; [UNKNOWN] biết ý nghĩa | [UNKNOWN] | [UNKNOWN] | [UNKNOWN] |
| Đạt | [CANON] Phi vụ đất cũ, hồ sơ phòng thân, giữ trâm; che/giữ hồ sơ để mặc cả | [UNKNOWN] | [UNKNOWN] | Nạn nhân; phát hiện két/hồ sơ |
| Vợ Đạt | [CANON] Tắt điện, gặp nhân tình, che việc đó | [CANON] Dối đọc sách phòng khách; [UNKNOWN] niềm tin khác | [UNKNOWN] | [UNKNOWN] |
| Nhân tình | [UNKNOWN] Mức biết ngoài cuộc gặp | [UNKNOWN] | [UNKNOWN] | [UNKNOWN] |
| Đối tác giết Đạt | [CANON] Biết sắp bị làm vật tế, biết mình siết cổ; [UNKNOWN] cách che | [UNKNOWN] Câu dối; [CANON] phát hiện kế hoạch Đạt | [UNKNOWN] | [UNKNOWN] |
| Kế toán trưởng | [CANON] Biết gian lận; [UNKNOWN] che gì | [UNKNOWN] | [UNKNOWN] | [CANON] Ngoại phạm vững, chi tiết chưa có |
| Ông Tư | [CANON] Biết hồ sơ cũ/vi phim/báo động; giữ vi phim âm thầm; [UNKNOWN] biết hết chữ ký hay chưa | [UNKNOWN] Lời dối/niềm tin cụ thể | [UNKNOWN] | [CANON] Thám tử lật án khiến ông bị nhắm; chưa có trigger khai |
| Kiểm toán viên | [CANON] Có thông tin trong vi phim, ăn năn/sợ; [UNKNOWN] chi tiết/đang ở đâu | [UNKNOWN] | [UNKNOWN] | [CANON] Gửi vi phim rồi biến mất; điều kiện gặp lại chưa có |
| Thủ thư | [CANON] Hành vi giết, cưỡng ép, người ra lệnh trên Vũ; che tội | [CANON] Được hứa ca ghép cho vợ; [UNKNOWN] tin lời hứa đến đâu/câu dối | [CANON] Nhút nhát, lời khai giằng xé; thái độ riêng chưa có | [CANON] Thú nhận tiết lộ cấp trên; [UNKNOWN] trigger cụ thể |
| Vợ thủ thư | [CANON] Cần ghép thận; [UNKNOWN] biết kế hoạch | [UNKNOWN] | [UNKNOWN] | [UNKNOWN] |
| Cảnh sát trực ban Ch4 | [CANON] Ký kết luận quá nhanh vì lười/áp lực; không xác nhận hối lộ | [UNKNOWN] Lời dối có chủ ý | [UNKNOWN] | [UNKNOWN] |
| Cấp trên ông Tư/người truyền lệnh/đội thực thi | [CANON] Chức năng được S nêu; [UNKNOWN] danh tính và phạm vi biết | [UNKNOWN] | [UNKNOWN] | [UNKNOWN] |

## E. GAMEPLAY RULES

### E1. Notebook và quyền ghi nhận

[GAMEPLAY — P/R] Bốn tab Evidence, People, Timeline, Statements. Unknown là trạng thái thẻ, không tab thứ năm. Mỗi ID một thẻ; save JSON giữ nguồn bản ghi/trạng thái thu/lời khai/phase flags. Evidence thu nghĩa thông tin do cảnh sát ghi nhận, không vật thật trong túi thám tử.

[GAMEPLAY — M/R] Phase 1 mở Notebook sau cuộc hỏi Hòa; Evidence hiển thị rỗng. Mọi giờ NPC khai là lời khai, không verified. Chỉ ghi quan sát hợp tầm nhìn; chưa khám cổ/khóa/thùng/nệm. IDs statement/observation của kịch bản Phase 1 là mã triển khai, không Evidence mới.

### E2. Press và Present

[GAMEPLAY — R] Phase 1 chỉ câu hỏi thông thường/làm rõ, không nút Press/Present. Phase 3 mở Press trên statement đang biết; hỏi lại không phạt. Present tuần tự vào statement cụ thể bằng thẻ đã mở. Khăn hỗ trợ lời rửa mặt, không bác nó. Đúng cập nhật lời/flag, sai −15. Không phạt vì thiếu thẻ hoặc chưa mở câu.

### E3. Credibility và checkpoint

[GAMEPLAY — P/R] Khởi đầu 100; Phase 1 không đổi. Present sai −15; Final nộp sai −20 một lượt, không mỗi slot; `max(0, điểm − phạt)`. Không thưởng/khôi phục tự động. Checkpoint đầu Phase 3 và trước Deduction lưu đúng điểm hiện tại. Về 0 mở Bad Ending mất khả năng tiếp tục điều tra và tải checkpoint, không tự thêm thám tử chết.

### E4. Gates và quay lại

| Gate | Điều kiện đã duyệt |
| --- | --- |
| Phase 1 → 2 | Ghi đủ lời đầu bốn NPC; cảnh sát đến sau lượt hỏi đủ, không timer thật. Không yêu cầu hỏi tùy chọn |
| Phase 2 → 3a | Đã Inspect/lưu năm ID: EV_LooseLock, EV_NeckScratches, EV_Inhaler, EV_RentReceipt, EV_MissingWatch; chọn rời hiện trường; quyền quay lại đã mở |
| Vòng Minh 2 trở đi | Bảy ID vụ án có đủ: bổ sung EV_WetTowel/EV_InhalerBox bằng Inspect nếu đã bỏ; không tự cấp thẻ |
| Kiểm tra đồ/gói R | Làm rõ lời Hòa/Linh, hỏi Hào, đề nghị kiểm tra từ nghi vấn thuốc; cảnh sát cung cấp mảnh hộp |
| Thu ống cũ | Mảnh hộp bác phủ nhận Minh; nhận từng phần, Press vị trí; cảnh sát tìm/đối chiếu |
| 3a → 3b | Gửi mẫu và chuyển thời gian rõ, quay lại khi có báo cáo đủ phạm vi; tái dùng bối cảnh |
| Mở Final | Đủ gói R/lời nhận hành vi/cưỡng ép; các vai khác được làm rõ, báo cáo nguyên nhân đủ |
| Phase 3 → 4 | Final đúng; mở kết chương/lời về con tin/nguồn cung; giữ phần chưa kiểm chứng |
| Kết Ch1 | Xu + ảnh giấy khen lưu qua hotspot hoặc fallback, không giải hộ ý nghĩa chữ ký |

[GAMEPLAY — R] Quay lại 204 trong Phase 3a để đọc/Inspect trong phạm vi cho phép. Vật đã thu mở ảnh hồ sơ, không spawn lại. Sau chuyển thời gian dùng hồ sơ thay hiện trường nguyên trạng giả. NPC có thể hỏi tự do; vòng cuối Minh khóa theo dữ kiện, không theo thời gian thật.

### E5. Final Deduction

| Slot | Đáp án đã duyệt | Phạm vi chứng minh |
| --- | --- | --- |
| WHO | Minh trực tiếp tráo | Mảnh hộp + nhận + thu ống cũ |
| WHAT | Lấy ống cũ, đặt ống có nội dung khác thuốc nhãn | Hai ống + báo cáo + nhận |
| WHEN | Khi Tùng rửa mặt, trước Minh rời/Hòa vào; actual 20:50–20:54 giữ trong metadata tác giả | Slot theo quan hệ sự kiện đã nhận. Không ép người chơi chọn khoảng phút mà NPC chưa nói và không có nguồn độc lập |
| WHY | Bị ép; kẻ ép chưa rõ; P4 mở nợ/con tin | Lời khai cần điều tra tiếp |
| EVIDENCE | Mảnh hộp, ống cũ, báo cáo, lời nhận kiểm chứng | Ba slot vật lý và một lời nhận |

[GAMEPLAY — R] Người chơi chọn/ráp, không NPC giải hộ; không buộc chọn một phút chưa biết. Bộ ống+hộp+timeline Linh không còn đủ tự kết Minh.

### E6. Giới hạn triển khai

[GAMEPLAY — P/R] React + Phaser 3, Spring Boot Java, MySQL; ba sinh viên/ba kỳ. Ba tháng là slice Ch1, không toàn game; nhãn Unity trong F ngừng áp dụng. Background tĩnh, portrait/biểu cảm, audio, hotspot, Notebook/Deduction. Không thêm CCTV, hack điện thoại, mô phỏng pháp y hoặc nhân vật có sprite cho gói R. Chuyển thời gian/ảnh đối chiếu/pop-up tái dùng UI.

[GAMEPLAY — P] users/game_saves/evidence_master/bug_reports, JWT/REST/JSON, Admin, hybrid localStorage/offline giữ nguyên. [UNKNOWN] Schema save đầy đủ, hòa giải offline/server, chi tiết RBAC và phân tích hoàn thành chưa nằm trong repair. Ch5 có Flashback/so chữ ký, không đưa cơ chế đó vào Ch1.

## F. FORESHADOWING TRACKER

| Manh mối | Gieo và ý nghĩa thật | Người chơi được biết theo nguồn | Payoff và điều chưa có |
| --- | --- | --- | --- |
| Đồng xu mốc giới | [CANON — S Ch1] Thẻ mạng lưới được cấp Tùng; hình giống vết máu quá khứ | [GAMEPLAY — R] Thu qua cảnh sát ở Phase 2 hoặc fallback Phase 4; công dụng lời khai mở ở Phase 4, không Phase 1 | [GAMEPLAY — S/R] Dưới nệm, bắt buộc lưu trước hết Ch1; Ch5 ráp mạng lưới |
| MG-07 | [CANON — S Ch2] Lâm ghi từ nguồn giao hàng trong hàng loạt bí mật, phác khu giải tỏa | [CANON] Hướng nghi ban đầu có thể sai; không phải động cơ giết Lâm | [GAMEPLAY — Ch5] Hệ thống trên diện rộng; [UNKNOWN] mã giải đầy đủ/thao tác/ID |
| Trâm gỗ | [CANON — S Ch3] Két Đạt cùng hồ sơ đất, vật nộp chứng minh xử lý; anh đẽo lúc 7 tuổi | [INFERENCE] Gợi em gái bị mang đi, phá niềm tin chết cháy | [GAMEPLAY — Ch5] Gia đình là mục tiêu, gợi em gái sống; [UNKNOWN] chứng cứ độc lập về sự sống/ai đưa đi |
| Vi phim | [CANON — S Ch4] Kiểm toán viên gửi ông Tư từ nhiều năm, cháy còn chữ ký | [CANON] Thám tử thấy nét quen chưa nhớ; không ép nhận ngay | [GAMEPLAY — Ch5] So khớp vật lý; [UNKNOWN] nội dung còn lại, vật cassette có quan hệ gì |
| Chữ ký Khang | [CANON — S Ch1] Giấy khen; Ch2–3 ảnh báo/hóa đơn; khuyên tròn đặc trưng | [CANON] Có thể đối chiếu ở Ch4 nếu đã chú ý, Ch5 có cơ hội thứ hai | [GAMEPLAY — P/R] EV_KhangCertificate lưu trước hết Ch1; phóng to/xoay/so Ch5; [UNKNOWN] phân bố mẫu Ch2–3 |
| Bài báo trắc địa | [CANON — S Ch1] Quá khứ công khai Khang từ trắc địa nghèo đến bất động sản | Color-text chưa có ý nghĩa lớn lúc đầu | [INFERENCE] Liên tưởng nghề trắc địa/mốc đất; không chứng minh giết người |
| Tờ khảo sát/thu gom | [CANON — S Ch1] Thu nợ/ép bán; Tùng cảnh báo | [GAMEPLAY — F] Môi trường tạo nghi Hòa/Hào/Linh | [CANON] Nối vùng quy hoạch K-Estate; [UNKNOWN] cách mở ý nghĩa thật |
| Vũ rải qua Ch1–3 | [CANON] Hào thuộc Vũ, khách bar, CCTV gặp Đạt trước vài tuần | Gieo hình đáng sợ; không phải thủ phạm các vụ Ch1–3 trực tiếp theo S | [CANON — Ch4–5] Có người trên hắn; hắn không biết hết quá khứ |
| Hồ sơ đất/bảo hiểm Đạt | [CANON — Ch3] Cố ý giữ phòng thân, gồm đất gia đình | Nối quá khứ với mục tiêu gia đình | [GAMEPLAY — Ch5] Ráp theory; [UNKNOWN] nội dung/giấy chứng minh cụ thể |
| Lời “người trên Vũ” | [CANON — Ch4] Thủ thư tiết lộ sau giằng xé | Chuyển nghi về tầng chỉ huy | [GAMEPLAY — Ch5] Kết hợp chữ ký, chưa độc lập nêu tên người truyền lệnh |
| Cassette/tọa độ | [CANON — Ch5] Dẫn thám tử về đất cũ | [UNKNOWN] Ai cung cấp, chương gieo, lúc thu | Flashback cuối; không tự đồng nhất cassette với vi phim |
| Báo cáo giả/báo động Tư | [CANON — Ch5] Đối chiếu báo cáo; báo động dẫn bắt Khang | [UNKNOWN] Nội dung báo cáo và chỗ gieo báo động | Cao trào cần giữ, chưa có cách kích hoạt cụ thể |
| Em gái/đường dây Ch1 | [CANON — Ch5] Lời Khang cuối đặt liên hệ | Ch3 có trâm; cuối mới có lời Khang | [UNKNOWN] Để mở nhận thức, đồng lõa hay chống nội bộ; không chốt twist phản diện |

[GAMEPLAY — R] Xu/giấy khen có fallback ghi nhận cụ thể trước kết Ch1; không ghi đã thu ở Phase 1. Các vật Ch2–5 còn cần lộ trình riêng.

## G. CONTRADICTION REPORT

Đây là **nhật ký xử lý**, không còn danh sách yêu cầu chốt lại Chapter 1. Lỗi ở S/P/F gốc còn tồn tại trong bản nguồn chưa sửa; quyết định dưới đây là quy tắc vận hành đã duyệt. “Đã xử lý” nghĩa thiết kế đã chốt, không nghĩa game đã được lập trình/test.

| ID | Điểm cũ | Trạng thái hiện tại theo lời duyệt |
| --- | --- | --- |
| G01 | Minh rời 20:50 hay trước 21:00 | Đã xử lý: actual khoảng 20:54; lời đầu chỉ trước 21:00 |
| G02 | Tráo/rửa hai khoảng | Đã xử lý: tráo 20:50–20:54 khi rửa; slot quan hệ sự kiện |
| G03 | Bồn trong phòng/phòng trống | Đã xử lý: vách/rèm, Hòa không thấy khu bàn không đồng nghĩa cả phòng trống |
| G04 | 21:55/20:55 | Đã xử lý: 20:55 |
| G05 | Dưới nệm/túi | Đã xử lý: dưới nệm |
| G06 | Bàn/sàn | Đã xử lý: dùng ở bàn, gục sàn cạnh giường, không di chuyển xác |
| G07 | 21:00 không nguồn | Đã xử lý: bỏ verified; chỉ giờ chứng kiến theo Linh |
| G08 | Chỉ quan sát nhưng lấy vật | Đã xử lý: cảnh sát xử lý/chụp, Present hồ sơ |
| G09 | Ảnh không nguồn | Đã xử lý: nguồn cảnh sát, ghi sau hành động |
| G10 | Gate thiếu khăn/hộp | Cập nhật theo yêu cầu mới: năm thẻ mở Phase 3, hai thẻ bổ sung có đường quay lại và gate riêng trước vòng Minh |
| G11 | Tám ID/sáu thẻ | Đã xử lý: mỗi ID một thẻ, thẻ bổ sung riêng |
| G12 | Hòa trộm là ngoại phạm | Đã xử lý: không loại chỉ bằng tiền; cần chuỗi cá nhân Minh |
| G13 | Linh trộm là ngoại phạm | Đã xử lý: như G12, giữ phạm vi chứng kiến |
| G14 | Hào giờ tự khai là ngoại phạm | Đã xử lý: đối chứng lượt 203, không ngoại phạm toàn đêm |
| G15 | Bộ cuối không chỉ Minh | Đã xử lý: gói R + lời nhận kiểm chứng |
| G16 | Hộp mới là tráo độc | Đã xử lý: nghi vấn trước kiểm tra, báo cáo sau |
| G17 | Vết cào là pháp y | Đã xử lý: quan sát trước, nguồn chuyên môn sau |
| G18 | Thu nợ hay trộm | Đã xử lý: lấy vượt nợ, giấy chỉ khoản nợ; Hòa không xác nhận Tùng sống |
| G19 | Nhận mơ hồ | Đã xử lý: nhận từng phần, kiểm chứng, nhận hành vi/cưỡng ép; không xác nhận mọi bào chữa |
| G20 | Chưa Phase 4/động cơ | Đã chốt phạm vi kết: nợ/con tin/khảo sát/thẻ, nguồn cung tiếp tục kiểm; chưa viết Phase 4 |
| G21 | Unity/Phaser | Đã xử lý: React/Phaser, slice ba tháng |
| G22 | Tab Unknown | Đã xử lý: trạng thái trong Evidence |
| G23 | Thiếu mẫu Ch1 | Đã xử lý: EV_KhangCertificate hotspot/fallback cuối Ch1 |
| G24 | Em gái chết khách quan | Đã xử lý: niềm tin ban đầu, không xác nhận số phận ở Ch1 |
| G25 | Kết luận cảnh sát quá sớm | Đã xử lý: giả thuyết ban đầu |
| G26 | Xu không liên quan/động cơ | Đã xử lý: không chỉ người tráo, liên quan tổ chức, mở lời khai P4 |
| G27 | Present tổ hợp | Đã xử lý: tuần tự |
| G28 | Phạt/gate/checkpoint thiếu | Đã xử lý tại E, Phase 1 không phạt |
| G29 | Thủ đoạn Ch2–4 thiếu | Hoãn có chủ ý, [UNKNOWN] vẫn giữ |
| G30 | Cassette/báo động/mẫu sau thiếu setup | Hoãn có chủ ý; mẫu Ch1 đã xử lý riêng G23 |
| G31 | Khang hiện diện đêm cũ chưa chứng minh | Hoãn có chủ ý, [UNKNOWN] vẫn giữ |
| G32 | Tên tệp/bản lặp | Đã xử lý: bảng nguồn + nhật ký duyệt; không coi bản lặp là nguồn mới |

## H. Việc còn lại và ranh giới sáng tác

### H1. Chapter 1 đã được duyệt logic

Không hỏi lại D01–D18. Lời duyệt được áp dụng cho phương án khuyến nghị, bao gồm gói chứng cứ và giới hạn của nó. Tiếp tục viết Phase được yêu cầu theo Bible này. Nguồn S/P/F chưa chỉnh, nên dẫn sự khác biệt ở nhật ký G thay vì coi lỗi cũ là chặn sáng tác.

[UNKNOWN] Tên nhà cung cấp/người giao, chỗ giam con gái, mức biết độc tính Minh, giờ chết cụ thể, timestamp tráo độc lập chưa có. Kịch bản phải giữ đúng mức biết hoặc ghi câu khai theo nguồn, không tự bịa. Không dùng chúng để tạo câu kết đã xác minh ở Phase 2/3.

### H2. Những việc để các giai đoạn sau

- G29–G31: thủ đoạn/ngoại phạm Ch2–4, ý nghĩa đầy đủ MG-07, nguồn cassette, báo động Tư, báo cáo giả và bằng chứng hiện diện Khang.
- Lộ trình mẫu chữ ký Ch2–3, mức liên quan em gái, nhân vật chưa nêu tên/tuổi/ngoại hình.
- Phase 2/3 đã có bản thảo theo yêu cầu mới, chờ người thiết kế duyệt văn bản; Phase 4 chưa viết. Không xem đặc tả/tài liệu kiểm tra đường đi là game đã được test.

### H3. Quy tắc Phase 1 đang viết

[GAMEPLAY — M và yêu cầu hiện tại] Mở 21:35 tại 201, nhìn 204 từ cửa; Hòa/Linh/Hào có mặt, Minh tới từ cầu thang sau cuộc gọi; thu bốn lời đầu. Cho lựa chọn thứ tự và hỏi làm rõ bề mặt, không kết tội/đối chất. Quan sát dép Hòa, túi áo, cổ tay/trang điểm Linh, vị trí Hào, ánh nhìn Minh nhưng chưa kiểm chứng nguyên nhân. Cảnh sát đến cuối và mở Phase 2; Phase 2/3 viết trong các tài liệu riêng theo yêu cầu mới.

[GAMEPLAY — M] Ngôi “bạn”, văn cảnh Việt Nam, không đọc nội tâm NPC. Hành vi/giọng là sáng tác văn học được phép khi không bổ sung chứng cứ quyết định. Mã node/statement/observation của bản triển khai không tự trở thành Evidence hoặc sự thật mới của vụ án.


## I. QUYẾT ĐỊNH SAU AUDIT PHASE 1

[GAMEPLAY — người thiết kế duyệt “chốt sửa theo proposed fix”] ML-P1-01–08 được chấp thuận. Cách triển khai cụ thể chọn phương án ít thay đổi: schema snake_case chung với flags Boolean; hỏi tên Hào trong node hiện có; hiển thị khoảng ở giờ Minh; Player Timeline chỉ ghi cảnh sát tới sau hỏi; giữ nhánh Linh sắc thái; không đổi Canon án mạng. Phase 1 bản 1.2 là bản áp dụng.

| Audit ID | Quy tắc đã chốt |
| --- | --- |
| ML-P1-01 | Schema version 2, `current_phase/current_node/evidence_collected`, Boolean ở `flags`; adapter/migrate khóa cũ theo G3 Phase 1 |
| ML-P1-02 | Trước tự giới thiệu, UI là Người đàn ông; sau câu “Hào” mới ghi tên People |
| ML-P1-03 | Minh đến “khoảng 20:45”; giữ precision estimated, không coi phút độc lập |
| ML-P1-04 | 21:45 là actual nhịp thiết kế; Player Timeline chỉ sau lượt hỏi, không thêm đồng hồ |
| ML-P1-05 | Lời đứng hiện tại không làm ngoại phạm; lượt 21:20 phải hỏi/đối chứng riêng ở Phase 3 |
| ML-P1-06 | Chưa hỏi rửa mặt ở P1 thì Press mở cùng ST_P1_MINH_WASH trước khi dùng |
| ML-P1-07 | LINH_03 là nhánh sắc thái; giữ tên cờ lịch sử linh_reassured, không hệ thiện cảm |
| ML-P1-08 | Văn phong đã gọt trong 1.1, tiếp tục giữ trong 1.2 |

[GAMEPLAY — yêu cầu trực tiếp Phase 2 mới] Năm thẻ mở lối ra, không tự chuyển khi thẻ thứ năm thu. Khăn/hộp cần ở Phase 3 có đường bổ sung bằng phòng 204 trước time skip; vòng cần dữ kiện khóa rõ nếu thiếu, không phạt. Sau time skip chỉ đọc hồ sơ đã ghi. Không mặc định thu xu/giấy khen/khảo sát. Xu và giấy khen có fallback Phase 4 trước kết Ch1; Phase 4 chưa viết trong lượt này.

[GAMEPLAY — R được duyệt, không phải bằng chứng mới chưa duyệt] Gói EV_PackagingMatch/EV_OriginalInhaler/EV_MedicineAnalysis vẫn có hiệu lực. Hào được đối chứng lời người 203 qua cảnh sát, dùng Statements/Timeline, không cấp thẻ biên nhận mới. Báo cáo phải có phần liên hệ nạn nhân; nếu chỉ có phân tích ống, gate nguyên nhân và Final không mở. Chưa chốt chất cụ thể/liều, tên nơi kiểm tra, phút trả kết quả hoặc lời người 203 ngoài phạm vi lượt thu nợ.

## J. PHASE 4 ĐƯỢC CHỌN VÀ GÓI TOÀN CHAPTER 1

[CANON/GAMEPLAY — quyết định người thiết kế ngày 10/10/2026] Lời “nếu phase 4 chưa chọn thì cứ theo proposal fix” cho phép áp dụng các khuyến nghị trong CHAPTER_1_PHASE_4_PROPOSALS.md: A + S1 + S2 và mặc định Decision Sheet. Đây là nguồn quyết định mới; không giả nhận rằng S/P/F đã có cuộc kể của Linh hoặc kiến thức loại thẻ của Hào.

- [CANON — theo quyết định] Hào từng gặp loại xu do công việc thu nợ, biết nó là thẻ nhận diện người làm khảo sát trong mạng lưới. Hắn chỉ nhận loại; chưa xác nhận người cấp cho Tùng, không khai lãnh đạo hoặc tên Vũ trong Phase 4.
- [CANON — theo quyết định] Tùng đã kể với Linh công việc khảo sát dưới danh tiện ích thực chất nắm người nợ/dễ bị ép ký giấy; công được trừ vào nợ. Linh là một người được anh dặn đừng ký giấy chưa rõ mục đích. Cuộc kể trước vụ án chưa ngày/phút. Nội dung S giữ nguyên; nguồn truyền đạt S2 mới được chọn.
- [GAMEPLAY] Người chơi tiếp nhận các phần ấy theo lời Hào và lời Linh thuật Tùng; chưa độc lập chứng minh mọi cấp mạng lưới. Minh chỉ khai nợ và con gái bị giữ của bản thân; kẻ ép, người giao, nơi con tin, tên công ty và mức biết độc tính còn UNKNOWN.
- [GAMEPLAY] Khảo sát chưa xem có đường xem ảnh do cảnh sát cung cấp; vẫn observation/People, không EV_Survey. Đồng xu và giấy khen có fallback theo ID cũ và collected_phase thực tế. Không hồi tố đã thu ở Phase 2.
- [GAMEPLAY] Phase 4 hỏi/đọc hồ sơ, không Present hoặc phạt mới. Cảnh nhận hình xu chạy chỉ sau người chơi mở ảnh; ký ức giống vết máu không xác định số phận em gái.
- [GAMEPLAY] Kết Ch1 cần nợ/con tin được ghi; S1/S2 và cảnh báo đã ghi; ảnh xu/giấy khen thực có; nhận hình; giữ trạng thái Claimed/Indirect. Chapter 2 mở bằng editorial title, chưa cuộc hẹn Lâm hoặc MG-07.
- [CANON] Không đổi Minh/thời gian actual/hung thủ/động cơ S. Không giải cứu con, tuyên án hoặc mở lãnh đạo toàn mạng lưới ở cuối Ch1.

CHAPTER_1_PHASE_4.md là bản triển khai theo chỉ thị này. Các dòng trước nói “Phase 4 chưa viết/chưa chọn” là trạng thái lịch sử, được mục J cập nhật. Gói mới gồm Phase 1, 2, 3, Final Deduction, Phase 4; không tự viết kịch bản Ch2–5.

[GAMEPLAY — kỹ thuật] ID People triển khai dùng PEO_HOA/PEO_LINH/PEO_HAO/PEO_MINH/PEO_TUNG để nối bốn tab; checkpoint kỹ thuật ch1_phase3_start và ch1_pre_final; liên kết kết luận lưu deduction.result và TL_P3_SWAP. Chúng là quy ước dữ liệu được chọn khi đóng gói, không manh mối hoặc dữ kiện mới. Assets/hotspot rect vẫn cần khớp demo thực.
