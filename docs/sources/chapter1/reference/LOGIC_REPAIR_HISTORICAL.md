# Chapter 1 Logic Repair

**PHASE 0.5 — Hồ sơ đề xuất để người thiết kế phê duyệt**

Dự án: **2D Detective Visual Novel & Investigation Puzzle System**.

Khuyến nghị chính: giữ Minh là người tráo ống hít vì bị cưỡng ép, nhưng đổi cấu trúc phá án thành **nghi vấn → phát hiện lời dối về việc chạm thuốc → chứng cứ liên hệ với Minh → lời nhận có kiểm chứng → Final Deduction**. Không kết luận Minh là người duy nhất có cơ hội từ những dữ kiện hiện có.

**Chưa đề xuất nào được phê duyệt.** Tài liệu này không thay thế hoặc sửa Story Bible, Story, Project hay Phase. Các timeline, Evidence ID bổ sung, câu khai ở dạng nội dung và luật mới bên dưới đều là **[PROPOSAL]**. Không có tiểu thuyết hoặc hội thoại hoàn chỉnh.

## Cơ sở đối chiếu

Đọc lại bản hiện tại `STORY_AND_GAMEPLAY_BIBLE(1).md` và ba nguồn: `Story(1).txt` (S), `Project(2).docx` (P), `Phase(1).docx` (F). Tên trên là tên tệp thực tế, tương ứng Story.txt, Project(1).docx, Phase.docx trong yêu cầu. Dẫn đoạn F/P dùng thứ tự đoạn thân DOCX như Bible; không phải số trang. P có bản báo cáo lặp, không phải hai nguồn độc lập.

Giữ nhãn của Bible: [CANON], [GAMEPLAY], [INFERENCE], [PROPOSAL], [CONFLICT], [UNKNOWN]. Thêm **[INSUFFICIENT EVIDENCE]** cho kết luận chưa có đủ chứng cứ dành cho người chơi. Mục này đánh giá dữ kiện hiện tại hoặc giới hạn của phương án; không có nghĩa phải đổi hung thủ.

Các yếu tố cố định theo yêu cầu: Minh thực hiện; động cơ cưỡng ép/nợ/con gái bị giữ; Tùng tham gia khảo sát thu gom rồi cảnh báo người trọ; bí ẩn K-Estate và sự liên hệ quá khứ; Hòa/Linh/Hào không phải người giết Tùng theo canon tổng thể. **Điều cố định với tác giả vẫn phải có đường khám phá hợp lý cho người chơi.**

## 1. Phân loại G01–G32

Phân loại theo mức ảnh hưởng tới việc viết một Chapter 1 có thể chơi hoàn chỉnh. “Nên sửa” không có nghĩa được bỏ nếu cảnh sử dụng chi tiết ấy. G23/G24/G26 có payoff tương lai nhưng phần gieo ở Ch1 phải xử lý ngay; không đẩy toàn bộ sang Ch5.

| Nhóm | Problem ID | Lý do |
| --- | --- | --- |
| **A — Bắt buộc sửa trước khi viết** | G01, G02, G03, G04 | Timeline gặp/rời/tráo, vị trí rửa mặt, câu giờ sai |
| A | G05, G06, G07 | Hotspot đồng xu, vị trí xác, mốc lên cơn không có nguồn |
| A | G10, G11 | Gate có thể thiếu vật cần dùng, số thẻ/ID sai |
| A | G12, G13, G14, G15, G16, G17 | Loại nghi phạm và kết luận nguyên nhân/thuốc vượt chứng cứ |
| A | G19 | Nội dung nhận hành vi và kết luận thú nhận không khớp |
| A | G23, G24, G26 | Gieo chữ ký/đồng xu, góc nhìn em gái, vai trò xu trong Ch1 |
| A | G27, G28 | Thao tác Present, gate/phạt/checkpoint ảnh hưởng nhánh gameplay |
| **B — Nên sửa** | G08, G09 | Quyền quan sát/thu vật và nguồn ảnh; phải sửa trước khi viết cảnh Present dùng chúng |
| B | G18, G20, G25 | Việc lấy tiền, lượng thông tin kết chương, kết luận cảnh sát |
| B | G21, G22, G32 | Engine/scope, bốn tab, quản lý phiên bản nguồn |
| **C — Có thể để sau** | G29, G30, G31 | Thủ đoạn Ch2–4, setup cassette/báo động, chứng minh hiện diện Khang cuối game |

**Tổng:** A = 21, B = 8, C = 3; đủ 32 ID, mỗi ID ở một nhóm. [PROPOSAL] Khi viết, khóa các cảnh chạm mục B chưa được quyết định; phần C chỉ giữ hồ sơ việc cần làm, không bổ sung sự kiện vào Ch1.

## 2. Hai hướng sửa tổng thể

| Hướng | Nội dung [PROPOSAL] | Ưu điểm | Nhược điểm |
| --- | --- | --- | --- |
| **A — Thay đổi ít nhất** | Sửa giờ/bố cục/gate; thám tử chỉ dựng giả thuyết; Minh nhận hành vi, chỉ vị trí giấu ống cũ để cảnh sát thu và kiểm tra; xác minh hóa chất ở đoạn kết | Ít thêm UI; giữ phần lớn cấu trúc F | Trước thú nhận, khó phân biệt Minh với Hòa/Linh; Final Deduction phải là kết luận tạm thời hoặc đặt sau xác minh; không đạt mục tiêu suy luận cá nhân mạnh |
| **B — Tối ưu vừa đủ cho detective gameplay, AI khuyến nghị** | Sửa như A, thêm 3 thẻ: liên hệ vỏ hộp với đồ Minh giữ, ống cũ thu theo chỉ dẫn, kết quả kiểm tra thuốc sau một chuyển thời gian | Có Present thực sự bác câu dối; có chứng cứ hỗ trợ thú nhận; không cần CCTV/nhân vật mới/cơ chế mới | Thêm dữ kiện, ảnh cận và phần đối chất tiếp sau chuyển thời gian; vẫn cần thú nhận để chốt giờ và cưỡng ép |

[PROPOSAL] **Chọn B với mức chứng minh là lời nhận được kiểm chứng và vật chứng hỗ trợ**, không tuyên bố giải được mọi phút/loại mọi khả năng đồng phạm chỉ từ timeline. Nếu muốn một bài toán loại trừ tuyệt đối trước thú nhận, phải thiết kế thêm hệ chứng cứ tiếp cận phòng trong cả khoảng trước cơn; đó là gói lớn hơn và không được khuyến nghị cho slice đầu.

### 2.1 Gói dữ kiện mới R dành cho phương án B

Toàn bộ gói R chưa có trong nguồn. Các mã dưới đây chỉ là **ID dự kiến**, giữ nguyên 8 ID hiện có, không đổi tên chúng.

| Mã dự kiến [PROPOSAL] | Nội dung và nguồn trong thế giới game | Mở khi nào | Chứng minh được | Không đủ chứng minh |
| --- | --- | --- | --- | --- |
| `EV_PackagingMatch` | Trong quy trình kiểm tra đồ do cảnh sát thực hiện với các bên liên quan, Minh giao áo khoác/đồ mang theo; túi áo có mảnh nắp giấy rời. Cảnh sát ghi nhận, chụp và đối chiếu mép rách với `EV_InhalerBox`; mảnh ghép khớp hình dạng, họa tiết và mép rách | Sau lượt hỏi đầu Phase 3; người chơi biết nguồn hai mảnh trước khi Present | Minh có liên hệ vật lý cụ thể với hộp thuốc đã ở 204; bác phủ nhận chưa từng xử lý hộp/thuốc | Không tự chứng minh giờ bóc, chất trong ống, chủ ý giết; có thể từng xử lý hộp vì lý do khác |
| `EV_OriginalInhaler` | Sau khi bị bác lời phủ nhận, Minh nhận đã mang ống cũ ra và chỉ một hốc khuất ở chân cầu thang tầng trệt. Cảnh sát tìm đúng chỗ, ghi nhận ống cũ có nhãn cá nhân Tùng, đối chiếu hồ sơ cấp thuốc tìm trong đồ Tùng; cả dữ liệu đối chiếu nằm trong thẻ này | Trước lời nhận cuối, sau lời nhận từng phần | Kiểm chứng một chi tiết Minh cung cấp trước khi cảnh sát tìm; ống cũ của Tùng đã được mang khỏi vị trí thường dùng | Nhãn một mình không chứng minh hết quyền sở hữu; phải có bước đối chiếu. Ống cũ một mình không chỉ ra ai chuẩn bị hóa chất |
| `EV_MedicineAnalysis` | Bản kết quả do cảnh sát cung cấp sau khi các ống được thu và gửi kiểm tra: ống trên bàn chứa chất không phải thuốc ghi trên nhãn, thuộc nhóm hóa chất vệ sinh; ống cũ phù hợp thuốc được cấp. Phần kiểm tra nạn nhân, khi có, xác nhận liên hệ tử vong với chất trong ống trên bàn | Sau chuyển thời gian có ghi rõ; trước Final Deduction kết án trong B | Thuốc trên bàn không đúng nội dung; kết hợp hai ống và lời nhận hỗ trợ hành vi thay ống; kết quả về nạn nhân mới hỗ trợ nguyên nhân chết | Không tự chỉ Minh hoặc nhà cung cấp cụ thể; không suy ra công ty nào chỉ từ nhóm hóa chất |

