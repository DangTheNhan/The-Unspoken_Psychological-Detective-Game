package com.capstone.detectivegame.admin.story;

import jakarta.persistence.*;

@Entity
@Table(name = "story_text_chapters")
public class StoryTextChapter {
    @Id @Column(name = "chapter_id") int chapterId;
    @Column(name = "active_version_id") Long activeVersionId;
    @Version @Column(name = "lock_version", nullable = false) long lockVersion;
    protected StoryTextChapter() {}
    StoryTextChapter(int id) { chapterId = id; }
}
