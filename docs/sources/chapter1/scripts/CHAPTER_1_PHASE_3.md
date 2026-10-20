# CHAPTER 1 — ÁN MẠNG TRONG PHÒNG TRỌ
## PHASE 3 — NHỮNG LỜI NÓI DỐI ĐẦU TIÊN

**Bản thảo triển khai 1.0.** Nguồn: Bible 1.2, Phase 1 bản 1.2 đã áp dụng fixes được duyệt, Phase 2 bản thảo cùng lượt và F p155–p216, S Ch1, P mục 3.2/3.3, MASTER PROMPT. Phase 2 vừa được viết theo yêu cầu, chưa tự coi văn bản ấy là đã được người thiết kế duyệt. Hai bản thảo dùng cùng một hợp đồng dữ liệu để có thể duyệt cùng nhau.

Gói `EV_PackagingMatch`, `EV_OriginalInhaler`, `EV_MedicineAnalysis` đã được duyệt trong R/D01 và Bible C3a; không phải vật chứng quyết định mới tự tạo ở lượt này. Các ID ST/TL/NODE dưới đây là mã triển khai, không thẻ Evidence mới. Nguồn cũ kết Minh bằng ống+hộp+giờ đã được thay bởi chuỗi R; không khôi phục lỗ hổng đó.

### A. PHASE OVERVIEW

- **Cốt truyện:** lời khai ban đầu bị thu hẹp rồi sửa; bạn biết việc Hòa lấy tiền, Linh lấy đồng hồ, Hào thu nợ. Minh bị hỏi về cơ hội, nhưng chỉ nhận khi chứng cứ cá nhân và kết quả kiểm tra chống được các cách biện hộ.
- **Gameplay:** Press miễn phạt mọi statement đã biết; Present thẻ đã thu vào statement đang chọn; đúng có thể chỉ mở lời mới. Sai −15, response theo thẻ. Đối chiếu Statements/Timeline không phải mini-game mới. Hoàn tất mở Final Deduction, chưa tự nộp đáp án hoặc viết Phase 4.
- **Không gian:** background hành lang/sảnh cầu thang đã có từ Phase 1; phòng 204 dùng lại khi bổ sung Inspect trước skip. Không gameplay đi tới nơi giấu ống; cảnh sát tìm và cung cấp ảnh theo gói R. Chờ kiểm tra là chuyển thời gian bằng text/fade, không địa điểm hay xét nghiệm do người chơi làm.
- **Nhịp:** bốn người có thể hỏi trước theo lựa chọn. Hòa/Linh/Hào là các nhánh; Minh R1 có thể chạy sớm. R4/R5 cần lời sửa/đối chứng. Không bắt Hòa → Linh → Hào theo thời gian cứng. Đọc/Press không đếm giờ thế giới.
- **Điều kiện vào:** Phase 2 đã kết, năm thẻ core có đủ, bốn initial có đủ. Khăn/hộp có thể vắng; UI có đường quay lại. Không giả đã đọc khảo sát, có xu hay giấy khen.
- **Điều kiện kết:** vai ba người được ghi đúng phạm vi, bảy thẻ vụ án có đủ, gói R đã ghi, lời nhận kiểm chứng đã có, báo cáo liên hệ nạn nhân đủ. Người chơi chọn mở Final. Chỉ mở giao diện; Phase 4 vẫn khóa đến Final đúng.

#### A1. Điều khiển chung

`P3_ENTRY → P3_HUB`. Hub chọn Hòa/Linh/Hào/Minh, Notebook, Quay lại 204 (3a), Làm việc với cảnh sát khi yêu cầu đủ, Đọc giấy khen (tùy chọn, nền hành lang). Mỗi cuộc hỏi có Kết thúc tạm → hub, không reset vòng. Không tự chuyển sang người kế tiếp.

| Nhánh/node | Gate | Kết quả/đích |
| --- | --- | --- |
| P3_HOA_START/H1/H2/H3/H4 | initial Hòa; receipt có từ core | Press → Present receipt → Press lần vào/tiền → hoa_resolved |
| P3_LINH_START/L1/L2/L3/L4 | initial Linh; missingwatch core | Press → Present vòng bụi → giải thích → Press đồng hồ/chứng kiến → linh_resolved |
| P3_HAO_START/A1/A2/A3/A4 | initial Hào | Press vị trí/việc/giờ → cảnh sát đối chứng 203 → hao_resolved |
| P3_MINH_R1 | initial Minh | Đến/rời/rửa mặt; recovery lời optional → minh_r1_done |
| P3_MINH_R2 | R1 + bảy thẻ vụ án | Khăn và phạm vi khu bàn; không chứng minh tráo |
| P3_MINH_R3A/R3B | R2 | Present ống, rồi hộp → mở phủ nhận xử lý thuốc |
| P3_MINH_R4 | R3 + lời Hòa/Linh + lượt Hào đối chứng | Người chơi chọn đối chiếu ba lời → opportunity_reviewed |
| P3_POLICE_CHECK | R4 + phủ nhận thuốc, bảy thẻ | Minh giao áo khoác, cảnh sát ghi mảnh khớp → EV_PackagingMatch |
| P3_MINH_R5A | mảnh khớp đã thu | Present bác phủ nhận → nhận từng phần/thay thuốc giúp |
| P3_MINH_OLD_LOCATION/P3_RECOVER | đã nhận từng phần + Press chỗ ống cũ | Cảnh sát thu/nhận dạng → EV_OriginalInhaler |
| P3_MINH_OLD_REVIEW | đã thu ống cũ; Present xác nhận | Kiểm chứng chi tiết nhận, giữ lý do đổi thuốc bình thường |
| P3_SEND/P3_WAIT/P3_REPORT | bảy thẻ + gói trước + các vai; người chơi gửi | Time skip 3a→3b; kết quả đủ → EV_MedicineAnalysis |
| P3_MINH_R5B/R5C | đã đọc báo cáo đủ | Present bác thay thuốc bình thường → nhận hành vi/cưỡng ép, Press phạm vi |
| P3_READY/P3_END | final_ready | Chọn mở Final; không giải/nộp thay |

### B. STATEMENT DATABASE

Giữ các ID Phase 1. Statements có `speaker`, `text`, `source_node`, `precision`, `status`, `revision`, `press_node`; statement cũ bị sửa vẫn ở lịch sử. UI không ghi “hung thủ” trước nhận kiểm chứng. Bảng dưới là hợp đồng, không tự phát vào Notebook khi vào Phase.

#### B1. Statements mang từ Phase 1

| Statement ID | Nội dung | Press node | Present tại Phase 3 |
| --- | --- | --- | --- |
| ST_P1_HOA_INITIAL | Chỉ lên một lần 21:30, chưa vào | P3_H1 | EV_RentReceipt; EV_LooseLock chỉ hỗ trợ quyền vào, không thắng |
| ST_P1_HOA_CALLS | Nói đã gọi cảnh sát/Minh | D.HOA_CALLS | Không đích bác hợp lệ |
| ST_P1_HOA_DOOR | Nói gọi/nhìn từ cửa | D.HOA_DOOR | Receipt có thể chọn thay initial, cùng một tiến trình |
| ST_P1_LINH_INITIAL | Ngủ từ khoảng tám giờ, không biết | P3_L1 | EV_MissingWatch mở hỏi đồng hồ, chưa tự chứng minh chủ sở hữu |
| ST_P1_LINH_TIME | Giờ ngủ ước lượng | D.LINH_TIME | Không đích bác riêng |
| ST_P1_HAO_INITIAL | Qua 204 để thu nợ 203 | P3_A1 | Không Evidence refute hợp lệ; Press/đối chiếu Timeline |
| ST_P1_HAO_TIME | Tới khoảng 21:20 | P3_A2 | Không thẻ định giờ; đối chứng qua cảnh sát |
| ST_P1_HAO_STANDING | Đang đứng hút thuốc lúc được hỏi | D.HAO_STANDING | Không dùng bác lượt 21:20 |
| ST_P1_MINH_INITIAL | Tới khoảng 20:45, rời trước 21:00, Tùng bình thường | P3_MINH_R1 | Không bác câu bình thường bằng ống hít |
| ST_P1_MINH_TOPIC | Chuyện riêng/tán gẫu | D.MINH_TOPIC | Chưa có refute bằng hình ảnh |
| ST_P1_MINH_WASH | Tùng bảo rửa mặt trước khi Minh rời | P3_MINH_R2 | Khăn hỗ trợ, không refute; chưa có thì R1 Press mở |

#### B2. Statements mới, chỉ ghi ở node nguồn

| ID | Nội dung chuẩn hóa cho Notebook | Unlock | Press node | Status/phạm vi |
| --- | --- | --- | --- | --- |
| ST_P3_HOA_REPEAT | Vẫn khẳng định chỉ lên 21:30/chưa vào | H1 | P3_H1_REPRESS | Lời khai, bị receipt + nhận sửa |
| ST_P3_HOA_RECEIPT_DEFENSE | Có thể viết giấy, phủ nhận đã vào để đặt | H2 nửa đầu | D.HOA_RECEIPT_DEFENSE | Chống chế, không giả thêm người mang giấy |
| ST_P3_HOA_ENTRY | Nhận vào khoảng giờ ghi 20:55, lấy tiền/để giấy; không thấy Tùng ở khu bàn | H2 kết/H3 | D.HOA_ENTRY | Lời nhận phù hợp giấy; không thấy cả phòng |
| ST_P3_HOA_EXCESS | Lấy hơn khoản nợ; giấy chỉ ghi nợ | H3 | D.HOA_EXCESS | Lời nhận; không chốt số tiền |
| ST_P3_HOA_SAW_MINH | Thấy Minh xuống trước lần mình vào | H4 | D.HOA_SAW_MINH | Nhân chứng, không đo khoảng 20:54 độc lập |
| ST_P3_LINH_REPEAT | Không rời phòng trước được gọi | L1 | P3_L1_REPRESS | Phủ nhận cụ thể, sửa sau |
| ST_P3_LINH_WATCH_DEFENSE | Đồng hồ trên tay là của cô | L2 | P3_L3 | Lời dối che trộm; vòng bụi chưa đủ nhận dạng |
| ST_P3_LINH_THEFT | Nhận vào 204, lấy đồng hồ từ tủ khoảng 21:05 | L3 | D.LINH_THEFT | Lời nhận + đồng hồ lộ; giờ ước lượng |
| ST_P3_LINH_DISTRESS | Thấy Tùng gục/cào cổ, còn sống; không xác nhận thấy dùng ống | L4 | D.LINH_DISTRESS | Nhân chứng cuối trong những lời đang có, chưa pháp y |
| ST_P3_LINH_FLED | Tưởng hen như thường, sợ lộ trộm nên bỏ chạy | L4 | D.LINH_FLED | Lời giải thích chủ quan |
| ST_P3_HAO_VISIT | Khoảng 21:20 thu nợ 203, đứng hút thuốc đoạn gần 204 sau đó | A2 | D.HAO_VISIT | Nhận đủ việc; không ngoại phạm toàn đêm |
| ST_P3_HAO_EMPLOYER | Từ chối nêu người thuê | A3 | D.HAO_EMPLOYER | Chưa mở Vũ |
| ST_P3_203_CORROB | Cảnh sát truyền kết quả người 203 xác nhận lượt Hào tới thu nợ khoảng 21:20 | A4 | D.203_CORROB | Corroborated visit, không phút đo hay mọi khoảng trước |
| ST_P3_MINH_VISIT_DETAIL | Nhớ đến khoảng 20:45, rời trước 21:00; không nhìn giờ rời | R1 | D.MINH_VISIT_DETAIL | Lời khai ước lượng |
| ST_P3_MINH_WASH_SCOPE | Tùng rửa mặt sau vách, Minh còn ở bàn một lúc rồi đi | R2 | D.MINH_WASH_SCOPE | Làm rõ cơ hội, chưa tác động thuốc |
| ST_P3_MINH_MEDICINE | Nhận ra ống hít; nói Tùng có hen, có thể do thời tiết | R3A | D.MINH_MEDICINE | Không xác nhận hen là nguyên nhân chết |
| ST_P3_MINH_BOX_UNKNOWN | Nói không biết ai bóc hộp, khi nào | R3B mở | D.MINH_BOX_UNKNOWN | Không refute bằng hộp một mình |
| ST_P3_MINH_NO_HANDLING | Phủ nhận đã cầm ống hoặc xử lý hộp trong lượt gặp | R3B kết | D.MINH_NO_HANDLING | Đích refute: EV_PackagingMatch |
| ST_P3_MINH_OPPORTUNITY | Nhận có lúc ở khu bàn khi Tùng sau vách; nói người khác cũng có thể vào | R4 | D.MINH_OPPORTUNITY | Có cơ hội, không độc quyền |
| ST_P3_MINH_PARTIAL | Nhận mở hộp/đặt ống mới, lấy ống cũ; biện hộ giúp thay thuốc | R5A | D.MINH_PARTIAL | Lời nhận từng phần, chưa độc/ý định |
| ST_P3_MINH_OLD_LOCATION | Chỉ hốc khuất chân cầu thang tầng trệt giấu ống cũ | OLD_LOCATION | D.MINH_OLD_LOCATION | Chi tiết được nói trước lúc thu |
| ST_P3_POLICE_OLD_RECORD | Cảnh sát tìm đúng nơi; nhãn cá nhân khớp hồ sơ thuốc Tùng | RECOVER | D.POLICE_OLD_RECORD | Nguồn kiểm chứng trong EV_OriginalInhaler |
| ST_P3_MINH_NORMAL_REPLACEMENT | Đổi một ống thuốc bình thường, không làm hại | R5A; giữ sau OLD_REVIEW | D.MINH_NORMAL_REPLACEMENT | Đích refute: EV_MedicineAnalysis |
| ST_P3_MINH_ACT | Nhận lấy ống cũ/đặt ống được giao khi Tùng rửa mặt, trước rời/Hòa vào | R5B | P3_MINH_R5C | Lời nhận phù hợp gói chứng cứ |
| ST_P3_MINH_COERCION | Nhận bị người khác ép; không chốt tên người ép ở đây | R5C | D.MINH_COERCION | Lời khai, cần kiểm tra tổ chức ở P4 |
| ST_P3_MINH_IGNORANCE | Nói không biết sẽ chết; không xác minh niềm tin đó | R5C | D.MINH_IGNORANCE | Lời bào chữa, không Canon khách quan |
| ST_P3_REPORT_SCOPE | Cảnh sát xác nhận báo cáo có phần liên hệ nạn nhân, không chỉ chất trong ống | REPORT | D.REPORT_SCOPE | Nguồn chuyên môn đã đọc, không thẻ mới |