[PROPOSAL] Mảnh giấy nằm trong đồ Minh là **phát hiện kiểm tra**, không phải thám tử tự lục túi. Đặc tả đây là quy trình trong thế giới game, không tuyên bố một quyền pháp lý ngoài đời. Cảnh sát ghi nhận người giao đồ và nguồn vật; người chơi không cầm vật thật.

[PROPOSAL] Không cần mini-game ghép mảnh mới: một ảnh so sánh do cảnh sát cung cấp và Present vào câu phủ nhận là đủ. Có thể thêm phóng to UI ảnh đã có; không xây mô phỏng pháp y.

[PROPOSAL] Không có kết quả hóa chất tức thì lúc vừa nhìn hiện trường. Chuyển thời gian sang phiên đối chất tiếp theo **sau khi có kết quả**, không ấn định chắc chắn sáng hôm sau. Dùng lại background hành lang/phòng 204, hình nền đổi ánh sáng hoặc chữ thời gian. Cảnh sát hẹn các bên tham gia phiên tiếp; không tự kể việc giữ họ cả đêm hay một thủ tục bắt giữ chưa thiết kế.

[INSUFFICIENT EVIDENCE] Nếu mới có kết quả về chất trong ống mà chưa có kết quả liên hệ với nạn nhân, chỉ được chốt hành vi thay bằng chất khác; chưa chốt độc chất là nguyên nhân chết. Gate kết luận nguyên nhân phải chờ đủ nội dung R, hoặc để nguyên nhân trong trạng thái chưa xác nhận.

## 3. Phương án theo từng vấn đề quan trọng

Các Scene được gọi P1 (thu lời khai hành lang), P2 (Inspect 204), P3a (đối chất lượt đầu), P3b (đối chất sau kết quả), P4 (kết chương). P3a/P3b là hai đoạn trong Phase 3, không bắt buộc tạo hai Phaser Scene mới. Các nội dung câu khai chỉ là ý nghĩa cần thiết kế, không phải hội thoại hoàn chỉnh.

### G01 Giờ Minh đến và rời

- **Mâu thuẫn/ảnh hưởng:** F p031/p034/p053 rời trước/gần 21:00, p043 gán 20:45–20:50; phá khoảng cơ hội.
- **A [PROPOSAL]:** giữ tới 20:45, rời khoảng 20:50; đổi tất cả câu giờ theo đó. **Ưu:** ít sửa Notebook. **Nhược:** phải dời lại khoảng khăn/tráo của G02.
- **B [PROPOSAL]:** tới 20:45, rửa mặt 20:50–20:55, tráo trong 20:50–20:54, rời 20:54. Người chơi ban đầu chỉ ghi “trước 21:00”. Hòa bổ sung thấy Minh đi xuống cầu thang ngay trước lần vào 20:55; lời nhận Minh giúp thu hẹp sau.
- **Ưu/nhược B:** giữ khoảng rửa F, có thứ tự sự kiện; thêm lời nhận và vẫn không có đồng hồ độc lập xác minh 20:54.
- **AI khuyến nghị: B.** Giờ phút chính xác là actual đề xuất, không bắt người chơi đoán 20:54 từ khăn.
- **Ảnh hưởng:** P1/P3; Statements Minh/Hòa; Timeline; slot WHEN.

### G02 Khoảng tráo không khớp rửa mặt

- **Mâu thuẫn/ảnh hưởng:** F p074 là 20:50–20:55, p208 là 20:45–20:50; đáp án game sai với cơ hội được kể.
- **A [PROPOSAL]:** đổi mô tả khăn thành 20:45–20:50, giữ slot cũ. **Ưu:** ít đổi đáp án. **Nhược:** khăn vẫn không định giờ.
- **B [PROPOSAL]:** theo G01-B, tráo khi Tùng sau vách rửa mặt; slot WHEN là “lúc Tùng rửa mặt, trước Minh rời và trước Hòa vào”. Chỉ hiển thị khoảng 20:50–20:54 sau lời nhận phù hợp.
- **Ưu/nhược B:** hỏi quan hệ sự kiện thay vì đoán phút; cần đổi slot và dữ liệu timeline.
- **AI khuyến nghị: B.**
- **Ảnh hưởng:** P2/P3, `EV_WetTowel`, Timeline, Final Deduction.

### G03 Bồn trong phòng nhưng phòng trống

- **Mâu thuẫn/ảnh hưởng:** F p070 bồn góc 204, p074/p164 nói vắng cả phòng; không xác định được ai nhìn thấy ai.
- **A [PROPOSAL]:** giữ bồn góc và sửa “phòng trống” thành “không thấy Tùng ở bàn”. **Ưu:** không đổi nền. **Nhược:** Tùng có thể thấy/nghe việc tráo nếu không có vật chắn.
- **B [PROPOSAL]:** bồn ở góc 204 sau vách/rèm có sẵn trong bản nền sửa; tầm nhìn từ cửa/bàn không thấy người đang rửa mặt. Hòa lấy tiền trong khu bàn, không tìm toàn phòng; Linh thấy Tùng đi từ bàn về mép giường, không nói quay lại từ ngoài.
- **Ưu/nhược B:** một sửa ảnh nền giải thích tầm nhìn; không phải ngoại phạm và không chứng minh Tùng không nghe tiếng.
- **AI khuyến nghị: B**, không thêm chuyến ra ngoài rồi quay lại kéo dài mười phút.
- **Ảnh hưởng:** nền P2; `EV_WetTowel`; lời Hòa/Linh/Minh.

### G04 Câu mười giờ kém năm

- **Mâu thuẫn/ảnh hưởng:** 21:55 trái giấy 20:55 và sau mở cảnh 21:35.
- **A [PROPOSAL]:** sửa thành 20:55/chín giờ kém năm. **Ưu:** sửa một câu. **Nhược:** không tạo puzzle mới.
- **B [PROPOSAL]:** để Hòa cố ý khai sai giờ, người chơi Present giấy để sửa lần nữa. **Ưu:** thêm lượt phản bác. **Nhược:** trùng bài học nói dối, không cần cho vụ án.
- **AI khuyến nghị: A.** Không biến lỗi biên tập thành lời dối mới.
- **Ảnh hưởng:** P3a Hòa, `EV_RentReceipt`, Timeline.

### G05 Vị trí đồng xu

- **Mâu thuẫn/ảnh hưởng:** S dưới nệm; F túi áo/túi quần; hotspot không thể có ba nơi.
- **A [PROPOSAL]:** giữ túi quần theo mô tả hình F, sửa S và tiêu đề F. **Ưu:** ít sửa hotspot. **Nhược:** đổi chi tiết S, cần thao tác khám thi thể.
- **B [PROPOSAL]:** giữ dưới nệm theo S; cảnh sát phát hiện khi kiểm tra giường, cho thám tử ghi/chụp hình được cung cấp. Người chơi kích hoạt việc ghi nhận qua hotspot giường ở P4 nếu chưa Inspect trước.
- **Ưu/nhược B:** giữ canon vật ẩn, tôn trọng cảnh sát; thêm một bước cuối nhưng không cần animation nhấc nệm.
- **AI khuyến nghị: B.**
- **Ảnh hưởng:** P2/P4, `EV_BoundaryCoin`, mô tả nguồn và ảnh hotspot.

### G06 Thi thể trên bàn hay sàn

- **Mâu thuẫn/ảnh hưởng:** S gục bàn, F sàn cạnh giường; lời Linh/tầm nhìn hiện trường thay đổi.
- **A [PROPOSAL]:** chọn sàn cạnh giường, sửa một mô tả S. **Ưu:** giữ phần lớn F và ảnh nền. **Nhược:** phải đổi S có chủ ý.
- **B [PROPOSAL]:** Tùng dùng thuốc ở bàn rồi loạng choạng/gục sàn cạnh giường; Linh chứng kiến đoạn cuối. **Ưu:** hợp nhất bàn có thuốc và xác ở sàn. **Nhược:** thêm hành động nhỏ, không được dùng để xác nhận nguyên nhân y khoa.
- **AI khuyến nghị: B**, vị trí phát hiện cuối luôn là sàn; sửa S tương ứng, không thêm người di chuyển xác.
- **Ảnh hưởng:** mở P1, nền P2, `EV_NeckScratches`, lời Linh, Story Ch1.

### G07 Mốc lên cơn 21:00

- **Mâu thuẫn/ảnh hưởng:** thám tử đưa giờ không có chứng cứ như xác nhận.
- **A [PROPOSAL]:** bỏ giờ 21:00; ghi Tùng khó thở “chậm nhất lúc Linh thấy, khoảng 21:05 theo lời cô”. **Ưu:** trung thực, không thêm vật. **Nhược:** actual chưa có phút bắt đầu.
- **B [PROPOSAL]:** thêm ghi âm/nhật ký thiết bị xác định giờ. **Ưu:** timeline cứng hơn. **Nhược:** thêm đạo cụ chỉ để định phút, dễ lấn bài học chứng cứ.
- **AI khuyến nghị: A.** Actual có thể đặt khoảng 21:03, nhưng Player Timeline không tự nhận phút ấy.
- **Ảnh hưởng:** P3, Timeline Linh, lập luận với Minh.

