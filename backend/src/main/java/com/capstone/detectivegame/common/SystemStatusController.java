package com.capstone.detectivegame.common;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SystemStatusController {
    private final MaintenanceService maintenance;
    public SystemStatusController(MaintenanceService maintenance) { this.maintenance=maintenance; }
    @GetMapping("/api/system/status")
    public ResponseEntity<MaintenanceService.Status> status() { return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(maintenance.status()); }
}
