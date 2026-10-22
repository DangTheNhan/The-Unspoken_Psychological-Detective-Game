# CHAPTER 1 — ÁN MẠNG TRONG PHÒNG TRỌ
## PHASE 1 — MỞ CẢNH VÀ THU THẬP LỜI KHAI

**Bản kịch bản triển khai 1.2 — áp dụng các Proposed Fix được duyệt ngày 09/10/2026; đối chiếu Bible 1.2.**

Đã áp dụng ML-P1-01–08 theo lời duyệt “chốt sửa theo proposed fix”. Chọn schema chung ở G3; Hào tự giới thiệu tên trong node hiện có; giờ ước lượng được giữ trên UI; giờ cảnh sát tới chỉ ghi theo thứ tự quan sát. Nhánh Linh B giữ như lựa chọn sắc thái, không có hệ thiện cảm. Hợp đồng nối Hào/rửa mặt được thực hiện trong Phase 3. Không thay thủ phạm, động cơ hay Evidence ID.

Nguồn: MASTER PROMPT, Story, Project, Phase và Logic Repair đã duyệt. Nội dung mới là cách hành văn, cử chỉ, lựa chọn và mã triển khai; không thêm Evidence quyết định. Người chơi không biết hung thủ, cưỡng ép, con tin, công việc thật Tùng, hóa chất hoặc đồng xu trong Phase này.

**Quy ước:** nhãn lời kể/thoại/ACTION là nội dung hiển thị. NOTEBOOK UPDATE hiển thị thông báo ngắn và bản ghi trong sổ. GAME STATE, điều kiện, node ID và metadata chỉ dành cho người triển khai, không hiển thị như lời kể. Câu hỏi làm rõ là hội thoại bình thường, chưa phải cơ chế Press. Nhãn biểu cảm mô tả điều nhìn thấy, không xác nhận nội tâm.

### A. PHASE OVERVIEW

**Mục tiêu cốt truyện:** đưa bạn từ phòng 201 đến cửa phòng 204 lúc 21:35; tạo quan hệ với bốn người đang có lời kể khác nhau; giữ câu hỏi cái chết chưa có đáp án. Những chi tiết nhỏ khiến bạn muốn kiểm tra, không cho phép kết luận ai giết Tùng.

**Mục tiêu gameplay:** thu đủ bốn statements gốc; mở People/Timeline/Statements; chọn thứ tự hỏi Linh/Hào/Minh sau Hòa; hỏi thêm bề mặt hoặc kết thúc. Người chơi quyết định lượt hỏi, trò chơi không chọn hộ ba người cuối.

**Địa điểm:** phòng 201 mở cảnh, hành lang tầng trọ, bậu cửa 204 và cửa 205/lan can/cầu thang. Phòng 204 chỉ hiện qua cánh cửa trong background; không có điều khiển bước vào.

**Nhân vật:** bạn, Hòa, Linh, Hào; Minh đến từ cầu thang trong mở cảnh; hai cảnh sát ở cuối. Tùng chỉ xuất hiện bất động trong phần nền nhìn từ cửa. Không cần sprite người phòng 203.

**Dữ kiện nguồn liên quan:** thám tử sống 201; Tùng 204; Hòa báo; Linh 205; Hào nói thu nợ 203; Minh bạn thân ghé trước đó. Đồng hồ 21:35 là quan sát; các giờ 20:00/20:45/21:20/21:30 là lời khai. Thi thể trên sàn cạnh giường theo sửa đã duyệt. Không đưa khoảng rời actual 20:54 vào lời kể hoặc Notebook lúc này.

**Điểm xung đột đã xử lý trước bản thảo:** không dùng “Minh rời 20:45–20:50”; không xác nhận mọi NPC nói dối; không suy dép bụi chỉ có thể từ 204; không lộ cái đồng hồ Linh đang giấu; không suy Minh nhìn thuốc là tội lỗi. Em gái chết vẫn là niềm tin ban đầu và không được nhắc thành sự thật khách quan trong Phase này.

**Điều kiện bắt đầu:** game mới/tiến trình ở Ch1 P1, chưa có Evidence Ch1, credibility 100. **Điều kiện kết thúc:** cả bốn statements gốc được ghi và người chơi chọn kết thúc lượt hỏi; cảnh sát tới, mở Phase 2. Nếu chưa hỏi đủ, lựa chọn kết thúc đưa phản hồi ngắn, không trừ điểm.

**Nhịp:** Hòa mở bắt buộc vì là người báo; sau đó hub tự do. Câu tùy chọn không cần làm hết. Không timer thật; số phút trong thế giới truyện không chạy theo thời gian người dùng đọc.

### A1. DIALOGUE NODES

Các mã là hợp đồng triển khai, không mã Evidence. Trong bảng, các đích rút gọn như HOA_MENU tương ứng P1_HOA_MENU; mọi mã rút gọn thêm tiền tố P1_. Toàn bộ node dưới đây có nội dung ở phần B; node menu chọn tiếp, node thoại tự về menu được chỉ rõ.

| Node | Điều kiện vào | Mục đích | Node tiếp |
| --- | --- | --- | --- |
| P1_001 | phase=1, chưa mở | 201, 21:35, tiếng gõ cửa | P1_002 |
| P1_002 | sau 001 | Hòa báo, ra hành lang/nhìn 204 | P1_003 |
| P1_003 | sau 002 | Linh/Hào hiện diện, Minh tới | P1_HOA_01 |
| P1_HOA_01 | sau 003 | Hỏi phát hiện, thu statement Hòa | P1_HOA_MENU |
| P1_HOA_MENU | hoa_initial=true | Hỏi cảnh sát/gõ cửa hoặc dừng | HOA_02/03/04 |
| P1_HOA_02 | chọn A, chưa hỏi | Hòa nói đã báo cảnh sát/gọi Minh | HOA_MENU |
| P1_HOA_03 | chọn B, chưa hỏi | Làm rõ vị trí phát hiện theo lời Hòa | HOA_MENU |
| P1_HOA_04 | chọn C | Kết Hòa, mở hub | P1_HUB |
| P1_HUB | hoa_initial=true | Chọn NPC/Notebook/kết thúc | theo menu |
| P1_LINH_01 | gặp Linh lần đầu | Mở hỏi tự nhiên, statement ngủ | LINH_MENU |
| P1_LINH_MENU | linh_initial=true | Hỏi làm rõ/đáp lại/dừng | LINH_02/03/04 |
| P1_LINH_02 | chọn A, chưa hỏi | Giờ ngủ chỉ ước lượng | LINH_MENU |
| P1_LINH_03 | chọn B, chưa hỏi | Phản ứng né tránh, không xác minh lời ngủ | LINH_MENU |
| P1_LINH_04 | chọn C | Kết Linh | P1_HUB |
| P1_HAO_01 | gặp Hào lần đầu | Thu lời đi ngang/thu nợ | HAO_MENU |
| P1_HAO_MENU | hao_initial=true | Hỏi việc 203/vị trí/dừng | HAO_02/03/04 |
| P1_HAO_02 | chọn A, chưa hỏi | Giờ tới theo lời Hào | HAO_MENU |
| P1_HAO_03 | chọn B, chưa hỏi | Phản ứng trước hỏi đứng cạnh 204 | HAO_MENU |
| P1_HAO_04 | chọn C | Kết Hào | P1_HUB |
| P1_MINH_01 | gặp Minh lần đầu | Thu cuộc gặp, giờ rời trước 21:00 | MINH_MENU |
| P1_MINH_MENU | minh_initial=true | Chuyện nói/vấn đề rửa mặt/dừng | MINH_02/03/04 |
| P1_MINH_02 | chọn A, chưa hỏi | Né chuyện cá nhân | MINH_MENU |
| P1_MINH_03 | chọn B, chưa hỏi | Tùng bảo đi rửa mặt theo Minh | MINH_MENU |
| P1_MINH_04 | chọn C | Kết Minh | P1_HUB |
| P1_NOTEBOOK | chọn mở sổ | Đọc bản ghi đã có | trở về P1_HUB |
| P1_WAIT_LOCKED | chọn kết thúc, thiếu statement | Nhắc còn người chưa hỏi | P1_HUB |
| P1_REVISIT | chọn NPC đã gặp | Câu đáp ngắn/đọc lời đã ghi | menu NPC đó |
| P1_900 | all_initial=true, chọn kết thúc | Khép lượt hỏi, không giải án | P1_901 |
| P1_901 | sau 900 | Cảnh sát tới, bảo vệ cửa | P1_999 |
| P1_999 | sau 901 | Phase End, handoff | Phase 2 chưa viết |

