# CHAPTER 1 — ÁN MẠNG TRONG PHÒNG TRỌ
## PHASE 2 — NHỮNG MẢNH VỠ TRONG PHÒNG 204

**Bản thảo triển khai 1.0.** Đã đọc Bible 1.2, Phase 1 bản 1.2, ba nguồn S/P/F và MASTER PROMPT. Nội dung văn học/node là bản thảo mới, chưa tự phê duyệt. Gate năm Evidence theo yêu cầu hiện tại thay gate bảy của repair cũ; đường bổ sung khăn/hộp được mô tả đầy đủ ở E/H và Phase 3. Tám ID gốc giữ nguyên; vị trí xu dưới nệm theo quyết định đã duyệt, không theo túi quần ở F cũ.

Nhãn NARRATION/thoại/ACTION là phần người chơi thấy. Điều kiện, Knowledge, Potential Contradiction và GAME STATE là dữ liệu thiết kế; không đọc toàn bộ mục ấy thành độc thoại. “Thu Evidence” là lưu ảnh/bản ghi được cảnh sát cho dùng, không cầm vật thật. Không có mini-game khám nghiệm, thử thuốc, ngửi ống hoặc thao tác thi thể.

### A. PHASE NARRATIVE OPENING

**Entry:** `flags.phase1_complete && flags.phase2_unlocked`, `current_node=P2_ENTRY`. Cảnh sát đã tới/giăng băng ở cuối Phase 1; không phát lại một lần cảnh sát tới khác. Cùng một background chính `BG_ROOM204`; portrait cảnh sát và các ảnh Inspect là overlay, không địa điểm mới.

#### NODE P2_ENTRY — GIỚI HẠN CỦA MỘT BƯỚC CHÂN

[NARRATION]
Dải băng ngang cửa rung nhẹ khi viên cảnh sát kéo áo mưa khỏi vai. Nước chảy từ gấu áo xuống nền hành lang. Bạn đứng chờ anh nhìn lại.

[NPC: CẢNH SÁT | Firm]
"Anh ở phòng 201? Ông chủ trọ bảo anh làm thám tử."

[DETECTIVE | Calm]
"Tôi đã hỏi họ vài câu. Tôi chưa vào phòng."

[NPC: CẢNH SÁT | Neutral]
"Anh có thể quan sát. Cần xem kỹ chỗ nào thì nói. Đừng tự dịch đồ hay chạm vào người."

[DETECTIVE | Neutral]
"Tôi dùng ảnh và ghi nhận của các anh được chứ?"

[NPC: CẢNH SÁT | Firm]
"Những phần đã ghi nhận, được. Vật thật để nguyên cho chúng tôi xử lý."

[ACTION]
Anh giữ mép băng, cho bạn đứng vào khoảng trống được chỉ ở lối vào. Bạn dừng chân trước chỗ nền gạch khô, chừa đường cho người làm việc.

[NARRATION]
Không gian bên trong nhỏ hơn cảm giác khi nhìn từ hành lang. Mùi thuốc lá quẩn dưới trần thấp. Ánh đèn làm vết ố trên tường rõ thêm.

Tùng vẫn nằm trên sàn cạnh giường. Bạn mở sổ, chọn một trang trắng.

[GAME STATE]
`flags.inspect_permission=true`; `flags.room204_entered=true`; `scene_location=room204`; `current_node=P2_ROOM`. Không thêm Evidence/quan sát chuyên biệt. Đã thấy thi thể không đồng nghĩa đã Inspect cổ.

#### NODE P2_ROOM — CHỜ NGƯỜI CHƠI

[NARRATION]
Bạn dừng bút, nhìn vào căn phòng.

[GAME STATE]
Mở input hotspot. Không tự chạy Inspect nào, không quét toàn bộ đồ bằng lời kể. Cursor đổi khi hover vùng tương tác; tên object hiện theo bảng B. Notebook, Trở ra hỏi chuyện và Quan sát tiếp là nút UI. Nút Trở ra chỉ chuyển Phase khi gate đủ; thiếu thì node P2_EXIT_BLOCKED, không phạt.

### B. INVESTIGATION HOTSPOT TABLE

Một nền thể hiện cửa, bàn/thùng rác, góc bồn sau vách/rèm, giường/tủ và bảng nỉ. Rect/polygon hotspot căn theo asset đã vẽ, không đặt vị trí pixel như sự kiện canon. Ảnh cận chỉ mở cho object được bấm. Vùng cổ là hotspot thi thể, không làm lộ chi tiết vết cào trên thumbnail trước click. Giường chỉ ghi tên “Giường/nệm”, không hiện chữ “Đồng xu” trước khi mở chi tiết.

