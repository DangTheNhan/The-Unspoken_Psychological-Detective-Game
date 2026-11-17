# Story Content — DEC-026

Admin → **Nội dung kịch bản** (`/admin/story-content`). Chương 1 có 813 trường được biên tập: 733 `text` của dialogue/narration/action/ui và 80 `choices[].text`. Trang vẫn có thể xem node kỹ thuật ở chế độ chỉ đọc. Không sửa graph gốc, source, đường đi, hiệu ứng, scoring, state schema, các hồ sơ Notebook hoặc đáp án suy luận.

## Khởi tạo và chạy

Dữ liệu bổ sung nằm trong MySQL, không nằm trong source JSON. `db/schema.sql` vẫn nguyên văn tài liệu. Chạy SQL bổ sung một lần trên database đã có schema gốc:

```powershell
# Từ thư mục gốc dự án; mysql phải dùng đúng tài khoản và database cấu hình cho backend.
# Có thể dùng --password để nhập tương tác; không đưa mật khẩu vào file.
Get-Content backend/src/main/resources/db/story-content.sql -Raw |
  & 'C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe' --user=root --password --default-character-set=utf8mb4 detective_game

# Tạo manifest từ CHAPTER_DATA và đúng byte JSON runtime, trước khi build backend.
node scripts/chapter1/prepare-story-content.mjs

# Sau đó chạy các lệnh backend/frontend bình thường trong từng thư mục.
```

Các npm hook `predev`, `pretest`, `prebuild` cũng cập nhật manifest. Maven resources sao chép manifest và graph vào classpath `story-content/` khi build. Không có graph thứ hai cần chỉnh tay. Backend xác minh hash của tài nguyên đóng gói; nếu manifest cũ, tạo lại và rebuild. Khi triển khai, frontend/backend cần cùng baseline. Giữ `ddl-auto=validate`; không dùng Hibernate để tự cập nhật schema.

Ba bảng bổ sung: `story_text_chapters` (con trỏ bản dùng, khóa), `story_text_drafts` (một nháp/chương, revision và fingerprint), `story_text_versions` (snapshot sparse overrides bất biến). Không cần dependency hoặc migration framework mới.

## Cách sử dụng

1. Tìm node theo mã, loại, người nói hoặc nội dung; nhập chữ vào trường bản nháp. Có thể đối chiếu chữ gốc và bản đang dùng.
2. **Lưu bản nháp**. Thao tác này chưa ảnh hưởng game. Nội dung sẽ còn sau khi tải lại trang.
3. **Kiểm tra** bản nháp đã lưu. Nội dung rỗng/chỉ khoảng trắng hoặc vượt giới hạn bị từ chối: 4.000 Unicode code point cho text, 500 cho lựa chọn.
4. **Xem trước**, rà soát trước/sau và xác nhận đã đối chiếu với hồ sơ. Preview không chạy game hoặc ghi save.
5. **Xuất bản**. Game nhận nội dung vào đầu phiên **Ván mới / Tiếp tục điều tra**. Phiên đang chạy không thay đổi giữa chừng.
6. Trong lịch sử, **Khôi phục vào nháp**, rồi kiểm tra/xem trước/xuất bản để tạo phiên bản mới. Phiên bản cũ không bị ghi đè. Nút **Về chữ gốc** đưa nháp về override set rỗng; cần xuất bản để áp dụng.

Mọi thay đổi nháp làm mất trạng thái kiểm tra/xem trước cũ. Revision và khóa theo chương chặn việc ghi đè bản mới hơn từ tab khác; tải lại khi gặp 409. Không gửi arbitrary JSON Patch hoặc graph từ trình duyệt.

## Trường được phép và giới hạn nội dung

- Schema: `#/$defs/node/properties/text`, áp dụng riêng dialogue/narration/action/ui; đường cụ thể `/nodes/i/text`.
- Schema: `#/$defs/node/properties/choices/items/properties/text`, áp dụng riêng choice/investigation/cross_examination/deduction; đường cụ thể `/nodes/i/choices/j/text`.
- Override: `{nodeId, field: 'text', value}` hoặc `{nodeId, field: 'choiceText', choiceIndex, value}`. Chỉ thay string có sẵn; index và node ID được máy chủ đối chiếu baseline.
- `hotspots[].text`, `notebook_update.text`, catalog, deduction root, `effects`, `state`, `uiText.js` và các file inspect khác chỉ đọc/ngoài phạm vi.
- Narration/action hiện được engine tự đi qua, nên nhập chữ ở đó không làm chúng xuất hiện trong hộp thoại.
- Lời khai/nhân vật/vật chứng có nội dung độc lập trong effects và saved state; sửa thoại không sửa các bản ghi này. Lịch sử thoại đã lưu giữ nguyên. Admin chịu trách nhiệm rà soát canon và ý nghĩa.

