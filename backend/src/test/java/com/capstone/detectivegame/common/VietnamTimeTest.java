package com.capstone.detectivegame.common;

import static org.junit.jupiter.api.Assertions.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.junit.jupiter.api.Test;

class VietnamTimeTest {
    @Test void databaseEpochKeepsTheActualInstantAndFraction() {
        assertEquals(LocalDateTime.parse("2026-11-17T08:55:47"), VietnamTime.fromEpoch(new BigDecimal("1794880547")));
        assertEquals(LocalDateTime.parse("2026-11-17T08:55:47.123456"), VietnamTime.fromEpoch(new BigDecimal("1794880547.123456")));
        assertNull(VietnamTime.fromEpoch(null));
    }
    @Test void applicationDatesUseTheirSourceZoneRatherThanAddingSevenHoursToEverything() {
        var expected = LocalDateTime.parse("2026-11-17T01:00:00");
        assertEquals(expected, VietnamTime.fromApplicationLocal(LocalDateTime.parse("2026-11-16T18:00:00"), ZoneId.of("UTC")));
        assertEquals(expected, VietnamTime.fromApplicationLocal(expected, ZoneId.of("Asia/Ho_Chi_Minh")));
        assertNull(VietnamTime.fromApplicationLocal(null, ZoneId.of("UTC")));
    }
}
