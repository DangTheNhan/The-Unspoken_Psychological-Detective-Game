package com.capstone.detectivegame.auth;

import com.capstone.detectivegame.common.ApiException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/** Bounded per-process public-endpoint abuse limiter; reset tokens also have a DB cooldown. */
@Component
public class RequestThrottle {
    private record Window(long until,int count) {}
    private final Map<String,Window> windows=new HashMap<>();
    public synchronized void check(String key,int limit) {
        long now=Instant.now().getEpochSecond();
        windows.entrySet().removeIf(entry->entry.getValue().until()<now);
        Window old=windows.get(key);
        if((old!=null && old.count()>=limit) || (old==null && windows.size()>=10000))
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS,"Bạn thao tác quá nhanh. Hãy thử lại sau một phút.");
        windows.put(key,new Window(old==null?now+60:old.until(),old==null?1:old.count()+1));
    }
}