### B. NOVEL SCRIPT

#### NODE P1_001 — PHÒNG 201

[NARRATION]
Giọt nước rơi khỏi mép cửa sổ, chạm chiếc bát nhựa trên bệ tường.

Đến tiếng thứ ba, bạn ngẩng lên. Nước đã luồn qua chỗ trám cũ, kéo một vệt sẫm xuống dưới khung kính. Bạn dịch cuốn sổ khỏi mép bàn rồi kéo cửa sổ sát lại. Góc dưới vẫn hở.

Đồng hồ chỉ **21:35**.

Có người đập cửa. Hai nhịp gấp, một nhịp hụt. Móng tay quệt trên gỗ.

[NPC: HÒA | Panicked]
"Anh ơi! Anh mở cửa giúp tôi với!"

[ACTION]
Bạn lấy áo trên lưng ghế, nhét cuốn sổ vào túi rồi mở cửa.

[GAME STATE]
`opening_seen=true`; `observed_time_2135=true`; chuyển `P1_002`.

#### NODE P1_002 — TỪ PHÒNG 201 ĐẾN CỬA 204

[NARRATION]
Hòa gần như tựa cả người vào tường. Vôi bong dưới lòng bàn tay lão; chiếc điện thoại nắp gập vẫn mở ở tay kia.

[DETECTIVE | Attentive]
"Có chuyện gì, ông Hòa?"

[NPC: HÒA | Breathless]
"Thằng Tùng nằm bên phòng. Anh qua xem giúp tôi. Tôi gọi mà nó không thưa."

[ACTION]
Hòa chỉ về cuối hành lang. Bạn tránh người lão, bước ra ngoài.

[NARRATION]
Nước tạt qua ban công, len giữa những viên gạch. Bạn men theo mép tường còn khô. Phía trên, sợi dây điện chùng xuống cạnh bóng huỳnh quang đang chớp nhẹ.

Cửa phòng 204 mở. Bạn dừng ở bậu, không đặt chân qua ngưỡng.

Tùng nằm trên sàn, sát mép giường. Một cánh tay gập gần người. Mặt cậu nghiêng về phía cửa, mắt mở. Bạn nhìn vai, rồi ngực, chờ một cử động. Từ bậu cửa, bạn không thấy gì nhúc nhích.

[DETECTIVE | Calm]
"Đứng ngoài này đã, ông Hòa."

[ACTION]
Bạn lùi nửa bước để cửa không bị chắn. Không chạm vào tay nắm, không cúi xuống thi thể.

[NARRATION]
Chìa khóa vẫn cắm ở mặt trong ổ. Trước chiếc bàn đầy đồ dùng, ghế còn ngay ngắn. Trong phần phòng nhìn được, bạn không thấy vật gì bị hất đổ.

[GAME STATE]
`scene_location=hallway`; `victim_seen_from_door=true`; `room204_entered=false`; `evidence_collected=[]`; chuyển `P1_003`.

#### NODE P1_003 — NHỮNG NGƯỜI NGOÀI HÀNH LANG

[NARRATION]
Linh đứng ở cửa 205, hai tay ôm khuỷu. Tay áo trái trùm gần hết bàn tay. Cô liếc vào 204 rồi nhìn xuống đường nứt giữa hai viên gạch.

Bên lan can, một người đàn ông chụm tay châm thuốc. Ánh lửa thoáng soi mặt anh ta. Chỗ anh đứng sát cửa 204; phòng 203 ở phía bên kia.

[NPC: NGƯỜI ĐÀN ÔNG | Guarded]
"Anh cứ hỏi ông chủ nhà trước đi."

[NARRATION]
Bạn chưa đáp. Tiếng bước chân chạy lên cầu thang khiến cả Hòa lẫn Linh quay đầu.

Minh xuất hiện ở khúc ngoặt. Tóc anh ướt, nước đọng ở vai áo. Anh bước nhanh thêm hai bước rồi dừng hẳn khi thấy Tùng. Bàn tay đang bám lan can siết lại, sau đó buông ra.

[NPC: MINH | Shaken]
"Ông Hòa vừa gọi tôi. Tùng làm sao vậy?"

[NPC: HÒA | Uneasy]
"Tôi cũng vừa biết. Anh ấy đang xem đấy."

[DETECTIVE | Gentle]
"Anh đứng ngoài đây đã, Minh. Để lối cửa trống."

[ACTION]
Minh đứng lệch sang một bên. Bạn quay lại Hòa, người đã đến gõ cửa phòng mình.

[GAME STATE]
`people_visible=[hoa,linh,hao,minh]`; `minh_arrived=true`; `npc_internal_knowledge_hidden=true`; chuyển `P1_HOA_01`.

#### NODE P1_HOA_01 — HÒA: LẦN ĐẦU LÊN TẦNG?

[DETECTIVE | Calm]
"Ông bình tĩnh một chút. Ông thấy Tùng lúc nào?"

[NPC: HÒA | Flustered]
"Chín rưỡi, mới đây thôi. Tôi lên thu tiền phòng. Gõ cửa mà nó không thưa."

[DETECTIVE | Attentive]
"Rồi ông thấy cậu ấy nằm trong đó?"

[NPC: HÒA | Defensive]
"Tôi định đẩy cửa thì đã thấy nó nằm đó. Anh thử nghĩ xem, gặp thế tôi còn biết làm gì?"

[ACTION]
Hòa gập điện thoại, nhét vào túi quần. Tay phải lại giữ miệng túi áo ngực. Dưới lớp vải cộm lên một khối vuông; vật bên trong vẫn khuất.

[DETECTIVE | Neutral]
"Trước đó tối nay ông có lên tầng này không?"

[NPC: HÒA | Insistent]
"Không. Tôi chỉ lên đây một lần, lúc chín rưỡi. Chưa bước vào phòng nó nửa bước. Anh làm chứng cho tôi nhé."

[NARRATION]
Hòa dịch chân. Trên gót dép lão, phía trên mép nước đọng, còn một lớp bụi đen giống bụi than.

[DETECTIVE | Calm]
"Lời ông vừa nói, tôi ghi lại nhé."

[ACTION]
Bạn viết tên Hòa, rồi mốc giờ. Lão dõi theo ngòi bút, mãi mới quay về phía cầu thang.

[NOTEBOOK UPDATE]
`ST_P1_HOA_INITIAL` — Hòa: "Tôi chỉ lên tầng này một lần lúc chín rưỡi. Tôi chưa hề bước vào trong phòng."

