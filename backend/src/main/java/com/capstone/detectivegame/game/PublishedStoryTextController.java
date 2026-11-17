package com.capstone.detectivegame.game;

import com.capstone.detectivegame.admin.story.StoryTextData.Published;
import com.capstone.detectivegame.admin.story.StoryTextService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Authenticated read of published text only. Never serves a draft or answer key. */
@RestController
@RequestMapping("/api/game/chapters")
public class PublishedStoryTextController {
    private final StoryTextService service;
    public PublishedStoryTextController(StoryTextService service) { this.service = service; }
    @GetMapping("/{id}/story-text")
    public ResponseEntity<Published> published(@PathVariable int id, @RequestParam String baseHash) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(service.published(id, baseHash));
    }
}
