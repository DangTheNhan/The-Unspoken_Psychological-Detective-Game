package com.capstone.detectivegame.admin.story;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.List;

public final class StoryTextData {
    private StoryTextData() {}
    public static final int ALLOWLIST_VERSION = 1;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record TextOverride(String nodeId, String field, Integer choiceIndex, String value) {}
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record TextField(String field, Integer choiceIndex, String baseText, int limit) {}
    public record StoryNode(String nodeId, String type, String speaker, boolean automaticallySkipped,
                            List<TextField> fields) {}
    public record ChapterInfo(int chapterId, String baseHash, String contractVersion, int allowlistVersion,
                              int nodeCount, int editableFieldCount, Long versionId) {}
    public record Draft(int chapterId, String baseHash, String contractVersion, int allowlistVersion,
                        long draftRevision, Long publishedVersionId, List<TextOverride> overrides,
                        String validationFingerprint, String previewFingerprint,
                        String updatedBy, LocalDateTime updatedAt) {}
    public record Validation(boolean valid, long draftRevision, String validationFingerprint,
                             List<String> errors, List<String> warnings) {}
    public record PreviewLine(String nodeId, String type, String speaker, String field,
                              Integer choiceIndex, String baseText, String value, boolean automaticallySkipped) {}
    public record Preview(long draftRevision, String previewFingerprint, List<PreviewLine> lines) {}
    public record Published(int chapterId, String baseHash, String contractVersion, int allowlistVersion,
                            Long versionId, List<TextOverride> overrides) {}
    public record Version(long versionId, int chapterId, String baseHash, String contractVersion,
                          int allowlistVersion, long draftRevision, Long parentVersionId,
                          Long restoredFromVersionId, String publishedBy, LocalDateTime publishedAt,
                          int changedFieldCount, List<TextOverride> overrides) {}
    public record Publication(Version version, boolean created) {}
}