| Hotspot / Object Name | Vùng trên background | Inspect node | Evidence ID | Required / Optional Flag | Điều kiện |
| --- | --- | --- | --- | --- | --- |
| HP_LOCK — Ổ khóa cửa | Tay nắm cửa 204 | P2_LOCK | EV_LooseLock | Required cho lối ra | Có quyền Inspect |
| HP_SINK — Bồn rửa/khăn | Góc phòng sau vách/rèm, phần bồn nhìn được | P2_TOWEL | EV_WetTowel | Optional ở P2; Required trước Minh R2 | Có quyền; không cần nghe lời rửa mặt |
| HP_NECK — Vùng cổ Tùng | Thi thể trên sàn cạnh giường | P2_NECK | EV_NeckScratches | Required cho lối ra | Có quyền; xem ảnh vùng cổ do cảnh sát ghi |
| HP_INHALER — Ống hít trên bàn | Mặt bàn | P2_INHALER | EV_Inhaler | Required cho lối ra | Có quyền |
| HP_TRASH — Thùng rác | Dưới chân bàn | P2_BOX | EV_InhalerBox | Optional ở P2; Required trước Minh R2 | Có quyền; không cần Inspect ống trước |
| HP_RECEIPT — Mép giấy hồng | Mép gạt tàn trên bàn | P2_RECEIPT | EV_RentReceipt | Required cho lối ra | Có quyền |
| HP_DUST — Mặt tủ đầu giường | Tủ cạnh giường | P2_WATCH | EV_MissingWatch | Required cho lối ra | Có quyền |
| HP_BED — Giường/nệm | Mép nệm | P2_COIN | EV_BoundaryCoin | Optional ở P2/P3; fallback P4 trước kết Ch1 | Có quyền; cần người chơi chọn kiểm tra mép nệm |
| HP_BOARD — Bảng nỉ | Tường, tờ khảo sát ghim | P2_SURVEY | Không có | Optional; Environmental Storytelling | Có quyền; không thêm Evidence |

Mọi hotspot độc lập. Thứ tự bấm không đổi sự thật. “Có quyền” là flag từ P2_ENTRY, không cần người chơi tự xin lại mỗi lần. Khăn/hộp không bị ẩn để làm khó; chỉ không bắt buộc tại lối ra.

### C. FULL INSPECT SCRIPT

#### [HOTSPOT: HP_LOCK] NODE P2_LOCK

1. **Object Name:** Ổ khóa cửa 204.
2. **Visual Description:** cụm tay nắm tròn, chốt lỏng, vết xước mờ. Cận cảnh cùng cụm khóa đã nhìn từ cửa; không tạo chìa khóa mới để thu.
3. **Initial Observation:**

[NARRATION]
Chốt không nằm ngay ngắn trong lỗ giữ. Bạn đứng lệch, nhìn phần tiếp giáp giữa cửa và khung.

4. **Inspect Dialogue:**

[DETECTIVE | Attentive]
"Phần chốt này lỏng. Các anh đã kiểm tra chưa?"

[NPC: CẢNH SÁT | Neutral]
"Rồi. Không chủ động bấm chốt thì vặn tay nắm ngoài vẫn mở được. Chúng tôi đã ghi tình trạng khóa."

5. **Detail Inspection:** ảnh ghi nhận cảnh sát hiện ở Inspect UI; chốt/vết xước rõ. Không có input thử đóng cửa. Bạn chỉ xem bản ghi, không tự tái hiện việc ra vào.

[DETECTIVE | Quiet]
"Không cần phá cửa để vào."

6. **Evidence Collected:** ảnh và mô tả tình trạng chốt, sau khi đoạn trên kết thúc.
7. **Evidence ID:** `EV_LooseLock`.
8. **Notebook Description:** “Chốt tự động cửa 204 lỏng. Theo kiểm tra của cảnh sát, nếu không chủ động bấm chốt, tay nắm ngoài có thể mở cửa. Không xác định trạng thái chốt tại lúc xảy ra án.”
9. **Knowledge Unlocked:** khả năng tiếp cận không phá cửa trong điều kiện ghi nhận; chưa xác định người vào.
10. **Potential Contradiction:** hỗ trợ hỏi đường vào Hòa/Linh; không bác lời “tôi chưa vào” bằng ổ khóa một mình. Không tự tạo statement “cửa khóa nên tôi không vào được”.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"Tình trạng chốt đã có trong hồ sơ. Còn ai đã dùng cửa là chuyện khác."

12. **Required / Optional Flag:** required; `has("EV_LooseLock")`. Reinspect chỉ đọc hồ sơ; không reset khóa hoặc thêm thẻ.

#### [HOTSPOT: HP_SINK] NODE P2_TOWEL

1. **Object Name:** Bồn rửa và khăn mặt.
2. **Visual Description:** bồn nhỏ sau vách/rèm góc 204; vòi nhỏ giọt, khăn vắt trên giá. Vách che khu này khỏi đường nhìn khu bàn, không tạo phòng khác.
3. **Initial Observation:**

[NARRATION]
Nước dồn ở góc dưới khăn, rơi xuống thành bồn. Sau vách, vòi chưa đóng hết.

4. **Inspect Dialogue:**

[DETECTIVE | Attentive]
"Khăn còn sũng."

5. **Detail Inspection:**

[ACTION]
Viên cảnh sát cho bạn xem ảnh góc bồn cùng ghi nhận khăn ướt lạnh. Bạn không cầm khăn hoặc xoay vòi.

