# CHAPTER 1 — ÁN MẠNG TRONG PHÒNG TRỌ
## FINAL DEDUCTION — ĐIỀU GÌ THỰC SỰ ĐÃ XẢY RA VỚI TÙNG?

**Bản thiết kế và kịch bản 1.0.** Nguồn đọc lại: S = Story(1).txt; P = Project(2).docx; F = Phase(1).docx; Bible 1.2; Phase 1 bản 1.2; bản Phase 2/3 hiện tại. Các tên nguồn tương ứng Story.txt, Project(1).docx, Phase.docx trong yêu cầu. Quyết định logic đã duyệt trong Bible được dùng để xử lý lỗi nguồn cũ. Không chỉnh Canon/Bible hay tự phê duyệt đề xuất Phase 4 trong lượt này.

Các bảng có cột đúng/sai/đủ chứng cứ và mục C/E/I là dữ liệu thiết kế, **không render nguyên văn cho người chơi**. Phần UI, NARRATION, thoại, ACTION có thể hiển thị theo điều kiện. `DC_*` là ID lựa chọn suy luận, không Evidence mới. Các nguồn ST/EV giữ nguyên mã.

### BÁO CÁO LOGIC TRƯỚC KHI VIẾT KẾT LUẬN

| ID | Vấn đề cần giữ rõ | Nguồn | Xử lý trong màn này |
| --- | --- | --- | --- |
| FD-L01 | F cũ dùng khoảng 20:45–20:50; actual đã duyệt là 20:50–20:54. Lời Minh trong Phase 3 hiện chỉ nhận quan hệ sự kiện, không khai phút cụ thể | F p201/p208; Bible B/E5; P3 R5B | WHEN dùng “khi Tùng rửa mặt, trước Minh rời/Hòa vào”. Không buộc chọn khoảng phút actual hoặc ghi đó là lời người chơi đã nghe |
| FD-L02 | Ống+hộp+giờ Linh không trực tiếp xác định Minh tráo | F p210; Bible C4/E5; P3 R5A–C | Dùng mảnh khớp, ống cũ thu đúng nơi, báo cáo và lời nhận kiểm chứng. Thiếu gói này thì khóa màn, không viết kết luận thắng |
| FD-L03 | Phân tích thuốc một mình chưa chứng minh nguyên nhân chết | Bible C3a/C4; P3 REPORT | Chỉ mở nếu báo cáo có phần liên hệ nạn nhân và `victim_link_confirmed=true` |
| FD-L04 | Cưỡng ép là Canon tác giả, nhưng trước Final người chơi mới có lời nhận bị ép; chưa nợ/con tin/người ra lệnh cụ thể | S Ch1; Bible B3/E5; P3 R5C | WHY chấp nhận đúng mức “Minh khai bị ép, người ép chưa rõ”; không coi toàn bộ động cơ tổ chức đã được chứng minh |

**Kết luận kiểm tra đầu vào:** không có lỗ hổng chặn kết luận về **người trực tiếp tráo và hành vi** nếu chơi qua đầy đủ chuỗi Phase 3. Phút thao tác, ý thức độc tính và người tổ chức vẫn chưa xác minh. Đây là giới hạn kết luận, không được lấp bằng đáp án tác giả biết. Nếu bản build bỏ phần gói R hoặc liên hệ nạn nhân, kết luận thắng bên dưới không được chạy.

### A. DEDUCTION SETUP

#### A1. Entry và giao diện

Entry từ `P3_END`, `current_node=FINAL_DEDUCTION_ENTRY`, `current_phase=3`; checkpoint trước Final đã giữ credibility thực có. Người chơi mở trang ráp trong Notebook/DeductionScene. Không mở tab thứ năm. Bốn tab Notebook tiếp tục cho đọc nguồn; ráp là màn được F p204 quy định, không bàn xoay/so chữ ký của Ch5.

Five groups giữ nguyên:

| Nhóm | Câu hỏi hiển thị | Số lựa chọn cần đặt |
| --- | --- | --- |
| WHO | “Hồ sơ quy được hành vi trực tiếp cho ai?” | 1 thẻ |
| WHAT | “Hành động nào giải thích những dữ kiện đã kiểm tra?” | 1 thẻ |
| WHEN | “Có thể xác lập thời điểm hành động đến mức nào?” | 1 thẻ |
| WHY | “Có thể kết luận về lý do hành động đến mức nào?” | 1 thẻ |
| EVIDENCE | “Những nguồn nào nối được các phần kết luận này?” | 4 nguồn, theo vai trò B5 |

Câu hỏi không chứa tên người, thủ đoạn, khoảng giờ hay lý do đúng. Không có thẻ mặc định/ô đã điền hộ. Không tô màu đáp án theo độ đáng ngờ NPC. Thẻ mô tả giả thuyết được ghi rõ “Lựa chọn kết luận”, tránh nhầm nó là một statement mới của NPC.

Người chơi bấm thẻ rồi bấm ô; drag-and-drop có thể dùng cùng hành động nhưng không bắt buộc. Đổi/xóa thẻ, xem ảnh và đọc sổ miễn phí. Mọi nhóm chỉnh được theo thứ tự tùy ý. Chỉ **“Nộp bản tái dựng”** mới kiểm tra đúng/sai/trừ điểm. Không hiện tick đúng từng ô trong lúc ráp.

#### NODE FD_ENTRY

[NARRATION]
Bạn mở trang kế tiếp. Lần này, những câu hỏi nằm riêng khỏi lời khai. Bên cạnh là ảnh, mốc giờ và những dòng đã được sửa.

Bạn đặt bút xuống mép sổ.

[DETECTIVE | Quiet]
"Mỗi kết luận phải có chỗ dựa của nó."

[UI]
“Chọn thẻ cho từng nhóm. Bạn có thể mở nguồn để đọc lại. Nộp khi đã hoàn thành bản tái dựng.”

[GAME STATE]
Mở `FD_BOARD`; không tự điền thẻ, không chạy C hoặc F. Không thêm Evidence/statement. Giữ điểm, giữ trạng thái các vật tùy chọn.

#### A2. Nodes

