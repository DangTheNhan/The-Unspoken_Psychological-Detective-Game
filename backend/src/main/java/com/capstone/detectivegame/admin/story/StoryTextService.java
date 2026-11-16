package com.capstone.detectivegame.admin.story;

import static com.capstone.detectivegame.admin.story.StoryTextData.*;

import com.capstone.detectivegame.common.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StoryTextService {
    private final StoryTextCatalog catalog;
    private final StoryTextChapterRepository chapters;
    private final StoryTextDraftRepository drafts;
    private final StoryTextVersionRepository versions;

    public StoryTextService(StoryTextCatalog catalog, StoryTextChapterRepository chapters,
            StoryTextDraftRepository drafts, StoryTextVersionRepository versions) {
        this.catalog = catalog; this.chapters = chapters; this.drafts = drafts; this.versions = versions;
    }

    public List<ChapterInfo> chapters() {
        return catalog.all().stream().map(c -> new ChapterInfo(c.id(), c.baseHash(), c.contractVersion(),
                ALLOWLIST_VERSION, c.nodes().size(), c.nodes().stream().mapToInt(n -> n.fields().size()).sum(), activeId(c.id()))).toList();
    }
    public List<StoryNode> nodes(int id, String q, String type, String speaker) {
        String query = q == null ? "" : q.trim().toLowerCase(java.util.Locale.ROOT);
        return catalog.get(id).nodes().stream()
                .filter(n -> type == null || type.isBlank() || n.type().equals(type))
                .filter(n -> speaker == null || speaker.isBlank() || n.speaker().equals(speaker))
                .filter(n -> query.isBlank() || (n.nodeId() + " " + n.type() + " " + n.speaker() + " "
                        + n.fields().stream().map(TextField::baseText).collect(java.util.stream.Collectors.joining(" ")))
                        .toLowerCase(java.util.Locale.ROOT).contains(query)).toList();
    }
    public Draft draft(int id) {
        var c = catalog.get(id);
        Long active = activeId(id);
        var saved = drafts.findById(id);
        if (saved.isPresent()) return draftView(saved.get(), active);
        StoryTextVersion version = active == null ? null : findVersion(id, active);
        List<TextOverride> edits = version != null && version.baseHash.equals(c.baseHash())
                ? catalog.decode(version.overridesJson) : List.of();
        return new Draft(id, c.baseHash(), c.contractVersion(), ALLOWLIST_VERSION, 0, active, edits, null, null, null, null);
    }

    @Transactional
    public Draft save(int id, JsonNode request, String actor) {
        keys(request, Set.of("baseHash", "expectedDraftRevision", "overrides"));
        var c = catalog.get(id);
        catalog.requireHash(c, text(request, "baseHash"));
        List<TextOverride> edits = catalog.validate(c, parseOverrides(request.get("overrides")));
        StoryTextChapter chapter = lock(id);
        StoryTextDraft d = drafts.findById(id).orElseGet(() -> new StoryTextDraft(id));
        revision(d, number(request, "expectedDraftRevision"));
        writeDraft(d, c, edits, actor, null);
        return draftView(drafts.save(d), chapter.activeVersionId);
    }

    @Transactional
    public Validation validate(int id, JsonNode request) {
        keys(request, Set.of("baseHash", "draftRevision"));
        var c = catalog.get(id); catalog.requireHash(c, text(request, "baseHash"));
        lock(id);
        StoryTextDraft d = savedDraft(id, number(request, "draftRevision"));
        compatible(d, c);
        catalog.validate(c, catalog.decode(d.overridesJson));
        d.validationFingerprint = fingerprint(d);
        d.previewFingerprint = null;
        return new Validation(true, d.draftRevision, d.validationFingerprint, List.of(), List.of(
                "Narration/action được engine tự đi qua; sửa chữ không đổi cách hiển thị.",
                "Nội dung Sổ tay và lịch sử đã lưu không được viết lại. Admin cần rà soát tính nhất quán."));
    }

    @Transactional
    public Preview preview(int id, JsonNode request) {
        keys(request, Set.of("baseHash", "draftRevision"));
        var c = catalog.get(id); catalog.requireHash(c, text(request, "baseHash"));
        lock(id);
        StoryTextDraft d = savedDraft(id, number(request, "draftRevision")); compatible(d, c);
        if (!fingerprint(d).equals(d.validationFingerprint)) throw ApiException.conflict("Hãy kiểm tra bản nháp trước khi xem trước.");
        List<PreviewLine> lines = catalog.validate(c, catalog.decode(d.overridesJson)).stream().map(e -> {
            var n = catalog.node(c, e.nodeId()); var f = catalog.field(c, e);
            return new PreviewLine(n.nodeId(), n.type(), n.speaker(), e.field(), e.choiceIndex(), f.baseText(), e.value(), n.automaticallySkipped());
        }).toList();
        d.previewFingerprint = d.validationFingerprint;
        return new Preview(d.draftRevision, d.previewFingerprint, lines);
    }

    @Transactional
    public Publication publish(int id, JsonNode request, String actor) {
        keys(request, Set.of("baseHash", "draftRevision", "expectedPublishedVersionId", "validationFingerprint", "previewFingerprint"));
        var c = catalog.get(id); catalog.requireHash(c, text(request, "baseHash"));
        StoryTextChapter chapter = lock(id);
        StoryTextDraft d = savedDraft(id, number(request, "draftRevision")); compatible(d, c);
        String fingerprint = fingerprint(d);
        if (!fingerprint.equals(d.validationFingerprint) || !fingerprint.equals(d.previewFingerprint)
                || !fingerprint.equals(text(request, "validationFingerprint")) || !fingerprint.equals(text(request, "previewFingerprint"))) {
            throw ApiException.conflict("Bản nháp cần được kiểm tra và xem trước lại.");
        }
        catalog.validate(c, catalog.decode(d.overridesJson));
        if (chapter.activeVersionId != null) {
            var existing = findVersion(id, chapter.activeVersionId);
            if (existing.draftRevision == d.draftRevision && existing.baseHash.equals(d.baseHash)) {
                return new Publication(versionView(existing, true), false);
            }
        }
        Long expected = nullableId(request, "expectedPublishedVersionId");
        if (!Objects.equals(expected, chapter.activeVersionId)) throw ApiException.conflict("Phiên bản đang dùng đã thay đổi. Tải lại trước khi xuất bản.");
        StoryTextVersion v = new StoryTextVersion();
        v.chapterId = id; v.baseHash = d.baseHash; v.contractVersion = d.contractVersion;
        v.allowlistVersion = d.allowlistVersion; v.overridesJson = d.overridesJson;
        v.checksum = StoryTextCatalog.hash(d.overridesJson); v.draftRevision = d.draftRevision;
        v.parentVersionId = chapter.activeVersionId; v.restoredFromVersionId = d.restoredFromVersionId;
        v.publishedBy = actor; v.publishedAt = LocalDateTime.now();
        versions.saveAndFlush(v);
        chapter.activeVersionId = v.id;
        return new Publication(versionView(v, true), true);
    }

    public List<Version> versions(int id) {
        catalog.get(id);
        return versions.findByChapterIdOrderByIdDesc(id).stream().map(v -> versionView(v, false)).toList();
    }
    public Version version(int id, long versionId) { catalog.get(id); return versionView(findVersion(id, versionId), true); }

    @Transactional
    public Draft restore(int id, long versionId, JsonNode request, String actor) {
        keys(request, Set.of("baseHash", "expectedDraftRevision"));
        var c = catalog.get(id); catalog.requireHash(c, text(request, "baseHash"));
        var chapter = lock(id); var version = findVersion(id, versionId);
        if (!version.baseHash.equals(c.baseHash()) || version.allowlistVersion != ALLOWLIST_VERSION) {
            throw ApiException.conflict("Phiên bản cũ thuộc graph khác; không thể tự áp dụng.");
        }
        var d = drafts.findById(id).orElseGet(() -> new StoryTextDraft(id));
        revision(d, number(request, "expectedDraftRevision"));
        writeDraft(d, c, catalog.validate(c, catalog.decode(version.overridesJson)), actor, versionId);
        return draftView(drafts.save(d), chapter.activeVersionId);
    }

    public Published published(int id, String baseHash) {
        var c = catalog.get(id); catalog.requireHash(c, baseHash);
        Long active = activeId(id);
        if (active == null) return new Published(id, c.baseHash(), c.contractVersion(), ALLOWLIST_VERSION, null, List.of());
        StoryTextVersion v = findVersion(id, active);
        if (!v.baseHash.equals(baseHash) || v.allowlistVersion != ALLOWLIST_VERSION) throw ApiException.conflict("Nội dung đã xuất bản thuộc graph khác.");
        if (!StoryTextCatalog.hash(v.overridesJson).equals(v.checksum)) throw new IllegalStateException("Publication checksum mismatch");
        var edits = catalog.validate(c, catalog.decode(v.overridesJson));
        return new Published(id, c.baseHash(), c.contractVersion(), ALLOWLIST_VERSION, v.id, edits);
    }

    private StoryTextChapter lock(int id) {
        return chapters.lock(id).orElseGet(() -> chapters.saveAndFlush(new StoryTextChapter(id)));
    }
    private Long activeId(int id) { return chapters.findById(id).map(c -> c.activeVersionId).orElse(null); }
    private StoryTextVersion findVersion(int id, long versionId) {
        return versions.findById(versionId).filter(v -> v.chapterId == id)
                .orElseThrow(() -> ApiException.notFound("Không tìm thấy phiên bản"));
    }
    private StoryTextDraft savedDraft(int id, long revision) {
        var d = drafts.findById(id).orElseThrow(() -> ApiException.conflict("Hãy lưu bản nháp trước."));
        revision(d, revision); return d;
    }
    private void revision(StoryTextDraft d, long expected) {
        if (d.draftRevision != expected) throw ApiException.conflict("Bản nháp đã thay đổi ở nơi khác. Tải lại để tránh ghi đè.");
    }
    private void compatible(StoryTextDraft d, StoryTextCatalog.Chapter c) {
        catalog.requireHash(c, d.baseHash);
        if (d.allowlistVersion != ALLOWLIST_VERSION) throw ApiException.conflict("Allowlist đã thay đổi.");
    }
    private void writeDraft(StoryTextDraft d, StoryTextCatalog.Chapter c, List<TextOverride> edits, String actor, Long restored) {
        d.baseHash = c.baseHash(); d.contractVersion = c.contractVersion(); d.allowlistVersion = ALLOWLIST_VERSION;
        d.draftRevision++; d.overridesJson = catalog.encode(edits);
        d.validationFingerprint = null; d.previewFingerprint = null; d.restoredFromVersionId = restored;
        d.updatedBy = actor; d.updatedAt = LocalDateTime.now();
    }
    private String fingerprint(StoryTextDraft d) {
        return StoryTextCatalog.hash(d.baseHash + ":" + d.allowlistVersion + ":" + d.draftRevision + ":" + d.overridesJson);
    }
    private Draft draftView(StoryTextDraft d, Long active) {
        return new Draft(d.chapterId, d.baseHash, d.contractVersion, d.allowlistVersion, d.draftRevision, active,
                catalog.decode(d.overridesJson), d.validationFingerprint, d.previewFingerprint, d.updatedBy, d.updatedAt);
    }
    private Version versionView(StoryTextVersion v, boolean details) {
        var edits = catalog.decode(v.overridesJson);
        return new Version(v.id, v.chapterId, v.baseHash, v.contractVersion, v.allowlistVersion, v.draftRevision,
                v.parentVersionId, v.restoredFromVersionId, v.publishedBy, v.publishedAt, edits.size(), details ? edits : null);
    }
    private List<TextOverride> parseOverrides(JsonNode entries) {
        if (entries == null || !entries.isArray()) throw ApiException.badRequest("overrides phải là mảng");
        List<TextOverride> result = new ArrayList<>();
        for (JsonNode e : entries) {
            String field = text(e, "field");
            keys(e, field.equals("choiceText") ? Set.of("nodeId", "field", "choiceIndex", "value") : Set.of("nodeId", "field", "value"));
            Long rawIndex = field.equals("choiceText") ? number(e, "choiceIndex") : null;
            if (rawIndex != null && rawIndex > Integer.MAX_VALUE) throw ApiException.badRequest("Chỉ số lựa chọn không hợp lệ");
            Integer index = rawIndex == null ? null : rawIndex.intValue();
            result.add(new TextOverride(text(e, "nodeId"), field, index, text(e, "value")));
        }
        return result;
    }
    private static void keys(JsonNode node, Set<String> allowed) {
        if (node == null || !node.isObject()) throw ApiException.badRequest("JSON object bắt buộc");
        var names = node.fieldNames();
        while (names.hasNext()) if (!allowed.contains(names.next())) throw ApiException.badRequest("Payload chứa trường không được phép");
        for (String name : allowed) if (!node.has(name)) throw ApiException.badRequest("Thiếu trường " + name);
    }
    private static String text(JsonNode node, String key) {
        if (node == null || !node.path(key).isTextual()) throw ApiException.badRequest("Trường " + key + " phải là chuỗi");
        return node.get(key).asText();
    }
    private static long number(JsonNode node, String key) {
        if (node == null || !node.path(key).isIntegralNumber() || !node.path(key).canConvertToLong() || node.get(key).asLong() < 0) {
            throw ApiException.badRequest("Trường " + key + " phải là số nguyên không âm");
        }
        return node.get(key).asLong();
    }
    private static Long nullableId(JsonNode node, String key) {
        if (!node.has(key)) throw ApiException.badRequest("Thiếu trường " + key);
        return node.get(key).isNull() ? null : number(node, key);
    }
}
