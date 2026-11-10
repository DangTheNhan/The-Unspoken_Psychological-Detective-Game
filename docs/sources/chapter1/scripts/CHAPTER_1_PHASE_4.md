# CHAPTER 1 — ÁN MẠNG TRONG PHÒNG TRỌ
## PHASE 4 — HẬU QUẢ VỤ ÁN VÀ CHUYỂN TIẾP CỐT TRUYỆN

**Bản triển khai 1.0.** Người thiết kế cho phép ngày 10/10/2026: “nếu phase 4 chưa chọn thì cứ theo proposal fix”. Áp dụng khuyến nghị A + S1 + S2 cùng các mặc định trong Decision Sheet: Minh khai hoàn cảnh bản thân; Hào biết loại thẻ; Linh thuật lời Tùng; cảnh sát cung cấp ảnh khảo sát nếu chưa xem; chuyển editorial sang Chapter 2. Đây là kịch bản mới theo phương án được phép, không giả rằng thoại đã có trong Story.txt.

Nguồn: Story Ch1–2; Project; Phase; Bible 1.2 và các Phase hiện tại. [CANON — S] giữ nguyên Minh trực tiếp tráo, cưỡng ép/nợ/con gái bị giữ, công việc Tùng và hình xu. [CANON — quyết định triển khai được phép] S1/S2 xác định nguồn truyền đạt: Hào nhận loại thẻ do việc thu nợ; Linh là người Tùng đã kể và cảnh báo. Những nguồn này là lời khai trong Notebook, không tự thành xác minh độc lập.

### A. NARRATIVE OPENING

Entry `P4_ENTRY`: deduction_solved, reconstruction_complete, final_notebook_updated, phase4_unlocked đều true. Scene vẫn là hành lang sau lượt đối chiếu có báo cáo, không gán mọi việc xảy ra lúc 21:35. Cảnh sát/NPC có mặt theo cảnh cuối Phase 3; không cần sprite mới, địa điểm mới hoặc người giữ con tin xuất hiện.

#### NODE P4_ENTRY

[NARRATION]
Bạn khép trang tái dựng. Tiếng giấy chạm bìa sổ nghe rõ hơn bạn tưởng.

Minh vẫn ngồi bên tường. Viên cảnh sát giữ tấm ảnh trước mặt anh, chờ anh nhìn lên. Hòa đứng cách đó vài bước; Linh kéo tay áo xuống rồi lại buông. Hào nhìn ra khoảng hành lang bên ngoài dải băng.

[NPC: CẢNH SÁT | Firm]
"Phần anh vừa nhận, chúng tôi sẽ ghi riêng. Bây giờ nói tiếp về việc anh bị ép."

[ACTION]
Bạn kéo chiếc ghế đang chắn lối sát vào tường, chừa khoảng trống cho người làm việc, rồi đứng ở phía ngoài Minh.

[NARRATION]
Bạn đã nối được chuyện xảy ra với chiếc ống. Còn người ép anh làm, và sức ép ấy, vẫn nằm ngoài phần đã kết.

[DETECTIVE | Gentle]
"Minh, tôi hỏi tiếp được chứ?"

[NPC: MINH | Exhausted]
"Anh hỏi đi."

[GAME STATE]
scene_location=hallway; mở P4_MINH_MENU. Không tăng credibility, không thu Evidence, không tuyên án.

### B. CHARACTER DIALOGUES

#### NODE P4_MINH_MENU

[CHOICE]
A. Anh bị ép bằng việc gì? → P4_MINH_DEBT.
B. Điều gì khiến anh nói không có cách khác? → P4_MINH_HOSTAGE.
C. Xem lại hồ sơ. → P4_HUB.

A/B chỉ hiện khi bản ghi tương ứng chưa có. Thứ tự A/B tự do. Hai chủ đề phải ghi trước kết Chapter, không buộc lặp câu hỏi.

#### NODE P4_MINH_DEBT

