/**
 * Điều hướng danh sách mục bằng phím ↑ ↓ (menu chính, hộp xác nhận…). Logic thuần -> test được.
 * Mục bị khóa (enabled = false, ví dụ "Tiếp tục điều tra" khi chưa có bản lưu) bị bỏ qua; đi vòng tròn.
 */

/**
 * @param {boolean[]} enabled trạng thái từng mục
 * @param {number} current chỉ số đang chọn (-1 = chưa chọn)
 * @param {1|-1} direction 1 = xuống, -1 = lên
 * @returns {number} chỉ số mới, -1 nếu không có mục nào bấm được
 */
export function stepSelection(enabled, current, direction) {
  const count = enabled.length
  if (count === 0) return -1
  let index = current
  for (let tries = 0; tries < count; tries += 1) {
    index = (((index + direction) % count) + count) % count
    if (enabled[index]) return index
  }
  return -1
}

/** Mục đầu tiên bấm được, -1 nếu không có. */
export function firstEnabled(enabled) {
  return enabled.findIndex(Boolean)
}

/** Giữ lựa chọn hiện tại nếu còn bấm được, nếu không chuyển về mục đầu tiên bấm được. */
export function ensureValidSelection(enabled, current) {
  return enabled[current] ? current : firstEnabled(enabled)
}