### G08 Quyền tiếp cận vật chứng

- **Mâu thuẫn/ảnh hưởng:** chỉ cho quan sát nhưng thám tử lấy giấy/khám túi; phá vai trò cảnh sát.
- **A [PROPOSAL]:** mọi Inspect là quan sát/chụp trong phạm vi cho phép; cảnh sát xử lý vật ngoài tầm nhìn. **Ưu:** ít câu dẫn, không đổi hệ UI. **Nhược:** cần giải thích ảnh cận.
- **B [PROPOSAL]:** thám tử yêu cầu kiểm tra hotspot, cảnh sát mở/thu/chụp; kết quả hiển thị như thẻ. **Ưu:** mạch thu rõ, dùng cho đồng xu và gói R. **Nhược:** thêm vài prompt ghi nhận.
- **AI khuyến nghị: B**, có thể biểu diễn bằng pop-up text, không cần nhân vật cảnh sát di chuyển.
- **Ảnh hưởng:** P2–P4; toàn bộ ảnh Evidence; Present Hòa; gói R.

### G09 Ảnh thùng rác chưa có nguồn

- **Mâu thuẫn/ảnh hưởng:** ảnh xuất hiện từ túi nhưng chưa được chụp.
- **A [PROPOSAL]:** thay bằng hình/phác ghi trong Notebook. **Ưu:** sửa ít. **Nhược:** chi tiết mép rách trong B cần ảnh rõ.
- **B [PROPOSAL]:** sau Inspect, cảnh sát chụp và cho ghi bản ảnh; Present hiển thị Notebook, không rút đạo cụ không nguồn.
- **Ưu/nhược B:** cùng đường xử lý tất cả ảnh; thêm metadata nguồn ảnh.
- **AI khuyến nghị: B**, đi cùng G08-B.
- **Ảnh hưởng:** P2 thùng rác, P3 `EV_InhalerBox`/`EV_PackagingMatch`.

### G10 Gate Phase 2 thiếu khăn và hộp

- **Mâu thuẫn/ảnh hưởng:** đủ năm vật có thể chuyển nhưng không đủ vòng Minh.
- **A [PROPOSAL]:** gate đủ bảy Evidence vụ án, thêm khăn và hộp. **Ưu:** không softlock, minh bạch. **Nhược:** phải Inspect đủ bảy.
- **B [PROPOSAL]:** vào Phase 3 sau năm vật, cho quay lại lấy thứ còn thiếu trước vòng cần. **Ưu:** tự do. **Nhược:** thêm gate và nhắc thiếu, dễ làm đối chất ngắt đoạn.
- **AI khuyến nghị: A**, vẫn cho quay lại để xem/tìm chi tiết phụ.
- **Ảnh hưởng:** flag chuyển P2→P3; bảy ID trừ đồng xu.

### G11 Số thẻ và số ID

- **Mâu thuẫn/ảnh hưởng:** tám ID nhưng mô tả sáu thẻ gộp/thiếu xu; save có thể sai.
- **A [PROPOSAL]:** mỗi ID một thẻ; bảy vụ án, một xu. **Ưu:** code và QA đơn giản. **Nhược:** thêm một thẻ trên UI so bản gộp.
- **B [PROPOSAL]:** vẫn hai ID nhưng hiển thị ống/hộp dưới một nhóm. **Ưu:** gọn UI. **Nhược:** mapping phức tạp hơn Present.
- **AI khuyến nghị: A.** Gói R thêm ba thẻ khi được duyệt; mẫu chữ ký có ID dự kiến riêng, không lẫn vào số tám nguồn.
- **Ảnh hưởng:** Notebook, evidence_master, save JSON, dữ liệu gate.

### G12 Loại Hòa bằng việc lấy tiền

- **Mâu thuẫn/ảnh hưởng:** vào 20:55 là cơ hội chạm thuốc, không phải ngoại phạm.
- **A [PROPOSAL]:** sau nhận lấy tiền chỉ chuyển trạng thái “đã làm rõ lời dối, chưa loại khỏi tráo”; chốt vai trò sau nhận Minh được kiểm chứng. **Ưu:** không thêm chứng cứ ngoại phạm. **Nhược:** phải đổi kết luận F.
- **B [PROPOSAL]:** dùng gói R làm liên hệ cá nhân Minh; Hòa chỉ được giảm nghi theo phần việc được chứng minh, không tuyên bố đứng ngoài toàn bộ thời gian.
- **Ưu/nhược B:** lời giải có bằng chứng cá nhân; không tạo ngoại phạm riêng cho Hòa và vẫn cần lời nhận cuối.
- **AI khuyến nghị: B kết hợp trạng thái thận trọng của A.**
- **Ảnh hưởng:** P3a Hòa, People/Timeline, P3b kết luận; giấy không đổi công dụng.

### G13 Loại Linh vì trộm đồng hồ

- **Mâu thuẫn/ảnh hưởng:** một tội được nhận không phủ định hành vi tráo; cô cũng vào được phòng.
- **A [PROPOSAL]:** giữ cô là người có cơ hội chưa loại, ghi cô chỉ thấy khó thở, không tự thêm đã thấy xịt thuốc. **Ưu:** không thêm cảnh. **Nhược:** không có ngoại phạm độc lập.
- **B [PROPOSAL]:** gói R chỉ về Minh, lời nhận + ống cũ kiểm chứng tạo căn cứ kết luận Minh là người tráo; đồng hồ chỉ chứng minh phần Linh.
- **Ưu/nhược B:** giải đúng vai evidence; không chứng minh tuyệt đối cô chưa từng chạm thuốc trước đó.
- **AI khuyến nghị: B với giới hạn A.** Không thêm câu Linh nhìn thấy tráo chỉ để giải bài.
- **Ảnh hưởng:** P3a Linh, `EV_MissingWatch`, Statement nhân chứng, P3b trạng thái.

### G14 Hào không có ngoại phạm được đối chứng

- **Mâu thuẫn/ảnh hưởng:** 21:20 tự khai bị gọi thành ngoại phạm; chưa biết giờ chết/hành vi chuẩn bị trước.
- **A [PROPOSAL]:** giữ giờ theo lời Hào, chỉ nói đến sau lúc Linh khai thấy triệu chứng; không xóa nghi chỉ bằng giờ này. **Ưu:** không thêm dữ kiện. **Nhược:** lệch ý “thời gian không khớp” nếu kể quá mạnh.
- **B [PROPOSAL]:** cảnh sát kiểm tra người phòng 203 và biên nhận đòi nợ của giao dịch, xác nhận lần hiện diện khoảng 21:20; dữ kiện nằm trong Statement bổ sung, không cần sprite mới. Chỉ loại vai gây cơn trực tiếp khi tới lần này; gói R/lời nhận Minh giải người tráo trước đó.
- **Ưu/nhược B:** giờ có đối chứng, giữ lý do xuất hiện; không chứng minh Hào không tới từ trước hoặc không liên quan mạng lưới.
- **AI khuyến nghị: B**, không viết “ngoại phạm tuyệt đối”.
- **Ảnh hưởng:** P3a Hào, People/Timeline, ghi nhận cảnh sát/người 203; không nêu Vũ qua một lời tự khai chưa có.

### G15 Bộ chứng cứ cuối không chỉ đích danh Minh

- **Mâu thuẫn/ảnh hưởng:** hộp+ống+timeline Linh chứng minh nhiều nhất nghi thay thuốc, không cá nhân.
- **A [PROPOSAL]:** thay bộ cuối bằng vật hiện tại + lời Minh nhận + thu ống cũ theo chỉ dẫn; kết luận cần xác minh thuốc. **Ưu:** ít bổ sung. **Nhược:** thú nhận gánh gần toàn bộ lời giải.
- **B [PROPOSAL]:** trước nhận cuối, người chơi Present liên hệ mảnh hộp bác phủ nhận; sau đó đối chiếu ống cũ và phân tích thuốc bác lý do thay bình thường; cuối ráp cả chuỗi.
- **Ưu/nhược B:** có việc người chơi phải làm trước nhận cuối; thêm ba thẻ và đoạn thời gian chờ.
- **AI khuyến nghị: B.** Không gán bộ ba cũ là bằng chứng chốt hạ.
- **Ảnh hưởng:** P3a/P3b, gói R, Final Deduction, Statement Minh.

### G16 Hộp mới không chứng minh thuốc bị tráo độc

- **Mâu thuẫn/ảnh hưởng:** suy từ hộp mới sang tráo gây chết bỏ qua thay hợp lệ.
- **A [PROPOSAL]:** mọi Inspect giữ “có thể thay mới”; chốt tráo theo lời nhận, hoãn độc chất. **Ưu:** sửa chữ. **Nhược:** kết án nguyên nhân chưa đủ.
- **B [PROPOSAL]:** `EV_MedicineAnalysis` + hai ống + lời nhận chứng minh nội dung khác nhãn và việc lấy ống cũ/đặt ống khác.
- **Ưu/nhược B:** phân biệt thay mới với thay độc; phải có chuyển thời gian/nguồn kiểm tra.
- **AI khuyến nghị: B.** Không dùng màu ống, mùi lạ hoặc chất rò để tự kết luận y khoa.
- **Ảnh hưởng:** P2 text hộp/ống, P3b báo cáo, WHAT/EVIDENCE.