[DETECTIVE | Calm]
"Anh bị ép bằng việc gì?"

[NPC: MINH | Strained]
"Tôi mắc nợ họ. Tôi không trả được."

[DETECTIVE | Attentive]
"Người ép anh làm việc này là phía khoản nợ ấy?"

[NPC: MINH | Quiet]
"Ừ. Họ bắt tôi làm."

[ACTION]
Minh đặt hai bàn tay dưới đùi. Vai anh co lại, nhưng lần này anh không tìm một cách giải thích khác cho chiếc ống.

[DETECTIVE | Neutral]
"Tôi ghi đây là lời anh khai. Khoản nợ và những người liên quan còn phải kiểm tra."

[NPC: MINH | Exhausted]
"Tôi hiểu."

[NOTEBOOK UPDATE]
ST_P4_MINH_DEBT — Minh khai mắc nợ phía đã ép anh tác động vào ống; chưa xác minh khoản nợ hoặc danh tính người ép. Source: Minh, claimed.

[GAME STATE]
flags.minh_debt_detail_recorded=true; về P4_MINH_MENU.

#### NODE P4_MINH_HOSTAGE

[DETECTIVE | Gentle]
"Điều gì khiến anh nói không có cách khác?"

[NARRATION]
Minh nhìn lên bạn, rồi nhìn người cảnh sát. Miệng anh mím lại. Bạn chờ, không nhắc chiếc ống nữa.

[NPC: MINH | Breaking]
"Con gái tôi. Họ giữ con gái tôi."

[DETECTIVE | Quiet]
"Họ dùng con anh để ép anh làm việc này?"

[NPC: MINH | Strained]
"Ừ. Tôi sợ mất nó."

[ACTION]
Viên cảnh sát đưa cuốn sổ của mình gần hơn. Bạn hạ giọng, để Minh nói từng câu.

[DETECTIVE | Gentle]
"Thông tin nào kiểm tra được, anh nói với các anh ấy. Chuyện con anh cần được ghi riêng."

[NPC: CẢNH SÁT | Firm]
"Chúng tôi sẽ ghi nhận và kiểm tra phần này."

[NARRATION]
Bạn nhìn qua dải băng. Tùng không còn cơ hội nói thêm. Lời về con gái Minh khiến phần việc trước mặt nặng hơn; nó không làm phần hành vi đã nhận biến mất.

[NOTEBOOK UPDATE]
ST_P4_MINH_HOSTAGE — Minh khai con gái bị phía ép anh giữ làm sức ép. Nơi giữ, danh tính người giữ và tình trạng hiện tại chưa được xác minh. Không ghi đã giải cứu; không suy ý thức độc tính từ lời này.

[GAME STATE]
flags.minh_hostage_detail_recorded=true; về P4_MINH_MENU.

#### NODE P4_HOA_REACTION — TÙY CHỌN

[DETECTIVE | Neutral]
"Phần tiền ông lấy, ông nói rõ với cảnh sát nhé."

[NPC: HÒA | Worried]
"Tôi có giấu chuyện lấy tiền. Nhưng tôi không biết trong cái ống có thứ ấy."

[ACTION]
Hòa nhìn túi áo rồi đưa tay xuống, để hai bàn tay trống trước người.

[DETECTIVE | Calm]
"Tôi đã ghi riêng phần ông nhận. Ông cứ nói đúng phần mình biết."

[NPC: HÒA | Uneasy]
"Ừ."

[GAME STATE]
flags.hoa_aftermath_seen=true; về P4_HUB. Không lời dối mới/ngoại phạm tuyệt đối hoặc Evidence mới.

#### NODE P4_HAO_COIN — NGUỒN S1 ĐƯỢC PHÉP

Gate: EV_BoundaryCoin đã có record; ảnh được mở bằng thao tác người chơi. Không đưa vật thật cho Hào.

[ACTION]
Bạn mở ảnh đồng xu. Hào nhìn mặt khắc, rồi ngẩng lên trước khi bạn hỏi hết.