| Node | Trigger | Next |
| --- | --- | --- |
| FD_ENTRY/FD_BOARD | Điều kiện đầu vào E1 đủ | Chọn/đọc/sửa/nộp |
| FD_SOURCE | Người chơi mở một nguồn đã có | Về BOARD, giữ draft |
| FD_INCOMPLETE | Nộp thiếu ô | BOARD, không phạt |
| FD_INPUT_BLOCKED | Nguồn không có/entry không đủ/save bất nhất | Về P3_HUB hoặc đọc nguồn, không phạt; không giả thu bổ sung |
| FD_REVIEW | Bản đủ ô nhưng sai/thiếu sức chứng minh | BOARD, −20 một lần nộp |
| FD_BAD | Sau nộp sai, credibility về 0 | Load checkpoint; không tái dựng thắng |
| FD_SOLVED | Bản đúng toàn bộ và nguồn đủ | Lưu kết quả → RECON_01 |
| RECON_01–06 | Chỉ sau SOLVED | Notebook final → FD_HANDOFF |
| FD_HANDOFF | Tái dựng hết/skip hợp lệ | Mở Phase 4 entry; không tự viết nội dung Phase 4 |

### B. AVAILABLE CARDS

**Phân loại cho designer:** RIGHT = đáp án đúng đủ phạm vi; WRONG = trái dữ kiện/kết luận trực tiếp đã xác lập; INSUFFICIENT = khả năng hoặc phần đúng nhưng chưa đủ cho slot này. RIGHT/WRONG/INSUFFICIENT không hiện trên thẻ. INSUFFICIENT không có nghĩa khả năng đó bị bác tuyệt đối trong mọi hoàn cảnh.

Không tạo đáp án về Khang/Vũ/MG-07/con tin để gây tò mò bằng một spoiler người chơi chưa có. Tờ khảo sát không vào picker Evidence. WHO chỉ người đã có People; các giả thuyết mới ở WHAT/WHEN/WHY là lựa chọn được nhiệm vụ thiết kế cho phép, không sự kiện mới.

#### B1. WHO

| Card ID | Label người chơi thấy | Designer classification | Nguồn mở thẻ/giới hạn |
| --- | --- | --- | --- |
| DC_WHO_HOA | Hòa | INSUFFICIENT cho việc tráo | People Hòa + ST_P3_HOA_ENTRY/EXCESS; việc lấy tiền chưa quy hành vi thuốc |
| DC_WHO_LINH | Linh | INSUFFICIENT cho việc tráo | People Linh + ST_P3_LINH_THEFT/DISTRESS; trộm/nhân chứng chưa chứng minh người tráo |
| DC_WHO_HAO | Hào | INSUFFICIENT cho việc tráo | People Hào + ST_P3_HAO_VISIT/203_CORROB; lượt thu nợ chưa là tác động vào thuốc |
| DC_WHO_MINH | Minh | RIGHT | ST_P3_MINH_ACT + EV_PackagingMatch/EV_OriginalInhaler; liên hệ cá nhân có kiểm chứng |
| DC_WHO_UNRESOLVED | Chưa quy được cho một người cụ thể | WRONG đối với hồ sơ đã hoàn tất, không phải sai về mọi vụ án | Lựa chọn mức kết luận; màn đã đòi chuỗi cá nhân/nhận kiểm chứng trước entry |

Hòa/Linh/Hào không “sai vì chắc chắn không thể vào”. Họ không đáp ứng WHO cho hành vi đang tái dựng; case conclusion không chứng minh mọi người khác không từng chạm thuốc hoặc không thể đồng phạm.

#### B2. WHAT

| Card ID | Label người chơi thấy | Designer classification | Nguồn/cách phân biệt |
| --- | --- | --- | --- |
| DC_WHAT_SWAP | Lấy ống cũ, đặt lại một ống có nội dung khác thuốc ghi nhãn | RIGHT | PARTIAL/ACT, hai ống, ANALYSIS; không khẳng định Minh tự pha hóa chất |
| DC_WHAT_BENIGN | Chỉ giúp đổi sang một ống thuốc bình thường | WRONG | NORMAL_REPLACEMENT là lời đã bị báo cáo bác; giữ ở lựa chọn để kiểm tra người chơi có dùng lời sửa |
| DC_WHAT_THEFT_ONLY | Chỉ có trộm đồ khiến Tùng lên cơn hen | INSUFFICIENT và không giải thích được kết quả thuốc | Hòa/Linh nhận lấy đồ; giả thuyết sơ bộ cũ không đủ sau report |
| DC_WHAT_STRANGLE | Trực tiếp siết cổ Tùng | INSUFFICIENT, không có chuỗi xác nhận hành vi này | Vết cào là lý do hỏi, không bằng chứng siết; không khẳng định ảnh tự tuyệt đối loại mọi ngoại lực |
| DC_WHAT_NO_INTERVENTION | Không có tác động nào tới thuốc; Tùng chỉ lên cơn tự nhiên | WRONG | Trái nhận tráo và nội dung hai ống/báo cáo |

#### B3. WHEN

| Card ID | Label người chơi thấy | Designer classification | Nguồn/cách phân biệt |
| --- | --- | --- | --- |
| DC_WHEN_WASH_BEFORE_EXIT | Khi Tùng rửa mặt, trước Minh rời và trước lần Hòa vào để biên nhận | RIGHT | ACT + WASH_SCOPE + HOA_SAW_MINH/ENTRY; quan hệ sự kiện |
| DC_WHEN_WHOLE_VISIT | Trong cuộc gặp tối đó, trước 21:00 | INSUFFICIENT: phù hợp nhưng quá rộng so với điều đã làm rõ | MINH_VISIT_DETAIL; chưa nối hoạt động và thứ tự |
| DC_WHEN_EXACT_RECEIPT | Chính xác lúc 20:55 ghi trên biên nhận | WRONG/overprecision | Chọn giờ giấy của Hòa làm giờ thao tác người khác; không đo độc lập |
| DC_WHEN_LINH_VISIT | Khi Linh sang phòng, khoảng 21:05 | WRONG về thứ tự thao tác đã nhận | LINH_DISTRESS là mốc chứng kiến cơn, không giờ đổi ống của Minh |
| DC_WHEN_HAO_VISIT | Trong lượt Hào tới 203 khoảng 21:20 | WRONG về thứ tự thao tác đã nhận | Lượt 203 không timestamp thao tác thuốc; không cần xác nhận Tùng đã chết 21:20 để bác lựa chọn này |