### G17 Vết cào bị coi là kết luận pháp y

- **Mâu thuẫn/ảnh hưởng:** quan sát da cổ chưa loại mọi ngoại lực hay xác định hen.
- **A [PROPOSAL]:** đổi Inspect thành dấu vết “phù hợp vật vã khó thở, cần xác minh”. **Ưu:** không tăng scope. **Nhược:** không xác định nguyên nhân ngay.
- **B [PROPOSAL]:** kết luận chuyên môn có nguồn trong báo cáo gói R khi sẵn có; vết cào vẫn là gợi ý sớm.
- **Ưu/nhược B:** đúng thứ tự quan sát→xác nhận; thêm nội dung báo cáo nhưng không thêm thẻ.
- **AI khuyến nghị: A ở P2 và B ở P3b.**
- **Ảnh hưởng:** `EV_NeckScratches`, lời thám tử, báo cáo, trạng thái Timeline.

### G18 Hòa thu nợ hay trộm

- **Mâu thuẫn/ảnh hưởng:** tiền nợ để bàn + giấy ký khiến câu “trộm” chưa rõ; không thấy Tùng mà khẳng định còn sống.
- **A [PROPOSAL]:** gọi hành vi tự ý lấy tiền chưa có đồng ý, giữ cách Hòa tự biện hộ thu nợ; không xác định pháp lý là trộm từ giấy. **Ưu:** ít sửa. **Nhược:** động cơ xấu hổ/sợ bị quy tội nhẹ hơn S.
- **B [PROPOSAL]:** Hòa lấy toàn bộ xấp tiền lớn hơn tiền phòng, chỉ ghi số tiền nợ trên biên nhận; sau phản bác thừa nhận phần lấy quá. Không thêm tiền sổ mới thành evidence chốt; phần này là lời nhận, không tự chứng minh số tiền gốc. Hòa chỉ nói không nhìn thấy Tùng ở khu bàn, không chứng thực còn sống.
- **Ưu/nhược B:** giữ hành vi trộm vặt của S, lý do nói dối cụ thể; thêm một chi tiết về tiền, không nên thêm puzzle tính tiền.
- **AI khuyến nghị: B**, không coi lời nhận phần tiền là ngoại phạm.
- **Ảnh hưởng:** P3a Hòa, mô tả biên nhận, Story/Bible vai Hòa.

### G19 Nhận hành vi và nhận biết hậu quả

- **Mâu thuẫn/ảnh hưởng:** F nói nhận tráo nhưng câu cuối chỉ làm theo lệnh, không biết gây chết.
- **A [PROPOSAL]:** kết quả chỉ “hé bị ép”; thêm phần hỏi xác nhận hành vi sau, không gọi ngay là thú nhận đầy đủ. **Ưu:** giữ cảm xúc gốc. **Nhược:** cần bước sau trước WHO/WHAT chốt.
- **B [PROPOSAL]:** lời nhận từng phần: đã lấy ống cũ/đặt ống khác, ban đầu biện hộ giúp đổi thuốc; khi kết quả mâu thuẫn, nhận bị ép làm điều nguy hiểm vì con gái. Câu không biết gây chết là lời bào chữa chưa kiểm chứng, hoặc bỏ. Không tự phán quyết ý thức giết người từ báo cáo.
- **Ưu/nhược B:** có sự thay đổi lời khai được evidence thúc đẩy; phải chốt nội dung nhận để tránh cảm xúc thay chứng minh.
- **AI khuyến nghị: B.**
- **Ảnh hưởng:** P3a/P3b Minh, flag nhận từng phần/đầy đủ, WHY/WHAT/WHEN.

### G20 Thiếu đoạn động cơ và kết chương

- **Vấn đề/ảnh hưởng:** F chưa có Phase 4; chưa mở con tin/nguồn hóa chất/công việc Tùng.
- **A [PROPOSAL]:** kết Ch1 chỉ bị ép, các chi tiết còn lại để chương sau. **Ưu:** ít nội dung. **Nhược:** không hoàn tất động cơ Ch1 của S.
- **B [PROPOSAL]:** P4 xác nhận lượng tiết lộ: Minh khai nợ và con gái bị giữ, vật thay được giao từ mắt xích liên quan công ty vệ sinh; cảnh sát tiếp tục kiểm tra nguồn. Công việc Tùng/cảnh báo được mở từ khảo sát và lời liên quan; đồng xu nhận công dụng thẻ nội bộ ở mức lời nhận có nguồn, không công bố Khang chủ mưu.
- **Ưu/nhược B:** Ch1 đủ nhân quả, mở K-Estate; chưa có dữ kiện độc lập xác nhận địa điểm con tin hoặc tên công ty, phải giữ nhãn lời khai.
- **AI khuyến nghị: B**, chưa đặt tên mắt xích/công ty/địa điểm mới.
- **Ảnh hưởng:** P4, tờ khảo sát, đồng xu, Statements Minh, Mystery tracker.

### G21 Engine và phạm vi

- **Vấn đề/ảnh hưởng:** P React/Phaser ba kỳ, F Unity ba tháng; người viết có thể yêu cầu tính năng sai nền.
- **A [PROPOSAL]:** sửa nhãn F thành React/Phaser, ba tháng cho slice Ch1. **Ưu:** giữ kiến trúc. **Nhược:** không lập kế hoạch công việc mới.
- **B [PROPOSAL]:** thêm roadmap từng cơ chế và chi phí đồ họa. **Ưu:** quản lý scope rõ. **Nhược:** quá nhiệm vụ repair câu chuyện.
- **AI khuyến nghị: A.** Gói B ở đây vẫn dùng ảnh/popup/flag có sẵn, không thêm engine/module pháp y.
- **Ảnh hưởng:** ghi chú scope, JSON kịch bản, tài liệu triển khai.

### G22 Mục Unknown

- **Vấn đề/ảnh hưởng:** có thể bị hiểu thành tab thứ năm.
- **A [PROPOSAL]:** Unknown là trạng thái thẻ trong Evidence. **Ưu:** giữ bốn tab, một trường status. **Nhược:** cần chú giải trạng thái.
- **B [PROPOSAL]:** tab Main Mystery riêng. **Ưu:** dễ gom mystery. **Nhược:** đổi P/UI/save, chưa cần.
- **AI khuyến nghị: A.**
- **Ảnh hưởng:** `EV_BoundaryCoin`, Notebook/save, tài liệu UI.

### G23 Gieo chữ ký và giữ mảnh dài hạn

- **Vấn đề/ảnh hưởng:** giấy khen/bài báo Ch1 không có hotspot; Ch5 có thể thiếu mẫu.
- **A [PROPOSAL]:** hotspot phụ ở hành lang, lưu ảnh khi người chơi click; Ch5 có thể tìm lại mẫu nếu bỏ qua. **Ưu:** tự khám phá. **Nhược:** phải thiết kế fallback Ch5.
- **B [PROPOSAL]:** để hotspot phụ, trước rời Ch1 cảnh sát/thám tử ghi hồ sơ môi trường chung, lưu ảnh giấy khen nếu chưa có; không phóng chữ ký hoặc đưa lý thuyết Khang. ID dự kiến `EV_KhangCertificate`, chưa có trong F.
- **Ưu/nhược B:** không mất mảnh, một ảnh và flag; fallback thu tự động làm giảm tự do bỏ qua nhưng không giải hộ việc so khớp.
- **AI khuyến nghị: B**, chỉ đảm bảo tài liệu có trong Notebook; người chơi vẫn phải phát hiện ý nghĩa chữ ký ở Ch4–5.
- **Ảnh hưởng:** hành lang P1/P4, Evidence môi trường, save xuyên chương; ảnh báo không nhất thiết thành thẻ riêng.

### G24 Em gái chết là góc nhìn hay sự thật

- **Mâu thuẫn/ảnh hưởng:** mở đầu kể đã chết như sự thật, các chương sau thay đổi.
- **A [PROPOSAL]:** Ch1 chỉ nói thám tử tin đã mất gia đình, hồ sơ khép; không kể khách quan em gái chết. **Ưu:** ít nội dung, giữ bí ẩn. **Nhược:** phải chỉnh diễn đạt mở đầu S.
- **B [PROPOSAL]:** thêm cảnh flashback không đáng tin làm tutorial. **Ưu:** giàu trải nghiệm. **Nhược:** lộ twist và cơ chế dành cho Ch5 quá sớm.
- **AI khuyến nghị: A.**
- **Ảnh hưởng:** mở đầu/thuyết minh nhân vật và phản ứng đồng xu; không tiết lộ cô sống.

### G25 Kết luận cảnh sát ở đâu