[DETECTIVE | Quiet]
"Có dấu sử dụng bồn và khăn. Tôi chưa biết lúc nào."

**Nếu `ST_P1_MINH_WASH` đã có:**

[DETECTIVE | Thoughtful]
"Minh có nhắc Tùng đi rửa mặt."

**Nếu chưa có:** bỏ dòng ấy; không thêm lời Minh từ nguồn tác giả.

6. **Evidence Collected:** ảnh bồn/khăn và ghi nhận tình trạng ướt lạnh, khi kết đoạn.
7. **Evidence ID:** `EV_WetTowel`.
8. **Notebook Description:** “Khăn trên giá cạnh bồn còn ướt lạnh; vòi đóng chưa chặt. Dấu sử dụng phù hợp việc rửa mặt nhưng không xác định người dùng hay phút sử dụng.”
9. **Knowledge Unlocked:** bồn nằm sau vách/rèm trong 204; người ở khu bàn có thể không nhìn thấy người phía sau. Không chuyển thành cả phòng trống.
10. **Potential Contradiction:** hỗ trợ đối chiếu lời rửa mặt và phạm vi quan sát Hòa; không phản bác Minh chỉ bằng khăn.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"Khăn ướt không giữ hộ mình một mốc giờ."

12. **Required / Optional Flag:** optional tại P2; required trước Minh Round 2. `has("EV_WetTowel")`; thiếu có thể quay lại đúng node từ Phase 3a.

#### [HOTSPOT: HP_NECK] NODE P2_NECK

1. **Object Name:** Vùng cổ và ngực áo Tùng.
2. **Visual Description:** ba vết cào đỏ rướm máu, cổ áo bị kéo xộc xệch. Thi thể vẫn trên sàn sát giường; không di chuyển để người chơi nhìn rõ.
3. **Initial Observation:**

[NARRATION]
Bạn không cúi sát người Tùng. Viên cảnh sát mở ảnh vùng cổ đã ghi nhận cho bạn xem.

4. **Inspect Dialogue:**

[DETECTIVE | Attentive]
"Ba vết cào. Cổ áo cũng bị kéo lệch."

5. **Detail Inspection:**

[NARRATION]
Ở ảnh cận, các đường cào hiện rõ hơn. Bạn dừng mắt ở phần cổ áo bị túm xuống.

[DETECTIVE | Quiet]
"Có thể cậu ấy đã tự cào khi khó thở. Cần hỏi người đã thấy cậu ấy lúc đó."

Không diễn câu này thành kết luận pháp y. Không thêm vết hằn dây, dấu bàn tay, dấu móng khớp hay kết quả xét nghiệm.

6. **Evidence Collected:** ảnh cổ/áo và ghi nhận mô tả, không mẫu sinh học do thám tử lấy.
7. **Evidence ID:** `EV_NeckScratches`.
8. **Notebook Description:** “Ba vết cào đỏ rướm máu trên cổ, cổ áo xộc xệch. Phù hợp hướng tự cào trong cơn khó thở; nguyên nhân tử vong và khả năng ngoại lực chưa kết luận bằng ảnh này.”
9. **Knowledge Unlocked:** hướng hỏi về khó thở; chưa biết ai chứng kiến.
10. **Potential Contradiction:** lời Linh về không biết gì có thể cần hỏi thêm sau khi cô nhận đã vào. Vết cào không tự xác định Linh hoặc Minh.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"Ảnh ghi được vết thương. Chuyện xảy ra trước đó vẫn cần lời kể và kiểm tra."

12. **Required / Optional Flag:** required; `has("EV_NeckScratches")`.

#### [HOTSPOT: HP_INHALER] NODE P2_INHALER

1. **Object Name:** Ống hít hen suyễn.
2. **Visual Description:** ống xanh nhạt trên mặt bàn lộn xộn, gần mép bàn; nắp mở. Không thêm vết bẩn hóa chất hoặc màu thuốc để nhận độc bằng mắt.
3. **Initial Observation:**

[NARRATION]
Bạn chọn chiếc ống xanh trên bàn. Trong ảnh cận, phần nắp mở để lộ miệng ống.

4. **Inspect Dialogue:**

[DETECTIVE | Attentive]
"Nắp mở. Ống vẫn ở trên bàn."

5. **Detail Inspection:**

[ACTION]
Bạn nhìn lại ảnh mặt bàn, giữ nguyên vị trí ống trong bản ghi.

**Nếu `OBS_MINH_GAZE` đã ghi:**

[DETECTIVE | Thoughtful]
"Lúc ngoài cửa, Minh cứ nhìn về phía này."

Sau đó, với mọi nhánh:

[DETECTIVE | Quiet]
"Tôi cần biết chiếc ống này đã được dùng thế nào."

Không nói đã xịt vào Tùng, đã tráo hay có chất độc. Không cho người chơi bấm xịt thử.

