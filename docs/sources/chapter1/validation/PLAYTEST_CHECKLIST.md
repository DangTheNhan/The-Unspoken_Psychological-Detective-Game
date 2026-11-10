# Playtest sau khi tích hợp vào Phaser

Báo cáo tự động trong gói kiểm tra graph và mô phỏng data; checklist dưới cần thực hiện trong demo thật.

1. New Game bắt đầu phòng 201, mốc 21:35. Bỏ qua câu hỏi phụ, hỏi đủ bốn người. Phase 1 chưa có Evidence, Press/Present hay kết tội; cảnh sát đến mới mở Inspect.
2. Inspect năm core theo nhiều thứ tự. Không click khăn/hộp/xu/khảo sát. Thoát Phase 2 vẫn hợp lệ và thấy lời nhắc quay lại; không mặc định những thẻ bỏ qua đã có.
3. Quay lại 204 ở Phase 3, click khăn/hộp còn thiếu. Nguồn ghi phase 3. Inspect lại thẻ đã có không phát mới hoặc sửa nguồn cũ. Bỏ câu rửa mặt ở Phase 1 thì R1 mở cùng Statement ở Phase 3.
4. Hỏi ba NPC theo thứ tự khác nhau. Hòa chỉ nhận lần vào khi Present receipt; lock là hỗ trợ miễn phạt. Linh chưa tự thú bởi vòng bụi: Present rồi Press mới mở lời nhận, sau đó hỏi cảnh khó thở. Hào đối chứng đúng lượt 203; không ngoại phạm toàn tối hoặc tên người thuê.
5. Chọn các wrong Evidence khác nhau: NPC phản hồi khác nhau; trừ 15 một lần. Double click/rerender không trừ hai lần. Thẻ chưa thu/vòng khóa không submit và không trừ điểm. Đọc Statement cũ đã sửa không phát denial lại.
6. Với Minh, không nhảy R1→thú nhận. Đối chiếu khăn, ống, hộp, ba quan hệ thời gian; người chơi yêu cầu cảnh sát kiểm đồ rồi mới có mảnh. Lời nhận từng phần chưa mở Final.
7. Minh chỉ chỗ trước khi tìm ống; người chơi yêu cầu thu, Present ống cũ kiểm chứng, gửi mẫu. Khóa quay lại hiện trường khi gửi; time skip không tự gán vài phút. Báo cáo có phần nạn nhân rồi mới đối chất thuốc bình thường.
8. Final mở sau đầy đủ sources và lời nhận. Nộp thiếu 0 điểm. Nộp sai đủ −20 và phản hồi không đưa đáp án. Nộp đúng mới tái dựng, commit Notebook, rồi Phase 4.
9. Credibility 0 mở Bad Ending. Load checkpoint thật giữ đúng điểm/sources/draft của snapshot, không cộng 100 vào state đang chơi. Resume cuối Inspect/Report không phát thu Evidence lại.
10. Phase 4 với xu/khảo sát/giấy khen chưa thu: có thể xem hồ sơ hợp lệ và ghi đúng phase 4. Nếu đã thu trước, đọc đúng record cũ. Không nhận vật thật; khảo sát vẫn là observation.
11. Nợ/con tin chỉ mở sau lời Minh ở Phase 4; lời Hào/Linh giữ Claimed/Indirect. Ký ức chỉ giống hình vết máu, không tiết lộ Khang hoặc số phận em gái.
12. Chốt Chapter 1 sau đủ các nguồn kết chương, lưu chapter1_complete. Hiện title Chapter 2 và dừng ở boundary; không crash vì CH2_ENTRY chưa có nội dung.

Kiểm tra thêm: text tiếng Việt không lỗi font, kích thước hộp thoại, input chuột/phím, hotspot khớp vật thể trên background, sprite biểu cảm và cách đóng/mở Notebook không mất state.
