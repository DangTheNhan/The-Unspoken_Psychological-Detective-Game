package com.capstone.detectivegame.admin.story;

import static com.capstone.detectivegame.admin.story.StoryTextData.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.capstone.detectivegame.common.ApiException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class StoryTextServiceTest {
    final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
    StoryTextCatalog catalog;
    StoryTextService service;
    Map<Integer, StoryTextChapter> chapters;
    Map<Integer, StoryTextDraft> drafts;
    Map<Long, StoryTextVersion> versions;
    long nextId;

    @BeforeEach void setup() {
        catalog = new StoryTextCatalog(mapper);
        chapters = new HashMap<>(); drafts = new HashMap<>(); versions = new HashMap<>(); nextId = 0;
        var cr = mock(StoryTextChapterRepository.class);
        var dr = mock(StoryTextDraftRepository.class);
        var vr = mock(StoryTextVersionRepository.class);
        when(cr.findById(anyInt())).thenAnswer(a -> Optional.ofNullable(chapters.get(a.getArgument(0))));
        when(cr.lock(anyInt())).thenAnswer(a -> Optional.ofNullable(chapters.get(a.getArgument(0))));
        when(cr.saveAndFlush(any())).thenAnswer(a -> { StoryTextChapter c = a.getArgument(0); chapters.put(c.chapterId, c); return c; });
        when(dr.findById(anyInt())).thenAnswer(a -> Optional.ofNullable(drafts.get(a.getArgument(0))));
        when(dr.save(any())).thenAnswer(a -> { StoryTextDraft d = a.getArgument(0); drafts.put(d.chapterId, d); return d; });
        when(vr.findById(anyLong())).thenAnswer(a -> Optional.ofNullable(versions.get(a.getArgument(0))));
        when(vr.saveAndFlush(any())).thenAnswer(a -> { StoryTextVersion v = a.getArgument(0); v.id = ++nextId; versions.put(v.id,v); return v; });
        when(vr.findByChapterIdOrderByIdDesc(anyInt())).thenAnswer(a -> versions.values().stream().filter(v -> v.chapterId == (int) a.getArgument(0))
                .sorted((x,y) -> y.id.compareTo(x.id)).toList());
        service = new StoryTextService(catalog, cr, dr, vr);
    }
    ObjectNode body(long revision) {
        return mapper.createObjectNode().put("baseHash",catalog.get(1).baseHash()).put("draftRevision",revision);
    }
    ObjectNode saveBody(long revision) {
        var b = mapper.createObjectNode().put("baseHash",catalog.get(1).baseHash()).put("expectedDraftRevision",revision);
        var n = catalog.get(1).nodes().stream().filter(x -> x.type().equals("dialogue")).findFirst().orElseThrow();
        b.putArray("overrides").addObject().put("nodeId",n.nodeId()).put("field","text").put("value",n.fields().get(0).baseText()+"\n");
        return b;
    }
    ObjectNode publishBody(Draft d, Long active) {
        var b=body(d.draftRevision());
        if(active==null)b.putNull("expectedPublishedVersionId");else b.put("expectedPublishedVersionId",active);
        return b.put("validationFingerprint",d.validationFingerprint()).put("previewFingerprint",d.previewFingerprint());
    }
    Draft review(long revision) {
        service.validate(1,body(revision)); service.preview(1,body(revision)); return service.draft(1);
    }
    @Test void trustedCatalogHasOnlyApprovedTargetsAndReadsDoNotCreateData() {
        assertEquals(1264,catalog.get(1).nodes().size());
        assertEquals(813,service.chapters().get(0).editableFieldCount());
        assertThrows(ApiException.class,()->catalog.get(2));
        assertTrue(service.draft(1).overrides().isEmpty());
        assertTrue(chapters.isEmpty()); assertTrue(drafts.isEmpty());
        assertNull(service.published(1,catalog.get(1).baseHash()).versionId());
        assertTrue(catalog.node(catalog.get(1),"FD_NOTEBOOK_FINAL").fields().isEmpty());
    }
    @Test void forbidsStructuralPayloadsAndUnknownOrDuplicateFields() {
        var forbidden=saveBody(0); forbidden.put("effects","forbidden");
        assertThrows(ApiException.class,()->service.save(1,forbidden,"admin"));
        var b=saveBody(0); ((ObjectNode)b.path("overrides").get(0)).put("next","CH2_ENTRY");
        var extra=b; assertThrows(ApiException.class,()->service.save(1,extra,"admin"));
        var unknown=saveBody(0); ((ObjectNode)unknown.path("overrides").get(0)).put("field","speaker");
        assertThrows(ApiException.class,()->service.save(1,unknown,"admin"));
        var duplicate=saveBody(0); ((com.fasterxml.jackson.databind.node.ArrayNode)duplicate.get("overrides")).add(duplicate.path("overrides").get(0).deepCopy());
        assertThrows(ApiException.class,()->service.save(1,duplicate,"admin"));
        assertTrue(drafts.isEmpty());
    }
    @Test void publicationRequiresSavedValidatedPreviewedDraftAndIsIdempotent() {
        var d=service.save(1,saveBody(0),"admin");
        assertTrue(service.published(1,catalog.get(1).baseHash()).overrides().isEmpty());
        assertThrows(ApiException.class,()->service.preview(1,body(1)));
        var unreviewed=publishBody(d,null); assertThrows(ApiException.class,()->service.publish(1,unreviewed,"admin"));
        d=review(1);
        var pub=service.publish(1,publishBody(d,null),"admin");
        assertTrue(pub.created()); assertEquals(1,service.published(1,catalog.get(1).baseHash()).overrides().size());
        assertFalse(service.publish(1,publishBody(d,null),"admin").created());
        assertEquals(1,versions.size());
    }
    @Test void editsInvalidateReviewAndStaleRequestsCannotOverwriteDraftOrPublish() {
        service.save(1,saveBody(0),"admin"); var reviewed=review(1);
        assertThrows(ApiException.class,()->service.save(1,saveBody(0),"other"));
        var changed=service.save(1,saveBody(1),"admin");
        assertNull(changed.validationFingerprint()); assertNull(changed.previewFingerprint());
        assertThrows(ApiException.class,()->service.publish(1,publishBody(reviewed,null),"admin"));
        var newReview=review(2);
        assertThrows(ApiException.class,()->service.publish(1,publishBody(newReview,999L),"admin"));
        assertTrue(versions.isEmpty());
    }
    @Test void restoreCreatesDraftOnlyAndNewPublicationPreservesImmutableHistory() {
        service.save(1,saveBody(0),"admin"); var d=review(1);
        var v1=service.publish(1,publishBody(d,null),"admin").version();
        var empty=saveBody(1); empty.set("overrides",mapper.createArrayNode()); service.save(1,empty,"admin");
        var v2=service.publish(1,publishBody(review(2),v1.versionId()),"admin").version();
        assertTrue(service.published(1,catalog.get(1).baseHash()).overrides().isEmpty());
        var restore=mapper.createObjectNode().put("baseHash",catalog.get(1).baseHash()).put("expectedDraftRevision",2);
        service.restore(1,v1.versionId(),restore,"admin");
        assertEquals(v2.versionId(),service.published(1,catalog.get(1).baseHash()).versionId());
        var v3=service.publish(1,publishBody(review(3),v2.versionId()),"admin").version();
        assertEquals(v1.versionId(),v3.restoredFromVersionId());
        assertEquals(3,versions.size()); assertEquals(v1.overrides(),service.version(1,v1.versionId()).overrides());
    }
    @Test void hashAndTextLimitsAreEnforcedWithoutMutatingBase() {
        String original=catalog.get(1).graph().toString();
        var wrong=saveBody(0).put("baseHash","old"); assertThrows(ApiException.class,()->service.save(1,wrong,"admin"));
        var blank=saveBody(0); ((ObjectNode)blank.path("overrides").get(0)).put("value"," \n");
        assertThrows(ApiException.class,()->service.save(1,blank,"admin"));
        var longText=saveBody(0); ((ObjectNode)longText.path("overrides").get(0)).put("value","a".repeat(4001));
        assertThrows(ApiException.class,()->service.save(1,longText,"admin"));
        var hugeIndex=saveBody(0); ((ObjectNode)hugeIndex.path("overrides").get(0)).put("field","choiceText").put("choiceIndex",Long.MAX_VALUE);
        assertThrows(ApiException.class,()->service.save(1,hugeIndex,"admin"));
        service.save(1,saveBody(0),"admin"); assertEquals(original,catalog.get(1).graph().toString());
    }
}