- **Vấn đề/ảnh hưởng:** S có trộm dẫn hen, F mới chờ pháp y.
- **A [PROPOSAL]:** đầu P2 chỉ là giả thuyết ban đầu của cảnh sát, chưa kết luận hồ sơ. **Ưu:** một ghi chú, hợp cảnh chờ. **Nhược:** phải sửa từ “kết luận” trong S.
- **B [PROPOSAL]:** cảnh sát đã khép án rồi thám tử mở lại nhiều ngày sau. **Ưu:** có xung đột hệ thống. **Nhược:** đổi timeline/scope Ch1 nhiều.
- **AI khuyến nghị: A.** Không làm cảnh sát Ch1 thành người đồng lõa mới.
- **Ảnh hưởng:** đầu P2, nhận định điều tra, câu nguồn S.

### G26 Đồng xu không liên quan hay liên quan

- **Vấn đề/ảnh hưởng:** không giải ai tráo nhưng liên quan tổ chức/động cơ; hai nghĩa bị trộn.
- **A [PROPOSAL]:** đổi mô tả “không trực tiếp xác định người tráo”; giữ Unknown. **Ưu:** sửa chữ, không spoil. **Nhược:** công dụng thẻ phải mở sau.
- **B [PROPOSAL]:** P4 nối lời về khảo sát/mạng lưới với xu, ghi “công dụng được lời khai mô tả”; thám tử nhận hình quen từ quá khứ. Không Present xu để kết Minh giết.
- **Ưu/nhược B:** đủ payoff nhỏ của S; không xác nhận ai cấp/cấp trên Khang.
- **AI khuyến nghị: A ở P2 và B ở P4.**
- **Ảnh hưởng:** `EV_BoundaryCoin`, Statement P4, Notebook mystery.

### G27 Present tổ hợp

- **Vấn đề/ảnh hưởng:** P một vật/lời khai, F dùng hai dữ kiện nhưng chưa đặc tả UI.
- **A [PROPOSAL]:** Present tuần tự; mỗi bước đúng ghi flag, bước sau dùng câu mới. **Ưu:** tái dùng UI, minh bạch điều đang bác. **Nhược:** nhiều lượt bấm hơn.
- **B [PROPOSAL]:** chọn hai thẻ cùng lúc tạo tổ hợp. **Ưu:** tự ráp. **Nhược:** thêm UI/validator/cặp sai.
- **AI khuyến nghị: A.** Tránh dùng khăn để “bác” lời Tùng rửa mặt vì khăn đang hỗ trợ lời đó; dùng Press để ghi điều hỗ trợ, Present vào phủ nhận khác.
- **Ảnh hưởng:** P3 Minh, validation Statements, save flags, EVIDENCE slots.

### G28 Phạt, checkpoint và nhánh sai

- **Vấn đề/ảnh hưởng:** P có 100/15–30/Bad Ending nhưng thiếu áp dụng từng bước.
- **A [PROPOSAL]:** Press/Inspect không phạt; Present sai −15; nộp Final Deduction sai −20 cho một lượt, không trừ từng slot; checkpoint đầu Phase 3 và trước Deduction, lưu đúng điểm lúc đó. **Ưu:** ít cấu hình; phù hợp P. **Nhược:** mức phạt chưa phân tầng độ khó.
- **B [PROPOSAL]:** từng vòng 15/20/30, nhánh NPC/điểm phục hồi theo kết quả. **Ưu:** điều tiết khó. **Nhược:** tăng cân bằng/test, chưa cần.
- **AI khuyến nghị: A.** Thiếu evidence/gate chưa mở là trạng thái UI, không tính sai đáp án. Về 0 dùng Bad Ending mất khả năng tiếp tục điều tra, không bịa thám tử chết hoặc kẻ khác giết.
- **Ảnh hưởng:** mọi Present, Final Deduction, checkpoint/save, phản hồi sai ngắn cần viết sau.

### G32 Tên tệp và bản lặp

- **Vấn đề/ảnh hưởng:** đọc nhầm bản hoặc coi cite cũ là nguồn mới.
- **A [PROPOSAL]:** một bảng nguồn/phiên bản và nhật ký quyết định khi được duyệt. **Ưu:** không thêm gameplay. **Nhược:** phải giữ cập nhật.
- **B [PROPOSAL]:** chuyển toàn bộ sang hệ quản lý content/version tự động. **Ưu:** tốt về dài hạn. **Nhược:** ngoài scope nhóm nhỏ.
- **AI khuyến nghị: A.**
- **Ảnh hưởng:** metadata Bible/Phase/repair; không sửa nội dung bản gốc khi chưa duyệt.

### G29–G31 Hoãn có kiểm soát

[PROPOSAL] G29 giữ danh sách cần giải cơ chế Ch2–4; G30 giữ lộ trình cassette/báo động và mẫu Ch2–3; G31 giữ câu hỏi bằng chứng hiện diện Khang. Ch1 chỉ đảm bảo ảnh giấy khen và đồng xu được lưu. Không tự đưa cassette, tên em gái hoặc bằng chứng Khang có mặt vào Ch1 để sửa payoff tương lai.

## 4. Kiểm tra chuỗi chứng minh

### 4.1 Những gì người chơi thực sự có trong bản nguồn

| Câu hỏi | Dữ kiện nguồn | Kết luận được hỗ trợ | Kết luận chưa đủ |
| --- | --- | --- | --- |
| Phát hiện đầu tiên? | Thi thể, bốn lời khai, túi Hòa/cổ tay Linh/vị trí Hào/ánh nhìn Minh | [INFERENCE] Có những người che chi tiết, cần kiểm tra | [INSUFFICIENT EVIDENCE] Chỉ từ hành vi lo lắng gọi Minh giết |
| Vì sao nghi ống hít? | Vết cào khó thở, ống mở trên bàn, hộp mới, Minh nhìn thuốc | [INFERENCE] Thuốc có thể liên quan, cần kiểm tra thay mới | [INSUFFICIENT EVIDENCE] Có thuốc bên cạnh mà chết đồng nghĩa thuốc độc |
| Điều gì chứng minh tráo? | Hộp mới + ống hiện tại | [INFERENCE] Có thể thay mới | [INSUFFICIENT EVIDENCE] Chưa phân biệt thay hợp lệ, thay cả ống hay đổi chất, người thao tác |
| Minh có cơ hội? | Tự khai ở 204, Tùng rửa mặt theo anh | [INFERENCE] Có cơ hội nếu còn tại bàn khi Tùng không nhìn | [INSUFFICIENT EVIDENCE] Giờ tráo độc quyền hoặc hắn vẫn còn lúc rửa mặt khi timeline chưa sửa |
| Ai khác có cơ hội? | Hòa vào 20:55, Linh vào 21:05, ổ lỏng; Hào quanh hành lang | [INFERENCE] Hòa/Linh tiếp cận được; người khác chưa bị loại | [INSUFFICIENT EVIDENCE] Trộm tiền/đồng hồ là ngoại phạm |
| Loại ba người thế nào? | F đưa kết luận sau lời nhận và mốc giờ | [CANON] Tác giả xác định không giết | [INSUFFICIENT EVIDENCE] Người chơi chưa có ngoại phạm độc lập đủ toàn khoảng gây tác động |
| Điều gì buộc Minh đổi lời? | Khăn + hộp + ống, phản ứng sợ | [INFERENCE] Có thể tiếp tục hỏi | [INSUFFICIENT EVIDENCE] Các vật ấy bác câu “Tùng bình thường khi tôi về”; tráo có thể xảy ra trước triệu chứng |
| Thú nhận quyết định không? | F p213 nói nhận tráo, p203 chỉ làm theo lệnh | [INFERENCE] Bản hiện tại phụ thuộc lời nhận | [INSUFFICIENT EVIDENCE] Chưa có nội dung rõ hoặc kiểm chứng ngoài lời nhận |

### 4.2 Chuỗi đề xuất trong phương án B

**Mọi bước dưới đây là [PROPOSAL], phụ thuộc phê duyệt gói R.**

1. **Lật lời Hòa và Linh:** giấy + lời Hòa sửa; vòng bụi + đồng hồ lộ + lời Linh sửa. Người chơi hiểu cả hai đã vào và lời đầu không đáng tin. Chưa loại họ khỏi hành vi tráo.
2. **Đặt câu hỏi đúng về thuốc:** dùng ống/hộp/vết cào để đề xuất kiểm tra thuốc, không tuyên bố chắc “thuốc độc”. Người chơi tự chọn hướng cần kiểm tra, cảnh sát nhận yêu cầu.
3. **Mở phủ nhận cụ thể của Minh qua Press:** nội dung dự kiến là chưa từng xử lý hộp/đổi thuốc/mang ống cũ ra; điều Tùng bình thường trước khi về không bị dùng như lời dối.
4. **Liên hệ cá nhân:** cảnh sát kiểm tra đồ các bên theo quy trình đề xuất; người chơi có thẻ mảnh hộp và Present vào phủ nhận Minh. Mảnh rách khớp chứng minh liên hệ cụ thể với hộp, chưa chứng minh sát hại.
5. **Lời nhận từng phần:** Minh giải thích việc có mảnh giấy, nhận đổi một ống và mang ống cũ đi, biện hộ là giúp thay thuốc. Người chơi Press nơi để ống cũ; Minh nêu vị trí trước khi kiểm tra.
6. **Kiểm chứng ngoài lời nhận:** cảnh sát tìm đúng hốc khuất, đối chiếu nhận dạng ống Tùng và lập thẻ. Không phải NPC chỉ kể “đã tìm thấy” mà không cung cấp hình/vị trí/nguồn xác nhận.
7. **Kiểm tra thuốc và chuyển thời gian:** nhận kết quả đủ phạm vi. Người chơi Present báo cáo vào lý do “thay thuốc bình thường”; nó bác tính bình thường của ống thay, không tự bác việc Minh có bị ép hay biết độc tính đến đâu.
8. **Lời nhận đầy đủ hơn:** Minh nhận hành vi lấy ống cũ/đặt ống được giao trong lúc Tùng rửa mặt, nêu cưỡng ép. Cảnh sát/Notebook đối chiếu với giờ Hòa vào, ống cũ, mảnh hộp và kết quả. Mức biết hậu quả vẫn phải ghi theo lời, không suy ra hết từ báo cáo.
9. **Final Deduction:** người chơi ráp hành vi, cơ hội, vật chứng, lời nhận đã kiểm chứng và động cơ tạm thời. Phase 4 tiếp tục mở con tin/nguồn cung/mạng lưới, không kết thúc bằng “không ai khác có cơ hội”.