Nguồn: lời Hòa, chưa kiểm chứng. Timeline: khoảng 21:30, Hòa khai phát hiện Tùng. People: chủ trọ. Ghi chú quan sát: bụi đen gót dép; túi áo ngực cộm, chưa rõ vật bên trong.

[GAME STATE]
`hoa_initial=true`; `notebook_unlocked=true`; thêm `OBS_HOA_SHOES`, `OBS_HOA_POCKET`; mở `P1_HOA_MENU`.

#### NODE P1_HOA_MENU

[CHOICE]
A. "Ông báo cảnh sát chưa?" → `P1_HOA_02`.
B. "Lúc ông gọi Tùng, cậu ấy có trả lời không?" → `P1_HOA_03`.
C. "Tôi sẽ hỏi những người còn lại." → `P1_HOA_04`.

Điều kiện: A/B chỉ hiện khi chưa hỏi; C luôn hiện. Không thể chọn lấy đồ trong túi hoặc hỏi dựa vào biên nhận chưa biết.

#### NODE P1_HOA_02 — NHÁNH A

[DETECTIVE | Neutral]
"Ông báo cảnh sát chưa?"

[NPC: HÒA | Anxious]
"Gọi rồi. Cả cảnh sát, cả Minh. Có chuyện thế này thì tôi phải gọi chứ."

[DETECTIVE | Calm]
"Vậy ông chừa lối cho họ lên."

[ACTION]
Hòa nhìn ra cầu thang, kéo lại vạt áo rồi né khỏi giữa lối.

[NOTEBOOK UPDATE]
`ST_P1_HOA_CALLS` — Hòa nói đã báo cảnh sát và gọi Minh. Chưa có log cuộc gọi hoặc giờ gọi được đối chiếu.

[GAME STATE]
`hoa_calls_asked=true`; về `P1_HOA_MENU`. Không đổi credibility.

#### NODE P1_HOA_03 — NHÁNH B

[DETECTIVE | Attentive]
"Lúc ông gọi Tùng, cậu ấy có trả lời không?"

[NPC: HÒA | Defensive]
"Không. Tôi đứng ở cửa gọi. Nó không trả lời thì tôi mới nhìn vào."

[DETECTIVE | Neutral]
"Ông nhìn từ cửa?"

[NPC: HÒA | Insistent]
"Ngay cửa. Tôi đã bảo là chưa vào mà."

[ACTION]
Hòa xòe tay, thấy bạn vẫn cầm bút thì lại thu về. Những ngón tay miết ngang túi áo.

[DETECTIVE | Calm]
"Tôi chỉ hỏi ông đứng ở đâu."

[NOTEBOOK UPDATE]
`ST_P1_HOA_DOOR` — Hòa khẳng định mình gọi và nhìn từ cửa. Đây là phần làm rõ lời đầu, chưa chứng minh vị trí thật.

[GAME STATE]
`hoa_door_asked=true`; về `P1_HOA_MENU`.

#### NODE P1_HOA_04 — KẾT CUỘC HỎI HÒA

[DETECTIVE | Neutral]
"Ông đứng đây đã. Nếu nhớ thêm điều gì, nói với tôi."

[NPC: HÒA | Uneasy]
"Ừ, anh cứ hỏi. Tôi lên thu tiền thôi mà."

[NARRATION]
Bạn khép sổ, giữ một ngón tay giữa trang. Hòa lùi sát tường. Ba người còn lại vẫn đứng ngoài hành lang.

[GAME STATE]
`hoa_conversation_closed=true`; chuyển `P1_HUB`.

#### NODE P1_HUB — CHỌN NGƯỜI TIẾP THEO

[NARRATION]
Mưa gõ trên mái tôn dưới cầu thang. Bạn chọn chỗ khô, cách cửa Tùng vài bước, rồi quay về những người còn lại.

[CHOICE]
A. Nói chuyện với Linh, ở cửa phòng 205.
B. Nói chuyện với người đàn ông bên lan can. Sau khi `hao_name_known=true`, UI ghi “Nói chuyện với Hào”.
C. Nói chuyện với Minh, gần đầu cầu thang.

Ngoài ba lựa chọn thoại, UI có nút **Notebook**, **Hỏi lại Hòa** và **Kết thúc lượt hỏi**. Đây là nút của hub, không cần thêm nhánh hội thoại giả.

[GAME STATE]
A → `P1_LINH_01` nếu chưa ghi lời Linh, nếu đã ghi → `P1_REVISIT(linh)`.
B → `P1_HAO_01` hoặc `P1_REVISIT(hao)`.
C → `P1_MINH_01` hoặc `P1_REVISIT(minh)`.
Notebook → `P1_NOTEBOOK`.
Hỏi lại Hòa → `P1_REVISIT(hoa)`.
Kết thúc: `all_initial=false` → `P1_WAIT_LOCKED`; `all_initial=true` → `P1_900`.

Lời kể hub chỉ phát lần đầu; các lượt trở lại giữ màn menu, không lặp nguyên đoạn mưa.

#### NODE P1_LINH_01 — LINH: ĐÃ NGỦ TỪ SỚM

[DETECTIVE | Gentle]
"Linh, tôi hỏi cô một chút được không?"

[NPC: LINH | Wary]
"Vâng. Anh hỏi đi."

[NARRATION]
Bạn dừng trước Linh, chừa cho cô khoảng trống cạnh cửa. Cô ngẩng lên, mắt dừng ở cuốn sổ.

[DETECTIVE | Neutral]
"Cô ở phòng bên cạnh. Tối nay có nghe thấy gì từ phòng Tùng không?"

[NPC: LINH | Controlled]
"Không ạ. Tôi mệt nên tắt đèn ngủ sớm."

[DETECTIVE | Attentive]
"Khoảng mấy giờ?"

[NPC: LINH | Controlled]
"Tám giờ. Tám giờ hơn một chút. Tôi ngủ một mạch từ lúc đó, không nghe thấy hay biết gì cả."

[ACTION]
Cô nói liền một mạch. Bàn tay phải kéo tay áo bên trái xuống, che kín cổ tay rồi mới khoanh lại.

[NARRATION]
Nét eyeliner ở đuôi mắt Linh bị nhòe; phía gần mi còn mảnh và không đều. Bạn chỉ nhìn thoáng qua.

[DETECTIVE | Calm]
"Từ lúc ngủ đến giờ, cô không nghe gì?"

[NPC: LINH | Quiet]
"Vâng."

[NOTEBOOK UPDATE]
`ST_P1_LINH_INITIAL` — Linh: "Tôi ngủ từ khoảng tám giờ, không nghe thấy hay biết gì cả."

Nội dung tương đương statement nguồn, giữ lời phủ nhận biết/chứng kiến. Nguồn: Linh, chưa kiểm chứng. Timeline: khoảng 20:00 hoặc hơn, cô khai bắt đầu ngủ. People: hàng xóm phòng 205. Quan sát: che cổ tay trái, nét trang điểm nhòe; chưa thấy vật giấu.

[GAME STATE]
`linh_initial=true`; thêm `OBS_LINH_WRIST`, `OBS_LINH_MAKEUP`; chuyển `P1_LINH_MENU`.

#### NODE P1_LINH_MENU

[CHOICE]
A. "Cô có nhớ giờ rõ không?" → `P1_LINH_02`.
B. "Cô cứ nói điều mình nhớ được, không cần đoán." → `P1_LINH_03`.
C. "Được. Tôi sẽ hỏi những người khác." → `P1_LINH_04`.

