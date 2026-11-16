package com.capstone.detectivegame.admin.story;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.capstone.detectivegame.game.PublishedStoryTextController;
import com.capstone.detectivegame.security.*;
import java.util.List;
import org.junit.jupiter.api.*;
import org.springframework.context.annotation.*;
import org.springframework.mock.web.MockServletContext;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

class StoryTextSecurityTest {
    AnnotationConfigWebApplicationContext context;
    MockMvc mvc;
    JwtTokenProvider tokens;
    StoryTextService service;
    @Configuration @EnableWebMvc @EnableWebSecurity @Import(SecurityConfig.class)
    static class Config {
        @Bean StoryTextService service() { return mock(StoryTextService.class); }
        @Bean StoryTextAdminController admin(StoryTextService s) { return new StoryTextAdminController(s); }
        @Bean PublishedStoryTextController published(StoryTextService s) { return new PublishedStoryTextController(s); }
        @Bean JwtTokenProvider tokens() { return new JwtTokenProvider(new JwtProperties("story-content-test-secret-at-least-32-bytes",60000)); }
        @Bean JwtAuthenticationFilter jwt(JwtTokenProvider p) { return new JwtAuthenticationFilter(p); }
        @Bean CorsProperties cors() { return new CorsProperties(List.of("http://localhost:5173")); }
    }
    @BeforeEach void setup() {
        context=new AnnotationConfigWebApplicationContext(); context.setServletContext(new MockServletContext()); context.register(Config.class); context.refresh();
        mvc=MockMvcBuilders.webAppContextSetup(context).addFilters(context.getBean(FilterChainProxy.class)).build();
        tokens=context.getBean(JwtTokenProvider.class);service=context.getBean(StoryTextService.class);
    }
    @AfterEach void close() { context.close(); }
    String auth(String role) { return "Bearer "+tokens.generateToken("test",role); }
    @Test void anonymousCannotReadOrPublish() throws Exception {
        mvc.perform(get("/api/admin/story/chapters")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/admin/story/chapters/1/publish").contentType("application/json").content("{}")).andExpect(status().isUnauthorized());
        verifyNoInteractions(service);
    }
    @Test void playerCannotUseAnyEditorialEndpoint() throws Exception {
        String[] paths={"/draft","/nodes","/versions","/versions/1"};
        for(String path:paths) mvc.perform(get("/api/admin/story/chapters/1"+path).header("Authorization",auth("ROLE_PLAYER"))).andExpect(status().isForbidden());
        mvc.perform(put("/api/admin/story/chapters/1/draft").header("Authorization",auth("ROLE_PLAYER")).contentType("application/json").content("{}")).andExpect(status().isForbidden());
        for(String path:new String[]{"/draft/validate","/draft/preview","/publish","/versions/1/restore-draft"})
            mvc.perform(post("/api/admin/story/chapters/1"+path).header("Authorization",auth("ROLE_PLAYER")).contentType("application/json").content("{}")).andExpect(status().isForbidden());
        verifyNoInteractions(service);
    }
    @Test void adminCanReadAndPlayerOnlyGetsPublishedProjection() throws Exception {
        when(service.chapters()).thenReturn(List.of());
        mvc.perform(get("/api/admin/story/chapters").header("Authorization",auth("ROLE_ADMIN"))).andExpect(status().isOk());
        when(service.published(1,"hash")).thenReturn(new StoryTextData.Published(1,"hash","2.0.0",1,null,List.of()));
        mvc.perform(get("/api/game/chapters/1/story-text?baseHash=hash").header("Authorization",auth("ROLE_PLAYER")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.overrides").isArray())
                .andExpect(jsonPath("$.draftRevision").doesNotExist()).andExpect(jsonPath("$.nodes").doesNotExist())
                .andExpect(header().string("Cache-Control","no-store"));
    }
}
