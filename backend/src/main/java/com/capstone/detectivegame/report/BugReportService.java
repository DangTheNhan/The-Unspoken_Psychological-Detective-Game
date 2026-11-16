package com.capstone.detectivegame.report;

import com.capstone.detectivegame.common.ApiException;
import com.capstone.detectivegame.report.dto.BugReportRequest;
import com.capstone.detectivegame.user.User;
import com.capstone.detectivegame.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.capstone.detectivegame.security.CurrentUser;

/**
 * Tiếp nhận báo cáo lỗi (Project.docx §4.3). Trạng thái mặc định PENDING (§2.1).
 * PENDING(ISS-10): danh sách + chuyển PENDING -> RESOLVED cho Admin (§5.1) chưa có API Contract.
 */
@Service
public class BugReportService {

    private final BugReportRepository bugReportRepository;
    private final UserRepository userRepository;
    private final CurrentUser current;

    public BugReportService(BugReportRepository bugReportRepository, UserRepository userRepository, CurrentUser current) {
        this.bugReportRepository = bugReportRepository;
        this.userRepository = userRepository;
        this.current = current;
    }

    @Transactional
    public void create(BugReportRequest request) {
        if (request.reportContent() == null || request.reportContent().isBlank()) {
            throw ApiException.badRequest("Thiếu reportContent");
        }
        if(request.reportContent().getBytes(java.nio.charset.StandardCharsets.UTF_8).length>60000) throw ApiException.badRequest("Nội dung báo lỗi quá dài.");
        User user = current.ownForWrite(request.userId());
        bugReportRepository.save(new BugReport(user, request.reportContent()));
    }
}
