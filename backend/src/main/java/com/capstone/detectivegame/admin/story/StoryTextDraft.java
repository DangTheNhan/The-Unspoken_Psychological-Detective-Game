package com.capstone.detectivegame.admin.story;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "story_text_drafts")
public class StoryTextDraft {
    @Id @Column(name = "chapter_id") int chapterId;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
    @Column(name = "base_hash", length = 64, nullable = false) String baseHash;
    @Column(name = "contract_version", length = 20, nullable = false) String contractVersion;
    @Column(name = "allowlist_version", nullable = false) int allowlistVersion;
    @Column(name = "draft_revision", nullable = false) long draftRevision;
    @Column(name = "overrides_json", columnDefinition = "LONGTEXT", nullable = false) String overridesJson;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
    @Column(name = "validation_fingerprint", length = 64) String validationFingerprint;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
    @Column(name = "preview_fingerprint", length = 64) String previewFingerprint;
    @Column(name = "restored_from_version_id") Long restoredFromVersionId;
    @Column(name = "updated_by", length = 50, nullable = false) String updatedBy;
    @Column(name = "updated_at", columnDefinition = "TIMESTAMP(6)", nullable = false) LocalDateTime updatedAt;
    protected StoryTextDraft() {}
    StoryTextDraft(int id) { chapterId = id; }
}