Hào không có statement giả “tôi không đứng ở cửa lúc bạn hỏi”. Lời hiện tại đã biết không bác một lượt quá khứ. `ST_P3_203_CORROB` là lời truyền có nguồn, không tạo `EV_DebtReceipt` hoặc nhân vật sprite mới.

### C. COMPLETE DIALOGUE SCRIPT

#### NODE P3_ENTRY — TRỞ RA

[NARRATION]
Bạn trở ra hành lang. Hòa đứng sát tường; Linh giữ tay áo, nhìn khoảng nền trước chân. Hào tựa bên lan can. Minh ở cách đầu cầu thang vài bước.

Cảnh sát giữ lối vào 204. Bạn mở sổ ở trang lời khai, đặt bản ghi hiện trường cạnh đó.

[DETECTIVE | Calm]
"Tôi cần hỏi lại vài điều. Từng người một."

[GAME STATE]
`scene_location=hallway`; `current_node=P3_HUB`; Press/Present mở, Deduction khóa. Nếu checkpoint đầu P3 chưa có, chụp đúng state/credibility nhập từ P2, không ghi đè khi revisit.

#### NODE P3_HUB

[CHOICE]
A. Hỏi lại Hòa.
B. Hỏi lại Linh.
C. Hỏi lại Hào.
D. Hỏi lại Minh.

UI phụ: Notebook, Quay lại 204/Đọc hồ sơ, Làm việc với cảnh sát khi có yêu cầu mở, Xem giấy khen tùy chọn, Mở Final khi đủ. Mọi cuộc hỏi có “Dừng để xem lại sổ” → hub, lưu vòng hiện tại. Không chọn thay người chơi hoặc tự phát confession nếu mở menu NPC.

#### HÒA — NODE P3_HOA_START

[DETECTIVE | Neutral]
"Ông Hòa, tôi hỏi lại lần ông lên tầng."

[NPC: HÒA | Uneasy]
"Tôi nói hết rồi. Anh cần gì nữa?"

[GAME STATE]
Chọn `ST_P1_HOA_INITIAL`. Hiện Press/Present/Đọc sổ/Dừng. Người chơi Press → H1; Present receipt sớm cũng hợp lệ, H2 tự có một câu xác nhận lời đầu, không bắt Press để đủ số click.

#### NODE P3_H1 — FIRST PRESS

[DETECTIVE | Attentive]
"Chỉ một lần, lúc chín rưỡi? Trước đó tối nay không lên?"

[ACTION]
Hòa nhìn sang người gác cửa, rồi trở lại cuốn sổ của bạn.

[NPC: HÒA | Insistent]
"Đúng. Tôi lên gọi nó đóng tiền rồi thấy nó nằm đó."

[DETECTIVE | Calm]
"Ông nhìn từ cửa hay bước vào?"

[NPC: HÒA | Defensive]
"Từ cửa. Tôi đã nói chưa bước vào rồi mà."

[NOTEBOOK UPDATE]
Thêm `ST_P3_HOA_REPEAT`, cùng phủ nhận được hỏi rõ. Không mark đã chứng minh dối.

[GAME STATE]
`flags.hoa_first_press=true`; đích Present vẫn initial/repeat/door. Repress dùng H1_REPRESS ở D, không ghi thêm.

#### NODE P3_H2 — PRESENT ĐÚNG EV_RentReceipt

[ACTION]
Bạn đưa ảnh biên nhận cho Hòa xem, ngón tay giữ ở dòng người thu. Giấy thật vẫn trong hồ sơ cảnh sát.

[DETECTIVE | Calm]
"Biên nhận này ở trên bàn Tùng. Chữ ký của ông, giờ ghi 20:55."

[NPC: HÒA | Stalled]
"Giấy thu tiền thì tôi viết. Có gì lạ?"

[DETECTIVE | Attentive]
"Vậy ông viết lúc nào, và giấy lên bàn bằng cách nào?"

[ACTION]
Hòa kéo vạt áo xuống. Khi bàn tay đi qua túi ngực, lão dừng lại.

[NPC: HÒA | Defensive]
"Viết giấy đâu có nghĩa tôi đã vào phòng. Anh đừng gom hết vào một chuyện."

[NOTEBOOK UPDATE]
Thêm `ST_P3_HOA_RECEIPT_DEFENSE` ngay lúc câu này được nói; trạng thái chống chế, chưa đưa người mang giấy giả định vào Canon.

[DETECTIVE | Calm]
"Đúng. Chỉ tờ giấy chưa nói hết. Tôi đang hỏi ông đã để nó lại thế nào."

[NARRATION]
Bạn chờ. Hòa nhìn xuống dòng thời gian, không nhìn về phía cửa nữa.

[NPC: HÒA | Cornered]
"Tôi có ghé trước đó. Lúc ghi trên giấy. Chỉ lấy tiền phòng thôi."

[DETECTIVE | Neutral]
"Ông bước vào lấy tiền và để biên nhận?"

[NPC: HÒA | Reluctant]
"Ừ. Nhưng tôi không làm gì thằng Tùng."

[NOTEBOOK UPDATE]
Thêm `ST_P3_HOA_ENTRY`; initial/door/repeat/receipt_defense chuyển superseded-by-entry, giữ lịch sử. TL_P3_HOA_ENTRY: “Hòa nhận lần vào phù hợp giờ 20:55 trên giấy”; không giờ đo độc lập.

[GAME STATE]
`flags.hoa_entry_admitted=true`; credibility không đổi; mở H3/H4 Press. Receipt không tự mở hoa_resolved nếu chưa hỏi phạm vi/tiền/lượt Minh.

#### NODE P3_H3 — FOLLOW-UP: TIỀN VÀ PHẠM VI NHÌN

[DETECTIVE | Attentive]
"Lúc ông vào, Tùng ở đâu?"

[NPC: HÒA | Defensive]
"Không ở bàn. Tiền để đó, tôi lấy rồi đi."

[DETECTIVE | Calm]
"Ông có nhìn sau vách chỗ bồn rửa không?"

[NPC: HÒA | Irritated]
"Không. Tôi lên thu tiền, đâu đi lục cả phòng."

Chỉ hỏi câu sau vách nếu đã có EV_WetTowel; **nếu thiếu khăn**, thay bằng:

[DETECTIVE | Calm]
"Ông nhìn cả phòng, hay chỉ chỗ bàn?"

[NPC: HÒA | Irritated]
"Chỗ bàn. Tôi lên thu tiền, đâu đi lục cả phòng."

Sau đó mọi nhánh:

[DETECTIVE | Neutral]
"Tiền ông lấy đúng phần ghi trên biên nhận?"

[ACTION]
Hòa ép tay lên túi áo. Lão đáp mà mắt vẫn nhìn nền gạch.

[NPC: HÒA | Defensive]
"Nó nợ tôi. Mấy lần hẹn, có trả đâu."

[DETECTIVE | Calm]
"Tôi hỏi số lấy có bằng số ông ghi không."

[NPC: HÒA | Reluctant]
"Tôi lấy hơn. Giấy thì ghi tiền nợ. Anh muốn biết thế chứ gì?"

[DETECTIVE | Neutral]
"Vì thế ông giấu lần vào?"

[NPC: HÒA | Worried]
"Có người chết trong phòng. Tôi nói đã lấy tiền thì các anh nghĩ gì?"

[NOTEBOOK UPDATE]
`ST_P3_HOA_EXCESS`; cập nhật ENTRY: chỉ nhìn khu bàn, không xác nhận Tùng ra ngoài hoặc sống/chết lúc đó. Không chốt số tiền. `flags.hoa_scope_clarified=true`.

#### NODE P3_H4 — MINH ĐÃ XUỐNG

[DETECTIVE | Attentive]
"Trước khi ông vào, ông có gặp ai ở lối cầu thang không?"

[NPC: HÒA | Uneasy]
"Có Minh đi xuống. Tôi lên, nó xuống."

[DETECTIVE | Neutral]
"Trước lần ông để biên nhận?"

[NPC: HÒA | Insistent]
"Ừ. Tôi vào sau đó. Thấy Minh đi rồi tôi mới vào."

[DETECTIVE | Calm]
"Ông nhớ thứ tự. Có nhìn giờ Minh xuống không?"

[NPC: HÒA | Reluctant]
"Không. Tôi chỉ nhớ gặp nó trước khi vào."

[NOTEBOOK UPDATE]
`ST_P3_HOA_SAW_MINH`; TL_P3_MINH_BEFORE_HOA: Minh xuống trước lần Hòa vào, nguồn Hòa; không 20:54 verified.

[DETECTIVE | Neutral]
"Cảm ơn ông. Phần tiền, ông nói lại với cảnh sát."

[NPC: HÒA | Uneasy]
"Anh đừng vì chỗ tiền ấy mà nghĩ tôi giết nó."

[DETECTIVE | Calm]
"Tôi đang tách hai việc ra."

[GAME STATE]
`flags.hoa_sequence_clarified=true`; `flags.hoa_resolved=hoa_entry_admitted && hoa_scope_clarified && hoa_sequence_clarified`; về hub. Không set exonerated_by_receipt=true.

#### LINH — NODE P3_LINH_START

[DETECTIVE | Gentle]
"Linh, tôi cần hỏi lại chuyện cô ngủ."

[NPC: LINH | Guarded]
"Tôi đã nói tôi không nghe gì."

[GAME STATE]
Chọn ST_P1_LINH_INITIAL; Press → L1, Present EV_MissingWatch → L2. Không tự kéo tay áo.

#### NODE P3_L1 — PRESS THỜI GIAN NGỦ

[DETECTIVE | Attentive]
"Từ khoảng tám giờ đến lúc được gọi, cô có ra khỏi phòng lần nào không?"

[ACTION]
Linh siết khuỷu tay, nhìn bạn lâu hơn câu hỏi trước.

[NPC: LINH | Controlled]
"Không. Tôi ngủ."

[DETECTIVE | Calm]
"Có tỉnh dậy một lúc rồi ngủ tiếp không?"

[NPC: LINH | Defensive]
"Anh hỏi kiểu nào thì cũng vậy thôi. Tôi không sang phòng Tùng."

[NOTEBOOK UPDATE]
`ST_P3_LINH_REPEAT`; lời phủ nhận vào được mở bởi Press, chưa bị bác chỉ bằng nghi ngờ.

[GAME STATE]
`flags.linh_first_press=true`; mở Present trên initial/repeat. Không suy giờ bằng eyeliner.

#### NODE P3_L2 — PRESENT ĐÚNG EV_MissingWatch

[ACTION]
Bạn đưa ảnh mặt tủ, giữ ở khoảng sạch trên bụi. Mắt Linh dừng ở ảnh, rồi quay sang tay áo của chính cô.

[DETECTIVE | Neutral]
"Một vật cỡ mặt đồng hồ đã bị lấy khỏi chỗ này. Cổ tay cô có gì mà cứ giữ kín?"

[NPC: LINH | Defensive]
"Có khoảng bụi thì sao? Anh nói như thể anh thấy tôi lấy."

[DETECTIVE | Calm]
"Tôi chưa thấy cô lấy. Tôi đang hỏi chiếc đồng hồ."

[ACTION]
Linh buông mép áo để trả lời. Một mặt đồng hồ nam xước lộ trên cổ tay nhỏ. Bạn không nắm tay cô.

[NPC: LINH | Insistent]
"Đồng hồ của tôi. Tôi không phải giấu anh."

