package com.capstone.detectivegame.admin;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

class AdminTimestampsTest {
    @Test void emptyListsDoNotQueryAndRecordIdsStayBoundParameters() throws Exception {
        var jdbc = mock(NamedParameterJdbcTemplate.class);
        var times = new AdminTimestamps(jdbc);
        assertTrue(times.bugCreatedAt(List.of()).isEmpty());
        verifyNoInteractions(jdbc);
        ResultSet rows = mock(ResultSet.class);
        when(rows.next()).thenReturn(true, false);
        when(rows.getLong("id")).thenReturn(3L);
        when(rows.getBigDecimal("epoch")).thenReturn(new BigDecimal("1794880547"));
        when(jdbc.query(anyString(), anyMap(), org.mockito.ArgumentMatchers.<ResultSetExtractor<Map<Long, LocalDateTime>>>any()))
                .thenAnswer(call -> call.<ResultSetExtractor<Map<Long, LocalDateTime>>>getArgument(2).extractData(rows));
        assertEquals(LocalDateTime.parse("2026-11-17T08:55:47"), times.bugCreatedAt(List.of(3L, 3L)).get(3L));
        verify(jdbc).query(eq("SELECT id, UNIX_TIMESTAMP(created_at) AS epoch FROM bug_reports WHERE id IN (:ids)"),
                eq(Map.of("ids", List.of(3L))), org.mockito.ArgumentMatchers.<ResultSetExtractor<Map<Long, LocalDateTime>>>any());
    }
}