6. **Evidence Collected:** ảnh ống ở bàn và ghi nhận nắp mở.
7. **Evidence ID:** `EV_Inhaler`.
8. **Notebook Description:** “Ống hít xanh nhạt nằm trên bàn, nắp mở. Có dấu chuẩn bị sử dụng, chưa xác nhận ai dùng, nội dung thuốc hoặc việc thay ống. Vật thật do cảnh sát quản lý.”
9. **Knowledge Unlocked:** vị trí/nắp; mở câu hỏi thuốc sau này, không mở kết luận.
10. **Potential Contradiction:** dùng yêu cầu Minh làm rõ hiểu biết về thuốc; câu Tùng bình thường lúc Minh về chưa bị bác.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"Nắp mở là điều tôi nhìn được. Bên trong cần kiểm tra riêng."

12. **Required / Optional Flag:** required; `has("EV_Inhaler")`.

#### [HOTSPOT: HP_TRASH] NODE P2_BOX

1. **Object Name:** Thùng rác và hộp thuốc đã bóc.
2. **Visual Description:** thùng nhựa dưới bàn; giấy lộn, hộp ống hít nhỏ đã bóc, nhàu nát. Mép rách/họa tiết của hộp phải được asset lưu nhất quán cho ảnh đối chiếu Phase 3, không tự cho biết mảnh còn ở đâu.
3. **Initial Observation:**

[NARRATION]
Một cạnh hộp giấy mắc giữa những tờ giấy vò. Bạn chỉ vào thùng rác.

4. **Inspect Dialogue:**

[DETECTIVE | Neutral]
"Tôi muốn xem hộp đó."

[ACTION]
Cảnh sát xử lý phần hộp, ghi ảnh rồi cho bạn xem. Bạn giữ tay bên ngoài thùng rác.

5. **Detail Inspection:**

[DETECTIVE | Attentive]
"Hộp của ống hít. Đã mở, giấy bị rách ở mép."

**Nếu đã thu EV_Inhaler:**

[DETECTIVE | Quiet]
"Ở bàn cũng có một ống. Cần kiểm tra chúng có liên quan không."

**Nếu chưa thu EV_Inhaler:** không nói đã xem ống/nắp. Chỉ dừng ở hộp thuốc.

6. **Evidence Collected:** ảnh hộp và nguồn ghi nhận từ thùng rác.
7. **Evidence ID:** `EV_InhalerBox`.
8. **Notebook Description:** “Hộp giấy của một ống hít loại mới, đã bóc và bị nhàu, ở thùng rác dưới bàn. Có mép giấy rách trong ảnh. Chưa xác định ai bóc, giờ bỏ hoặc hộp thuộc đúng ống trên bàn.”
9. **Knowledge Unlocked:** có hộp thuốc đã mở; hướng kiểm tra đổi/thay thuốc hợp lệ hoặc bất thường. Không gán ‘vừa tối nay’ bằng độ mới giấy.
10. **Potential Contradiction:** mở câu hỏi ai đã xử lý thuốc. Khi có EV_PackagingMatch mới bác được phủ nhận tiếp xúc của Minh.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"Mép rách đã được chụp rõ. Chưa có giờ trên cái hộp này."

12. **Required / Optional Flag:** optional tại P2; required trước Minh R2/R3 và đối chiếu mảnh hộp. `has("EV_InhalerBox")`.

#### [HOTSPOT: HP_RECEIPT] NODE P2_RECEIPT

1. **Object Name:** Liên biên nhận thu tiền nhà.
2. **Visual Description:** giấy than hồng nhạt ló dưới mép gạt tàn; cận cảnh đọc được người thu Hòa và giờ 20:55. Không tự gán số tiền chưa được nguồn chốt.
3. **Initial Observation:**

[NARRATION]
Một góc giấy hồng nằm dưới gạt tàn. Bạn đợi cảnh sát ghi ảnh phần giấy rồi mới xem.

4. **Inspect Dialogue:**

[DETECTIVE | Attentive]
"Thu tiền phòng. Người thu ký tên Hòa."

5. **Detail Inspection:**

[NARRATION]
Bạn đọc dòng thời gian ở bản cận: **20:55**.

[DETECTIVE | Quiet]
"Giờ ghi trên giấy sớm hơn lần ông ấy nói đã lên."

Đây là so hai nội dung đã biết, chưa khẳng định giấy tự chứng minh ông đích thân vào hay Tùng sống. Inspect không chạy cuộc đối chất Hòa.

6. **Evidence Collected:** ảnh giấy đọc được chữ ký và giờ, khi kết Inspect.
7. **Evidence ID:** `EV_RentReceipt`.
8. **Notebook Description:** “Biên nhận tiền phòng nằm trên bàn 204, dưới mép gạt tàn. Chữ ký Hòa ở mục người thu; ghi giờ 20:55. Giờ trên giấy chưa là timestamp độc lập của giao dịch; cần đối chiếu lời Hòa.”
9. **Knowledge Unlocked:** giấy mang giờ/chữ ký trái cần làm rõ với lời chỉ lên 21:30; chưa biết khoản vượt nợ.
10. **Potential Contradiction:** `ST_P1_HOA_INITIAL` và `ST_P1_HOA_DOOR` nếu đã mở.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"20:55 trên biên nhận. Tôi sẽ để ông Hòa giải thích chữ ký trước."

