package com.capstone.detectivegame.common;

import com.capstone.detectivegame.auth.AccountStore;
import java.sql.Timestamp;
import java.time.Instant;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MaintenanceService {
    public record Status(Instant serverNow,boolean scheduled,boolean active,Instant startsAt,String message,long revision) {}
    private final AccountStore store;
    public MaintenanceService(AccountStore store) { this.store=store; }
    public Status status() {
        Instant now=Instant.now();
        return store.db().query("SELECT enabled,starts_at,message,revision FROM system_maintenance WHERE id=1",(rs,n)-> {
            boolean enabled=rs.getBoolean(1);Instant starts=rs.getTimestamp(2)==null?null:rs.getTimestamp(2).toInstant();
            return new Status(now,enabled&&starts!=null&&starts.isAfter(now),enabled&&starts!=null&&!starts.isAfter(now),starts,rs.getString(3),rs.getLong(4));
        }).stream().findFirst().orElse(new Status(now,false,false,null,"",0));
    }
    @Transactional
    public Status schedule(Instant startsAt,String message) {
        store.db().queryForList("SELECT id FROM system_maintenance WHERE id=1 FOR UPDATE");
        if(status().active()) throw ApiException.conflict("Hãy kết thúc đợt bảo trì hiện tại trước khi đặt lịch mới.");
        if(startsAt==null || !startsAt.isAfter(Instant.now())) throw ApiException.badRequest("Giờ bảo trì phải ở trong tương lai.");
        if(message==null || message.isBlank() || message.trim().length()>1000) throw ApiException.badRequest("Thông báo cần từ 1 đến 1000 ký tự.");
        store.db().update("UPDATE system_maintenance SET enabled=TRUE,starts_at=?,message=?,revision=revision+1 WHERE id=1",Timestamp.from(startsAt),message.trim());
        return status();
    }
    @Transactional
    public Status end() {
        store.db().update("UPDATE system_maintenance SET enabled=FALSE,starts_at=NULL,message='',revision=revision+1 WHERE id=1");
        return status();
    }
}