[NOTEBOOK UPDATE]
`ST_P3_LINH_WATCH_DEFENSE`; OBS_P3_LINH_WATCH_VISIBLE: mặt đồng hồ nam xước nhìn được. Cập nhật EV_MissingWatch phần quan sát liên quan, không cấp ID đồng hồ thu hồi hoặc ghi đã chứng minh vật đúng của Tùng.

[DETECTIVE | Neutral]
"Vậy cô nói rõ về nó đi."

[GAME STATE]
`flags.linh_watch_visible=true`; mở Press L3, credibility không đổi. Present đúng đưa vào mâu thuẫn cần giải, không tự nhận trộm hay kết tội bằng vòng bụi.

#### NODE P3_L3 — PRESS CHIẾC ĐỒNG HỒ

[DETECTIVE | Attentive]
"Cô nói đồng hồ của cô. Còn lời cô không sang 204 tối nay, cô vẫn giữ?"

[NPC: LINH | Defensive]
"Anh có biết cái đồng hồ nào là của ai đâu."

[DETECTIVE | Calm]
"Chưa. Nên tôi hỏi. Cô có vào không?"

[NARRATION]
Linh nhìn xuống mặt đồng hồ, vuốt ngang vết xước. Bàn tay cô dừng trên đó. Bạn không nói tiếp.

[NPC: LINH | Failing]
"Tôi chỉ định lấy rồi đi."

[DETECTIVE | Neutral]
"Từ mặt tủ của Tùng?"

[NPC: LINH | Quiet]
"Vâng. Tôi lấy cái này. Nhưng tôi không đụng vào cậu ấy."

[DETECTIVE | Attentive]
"Khoảng lúc nào?"

[NPC: LINH | Strained]
"Hơn chín giờ. Chắc chín giờ lẻ năm. Cửa không đóng chặt."

[NOTEBOOK UPDATE]
`ST_P3_LINH_THEFT`; initial/repeat/watch_defense superseded. TL_P3_LINH_ENTRY: khoảng 21:05 theo cô; không timestamp độc lập. Nhận trộm phù hợp vòng bụi/đồng hồ lộ; nhận dạng sở hữu vẫn dựa lời nhận, không bằng dấu độc nhất chưa có.

[GAME STATE]
`flags.linh_theft_admitted=true`; mở L4. Đây là cô bỏ cách chống chế khi bị yêu cầu giữ hai lời cùng lúc, không tuyên bố tác giả đã chứng minh bằng vòng bụi rằng chỉ Linh có thể lấy.

#### NODE P3_L4 — TÙNG CÒN SỐNG

[DETECTIVE | Gentle]
"Cô đã thấy Tùng thế nào?"

[ACTION]
Linh kéo tay áo lại, lần này không che được hết mặt đồng hồ.

[NPC: LINH | Shaken]
"Cậu ấy quay về phía tôi. Rồi gục xuống. Tay cứ cào ở cổ, miệng há ra."

[DETECTIVE | Attentive]
"Lúc cô còn ở đó, cậu ấy có cử động?"

[NPC: LINH | Strained]
"Có. Cậu ấy vẫn cào. Tôi sợ bị thấy đang lấy đồ."

[DETECTIVE | Calm]
"Cô có thấy cậu ấy dùng ống hít không?"

[NPC: LINH | Quiet]
"Tôi không thấy. Tôi nhìn cậu ấy rồi chạy. Tôi tưởng lại lên cơn hen."

[NARRATION]
Cô đưa tay lên mắt, dừng trước khi chạm vào phần trang điểm nhòe.

[NPC: LINH | Breaking]
"Tôi không biết cậu ấy sẽ chết. Nếu biết thì tôi đã gọi người."

[DETECTIVE | Gentle]
"Cô kể lại đúng phần đã thấy cho cảnh sát. Đừng thêm điều cô đoán."

[NOTEBOOK UPDATE]
`ST_P3_LINH_DISTRESS`, `ST_P3_LINH_FLED`. Timeline khoảng 21:05: theo Linh, Tùng còn sống và khó thở/gục; chưa phút chết, chưa thấy dùng thuốc. People ghi việc lấy đồ và bỏ chạy; không hung thủ/vô tội tuyệt đối.

[GAME STATE]
`flags.linh_witness_clarified=true`; `flags.linh_resolved=linh_theft_admitted && linh_witness_clarified`; về hub.

#### HÀO — NODE P3_HAO_START

[DETECTIVE | Neutral]
"Hào, tôi hỏi về lượt anh tới phòng 203."

[NPC: HÀO | Cool]
"Anh hỏi rồi. Tôi đến lấy tiền."

[GAME STATE]
Chọn ST_P1_HAO_INITIAL; Press mở A1/A2. Không có thẻ Present chính xác để ‘bắt’ anh bằng ảnh khóa. Nút refute disabled có lý do “Chưa có đối chiếu bác lời này”; vẫn đọc Evidence/Timeline, Press và đối chiếu miễn phạt.

#### NODE P3_A1 — VỊ TRÍ ĐỨNG KHÔNG PHẢI GIỜ ĐẾN

[DETECTIVE | Attentive]
"Lúc tôi hỏi anh, anh đứng sát cửa 204 hút thuốc. ‘Chỉ đi ngang’ chưa kể hết."

[NPC: HÀO | Dry]
"Đứng hút thuốc, không phải vào phòng. Anh phân biệt được chứ?"

[DETECTIVE | Calm]
"Được. Tôi muốn hỏi cả lần anh tới trước đó. Anh ở 203 xong thì đứng ở đâu?"

[ACTION]
Hào gõ đầu ngón tay lên lan can, tiếng kim loại nhỏ và đều.

[NPC: HÀO | Flat]
"Ra ngoài hút vài phút. Đoạn này. Hành lang có từng ấy."

[DETECTIVE | Neutral]
"Có nghe hoặc nhìn thấy Tùng lúc ấy không?"

[NPC: HÀO | Guarded]
"Tôi lo việc của tôi. Không có chuyện nhìn vào phòng nó."

[NOTEBOOK UPDATE]
Đã hỏi phạm vi hai lần đứng. Chưa ghi Hào nghe vật vã/chết ngạt; câu dọa trong F cũ không được dùng như anh đã biết diễn biến nạn nhân. A2 mới ghi lượt tới kèm giờ.

[GAME STATE]
`flags.hao_position_clarified=true`; mở A2/A3.

#### NODE P3_A2 — PRESS THU NỢ VÀ GIỜ

[DETECTIVE | Attentive]
"Thu tiền ở 203 là việc của ai?"

[NPC: HÀO | Cool]
"Người phòng ấy nợ. Tôi đến nhắc trả."

[DETECTIVE | Neutral]
"Anh tới khoảng chín giờ hai mươi như đã nói?"

[NPC: HÀO | Impatient]
"Khoảng đó. Tôi không nói đúng từng phút. Người ở 203 biết tôi tới làm gì."

[DETECTIVE | Calm]
"Tôi sẽ nhờ cảnh sát hỏi riêng người ấy."

[NPC: HÀO | Flat]
"Cứ hỏi. Chuyện 203, tôi chẳng giấu."

[NOTEBOOK UPDATE]
`ST_P3_HAO_VISIT`: tới thu nợ 203 khoảng 21:20, đứng hút thuốc đoạn gần 204 sau đó. Nguồn Hào, chưa đối chứng ở thời điểm này.

[GAME STATE]
`flags.hao_visit_clarified=true`; mở P3_203_REQUEST. Không ‘Hào không có cơ hội toàn đêm’.

#### NODE P3_A3 — NGƯỜI THUÊ

[DETECTIVE | Neutral]
"Ai giao anh đi thu?"

[ACTION]
Hào ngừng gõ lan can. Anh nhìn bạn, giữ một khoảng im lặng ngắn.

[NPC: HÀO | Low]
"Người thuê tôi. Anh đang hỏi cái chết trong kia, hay muốn hỏi cả thành phố?"

[DETECTIVE | Calm]
"Việc anh làm có thể liên quan."

[NPC: HÀO | Warning]
"Có những cái tên, hỏi ra thì anh phải sống với câu trả lời. Phần tôi ở đây là 203."

[NOTEBOOK UPDATE]
`ST_P3_HAO_EMPLOYER`: từ chối nêu người thuê; chưa có tên Vũ trong tri thức người chơi từ đoạn này.

[GAME STATE]
`flags.hao_employer_asked=true`. Không ép bằng đồng xu/hộp thuốc hoặc thưởng tên cho Press nhiều lần.

#### NODE P3_203_REQUEST / P3_A4 — ĐỐI CHỨNG

[DETECTIVE | Neutral]
"Anh giúp hỏi riêng người phòng 203 về lượt thu nợ được không? Hào khai tới khoảng chín giờ hai mươi."

[NPC: CẢNH SÁT | Firm]
"Được. Tôi sẽ đối chiếu, không chỉ lấy lời người đang đứng đây."

[GAME STATE]
`flags.corrob203_requested=true`; chưa thêm lời xác nhận. Người chơi tiếp tục nhánh khác hoặc chọn “Nhận đối chứng 203”; node A4 mới phát kết quả. Không timer thật, không phát trước yêu cầu. Không cần scene/sprite 203.

**P3_A4:**

[NARRATION]
Viên cảnh sát trở lại chỗ bạn. Hào nhìn anh, rồi nhìn ra ban công.

[NPC: CẢNH SÁT | Neutral]
"Người ở 203 xác nhận anh ấy tới thu nợ khoảng chín giờ hai mươi. Phần lượt tới ấy khớp lời khai."

[DETECTIVE | Attentive]
"Chỉ lượt tới ấy?"

[NPC: CẢNH SÁT | Firm]
"Đúng. Những lúc khác chưa được xác nhận bởi lời này."

[NPC: HÀO | Dry]
"Tôi đã bảo cứ hỏi mà."

[DETECTIVE | Neutral]
"Việc ở 203 đã có người đối chứng. Người thuê anh vẫn chưa rõ."

[NPC: HÀO | Cool]
"Vậy anh ghi cho đúng."

[NOTEBOOK UPDATE]
`ST_P3_203_CORROB`; TL_P3_HAO_VISIT: khoảng 21:20, hai lời về cùng lượt, corroborated_visit/estimated. Không xác nhận Tùng đã chết khi Hào tới. Nếu Linh đã khai, UI chỉ đặt hai mốc cạnh nhau; nếu chưa, không nhắc giờ cô.

[GAME STATE]
`flags.corrob203_received=true`; `flags.hao_resolved=hao_position_clarified && hao_visit_clarified && hao_employer_asked && corrob203_received`; về hub. Hào chưa có chứng cứ quy tráo; lượt 21:20 không tự gây đoạn khó thở cô đã thấy trước đó, nhưng không ngoại phạm toàn đêm hoặc loại tác động từ trước.

#### MINH — NODE P3_MINH_START

[DETECTIVE | Gentle]
"Minh, tôi hỏi lại cuộc gặp của hai người."

[NPC: MINH | Tired]
"Tôi đã kể hết phần tôi biết."

[GAME STATE]
Chọn statement/vòng đang mở, không nhảy tự động qua các vòng. R1 có thể hỏi dù Hòa/Linh/Hào chưa xong hoặc thiếu khăn/hộp. R2+ thiếu dữ kiện thì quay về hub kèm quyền Inspect, không thoại về bằng chứng chưa có.

#### ROUND 1 — NODE P3_MINH_R1

[DETECTIVE | Attentive]
"Anh nhớ giờ đến và giờ về thế nào?"

[NPC: MINH | Guarded]
"Đến khoảng tám giờ bốn mươi lăm. Tôi đã nói trước chín giờ thì tôi về."

[DETECTIVE | Neutral]
"Lúc về anh có xem giờ không?"

[ACTION]
Minh xoa thái dương, bàn tay dừng ở đó một lúc.

[NPC: MINH | Strained]
"Không. Tôi không nhớ từng phút."

[NOTEBOOK UPDATE]
`ST_P3_MINH_VISIT_DETAIL`; ghi estimated arrival/bound departure, không khóa 20:54.

**Nếu chưa có ST_P1_MINH_WASH:**

[DETECTIVE | Attentive]
"Trước khi anh về, Tùng làm gì?"

[NPC: MINH | Subdued]
"Bảo đi rửa mặt. Tôi về sau đó."

[NOTEBOOK UPDATE]
Mở `ST_P1_MINH_WASH`, source_node=P3_MINH_R1, collected_phase=3. Giữ cùng ID, không giả hỏi ở Phase 1.

**Nếu đã có ST_P1_MINH_WASH:**

[DETECTIVE | Attentive]
"Anh từng nói Tùng bảo đi rửa mặt, rồi anh về?"

[NPC: MINH | Quiet]
"Ừ."

Sau đó mọi nhánh:

[DETECTIVE | Calm]
"Lúc anh rời, anh chưa thấy cậu ấy khó thở?"

[NPC: MINH | Insistent]
"Chưa. Cậu ấy vẫn bình thường."

[GAME STATE]
`flags.minh_r1_done=true`; chọn vòng tiếp/đọc sổ/dừng. Câu bình thường chưa bị đánh dấu dối.

#### ROUND 2 — NODE P3_MINH_R2