A/B chỉ hiện khi chưa hỏi. Không có lựa chọn kéo tay áo hoặc khẳng định cô đang giấu đồng hồ.

#### NODE P1_LINH_02 — NHÁNH A

[DETECTIVE | Neutral]
"Cô có nhớ giờ rõ không?"

[NPC: LINH | Hesitant]
"Tôi không để ý đồng hồ. Chắc khoảng tám giờ."

[DETECTIVE | Calm]
"Ừ, khoảng tám giờ."

[ACTION]
Vai Linh hạ xuống một chút. Cổ tay trái vẫn nằm dưới tay áo.

[NOTEBOOK UPDATE]
`ST_P1_LINH_TIME` — Giờ ngủ là ước lượng theo trí nhớ Linh; không phải mốc 20:00 chính xác.

[GAME STATE]
`linh_time_asked=true`; về `P1_LINH_MENU`.

#### NODE P1_LINH_03 — NHÁNH B

[DETECTIVE | Gentle]
"Cô cứ nói điều mình nhớ được, không cần đoán."

[NPC: LINH | Defensive]
"Tôi không đoán. Tôi thực sự không biết."

[ACTION]
Cô đáp nhanh hơn lúc mở đầu. Hai ngón tay bên phải xoắn mép tay áo, rồi dừng lại.

[DETECTIVE | Calm]
"Tôi cũng sẽ hỏi những người còn lại."

[NPC: LINH | Quiet]
"Vâng, tôi biết."

[NOTEBOOK UPDATE]
Không tạo statement mới. Linh chỉ nhắc lại phủ nhận biết; trạng thái lời khai không đổi.

[GAME STATE]
`linh_reassured=true`; về `P1_LINH_MENU`. Không có điểm tin cậy thưởng hoặc tăng thiện cảm ảnh hưởng sự thật.

#### NODE P1_LINH_04 — KẾT CUỘC HỎI LINH

[DETECTIVE | Neutral]
"Cảm ơn cô. Tôi hỏi những người còn lại đã."

[NPC: LINH | Uneasy]
"Vâng."

[NARRATION]
Linh né về phía bản lề cho bạn đi qua. Cô vẫn đứng ngoài, tay giữ mép áo.

[GAME STATE]
`linh_conversation_closed=true`; về `P1_HUB`.

#### NODE P1_HAO_01 — HÀO: ĐẾN PHÒNG 203

[DETECTIVE | Neutral]
"Tôi nên gọi anh thế nào?"

[NPC: NGƯỜI ĐÀN ÔNG | Cool]
"Hào. Anh hỏi có việc gì?"

[GAME STATE]
`hao_name_known=true`; People chỉ lúc này ghi tên Hào, nguồn: anh tự giới thiệu. Từ dòng sau mới hiện nhãn HÀO.

[DETECTIVE | Neutral]
"Anh đến tìm ai ở đây?"

[NPC: HÀO | Cool]
"Đừng nhìn tôi như thế, thám tử. Tôi tìm người phòng 203."

[DETECTIVE | Calm]
"Tôi chỉ hỏi anh tìm ai."

[ACTION]
Hào gõ tàn thuốc cạnh lan can, mắt không hướng vào phòng Tùng.

[NPC: HÀO | Flat]
"Thu chút nợ. Khoảng chín giờ hai mươi tôi mới lên. Chỉ đi ngang 204 để đến 203 thôi."

[DETECTIVE | Attentive]
"Anh nói khoảng chín giờ hai mươi?"

[NPC: HÀO | Impatient]
"Ừ. Tôi đến 203. Trong kia có chuyện gì, tôi không biết."

[NARRATION]
Bạn nhìn sang cửa 203, rồi trở lại chỗ Hào tựa. Anh vẫn ở sát 204. Một mẩu tàn rơi xuống, vỡ trên gạch.

[DETECTIVE | Neutral]
"Được."

[NOTEBOOK UPDATE]
`ST_P1_HAO_INITIAL` — Hào: "Tôi chỉ đi ngang qua phòng 204 để đến phòng 203 thu nợ."

`ST_P1_HAO_TIME` — Hào khai tới khoảng 21:20. Nguồn: Hào, chưa đối chứng. People: người đến thu nợ theo lời anh; chưa ghi làm cho Vũ. Quan sát: đứng hút thuốc sát đoạn cửa 204, không chỉ ở cửa 203.

[GAME STATE]
`hao_initial=true`; thêm `OBS_HAO_POSITION`; chuyển `P1_HAO_MENU`.

#### NODE P1_HAO_MENU

[CHOICE]
A. "Anh có nhớ giờ lên rõ không?" → `P1_HAO_02`.
B. "Anh đang chờ ở đây à?" → `P1_HAO_03`.
C. "Được. Tôi đã ghi lời anh." → `P1_HAO_04`.

A/B chỉ hiện khi chưa hỏi. Không có lựa chọn ép nêu người thuê hoặc gọi anh là người của Vũ.

#### NODE P1_HAO_02 — NHÁNH A

[DETECTIVE | Attentive]
"Anh có nhớ giờ lên rõ không?"

[NPC: HÀO | Cool]
"Khoảng chín giờ hai mươi. Tôi không đứng đây canh từng phút."

[DETECTIVE | Calm]
"Anh nhớ giờ đó, hay chỉ ước chừng?"

[ACTION]
Hào nhìn bạn hết một nhịp, rồi rút điếu thuốc khỏi miệng.

[NPC: HÀO | Flat]
"Tôi đã nói khoảng rồi đấy."

[NOTEBOOK UPDATE]
Cập nhật `ST_P1_HAO_TIME`: giờ ước lượng, không timestamp được xác nhận.

[GAME STATE]
`hao_time_asked=true`; về `P1_HAO_MENU`.

#### NODE P1_HAO_03 — NHÁNH B

[DETECTIVE | Neutral]
"Anh đang chờ ở đây à?"

[NPC: HÀO | Guarded]
"Đứng hút điếu thuốc. Có gì lạ sao?"

[DETECTIVE | Calm]
"Chỗ anh đứng sát phòng Tùng."

[ACTION]
Hào nhìn theo hướng mắt bạn. Anh không dịch sang phía 203.

[NPC: HÀO | Cool]
"Hành lang có từng này. Anh muốn tôi đứng đâu?"

[DETECTIVE | Neutral]
"Anh cứ đứng đó. Đừng chắn cửa."

[NOTEBOOK UPDATE]
`ST_P1_HAO_STANDING` — Hào nói đang đứng hút thuốc. Đây là lời giải thích vị trí hiện tại, không xác nhận thời gian đứng hoặc đã nghe/thấy gì bên trong.

[GAME STATE]
`hao_position_asked=true`; về `P1_HAO_MENU`.

#### NODE P1_HAO_04 — KẾT CUỘC HỎI HÀO

[DETECTIVE | Neutral]
"Được. Cảnh sát đến, anh nói lại việc ở phòng 203 với họ."

[NPC: HÀO | Cool]
"Họ hỏi thì tôi trả lời."

[NARRATION]
Bạn tránh làn khói. Mắt Hào theo cuốn sổ một thoáng rồi quay ra ban công.

[GAME STATE]
`hao_conversation_closed=true`; về `P1_HUB`.

#### NODE P1_MINH_01 — MINH: CUỘC GẶP TRƯỚC CHÍN GIỜ

[NARRATION]
Minh đứng tách ở đầu hành lang. Bạn đợi anh ngẩng lên.