Không có thẻ số “20:50–20:54” cho người chơi trong bản này: đó là actual tác giả, chưa một nguồn lời thoại trực tiếp nói đúng khoảng phút. F cũ 20:45–20:50 không được nhập lại như đáp án. Phần nguồn của thẻ đúng chỉ mở các bản ghi đã có, không thêm đồng hồ/nhân chứng.

#### B4. WHY

| Card ID | Label người chơi thấy | Designer classification | Nguồn/cách phân biệt |
| --- | --- | --- | --- |
| DC_WHY_COERCION_CLAIM | Minh khai bị ép làm theo yêu cầu; người ép và lý do cụ thể chưa rõ | RIGHT, kết luận tạm thời có nhãn lời khai | ST_P3_MINH_COERCION; không chuyển thành mạng lưới được độc lập chứng minh |
| DC_WHY_HELP | Chỉ giúp Tùng thay thuốc hợp lệ | WRONG với lý do đã bị bác | NORMAL_REPLACEMENT + ANALYSIS |
| DC_WHY_MONEY | Vì tiền hoặc món đồ đã lấy ở phòng 204 | INSUFFICIENT | Bí mật tài sản của Hòa/Linh không tự là động cơ Minh |
| DC_WHY_NO_KNOWLEDGE | Minh chắc chắn không biết ống mới có thể gây chết | INSUFFICIENT/overclaim, không phải động cơ đã xác minh | ST_P3_MINH_IGNORANCE là bào chữa; báo cáo không đọc được ý thức |
| DC_WHY_KNOWN_COMMANDER | Làm theo lệnh một người chỉ huy đã được xác định danh tính | INSUFFICIENT | Chỉ có “họ”, chưa tên kẻ ép; không hiện tên người đứng sau làm distractor |
| DC_WHY_NOTHING_RECORDED | Chưa có lời khai nào về lý do tác động | WRONG với dữ liệu đang có | Có lời nhận cưỡng ép; chưa lý do đầy đủ không đồng nghĩa chưa có gì |

Nợ/con gái bị giữ không xuất hiện trong thẻ đúng hoặc sai: người chơi chưa được nghe ở P3. Canon ấy dành Phase 4, không dùng việc người thiết kế biết để chấm màn này.

#### B5. EVIDENCE — bốn ô trong cùng nhóm

Người chơi chọn **một nguồn cho mỗi vai trò**, không đếm tổng Evidence nhiều hơn là thắng. Bốn ô triển khai quy tắc Bible E5 “ba slot vật lý và một lời nhận”; không thêm nhóm suy luận thứ sáu. Trong picker, nhãn/ảnh thẻ giữ nguyên Notebook, kèm nút Xem nguồn; không viết vai trò đúng sẵn lên mặt thẻ.

| Evidence role ID | Câu hỏi ô hiển thị | Nguồn đúng cho designer |
| --- | --- | --- |
| ED_CONTACT | “Nguồn nào trực tiếp nối người được nêu với vật dụng liên quan?” | EV_PackagingMatch |
| ED_REMOVAL | “Nguồn nào kiểm chứng việc vật ban đầu bị mang khỏi phòng?” | EV_OriginalInhaler |
| ED_CONTENT | “Nguồn nào kiểm tra nội dung vật thay thế và liên hệ với nạn nhân?” | EV_MedicineAnalysis |
| ED_ACCOUNT | “Lời khai nào nêu hành vi và thứ tự được các nguồn khác kiểm chứng?” | ST_P3_MINH_ACT |

**Pool Evidence — hiện đúng các ID collected:**

| Evidence ID | Label ngắn | Khả năng hỗ trợ, không hiện như đáp án |
| --- | --- | --- |
| EV_LooseLock | Chốt khóa lỏng | Điều kiện tiếp cận, không người cụ thể |
| EV_WetTowel | Khăn ướt | Hoạt động bồn, không đồng hồ phút |
| EV_NeckScratches | Vết cào cổ | Khó thở/tự cào phù hợp, không chất/người |
| EV_Inhaler | Ống hít ở bàn | Hiện trạng nắp/vị trí; nền cho kiểm tra |
| EV_InhalerBox | Hộp thuốc đã mở | Dấu mở hộp; nền cho đối chiếu mảnh |
| EV_RentReceipt | Biên nhận tiền phòng | Lần vào Hòa cùng nhận, giờ trên giấy |
| EV_MissingWatch | Vòng trống trên bụi | Lấy đồ, không người tráo |
| EV_PackagingMatch | Mảnh hộp khớp | Kiểm chứng liên hệ hộp với đồ Minh, không độc/giờ riêng |
| EV_OriginalInhaler | Ống cũ thu theo chỉ dẫn | Kiểm chứng chi tiết mang/giấu, nhận dạng trong cùng hồ sơ |
| EV_MedicineAnalysis | Báo cáo hai ống và nạn nhân | Khác thuốc nhãn, ống cũ phù hợp, liên hệ nguyên nhân |
| EV_BoundaryCoin | Đồng xu chưa rõ công dụng | Chỉ hiện nếu đã thu; không đủ cho bất kỳ ô chứng minh hành vi thuốc |
| EV_KhangCertificate | Ảnh giấy khen | Chỉ hiện nếu đã thu; không chứng minh hành vi/người ép |

**Pool Statements — chỉ những dòng đã biết dưới đây, không lẫn Evidence ID:**

| Statement ID | Label ngắn | Được chọn nhưng vai trò chính |
| --- | --- | --- |
| ST_P3_MINH_ACT | Minh nhận lấy ống cũ, đặt ống được giao khi Tùng rửa mặt | Đủ ED_ACCOUNT |
| ST_P3_MINH_PARTIAL | Minh nhận đổi/mang ống, còn biện hộ giúp đổi thuốc | Chưa toàn bộ lời sửa cuối; nguồn tham khảo |
| ST_P3_MINH_OLD_LOCATION | Minh chỉ chỗ giấu trước khi tìm | Chi tiết cần đối chiếu vật thu, chưa toàn bộ hành vi |
| ST_P3_MINH_COERCION | Minh nói bị ép, chưa tên người ép | Căn cứ mức WHY, không thay lời hành vi |
| ST_P3_MINH_IGNORANCE | Minh nói không biết sẽ chết | Bào chữa chưa xác minh, không proof ý thức |
| ST_P3_HOA_SAW_MINH | Hòa thấy Minh xuống trước lần mình vào | Hỗ trợ WHEN, chưa hành vi thuốc |
| ST_P3_LINH_DISTRESS | Linh thấy gục/cào, còn sống khoảng 21:05 | Diễn biến nhân chứng, không thấy dùng ống |
| ST_P3_203_CORROB | Cảnh sát đối chứng lượt thu nợ 203 | Vai Hào/giờ lượt tới, không thuốc |