[DETECTIVE | Neutral]
"Anh nhận ra loại này?"

[NPC: HÀO | Guarded]
"Loại thẻ cho người đi khảo sát. Trong việc thu nợ, tôi đã gặp."

[DETECTIVE | Attentive]
"Để nhận người trong cùng mạng lưới?"

[NPC: HÀO | Flat]
"Để nhận ra nhau. Tôi nói loại thẻ, không nói ai đưa cái này cho Tùng."

[DETECTIVE | Calm]
"Ảnh được ghi dưới nệm cậu ấy. Tôi sẽ giữ riêng nơi tìm và điều anh vừa nói."

[NPC: HÀO | Cool]
"Vậy ghi cho đúng."

[NARRATION]
Hào nhìn lại phía người cảnh sát. Bạn không hỏi tên người thuê bằng cách chìa đồng xu lần nữa.

[NOTEBOOK UPDATE]
ST_P4_HAO_COIN_TYPE — Hào nhận loại xu là thẻ nhận diện người làm khảo sát trong mạng lưới thu nợ; nguồn kiến thức từ việc hắn làm. Lời khai chưa được kiểm chứng độc lập; chưa tên người cấp xu cho Tùng hoặc lãnh đạo mạng lưới. EV_BoundaryCoin giữ nơi tìm dưới nệm; thêm liên kết lời này, không dùng buộc Minh tráo.

[GAME STATE]
flags.coin_function_statement_recorded=true; về P4_HUB.

#### NODE P4_LINH_SURVEY — NGUỒN S2 ĐƯỢC PHÉP

Gate: đã xem khảo sát ở Phase 2 hoặc ảnh hợp lệ ở P4_SURVEY_RECORD. Không giả cô đã biết kết quả lab nếu thám tử chưa nói.

[DETECTIVE | Gentle]
"Tôi thấy tờ khảo sát của Tùng. Cậu ấy có nói với cô về việc đó không?"

[NPC: LINH | Hesitant]
"Có. Cậu ấy bảo gọi là khảo sát tiện ích, nhưng họ muốn biết ai đang nợ, ai dễ bị ép ký giấy."

[DETECTIVE | Attentive]
"Đó là Tùng nói với cô?"

[NPC: LINH | Quiet]
"Vâng. Cậu ấy nói tiền công được trừ vào nợ của mình."

[ACTION]
Linh giữ cổ tay. Mặt đồng hồ lộ ở mép tay áo; cô không cố kéo kín lại.

[DETECTIVE | Neutral]
"Cậu ấy có nói vì sao kể với cô không?"

[NPC: LINH | Strained]
"Cậu ấy dặn đừng ký giấy người ta đưa. Đừng ký mà chưa biết họ lấy nó để làm gì."

[NARRATION]
Cô dừng. Bạn để câu vừa nói nằm nguyên trên trang, không điền một ngày hoặc một cái tên vào khoảng còn thiếu.

[DETECTIVE | Gentle]
"Cô nói lại phần ấy với cảnh sát. Đây là điều cô nghe Tùng kể, tôi sẽ ghi rõ nguồn."

[NPC: LINH | Quiet]
"Vâng."

[NOTEBOOK UPDATE]
ST_P4_LINH_SURVEY_ACCOUNT — Linh thuật lời Tùng: khảo sát dưới danh tiện ích chuyển thông tin người nợ/dễ bị ép ký giấy; công được trừ vào nợ. Claimed/indirect, chưa danh sách thực hiện hoặc quan hệ tổ chức với K-Estate được chứng minh.

ST_P4_LINH_WARNING — Linh nói Tùng đã dặn cô đừng ký giấy chưa rõ mục đích trước vụ án. Chưa ngày/phút; không đọc nét gạch đỏ thành mã hoặc khoản nợ cụ thể.

[GAME STATE]
flags.tung_survey_account_recorded=true; flags.tung_warning_recorded=true; về P4_HUB.