[DETECTIVE | Gentle]
"Minh, anh có nói chuyện được không?"

[NPC: MINH | Strained]
"Được. Anh hỏi đi."

[DETECTIVE | Neutral]
"Lần cuối anh gặp Tùng là khi nào?"

[ACTION]
Minh nhìn về cửa 204. Miệng anh hé ra rồi khép lại. Một hơi thở kéo dài trước câu trả lời.

[NPC: MINH | Subdued]
"Tối nay tôi có ghé. Khoảng tám giờ bốn mươi lăm. Chúng tôi nói chuyện một lát."

[DETECTIVE | Attentive]
"Anh về lúc nào?"

[NPC: MINH | Strained]
"Trước chín giờ. Lúc tôi về, cậu ấy vẫn bình thường. Sau đó thế nào, tôi không biết."

[NARRATION]
Bạn nhìn theo anh. Qua cửa mở, một ống hít nằm gần mép bàn dưới ánh đèn.

Bạn quay lại. Minh vẫn nhìn về phía bàn.

[DETECTIVE | Calm]
"Anh đến khoảng tám giờ bốn mươi lăm, về trước chín giờ?"

[NPC: MINH | Quiet]
"Ừ."

[NOTEBOOK UPDATE]
`ST_P1_MINH_INITIAL` — Minh: "Tôi ghé qua nói chuyện với Tùng khoảng 20:45 và rời đi trước 21:00. Lúc đó cậu ấy vẫn bình thường."

Nguồn: Minh, chưa đối chứng. Timeline giữ giờ đến ước lượng và giới hạn giờ rời, không ghi 20:50 hoặc 20:54. People: bạn thân Tùng. Quan sát: nhìn về chiếc bàn/ống hít; không tạo `EV_Inhaler`, không ghi nắp mở/hóa chất.

[GAME STATE]
`minh_initial=true`; thêm `OBS_MINH_GAZE`; chuyển `P1_MINH_MENU`.

#### NODE P1_MINH_MENU

[CHOICE]
A. "Hai người nói chuyện gì?" → `P1_MINH_02`.
B. "Trước lúc anh về, Tùng có nói gì không?" → `P1_MINH_03`.
C. "Anh cứ đứng đây. Tôi hỏi những người khác đã." → `P1_MINH_04`.

A/B chỉ hiện khi chưa hỏi. Không có lựa chọn nói thuốc bị tráo, nhắc con gái hoặc lấy đồ Minh mang theo.

#### NODE P1_MINH_02 — NHÁNH A

[DETECTIVE | Neutral]
"Hai người nói chuyện gì?"

[NPC: MINH | Guarded]
"Chuyện riêng thôi. Không có gì lớn."

[DETECTIVE | Calm]
"Có điều gì anh thấy cần nói với tôi không?"

[ACTION]
Minh xoa hai tay. Anh nhìn xuống cầu thang.

[NPC: MINH | Quiet]
"Chúng tôi chỉ tán gẫu vài câu."

[NARRATION]
Bạn chờ. Minh không nói thêm, hai bàn tay đã ngừng xoa.

[DETECTIVE | Neutral]
"Được. Chuyện riêng."

[NOTEBOOK UPDATE]
`ST_P1_MINH_TOPIC` — Minh mô tả cuộc gặp là chuyện cá nhân/tán gẫu; không cung cấp nội dung cụ thể. Chưa xác minh.

[GAME STATE]
`minh_topic_asked=true`; về `P1_MINH_MENU`.

#### NODE P1_MINH_03 — NHÁNH B

[DETECTIVE | Attentive]
"Trước lúc anh về, Tùng có nói gì không?"

[NPC: MINH | Subdued]
"Cậu ấy bảo đi rửa mặt. Tôi cũng về sau đó."

[DETECTIVE | Neutral]
"Lúc ấy anh thấy cậu ấy vẫn bình thường?"

[NPC: MINH | Insistent]
"Vẫn bình thường. Tôi thề, tôi rời đi trước chín giờ."

[ACTION]
Minh nhìn bạn ở câu cuối. Khi bạn cúi ghi sổ, anh lại nhìn qua vai bạn về phía cửa mở.

[DETECTIVE | Calm]
"Tôi nghe rồi."

[NOTEBOOK UPDATE]
`ST_P1_MINH_WASH` — Minh nói Tùng bảo đi rửa mặt trước khi anh rời đi. Không xác định vị trí bồn, thời gian rửa chính xác hoặc khoảng tráo. Lời “bình thường khi về” được giữ, không đánh dấu là lời dối đã chứng minh.

[GAME STATE]
`minh_wash_asked=true`; về `P1_MINH_MENU`.

#### NODE P1_MINH_04 — KẾT CUỘC HỎI MINH

[DETECTIVE | Gentle]
"Cảm ơn anh. Nếu nhớ thêm, cứ gọi tôi."

[NPC: MINH | Quiet]
"Ừ."

[NARRATION]
Minh gật đầu, vẫn đứng đó. Bạn tránh khỏi đầu cầu thang.

[GAME STATE]
`minh_conversation_closed=true`; về `P1_HUB`.

#### NODE P1_REVISIT — HỎI LẠI NGƯỜI ĐÃ GẶP

Chỉ phát một trong bốn đoạn, theo NPC người chơi chọn. Không chạy lại node gốc và không thêm bản sao statement.

**Nếu là Hòa:**

[DETECTIVE | Neutral]
"Tôi hỏi ông thêm một chút."

[NPC: HÒA | Uneasy]
"Còn gì nữa à? Anh hỏi đi."

**Nếu là Linh:**

[DETECTIVE | Gentle]
"Linh, tôi hỏi thêm được không?"

[NPC: LINH | Wary]
"Vâng. Tôi cũng chỉ nói được như lúc nãy thôi."

**Nếu là Hào:**

[DETECTIVE | Neutral]
"Còn một điều tôi muốn hỏi."

[NPC: HÀO | Cool]
"Anh hỏi rồi đấy. Muốn hỏi thêm gì?"

**Nếu là Minh:**

[DETECTIVE | Gentle]
"Minh, còn một chi tiết."

[NPC: MINH | Strained]
"Anh nói đi."

[GAME STATE]
Về menu tương ứng; câu tùy chọn đã hỏi bị ẩn. Khi cả A/B đã hỏi, C vẫn cho kết thúc. Có thể đọc statement gốc trong Notebook; không lặp thoại để farm flag/điểm.

#### NODE P1_NOTEBOOK — ĐỌC SỔ

[NARRATION]
Bạn mở trang vừa viết. Mỗi mốc giờ nằm dưới tên người kể. Ở lề là những điều bạn đã nhìn thấy.

[NOTEBOOK UPDATE]
UI chỉ hiện People/Statements/Timeline đã mở bởi các node thực sự chạy. Evidence: **Chưa có vật chứng được ghi nhận**. Ghi chú quan sát nằm trong hồ sơ People, không tạo tab thứ năm.

[GAME STATE]
`return_node=P1_HUB`; đóng sổ trở lại hub; không cho gọi Present từ sổ.

#### NODE P1_WAIT_LOCKED — CHƯA HỎI ĐỦ

[NARRATION]
Bạn nhìn lại hành lang. Còn người chưa được hỏi về tối nay.

[GAME STATE]
UI chỉ đánh dấu NPC chưa có statement bằng biểu tượng hội thoại, không tiết lộ đáp án. Trở lại `P1_HUB`; credibility không đổi. Không phát còi cảnh sát sớm ở nhánh này.