12. **Required / Optional Flag:** required; `has("EV_RentReceipt")`.

#### [HOTSPOT: HP_DUST] NODE P2_WATCH

1. **Object Name:** Vòng trống trên lớp bụi mặt tủ.
2. **Visual Description:** tủ có bụi mỏng; khoảng sạch hình tròn cỡ mặt đồng hồ đeo tay, cạnh đồng hồ báo thức nứt. Không khắc tên chủ sở hữu hoặc thêm dấu nhận dạng quyết định.
3. **Initial Observation:**

[NARRATION]
Lớp bụi phủ mặt tủ, riêng một vòng nhỏ sáng hơn phần còn lại. Chiếc đồng hồ báo thức nứt vẫn ở bên cạnh.

4. **Inspect Dialogue:**

[DETECTIVE | Attentive]
"Ở đây từng đặt một vật tròn. Cỡ mặt đồng hồ đeo tay."

5. **Detail Inspection:**

[ACTION]
Bạn xem ảnh tủ chụp thẳng từ trên. Không quệt ngón tay qua lớp bụi.

[DETECTIVE | Quiet]
"Vật đó đã được lấy khỏi chỗ này."

Không tự nối Linh/định tối nay. Quan sát cổ tay nằm People cho người chơi đối chiếu, không có jump-cut Linh tự để lộ vật.

6. **Evidence Collected:** ảnh vòng bụi, không đồng hồ thực đã thu hồi.
7. **Evidence ID:** `EV_MissingWatch`.
8. **Notebook Description:** “Khoảng sạch hình tròn trên bụi mặt tủ đầu giường, cỡ mặt đồng hồ đeo tay; đồng hồ báo thức nứt còn ở cạnh. Gợi một món đồ bị lấy đi, chưa xác định người lấy, chủ sở hữu hoặc giờ.”
9. **Knowledge Unlocked:** dấu mất vật; phải hỏi chứ không chốt trộm bởi Linh.
10. **Potential Contradiction:** tạo câu hỏi cho lời ngủ của Linh; cần đồng hồ lộ và lời nhận trong Phase 3, không vòng bụi một mình.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"Khoảng sạch vẫn ở đó. Ai lấy món đồ mới là điều cần hỏi."

12. **Required / Optional Flag:** required; `has("EV_MissingWatch")`.

#### [HOTSPOT: HP_BED] NODE P2_COIN

1. **Object Name:** Giường, mép nệm; sau chi tiết mới gọi đồng xu lạ.
2. **Visual Description:** nệm cũ nằm trên giường; đồng xu bị che dưới nệm, không nhô từ túi nạn nhân. Không vẽ xu phát sáng hoặc đánh dấu đáp án trên background.
3. **Initial Observation:**

[NARRATION]
Bạn dừng ở mép nệm sờn. Phần bên dưới khuất khỏi tầm nhìn.

4. **Inspect Dialogue:**

[DETECTIVE | Neutral]
"Các anh có thể kiểm tra dưới mép này không?"

5. **Detail Inspection:** đây là action cần người chơi chọn, không tự chạy khi hover/click mở thumbnail.

[CHOICE]
A. Nhờ cảnh sát kiểm tra dưới mép nệm → P2_COIN_DETAIL.
B. Để sau → P2_ROOM, không Evidence.

**P2_COIN_DETAIL:**

[ACTION]
Cảnh sát xử lý phần nệm, ghi nhận vật dưới đó. Ảnh cung cấp cho bạn hiện một đồng xu xỉn màu, mặt khắc biểu tượng góc cạnh.

[DETECTIVE | Attentive]
"Không giống tiền đang dùng. Hình khắc này là gì?"

Không bật hồi tưởng/vết máu/15 năm trước. Không đáp tên mạng lưới.

6. **Evidence Collected:** ảnh xu và vị trí dưới nệm, chỉ khi P2_COIN_DETAIL kết.
7. **Evidence ID:** `EV_BoundaryCoin`.
8. **Notebook Description:** “Đồng xu kim loại xỉn, nặng theo ghi nhận cảnh sát, khắc biểu tượng hình học giống mốc ranh giới; tìm dưới nệm Tùng. Công dụng chưa rõ.” `status=unknown`, ở tab Evidence.
9. **Knowledge Unlocked:** có đồng xu/vị trí; chưa công dụng hoặc liên hệ quá khứ.
10. **Potential Contradiction:** không có statement đối chất vụ án hợp lệ. Không dùng làm chứng cứ Minh tráo thuốc.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Quiet]
"Tôi đã lưu hình khắc. Chưa biết nó dùng làm gì."

12. **Required / Optional Flag:** optional tại P2/P3. Không có thì không chặn Final; cần fallback cảnh sát cung cấp ảnh ở Phase 4 trước kết Ch1. Không giả đã Inspect nệm hoặc có xu ở túi nếu bỏ qua.