Runtime có 1.264 node (đã có thay đổi mở đầu DEC-023), khác gói nguồn 1.257. Ba choice mở đầu thiếu `condition` được runtime/validator chấp nhận mặc định true; tính năng này không tự sửa graph hay schema để làm đầy đủ JSON Schema. Validator hiện hành kiểm field/type và mô phỏng đường đi, không chứng minh tính đúng đắn cốt truyện.

## Contract API

Tất cả endpoint biên tập cần JWT **ROLE_ADMIN** trên máy chủ; người chơi nhận 403, chưa đăng nhập nhận 401. `AdminRoute` cũng bảo vệ trang. Actor lấy từ principal, không nhận từ body.

Prefix `A = /api/admin/story/chapters/{id}`:

| Method | Path | Nội dung |
|---|---|---|
| GET | `/api/admin/story/chapters` | Chương đăng ký, hash baseline, số trường, publication hiện tại |
| GET | `A/nodes?q=&type=&speaker=` | Node projection và allowed fields, không trả graph logic |
| GET | `A/draft` | Revision, sparse overrides, fingerprint, publication ID; không tạo dữ liệu bằng GET |
| PUT | `A/draft` | `{baseHash, expectedDraftRevision, overrides}` |
| POST | `A/draft/validate` | `{baseHash, draftRevision}` → validation fingerprint và warnings |
| POST | `A/draft/preview` | Cùng body validate → before/after và preview fingerprint |
| POST | `A/publish` | `{baseHash, draftRevision, expectedPublishedVersionId, validationFingerprint, previewFingerprint}` |
| GET | `A/versions` | Metadata lịch sử |
| GET | `A/versions/{versionId}` | Metadata và overrides của phiên bản |
| POST | `A/versions/{versionId}/restore-draft` | `{baseHash, expectedDraftRevision}` |
| GET | `/api/game/chapters/{id}/story-text?baseHash=...` | JWT authenticated; chỉ published projection, không draft/actor/answerKey/graph |

Read/save/validate/preview/restore trả 200; publish mới 201, publish lại cùng draft 200 (idempotent); sai payload 400, không tồn tại 404, xung đột revision/hash/prerequisite 409. Publication player dùng `Cache-Control: no-store`. Các API cũ không đổi. Frontend path chỉ khai báo tại `shared/api/endpoints.js`.

Graph gốc được load dưới dạng raw text để kiểm SHA-256 đúng byte trước khi gửi yêu cầu qua EventBus. React dùng Axios để lấy bản published; merge thuần tạo bản graph cho riêng phiên. Event có request ID, listener được gỡ lúc hủy scene; không đặt API/React trong narrative engine và không nhét publication vào state v2.

Nếu offline/5xx: lấy cache published hợp lệ cùng chapter/hash/allowlist, hoặc dùng graph gốc và thông báo. Server trả publication rỗng rõ ràng sẽ xóa cache cũ. Bộ overrides sai bị từ chối toàn bộ. Auth/hash rejection không được coi là offline để áp dụng cache. Sau khi baseline đổi, bản cũ không tự rebase; phải nhập lại và duyệt trên baseline mới. Những save đang chơi chỉ có thể đổi lời văn tương lai khi Continue; không đổi ID/flag/điểm/checkpoint và không viết lại lịch sử.

## Kiểm tra

```powershell
# Tại thư mục gốc
node scripts/chapter1/prepare-story-content.mjs --check
python scripts/chapter1/validate.py
python scripts/chapter1/validate.py --overrides path/to/overrides.json
# File input có thể là mảng fixture hoặc response published API có identity/hash.
# Wrapper merge và chạy validator trên bản tạm; không ghi vào source hoặc runtime JSON.

# frontend/
npm run check
npm run test:e2e

# backend/
mvn clean test
```

E2E `story-content.spec.js` cần **backend dùng database thử riêng**. Nó tạo tài khoản thử và xuất bản/restores nội dung thử. Chỉ bật khi đã chuẩn bị môi trường dùng một lần:

```powershell
# frontend/; backend thử cần cho phép CORS từ http://127.0.0.1:5196
$env:STORY_TEST_API = 'http://127.0.0.1:18981/api'
npm run test:e2e
```

Không đặt `STORY_TEST_API` thì test live Admin được skip, còn canvas playtest dùng phiên và API baseline giả riêng. Kiểm tra server lifecycle/security không phụ thuộc MySQL trong `mvn test`; kiểm tra transaction/JPA thực tế bổ sung qua live E2E. Không yêu cầu Python chạy bên trong production server. ISS-29 server-save identity vẫn là vấn đề độc lập.