Tất cả nguồn tham khảo vẫn hữu ích khi đọc, nhưng chưa đủ thay cho đúng một vai trò chốt ở nhóm EVIDENCE. Không phạt chỉ vì người chơi mở/đọc chúng. Nếu chọn làm proof chốt rồi nộp, hệ thống phản hồi giới hạn tương ứng ở D.

#### B6. Mở khóa đáp án đúng — không thêm dữ kiện khi ráp

| Đáp án đúng | Các bản ghi phải tồn tại trước entry | Node nguồn hiện có |
| --- | --- | --- |
| WHO Minh | People Minh, ACT, PackagingMatch, OriginalInhaler | P1_MINH_01; P3 R5A/RECOVER/R5B |
| WHAT tráo | PARTIAL, ACT, EV_Inhaler, EV_OriginalInhaler, EV_MedicineAnalysis | P3 R5A/RECOVER/REPORT/R5B |
| WHEN quan hệ sự kiện | MINH_WASH_SCOPE, ACT, HOA_SAW_MINH, HOA_ENTRY | P3 R2/H2–H4/R5B |
| WHY tạm thời | MINH_COERCION | P3 R5C |
| EVIDENCE bốn nguồn | Ba EV gói R, ACT | P3 POLICE_CHECK/RECOVER/REPORT/R5B |

Không yêu cầu P1 đã hỏi rửa mặt: P3 R1 có recovery cùng ST_P1_MINH_WASH. Không yêu cầu xu/giấy khen/khảo sát. Thẻ correct không mở chỉ từ `evidence_master` hoặc dữ liệu tác giả.

### C. CORRECT LOGICAL CHAIN

Phần này là answer key, **không phát trước khi thắng**. Người chơi có thể ráp nhóm theo bất kỳ thứ tự nào; thứ tự logic của dữ kiện là quan hệ chứng minh, không chuỗi UI bắt buộc.

| Bước | Kết nối cần hiểu | Nguồn | Kết luận được phép |
| --- | --- | --- | --- |
| 1 | Hiện trạng thuốc/cơn khó thở đặt ra câu hỏi cần kiểm tra | Inhaler, InhalerBox, NeckScratches, Linh | Có nghi vấn; chưa tráo/người/độc |
| 2 | Phủ nhận xử lý hộp gặp liên hệ vật lý cá nhân | PackagingMatch + lời NO_HANDLING rồi PARTIAL | Minh có xử lý hộp/đổi ống theo nhận; mảnh riêng chưa murder |
| 3 | Chi tiết Minh nói trước tìm được kiểm chứng | OLD_LOCATION + OriginalInhaler + nhận dạng | Ống cũ bị mang/giấu, không chỉ lời nhận vô kiểm chứng |
| 4 | Phân tích hai ống nối với nạn nhân | MedicineAnalysis + report scope | Không lần đổi thuốc bình thường; có liên hệ nguyên nhân theo báo cáo |
| 5 | Lời nhận cuối nối người, hành vi, thứ tự với các bước trên | ACT + WASH_SCOPE + Hòa saw/entry | Minh trực tiếp lấy cũ/đặt ống, khi Tùng rửa mặt, trước rời/Hòa vào |
| 6 | Giữ mức nguồn của lý do | COERCION + IGNORANCE | Người ép/lý do đầy đủ chưa rõ; không xác nhận bào chữa không biết |

Không dùng “Hòa/Linh trộm nên vô tội; Hào có ngoại phạm nên chỉ còn Minh”. Người có cơ hội chưa đồng nghĩa người thực hiện. Lời nhận cuối vẫn quyết định cho hành vi/thứ tự; gói vật chứng và chuyên môn kiểm chứng các phần, không tự cung cấp danh tính người chỉ huy.

**Answer key:**

```json
{
  "who": "DC_WHO_MINH",
  "what": "DC_WHAT_SWAP",
  "when": "DC_WHEN_WASH_BEFORE_EXIT",
  "why": "DC_WHY_COERCION_CLAIM",
  "evidence": {
    "ED_CONTACT": "EV_PackagingMatch",
    "ED_REMOVAL": "EV_OriginalInhaler",
    "ED_CONTENT": "EV_MedicineAnalysis",
    "ED_ACCOUNT": "ST_P3_MINH_ACT"
  }
}
```

Không chỉ so hash ID: kiểm tra nguồn đã mở và flags E1 vẫn hợp lệ. Không chấp nhận cùng bốn nguồn bỏ sai vai trò chỉ vì bag đủ ID; người chơi phải nối việc mà nguồn thực sự chứng minh. Không có thêm đáp án bí mật về phút/kẻ ép.

### D. INCORRECT SELECTION RESPONSES

#### D1. Trước khi nộp

Chọn sai giả thuyết khi ráp chưa phát response hoặc mất điểm. Nộp thiếu ô: [UI] “Bản tái dựng còn ô trống.” Đánh dấu ô trống, không chỉ thẻ đúng. Nguồn chưa mở/entry chưa đủ: [UI] “Bản ghi cần dùng chưa có trong tiến trình này. Hãy kiểm tra lại phần đối chất.” Đây là dữ liệu/handoff bất nhất, không lỗi suy luận của người chơi; không trừ điểm hoặc tự tạo bản ghi.

#### D2. Lỗi WHO/WHAT/WHEN/WHY

Chỉ hiển thị response phù hợp sau một lần nộp bản đầy đủ; **không gọi tên đáp án thay thế**. Câu dưới là độc thoại ngắn của bạn, không một NPC còn đứng gần giải hộ. Label mã lỗi chỉ dành runtime.

