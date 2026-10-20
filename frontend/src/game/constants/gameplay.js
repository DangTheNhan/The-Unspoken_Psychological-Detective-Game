/**
 * Thông số gameplay. Mỗi giá trị ghi nguồn; giá trị "TẠM" là thông số kỹ thuật
 * tài liệu chưa quy định — đổi tại đây, không rải số cứng trong code.
 */

/** Project.docx §3.3: khởi điểm 100, không âm. */
export const CREDIBILITY = Object.freeze({
  START: 100,
  MIN: 0,
  // §3.3: ΔP "thường từ 15 đến 30" tùy độ khó — CHỈ để tham khảo, không tự gán cho câu hỏi.
  // PENDING(ISS-15): bảng ΔP từng câu.
  TYPICAL_PENALTY_RANGE: Object.freeze([15, 30]),
})

/** Project.docx §5.2: auto save mỗi 5 phút hoặc khi có sự kiện quan trọng. */
export const AUTOSAVE = Object.freeze({
  INTERVAL_MS: 5 * 60 * 1000,
  REASONS: Object.freeze({
    INTERVAL: 'interval',
    MANUAL: 'manual',
    EVIDENCE_COLLECTED: 'evidence-collected',
  }),
})

/** TẠM — tài liệu chưa quy định tốc độ chữ chạy (§3.2 chỉ nêu dùng time.addEvent). */
export const TYPEWRITER = Object.freeze({
  CHAR_DELAY_MS: 30,
  /** Thiết lập "Tốc độ chữ" (DEC-012). 0 = hiện ngay cả câu. "normal" = CHAR_DELAY_MS. */
  SPEED_DELAYS_MS: Object.freeze({ slow: 50, normal: 30, fast: 15, instant: 0 }),
  /** Thiết lập "Tự động chuyển thoại": chờ bao lâu sau khi chữ hiện hết. TẠM. */
  AUTO_ADVANCE_DELAY_MS: 1500,
})

/** TẠM — cỡ chữ thân khung hội thoại theo thiết lập "Cỡ chữ hội thoại" (DEC-012), đơn vị px. */
export const DIALOGUE_FONT_SIZES = Object.freeze({ medium: 22, large: 26 })

/** Chương mở đầu khi New Game (Capstone 1 = Chương 1, §6.1). */
export const FIRST_CHAPTER = 1