#### NODE P1_900 — KHÉP LƯỢT HỎI

[NARRATION]
Bạn đặt ngòi bút dưới dòng cuối, không viết thêm.

Hòa nói mình chỉ lên một lần. Linh nói ngủ từ sớm. Hào nói việc của anh ở phòng 203. Minh nói Tùng vẫn bình thường lúc anh rời đi.

Bạn nhìn qua cửa 204. Tùng vẫn nằm ở đó. Bạn giữ đầu bút trên trang giấy thêm một nhịp rồi thôi.

[ACTION]
Bạn gấp sổ, giữ nó trong tay.

[GAME STATE]
`interview_round_complete=true`; chuyển `P1_901`.

#### NODE P1_901 — CẢNH SÁT TỚI

[NARRATION]
Tiếng còi vọng vào từ đầu ngõ. Hòa ngẩng phắt lên. Linh né sát cửa 205; Hào hạ điếu thuốc. Minh nhìn về cầu thang.

Ánh xanh đỏ quét qua tấm kính cuối hành lang. Tiếng bước chân dồn lên cầu thang. Hai cảnh sát mặc áo mưa xuất hiện ở khúc ngoặt.

[NPC: CẢNH SÁT | Firm]
"Phòng 204 ở đâu? Ai là người báo?"

[NPC: HÒA | Hasty]
"Tôi gọi. Phòng đằng kia, 204."

[ACTION]
Bạn lùi sang phía tường, nhường đường. Một người tiến tới cửa 204, người còn lại giữ khoảng hành lang phía sau.

[DETECTIVE | Calm]
"Tôi ở phòng 201. Ông Hòa sang gọi tôi. Tôi chưa vào trong."

[NPC: CẢNH SÁT | Firm]
"Mọi người đứng lùi lại. Chưa ai chạm vào đồ trong phòng nhé."

[NARRATION]
Dải băng căng ngang lối vào. Qua cửa, bạn vẫn thấy chiếc bàn và mép giường.

Bạn cất sổ. Hòa còn nhìn về phía bạn, nhưng lần này không nói gì.

[GAME STATE]
`police_arrived=true`; `scene_secured=true`; `room204_entered=false`; chuyển `P1_999`.

#### NODE P1_999 — PHASE END

[PHASE END]
Cảnh sát đã đến. Bốn lời khai ban đầu đã được ghi nhận. **Mở khóa Phase 2 — Khám nghiệm hiện trường.**

[GAME STATE]
`phase1_complete=true`; `current_phase=2`; `phase2_unlocked=true`; `investigation_available_in_phase2=true`.

`press_unlocked=false`; `present_unlocked=false`; `deduction_unlocked=false`; `evidence_collected=[]`; `credibility=100`.

Lưu tiến trình sau chuyển phase. Chỉ mở quyền truy cập Scene tiếp; không chạy Inspect, thu Evidence hoặc hội thoại cấp phép Phase 2 trong tài liệu này.

### C. PLAYER CHOICES VÀ PHẢN HỒI

Response là node thoại đầy đủ ở phần B; không cần người triển khai tự sáng tác đoạn nối. Chọn câu nào trước không đổi nội dung câu còn lại, sự thật hay mức nghi phạm. Không có lựa chọn kết tội.

| Menu/lựa chọn | Response | Information unlocked | State change | Next node |
| --- | --- | --- | --- | --- |
| HOA A | P1_HOA_02 | Đã gọi theo Hòa, không log | hoa_calls_asked | HOA_MENU |
| HOA B | P1_HOA_03 | Vị trí nhìn theo Hòa | hoa_door_asked | HOA_MENU |
| HOA C | P1_HOA_04 | Không thêm | hoa_conversation_closed | HUB |
| HUB A/B/C | NPC lần đầu hoặc REVISIT | Statement gốc khi lần đầu | flag initial tương ứng | Menu NPC |
| LINH A | P1_LINH_02 | Giờ ngủ ước lượng | linh_time_asked | LINH_MENU |
| LINH B | P1_LINH_03 | Không dữ kiện mới | linh_reassured | LINH_MENU |
| LINH C | P1_LINH_04 | Không thêm | linh_conversation_closed | HUB |
| HAO A | P1_HAO_02 | Giờ đến ước lượng | hao_time_asked | HAO_MENU |
| HAO B | P1_HAO_03 | Giải thích vị trí hiện tại | hao_position_asked | HAO_MENU |
| HAO C | P1_HAO_04 | Không thêm | hao_conversation_closed | HUB |
| MINH A | P1_MINH_02 | Chuyện cá nhân, chưa chi tiết | minh_topic_asked | MINH_MENU |
| MINH B | P1_MINH_03 | Rửa mặt theo Minh | minh_wash_asked | MINH_MENU |
| MINH C | P1_MINH_04 | Không thêm | minh_conversation_closed | HUB |
| Notebook | P1_NOTEBOOK | Chỉ bản ghi đã mở | Không thay facts | HUB |
| Hỏi lại Hòa/NPC đã gặp | P1_REVISIT | Không tự thêm lời | Không ghi trùng | Menu NPC |
| Kết thúc khi thiếu | P1_WAIT_LOCKED | Nhắc còn người cần hỏi | Không phạt | HUB |
| Kết thúc khi đủ | P1_900–999 | Cảnh sát tới | phase1_complete | Handoff Phase 2 |

**Điều kiện khóa:** hub chỉ mở sau Hòa. Mọi NPC khác đã hiện diện nên không cần khóa Minh theo đã hỏi Linh/Hào. A/B của từng menu chỉ mở sau statement gốc, hỏi một lần rồi ẩn. Nút kết thúc phase chỉ qua gate đủ bốn statements, không yêu cầu tùy chọn. Hào đứng hút thuốc hiện tại không được biến thành ngoại phạm hoặc việc anh chứng kiến cái chết.

### D. INTERACTIVE INVESTIGATION

**Không có khám nghiệm Point-and-Click trong Phase 1.** Không khai báo hotspot cho khóa/khăn/cổ/ống/hộp/biên nhận/vệt bụi/đồng xu. Click nhân vật chỉ chọn nói chuyện; ảnh phòng là phần nền. Người chơi không được thao tác thi thể, thử khóa, lục túi hoặc chụp Evidence.

| Ghi chú quan sát | Nguồn node | Nội dung cho People | Giới hạn |
| --- | --- | --- | --- |
| OBS_HOA_SHOES | HOA_01 | Bụi đen như than ở gót dép | Chưa xác định nguồn bụi |
| OBS_HOA_POCKET | HOA_01 | Túi áo ngực cộm, tay giữ miệng túi | Chưa thấy tiền hoặc giấy |
| OBS_LINH_WRIST | LINH_01 | Liên tục kéo tay áo trái che cổ tay | Chưa thấy/nhận dạng đồng hồ |
| OBS_LINH_MAKEUP | LINH_01 | Eyeliner nhòe/không đều | Không xác định đã thức bao lâu |
| OBS_HAO_POSITION | HAO_01 | Hút thuốc đoạn sát cửa 204 | Không chứng minh đã vào hoặc giờ đứng |
| OBS_MINH_GAZE | MINH_01 | Hướng nhìn phía bàn/ống hít | Không chứng minh thuốc bị tác động |

Đây là observations dùng cho gợi nhớ, không Evidence ID. Không cho mở popup cận cảnh vật thật từ các ghi chú này. Khi một NPC chưa được chọn, lời kể mở cảnh có thể giới thiệu hình ảnh, nhưng People ghi chú chuyên biệt chỉ xuất hiện lúc node tương ứng chạy.