### C. PLAYER INTERACTION VÀ HỒ SƠ TÙY TRẠNG THÁI

#### NODE P4_HUB

[CHOICE]
A. Hỏi thêm Minh. → P4_MINH_MENU.
B. Xem ảnh vật ghi dưới nệm. → P4_COIN_OPEN.
C. Xem tờ khảo sát. → P4_SURVEY_RECORD.
D. Hỏi Hào về loại xu. → P4_HAO_COIN.
E. Hỏi Linh về khảo sát. → P4_LINH_SURVEY.
F. Nói với Hòa về phần tiền. → P4_HOA_REACTION.
G. Xem giấy khen trên tường. → P4_CERTIFICATE.
H. Đọc lại Notebook. → P4_NOTEBOOK.
I. Khép hồ sơ vụ Tùng. → P4_CLOSE_GATE.

D cần ảnh xu, ẩn sau đã ghi S1; E cần khảo sát đã xem, ẩn sau đã ghi S2; F một lần; A luôn có để đọc lời đã khai. B/C/G không auto-collect khi vào hub. I thiếu dữ kiện chỉ hiển thị checklist theo bản ghi, không mất điểm. Không có nút kết tội, Present mới hoặc lựa chọn thay thủ phạm.

#### NODE P4_COIN_OPEN

Nếu có EV_BoundaryCoin: mở ảnh đã lưu, không tìm lại/thu trùng; nếu thiếu: chạy P4_COIN_RECORD. Sau ảnh hợp lệ chạy P4_MEMORY nếu chưa nhận hình, nếu đã nhận thì về hub.

#### NODE P4_COIN_RECORD — FALLBACK ĐÃ DUYỆT

[DETECTIVE | Neutral]
"Tôi muốn xem phần ghi nhận dưới nệm."

[NPC: CẢNH SÁT | Neutral]
"Đây. Có một đồng xu dưới nệm. Chúng tôi giữ vật và ghi ảnh nơi tìm."

[ACTION]
Bạn nhận quyền xem ảnh trong hồ sơ, không nhận đồng xu vào tay.

[NOTEBOOK UPDATE]
EV_BoundaryCoin — cùng ID/mô tả Phase 2, source=police_record, source_node=P4_COIN_RECORD, collected_phase=4. Không hồi tố đã Inspect nệm Phase 2.

[GAME STATE]
Thu record sau đoạn; đi P4_MEMORY. Nếu đã có ảnh thì không phát lại node thu.

#### NODE P4_SURVEY_RECORD

Nếu đã xem: mở ghi chú/ảnh môi trường đã có; nếu chưa xem: chạy phần sau.

[DETECTIVE | Neutral]
"Các anh cho tôi xem ảnh tờ khảo sát trên bảng được không?"

[NPC: CẢNH SÁT | Neutral]
"Ảnh tờ giấy ghim trong phòng ở đây."

[NARRATION]
Tiêu đề khảo sát nằm trên những dòng tên bị gạch đỏ. Bạn đọc trang giấy, dừng ở những phần chưa có lời giải thích.

[NOTEBOOK UPDATE]
OBS_P2_SURVEY — đã xem tờ khảo sát qua ảnh cảnh sát; giữ cùng nội dung quan sát Phase 2, source_node=P4_SURVEY_RECORD, observed_phase=4 nếu trước đó chưa có. Không cấp EV_Survey.

[GAME STATE]
flags.survey_seen=true; về hub. Không giải tên gạch đỏ thành dữ kiện chưa biết.

#### NODE P4_CERTIFICATE

Nếu đã có EV_KhangCertificate: chỉ mở ảnh; nếu thiếu: người chơi chọn xem/lưu giấy khen công khai đã có ở tường hành lang.

[NARRATION]
Trong khung nhỏ, giấy khen quỹ hỗ trợ khu trọ đã ngả màu. Bạn đọc tên Khang ở phần ký.

[DETECTIVE | Neutral]
"Giấy khen của quỹ hỗ trợ khu trọ."

