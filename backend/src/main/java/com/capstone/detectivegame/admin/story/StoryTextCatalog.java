package com.capstone.detectivegame.admin.story;

import static com.capstone.detectivegame.admin.story.StoryTextData.*;

import com.capstone.detectivegame.common.ApiException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

/** Trusted shipped runtime data, never a client-supplied graph or the source package. */
@Component
public class StoryTextCatalog {
    private static final Set<String> TEXT_TYPES = Set.of("dialogue", "narration", "action", "ui");
    private static final Set<String> CHOICE_TYPES = Set.of("choice", "investigation", "cross_examination", "deduction");
    private final Map<Integer, Chapter> chapters = new LinkedHashMap<>();
    private final ObjectMapper mapper;

    public record Chapter(int id, String baseHash, String contractVersion, JsonNode graph, List<StoryNode> nodes) {}

    public StoryTextCatalog(ObjectMapper mapper) {
        this.mapper = mapper;
        try {
            JsonNode manifest = mapper.readTree(new ClassPathResource("story-content/story-content-manifest.json").getInputStream());
            if (manifest.path("allowlistVersion").asInt() != ALLOWLIST_VERSION) throw new IOException("Wrong allowlist version");
            for (JsonNode entry : manifest.path("chapters")) {
                String path = entry.path("file").asText();
                if (!path.matches("chapter[0-9]+/chapter[0-9]+\\.json")) throw new IOException("Invalid chapter resource");
                byte[] raw;
                try (var in = new ClassPathResource("story-content/" + path).getInputStream()) { raw = in.readAllBytes(); }
                String hash = hash(raw);
                if (!hash.equals(entry.path("baseHash").asText())) throw new IOException("Stale chapter manifest");
                JsonNode graph = mapper.readTree(raw);
                int id = entry.path("chapterId").asInt();
                String contract = entry.path("contractVersion").asText();
                if (graph.path("chapter").asInt() != id || !contract.equals(graph.path("contractVersion").asText())) {
                    throw new IOException("Chapter identity mismatch");
                }
                List<StoryNode> nodes = new ArrayList<>();
                for (JsonNode node : graph.path("nodes")) {
                    List<TextField> fields = new ArrayList<>();
                    String type = node.path("type").asText();
                    if (TEXT_TYPES.contains(type) && node.path("text").isTextual()) {
                        fields.add(new TextField("text", null, node.get("text").asText(), 4000));
                    }
                    if (CHOICE_TYPES.contains(type)) {
                        for (int i = 0; i < node.path("choices").size(); i++) {
                            JsonNode choice = node.path("choices").get(i);
                            if (choice.path("text").isTextual()) fields.add(new TextField("choiceText", i, choice.get("text").asText(), 500));
                        }
                    }
                    nodes.add(new StoryNode(node.path("id").asText(), type, node.path("speaker").asText(""),
                            Set.of("narration", "action").contains(type), List.copyOf(fields)));
                }
                if (nodes.stream().map(StoryNode::nodeId).distinct().count() != nodes.size()) throw new IOException("Duplicate node ID");
                chapters.put(id, new Chapter(id, hash, contract, graph, List.copyOf(nodes)));
            }
        } catch (IOException ex) {
            throw new IllegalStateException("Prepare story content resources: node scripts/chapter1/prepare-story-content.mjs then rebuild backend", ex);
        }
    }

    public List<Chapter> all() { return List.copyOf(chapters.values()); }
    public Chapter get(int id) {
        Chapter chapter = chapters.get(id);
        if (chapter == null) throw ApiException.notFound("Chương chưa được đăng ký");
        return chapter;
    }
    public void requireHash(Chapter chapter, String hash) {
        if (!chapter.baseHash().equals(hash)) throw ApiException.conflict("Dữ liệu chương đã thay đổi. Tải lại và rà soát bản nháp.");
    }
    public StoryNode node(Chapter chapter, String id) {
        return chapter.nodes().stream().filter(n -> n.nodeId().equals(id)).findFirst()
                .orElseThrow(() -> ApiException.badRequest("Node không tồn tại: " + id));
    }
    public TextField field(Chapter chapter, TextOverride edit) {
        return node(chapter, edit.nodeId()).fields().stream()
                .filter(f -> f.field().equals(edit.field()) && java.util.Objects.equals(f.choiceIndex(), edit.choiceIndex()))
                .findFirst().orElseThrow(() -> ApiException.badRequest("Trường không được phép sửa: " + edit.nodeId()));
    }
    public List<TextOverride> validate(Chapter chapter, List<TextOverride> edits) {
        if (edits == null) throw ApiException.badRequest("Thiếu overrides");
        Set<String> seen = new java.util.HashSet<>();
        List<TextOverride> normalized = new ArrayList<>();
        JsonNode merged = chapter.graph().deepCopy();
        Map<String, JsonNode> targets = new LinkedHashMap<>();
        for (JsonNode n : merged.path("nodes")) targets.put(n.path("id").asText(), n);
        for (TextOverride edit : edits) {
            if (edit == null || edit.nodeId() == null || edit.field() == null) throw ApiException.badRequest("Override không hợp lệ");
            TextField f = field(chapter, edit);
            String key = edit.nodeId() + ":" + edit.field() + ":" + edit.choiceIndex();
            if (!seen.add(key)) throw ApiException.badRequest("Trùng trường văn bản");
            String value = edit.value();
            if (value == null || value.isBlank() || value.codePointCount(0, value.length()) > f.limit()) {
                throw ApiException.badRequest("Nội dung rỗng hoặc vượt giới hạn " + f.limit() + " ký tự");
            }
            if (!value.equals(f.baseText())) normalized.add(edit);
            target(targets.get(edit.nodeId()), edit).put("text", value);
        }
        // Restore only allowed paths; everything else must still equal the original graph.
        for (TextOverride edit : edits) target(targets.get(edit.nodeId()), edit).put("text", field(chapter, edit).baseText());
        if (!merged.equals(chapter.graph())) throw ApiException.badRequest("Cấu trúc graph đã thay đổi");
        normalized.sort(Comparator.comparing(TextOverride::nodeId).thenComparing(TextOverride::field)
                .thenComparing(e -> e.choiceIndex() == null ? -1 : e.choiceIndex()));
        return List.copyOf(normalized);
    }
    private ObjectNode target(JsonNode node, TextOverride edit) {
        return (ObjectNode) (edit.field().equals("text") ? node : node.path("choices").get(edit.choiceIndex()));
    }
    public String encode(List<TextOverride> edits) {
        try { return mapper.writeValueAsString(edits); }
        catch (IOException ex) { throw new IllegalStateException(ex); }
    }
    public List<TextOverride> decode(String json) {
        try { return mapper.readerForListOf(TextOverride.class).readValue(json); }
        catch (IOException ex) { throw new IllegalStateException("Stored story text is invalid", ex); }
    }
    public static String hash(String text) { return hash(text.getBytes(StandardCharsets.UTF_8)); }
    public static String hash(byte[] raw) {
        try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(raw)); }
        catch (NoSuchAlgorithmException ex) { throw new IllegalStateException(ex); }
    }
}