### E. CROSS-EXAMINATION

Press/Present **chưa mở**. Các câu hỏi trong menu không kiểm tra contradiction, không dùng Evidence, không có đúng/sai hoặc mất uy tín. Không có nhánh ép Hòa nhận lấy tiền, Linh nhận trộm, Hào khai Vũ hoặc Minh nhận tác động thuốc. Không mượn nội dung Phase 3 làm câu hỏi làm rõ ở đây.

### F. DEDUCTION

Không có Final Deduction, theory chốt thủ phạm hoặc tái dựng vụ án. Thám tử chỉ có các câu kể cần kiểm tra. Không chấm người chơi chọn nghi ai. Kết phase dựa vào đủ lời đầu và cảnh sát tới, không chọn WHO/WHAT/WHEN/WHY.

### G. STATEMENTS VÀ GAME STATE

#### G1. Statement database

Mức đáng tin chỉ là metadata thiết kế; UI tất cả lời NPC hiện **chưa kiểm chứng**. Không hiển thị “dối”, “hung thủ”, “vô tội” hoặc actual timeline.

| ID triển khai | Nội dung | Unlock | Metadata thiết kế, không hiện cho người chơi |
| --- | --- | --- | --- |
| ST_P1_HOA_INITIAL | Chỉ lên một lần 21:30, chưa vào | HOA_01 | Dối che lần vào/lấy tiền; giữ cho biên nhận ở Phase sau |
| ST_P1_HOA_CALLS | Nói đã gọi cảnh sát/Minh | HOA_02 | Phù hợp diễn biến, chưa log xác minh |
| ST_P1_HOA_DOOR | Nói gọi/nhìn từ cửa | HOA_03 | Tăng chi tiết phủ nhận vào, chưa kiểm |
| ST_P1_LINH_INITIAL | Ngủ từ khoảng tám giờ, không biết/hear gì | LINH_01 | Dối che lần vào/trộm và chứng kiến; không lộ trong kể |
| ST_P1_LINH_TIME | Giờ ngủ ước lượng | LINH_02 | Không tạo timestamp chính xác |
| ST_P1_HAO_INITIAL | Qua 204 thu nợ 203 | HAO_01 | Việc 203 phù hợp canon; “chỉ đi ngang” không kể đủ việc đứng |
| ST_P1_HAO_TIME | Tới khoảng 21:20 | HAO_01; 02 làm rõ | Chưa đối chứng trong phase này |
| ST_P1_HAO_STANDING | Đang hút thuốc | HAO_03 | Chỉ hiện tại, không lời thừa nhận đứng lúc 21:20/chứng kiến |
| ST_P1_MINH_INITIAL | Tới 20:45, rời trước 21:00, Tùng bình thường | MINH_01 | Phù hợp actual khái quát, không coi câu bình thường là dối |
| ST_P1_MINH_TOPIC | Chuyện cá nhân/tán gẫu | MINH_02 | Che hành vi nhưng không bác được bằng quan sát |
| ST_P1_MINH_WASH | Tùng bảo đi rửa mặt trước khi Minh rời | MINH_03 | Hỗ trợ câu hỏi cơ hội sau; chưa định phút/cách thao tác |

Statement được thêm theo khóa ID, cập nhật thay vì append trùng. Người chơi có thể bỏ tất cả câu tùy chọn mà vẫn có bốn lời gốc và câu thời gian Hào. Phase 3 sau này phải Press để mở chi tiết rửa mặt nếu ST_P1_MINH_WASH chưa có; không mặc định thám tử đã biết từ nhánh bỏ qua.

#### G2. People và Timeline

People chỉ gồm: Hòa chủ trọ, Linh hàng xóm 205, Hào đến thu nợ theo anh, Minh bạn thân Tùng; Tùng là người 204 đang bất động được nhìn từ cửa. Không thêm nợ Minh/con gái, tên Vũ, công việc khảo sát, vai hung thủ hoặc kết quả pháp y.

| Timeline record | Thời gian | Nguồn/trạng thái |
| --- | --- | --- |
| TL_P1_OPENING | 21:35 | Đồng hồ phòng 201, quan sát trực tiếp |
| TL_P1_HOA_DISCOVERY | khoảng 21:30 | Hòa khai, chưa đối chứng |
| TL_P1_LINH_SLEEP | khoảng 20:00 hoặc hơn | Linh khai; sửa độ chính xác nếu hỏi LINH_02 |
| TL_P1_HAO_ARRIVAL | khoảng 21:20 | Hào khai, chưa đối chứng |
| TL_P1_MINH_VISIT | tới khoảng 20:45; rời trước 21:00 | Minh khai, không gán giờ rời cụ thể |
| TL_P1_POLICE | Sau lượt hỏi | Quan sát tới ở node 901; Player Timeline không hiển thị 21:45. Mốc khoảng 21:45 chỉ ở Actual Timeline của Bible |

Không có 20:55 biên nhận, 21:05 Linh, giờ tráo hoặc giờ chết trong Player Timeline P1. Actual trong Bible không truyền sang UI.

#### G3. Hợp đồng trạng thái chung đã chốt

Schema save `schema_version=2` dùng snake_case. Mọi Boolean ở tags `[GAME STATE]` ghi vào `flags.<tên>`; mọi giá trị không Boolean ghi ở root theo bảng. Mã node, statement, observation và Evidence không đổi. Cả Phase 2/3 dùng cùng hợp đồng này, không có state React riêng quyết định gate.

| Tag hiện có | Đường ghi duy nhất |
| --- | --- |
| `current_phase`, `scene_location`, `return_node`, `people_visible`, `credibility` | Root cùng tên |
| `evidence_collected` | Root: mảng ID duy nhất, chỉ thêm sau commit thu hợp lệ |
| Mọi flag Boolean: `hoa_initial`, `notebook_unlocked`, `room204_entered`, `police_arrived`, `press_unlocked` và các cờ phụ | `flags.<tên_tag>`; cờ vắng mặc định false |
| Câu “chuyển/về/mở P1_*” | `current_node`; không tạo biến cho từng node |
| “thêm OBS_*” | `observations[ID]` với nguồn node; không ghi Evidence |
| `[NOTEBOOK UPDATE] ST_*` | `statements[ID]`; giữ nội dung, nguồn, độ chính xác, revision |
| Timeline/People | `timeline[ID]`, `people[ID]`; chỉ ghi sau node nguồn |

```json
{
  "schema_version": 2,
  "chapter": 1,
  "current_phase": 1,
  "current_node": "P1_001",
  "scene_location": "room201",
  "credibility": 100,
  "evidence_collected": [],
  "evidence_records": {},
  "statements": {},
  "observations": {},
  "timeline": {},
  "people": {},
  "flags": {}
}
```

Migrate save bản ví dụ 1.1 một lần: `phase→current_phase`, `node→current_node`, `notebookUnlocked→flags.notebook_unlocked`, `room204Entered→flags.room204_entered`, `evidence→evidence_collected`. Các flags cũ giữ nguyên. Không xóa dữ liệu lời khai/điểm. Nếu cả khóa cũ và mới tồn tại với giá trị khác nhau, báo xung đột save, không âm thầm chọn. `linh_reassured` giữ tên để không mất save; ý nghĩa duy nhất là đã chọn nhánh sắc thái LINH_03, không chứng nhận cô yên tâm. Các thẻ timeline có `precision`, `source`, `status`, `display_time`; giờ ước lượng luôn hiện “khoảng”. `TL_P1_POLICE.display_time="Sau lượt hỏi"`, không có numeric timestamp cho Player Timeline.