Gate: bảy thẻ vụ án. Chọn Present đối chiếu `EV_WetTowel` vào `ST_P1_MINH_WASH`; đây là hỗ trợ làm rõ, không thắng một lời dối. Không phạt đúng hỗ trợ.

[ACTION]
Bạn mở ảnh góc bồn. Minh nhìn khăn, rồi nhìn xuống tay mình.

[DETECTIVE | Attentive]
"Khăn còn ướt. Nó phù hợp lời rửa mặt, nhưng không cho tôi giờ. Khi Tùng ra sau vách, anh đi ngay hay còn ở bàn?"

[NPC: MINH | Defensive]
"Một lúc thôi. Tôi vẫn ở đó rồi về. Rửa mặt có gì lạ?"

[DETECTIVE | Neutral]
"Không lạ. Tôi đang hỏi anh ở chỗ nào."

[NPC: MINH | Quiet]
"Khu bàn."

**Nếu Hòa đã nhận không thấy khu bàn:**

[DETECTIVE | Calm]
"Ông Hòa nói vào sau khi anh xuống, không thấy Tùng ở khu bàn. Ông ấy không nhìn sau vách."

[NPC: MINH | Guarded]
"Có thể cậu ấy vẫn rửa mặt. Tôi không biết sau khi tôi đi."

**Nếu chưa có lời Hòa:** bỏ hai dòng ấy; chờ R4 sau lời Hòa để đối chiếu. Không dùng tri thức nguồn.

[NOTEBOOK UPDATE]
`ST_P3_MINH_WASH_SCOPE`: có khoảng Minh ở bàn, Tùng sau vách. Người dùng khăn/phút vẫn dựa lời, không ảnh độc lập.

[GAME STATE]
`flags.minh_r2_done=true`; mở R3. Không set swap_proven.

#### ROUND 3A — NODE P3_MINH_R3A: EV_Inhaler

Người chơi chọn ảnh ống vào statement về cuộc gặp/chưa thấy khó thở. Câu phản bác được viết thành câu hỏi, không “ống bác Tùng bình thường”.

[DETECTIVE | Neutral]
"Anh nhận ra ống này không?"

[ACTION]
Minh nhìn ảnh. Đầu ngón tay anh co lại trên mép áo.

[NPC: MINH | Subdued]
"Ống hít của Tùng. Cậu ấy bị hen."

[DETECTIVE | Attentive]
"Nắp mở, ống ở bàn. Anh biết cậu ấy có đổi thuốc gần đây không?"

[NPC: MINH | Guarded]
"Tôi không biết. Hen có thể lên vì thời tiết. Ngoài kia mưa thế này."

[DETECTIVE | Calm]
"Thời tiết là khả năng anh nghĩ tới. Tôi chưa có kết quả kiểm tra."

[NOTEBOOK UPDATE]
`ST_P3_MINH_MEDICINE`. Thẻ ống vẫn chỉ hiện trạng, không diagnosis.

[GAME STATE]
`flags.minh_inhaler_discussed=true`; mở R3B. Đây là Present yêu cầu giải thích, không proof/refute câu bình thường.

#### ROUND 3B — NODE P3_MINH_R3B: EV_InhalerBox

[ACTION]
Bạn đặt ảnh hộp thuốc cạnh ảnh ống, theo thao tác người chơi chọn Present thứ hai.

[DETECTIVE | Attentive]
"Trong thùng rác có hộp đã mở. Anh có biết ai mở không?"

[NPC: MINH | Defensive]
"Tôi có phải ở đây cả ngày đâu. Tùng mua lúc nào, ai mở, tôi không biết."

[NOTEBOOK UPDATE]
`ST_P3_MINH_BOX_UNKNOWN`; không gọi câu này dối chỉ bằng hộp.

[DETECTIVE | Calm]
"Trong lượt anh tới tối nay, anh có cầm ống hoặc mở hộp thuốc không?"

[NARRATION]
Minh rời mắt khỏi hai ảnh. Anh nhìn thẳng bạn, đáp chậm hơn.

[NPC: MINH | Insistent]
"Không. Tôi không cầm ống, cũng không xử lý cái hộp ấy."

[NOTEBOOK UPDATE]
`ST_P3_MINH_NO_HANDLING` mở đích phủ nhận cụ thể, chưa bị bác. Không tạo lời phủ nhận này trong Phase 1 bằng hồi tố.

[GAME STATE]
`flags.minh_r3_done=true`; mở R4 theo gate ba nhánh khác. Ống+hộp chưa làm Minh thú nhận.

#### ROUND 4 — NODE P3_MINH_R4: NHỮNG MỐC KHÁC NHAU

Gate: hoa_resolved, linh_resolved, hao_resolved và R3. Notebook cho người chơi chọn một trong ba đối chiếu dưới đây; hỏi theo thứ tự nào cũng được, mỗi lượt ghi flag. Không kéo-thả timeline hoặc thêm mini-game.

[CHOICE]
A. Đối chiếu lời Hòa thấy Minh xuống trước lần vào.
B. Đối chiếu lời Linh thấy Tùng còn sống, khó thở khoảng 21:05.
C. Đối chiếu lượt Hào tới 203 khoảng 21:20 đã được cảnh sát hỏi riêng.

**A — P3_R4_HOA:**

[DETECTIVE | Attentive]
"Ông Hòa thấy anh xuống trước khi ông ấy vào để biên nhận. Có khớp lần anh về không?"

[NPC: MINH | Guarded]
"Có. Tôi xuống trước. Tôi không bảo là mình ở lại đến chín giờ."

[DETECTIVE | Calm]
"Đúng. Lời ‘trước chín giờ’ của anh chưa bị bác."

[GAME STATE]
`flags.r4_hoa_checked=true`. Quan hệ trước/sau được Minh nhận, không đồng hồ đo phút.

**B — P3_R4_LINH:**

[DETECTIVE | Attentive]
"Linh nói khoảng chín giờ lẻ năm thấy Tùng còn cử động, đang cào cổ. Cô ấy không thấy dùng ống."

[NPC: MINH | Strained]
"Lúc đó tôi đã về rồi. Tôi có biết cậu ấy bị thế đâu."

[DETECTIVE | Neutral]
"Việc anh về trước cơn không giải thích mọi điều xảy ra trong cuộc gặp. Nhưng nó cũng chưa chứng minh anh làm gì."

[GAME STATE]
`flags.r4_linh_checked=true`; không tự gán 21:00 lên cơn/21:20 chết.

**C — P3_R4_HAO:**

[DETECTIVE | Neutral]
"Lượt Hào tới 203 khoảng chín giờ hai mươi có người đối chứng. Lượt ấy sau cảnh Linh kể đã thấy."

[NPC: MINH | Defensive]
"Vậy anh cứ hỏi những người khác. Cửa ấy ai cũng vào được."

[DETECTIVE | Calm]
"Tôi đã hỏi. Lượt thu nợ không làm anh Hào có ngoại phạm cho cả tối. Cửa lỏng cũng không chỉ ra một người."

[GAME STATE]
`flags.r4_hao_checked=true`. Không loại Hòa/Linh vì trộm, không loại Hào tuyệt đối.

**Khi ba flag có đủ, P3_R4_CLOSE:**

[DETECTIVE | Attentive]
"Có lúc anh ở bàn trong khi Tùng ở sau vách. Anh vẫn khẳng định không chạm vào thuốc?"

[NPC: MINH | Guarded]
"Đúng. Có ở đó đâu có nghĩa tôi làm gì. Những người khác cũng vào được."

[NOTEBOOK UPDATE]
`ST_P3_MINH_OPPORTUNITY`: có cơ hội, không duy nhất. Giữ `ST_P3_MINH_NO_HANDLING` là câu cần kiểm.

[GAME STATE]
`flags.opportunity_reviewed=true`; mở yêu cầu kiểm tra cảnh sát. Không set minh_guilty.

#### NODE P3_POLICE_CHECK — MẢNH GIẤY

Chỉ mở khi R4/các vai/bảy thẻ có đủ. Người chơi chọn “Đề nghị cảnh sát kiểm tra đồ liên quan tới thuốc”. Không tự phát EV khi đóng câu Minh.

[DETECTIVE | Neutral]
"Chiếc ống và hộp cần kiểm tra. Tôi muốn các anh đối chiếu những gì liên quan tới người đã tới phòng."

[NPC: CẢNH SÁT | Firm]
"Được. Việc kiểm tra và giữ đồ để chúng tôi làm."

[NARRATION]
Minh nhìn người cảnh sát. Khi được yêu cầu, anh giao áo khoác để kiểm tra. Bạn đứng ngoài khoảng làm việc.

[ACTION]
Cảnh sát ghi một mảnh nắp giấy trong đồ Minh giao. Ảnh đối chiếu đặt mảnh cạnh phần hộp từ phòng 204: đường rách và họa tiết tiếp nối nhau. Không dùng vân tay, lô thuốc, hóa đơn mua hay camera mới.

[NPC: CẢNH SÁT | Neutral]
"Mảnh trong áo anh Minh khớp phần mép hộp đã ghi ở 204. Đây là ảnh đối chiếu."

[NOTEBOOK UPDATE]
Thu `EV_PackagingMatch`: “Mảnh nắp giấy trong đồ Minh giao kiểm tra khớp mép rách/họa tiết hộp thuốc ở 204. Cảnh sát ghi nguồn và ảnh đối chiếu; chưa xác định phút xử lý hộp, chất bên trong hoặc ý định.”

[GAME STATE]
`flags.packaging_check_done=true`; không nhận tự động, mở Present lên NO_HANDLING. Nếu load sau thu thì đọc hồ sơ, không tìm lại mảnh lần hai.

#### ROUND 5A — NODE P3_MINH_R5A: EV_PackagingMatch

[ACTION]
Bạn mở đúng ảnh đối chiếu vào lời phủ nhận đang chọn.

[DETECTIVE | Calm]
"Anh nói không xử lý hộp. Mảnh trong áo anh nối đúng mép hộp ở 204. Anh giải thích chỗ này thế nào?"

[NPC: MINH | Stalled]
"Một mảnh giấy thì có thể dính vào áo."

[DETECTIVE | Attentive]
"Có thể. Tôi chưa nói mảnh giấy chứng minh giết người. Tôi hỏi anh có còn giữ lời chưa từng cầm hộp trong cuộc gặp không."

[NARRATION]
Minh nhìn về cửa 204. Anh nuốt khan, cánh tay thả khỏi vạt áo.

[NPC: MINH | Failing]
"Tôi có mở. Có đặt một ống khác lên bàn."

[DETECTIVE | Neutral]
"Còn ống cũ?"

[NPC: MINH | Guarded]
"Tôi mang đi. Chỉ thay ống cho cậu ấy thôi. Giúp đổi thuốc, có gì đâu."

[NOTEBOOK UPDATE]
`ST_P3_MINH_PARTIAL`, `ST_P3_MINH_NORMAL_REPLACEMENT`; NO_HANDLING superseded. Chưa kết độc hoặc Minh biết sẽ chết.

[GAME STATE]
`flags.minh_partial_admitted=true`; mở Press chỗ ống cũ và lý do. Không mở Final/sụp đổ cuối tại đây.

#### NODE P3_MINH_OLD_LOCATION — PRESS CHI TIẾT CÓ THỂ KIỂM

[DETECTIVE | Attentive]
"Ống cũ anh mang đi đang ở đâu?"

[ACTION]
Minh nắm hai tay, nhìn vào khoảng giữa các ngón.

[NPC: MINH | Quiet]
"Hốc khuất ở chân cầu thang tầng trệt. Tôi để ở đó."

[DETECTIVE | Calm]
"Anh giấu trước khi quay lại đây?"

[NPC: MINH | Strained]
"Ừ. Sau khi tôi xuống."

[DETECTIVE | Neutral]
"Tôi sẽ nhờ cảnh sát kiểm tra đúng chỗ anh nói."

[NOTEBOOK UPDATE]
`ST_P3_MINH_OLD_LOCATION`; ghi chi tiết trước hành động tìm. Phút giấu chưa biết.

[GAME STATE]
`flags.old_location_disclosed=true`; mở nút Nhờ cảnh sát thu ống cũ. Không tự thu khi chỉ biết vị trí.

#### NODE P3_RECOVER — CẢNH SÁT TÌM/ĐỐI CHIẾU

[DETECTIVE | Neutral]
"Anh kiểm tra hốc chân cầu thang theo lời Minh giúp tôi. Cả nhận dạng ống cũ nữa."

[NPC: CẢNH SÁT | Firm]
"Tôi sẽ ghi nơi tìm được và đối chiếu hồ sơ thuốc."

[GAME STATE]
`flags.old_recovery_requested=true`. Chuyển đoạn ngắn “Sau lượt kiểm tra”; không đưa người chơi xuống cầu thang hoặc sinh một background mới.

[NPC: CẢNH SÁT | Neutral]
"Có ống ở đúng hốc anh ấy chỉ. Nhãn cá nhân trên ống phù hợp hồ sơ thuốc của Tùng. Chúng tôi đã ghi ảnh và nguồn đối chiếu trong cùng hồ sơ này."

