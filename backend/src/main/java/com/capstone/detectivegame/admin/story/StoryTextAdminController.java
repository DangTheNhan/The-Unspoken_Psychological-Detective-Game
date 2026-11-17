package com.capstone.detectivegame.admin.story;

import static com.capstone.detectivegame.admin.story.StoryTextData.*;
import com.fasterxml.jackson.databind.JsonNode;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/story/chapters")
public class StoryTextAdminController {
    private final StoryTextService service;
    public StoryTextAdminController(StoryTextService service) { this.service = service; }
    @GetMapping public List<ChapterInfo> chapters() { return service.chapters(); }
    @GetMapping("/{id}/nodes") public List<StoryNode> nodes(@PathVariable int id,
            @RequestParam(required = false) String q, @RequestParam(required = false) String type,
            @RequestParam(required = false) String speaker) { return service.nodes(id, q, type, speaker); }
    @GetMapping("/{id}/draft") public Draft draft(@PathVariable int id) { return service.draft(id); }
    @PutMapping("/{id}/draft") public Draft save(@PathVariable int id, @RequestBody JsonNode body, Principal actor) {
        return service.save(id, body, actor.getName());
    }
    @PostMapping("/{id}/draft/validate") public Validation validate(@PathVariable int id, @RequestBody JsonNode body) { return service.validate(id, body); }
    @PostMapping("/{id}/draft/preview") public Preview preview(@PathVariable int id, @RequestBody JsonNode body) { return service.preview(id, body); }
    @PostMapping("/{id}/publish") public ResponseEntity<Version> publish(@PathVariable int id, @RequestBody JsonNode body, Principal actor) {
        var result = service.publish(id, body, actor.getName());
        return ResponseEntity.status(result.created() ? 201 : 200).body(result.version());
    }
    @GetMapping("/{id}/versions") public List<Version> versions(@PathVariable int id) { return service.versions(id); }
    @GetMapping("/{id}/versions/{versionId}") public Version version(@PathVariable int id, @PathVariable long versionId) { return service.version(id, versionId); }
    @PostMapping("/{id}/versions/{versionId}/restore-draft") public Draft restore(@PathVariable int id,
            @PathVariable long versionId, @RequestBody JsonNode body, Principal actor) { return service.restore(id, versionId, body, actor.getName()); }
}
