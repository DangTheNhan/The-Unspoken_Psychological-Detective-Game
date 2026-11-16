package com.capstone.detectivegame.security;

import com.capstone.detectivegame.common.MaintenanceService;
import com.capstone.detectivegame.user.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class MaintenanceFilter extends OncePerRequestFilter {
    private final MaintenanceService maintenance;private final ObjectMapper mapper;
    public MaintenanceFilter(MaintenanceService maintenance,ObjectMapper mapper) { this.maintenance=maintenance;this.mapper=mapper; }
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
        var auth=SecurityContextHolder.getContext().getAuthentication();
        if(request.getRequestURI().startsWith("/api/game/") && auth!=null && auth.getAuthorities().stream().noneMatch(a->User.ROLE_ADMIN.equals(a.getAuthority())) && maintenance.status().active()) {
            response.setStatus(503);response.setContentType("application/json");response.setCharacterEncoding("UTF-8");response.setHeader("Cache-Control","no-store");
            mapper.writeValue(response.getWriter(),Map.of("code","MAINTENANCE_ACTIVE","message","Hệ thống đang bảo trì. Tiến độ trên trình duyệt được giữ lại."));return;
        }
        chain.doFilter(request,response);
    }
}