### 4.3 Cách xử lý việc loại Hòa, Linh và Hào

| Người | Trước bằng chứng Minh | Sau gói R + lời nhận | Cách hiển thị được khuyến nghị |
| --- | --- | --- | --- |
| Hòa | [INSUFFICIENT EVIDENCE] Có cơ hội ở 20:55; biên nhận không loại hành vi chạm thuốc | [PROPOSAL] Chuỗi liên hệ hộp–mang ống cũ–kiểm chứng–lời nhận quy hành vi tráo cho Minh. Phần tiền Hòa được làm rõ riêng | “Lời dối về việc vào phòng đã được giải thích”; cuối “không bị xác định là người tráo trong vụ này” |
| Linh | [INSUFFICIENT EVIDENCE] Có cơ hội vào phòng; lời rằng chỉ trộm phải đối chiếu | [PROPOSAL] Phần đồng hồ và chứng kiến được ghi riêng; chuỗi cá nhân của Minh dẫn kết luận người tráo | Không ghi “vô tội vì ăn cắp”; không xóa trách nhiệm bỏ chạy |
| Hào | [INSUFFICIENT EVIDENCE] Giờ 21:20 không loại chuẩn bị từ trước | [PROPOSAL] Đối chứng 203 xác nhận lượt thu nợ; đến sau lúc Linh khai thấy cơn là giảm nghi hành vi trực tiếp khi tới. Gói R và lời nhận chốt người tráo | “Lượt thu nợ không khớp thời điểm cơn phát”; không ghi ngoại phạm toàn đêm hoặc trong sạch với mạng lưới |

[INFERENCE] Chứng minh một người thực hiện không tự chứng minh mọi người khác không đồng phạm. **[INSUFFICIENT EVIDENCE]** Gói B không cung cấp ngoại phạm tuyệt đối cho mọi hành vi từ trước 20:00 hoặc mọi khả năng phối hợp. Kết luận gameplay phải có phạm vi: xác định người trực tiếp tráo trong vụ Tùng, còn người cưỡng ép và mạng lưới tiếp tục điều tra.

### 4.4 Vai trò của thú nhận

**Có — trong gói khuyến nghị, lời nhận được kiểm chứng vẫn là mắt xích quyết định** cho giờ tác động và cưỡng ép. Khác với F hiện tại, người chơi có mâu thuẫn cụ thể để làm Minh đổi lời và cảnh sát có vật thu ngoài lời nói để kiểm tra.

Nếu Minh không nhận: [PROPOSAL] mảnh hộp + ống chất khác cho nghi vấn mạnh về việc anh tham gia xử lý hộp; **[INSUFFICIENT EVIDENCE]** chưa đủ kết luận chính xác thời điểm tráo và động cơ con tin. Nếu chỉ có lời nhận không kiểm chứng: không mở Final Deduction kết luận đã xác minh. Nếu không chọn gói R, phải chấp nhận hướng A phụ thuộc thú nhận lớn hơn và đổi tính chất bài puzzle.

## 5. Timeline chuẩn đề xuất

### 5.1 Actual Timeline

**Đây là một phương án thống nhất để phê duyệt, không phải canon đã sửa.** Không lấp hoạt động không liên quan của mọi nhân vật. Giữ 20:00 là điểm bắt đầu bảng, không sáng tác một hành động Linh chỉ để đối lập câu ngủ.

| Giờ/khoảng [PROPOSAL] | Sự thật tác giả đặt trong phương án | Cơ sở và giới hạn dành cho người chơi |
| --- | --- | --- |
| 20:00–20:44 | Không chốt hoạt động Linh/Hòa/Hào ngoài phần cần vụ án. Tùng chưa bị tráo theo phương án; Minh đã có ống được giao trước cuộc gặp, nhưng chưa chốt lúc nhận/ai giao | Hoạt động còn thiếu giữ [UNKNOWN]; lời Linh ngủ suốt sẽ bị bác bởi lần vào sau |
| 20:45 | Minh tới 204, gặp Tùng | Lời Minh; chưa tự trở thành mốc vật lý độc lập |
| 20:50–20:55 | Tùng ở bồn sau vách/rèm trong 204; không ở khu bàn | Khăn hỗ trợ có sử dụng bồn; lời nhận Minh/đối chiếu sau hỗ trợ người và khoảng |
| Trong 20:50–20:54 | Minh lấy ống cũ, đặt ống được giao lên bàn, bóc hộp và bỏ hộp trong thùng; mảnh nắp giấy dính/được nhét trong túi áo khoác và anh chưa phát hiện để vứt | Thao tác mới/chi tiết mảnh là gói R; chứng cứ không định được phút riêng |
| Khoảng 20:54 | Minh rời 204; mang ống cũ. Hòa nhìn thấy anh đi xuống cầu thang trước khi lên 204 | Lời nhận Minh + lời Hòa bổ sung; giờ 20:54 vẫn không có đồng hồ độc lập |
| Sau rời, trước quay lại mở cảnh | Minh giấu ống cũ ở hốc chân cầu thang tầng trệt để tránh mang vật của Tùng trên người | Thu theo chỉ dẫn kiểm chứng địa điểm, không kiểm chứng phút giấu |
| 20:55–20:56 | Hòa vào khu bàn; Tùng đã rửa xong nhưng còn lau mặt trong khu sau vách, nên Hòa không nhìn thấy. Hòa lấy tiền và để biên nhận 20:55, rồi rời | Chi tiết lau mặt sau vách là [PROPOSAL] bổ sung để giữ vị trí nhất quán; giấy + lời Hòa không tạo ngoại phạm về thuốc |
| Khoảng 20:57 | Tùng ra khỏi khu rửa mặt, trở lại khu bàn | Actual để nhất quán bố cục; [INSUFFICIENT EVIDENCE] phút này không dành cho slot người chơi |
| Khoảng 21:03–21:05 | Tùng khó thở, dùng ống trên bàn, vật vã; đi/loạng choạng về giường rồi gục sàn | Actual đề xuất không quy định dược lý phút phát tác. Nguồn xác minh phải từ báo cáo/nhân chứng trong phạm vi được nêu, không từ khăn |
| Khoảng 21:05 | Linh vào lấy đồng hồ; thấy đoạn Tùng gục/cào cổ, bỏ chạy | Không bắt cô chứng kiến thao tác tráo hay trực tiếp nhìn thấy xịt; khoảng giờ theo lời cô |
| Sau khoảng 21:05, trước phát hiện khoảng 21:30 | Tùng tử vong; không đặt phút chết chính xác | Player Timeline không được viết đã chết 21:20 từ sự im lặng |
| Khoảng 21:20 | Hào tới thu nợ 203, dừng hút thuốc gần 204 | Lời Hào + đối chứng người 203/biên nhận trong B; không tự ngoại phạm thời gian trước |
| Khoảng 21:30 | Hòa trở lại, phát hiện Tùng gục bất động và báo | Lời Hòa; không dùng “phát hiện” làm phút chết |
| Khoảng 21:31–21:34 | Hòa báo cảnh sát và gọi Minh, rồi tới 201 | Thứ tự/cửa sổ mới, không thêm log cuộc gọi thành bằng chứng nếu chưa thiết kế |
| 21:35 | Hòa gõ cửa 201; thám tử ra, nhìn Tùng trên sàn qua bậu cửa | Mốc trực tiếp của F giữ nguyên |
| Khoảng 21:36–21:43 | Thu lời khai đầu; Minh tới sau cuộc gọi, chưa chốt phút tới cá nhân | Chạy theo lượt chơi, không đếm thời gian thật bắt người chơi vội |
| Khoảng 21:45 | Cảnh sát xuất hiện/giăng băng, kết Phase 1 | Mốc mới dùng nhịp cảnh; nếu không muốn thêm phút, có thể ghi “sau lượt hỏi” ở giao diện |

[PROPOSAL] Không quy định chất gì, liều lượng hay thời gian tác động sinh học chính xác. Điểm cần giữ là Tùng dùng ống đã thay và khó thở trước lúc Linh thấy; kết quả chuyên môn xác minh sau. Sự sống bình thường khi Minh rời phù hợp hành vi phá thuốc trước cơn, không phải lỗi logic.

