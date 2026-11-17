package com.capstone.detectivegame.common;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

/** Presentation only: keep existing LocalDateTime JSON fields, with Vietnamese wall time. */
public final class VietnamTime {
    public static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private VietnamTime() {}

    public static LocalDateTime fromEpoch(BigDecimal epochSeconds) {
        if (epochSeconds == null) return null;
        long seconds = epochSeconds.setScale(0, RoundingMode.FLOOR).longValueExact();
        int nanos = epochSeconds.subtract(BigDecimal.valueOf(seconds)).movePointRight(9).intValueExact();
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(seconds, nanos), ZONE);
    }

    /** Application-written LocalDateTime is reconstructed in the JVM zone by Hibernate. */
    public static LocalDateTime fromApplicationLocal(LocalDateTime value) {
        return fromApplicationLocal(value, ZoneId.systemDefault());
    }

    public static LocalDateTime fromApplicationLocal(LocalDateTime value, ZoneId sourceZone) {
        return value == null ? null : value.atZone(sourceZone).withZoneSameInstant(ZONE).toLocalDateTime();
    }
}
