# Data Contract 2.0 — Chapter 1

`data/chapter1.json` là graph dữ liệu dùng chung. JSON UTF-8, không comments hoặc trailing commas. File không chứa JavaScript thực thi. Runtime phải có các handler sau; nguồn dữ liệu không tự chạy bằng việc import JSON.

## Node và đường đi

| Type | Các trường chính | Cách xử lý |
| --- | --- | --- |
| dialogue | id, speaker, expression, text, next | Hiện đúng lời thoại; chờ người chơi rồi đi next |
| narration | id, text, next | Hiện lời dẫn; chờ tiếp tục |
| action | id, text, next | Chỉ dẫn cử chỉ/hoạt cảnh cho Scene; không đọc mọi chỉ dẫn kỹ thuật như lời kể của NPC |
| ui | id, text, next | Thông báo hệ thống; không tạo dữ kiện |
| router | id, next, conditions/effects nếu có | Chọn route đúng đầu tiên hoặc đi next dạng string |
| choice | id, choices, conditions nếu có | Hiện các choice có condition đúng; click đi targetNode |
| investigation | id, hotspots, choices | Hotspot do người chơi bấm; geometry nối theo asset thật, không tự quét các hotspot |
| cross_examination | id, speaker, statementIds, statementRules, choices | Chỉ hiện Statement thực có; Press/Present dùng luật của Statement đó |
| notebook_view | id, tabs, statementRules, next | Đọc state thực; đóng về next; Press từ Statements chỉ khi đã mở |
| record_view/source_view | id, evidenceId hoặc statementId hoặc observationId, next | Mở bản ghi đã tồn tại; không collect mới |
| deduction | id, choices, conditions | Hiện bảng và slot từ root deduction; sửa draft độc lập, chỉ nộp mới đánh giá |
| notebook_update | id, text, effects, commitHandlerId, next | Commit toàn bộ cập nhật Notebook thành một transaction, rồi mới đặt flag thành công |
| checklist | id, predicateId, next | Hiện nguồn chưa đủ theo predicate; không tự thêm chúng hoặc tiết lộ lời chưa nghe |
| checkpoint_restore | id, checkpointId, possibleTargets | Khôi phục nguyên snapshot và resume current_node; possibleTargets để kiểm tra graph, không thay snapshot |
| transition | id, conditions, effects, next | Kiểm guard, commit và chuyển đúng node/phase; không reset điểm |

`id` duy nhất. `next` là string hoặc mảng `{conditions,targetNode}` đánh giá theo thứ tự. `choices` dùng `{text,condition,targetNode}`. Nếu không có condition riêng thì true. Node `__COMMIT` giữ cập nhật ở cuối đoạn; không phát statement cuối trước khi đoạn nói kết thúc. Node kỹ thuật không cần nút thoại riêng.

`expression` lấy từ kịch bản; một số lượt Press ngắn nguồn không ghi biểu cảm thám tử nên dùng `Neutral` làm mặc định render. Nhãn menu điều khiển bổ sung được liệt kê riêng ở source-map; chúng không phải thoại mới hoặc dữ kiện mới. Các `statementIds` là ID tham chiếu, không phải tự mở Statement khi vào menu.

## Condition AST

Các dạng: `{"literal": value}`, `{"ref": "/state/..."}`, `{"predicate":"NAME"}`, `{"op":"all","args":[...]}`. Hỗ trợ all, any, not, exists, contains, eq, ne, gt, gte, lt, lte, add, subtract, max, min. `exists` kiểm ref có giá trị khác null; chưa có bản ghi thì false. Flags chưa có xem là false, nhưng **không dựng Evidence/Statement bị thiếu** để vượt guard.

`/state` là snapshot đang chơi; `/input/sourceId` là thẻ nguồn được người chơi chọn; `/bindings` là adapter động từ root bindings. People binding chỉ tồn tại khi record đã có. Checkpoint binding chỉ tồn tại khi snapshot thật đã lưu. Notebook finalUpdate là handler `commit_ch1_final_notebook` có thật ở engine, không đánh dấu ready nếu handler chưa được triển khai.

## Effects và nguồn dữ kiện

`before` tham chiếu giá trị thực trước thao tác; `after` là expression đánh giá lúc commit. Cách viết này mô tả rõ trước/sau mà không giả người chơi luôn bắt đầu từ một số điểm cố định.

