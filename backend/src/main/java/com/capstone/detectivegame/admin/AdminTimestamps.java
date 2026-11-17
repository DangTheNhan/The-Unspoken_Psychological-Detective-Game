package com.capstone.detectivegame.admin;

import com.capstone.detectivegame.common.VietnamTime;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * DB-generated TIMESTAMPs must use their DB epoch, not a JDBC LocalDateTime interpretation.
 * Batches IDs per list; uses the current transaction/connection and does not change its timezone.
 */
@Component
public class AdminTimestamps {
    private final NamedParameterJdbcTemplate jdbc;
    public AdminTimestamps(NamedParameterJdbcTemplate jdbc) { this.jdbc = jdbc; }

    public Map<Long, LocalDateTime> userCreatedAt(Collection<Long> ids) { return read("users", "created_at", ids); }
    public Map<Long, LocalDateTime> saveUpdatedAt(Collection<Long> ids) { return read("game_saves", "updated_at", ids); }
    public Map<Long, LocalDateTime> bugCreatedAt(Collection<Long> ids) { return read("bug_reports", "created_at", ids); }

    private Map<Long, LocalDateTime> read(String table, String column, Collection<Long> ids) {
        List<Long> selected = ids.stream().filter(Objects::nonNull).distinct().toList();
        if (selected.isEmpty()) return Map.of();
        // Identifiers are internal constants above; all record IDs are bound parameters.
        return jdbc.query("SELECT id, UNIX_TIMESTAMP(" + column + ") AS epoch FROM " + table + " WHERE id IN (:ids)",
                Map.of("ids", selected), (org.springframework.jdbc.core.ResultSetExtractor<Map<Long, LocalDateTime>>) rows -> {
                    Map<Long, LocalDateTime> result = new HashMap<>();
                    while (rows.next()) result.put(rows.getLong("id"), VietnamTime.fromEpoch(rows.getBigDecimal("epoch")));
                    return result;
                });
    }
}
