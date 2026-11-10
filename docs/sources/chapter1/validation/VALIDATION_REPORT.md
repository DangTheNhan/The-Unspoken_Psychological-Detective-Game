# Kết quả kiểm tra gói Chapter 1

Trạng thái: **PASS**. 1257 node, 43 Statement, 12 Evidence; 6255 assertion đã chạy. Đây là số phép kiểm tra cấu trúc và dữ liệu, không phải số ca playtest UI độc lập.

Không ID node trùng, không target nội bộ bị đứt, không node không thể tới khi tính cả các handler Press/Present từ menu và Notebook. `CH2_ENTRY` là ranh giới ngoài đã khai báo.

Hai lượt mô phỏng đi hết Phase 1 → Phase 2 → Phase 3 → Final → Phase 4 → boundary Chapter 2: lượt chỉ thu năm core rồi quay lại lấy khăn/hộp và lấy xu/khảo sát/giấy khen qua fallback; lượt thu các phần tùy chọn sớm và giữ nguồn ghi nhận ban đầu. Các thoại thám tử/NPC trong JSON có trong kịch bản nguồn, không cần viết thêm khi code.

Đã kiểm tra Present sai −15, hỗ trợ đúng 0; Final thiếu 0, sai đầy đủ −20, đúng mới tái dựng; phục hồi checkpoint thực; chi tiết con tin không tự mở trước Phase 4; khảo sát không trở thành Evidence.

Chưa có code demo của bạn trong gói nên **chưa kiểm thử Phaser/React thật**, event double click, asset và tọa độ hotspot. Tích hợp rồi dùng PLAYTEST_CHECKLIST.md.

Có thể kiểm tra lại dữ liệu bằng: `python3 validation/validate_data.py` khi đứng trong thư mục CHAPTER_1_COMPLETE; script dùng Python standard library, không phải engine game.