[ACTION]
Bạn lưu ảnh giấy công khai vào sổ. Không zoom để nhấn nét khuyên tròn, không suy chủ mưu.

[NOTEBOOK UPDATE]
EV_KhangCertificate — “Ảnh giấy khen hỗ trợ khu trọ, chữ ký Khang. Mẫu tài liệu công khai, chưa có liên hệ chứng minh với cái chết Tùng.” Source public_document; source_node=P4_CERTIFICATE; collected_phase=4 chỉ nếu chưa thu.

[GAME STATE]
Lưu ảnh do người chơi bấm, về hub. Không lấy giấy thật hoặc cấp EV bài báo.

#### NODE P4_NOTEBOOK

[NARRATION]
Bạn lật lại những dòng vừa ghi. Bên cạnh lời Minh là tên người nói về đồng xu và tờ khảo sát. Các nguồn vẫn được giữ riêng.

[GAME STATE]
Đọc dữ liệu thực có; đóng về hub. Không tự thêm lời khai thiếu.

### D. NOTEBOOK UPDATE

Năm Statements trên là lời bổ sung, không Evidence mới. WHY kết luận vụ án đã giải không bị đổi thành chủ mưu đã rõ; phần bổ sung Phase 4 ghi thành các nguồn liên kết. People Minh ghi nợ/con tin là claimed; Hào ghi nhận loại thẻ; Linh ghi thuật lời Tùng. Nạn nhân vẫn là Tùng, không biến vai khảo sát thành lý do phán xét thay điều tra.

### E. MAIN MYSTERY FORESHADOWING

#### NODE P4_MEMORY

Gate: đã mở ảnh EV_BoundaryCoin bằng thao tác người chơi. Có thể xảy ra trước hoặc sau S1/S2; thoại không giả thám tử đã biết công dụng.

[NARRATION]
Bạn nhìn lâu hơn ở hình khắc. Một góc cắt vào đường thẳng, rồi một nét ngắn tách ra phía bên kia.

Cảm giác quen thuộc đến trước tên gọi. Bạn nhớ một mảng tường ở nhà, mười lăm năm trước. Vết máu trên đó đã để lại hình gần như thế này.

Bạn đưa ảnh ra xa, rồi nhìn lại. Vẫn là những nét ấy. Ký ức không cho bạn biết ai đã tạo chúng.

[DETECTIVE | Quiet]
"Mình đã thấy hình này."

[ACTION]
Bạn giữ trang ảnh bằng hai ngón tay, viết một ghi chú riêng bên dưới.

[NOTEBOOK UPDATE]
OBS_P4_COIN_MEMORY — thám tử nhận hình khắc giống vết máu trên tường nhà 15 năm trước; ký ức cá nhân cần đối chiếu. Không xác nhận cùng người gây án, số phận em gái, hoặc Khang có mặt.

[GAME STATE]
flags.coin_memory_recognized=true; về P4_HUB. Không Flashback Tương tác hoặc hình người gây án.

### F. CHAPTER 1 ENDING

#### NODE P4_CLOSE_GATE

Gate: minh_debt_detail_recorded, minh_hostage_detail_recorded, coin_function_statement_recorded, tung_survey_account_recorded, tung_warning_recorded, coin_memory_recognized; EV_BoundaryCoin và EV_KhangCertificate có record; survey_seen. Nếu thiếu, về hub với checklist nguồn chưa ghi; không tự thu hoặc phạt. Hòa reaction không bắt buộc.

#### NODE P4_END

[NARRATION]
Bạn kiểm tra dòng cuối của hồ sơ Tùng. Người trực tiếp đổi ống đã nhận hành vi; các phần của lời nhận đã có nguồn đối chiếu. Chuyện Minh mắc nợ và con gái bị giữ được ghi riêng, chờ kiểm tra tiếp.

