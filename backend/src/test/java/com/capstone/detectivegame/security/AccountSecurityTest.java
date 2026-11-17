package com.capstone.detectivegame.security;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.capstone.detectivegame.auth.SessionService;
import com.capstone.detectivegame.common.MaintenanceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.*;
import org.springframework.context.annotation.*;
import org.springframework.mock.web.MockServletContext;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

class AccountSecurityTest {
    AnnotationConfigWebApplicationContext context;MockMvc mvc;JwtTokenProvider tokens;MaintenanceService maintenance;
    @RestController static class Probe {
        @GetMapping({"/api/game/probe","/api/admin/probe","/api/system/status"}) Map<String,Object> get() { return Map.of("ok",true); }
        @PostMapping("/api/auth/session") Map<String,Object> session() { return Map.of("ok",true); }
    }
    @Configuration @EnableWebMvc @EnableWebSecurity @Import(SecurityConfig.class)
    static class Config {
        @Bean Probe probe() { return new Probe(); }
        @Bean JwtTokenProvider tokens() { return new JwtTokenProvider(new JwtProperties("account-test-secret-with-more-than-32-bytes",60000)); }
        @Bean SessionService sessions() { var service=mock(SessionService.class);when(service.valid(anyString(),eq("current-session"))).thenReturn(true);return service; }
        @Bean JwtAuthenticationFilter jwt(JwtTokenProvider tokens,SessionService sessions) { return new JwtAuthenticationFilter(tokens,sessions); }
        @Bean MaintenanceService maintenanceService() { var service=mock(MaintenanceService.class);when(service.status()).thenReturn(new MaintenanceService.Status(Instant.now(),false,false,null,"",0));return service; }
        @Bean MaintenanceFilter maintenance(MaintenanceService service) { return new MaintenanceFilter(service,new ObjectMapper()); }
        @Bean CorsProperties cors() { return new CorsProperties(List.of("http://localhost:5173")); }
    }
    @BeforeEach void setup() {
        context=new AnnotationConfigWebApplicationContext();context.setServletContext(new MockServletContext());context.register(Config.class);context.refresh();
        mvc=MockMvcBuilders.webAppContextSetup(context).addFilters(context.getBean(FilterChainProxy.class)).build();tokens=context.getBean(JwtTokenProvider.class);maintenance=context.getBean(MaintenanceService.class);
    }
    @AfterEach void close() { context.close(); }
    String auth(String role,String sid) { return "Bearer "+tokens.generateToken("player",role,sid); }
    @Test void replacedSessionIsRejectedEvenWithValidSignature() throws Exception {
        mvc.perform(get("/api/game/probe").header("Authorization",auth("ROLE_PLAYER","old-session"))).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/game/probe").header("Authorization",auth("ROLE_PLAYER","current-session"))).andExpect(status().isOk());
    }
    @Test void heartbeatRequiresAuthenticationAndPlayerCannotUseAdmin() throws Exception {
        mvc.perform(post("/api/auth/session")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/session").header("Authorization",auth("ROLE_PLAYER","current-session"))).andExpect(status().isOk());
        mvc.perform(get("/api/admin/probe").header("Authorization",auth("ROLE_PLAYER","current-session"))).andExpect(status().isForbidden());
    }
    @Test void maintenanceStopsPlayerOnServerAndAdminCanStillWork() throws Exception {
        when(maintenance.status()).thenReturn(new MaintenanceService.Status(Instant.now(),false,true,Instant.now().minusSeconds(5),"Maintenance",1));
        mvc.perform(get("/api/game/probe").header("Authorization",auth("ROLE_PLAYER","current-session"))).andExpect(status().isServiceUnavailable()).andExpect(jsonPath("$.code").value("MAINTENANCE_ACTIVE"));
        mvc.perform(get("/api/game/probe").header("Authorization",auth("ROLE_ADMIN","current-session"))).andExpect(status().isOk());
        mvc.perform(get("/api/admin/probe").header("Authorization",auth("ROLE_ADMIN","current-session"))).andExpect(status().isOk());
    }
    @Test void announcedFutureScheduleDoesNotBlockGameAndStatusIsPublic() throws Exception {
        when(maintenance.status()).thenReturn(new MaintenanceService.Status(Instant.now(),true,false,Instant.now().plusSeconds(60),"Upcoming",1));
        mvc.perform(get("/api/game/probe").header("Authorization",auth("ROLE_PLAYER","current-session"))).andExpect(status().isOk());
        mvc.perform(get("/api/system/status")).andExpect(status().isOk());
    }
}
