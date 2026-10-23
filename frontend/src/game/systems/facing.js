/**
 * Hướng nhìn + hoạt ảnh của nhân vật theo vector di chuyển (DEC-013). Logic thuần.
 *
 * Asset hiện có: chu kỳ đi NGANG (6 hình, nhìn sang trái; sang phải = lật gương) + 4 tư thế đứng.
 * CHƯA có chu kỳ đi lên/xuống (Q-R5 — bổ sung sau): đi dọc dùng tư thế đứng trước/sau + nhún nhẹ.
 */
export const FACINGS = Object.freeze(['left', 'right', 'up', 'down'])

/**
 * @param {number} dx
 * @param {number} dy
 * @param {string} previous hướng cũ — giữ nguyên khi đứng yên
 * @returns {'left'|'right'|'up'|'down'}
 */
export function facingFromVector(dx, dy, previous = 'down') {
  if (dx === 0 && dy === 0) return previous
  // Ưu tiên hướng ngang khi đi chéo: có chu kỳ bước chân đầy đủ, trông tự nhiên hơn
  if (Math.abs(dx) >= Math.abs(dy) * 0.6) return dx < 0 ? 'left' : 'right'
  return dy < 0 ? 'up' : 'down'
}

/**
 * Chọn khung/hoạt ảnh hiển thị.
 * @returns {{ anim: string|null, frame: string|null, flipX: boolean, bob: boolean }}
 *   anim  — key hoạt ảnh đang chạy (null = khung tĩnh `frame`)
 *   bob   — nhún nhẹ khi đi dọc (thay cho chu kỳ đi lên/xuống còn thiếu)
 */
export function appearanceFor(facing, moving) {
  if (facing === 'left' || facing === 'right') {
    return moving
      ? { anim: 'detective-walk-side', frame: null, flipX: facing === 'right', bob: false }
      : { anim: null, frame: `idle-${facing}`, flipX: false, bob: false }
  }
  const frame = facing === 'up' ? 'idle-back' : 'idle-front'
  return { anim: null, frame, flipX: false, bob: moving }
}
