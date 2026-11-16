package com.capstone.detectivegame.admin;

import com.capstone.detectivegame.auth.AccountStore;
import com.capstone.detectivegame.common.MaintenanceService;
import java.time.Instant;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/** SecurityConfig restricts every endpoint here to ROLE_ADMIN. */
@RestController
@RequestMapping("/api/admin")
public class OperationsController {
    private final AccountStore store;private final MaintenanceService maintenance;
    public OperationsController(AccountStore store,MaintenanceService maintenance) { this.store=store;this.maintenance=maintenance; }
    @GetMapping("/online")
    public Map<String,Object> online() { var players=store.online();return Map.of("onlineCount",players.size(),"players",players,"serverNow",Instant.now(),"offlineAfterSeconds",60); }
    @GetMapping("/maintenance")
    public MaintenanceService.Status status() { return maintenance.status(); }
    public record Schedule(Instant startsAt,String message) {}
    @PutMapping("/maintenance")
    public MaintenanceService.Status schedule(@RequestBody Schedule request) { return maintenance.schedule(request.startsAt(),request.message()); }
    @DeleteMapping("/maintenance")
    public MaintenanceService.Status end() { return maintenance.end(); }
}
