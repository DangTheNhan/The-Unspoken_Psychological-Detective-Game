package com.capstone.detectivegame.admin.story;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface StoryTextChapterRepository extends JpaRepository<StoryTextChapter, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from StoryTextChapter c where c.chapterId = :id")
    Optional<StoryTextChapter> lock(@Param("id") int id);
}
interface StoryTextDraftRepository extends JpaRepository<StoryTextDraft, Integer> {}
interface StoryTextVersionRepository extends JpaRepository<StoryTextVersion, Long> {
    List<StoryTextVersion> findByChapterIdOrderByIdDesc(int chapterId);
}