[NOTEBOOK UPDATE]
Thu `EV_OriginalInhaler`: “Ống cũ tìm đúng hốc chân cầu thang do Minh chỉ trước lúc tìm. Nhãn cá nhân đối chiếu hồ sơ thuốc Tùng; ảnh/nguồn do cảnh sát ghi. Nội dung thuốc chưa có kết quả kiểm tra ở bước này.” Thêm `ST_P3_POLICE_OLD_RECORD`; không EV_Prescription mới.

[GAME STATE]
`flags.old_inhaler_recovered=true`; mở OLD_REVIEW. Thẻ này kiểm chứng nhận, không xác định ai chuẩn bị hóa chất.

#### NODE P3_MINH_OLD_REVIEW — PRESENT EV_OriginalInhaler

Đích ST_P3_MINH_OLD_LOCATION/PARTIAL, mục đích kiểm chứng chi tiết; không giả hai lời ấy mâu thuẫn.

[DETECTIVE | Calm]
"Ống cũ ở đúng chỗ anh chỉ, nhận dạng khớp hồ sơ Tùng. Lời anh mang nó đi đã có phần kiểm chứng."

[NPC: MINH | Guarded]
"Tôi đã nói có đổi. Nhưng tôi chỉ giúp cậu ấy."

[DETECTIVE | Attentive]
"Anh vẫn nói ống đặt lại là thuốc bình thường?"

[NPC: MINH | Insistent]
"Đúng. Anh đang làm quá chuyện lên."

[NOTEBOOK UPDATE]
NORMAL_REPLACEMENT vẫn là lời bào chữa đang giữ; PARTIAL/OLD_LOCATION được đánh dấu corroborated_detail, không mọi nội dung nhận đều verified.

[GAME STATE]
`flags.old_account_corrob=true`; mở gửi kiểm tra. Không lấy việc giấu làm proof độc tính.

#### NODE P3_SEND — GỬI KIỂM TRA

[CHOICE]
A. Đề nghị kiểm tra hai ống và đối chiếu nguyên nhân tử vong → P3_WAIT.
B. Hỏi/xem thêm trước → P3_HUB.

Gate A: bảy thẻ, mảnh khớp, ống cũ, old_account_corrob và ba vai đã làm rõ. B không mất gì. Xu/giấy khen/khảo sát không bắt buộc.

[DETECTIVE | Neutral]
"Cần kiểm tra nội dung hai ống và liên hệ với kết quả trên Tùng. Chỉ xem vỏ thì chưa đủ."

[NPC: CẢNH SÁT | Firm]
"Chúng tôi sẽ chuyển để kiểm tra. Kết quả chưa có ngay."

[GAME STATE]
`flags.samples_submitted=true`; `flags.time_skip_started=true`; khóa quay lại khám trực tiếp 204. Chưa thêm EV_MedicineAnalysis. Không chuyển thời gian nếu thiếu dữ liệu bắt buộc cho chuỗi vụ án.

#### NODE P3_WAIT — CHUYỂN THỜI GIAN

[NARRATION]
Bạn khép sổ. Các lượt lấy lời khai chính thức tiếp tục; vật chứng được cảnh sát xử lý và gửi kiểm tra.

[ACTION]
Màn hình mờ đi. Hiện dòng: **Một thời gian sau, khi kết quả kiểm tra đã được chuyển về.**

[NARRATION]
Bạn trở lại trang ảnh hai ống. Một hồ sơ mới được đặt bên cạnh. Những người còn cần hỏi được cảnh sát gọi lại để đối chiếu lời khai.

[GAME STATE]
`phase3_segment="3b"`; `scene_location=hallway`; `flags.time_skip_complete=true`; tái dùng nền hành lang. Không định vài phút/giờ trả kết quả, không phòng lab mới. Không áp dụng giờ actual của đêm mở cảnh cho mọi người đang đứng lại sau skip.

#### NODE P3_REPORT — ĐỌC HỒ SƠ CHUYÊN MÔN

[NPC: CẢNH SÁT | Neutral]
"Kết quả trên ống bàn không phù hợp thuốc ghi nhãn. Nó thuộc nhóm hóa chất vệ sinh. Ống cũ phù hợp thuốc cấp cho Tùng."

[DETECTIVE | Attentive]
"Còn phần kiểm tra Tùng?"

[NPC: CẢNH SÁT | Firm]
"Hồ sơ có đối chiếu với nạn nhân. Kết quả phù hợp việc chất trong ống bàn gây diễn biến hô hấp dẫn tới cái chết. Không phải chỉ phát hiện chất trong một đồ vật rồi đoán nguyên nhân."

[ACTION]
Bạn đọc phần kết luận và phạm vi của báo cáo trước khi mở trang lời Minh.

[NOTEBOOK UPDATE]
Thu `EV_MedicineAnalysis` gồm ba phần trong **một thẻ**: ống bàn khác thuốc nhãn/nhóm hóa chất vệ sinh; ống cũ phù hợp thuốc; phần liên hệ nạn nhân xác nhận hướng nguyên nhân trong phạm vi báo cáo. `ST_P3_REPORT_SCOPE` lưu lời cảnh sát về phạm vi. Không ghi tên chất/liều, phòng xét nghiệm, tên công ty, người chuẩn bị hay mức biết của Minh.

[GAME STATE]
`flags.analysis_received=true`; `flags.victim_link_confirmed=true`; mở R5B. Nếu nội dung triển khai chỉ có phân tích ống, flag thứ hai vẫn false: không mở R5B/Final; cần phần báo cáo liên hệ nạn nhân theo gói đã duyệt. Không bù bằng lời thám tử.

#### ROUND 5B — NODE P3_MINH_R5B: EV_MedicineAnalysis

[ACTION]
Bạn đưa phần kết quả vào đúng lời “thay thuốc bình thường”. Minh nhìn từ ảnh ống cũ sang ảnh ống bàn, rồi sang dòng kết luận.

[DETECTIVE | Calm]
"Anh nói chỉ đổi thuốc bình thường. Ống cũ có thuốc phù hợp. Ống anh đặt lại có chất khác thuốc ghi nhãn. Kết quả cũng có phần liên hệ với cái chết của Tùng."

[NPC: MINH | Defensive]
"Tôi đâu kiểm tra được trong ống có gì. Anh bắt tôi biết hết sao?"

[DETECTIVE | Attentive]
"Tôi chưa khẳng định anh biết hết. Nhưng anh không thể giữ lời đây là một lần thay thuốc bình thường. Anh đã lấy ống cũ, giấu nó, đặt ống kia lại. Anh làm việc đó lúc nào?"

[NARRATION]
Minh ngồi xuống chỗ được chỉ bên tường. Hai bàn tay mở ra trên đầu gối. Anh hít vào, không nói được hết câu đầu.

[NPC: MINH | Failing]
"Lúc Tùng ra rửa mặt. Tôi ở bàn."

[DETECTIVE | Neutral]
"Trước khi anh xuống, trước lần ông Hòa vào?"

[NPC: MINH | Quiet]
"Ừ. Tôi lấy ống cũ, để ống họ đưa lên bàn. Bóc hộp rồi bỏ đi."

[NOTEBOOK UPDATE]
`ST_P3_MINH_ACT`: nhận hành vi/quan hệ thời điểm. NORMAL_REPLACEMENT bị bác trong phạm vi thuốc/nội dung, không tự bác bào chữa không biết. Player Timeline: khi Tùng rửa mặt, trước Minh rời/Hòa vào; giờ phút cụ thể chưa được lời thoại này xác lập. Khoảng actual 20:50–20:54 trong Bible là metadata tác giả, không tự đưa vào UI dưới nhãn “Minh đã khai”.

[GAME STATE]
`flags.minh_act_admitted=true`; mở R5C Press. Không khai tên người ép, nợ/con tin hay công ty ở đoạn này.

#### ROUND 5C — NODE P3_MINH_R5C: LỜI NHẬN VÀ CƯỠNG ÉP

[DETECTIVE | Attentive]
"Anh nói ‘họ đưa’. Ai yêu cầu anh làm?"

[ACTION]
Minh cúi đầu. Một giọt nước mắt rơi lên mu bàn tay; anh không đưa tay lau.

[NPC: MINH | Breaking]
"Tôi chỉ làm điều họ bảo. Tôi không có cách nào khác."

[DETECTIVE | Calm]
"Anh bị ép?"

[NPC: MINH | Strained]
"Ừ. Nhưng tôi không biết nó sẽ giết Tùng. Tôi không biết."

[NARRATION]
Viên cảnh sát bước tới gần hơn, giữ khoảng trống giữa Minh và những người còn lại. Bạn hạ tấm ảnh xuống.

[DETECTIVE | Gentle]
"Phần ai ép, anh cần nói tiếp với cảnh sát. Tôi sẽ giữ riêng điều anh làm và điều anh nói mình không biết."

[NOTEBOOK UPDATE]
`ST_P3_MINH_COERCION`, `ST_P3_MINH_IGNORANCE`. Mức hiểu độc tính, người ra lệnh và lý do cụ thể còn cần hỏi/kiểm ở Phase 4. Không đưa con gái bị giữ thành kiến thức người chơi trước lời khai nguồn trong Phase 4.

[GAME STATE]
`flags.minh_coercion_admitted=true`; `flags.minh_resolution_recorded=true`; giữ ignorance status=claimed. Không phục hồi credibility/auto-solve Final. Kết cuộc hỏi về hub hoặc READY khi đủ.

### D. PRESS BRANCHES

Mọi statement đã có có nút Press. B1/B2 trỏ node đầy đủ ở C hoặc bảng D dưới đây. Press cũ sau khi đã sửa chỉ đọc lại phần khai mới phù hợp; không buộc NPC nói dối lại để farm. Không có statement mới từ Press khi bảng ghi “không mới”. ID mới chỉ thêm một lần; SourceNode giữ lần phát thực sự.

**P3_PRESS_REVISED — ưu tiên trước mọi route cũ khi statement đã superseded:**
+
+- Hòa, sau ENTRY: [DETECTIVE | Neutral] “Ông đã sửa lời này?” [NPC: HÒA | Reluctant] “Tôi nhận có vào trước rồi. Tôi không giữ lời chỉ lên một lần nữa.” [ACTION] Hòa tránh nhìn ảnh biên nhận. Đọc ENTRY đã có; không phát H1 phủ nhận lại.
+- Linh, sau THEFT: [DETECTIVE | Gentle] “Lời ngủ suốt đã được cô sửa?” [NPC: LINH | Quiet] “Vâng. Tôi đã sang và lấy đồng hồ.” [ACTION] Cô giữ cổ tay. Đọc THEFT; chỉ đọc DISTRESS nếu đã mở L4.
+- Minh, NO_HANDLING đã sửa: [DETECTIVE | Neutral] “Anh đã nhận phần cầm và đổi ống?” [NPC: MINH | Strained] “Ừ. Tôi đã nhận rồi.” [ACTION] Anh nhìn xuống tay. Đọc PARTIAL/ACT theo dữ liệu thực có, không confession lại.
+- Minh, NORMAL_REPLACEMENT đã bị bác và ACT mở: [DETECTIVE | Neutral] “Anh còn giữ lý do đổi thuốc bình thường?” [NPC: MINH | Quiet] “Không. Tôi đã nói tôi để lại ống được giao.” [ACTION] Anh lặng nhìn ảnh. Đọc ACT; không tự mở COERCION nếu R5C chưa chạy.
+
+Không phát sinh statement/flag/penalty. Các câu giữ phủ nhận ở H1_REPRESS/L1_REPRESS chỉ chạy khi lời chưa bị sửa. Điều này bảo vệ người chơi đổi NPC/đọc lại lịch sử sau khi đã tiến triển.
+
+H1_REPRESS: [DETECTIVE | Calm] “Ông vẫn giữ lời chỉ lên chín rưỡi?” [NPC: HÒA | Defensive] “Ừ. Tôi nói rồi.” [ACTION] Hòa khép tay trước bụng. Làm rõ vẫn giữ phủ nhận, không mới.

L1_REPRESS: [DETECTIVE | Neutral] “Cô vẫn nói không rời phòng?” [NPC: LINH | Defensive] “Vâng.” [ACTION] Linh giữ tay áo. Không mới, không kiểm lời bằng trang điểm.

Các dòng dưới là script đầy đủ một lượt Press ngắn: câu hỏi → phản ứng/hành động → giải thích/né tránh → làm rõ/kết quả. Tags viết trong ô là thoại triển khai, không gợi ý người viết phải tự bổ sung.