- set/increment: đặt giá trị after vào path. increment dùng biểu thức after, không cộng lần nữa.
- upsert_record: tạo một lần. Record kiến thức mới lưu `source_node` theo effect.sourceNode (nếu có), `source_step` là node kỹ thuật đã commit, `collected_phase` là phase hiện tại, `source_kind` đúng bản ghi. Khi đọc lại, không đổi nguồn lần đầu. Nếu update nội dung phải giữ revision và nguồn mới tương ứng, không ghi đè lịch sử.
- merge_record: cập nhật các trường chỉ định trên record đã tồn tại, lưu revision trước đó. Không tạo record thiếu để hợp thức hóa nguồn.
- collect_evidence: tạo record và thêm Evidence ID duy nhất vào evidence_collected trong cùng transaction; không giữ vật thật trong tay thám tử. Source kind theo nơi thu: P2 là ảnh/quan sát được phép; P3 các nguồn kiểm tra là hồ sơ cảnh sát; giấy khen là tài liệu công khai; fallback P4 xu/khảo sát là hồ sơ cảnh sát. Lưu phase thực, không hồi tố.
- save_checkpoint: lưu toàn bộ state và vị trí tiếp tục đã xác lập; ID `ch1_phase3_start` hoặc `ch1_pre_final`; overwrite=false. Giữ cả credibility, facts, draft và lịch sử; tránh lồng snapshot checkpoint vào chính nó. Snapshot không chứa vòng tham chiếu, không chứa asset hay handler JS.

Một event có token duy nhất; khoá input, kiểm guard, commit effects theo thứ tự trong transaction rồi lưu tiến trình. Load không phát lại các effects đã commit. Nếu crash giữa đọc thoại, resume current_node; nếu đã commit node thì resume node tiếp. Wrong scoring và effects dùng cùng token, không trừ điểm lại khi rerender React hoặc nhận double click.

## Press và Present

Root `statementRules[statementId]` chứa condition, press.routes và present. Press chọn route đúng đầu tiên, miễn phạt. Statements superseded đọc lời sửa, không chạy denial ban đầu. Press lời rửa mặt đọc bản ghi; người chơi phải chọn Present khăn để chạy đối chiếu R2.

Present cần statement thực có, present.enabled, present.condition và Evidence đã thu **có record nguồn**. Routes ưu tiên: đúng/hỗ trợ → blocked đúng vòng chưa mở → wrong. Mỗi route có evidenceId, condition, targetNode, result và credibilityPenalty. Đây là **số điểm bị trừ không âm**: 15 trừ 15, 0 không trừ. Trường credibilityPenalty ở node Final cũng dùng quy ước này. Không trừ ở cả route và phản hồi: phản hồi wrong Present không có penalty thứ hai.

`blocked` không phải submission sai: chặn nút trước submit khi có thể, hiển thị nhắc hệ thống miễn phạt. Hủy picker không có effect. Hào và những Statement chưa có thẻ bác hợp lệ có Present disabled; vẫn Press và đọc Timeline. Không cho người chơi dùng bảng đúng/sai trong nguồn hoặc answerKey làm menu gợi đáp án.

## Notebook, Final và Phase Transition

Notebook bốn tab. `OBS_P2_SURVEY` là observation đọc qua phần ghi chú liên quan, không tạo tab thứ năm hay EV_Survey. People, Evidence và Statements trong các file danh mục chỉ là template; state mới hoàn toàn rỗng. Metadata tác giả trong Bible không hiện cho người chơi.

Final giữ WHO/WHAT/WHEN/WHY và bốn vai trò nguồn EVIDENCE. Thẻ chỉ có khi conditions đúng. Viết draft theo root deduction.slots, không gợi answerKey. Nộp thiếu không phạt; nộp sai đầy đủ trừ 20 đúng một lần ở FD_REVIEW và giữ draft. Chọn đúng mới mở RECON_01–06. Handler cuối commit kết luận CH1, People và Timeline có nguồn theo effects, sau đó final_notebook_updated=true. Player Timeline chỉ quan hệ trước/sau, không tự hiện actual 20:50–20:54.

Phase 2 thoát dựa năm core. Khăn/hộp cần cho Phase 3 có thể bổ sung qua quyền quay lại trước samples_submitted; không ép thu cả tám Evidence trước khi thoát. Coin/giấy khen/khảo sát không khóa Final; Phase 4 có đường xem hồ sơ hợp lệ riêng. Báo cáo kiểm tra xuất hiện sau time skip và phải có phần liên hệ với nạn nhân.

`CH2_ENTRY` là external boundary đã khai báo, chưa được triển khai trong gói này. Khi chuyển đến đó, lưu complete và hiện tiêu đề kết chương; engine dừng ở boundary, không gọi một node chưa có. Tất cả đường bên trong Chapter 1 phải có target hợp lệ.

## Phân chia với demo

Những handler này cần Claude triển khai theo code hiện tại. Gói đã kiểm tra cấu trúc và chạy mô phỏng dữ liệu; chưa kiểm thử Phaser thật. Kiểm tra mapping asset, lifecycle Scene/UI, lưu file và event de-duplication trong demo. Không dùng giả giá trị mặc định để che việc handler hoặc dữ kiện chưa tồn tại.