| Error ID / lựa chọn | Feedback hiển thị [DETECTIVE | Thoughtful] | Phân loại |
| --- | --- | --- |
| ERR_WHO_PERSON / Hòa, Linh, Hào | “Tôi chưa nối được người mình nêu với hành vi này. Có vào phòng hoặc giấu một chuyện khác vẫn chưa đủ.” | Insufficient, không kết họ vô can mọi việc |
| ERR_WHO_UNRESOLVED | “Bản này bỏ lại phần liên hệ cá nhân đã được đối chiếu. Tôi cần đọc lời sửa cuối, không chỉ lời đầu.” | Underclaim với hồ sơ đủ |
| ERR_WHAT_BENIGN | “Cách giải thích này chưa đối diện kết quả kiểm tra. Tôi đang giữ lại một lời đã bị sửa.” | Trái dữ kiện mới |
| ERR_WHAT_THEFT | “Chuyện mất đồ có thật, nhưng chưa giải thích được tất cả kết quả trên vật dụng và nạn nhân.” | Có phần đúng, thiếu nhân quả |
| ERR_WHAT_STRANGLE | “Một dấu vết gợi hướng hỏi không đủ xác nhận cách gây án. Tôi cần phân biệt hình ảnh với kết luận kiểm tra.” | Nhảy từ dấu vết sang thủ đoạn |
| ERR_WHAT_NO_INTERVENTION | “Bản này không giải thích những thay đổi đã được ghi nhận và kiểm chứng.” | Bỏ dữ kiện về tác động |
| ERR_WHEN_BROAD | “Khoảng tôi chọn bao trùm nhiều hoạt động. Nó chưa dùng phần thứ tự đã được hỏi rõ.” | Đúng rộng nhưng thiếu liên kết |
| ERR_WHEN_EXACT | “Giờ ghi cho một việc không tự là giờ của việc khác. Tôi đang đặt độ chính xác cao hơn nguồn cho phép.” | Overprecision |
| ERR_WHEN_WITNESS | “Mốc được chọn là lúc một người chứng kiến diễn biến. Chưa có cơ sở đặt hành động khác vào đúng lúc ấy.” | Nhầm giờ hậu quả với giờ tác động |
| ERR_WHEN_OTHER_VISIT | “Một lượt tới đã được đối chứng không tự trở thành thời điểm của hành vi đang xét.” | Nhầm lượt tới với thao tác |
| ERR_WHY_HELP | “Lý do này phụ thuộc một cách giải thích về thuốc mà kết quả đã không giữ được.” | Lý do cũ bị bác |
| ERR_WHY_MONEY | “Tôi đang chuyển bí mật của một người sang lý do của người khác. Nguồn chưa nối hai việc ấy.” | Gán động cơ không có nguồn |
| ERR_WHY_KNOWLEDGE | “Điều một người nói mình không biết chưa chứng minh họ thực sự không biết.” | Biến bào chữa thành sự thật |
| ERR_WHY_COMMANDER | “Bản này đi xa hơn lời khai hiện có về người ra lệnh. Chưa có nguồn xác lập danh tính.” | Vượt mức bí ẩn được mở |
| ERR_WHY_NOTHING | “Chưa biết đầy đủ khác với chưa có lời khai nào. Tôi cần giữ đúng mức đã nghe.” | Xóa cả thông tin tạm thời |

Không phản hồi “Hãy chọn Minh”, “Khi Tùng rửa mặt” hoặc “Chọn mảnh hộp”. Giữ draft nguyên, chỉ đánh dấu nhóm cần xem lại; không auto-fill/loại thẻ đúng-sai khỏi pool.

#### D3. Lỗi EVIDENCE theo loại nguồn

| Nguồn chọn làm proof chốt không đủ/sai vai trò | Feedback [DETECTIVE | Thoughtful] |
| --- | --- |
| EV_LooseLock | “Khả năng đi qua cửa chưa nối riêng một người với hành vi đã chọn.” |
| EV_WetTowel | “Tình trạng khăn hỗ trợ một hoạt động. Nó không tự xác định phút hay người tác động vào vật khác.” |
| EV_NeckScratches | “Vết cào chưa cho biết chất trong vật dụng hoặc ai đã thay nó.” |
| EV_Inhaler | “Ảnh hiện trạng không thay phần kiểm tra nội dung và nguyên nhân.” |
| EV_InhalerBox | “Hộp đã mở đặt ra nghi vấn. Riêng hộp chưa xác định người xử lý hoặc chất bên trong.” |
| EV_RentReceipt | “Giấy này có nguồn cho một lượt vào và việc thu tiền. Vai trò chốt đang chọn cần một liên hệ khác.” |
| EV_MissingWatch | “Dấu món đồ bị lấy không tự chứng minh tác động vào thuốc.” |
| EV_BoundaryCoin, nếu đã thu | “Công dụng vật này còn chưa rõ. Tôi đang dùng một điều chưa hiểu để gánh kết luận khác.” |
| EV_KhangCertificate, nếu đã thu | “Tài liệu công khai này chưa nối được với hành vi trong vụ án.” |
| ST_P3_MINH_PARTIAL | “Đây là lời nhận từng phần còn giữ cách biện hộ cũ. Nó chưa thay cho phần hành vi đã được hỏi rõ về sau.” |
| ST_P3_MINH_OLD_LOCATION | “Chỉ chỗ trước lúc tìm là chi tiết có thể kiểm tra. Một mình nó chưa nêu đủ hành vi đang tái dựng.” |
| ST_P3_MINH_COERCION | “Lời này nói về sức ép, chưa tự kiểm chứng hành động vật lý hoặc nội dung vật dụng.” |
| ST_P3_MINH_IGNORANCE | “Một lời bào chữa chưa thể thay chứng cứ kiểm tra hoặc lời nhận hành vi.” |
| ST_P3_HOA_SAW_MINH | “Quan hệ trước–sau hỗ trợ thứ tự. Nó chưa cho nhân chứng thấy việc tác động vào thuốc.” |
| ST_P3_LINH_DISTRESS | “Lời nhân chứng chỉ giữ phần họ đã thấy. Tôi không thể thêm một hành động họ không nhìn được.” |
| ST_P3_203_CORROB | “Đối chứng ấy xác nhận một lượt tới, chưa kiểm chứng thao tác trong phòng khác.” |

**Nguồn chốt đúng nhưng đặt nhầm vai trò:**

| Nguồn | Feedback khi sai vai trò |
| --- | --- |
| EV_PackagingMatch | “Liên hệ vật lý này chưa tự trả lời mọi câu hỏi về nội dung, thời điểm hoặc ý định.” |
| EV_OriginalInhaler | “Việc tìm đúng vật kiểm chứng một chi tiết lời nhận. Nó chưa thay được kết quả trên vật thay thế và nạn nhân.” |
| EV_MedicineAnalysis | “Kết quả kiểm tra xác lập phần nội dung và nguyên nhân, chưa tự chỉ người thao tác hoặc phút họ làm.” |
| ST_P3_MINH_ACT | “Lời nhận cần được kiểm chứng bằng nguồn khác. Tôi đang để nó làm cả việc mà một nguồn độc lập phải gánh.” |

