# Prompt gửi Claude cùng ZIP và dự án demo hiện tại

Bạn là Narrative Systems Engineer và lập trình viên React + Phaser 3. Tôi đã có demo, background và nhân vật cơ bản. Hãy đọc gói `CHAPTER_1_COMPLETE` và tích hợp **toàn bộ Chapter 1 vào dự án hiện tại**.

Đọc `README_FIRST.md`, `DATA_CONTRACT.md`, Bible 1.3 (đặc biệt mục J), `CHAPTER_1_ALL_SCRIPTS.md`, `data/chapter1.json`, các danh mục dữ kiện và Game State trước khi sửa code. Đọc cấu trúc dự án để tái sử dụng các Scene, UI và asset đã có.

Nội dung đã có lời thoại, biểu cảm, điều kiện, Inspect, Press/Present và Deduction. Không sáng tác thêm lời thoại, bằng chứng hoặc lời thú nhận để hoàn thành code. Không thay Canon, Evidence ID, Statement ID, điểm phạt, nguồn kiến thức hoặc điều kiện chuyển Phase. Phase 4 đã được phép dùng A + S1 + S2 theo mục J của Bible.

Hãy thực hiện:

1. Kiểm tra demo hiện tại có gì và còn thiếu gì để đọc data; báo rõ file/Scene nào sẽ dùng. Sau đó triển khai trong dự án, không dừng ở một bản kế hoạch.
2. Tạo hoặc mở rộng một bộ đọc graph dùng chung, tách logic JavaScript khỏi dữ liệu JSON. Tái sử dụng UI và Scene của demo nếu phù hợp. Không hardcode lại toàn bộ lời thoại trong JS/TS.
3. Nối sprites/background theo `data/assets.integration.json`. Gán tọa độ hotspot theo background phòng 204 thực tế. Không thêm địa điểm, chứng cứ hoặc cơ chế cốt truyện. Nếu thiếu ảnh, dùng asset placeholder có đánh dấu; không tạo thông tin điều tra mới.
4. Làm chạy đủ Phase 1 → Phase 2 → Phase 3 → Final Deduction → Phase 4, giữ quyền chọn thứ tự hotspot/NPC và nhánh tùy chọn. Final là một phần của Phase 3; Phase 4 chỉ mở sau khi giải đúng, xem tái dựng và cập nhật Notebook.
5. Notebook có bốn tab Evidence, People, Timeline, Statements. Danh mục dữ liệu không phải dữ kiện đã thu. Bản ghi phải lưu node nguồn, phase thu và các sửa lời khai; không hồi tố những câu hỏi bị bỏ qua.
6. Press không mất điểm. Present chỉ dùng Evidence đã thu, cần chọn Statement đích và kiểm điều kiện vòng. Correct/support/clarify không mất điểm; wrong Present trừ 15 đúng một lần. Thẻ/vòng đang khóa không submit và không mất điểm. Dùng phản hồi riêng theo Evidence/Statement.
7. Final có WHO/WHAT/WHEN/WHY/EVIDENCE. Chỉ mở thẻ đã có nguồn. Nộp sai hoàn chỉnh trừ 20 một lần, giữ lựa chọn, không bật tái dựng hoặc tiết lộ đáp án. Nộp thiếu không trừ điểm. Không tự điền đáp án đúng.
8. Credibility 0 mở Bad Ending và Load checkpoint thực có. Khôi phục nguyên snapshot, không đặt lại 100 hoặc cộng điểm vào state đang chơi. Khóa input khi đang commit để một click không trừ hai lần.
9. Gửi mẫu ở Phase 3 mới đóng quyền quay lại hiện trường; báo cáo xuất hiện sau time skip và có phần đối chiếu nạn nhân. Phase 4 có fallback xem hồ sơ xu/khảo sát/giấy khen nếu chưa thu trước đó. Không phát Evidence tùy chọn tự động khi vào Phase.
10. Dừng ở boundary `CH2_ENTRY` sau khi Chapter 1 complete, giữ save và tiêu đề chuyển chương. Không tự viết Chapter 2–5.
11. Chạy các kiểm tra hiện có của dự án và playtest theo `validation/PLAYTEST_CHECKLIST.md`. Chỉ sửa tiếp khi lỗi kiểm tra hoặc playtest đòi hỏi. Báo rõ đã kiểm chứng trên game những gì và những phần cần asset thật.

Nếu data và code hiện tại khác tên flag/key kỹ thuật, viết adapter hoặc migration có giải thích; không đổi nghĩa cốt truyện. Nếu phát hiện thiếu điều kiện nội dung thật sự, chỉ ra node/Statement/Evidence và ngừng riêng nhánh đó để tôi xem, không bịa dữ kiện. Các lựa chọn kỹ thuật thông thường đã nằm trong phạm vi tích hợp này; không cần hỏi lại từng Scene hoặc từng node.

Sau khi tích hợp, báo: những file đã sửa, cách chạy demo, cách kiểm thử toàn chương, những asset còn thiếu và những lỗi logic chưa thể tự xử lý.
