/**
 * Phối cảnh 2.5D (DEC-013): nhân vật càng gần camera (y chân lớn) càng to và đi nhanh hơn trên màn hình.
 * Nội suy tuyến tính giữa 2 mốc của phòng: { nearY, nearHeight, farY, farHeight } (data/rooms/*.js).
 * Logic thuần -> test được.
 */

/** Chiều cao nhân vật (px) khi chân ở `y`. Ngoài khoảng 2 mốc vẫn nội suy (không kẹp) cho mượt. */
export function heightAt(depth, y) {
  const { nearY, nearHeight, farY, farHeight } = depth
  if (nearY === farY) return nearHeight
  const t = (y - farY) / (nearY - farY)
  return Math.max(1, farHeight + (nearHeight - farHeight) * t)
}

/** Hệ số co giãn sprite: chiều cao mong muốn / chiều cao nhân vật trong khung ảnh gốc. */
export function spriteScaleAt(depth, y, sourceHeight) {
  return heightAt(depth, y) / sourceHeight
}

/** Hệ số tốc độ so với mốc gần (1 = tốc độ đầy đủ ở mốc gần). */
export function speedFactorAt(depth, y) {
  return heightAt(depth, y) / depth.nearHeight
}

/**
 * Bàn chân dùng cho va chạm: elip rộng ~18% chiều cao người, dẹt theo phối cảnh sàn.
 * TẠM — tinh chỉnh khi chơi thử.
 */
export function footAt(depth, y) {
  const height = heightAt(depth, y)
  return { rx: height * 0.09, ry: height * 0.025 }
}
