/**
 * Lời hiện ra khi người chơi XEM một đồ vật trong phòng (DEC-013 Q-R3: nhóm tự điền, AI không viết).
 *
 * File nội dung: public/assets/dialogues/<phòng>-inspect.json (vd room201-inspect.json), dạng:
 *   {
 *     "_huong_dan": "…",                       // khóa bắt đầu bằng "_" bị bỏ qua
 *     "R201_BOARD": ["Câu thứ nhất.", "Câu thứ hai."],
 *     "R201_DESK": []                           // mảng rỗng = chưa có -> game hiện "[Chờ nội dung]"
 *   }
 * Mỗi chuỗi là một khung thoại; người chơi nhấn E / Space / Enter / bấm chuột để sang câu sau.
 * Lời thoại KHÔNG dịch (DEC-012) — chỉ viết tiếng Việt.
 */

/**
 * @param {unknown} content JSON đã nạp (có thể thiếu/hỏng)
 * @param {string} hotspotId vd 'R201_BOARD'
 * @returns {string[]} các câu hợp lệ (bỏ chuỗi rỗng / không phải chuỗi); [] nếu chưa có
 */
export function getInspectLines(content, hotspotId) {
  if (!content || typeof content !== 'object' || hotspotId.startsWith('_')) return []
  const lines = content[hotspotId]
  if (!Array.isArray(lines)) return []
  return lines.filter((line) => typeof line === 'string' && line.trim().length > 0)
}