### 5.2 Claimed Timeline

| NPC | Lời đầu ở P1 [PROPOSAL sửa theo nguồn] | Lời sửa ở P3 [PROPOSAL] | Điều không được tự nâng thành xác minh |
| --- | --- | --- | --- |
| Hòa | Chỉ lên một lần khoảng 21:30, chưa vào | Đã vào 20:55 lấy tiền; trước đó thấy Minh đi xuống; không thấy Tùng ở khu bàn | Tùng sống/cả phòng trống; phút Minh rời chính xác |
| Linh | Ngủ từ khoảng 20:00, không biết gì | Vào khoảng 21:05 trộm đồng hồ, thấy Tùng gục/cào cổ, chạy | Cô biết chất độc, thấy Minh tráo, hoặc biết phút chết |
| Hào | Tới khoảng 21:20 đòi nợ 203, chỉ đi ngang | Có đứng hút thuốc sát 204; công việc thu nợ được đối chứng ở phạm vi lượt này | Không tới trước đó hoặc không có liên hệ với mạng lưới |
| Minh | Tới 20:45, rời trước 21:00, Tùng chưa phát cơn | Press: phủ nhận chạm/đổi/mang thuốc → mảnh hộp bác → nhận thay, chỉ chỗ ống cũ, biện hộ thay bình thường → báo cáo bác → nhận cưỡng ép, khoảng tác động | Lời bào chữa không biết độc tính; danh tính cấp trên; mọi chi tiết lời nhận đều đúng nếu chưa kiểm |

### 5.3 Player Timeline theo giai đoạn

| Giai đoạn | Người chơi được ghi xác minh | Chỉ lời khai / chưa chắc |
| --- | --- | --- |
| Cuối P1 | Đồng hồ 21:35, vị trí xác quan sát, ai có mặt khi hỏi | 20:45 Minh, 20:00 Linh, 21:20 Hào, 21:30 phát hiện đều có tên người khai |
| Cuối P2 | Giấy có chữ ký/giờ 20:55; ổ lỏng; khăn ướt; hộp/ống; vòng bụi; vết cào quan sát | Khăn không định phút; hộp không xác nhận “bóc tối nay”; giờ ghi giấy chưa có nguồn thứ hai |
| P3a sau Hòa/Linh | Giấy + Hòa nhận xác nhận lần vào theo hồ sơ vụ; Linh lộ đồng hồ/nhận, cung cấp lúc thấy triệu chứng | Không tự có giờ dùng thuốc/giờ chết hoặc ngoại phạm của hai người |
| P3a sau Hào | Đối chứng bổ sung cho lượt thu nợ khoảng 21:20 | Không xác minh toàn bộ hoạt động trước đó |
| P3a sau mảnh hộp | Minh liên hệ hộp; phủ nhận xử lý hộp không còn phù hợp | Chưa xác định nguyên nhân chết hoặc chủ ý |
| Sau tìm ống cũ | Chi tiết vị trí do Minh cung cấp kiểm chứng được; nhận dạng ống đối chiếu được | Giờ thay vẫn từ lời nhận, chưa có timestamp độc lập |
| P3b sau báo cáo và nhận cuối | Chất/thuốc theo phạm vi báo cáo, hành vi theo chuỗi vật chứng + nhận đã kiểm chứng | Khoảng 20:50–20:54 là “lời nhận phù hợp các mốc”, không gắn nhãn đo độc lập; cưỡng ép/con tin theo lời khai cần điều tra tiếp |

[PROPOSAL] Timeline có trạng thái: **quan sát/vật ghi**, **lời khai**, **lời khai được hỗ trợ**, **chuyên môn xác nhận**, **chưa biết**. Không dùng một tick “verified” để che sự khác biệt. Nhãn này có thể là text trong mô tả, không cần hệ mới.

## 6. Chuẩn hóa gameplay

### 6.1 Các gate đề xuất

| Gate [PROPOSAL] | Điều kiện | Kết quả | Chống thiếu dữ kiện |
| --- | --- | --- | --- |
| P1 → P2 | Đã ghi statement đầu của Hòa/Linh/Hào/Minh; quan sát hiện trường mở; sự kiện cảnh sát đến chạy sau lượt đủ | Mở Inspect và bốn tab Notebook | Không có đồng hồ thực đếm ngược |
| P2 → P3a | Đã Inspect và lưu **bảy Evidence vụ án** bên dưới; đọc hướng dẫn Press/Present | Mở đối chất; checkpoint với điểm hiện tại | Không cho hộp/khăn thành tự nhặt |
| Press | Đã ở Phase 3 và chọn một statement đang mở | Mở thông tin/statement mới, không trừ uy tín | Có thể hỏi các NPC theo thứ tự tự do; lời chưa mở hiện khóa |
| Present | Phase 3, có statement mục tiêu và thẻ phù hợp trong Notebook | Đúng cập nhật lời/flag; sai −15 | Vật chưa thu hoặc statement chưa mở không được tính là đáp án sai |
| Lượt kiểm tra gói R | Hoàn tất phản bác Hòa/Linh và hỏi vị trí Hào; đã đề xuất kiểm tra thuốc/đồ qua các dữ kiện | Cảnh sát cung cấp mảnh hộp, mở phủ nhận cụ thể Minh | Player phải có cơ hội đọc thẻ trước khi dùng |
| Nhận từng phần Minh | Present mảnh hộp vào phủ nhận xử lý hộp → Press nơi ống cũ | Cảnh sát đi kiểm tra, cung cấp thẻ ống cũ | Không cần chọn WHO Minh trước khi có thẻ cá nhân |
| P3a → P3b | Thu ống cũ/ghi nguồn và gửi kiểm tra thuốc; chuyển thời gian được báo rõ | Kết quả chuyên môn và lượt hỏi tiếp | Không tạo kết quả ngay từ Inspect |
| Final Deduction | Đủ dữ kiện các vai Hòa/Linh/Hào; có gói R; lời nhận hành vi và cưỡng ép đã mở; phạm vi nguyên nhân báo cáo đủ | Người chơi ráp chuỗi; checkpoint trước nộp | Nếu báo cáo chưa xác nhận nguyên nhân, gate kết luận nguyên nhân chưa mở |
| P3 → P4 | Final Deduction đúng; evidence/lời nhận giữ trong save | Kết chương, bí ẩn mới, lưu vật dài hạn | Hoàn tất fallback xu/giấy khen trước kết Ch1 |

[PROPOSAL] NPC được hỏi tự do trong P3a; vòng cuối Minh có gate vì cần lời nhận/đối chứng, không phải vì tác giả muốn giấu một nút. Thiếu dữ kiện chỉ dẫn về Notebook/đầu mối còn thiếu, không tự kể đáp án.

### 6.2 Evidence bắt buộc và tùy chọn

| Loại [PROPOSAL] | Danh sách | Khi cần |
| --- | --- | --- |
| Bắt buộc để sang P3 | `EV_LooseLock`, `EV_WetTowel`, `EV_NeckScratches`, `EV_Inhaler`, `EV_InhalerBox`, `EV_RentReceipt`, `EV_MissingWatch` | Bảy thẻ, không gộp ống/hộp |
| Bắt buộc cho kết luận B | ID dự kiến `EV_PackagingMatch`, `EV_OriginalInhaler`, `EV_MedicineAnalysis`; Statements sửa và lời nhận đã mở | Không yêu cầu ở P2 vì xuất hiện sau |
| Tùy chọn khi khám P2; bắt buộc lưu trước kết Ch1 | `EV_BoundaryCoin`; mẫu giấy khen ID dự kiến `EV_KhangCertificate` | Không dùng chốt người tráo; fallback P4 nếu bỏ qua |
| Tùy chọn và không phải Evidence ID đã có | Bài báo, tờ khảo sát dạng Inspect/People context, dép/túi Hòa, cổ tay Linh, tàn thuốc/vị trí Hào, ánh nhìn Minh | Foreshadowing, gợi ý, bối cảnh; không thay vật chứng quyết định |

[PROPOSAL] Tờ khảo sát vẫn là môi trường theo F. Nếu P4 cần dùng nội dung nó để suy ra công việc thật Tùng, người chơi phải có bản ghi/Inspect và lời khai bổ sung phù hợp; không biến bảng tên gạch đỏ thành bằng chứng tự giải nghĩa thu gom. Giấy khen có thể lưu là “tài liệu môi trường” trong Evidence, không cần tab mới.

### 6.3 Quay lại hiện trường và bảo quản vật

[PROPOSAL] Cho quay lại P2 trong P3a với hotspot đã biết. Lần đầu ảnh/ghi chú cập nhật, lần sau chỉ đọc lại. Cảnh sát thu ống/hộp sau yêu cầu: hotspot chuyển trạng thái “đã được thu”, mở ảnh ghi nhận thay vì vật còn nằm đó. Không spawn vật lần nữa hoặc cho nhân vật khác đụng vào sau phong tỏa.

[PROPOSAL] Sau chuyển thời gian P3b, không cần quay về một hiện trường nguyên trạng giả. Dùng Notebook/ảnh cảnh sát; vùng được phép tham khảo vẫn có thể xem dưới dạng hồ sơ. Hotspot xu/giấy khen đã có fallback trước kết chương. Cách này tái dùng Scene/asset và trạng thái save đơn giản.

