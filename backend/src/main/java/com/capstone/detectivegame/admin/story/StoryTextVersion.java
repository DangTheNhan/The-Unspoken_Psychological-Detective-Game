package com.capstone.detectivegame.admin.story;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "story_text_versions", uniqueConstraints = @UniqueConstraint(name = "uq_story_version_draft", columnNames = {"chapter_id", "draft_revision"}))
public class StoryTextVersion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Column(name = "chapter_id", nullable = false, updatable = false) int chapterId;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
    @Column(name = "base_hash", length = 64, nullable = false, updatable = false) String baseHash;
    @Column(name = "contract_version", length = 20, nullable = false, updatable = false) String contractVersion;
    @Column(name = "allowlist_version", nullable = false, updatable = false) int allowlistVersion;
    @Column(name = "overrides_json", columnDefinition = "LONGTEXT", nullable = false, updatable = false) String overridesJson;
    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR)
    @Column(name = "checksum", length = 64, nullable = false, updatable = false) String checksum;
    @Column(name = "draft_revision", nullable = false, updatable = false) long draftRevision;
    @Column(name = "parent_version_id", updatable = false) Long parentVersionId;
    @Column(name = "restored_from_version_id", updatable = false) Long restoredFromVersionId;
    @Column(name = "published_by", length = 50, nullable = false, updatable = false) String publishedBy;
    @Column(name = "published_at", columnDefinition = "TIMESTAMP(6)", nullable = false, updatable = false) LocalDateTime publishedAt;
    protected StoryTextVersion() {}
}