| Press node / statement | Detective | NPC reaction và response | Làm rõ / statement mới |
| --- | --- | --- | --- |
| D.HOA_CALLS / ST_P1_HOA_CALLS | “Ông nhớ gọi từng người lúc nào không?” | [ACTION] Hòa miết mép điện thoại. [NPC: HÒA | Uneasy] “Sau khi thấy Tùng. Tôi cuống, không nhớ từng phút.” | Không log mới, không phút; giữ claimed |
| D.HOA_DOOR / ST_P1_HOA_DOOR | “Đó là lần phát hiện, hay cả lần trước?” | [NPC: HÒA | Defensive] “Lúc phát hiện tôi đứng cửa.” Nếu chưa entry: “Làm gì có lần trước.” [ACTION] Lão quay mặt về cửa | Trước nhận: giữ phủ nhận; sau nhận: tách lần phát hiện khỏi lần lấy tiền |
| D.HOA_RECEIPT_DEFENSE | “Ông vẫn nói giấy tự có trên bàn mà mình không vào?” | Trước H2 kết không dừng input giữa đoạn; sau H2: [NPC: HÒA | Reluctant] “Tôi nhận có vào rồi. Đừng bắt tôi nói lại câu đó.” [ACTION] Lão nhìn tránh ảnh | Đọc revised entry, không hồi tố người mang giấy |
| D.HOA_ENTRY | “Ông thấy cả phòng trống hay chỉ khu bàn?” | [ACTION] Hòa xòe tay. [NPC: HÒA | Defensive] “Khu bàn. Tôi không nhìn hết.” | Phạm vi rõ; nếu chưa H3 thì chạy H3 đầy đủ, mở EXCESS |
| D.HOA_EXCESS | “Tiền lấy hơn có ghi trên giấy không?” | [NPC: HÒA | Reluctant] “Không. Giấy ghi khoản nó nợ.” [ACTION] Tay dừng trước túi ngực | Không số tiền; giữ nhận vượt nợ |
| D.HOA_SAW_MINH | “Ông có xem giờ khi gặp Minh xuống không?” | [NPC: HÒA | Uneasy] “Không. Tôi nhớ trước lúc tôi vào thôi.” [ACTION] Lão nhìn cầu thang | Quan hệ trước/sau, không 20:54 exact |
| D.LINH_TIME | “Mốc tám giờ là nhớ hay có xem đồng hồ?” | [NPC: LINH | Guarded] “Tôi ước chừng.” [ACTION] Cô khép tay vào khuỷu | Nếu ST_P1_LINH_TIME chưa có thì mở cùng ID; không phút mới |
| D.LINH_THEFT | “Cô lấy đồng hồ từ đâu?” | [NPC: LINH | Ashamed] “Trên tủ đầu giường. Tôi đã nói là tôi lấy.” [ACTION] Cô nhìn xuống cổ tay | Xác nhận lời nhận; không đặc điểm khắc tên mới |
| D.LINH_DISTRESS | “Cô thấy dùng ống, hay chỉ thấy gục và cào cổ?” | [NPC: LINH | Shaken] “Chỉ thấy cậu ấy gục, cào. Tôi không thấy dùng ống.” [ACTION] Cô tránh nhìn cửa 204 | Không biến nhân chứng thành nguồn xác nhận xịt thuốc |
| D.LINH_FLED | “Cô có gọi ai ngay sau đó không?” | [NPC: LINH | Quiet] “Không. Tôi sợ bị bắt lấy đồ, nên chạy.” [ACTION] Cô nhìn nền | Lời về sợ/hen là cô khai, không chứng nhận nội tâm |
| D.HAO_STANDING | “Câu anh đang hút thuốc nói về lúc tôi hỏi đúng không?” | [NPC: HÀO | Cool] “Đúng. Chuyện lúc ấy.” [ACTION] Anh gõ ngón tay lên lan can | Không dùng làm ngoại phạm lượt 21:20 |
| D.HAO_VISIT | “Lượt khoảng chín giờ hai mươi ở 203, anh nhớ chính xác không?” | [NPC: HÀO | Flat] “Khoảng thôi. Người ở 203 đối chiếu được lượt tôi tới.” [ACTION] Anh nhìn cảnh sát | Chưa xác nhận khoảng trước; nếu chưa request thì mở nút yêu cầu |
| D.HAO_EMPLOYER | “Anh vẫn không muốn nói tên người thuê?” | [NPC: HÀO | Warning] “Anh nghe câu trả lời rồi.” [ACTION] Anh ngừng gõ lan can | Không tên Vũ/không thưởng Press nhiều |
| D.203_CORROB | “Lời người 203 xác nhận điều gì ngoài lượt thu nợ?” | [NPC: CẢNH SÁT | Firm] “Chỉ lượt tới và việc thu nợ trong lời ấy. Không cả tối.” [ACTION] Anh chỉ phần ghi nguồn | Không ngoại phạm toàn đêm |
| D.MINH_TOPIC | “Chuyện riêng anh chưa nói có liên quan việc đổi ống không?” | Trước partial: [NPC: MINH | Guarded] “Tôi chỉ nói chuyện riêng.” Sau partial: “Tôi đã nhận phần đổi ống. Chuyện khác tôi chưa nói được.” [ACTION] Anh siết hai tay | Không tự khai con tin; không bỏ gate |
| D.MINH_VISIT_DETAIL | “Anh chắc phút về, hay chỉ nhớ trước chín giờ?” | [NPC: MINH | Strained] “Chỉ trước chín giờ. Tôi không nhìn giờ.” [ACTION] Anh xoa thái dương | Không exact 20:54 |
| D.MINH_WASH_SCOPE | “Khi Tùng ở sau vách, anh vẫn ở bàn?” | [NPC: MINH | Guarded] “Một lúc. Rồi tôi đi.” [ACTION] Anh nhìn bàn trong ảnh | Opportunity, không exclusive |
| D.MINH_MEDICINE | “Anh biết hen, nhưng có biết kết quả kiểm tra không?” | Trước report: [NPC: MINH | Defensive] “Không. Tôi nghĩ thời tiết thôi.” Sau report: “Anh đã cho tôi xem kết quả rồi.” [ACTION] Anh nhìn ảnh | Không diagnosis/câu dối tự động |
| D.MINH_BOX_UNKNOWN | “Anh không biết ai bóc, hay khẳng định mình không cầm?” | Trước partial: [NPC: MINH | Insistent] “Tôi không cầm.” Sau partial: “Tôi đã nhận mở hộp.” [ACTION] Tay rời vạt áo | Mở NO_HANDLING nếu chưa; sau nhận chỉ revised partial |
| D.MINH_NO_HANDLING | “Cả ống lẫn hộp, anh vẫn phủ nhận đã cầm?” | Trước partial: [NPC: MINH | Defensive] “Đúng. Anh muốn tôi nói mấy lần?” Sau partial: “Tôi đã nhận rồi.” [ACTION] Anh nhìn sang cảnh sát | Không nhận bằng Press miễn phí trước mảnh khớp |
| D.MINH_OPPORTUNITY | “Ai khác có thể vào là lý do anh nói mình không xử lý thuốc?” | [NPC: MINH | Guarded] “Tôi nói anh không thể chỉ vì tôi ở đó mà kết tôi.” [ACTION] Anh chụm hai tay | Đúng giới hạn cơ hội; trước partial không mở nhận |
| D.MINH_PARTIAL | “Anh mang ống cũ đi đâu?” | Chưa location: chạy OLD_LOCATION ở C; sau location: [NPC: MINH | Quiet] “Chỗ tôi đã chỉ.” [ACTION] Anh nhìn xuống tay | Mở OLD_LOCATION đúng node, không tự thu ống |
| D.MINH_OLD_LOCATION | “Anh để ở đó trước khi quay lại?” | [NPC: MINH | Strained] “Ừ. Sau khi xuống.” [ACTION] Hai tay anh nắm lại | Chưa phút giấu, mở nút thu nếu chưa request |
| D.POLICE_OLD_RECORD | “Nhận dạng ống dựa trên gì?” | [NPC: CẢNH SÁT | Neutral] “Nhãn cá nhân và hồ sơ thuốc Tùng, có nguồn trong cùng thẻ.” [ACTION] Anh chỉ phần đối chiếu | Không ID đơn thuốc mới |
| D.MINH_NORMAL_REPLACEMENT | “Anh giữ lý do đây là đổi thuốc bình thường?” | Trước report Present: [NPC: MINH | Insistent] “Đúng, tôi chỉ giúp đổi.” Sau ACT: “Tôi không giữ lời đó nữa.” [ACTION] Anh nhìn ảnh hai ống | Không confession bằng Press trước báo cáo |
| D.MINH_COERCION | “Anh đang nói có người ép, chưa nói tên họ?” | [NPC: MINH | Strained] “Ừ. Tôi chưa nói được.” [ACTION] Anh cúi mặt | Cưỡng ép là lời nhận; tên/động cơ cụ thể P4 |
| D.MINH_IGNORANCE | “Anh nói không biết sẽ chết. Điều ấy cần kiểm tra riêng, anh hiểu chứ?” | [NPC: MINH | Quiet] “Tôi đang nói điều tôi biết.” [ACTION] Anh đặt hai tay lên gối | Claimed, không tự xác nhận bào chữa |
| D.REPORT_SCOPE | “Hồ sơ này có kết luận trên nạn nhân, không chỉ ống?” | [NPC: CẢNH SÁT | Firm] “Có phần đối chiếu ấy. Nội dung và giới hạn ghi trong báo cáo.” [ACTION] Anh mở đúng phần | Không liều/tên công ty/khẳng định ý thức Minh |

ST_P3_MINH_ACT Press chạy R5C đầy đủ lần đầu; hỏi lại sau đó dùng D.MINH_COERCION/IGNORANCE. Các statement mở giữa đoạn H2/R3B chỉ trở thành selectable sau đoạn kết để tránh người chơi chen vào một half-state chưa ổn định.

### E. PRESENT BRANCHES

Present có ba kết quả nội dung: **refute** (bác lời), **clarify/support** (yêu cầu giải thích/kiểm chứng đúng phạm vi), **wrong** (không hỗ trợ câu đang bị phản bác). Đây là kết quả của cùng cơ chế Present, không thêm hệ chơi. UI đích hiển thị rõ “Đối chiếu lời đang chọn”; thám tử không nói “bằng chứng giết người” khi thẻ chỉ hỗ trợ câu hỏi. Support đúng không mất điểm, không tự cho nhận.

| Statement ID đích | Correct Evidence ID | Correct Response / node | Unlocked Statement | State Flag | Sai / penalty |
| --- | --- | --- | --- | --- | --- |
| ST_P1_HOA_INITIAL / ST_P3_HOA_REPEAT / ST_P1_HOA_DOOR | EV_RentReceipt | H2; giấy + lời nhận bác chỉ một lần/chưa vào | ENTRY, RECEIPT_DEFENSE trong đoạn | hoa_entry_admitted | F.HOA; −15 |
| Các đích Hòa trên, dùng EV_LooseLock | EV_LooseLock (support) | E.HOA_LOCK dưới đây; không chứng minh ông vào | Không mới | hoa_access_discussed | Không thưởng/không thắng |
| ST_P1_LINH_INITIAL / ST_P3_LINH_REPEAT | EV_MissingWatch | L2; mở câu hỏi đồng hồ, lộ đồng hồ; L3 Press mới nhận | WATCH_DEFENSE | linh_watch_visible | F.LINH; −15 |
| ST_P1_MINH_WASH / ST_P3_MINH_WASH_SCOPE | EV_WetTowel (support) | R2 theo gate; khăn phù hợp lời, hỏi phạm vi | WASH_SCOPE | minh_r2_done | F.MINH theo thẻ; −15 khi refute sai |
| ST_P1_MINH_INITIAL / ST_P3_MINH_VISIT_DETAIL ở R3A | EV_Inhaler (clarify) | R3A; nhận ra ống/hen, không bác bình thường | MEDICINE | minh_inhaler_discussed | F.MINH; −15 |
| ST_P3_MINH_MEDICINE ở R3B | EV_InhalerBox (clarify) | R3B; hỏi hộp, mở phủ nhận tiếp xúc | BOX_UNKNOWN, NO_HANDLING | minh_r3_done | F.MINH; −15 |
| ST_P3_MINH_NO_HANDLING | EV_PackagingMatch (refute) | R5A; mảnh + nhận từng phần | PARTIAL, NORMAL_REPLACEMENT | minh_partial_admitted | F.MINH; −15 |
| ST_P3_MINH_OLD_LOCATION / ST_P3_MINH_PARTIAL sau thu | EV_OriginalInhaler (support) | OLD_REVIEW; kiểm chứng chi tiết chỉ chỗ | Không statement khác; revision corroborated | old_account_corrob | F.MINH; −15 |
| ST_P3_MINH_NORMAL_REPLACEMENT | EV_MedicineAnalysis (refute) | R5B; bác thuốc bình thường, chưa bác không biết | ACT | minh_act_admitted | F.MINH; −15 |
| Hào / statements khác không có đích bác hợp lệ | Không Correct Evidence ID | Press/đọc/đối chiếu miễn phạt, Present refute disabled | Theo D | Không cờ thắng Present | Không phạt vì chức năng khóa |

**E.HOA_LOCK — support đúng:**

[DETECTIVE | Neutral]
"Chốt lỏng, không bấm chủ động thì cửa mở từ ngoài. Cửa không tự ngăn việc vào."

[NPC: HÒA | Defensive]
"Mở được đâu có nghĩa tôi đã vào."

[DETECTIVE | Calm]
"Đúng. Tôi còn cần đối chiếu lời ông."