Không nói “thẻ này vô dụng”; feedback chỉ giới hạn vai trò. Điều đó cho phép người chơi đọc lại hỗ trợ mà không bị dạy sai ý nghĩa Evidence.

#### D4. Nhiều lỗi trong một bản

Validator chọn một feedback sau submit, theo thứ tự cố định: WHAT trái báo cáo → WHO chưa có liên hệ → WHEN → WHY → EVIDENCE theo thứ tự ED_CONTACT/REMOVAL/CONTENT/ACCOUNT. Một lần nộp có nhiều lỗi vẫn chỉ −20; không liệt kê tất cả chỗ sai để lộ dần toàn bộ answer key. Các nhóm khác không được tô xanh dù đã đúng. Lần nộp lại là lượt mới, không xử lý hai lần do click nhanh.

[ACTION]
Bạn kéo trang kết luận về phía mình, đọc lại phần được đánh dấu.

[GAME STATE]
`credibility=max(0,credibility-20)` một lần; `flags.deduction_solved=false`; giữ draft. Nếu điểm còn >0, về BOARD; nếu 0, FD_BAD. Không thưởng điểm khi sửa đúng một ô hoặc khi thắng.

#### NODE FD_BAD

[NARRATION]
Bạn gấp sổ lại. Những liên hệ chưa đứng vững khiến phần điều tra của bạn phải dừng.

[NPC: CẢNH SÁT | Firm]
"Chúng tôi sẽ tiếp tục lấy lời khai và kiểm tra. Anh dừng đối chiếu ở đây."

[UI]
“Tải checkpoint trước Final” / “Tải checkpoint đầu Phase 3”. Khôi phục snapshot đúng điểm/nguồn đã lưu, không cộng điểm vào state hiện tại. Không thêm thám tử chết, kết án nhầm thành Canon hoặc chạy RECON.

### E. COMPLETION CONDITIONS

#### E1. Điều kiện đủ dữ liệu — trước và lúc nộp

Giữ gate Final của P3, thêm kiểm tra tính toàn vẹn nguồn mà các đáp án dùng; không thêm nhiệm vụ hay lời khai mới. Các flags/source đã được tạo ở P3. Nếu source record thiếu dù flag có, đây là save/build lỗi, không thứ người chơi phải tự đoán để vượt.

```js
const CASE7 = ["EV_LooseLock", "EV_WetTowel", "EV_NeckScratches",
  "EV_Inhaler", "EV_InhalerBox", "EV_RentReceipt", "EV_MissingWatch"];
const PACKAGE3 = ["EV_PackagingMatch", "EV_OriginalInhaler", "EV_MedicineAnalysis"];
const REQUIRED_STATEMENTS = [
  "ST_P3_MINH_PARTIAL", "ST_P3_MINH_OLD_LOCATION", "ST_P3_MINH_ACT",
  "ST_P3_MINH_COERCION", "ST_P3_MINH_WASH_SCOPE",
  "ST_P3_HOA_ENTRY", "ST_P3_HOA_SAW_MINH", "ST_P3_LINH_DISTRESS",
  "ST_P3_203_CORROB", "ST_P3_REPORT_SCOPE"
];
const sourcesReady = [...CASE7, ...PACKAGE3].every(id =>
  evidence_collected.includes(id) && !!evidence_records[id])
  && REQUIRED_STATEMENTS.every(id => !!statements[id]);
const entryReady = sourcesReady && flags.deduction_unlocked
  && flags.phase3_dialogue_complete && flags.hoa_resolved
  && flags.linh_resolved && flags.hao_resolved
  && flags.old_account_corrob && flags.victim_link_confirmed
  && flags.minh_act_admitted && flags.minh_coercion_admitted
  && flags.minh_resolution_recorded && credibility > 0;
```

Source record cần nguồn node/hồ sơ tương ứng; `victim_link_confirmed` không thay nội dung chuyên môn của ANALYSIS. Không mở nếu chỉ có tên thẻ mà phần nạn nhân bị lược mất. Chuỗi đầu vào không đòi EV_BoundaryCoin/EV_KhangCertificate hoặc survey_seen.

#### E2. Điều kiện thắng

Tám ô hoàn chỉnh: bốn nhóm đơn WHO/WHAT/WHEN/WHY + bốn ô EVIDENCE; ID hợp pool đã mở; không thiếu nguồn; toàn bộ answer key C đúng vai trò; credibility >0. Các ô EVIDENCE là nguồn khác nhau, không lặp ACT bốn lần. Không chấm theo vị trí pixel hoặc thứ tự kéo thẻ. ID đúng là quy ước chấm của câu hỏi có phạm vi cụ thể, không tuyên bố mọi nguồn khác không hữu ích.

Nếu thiếu ô hoặc thiếu dữ liệu, không phạt. Nếu bản hoàn chỉnh, hợp lệ về dữ liệu nhưng sai kết luận, phạt −20. Thắng không tăng/reset điểm. Giữ state schema version 2 của P1/P3.

```json
{
  "deduction": {
    "chapter_id": 1,
    "draft": {
      "who": null, "what": null, "when": null, "why": null,
      "evidence": {
        "ED_CONTACT": null, "ED_REMOVAL": null,
        "ED_CONTENT": null, "ED_ACCOUNT": null
      }
    },
    "attempt_count": 0,
    "result": null,
    "reconstruction_node": null
  }
}
```

JSON trên là phần mới của **cùng save root**, không save tách. Boolean vào flags. Draft lưu khi đổi thẻ/đóng/đọc nguồn. Checkpoint trước Final không bị ghi đè mỗi lần nộp; snapshot giữ điểm lúc mở. Khi load giữa RECON, tiếp node đã lưu, không phát bản thắng/Notebook update/bắt người hai lần. Click Nộp khóa trong handler để một event chỉ commit một attempt.

#### NODE FD_SOLVED

[ACTION]
Những đường nối giữa các thẻ hiện rõ. Bạn đặt đầu bút dưới dòng cuối, lần này không gạch đi.

[UI]
“Bản tái dựng có đủ nguồn hỗ trợ trong phạm vi hồ sơ.”