#### [HOTSPOT: HP_BOARD] NODE P2_SURVEY — ENVIRONMENTAL STORYTELLING

1. **Object Name:** Bảng nỉ, tờ khảo sát cư dân.
2. **Visual Description:** hóa đơn tiện ích và giấy tiêu đề “Khảo sát Cư dân Khu Trọ”; nhiều tên gạch chéo bằng bút đỏ. Không tự viết tên mới, số tiền, mã MG-07 hoặc tên K-Estate lên giấy.
3. **Initial Observation:**

[NARRATION]
Tờ giấy ghim lệch giữa những hóa đơn. Bạn đọc tiêu đề, nhìn những nét đỏ qua các dòng tên.

4. **Inspect Dialogue:**

[DETECTIVE | Thoughtful]
"Tùng khảo sát những người cùng khu trọ?"

5. **Detail Inspection:**

[DETECTIVE | Quiet]
"Những tên bị gạch chưa nói cho tôi biết việc này để làm gì."

6. **Evidence Collected:** không có. Chỉ lưu đã xem môi trường.
7. **Evidence ID:** không cấp.
8. **Notebook Description:** nếu ghi chú, thuộc People/Tùng: “Đã thấy tờ Khảo sát Cư dân Khu Trọ trên bảng nỉ, nhiều tên gạch đỏ; chưa biết công dụng.” Không tạo thẻ Present/Timeline hoặc tab thứ năm.
9. **Knowledge Unlocked:** đã thấy hoạt động ghi chép; chưa biết ép bán/xóa nợ hay động cơ tổ chức.
10. **Potential Contradiction:** chưa có; không cho Present tờ này như vật chứng chốt tội.
11. **Optional Reinspection Dialogue:**

[DETECTIVE | Neutral]
"Vẫn là các dòng tên và nét gạch. Tôi cần biết người lập bảng muốn gì."

12. **Required / Optional Flag:** optional; `flags.survey_seen=true`. Bỏ qua không đổi sự thật, không giả đã đọc ở cuối.

### D. NOTEBOOK UPDATES

Mỗi thẻ chỉ commit sau Inspect/Detail hoàn tất, nguồn `police_record`, `source_node`, `collected_phase`, ảnh, mô tả, giới hạn, status. Không đánh dấu đã thu khi chỉ hover hoặc đóng trước detail bắt buộc. Node đã commit không thu lần hai. Thông báo UI: “Đã ghi nhận: <tên thẻ>”.

| ID/bản ghi | Tab | Thời điểm ghi | Trạng thái người chơi |
| --- | --- | --- | --- |
| Tám EV ở C | Evidence | Cuối node thu tương ứng | Observed record; riêng xu Unknown |
| TL_P2_RECEIPT | Timeline | EV_RentReceipt commit | “20:55 ghi trên giấy”; source=document_inscription, precision=inscribed, status=needs_corrob; không “giao dịch chắc chắn lúc 20:55” |
| OBS_P2_SINK | People/Tùng | EV_WetTowel commit | Bồn/khăn có dấu sử dụng; time chưa biết |
| OBS_P2_SURVEY | People/Tùng | P2_SURVEY kết | Đã thấy giấy; environmental, không Present |

Vết cào/vòng bụi/hộp không cấp các mốc “21:00 lên cơn”, “đồng hồ lấy tối nay”, “hộp bóc tối nay”. Phase 1 statements chưa đổi thành dối trong UI. People không ghi Minh là hung thủ.

### E. PLAYER INTERACTION CONDITIONS

1. **Tự do thứ tự:** tám hotspot và bảng nỉ mở sau entry. Hai điều kiện thoại phụ chỉ đổi dòng gợi nhớ: biết lời rửa mặt hoặc đã xem ống; không khóa việc thu khăn/hộp.
2. **Input:** Inspect modal khóa click xuyên nền. Có Tiếp/Đóng; Đóng trước khi thu giữ pending chưa commit, lần sau trở lại bước cần đọc. Nệm A mới mở coin detail; B không thu. Không cần nhấn “nhặt” vật thật.
3. **Lối ra:** gate đúng năm ID, đánh giá bằng `has`, không số lần click. Thu thứ năm chỉ làm sáng nút “Trở ra hỏi chuyện”, không ép chuyển.
4. **Thiếu thẻ:** P2_EXIT_BLOCKED: “Bạn còn phần hiện trường cần ghi nhận trước khi hỏi tiếp.” UI đánh dấu mục chưa ghi trong danh sách nhiệm vụ, không đọc hết Inspect hoặc chỉ thủ phạm. Không phạt.
5. **Khăn/hộp còn thiếu khi rời:** màn xác nhận ghi “Còn điểm quan sát chưa ghi nhận. Bạn có thể quay lại trước khi hiện trường được bàn giao.” Người chơi chọn Quan sát tiếp hoặc Trở ra. Không tự phát hai thẻ.
6. **Quay lại Phase 3a:** tại P3_HUB, nút “Quay lại phòng 204” luôn mở trước time skip. Tái dùng BG_ROOM204 và C; entry cấp phép đã có, không kể cảnh sát tới lại. `current_phase` vẫn 3, `scene_location=room204`, `return_node=P3_HUB`. Lối ra quay lại hub, không chạy P2 ending lần hai. Evidence bổ sung ghi `collected_phase=3`.
7. **Vòng Minh:** Round 1 có thể hỏi trước; Round 2 trở đi cần cả EV_WetTowel/EV_InhalerBox ngoài năm thẻ. Thiếu thì lựa chọn đó khóa và cho chỉ dẫn quay lại, không NPC tiết lộ vật chưa Inspect. Không mở gửi mẫu/time skip khi thiếu bảy thẻ vụ án.
8. **Sau time skip:** không dùng hiện trường nguyên trạng cũ; nút quay lại đổi “Đọc hồ sơ hiện trường”. Thẻ đã ghi vẫn có ảnh/reinspect text; thẻ chưa thu không tự có. Trước skip đã bắt đủ bảy, nên không kẹt chuỗi vụ án. Xu không bắt buộc, nhận qua fallback P4 nếu thiếu.