**Gate:** `all_initial = flags.hoa_initial && flags.linh_initial && flags.hao_initial && flags.minh_initial`. Node 999 ghi `current_phase=2`, `current_node="P2_ENTRY"`, flags police_arrived/phase1_complete/phase2_unlocked=true. Evidence vẫn rỗng, credibility 100. `room204_entered` vẫn false đến khi Phase 2 cấp phép.

**Resume:** lưu node/flags/câu hỏi và các bản ghi. Load giữa menu không phát lại câu đầu/ghi bản sao. Khóa bấm trong typewriter/transition; choice commit một lần. Không chuyển Phase lúc Notebook/Inspect đang mở.

#### G4. Triển khai bằng asset hiện có

- Hai nền cần trong phase: phòng 201 và hành lang có cửa 204 nhìn phần phòng; có thể crop cùng ảnh phòng 204 dự kiến cho phase sau. Không cần khám phòng hoặc mô phỏng bước đi.
- Portrait Hòa/Linh/Hào/Minh, biểu cảm Neutral/Attentive/Calm/Gentle của thám tử khi cần; cảnh sát có thể chỉ dùng tên/giọng text và hình áo mưa tĩnh.
- SFX mưa, gõ cửa, bước chân, bật lửa, còi; huỳnh quang nháy nhẹ tùy khả năng, không yêu cầu animation mới để chạy được.
- Một DialogueScene với menu hub, Notebook overlay; không thêm hệ thiện cảm hay lựa chọn làm thay đổi canon.

### H. LOGIC AND CONTINUITY CHECK

| Kiểm tra | Kết quả bản kịch bản |
| --- | --- |
| 21:35 và 201 | Giữ tại node mở; chưa đưa thời gian actual 20:54 vào lời kể |
| Vị trí Tùng | Sàn cạnh giường 204; bạn chỉ nhìn từ cửa; không khám cổ |
| Xuất hiện NPC | Hòa báo trước; Linh/Hào ngoài hành lang; Minh chạy lên trước các cuộc hỏi; không bị khóa sai thứ tự |
| Lời khai đầu | Giữ phủ nhận của Hòa/Linh, việc 203/giờ Hào, cuộc gặp/giờ Minh; cách nói tự nhiên nhưng nghĩa không đổi |
| Câu tùy chọn | Không yêu cầu làm hết; không nhánh kết tội, lấy vật hay cưỡng ép nhận |
| Góc nhìn | Chỉ quan sát, nghe, suy nghĩ của bạn; không kể cảm giác tội lỗi/ý nghĩ giấu đồ bên trong NPC |
| Dep Hòa/cổ tay Linh | Thấy dấu, chưa xác định nguồn bụi/vật giấu; không dùng như chứng cứ đã kiểm |
| Hào | Vị trí hiện tại được ghi, không ngoại phạm/không nêu Vũ |
| Minh | Ánh nhìn là quan sát; không khẳng định hung thủ; Tùng bình thường khi anh rời không bị gọi lời dối |
| Evidence | Không có EV nào được thu; kể nhìn ống từ xa không mở EV_Inhaler |
| Quyền hiện trường | Bạn chưa qua cửa, không chạm đồ; cảnh sát bảo vệ cuối; quyền Inspect chưa kể trước Phase 2 |
| Chữ ký/xu/em gái | Chưa thu/chưa giải nghĩa/chưa xác nhận số phận; không phá payoff |
| Branch continuity | Mọi NPC chính có đường về hub; A/B hỏi rồi ẩn, C luôn có; đủ bốn mới kết |
| Credibility | 100 suốt phase, không phạt lựa chọn thông thường |
| Handoff | Chỉ mở Phase 2, không chạy nội dung phase tiếp |

**[ĐÃ DUYỆT]:** ML-P1-01–08 được xử lý theo bản 1.2. Hào chỉ có danh tính trong People sau lượt tự giới thiệu; nhãn tác giả trước đó không được render thành tên NPC. Hào đứng hút thuốc chỉ thuộc thời điểm hỏi. Rửa mặt có đường Press bổ sung trong Phase 3. Tên biểu cảm map sang portrait thực có; nếu thiếu dùng portrait trung tính và ACTION.

**Bản kịch bản này hoàn chỉnh về node và nhánh Phase 1; chưa phải một bản build Phaser đã chạy kiểm thử.** Các Phase 2–4 chưa được viết ở đây.


### I. NHỮNG THAY ĐỔI LỚN VỀ VĂN PHONG

1. Gọt mở cảnh: giảm giải thích về ánh sáng/mưa, giữ dấu xuống cấp qua cửa sổ hở, vôi bong, dây điện chùng và nền ướt. Không đổi địa điểm/thời gian.
2. Thám tử bớt nhắc “ghi lại” ở mọi lượt. Câu hỏi gọn và câu đáp xác nhận ngắn; thao tác ghi sổ còn ở các điểm cần Notebook.
3. Hòa biện hộ bằng câu nói đời thường, viện hoàn cảnh và nhấn quyền thu tiền; không thêm nhận tội hoặc số tiền vào Phase 1.
4. Linh giữ câu đầu liền mạch, phòng thủ khi bị gợi rằng đang đoán. Cử chỉ che cổ tay vẫn còn, không lộ đồng hồ.
5. Hào trả lời cụt và hỏi ngược, hạn chế cử chỉ hoảng; giữ nguyên lời về 203/giờ tới/vị trí hiện tại.
6. Minh có khoảng ngừng ở hành động thay vì nhiều dấu ba chấm. Giữ đau buồn quan sát được, không kể mặc cảm hoặc biết nội tâm.
7. Giảm câu kể giải thích “điều này chưa chứng minh gì”; giữ giới hạn tri thức trong metadata/Notebook đã có, còn văn xuôi chỉ cho thấy người và vật.
8. Kết lượt hỏi dùng hình Tùng vẫn bất động và đầu bút ngừng; cảnh sát tới kết bằng dải băng/ánh nhìn Hòa, không giải thích hộ vụ án.

### J. PHẠM VI CẬP NHẬT LOGIC ĐÃ ĐƯỢC DUYỆT

Lượt 1.1 chỉ chỉnh văn phong. Lượt 1.2 áp dụng sửa logic/tri thức UI đã được người thiết kế duyệt: hỏi tên Hào, mapping state, độ chính xác giờ, phạm vi lời Hào và recovery lời rửa mặt. Giữ 30 node IDs, bốn lời khai cốt lõi, Evidence rỗng, gate đủ bốn người, không Press/Present/Deduction trong Phase 1. Không sửa hung thủ, động cơ hoặc sự kiện vụ án. Phase 2/3 mới là bản thảo sáng tác trong lượt này, chưa tự coi là đã được người thiết kế duyệt văn bản.

### K. HỢP ĐỒNG NỐI PHASE

- Phase 2 mở bằng cấp phép quan sát; cảnh sát xử lý đồ, thám tử dùng hồ sơ.
- Player Timeline không định phút cảnh sát tới; mọi giờ tự nhớ có nhãn ước lượng.
- Phase 3 hỏi lại lượt 203 riêng, không suy từ vị trí hiện tại.
- Bỏ MINH_03 vẫn mở được lời rửa mặt bằng Press trong Phase 3.
- LINH_03 là nhánh sắc thái có phản ứng khác; không có fact, điểm hay thiện cảm mới.