Ở trang sau, một loại thẻ và lời kể về khảo sát đặt cạnh nhau. Chúng gợi ra việc dùng nợ để ép người trong khu trọ. Chưa có tên người ra lệnh, chưa có đường nối đủ chắc tới những người trên các bài báo.

[NPC: CẢNH SÁT | Firm]
"Những lời bổ sung này chúng tôi sẽ tiếp tục kiểm tra. Anh giữ đúng phần nguồn đã ghi."

[DETECTIVE | Calm]
"Tôi hiểu."

[ACTION]
Bạn đóng sổ, ngón tay còn giữ ở trang đồng xu.

[NARRATION]
Phòng 201 ở ngay đầu hành lang. Bạn từng chọn sống ở đây để có một chỗ quay về sau những vụ tìm đồ và theo dõi vụn vặt.

Hôm nay, một hình khắc dưới nệm phòng bên đã kéo mảng tường cũ trở lại. Bạn chưa thể gọi đó là bằng chứng về gia đình mình. Nhưng lần này, bạn có một hình ảnh để giữ lại, một nơi tìm được và những người đã nói về nó.

[DETECTIVE | Quiet]
"Mình sẽ bắt đầu từ những điều kiểm tra được."

[NOTEBOOK UPDATE]
Kết Ch1: giữ kết luận hành vi Minh; bổ sung hoàn cảnh cưỡng ép theo lời khai, lời về khảo sát/thẻ có nguồn, ký ức hình khắc cần đối chiếu. Không xóa phần unknown hoặc kết tổ chức đã được chứng minh toàn bộ.

[GAME STATE]
flags.phase4_complete=true; flags.chapter1_complete=true; mở P4_CHAPTER_TRANSITION.

### G. CHAPTER 2 TRANSITION

#### NODE P4_CHAPTER_TRANSITION

[ACTION]
Màn hình chuyển tối. Hồ sơ Tùng được lưu cùng các nguồn đã ghi.

[UI]
CHAPTER 2 — CON HẺM NƠI QUÁN BAR

[GAME STATE]
flags.chapter2_unlocked=true; chapter=2; current_phase=1; current_node=CH2_ENTRY. Đây là boundary chương sau, chưa có kịch bản Ch2 trong gói này. Không dựng Lâm xuất hiện sống, một cuộc hẹn, tin nhắn mới hoặc MG-07. Lý do thám tử tiếp cận hiện trường sẽ viết khi làm Ch2; không tự nối nguyên nhân hai vụ án.

### H. CANON CONSISTENCY REPORT

| Nội dung | Nguồn và mức biết |
| --- | --- |
| Minh/nợ/con gái bị giữ | S Canon; người chơi nhận lời Minh, chưa xác minh độc lập |
| Hào nhận loại thẻ | S1 mới đã được cho phép; không biết/khai người cấp xu cho Tùng hoặc lãnh đạo |
| Linh thuật khảo sát/xóa nợ/cảnh báo | S2 mới được phép; lời thuật, chưa ngày hoặc người nhận báo cáo cụ thể |
| Đồng xu | Dưới nệm; giữ bởi cảnh sát; ảnh cũ hoặc fallback mới đúng phase |
| Khảo sát | Môi trường/observation; không Evidence mới |
| Ký ức | Giống hình vết máu, không khẳng định số phận em gái |
| Khang | Giấy khen công khai giữ màu sắc môi trường; chưa thủ phạm đầu mạng lưới |
| Người giao/công ty/con tin | Chưa danh tính/địa điểm được nguồn xác nhận, không tự bổ sung |
| Sang Ch2 | Editorial theo A; không MG-07 hoặc quan hệ nghề nghiệp Lâm chưa duyệt |
| Gameplay | Hỏi/đọc/ảnh/flags, không cơ chế hoặc background mới; không trừ điểm hậu quả |

Không kết việc cứu con hoặc trách nhiệm pháp lý. Không sửa hung thủ, thời điểm actual, chuỗi chứng minh hoặc giới hạn lời Linh/Hòa/Hào của Phase 1–3.
