-- DEC-026 supplemental schema. The original schema.sql is intentionally unchanged.
CREATE TABLE IF NOT EXISTS story_text_chapters (
    chapter_id INT PRIMARY KEY,
    active_version_id BIGINT NULL,
    lock_version BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS story_text_drafts (
    chapter_id INT PRIMARY KEY,
    base_hash CHAR(64) NOT NULL,
    contract_version VARCHAR(20) NOT NULL,
    allowlist_version INT NOT NULL,
    draft_revision BIGINT NOT NULL,
    overrides_json LONGTEXT NOT NULL,
    validation_fingerprint CHAR(64) NULL,
    preview_fingerprint CHAR(64) NULL,
    restored_from_version_id BIGINT NULL,
    updated_by VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_story_draft_chapter FOREIGN KEY (chapter_id) REFERENCES story_text_chapters(chapter_id)
);

CREATE TABLE IF NOT EXISTS story_text_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    base_hash CHAR(64) NOT NULL,
    contract_version VARCHAR(20) NOT NULL,
    allowlist_version INT NOT NULL,
    overrides_json LONGTEXT NOT NULL,
    checksum CHAR(64) NOT NULL,
    draft_revision BIGINT NOT NULL,
    parent_version_id BIGINT NULL,
    restored_from_version_id BIGINT NULL,
    published_by VARCHAR(50) NOT NULL,
    published_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT fk_story_version_chapter FOREIGN KEY (chapter_id) REFERENCES story_text_chapters(chapter_id),
    CONSTRAINT uq_story_version_draft UNIQUE (chapter_id, draft_revision)
);