### F. OPTIONAL INTERACTION

#### NODE P2_PERMISSION_REMINDER — HỎI CÁCH XEM

[DETECTIVE | Neutral]
"Nếu cần xem phía dưới đồ vật thì sao?"

[NPC: CẢNH SÁT | Firm]
"Anh chỉ chỗ. Chúng tôi xử lý, rồi anh xem bản ghi."

[GAME STATE]
Về P2_ROOM, không thẻ/điểm. Không mở quyền tự lục túi hoặc tự lấy vật.

#### NODE P2_BLANK — BẤM VÙNG KHÔNG HOTSPOT

Không phát một độc thoại mới cho mỗi click. Cursor trở lại bình thường; không trừ credibility, không phát nhạc phát hiện.

#### NODE P2_NOTEBOOK

[NARRATION]
Bạn giữ ngón tay giữa hai trang, đọc lại những gì đã ghi.

[GAME STATE]
Chỉ hiện thẻ đã commit và lời đã hỏi. Đóng về đúng Inspect hoặc P2_ROOM; không chạy ending ngầm.

Giấy khen Khang ở tường khu trọ thuộc nguồn S, không tự dời vào 204 để thêm hotspot cho nền này. Phase 3 có thể xem ảnh giấy khen ở nền hành lang đã có; fallback P4 vẫn áp dụng. Không thêm EV cho khảo sát, đồng hồ báo thức, ô hoặc chìa khóa.

### G. PHASE ENDING

#### NODE P2_READY — ĐỦ NĂM THẺ, CHƯA TỰ CHUYỂN

[GAME STATE]
`flags.phase2_exit_ready=true`; mở nút Trở ra. Người chơi tiếp tục click, đọc sổ hoặc chọn rời. Không phát bộ đàm cho đến khi thực sự chọn rời.

#### NODE P2_EXIT — NGƯỜI CHƠI CHỌN TRỞ RA

[NARRATION]
Bộ đàm bên vai viên cảnh sát rè lên. Anh nghe một lúc, đưa tay giữ phần cửa thông ra hành lang.

[NPC: CẢNH SÁT | Neutral]
"Pháp y sắp lên. Anh đứng ra ngoài giúp tôi."

[ACTION]
Bạn nhìn lại sổ. Biên nhận mang giờ 20:55. Ảnh mặt tủ giữ một vòng trống. Phần chốt lỏng đã được ghi nhận.

**Nếu có EV_InhalerBox:**

[NARRATION]
Bên ảnh ống hít là hộp đã mở trong thùng rác.

**Nếu chưa có EV_InhalerBox:**

[NARRATION]
Bạn dừng ở ảnh chiếc ống mở nắp trên bàn. Phần thuốc vẫn là một câu hỏi.

**Nếu có EV_WetTowel:**

[NARRATION]
Bạn giữ trang ghi góc bồn bằng một nếp gấp nhẹ.

**Nếu thiếu khăn hoặc hộp:**

[NPC: CẢNH SÁT | Firm]
"Cần quan sát thêm thì hỏi người giữ cửa, trước khi chúng tôi bàn giao hiện trường."

Sau đó, mọi nhánh:

[NARRATION]
Bạn gấp sổ, bước qua khoảng cửa được chừa. Bốn người vẫn chờ ở phía cầu thang. Lần này, bạn có những điều cụ thể để hỏi.

[PHASE END]
**Mở khóa Phase 3 — Những lời nói dối đầu tiên.** Không kết ai giết Tùng, không chạy đối chất tự động.

[GAME STATE]
`flags.phase2_complete=true`; `flags.phase3_unlocked=true`; `flags.press_unlocked=true`; `flags.present_unlocked=true`; `flags.deduction_unlocked=false`; `flags.scene_revisit_available=true`; `current_phase=3`; `current_node=P3_ENTRY`; `scene_location=hallway`. Giữ đúng evidence_collected thực có; credibility không đổi. Chụp checkpoint đầu Phase 3 sau commit handoff.