[PROPOSAL] “Thu Evidence” trong UI nghĩa là thu **thông tin đã được ghi nhận**, không nhất thiết sở hữu vật. Mô tả lưu `nguồn`, `người ghi nhận`, `thời điểm ghi nhận`, `loại bản ghi`. Mọi thao tác với thi thể, nệm, thùng rác, đồ người liên quan do cảnh sát thực hiện; thám tử chỉ chỉ điểm, quan sát và dùng bản ghi được cung cấp. Present giấy/ống/hộp là mở ảnh hoặc hồ sơ, không rút vật thật từ túi.

### 6.4 Final Deduction được sửa thế nào

| Slot [PROPOSAL] | Đáp án/phạm vi đề xuất | Cần hỗ trợ |
| --- | --- | --- |
| WHO | Minh, người trực tiếp thay ống | Liên hệ mảnh hộp + nhận hành vi + tìm ống cũ theo chỉ dẫn |
| WHAT | Lấy ống cũ, đặt ống khác có nội dung không phải thuốc ghi nhãn | Hai ống, kiểm tra thuốc, nhận hành vi |
| WHEN | Khi Tùng ở khu rửa mặt, trước Minh rời và Hòa vào; khoảng giờ theo lời nhận phù hợp timeline | Khăn hỗ trợ hoạt động, Hòa hỗ trợ thứ tự, Minh cung cấp khoảng; không đoán phút |
| WHY | Bị cưỡng ép; người cưỡng ép chưa xác định đầy đủ | Lời nhận; P4 bổ sung con tin/nợ |
| EVIDENCE | Liên hệ hộp; ống cũ thu đúng vị trí; kết quả thuốc; lời nhận đã được kiểm chứng | Chọn các thẻ/Statements tuần tự; không dùng bộ ba nguồn cũ như đủ một mình |

[PROPOSAL] EVIDENCE có ba vị trí dữ kiện vật lý (mảnh hộp, ống cũ, báo cáo) và một vị trí lời nhận, thao tác kéo/thả hoặc chọn có sẵn ở DeductionScene. Không thêm hàng chục kết hợp. Trước khi nộp, nội dung các đáp án giờ đều theo quan hệ sự kiện, không có nhiều đáp án tương đương rồi phạt người chơi chọn khác chữ.

[PROPOSAL] Sai Present −15; nộp Deduction sai −20 một lần/lượt; 100 khởi đầu theo P; Press/Inspect không phạt. Checkpoint đầu P3 và trước Deduction lưu điểm thực tại. Về 0 mở Bad Ending ngắn về mất khả năng tiếp tục điều tra, chọn tải checkpoint. Nội dung nhánh sai sẽ viết ở phase kịch bản sau, không viết trong repair.

## 7. Kiểm tra phạm vi và các giới hạn còn lại

- [PROPOSAL] Thêm ba thẻ điều tra, một ảnh giấy khen lưu dài hạn, phần nguồn nhận dạng trong thẻ ống cũ, một nội dung đối chứng người 203, một vách/rèm nền. Không thêm nhân vật có sprite, phòng chơi mới, CCTV, hack điện thoại hoặc hệ giám định tương tác.
- [PROPOSAL] Dùng React/Phaser hiện có, Dialogue/Investigation/Notebook/Deduction và JSON flag. Cảnh sát xử lý/kiểm tra được diễn đạt bằng text/hình popup, không animation chạy khắp khu trọ.
- [INSUFFICIENT EVIDENCE] Giờ chính xác Minh thao tác chưa đo độc lập; không thể xóa nhãn “theo lời nhận”. Hòa thấy anh đi xuống chỉ hỗ trợ thứ tự, không thấy hành vi tráo.
- [INSUFFICIENT EVIDENCE] Địa điểm/việc bắt con gái, nhà cung cấp cụ thể và cấp trên đều cần tiếp tục xác minh, không chốt từ báo cáo hóa chất.
- [INSUFFICIENT EVIDENCE] Chỉ hóa chất khác nhãn chưa đủ nói nó gây chết; phải có phần liên hệ nạn nhân trong báo cáo hoặc hoãn kết luận nguyên nhân.
- [PROPOSAL] Nếu người thiết kế không muốn chuyển thời gian/chuyên môn, chọn hướng A và gọi Final Deduction là giả thuyết được lời nhận hỗ trợ, không kết quả đã chứng minh độc chất. Không lấy một test nhanh tưởng tượng để giữ mọi việc trong mười phút.

## 8. DECISION SHEET

**Tất cả dòng dưới đây đang chờ người thiết kế. Cột AI khuyến nghị không phải phê duyệt.** Có thể trả lời theo mã, ví dụ `D01=B; D02=B; D03=A`, hoặc sửa nội dung đề xuất. Những dòng phụ thuộc gói R chỉ triển khai nếu D01=B.

| Decision | Vấn đề | Lựa chọn A | Lựa chọn B | AI khuyến nghị | Quyết định của bạn |
| --- | --- | --- | --- | --- | --- |
| D01 | G12–G17/G19, mức chứng minh | Sửa tối thiểu, thú nhận + thu ống, kết luận còn tạm thời | Gói R ba thẻ, lời nhận kiểm chứng, kết luận sau báo cáo | **B** | Chờ duyệt |
| D02 | G01–G03, cuộc gặp/bố cục | Rời 20:50, dời rửa/tráo sớm | Tới 20:45; rửa 20:50–20:55 sau vách; tráo trước rời khoảng 20:54 | **B** | Chờ duyệt |
| D03 | G04/G07, giờ và nhận định | Sửa 20:55; bỏ mốc 21:00 đã xác minh, giữ giờ theo nguồn khai | Tạo thêm puzzle giờ/đạo cụ định phút | **A** | Chờ duyệt |
| D04 | G05, đồng xu | Túi quần, sửa S | Dưới nệm, cảnh sát phát hiện/ghi hình | **B** | Chờ duyệt |
| D05 | G06, thi thể | Chọn sàn và chỉ sửa mô tả | Dùng thuốc ở bàn, gục sàn cạnh giường; không ai chuyển xác | **B** | Chờ duyệt |
| D06 | G08–G09, quyền và ảnh | Quan sát/phác ghi, không thêm quy trình | Cảnh sát xử lý/chụp, Present bản hồ sơ | **B** | Chờ duyệt |
| D07 | G10–G11, gate và số thẻ | Bảy thẻ vụ án bắt buộc; mỗi ID một thẻ | Năm thẻ để sang, gộp UI, lấy phần thiếu sau | **A** | Chờ duyệt |
| D08 | G14, Hào | Chỉ giữ giờ tự khai, chưa ngoại phạm | Đối chứng người 203/biên nhận lượt thu nợ, không ngoại phạm toàn đêm | **B** | Chờ duyệt |
| D09 | G18, tiền Hòa | Tự ý lấy tiền, chưa chốt là trộm | Lấy quá số nợ, nhận phần lấy quá; không làm puzzle tiền | **B** | Chờ duyệt |
| D10 | G19, nhận biết Minh | Giữ câu không biết gây chết, chưa xác nhận là thật | Nhận hành vi nguy hiểm bị ép, bỏ hoặc giữ phủ nhận ý thức như lời bào chữa chưa kiểm | **B** | Chờ duyệt |
| D11 | G15–G17, chờ kiểm tra | Kết quả sau kết luận tạm, Final chỉ là giả thuyết | P3a→chuyển thời gian→P3b sau kết quả đủ phạm vi→Final | **B** | Chờ duyệt |
| D12 | G20/G26, kết Ch1 | Chỉ biết bị ép, xu chưa giải nghĩa | Mở lời khai nợ/con tin/công việc Tùng/thẻ mạng lưới; nguồn cung tiếp tục kiểm | **B** | Chờ duyệt |
| D13 | G23, giữ mẫu chữ ký | Hotspot phụ, fallback thiết kế ở Ch5 | Hotspot phụ + ghi nhận ảnh cuối Ch1 nếu bỏ; không giải hộ chữ ký | **B** | Chờ duyệt |
| D14 | G24/G25, góc nhìn ban đầu | Em gái chết là niềm tin; cảnh sát chỉ giả thuyết hen/trộm | Flashback Ch1/khép án rồi mở lại | **A** | Chờ duyệt |
| D15 | G27, thao tác | Present tuần tự vào statement riêng | Chọn hai Evidence một lúc | **A** | Chờ duyệt |
| D16 | G28, phạt và lưu | Press miễn phạt, Present −15, Final −20/lượt; hai checkpoint | Phạt phân tầng/điểm thưởng/nhánh động | **A** | Chờ duyệt |
| D17 | G21/G22/G32, chuẩn kỹ thuật | React/Phaser; Unknown là trạng thái; bảng phiên bản nguồn | Đổi engine/tab mới/hệ version tự động | **A** | Chờ duyệt |
| D18 | G29–G31, phần sau | Hoãn chi tiết Ch2–5, giữ việc cần làm; Ch1 chỉ bảo toàn vật gieo | Sửa luôn toàn bộ bí ẩn và cơ chế các chương sau | **A** | Chờ duyệt |