[GAME STATE]
`flags.hoa_access_discussed=true`; không sửa lời/không mở ENTRY; credibility không đổi. Trở lại statement hiện hành, receipt vẫn cần người chơi chọn.

**Điều kiện bảo vệ:** Present đúng nhưng prerequisite chưa mở thì nút khóa trước submit, chỉ nhắc “Cần hỏi rõ lời đang đối chiếu” hoặc chỉ thiếu bản ghi. Không trừ −15 cho thao tác không được phép. Thẻ chưa collected không hiện. Đúng lại trên target đã giải thì mở hồ sơ phản ứng revised/không điểm; không chạy confession lần hai.

### F. WRONG EVIDENCE RESPONSES

Phần này là thoại đầy đủ cho thẻ **đã thu** khi người chơi thực sự submit vào một target đang mở nhưng không hợp lệ. Không hiện tất cả như menu gợi đáp án. Mỗi sai: NPC đáp theo bảng; bạn thu ảnh, nói “Tôi sẽ đối chiếu lại phần này.”; giữ statement/vòng; credibility −15 đúng một lần. Không nhận, không mở lời đích, không nhắc thẻ đúng chưa có. Cùng thẻ có thể hợp lệ ở target khác theo E; correct/support luôn được kiểm trước bảng sai.

#### F.HOA — khi đối chiếu phủ nhận lần lên/chưa vào

| Evidence ID | [NPC: HÒA] Wrong Response |
| --- | --- |
| EV_WetTowel | [Defensive] “Khăn ướt thì ông ấy rửa mặt. Khăn nói tôi lên tầng lúc nào à?” |
| EV_NeckScratches | [Uneasy] “Vết cổ nó thì hỏi người khám. Ảnh ấy không nói tôi bước qua cửa.” |
| EV_Inhaler | [Defensive] “Thuốc nằm ở bàn. Anh đang hỏi tôi lên tầng, hay hỏi thuốc của nó?” |
| EV_InhalerBox | [Irritated] “Hộp trong rác không có giờ tôi lên, cũng không có chữ ký tôi.” |
| EV_MissingWatch | [Guarded] “Đồ trên tủ mất thì anh tìm người lấy. Tôi đang nói lần tôi lên.” |
| EV_BoundaryCoin | [Puzzled] “Đồng xu dưới nệm liên quan gì tới việc tôi đứng cửa?” |
| EV_KhangCertificate | [Irritated] “Giấy khen khu trọ đâu ghi tôi vào 204 tối nay.” |
| EV_PackagingMatch | [Defensive] “Mảnh trong đồ Minh. Anh đem sang hỏi tôi về lần tôi lên?” |
| EV_OriginalInhaler | [Uneasy] “Ống tìm ở cầu thang không cho anh giờ tôi lên tầng.” |
| EV_MedicineAnalysis | [Guarded] “Báo cáo thuốc không ghi tôi đã bước vào lúc nào.” |

EV_RentReceipt đúng; EV_LooseLock support không phạt. Hai thẻ đó không được đẩy vào câu sai chung. Sau Hòa đã nhận, Present refute vào statement đã giải không còn active; chỉ đọc/Press.

#### F.LINH — khi đối chiếu lời ngủ/không ra khỏi phòng

| Evidence ID | [NPC: LINH] Wrong Response |
| --- | --- |
| EV_LooseLock | [Defensive] “Cửa mở được không có nghĩa tôi đã đi qua.” |
| EV_WetTowel | [Wary] “Khăn trong phòng cậu ấy đâu chứng minh tôi thức hay ngủ.” |
| EV_NeckScratches | [Shaken] “Ảnh cổ Tùng không cho anh biết tôi ở đâu lúc đó.” |
| EV_Inhaler | [Guarded] “Ống ở bàn cậu ấy. Tôi chưa hiểu anh lấy nó để bác chuyện tôi ngủ.” |
| EV_InhalerBox | [Defensive] “Một hộp thuốc trong rác đâu chỉ ra tôi đã rời phòng.” |
| EV_RentReceipt | [Controlled] “Tên ông Hòa trên giấy. Anh đang hỏi giấc ngủ của tôi.” |
| EV_BoundaryCoin | [Puzzled] “Tôi không biết đồng xu ấy. Nó nói gì về giờ tôi ngủ?” |
| EV_KhangCertificate | [Wary] “Giấy khen khu trọ không phải việc của tôi tối nay.” |
| EV_PackagingMatch | [Defensive] “Mảnh giấy trong đồ anh Minh. Sao nó chứng minh tôi đã ra ngoài?” |
| EV_OriginalInhaler | [Wary] “Ống cũ ở cầu thang không ghi tôi đã thức lúc nào.” |
| EV_MedicineAnalysis | [Shaken] “Kết quả thuốc nói về Tùng. Không ghi giờ tôi rời phòng.” |

EV_MissingWatch đúng chỉ mở L2; lúc L2 chưa xong không có input Present chen vào. WATCH_DEFENSE cần Press L3, không có thẻ nhận dạng độc nhất để bác “của tôi”; UI refute disabled cho statement ấy, không giả vòng bụi là đủ.

#### F.MINH — phản ứng theo ý nghĩa thẻ

Các thẻ chỉ hiện sau đúng lần thu; không dùng câu dưới để kể nguồn thẻ trước khi nguồn được biết. Target đang chọn hiển thị trên UI; các override cuối bảng xử lý các thẻ có giá trị theo giai đoạn.

| Evidence ID | [NPC: MINH] Wrong Response khi không thuộc Correct/Support của target |
| --- | --- |
| EV_LooseLock | [Defensive] “Cửa mở được cho nhiều người. Nó không chứng minh điều anh vừa hỏi tôi.” |
| EV_WetTowel | [Guarded] “Khăn hợp chuyện rửa mặt. Nó không cho anh giờ tôi đi hoặc chuyện tôi cầm thuốc.” |
| EV_NeckScratches | [Strained] “Vết cào cho thấy Tùng gặp chuyện. Không cho anh thấy tôi đã làm gì với ống.” |
| EV_Inhaler | [Defensive] “Ống ở bàn, nắp mở. Anh không thể nhìn ảnh mà biết ai mở nó hoặc trong đó có gì.” |
| EV_InhalerBox | [Guarded] “Có hộp đã bóc, nhưng ảnh hộp không chỉ ra người bóc hoặc nội dung ống.” |
| EV_RentReceipt | [Defensive] “Giấy của ông Hòa. Nó ghi giờ trên giấy, không ghi việc tôi xử lý thuốc.” |
| EV_MissingWatch | [Strained] “Dấu trên tủ là chuyện món đồ mất. Nó không chứng minh tôi đổi thuốc.” |
| EV_BoundaryCoin | [Wary] “Anh chưa biết đồng xu dùng làm gì. Sao đem nó để kết chuyện thuốc?” |
| EV_KhangCertificate | [Guarded] “Chữ ký trên giấy khen không nói tôi đã làm gì trong phòng Tùng.” |
| EV_PackagingMatch | [Defensive] “Ảnh mảnh giấy cần đối chiếu đúng lời về cái hộp. Nó không tự cho anh giờ hoặc chất trong ống.” |
| EV_OriginalInhaler | [Guarded] “Ống tìm được kiểm lại phần tôi chỉ chỗ. Không tự chứng minh lý do hay điều tôi biết về ống mới.” |
| EV_MedicineAnalysis | [Strained] “Kết quả chất trong ống không cho anh giờ tôi đến, cũng không nói tôi hiểu chất ấy tới đâu.” |

**Overrides bắt buộc để đúng target/vòng, dùng thay dòng nền khi phù hợp:**

| Target + evidence | Response / xử lý |
| --- | --- |
| NO_HANDLING + EV_Inhaler/EV_InhalerBox | “Ảnh hiện trường không cho anh thấy tôi đã cầm. Tôi vẫn giữ lời ấy.” Sai −15; không gián tiếp nhận |
| NO_HANDLING + EV_WetTowel | “Tôi đã nói cậu ấy đi rửa mặt. Khăn không bác lời tôi chưa cầm hộp.” Sai −15 |
| NORMAL_REPLACEMENT + EV_PackagingMatch | “Tôi đã nhận mở hộp. Mảnh giấy không chứng minh thuốc trong ống khác thuốc.” Support lại chi tiết tiếp xúc: **0**, không mở ACT; không phạt bằng chứng thực sự liên quan |
| NORMAL_REPLACEMENT + EV_OriginalInhaler | “Tôi nhận mang ống cũ đi. Chỉ tìm ra ống cũ chưa nói ống mới có chất gì.” Support: **0**, không mở ACT |
| NORMAL_REPLACEMENT + EV_Inhaler/EV_InhalerBox | “Hình vỏ không cho anh thành phần thuốc. Tôi vẫn nói chỉ đổi ống.” Sai −15 nếu submit để bác nội dung thuốc |
| WASH + EV_RentReceipt, khi đã có Hòa nhận | “Giờ trên giấy là việc ông Hòa. Muốn hỏi tôi ở đâu khi Tùng rửa mặt thì cứ hỏi.” Support thứ tự: **0**, không mở R2 thay khăn; vẫn cần đủ thẻ |
| VISIT_DETAIL + EV_RentReceipt, khi đã có Hòa saw-minh | “Tôi nhận đã xuống trước ông ấy vào. Giấy không cho anh phút tôi xuống.” Support thứ tự: **0**, không bác lời bình thường |
| Target R3A + EV_InhalerBox chọn trước EV_Inhaler | Nút vòng hộp khóa theo R3A; không submit/không phạt. Có thể đọc hộp trong sổ, không response sai giả |

Các support overrides được đăng ký vào luật E trước kiểm sai; bảng F chứa chúng để lập trình viên không phạt nhầm chứng cứ liên quan nhưng chưa đủ. Không có thẻ đúng để bác IGNORANCE: Present refute khóa, chỉ Press. Báo cáo không chứng minh ý thức Minh.

#### F.HAO

Không mở roulette Present trên statement Hào vì không có thẻ refute hợp lệ. Khi đọc kèm thẻ (không submit, không mất điểm), các câu đối chiếu tùy chọn là: khóa — “Mở được không có nghĩa tôi vào”; biên nhận — “Việc ông chủ”; cổ — “Hỏi người khám”; thuốc/hộp — “Không nằm trong việc ở 203”; vòng bụi — “Không chứng minh lượt tôi đến”; xu/giấy khen — “Không ghi giờ thu nợ”; gói R — “Chuyện đối chiếu thuốc của Minh, không phải người thuê tôi”. Không mở tên Vũ hoặc phủ nhận biết quá mức. Đường chứng minh thời gian vẫn là A2→REQUEST→A4, miễn phạt.

### G. CREDIBILITY UPDATES VÀ GAME STATE

Schema version 2 chung với P1/P2. Flags không phải bằng chứng; chỉ mở nội dung sau nguồn hợp lệ. Kế thừa điểm, không reset khi qua vòng/đổi NPC/time skip. `current_phase=3` cả 3a/3b; `phase3_segment` root là 3a/3b.

| Action | Điểm | State |
| --- | --- | --- |
| Press/đọc sổ/đổi người/Inspect lại | 0 | Chỉ facts đúng node; không điểm farm |
| Present đúng refute/clarify/support | 0 | Theo E; đủ dữ kiện mới mở vòng |
| Submit sai thật vào target active | −15, max(0,c−15) | Chạy response F, không unlock, giữ target/vòng |
| Thẻ chưa thu/target hoặc vòng khóa | 0 | Không submit, không gọi wrong handler |
| Hủy picker/đóng sổ | 0 | Về target cũ |
| Nộp Final sai sau màn này | −20 mỗi lượt nộp | Thuộc màn Final, không phạt từng slot |

**0 điểm — P3_BAD:**

[NPC: CẢNH SÁT | Firm]
"Anh dừng đối chiếu ở đây. Những kết luận vừa rồi không đủ cơ sở để chúng tôi theo tiếp."

[NARRATION]
Bạn khép sổ. Cuộc hỏi của bạn dừng lại; cảnh sát tiếp tục phần việc của họ.

[GAME STATE]
Bad Ending mất quyền tiếp tục điều tra; mở Load checkpoint đầu P3 hoặc checkpoint trước Final nếu đã có. Không thám tử chết, không kết NPC vô tội. Load khôi phục nguyên snapshot điểm/facts, không cộng điểm lên state đang chạy. Lần wrong làm về 0 vẫn chỉ trừ một lần.

```js
const has = id => evidence_collected.includes(id);
const CASE7 = ["EV_LooseLock", "EV_WetTowel", "EV_NeckScratches",
  "EV_Inhaler", "EV_InhalerBox", "EV_RentReceipt", "EV_MissingWatch"];
const rolesDone = flags.hoa_resolved && flags.linh_resolved && flags.hao_resolved;
const r4Ready = flags.minh_r3_done && rolesDone;
const packagingRequestReady = r4Ready && flags.opportunity_reviewed
  && CASE7.every(has) && !!statements.ST_P3_MINH_NO_HANDLING;
const canSubmitSamples = rolesDone && flags.opportunity_reviewed && CASE7.every(has)
  && has("EV_PackagingMatch") && has("EV_OriginalInhaler")
  && flags.minh_partial_admitted && flags.old_account_corrob;
const finalReady = rolesDone && CASE7.every(has)
  && ["EV_PackagingMatch","EV_OriginalInhaler","EV_MedicineAnalysis"].every(has)
  && flags.old_account_corrob && flags.victim_link_confirmed
  && flags.minh_act_admitted && flags.minh_coercion_admitted
  && flags.minh_resolution_recorded && credibility > 0;
```