### H. GAME STATE

Schema version 2 theo Phase 1 G3/Bible I. `has(id)=evidence_collected.includes(id)`. Evidence record là dữ liệu giải thích, không một source quyền khác để UI suy đã thu. Runtime không đánh dấu collected chỉ vì evidence_master có ID.

```js
const PHASE2_CORE = [
  "EV_LooseLock", "EV_NeckScratches", "EV_Inhaler",
  "EV_RentReceipt", "EV_MissingWatch"
];
const MINH_PREP = [...PHASE2_CORE, "EV_WetTowel", "EV_InhalerBox"];
const canExitP2 = PHASE2_CORE.every(has) && flags.inspect_permission;
const canEnterMinhR2 = MINH_PREP.every(has) && flags.minh_r1_done;
// Ngoài các predicate trên: người chơi chọn hành động, modal đóng, input không busy.
```

| Event | Write | Không được write |
| --- | --- | --- |
| P2_ENTRY kết | inspect_permission, room204_entered | EV hoặc pháp y |
| Inspect commit | ID vào evidence_collected; evidence_records[ID]; flags `hp_<tên>_recorded` | ID khác, conclusion murderer |
| P2_COIN B | Không Evidence | EV_BoundaryCoin |
| P2_SURVEY | survey_seen, OBS_P2_SURVEY | Thẻ khảo sát, motive verified |
| Thu thẻ thứ năm | phase2_exit_ready | current_phase=3 tự động |
| Chọn rời sau gate | phase2_complete, phase3_unlocked, Press/Present, scene_revisit_available | Khăn/hộp/xu chưa thu |
| Quay lại P3a | scene_location, return_node; giữ current_phase=3 | Reset suspects/credibility hoặc phase2_complete |

Mọi Boolean trên đặt trong flags. `hp_<tên>_recorded` chỉ là trạng thái UI của node, gate dựa ID nên không lẫn click/chưa commit. Flags derive exit_ready/canEnterMinhR2 tính lại sau load. Không reset credibility về 100 khi quay lại.

### I. LOGIC AND CONTINUITY REVIEW

| Kiểm tra | Kết quả/giới hạn |
| --- | --- |
| Timeline | Không đặt giờ sử dụng khăn/hộp hoặc phút tử vong bằng hình ảnh. Biên nhận chỉ xác nhận chữ 20:55 trước lời Hòa |
| Tùng | Sàn cạnh giường; bồn trong 204 sau vách; không cảnh di chuyển thi thể |
| Quyền hiện trường | Cảnh sát cho quan sát, tự xử lý/chụp; thám tử xem bản ghi, không thao tác vật thật |
| Tám ID | Giữ nguyên. Xu dưới nệm theo R/D04, không túi theo F cũ |
| Khám nghiệm tự do | Mọi hotspot độc lập; không tự quan sát/thu tất cả trong mở/kết |
| Gate mới | Đúng năm ID theo yêu cầu; khăn/hộp bổ sung tại 204 trước vòng cần chúng và trước skip |
| Không softlock | P3a quay lại luôn được; bỏ mọi optional vẫn có đường bổ sung; coins không chặn case |
| Khảo sát | Environmental, không EV/Present; bỏ qua không được kể đã biết |
| Thuốc | Ống/hộp tạo nghi vấn, không xác nhận độc, tráo hoặc hung thủ |
| Vết cào | Hướng khó thở; chưa pháp y hoặc tuyệt đối loại mọi ngoại lực |
| Vòng bụi | Không định Linh/chủ đồ/giờ; cần đối thoại sau |
| K-Estate | Chưa giải xu/quá khứ/chữ ký. Không MG-07, Vũ, con tin hoặc chủ mưu ở Inspect |
| Asset | Một nền 204; Inspect ảnh riêng, cùng UI; portrait/audio có sẵn; không new scene khám nghiệm |

**[LOGIC GAP — đã xử lý bằng thiết kế đã duyệt]:** F cũ suy ống/hộp là thuốc bị tráo và tự loại các nghi phạm bằng giờ. Bản này chỉ thu hiện trạng; chuỗi cá nhân Minh thực hiện ở Phase 3 với gói R. Không tạo vật chứng quyết định mới trong Phase 2.

**[CẦN DUYỆT BẢN THẢO]:** vị trí rect theo asset thực, số ảnh cận có thể crop thay vẽ mới, các câu thoại và nhịp entry/exit. Không có thay đổi Canon mới cần chốt để chạy năm-thẻ → quay lại → bổ sung. F nguyên gốc còn lỗi lịch sử, quy tắc hiện tại theo Bible 1.2/yêu cầu mới.

+
+**Kiểm tra tài liệu đã thực hiện:** tám hotspot Evidence và hotspot môi trường có đủ 12 trường; gate lối ra đúng năm ID. Mô hình đường đi đã kiểm tra 40.320 thứ tự hotspot và 96 biến thể vào Phase 3/bổ sung. Đây là kiểm tra hợp đồng tài liệu, không phải kiểm thử game đã triển khai.
+