[GAME STATE]
`flags.deduction_solved=true`; lưu answer key người chơi đã nộp vào deduction.result cùng source IDs/phạm vi. `deduction.reconstruction_node=RECON_01`; chưa current_phase=4/chapter1_complete. Chỉ lúc này mới chạy cảnh F.

### F. CINEMATIC RECONSTRUCTION SCRIPT

**Chỉ phát sau FD_SOLVED.** Đây là hình dung có chú thích nguồn theo hồ sơ, không tương tác Flashback Ch5 hoặc camera thấy mọi thứ. Dùng background 204 đã có, crop/ảnh Inspect, fade, chữ và âm thanh. Không cần model pháp y, sprite Tùng có hành động mới hoặc ảnh nhà quá khứ. Các động tác có thể kể trên nền tĩnh. Không thêm thoại quá khứ Tùng/ý nghĩ Minh, liều chất, thao tác pha, người giao hoặc phút chết.

#### RECON_01 — SAU VÁCH

[UI]
“Tái dựng từ vật chứng, lời khai đã đối chiếu và kết quả kiểm tra. Thứ tự không đồng nghĩa mọi phút đã được đo.”

[NARRATION]
Trang sổ mờ đi, để lại góc phòng 204. Vách che bồn rửa khỏi khu bàn. Tiếng nước nhỏ giọt nối với ảnh chiếc khăn còn sũng.

Trong bản tái dựng, Tùng ở phía sau vách. Minh còn ở khu bàn.

[SOURCE CAPTION]
Khăn ướt; lời Minh làm rõ vị trí và nhận hành vi. Không ghi khoảng phút trên hình.

#### RECON_02 — CHIẾC ỐNG ĐƯỢC ĐỂ LẠI

[NARRATION]
Bạn đặt lời nhận cuối cạnh hai hình ống hít. Minh lấy ống cũ, đặt ống được giao lên bàn. Hộp được mở rồi bỏ vào thùng rác.

Ảnh mép rách hiện cạnh mảnh nắp giấy trong đồ Minh. Hai phần nối nhau ở đường rách và họa tiết. Phần Minh từng phủ nhận đã có chỗ đối chiếu.

[ACTION]
Hai ảnh nằm cạnh nhau, không tự ghép thành trò so khớp mới.

[SOURCE CAPTION]
EV_PackagingMatch + ST_P3_MINH_PARTIAL/ACT. Mảnh không tự chứng minh độc tính.

#### RECON_03 — NHỮNG NGƯỜI ĐẾN SAU

[NARRATION]
Minh rời phòng. Hòa thấy anh xuống trước lần mình vào lấy tiền, để lại biên nhận mang giờ 20:55.

Hòa chỉ nhìn khu bàn. Phía sau vách nằm ngoài phần lão đã kể mình nhìn thấy. Tờ giấy không nói thay được tình trạng Tùng lúc ấy.

Bạn chuyển sang lời Linh: khoảng 21:05, cô vào lấy đồng hồ; cô thấy Tùng gục, tay cào cổ, vẫn còn cử động. Cô bỏ chạy. Phần lời kể ấy không có cảnh cậu dùng ống hít.

Ở một mốc khác, lượt Hào tới thu nợ 203 khoảng 21:20 được đối chứng. Nó giải thích lượt tới của anh, chưa chứng nhận anh ở đâu trong mọi khoảng còn lại.

[SOURCE CAPTION]
Các giờ là giờ ghi giấy hoặc giờ nhớ; không nhãn “Tùng chết 21:20”. Nguồn Hòa/Linh/relay 203 được giữ riêng.

#### RECON_04 — PHẦN THUỐC

[NARRATION]
Bạn trở lại ảnh chiếc ống mở nắp trên bàn. Theo bản tái dựng phù hợp báo cáo, trong cơn khó thở Tùng tìm đến chiếc ống ở đó. Nhưng thứ được để lại không có nội dung thuốc như nhãn.

Ảnh hiện trường dừng ở Tùng nằm trên sàn cạnh giường. Phần kết quả kiểm tra đặt bên cạnh, nối vật dụng ấy với diễn biến hô hấp dẫn tới cái chết.

Vết cào và lời nhân chứng giữ dấu của cơn khó thở. Báo cáo mới là phần kiểm tra nội dung thuốc và liên hệ nguyên nhân.

[SOURCE CAPTION]
EV_MedicineAnalysis có phần nạn nhân + hiện trạng + Canon đã duyệt. Đoạn dùng ống là tái dựng theo chuỗi, không đổi Linh thành người thấy xịt thuốc. Không diễn kỹ thuật xịt, số lần/liều hoặc phút chết.

#### RECON_05 — LỜI CHỈ CHỖ

[NARRATION]
Ống cũ được tìm ở hốc Minh chỉ trước khi cảnh sát đi kiểm tra. Nhãn cá nhân và hồ sơ thuốc Tùng được đối chiếu trong bản ghi.

Bạn lật lại lời “chỉ giúp thay thuốc bình thường”. Chi tiết mang ống cũ đã được kiểm chứng; lý do bình thường không đứng được trước nội dung hai ống và kết quả trên nạn nhân.

Lời nhận cuối nối các phần ấy: Minh trực tiếp lấy ống cũ, đặt ống được giao khi Tùng rửa mặt, trước lúc anh rời và trước lần Hòa vào.

[SOURCE CAPTION]
Ống cũ + báo cáo + ACT. Không thêm nguồn nhận dạng hoặc khoảng 20:50–20:54 vào Player Timeline.

#### RECON_06 — TRỞ LẠI TRANG SỔ

[NARRATION]
Nền phòng trọ nhạt đi. Trang sổ trở lại dưới tay bạn.

Minh đã nhận hành vi. Anh cũng nói mình bị ép, nhưng người ép và lý do cụ thể chưa có ở những trang này. Câu “không biết sẽ chết” vẫn được giữ dưới tên người nói, không trở thành kết luận của bạn.

Bạn viết dưới phần đã khép: **Người ép — chưa xác định.**

[DETECTIVE | Quiet]
"Phần này còn phải hỏi tiếp."

[GAME STATE]
`flags.reconstruction_complete=true`; chuyển FD_NOTEBOOK_FINAL. Không phát thoại nợ/con tin, chức năng xu hoặc cảnh quá khứ trước Phase 4 được chọn.

### G. FINAL NOTEBOOK UPDATE

#### NODE FD_NOTEBOOK_FINAL