Predicate evaluate lại sau commit/load, không set true chỉ vì vào một node. Khi collected ID có mà source record thiếu thì save bất nhất, không bịa source node. Một click xử lý một event; khóa input trong text/transition; wrong chỉ commit một lần. Resume ở request/recover/report giữ phase segment; không phát lại cảnh tìm/thu/time skip nếu flags đã commit.

### H. NOTEBOOK UPDATES

| Dữ liệu | Nội dung/nguồn | Giới hạn UI |
| --- | --- | --- |
| People Hòa | Nhận lần vào, lấy quá nợ, không xem hết phòng | Không “ngoại phạm 20:55/vô tội vì trộm” |
| People Linh | Nhận trộm, thấy gục/cào, bỏ chạy | Không “đã thấy xịt thuốc”, không exact death |
| People Hào | Thu nợ 203 có đối chứng lượt, giấu người thuê | Không nhãn người của Vũ từ tác giả, không alibi toàn tối |
| People Minh trước R5 | Có cơ hội, phủ nhận/nhận từng phần sau chứng cứ | Không hung thủ tag sớm |
| People Minh sau R5 | Nhận lấy/đặt ống, bị ép; vật chứng kiểm chứng chi tiết | Chưa biết đầy đủ kẻ ép/mức hiểu độc tính |
| TL_P3_HOA_ENTRY | 20:55 ghi giấy + lời nhận phù hợp | Document+claimed-corrob, không timestamp độc lập |
| TL_P3_MINH_BEFORE_HOA | Minh xuống trước Hòa vào | Hòa + Minh nhận, relation |
| TL_P3_LINH_ENTRY/DISTRESS | Khoảng 21:05 theo Linh | Witness/estimated, Tùng còn sống/cào; không onset 21:00 |
| TL_P3_HAO_VISIT | Khoảng 21:20, lời Hào + relay 203 | Corroborated visit/estimated |
| TL_P3_SWAP | Khi Tùng rửa mặt, trước Minh rời/Hòa vào | Lời nhận phù hợp chuỗi; không phút cụ thể. Actual 20:50–20:54 giữ riêng ở Bible, không render như lời đã nói |
| EV_PackagingMatch | Mảnh/ảnh khớp nguồn đồ Minh và hộp 204 | Chỉ tiếp xúc hộp trước lời nhận |
| EV_OriginalInhaler | Thu đúng nơi chỉ, nhãn/hồ sơ trong thẻ | Kiểm chứng chi tiết, chưa ý định |
| EV_MedicineAnalysis | Nội dung hai ống + phần nạn nhân | Chất/nguồn nhóm; không công ty/người ép/ý thức |

**P3_CERTIFICATE — optional ở nền hành lang hiện có:** người chơi bấm vùng giấy khen đã có trên tường khu trọ, không dời vào phòng 204.

[NARRATION]
Trong khung nhỏ, giấy khen quỹ hỗ trợ khu trọ đã ngả màu. Bạn đọc tên Khang ở phần ký.

[DETECTIVE | Neutral]
"Giấy khen của quỹ hỗ trợ khu trọ."

[ACTION]
Bạn lưu ảnh giấy công khai vào sổ. Không zoom để nhấn nét khuyên tròn, không suy chủ mưu.

[NOTEBOOK UPDATE]
`EV_KhangCertificate`: “Ảnh giấy khen hỗ trợ khu trọ, chữ ký Khang. Mẫu tài liệu công khai, chưa có liên hệ chứng minh với cái chết Tùng.” source=public_document/source_node=P3_CERTIFICATE. Không vật thật bị lấy.

[GAME STATE]
Chỉ thu nếu click/chọn lưu; optional. Nếu thiếu trước kết Ch1, fallback P4; không chặn Final hoặc tự thu ở ending. Không thêm actor/địa điểm/so khớp chữ ký Ch5.

### I. FULL NPC RESOLUTION VÀ MỞ FINAL

| NPC | Bí mật đã làm rõ | Còn giới hạn | Cường độ kết |
| --- | --- | --- | --- |
| Hòa | Vào trước/lấy hơn tiền nợ, để biên nhận, thấy Minh xuống | Không quan sát cả phòng/thuốc, chưa ngoại phạm tuyệt đối | Giữ giọng biện hộ, sợ phần tiền |
| Linh | Lấy đồng hồ, thấy Tùng còn sống khó thở, bỏ chạy | Không thấy dùng ống, giờ ước lượng, nhận dạng món đồ có lời nhận | Xấu hổ/sợ hậu quả, không diễn cùng cơn sụp đổ Minh |
| Hào | Đòi nợ 203, lượt tới đối chứng, đứng hút thuốc | Người thuê giấu; không ngoại phạm cả tối hoặc chứng minh không chạm thuốc từ trước | Bình thản, đe dọa ngầm còn |
| Minh | Trực tiếp lấy cũ/đặt ống giao, kiểm chứng chỗ giấu, báo cáo bác đổi thuốc bình thường, nhận bị ép | Mức biết độc tính, kẻ ép, nguồn cung/con tin hỏi sau | Nhận từng phần → chống chế → mất đường thuốc bình thường → nhận hành vi |

Vai ba người kia rõ vì lời nhận/đối chứng; hành vi trực tiếp quy Minh nhờ gói và nhận, không “ba người khác đã bị loại nên còn Minh”. Khả năng chạm thuốc/đồng phạm không được tuyệt đối bác bằng petty theft hoặc một lượt 203.

#### NODE P3_READY — ĐỦ CHUỖI, NGƯỜI CHƠI CHỌN MỞ

[NARRATION]
Bạn đặt trang lời Minh bên những ảnh đã có nguồn. Hòa im lặng cạnh tường. Linh nhìn xuống đồng hồ. Hào quay ra lan can. Cảnh sát ở gần Minh.

[DETECTIVE | Quiet]
"Đã có thể đối chiếu những phần này với nhau."

[CHOICE]
A. Mở Final Deduction.
B. Xem lại sổ và lời khai.

[GAME STATE]
A chỉ mở khi finalReady; B về hub, còn Press/đọc hồ sơ. Không nói tự ráp “ai/hành động/giờ/động cơ” thành lời giải dài. Nếu thiếu gate, UI cho checklist dữ liệu còn thiếu theo bản ghi, không tự phát kết quả.

#### NODE P3_END — HANDOFF FINAL DEDUCTION

[NARRATION]
Bạn mở trang trống kế tiếp. Các thẻ đã ghi nằm bên lề, chờ được đặt vào những câu hỏi còn bỏ ngỏ.

[PHASE END]
**Mở khóa FINAL DEDUCTION — Điều gì thực sự đã xảy ra với Tùng?**

[GAME STATE]
`flags.deduction_unlocked=true`; `flags.phase3_dialogue_complete=true`; `current_node="FINAL_DEDUCTION_ENTRY"`; chụp checkpoint trước Final với điểm thực có. `current_phase=3`; `flags.phase4_unlocked=false`. Không set deduction_solved, không khoanh Minh/gạch tên Tùng tự động trước người chơi nộp.

**Hợp đồng màn Final, metadata không hiện thành đáp án:** WHO/WHAT/WHEN/WHY/EVIDENCE theo Bible E5. Slot WHEN dùng quan hệ sự kiện, khoảng theo nhận, không buộc một phút đo độc lập. EVIDENCE dùng mảnh khớp/ống cũ/báo cáo/lời nhận kiểm chứng; bộ ống+hộp+Linh chưa đủ. Final đúng mới mở Phase 4 theo F; Final sai −20/lượt, không từng ô. Bản này không viết puzzle hoặc cảnh Phase 4.

### J. CONTINUITY AND LOGIC CHECK

| Hạng mục | Kiểm tra |
| --- | --- |
| Phase 1 fixes | Hào có tên sau tự giới thiệu; giờ Minh estimated; cảnh sát đến chỉ ordinal; optional rửa mặt có recovery R1 |
| Phase 2 chưa thu optional | R1/Hòa/Linh/Hào chơi được với năm thẻ. R2+ khóa đến quay lại Inspect khăn/hộp. Không phạt vì thiếu thẻ |
| Người biết gì | Hòa chỉ khu bàn; Linh chỉ gục/cào; Hào không nói Tùng chết ở 21:20; Minh chưa biết/phủ nhận thành phần trước báo cáo |
| Cơ hội | Minh có, Hòa/Linh cũng có tiếp cận, Hào không toàn-đêm alibi. Không suy chỉ Minh có cơ hội |
| Hòa | Receipt + nhận bác dối; khóa chỉ đường vào; số tiền không bịa; không thấy sống 20:55 |
| Linh | Vòng bụi không đủ nhận dạng. Present mở câu hỏi, lộ đồng hồ; lời nhận tự sửa giải thích. Không khắc tên/vân tay mới |
| Hào | Đối chứng người 203 qua cảnh sát theo R đã duyệt, không Evidence mới; chỉ lượt thu nợ, không toàn-đêm |
| Khăn | Hỗ trợ rửa mặt, không bác nó/không đồng hồ đo giờ |
| Ống/hộp | Đáng kiểm tra, chưa chứng minh nội dung hay người; không Press miễn phí cho confession trước gói |
| Mảnh khớp | Chỉ tiếp xúc hộp trước partial, chưa độc/ý định; nguồn cảnh sát/đồ Minh giao |
| Ống cũ | Chỉ chỗ trước tìm; nhận dạng/phần đơn thuốc trong một thẻ đã duyệt; không scene mới |
| Báo cáo | Có time skip và phần nạn nhân; không instant hóa học nhìn/mùi; không tự chứng minh công ty/ý thức |
| Sụp đổ | Sau báo cáo + chuỗi cá nhân; nhận kiểm chứng vẫn quyết định cho exact act/quan hệ thời điểm/cưỡng ép |
| Main mystery | Xu/khảo sát/chữ ký optional, không dùng buộc Minh; chưa MG-07/em gái/Vũ/Khang chủ mưu |
| Sai Evidence | Thẻ có phản hồi theo nội dung, đúng hỗ trợ không phạt nhầm; đích khóa không roulette vô đáp án |
| Gates | Không Final trước báo cáo đủ/nhận hành vi/ba vai; không Phase 4 trước Final đúng |
| Scope | Hai nền cũ, modal/portrait/text/fade; không lab/minigame mới/camera/hack/vân tay |

**[LOGIC GAP — bản F cũ, đã có repair được duyệt]:** ống+hộp+timeline Linh không chứng minh Minh là người tráo. Gói R xử lý bằng mảnh khớp → nhận từng phần → thu đúng ống cũ → báo cáo → nhận hành vi. Không tạo thẻ quyết định mới ngoài gói.

**[LOGIC GAP — giới hạn phải giữ]:** EV_MissingWatch không độc lập chứng minh chiếc đồng hồ trên tay thuộc Tùng; kịch bản không gọi vòng bụi là nhận dạng duy nhất. Kết việc trộm dựa lời Linh nhận phù hợp hiện trạng. Tương tự, các giờ tự nhớ không thành phút đo; cưỡng ép cụ thể và người ra lệnh cần P4. Không có cơ sở tuyệt đối loại mọi đồng phạm; Final hỏi người trực tiếp tác động đã được chứng minh, không chứng minh mọi người khác vô can mọi tội.

**[PROPOSED FIX — chỉ nếu người thiết kế muốn mức chứng minh khác]:** nếu cần độc lập chứng minh sở hữu đồng hồ dù Linh không nhận, hoặc ngoại phạm toàn-đêm cho Hào, nguồn hiện tại chưa đủ; cần một gói bổ sung được duyệt riêng. Không thêm gói đó, không chặn chuỗi hiện tại vốn dựa lời nhận kiểm chứng.

**[CẦN DUYỆT BẢN THẢO]:** thoại/nhịp các vòng, mức diễn xuất, cách hiển thị support so với refute, ảnh đối chiếu mép hộp và layout phần báo cáo. Logic đã được user duyệt giữ nguyên trừ gate năm thẻ được yêu cầu cập nhật. Báo cáo trong game phải render đủ phần liên hệ nạn nhân như R, không lược bỏ thành chỉ kết quả thuốc rồi vẫn mở Final.

+
+**Kiểm tra tài liệu đã thực hiện:** kiểm tra hợp đồng gate năm/bảy thẻ, 38 routes Press, 40.320 thứ tự hotspot và 96 biến thể đường đi trong mô hình trạng thái của tài liệu, bao gồm bỏ câu rửa mặt và bỏ khăn/hộp ban đầu. Kiểm tra này xác nhận thiết kế dữ liệu/đường bổ sung; chưa phải kiểm thử bản game React/Phaser hoặc API/save thực tế.
+