[NOTEBOOK UPDATE]
**Kết luận vụ án phòng 204:** hồ sơ quy hành vi lấy ống cũ và đặt ống có nội dung khác thuốc nhãn cho Minh. Lời nhận hành vi được hỗ trợ bởi mảnh hộp khớp, ống cũ thu đúng chỗ chỉ và báo cáo nội dung/quan hệ nạn nhân.

**Thời điểm:** khi Tùng rửa mặt, trước Minh rời và trước Hòa vào để biên nhận. Chưa xác minh phút cụ thể.

**Lý do:** Minh khai bị ép. Người ép và lý do cụ thể cần hỏi tiếp. Mức biết độc tính chưa được xác nhận chỉ từ lời bào chữa.

| Tab | Update | Điều không đổi |
| --- | --- | --- |
| People | Minh: người trực tiếp tráo theo kết luận case; Hòa/Linh/Hào: vai đã làm rõ, chưa có chuỗi quy hành vi thuốc | Không mọi người khác vô can tất cả tội/đồng phạm; chưa tên Vũ từ tác giả |
| Evidence | Thêm liên kết vai trò trong deduction.result tới ba EV gói R; không tạo thẻ mới | Xu/giấy khen chỉ tồn tại nếu collected; không khảo sát EV |
| Statements | Giữ revision/lời nhận đã có và liên kết ACT/COERCION tới result | Không đổi IGNORANCE thành verified; không sửa lời cũ thành luôn luôn thật |
| Timeline | Gắn kết luận theo quan hệ vào TL_P3_SWAP đã có, kèm source/corroboration | Không numeric phút chưa nghe/giờ tử vong mới |

Kết luận tổng hợp lưu `deduction.result`, không cấp `EV_FinalVerdict`, không tab mới. UI có thể hiện “Kết luận vụ án” trong Notebook overlay; dữ liệu vẫn bốn tab/root deduction. Không gạch chéo tên nạn nhân như tên nghi phạm bị loại. Không giữ đáp án tác giả trong mô tả nguồn.

[GAME STATE]
`flags.final_notebook_updated=true` sau commit một lần; tiếp FD_HANDOFF. `evidence_collected` không đổi.

### H. NEXT PHASE TRIGGER

#### NODE FD_HANDOFF

[NARRATION]
Bạn gấp trang tái dựng. Sau phần hành vi đã được nối bằng nguồn là câu hỏi về sức ép khiến Minh làm việc đó.

[UI]
“Tiếp tục — Hậu quả vụ án.”

[GAME STATE]
Người chơi chọn Tiếp tục khi deduction_solved && reconstruction_complete && final_notebook_updated:

`flags.phase3_complete=true`; `flags.phase4_unlocked=true`; `current_phase=4`; `current_node="P4_ENTRY"`; giữ credibility, nguồn, optional flags; lưu tiến trình.

Không set chapter1_complete/chapter2_unlocked ở đây. Phase 4 còn cần nói hậu quả, mở thông tin đúng phạm vi, xử lý fallback xu/giấy khen trước kết chương. Nếu P4 chưa được viết sau lựa chọn phương án, runtime prototype dừng ở entry chờ nội dung; không dùng đề xuất chưa duyệt làm kịch bản chính thức.

### I. EVIDENCE SUFFICIENCY AUDIT

| Kết luận | Nguồn thực mở trước Final | Đủ đến đâu | Chưa đủ cho |
| --- | --- | --- | --- |
| Có thay đổi ống không bình thường | PARTIAL/ACT + ống cũ/ống bàn + ANALYSIS | Hành vi nhận và nội dung hai ống kiểm tra phù hợp | Ai chuẩn bị chất, công ty cụ thể |
| Minh trực tiếp thực hiện | PackagingMatch + partial/ACT + tìm đúng ống chỉ trước | Chuỗi cá nhân có nhận được kiểm chứng | Chỉ riêng mảnh hộp làm proof murder; tuyệt đối bác mọi đồng phạm |
| Chất trong ống bàn liên hệ cái chết | ANALYSIS với phần nạn nhân + REPORT_SCOPE | Theo kết luận chuyên môn được gói R duyệt | Chỉ ngửi/nhìn; chỉ có chất trong đồ mà thiếu nạn nhân |
| Khi rửa mặt, trước rời/Hòa vào | ACT/WASH_SCOPE + Hòa saw/entry, receipt hỗ trợ | Quan hệ sự kiện có lời nhận phù hợp thứ tự | Phút độc lập 20:50–20:54 hoặc 20:55 |
| Khó thở khoảng 21:05, còn sống | LINH_DISTRESS + ảnh vết cào | Lời chứng và hiện trạng phù hợp | Linh thấy xịt; chết đúng phút, đã chết khi Hào tới |
| Lượt Hào tới 203 | HAO_VISIT/203_CORROB | Một lượt thu nợ khoảng 21:20 có đối chứng | Ngoại phạm cả tối hoặc chứng minh mọi hành vi trước |
| Cưỡng ép | COERCION | Đã có lời nhận, Canon tác giả giữ; WHY chốt tạm thời | Người ép, nợ/con tin chưa nghe, chủ mưu mạng lưới |
| Không biết sẽ chết | IGNORANCE | Chỉ lời bào chữa lưu đúng nguồn | Xác nhận tâm lý/ý thức khách quan |
| Hình xu/giấy khen | Chỉ có nếu đã thu | Đã có ảnh công khai hoặc vật chưa rõ | Quy Minh trực tiếp bằng xu, Khang chủ mưu, số phận em gái |

**Đủ để kết:** người trực tiếp tác động, hành vi đổi ống, thời điểm theo quan hệ và phần nhân quả chuyên môn đã duyệt. **Không đủ để kết:** toàn bộ tổ chức, ý định mọi cấp, phút chết, người giao/nguồn công ty hoặc tính vô can tuyệt đối của mọi người khác. Không có Evidence mới hoặc NPC mới để lấp các phần này.

**Kiểm tra chơi thiếu optional:** bỏ mọi câu P1 tùy chọn → P3 recovery lời rửa mặt; P2 rời với năm core → P3 quay lại thu khăn/hộp trước vòng cần; bỏ xu/giấy khen/khảo sát → Final vẫn đủ, không auto-collect. Nếu cắt gói R hoặc phần nạn nhân, entry bị khóa và không chạy cảnh kết luận thắng.
