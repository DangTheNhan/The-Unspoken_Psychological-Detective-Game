/**
 * Vùng đi được trong phòng 2.5D (DEC-013) — logic thuần, không Phaser -> test được.
 * Tường phòng chéo theo phối cảnh nên KHÔNG dùng hộp vật lý vuông; thay vào đó:
 *   - area.walkArea: đa giác sàn đi được [[x, y], ...]
 *   - area.obstacles: danh sách đa giác chân đồ đạc (không được đi vào)
 * Nhân vật va chạm bằng "bàn chân" = elip nhỏ quanh điểm chân (foot = { rx, ry }).
 */

/** Bước tối đa mỗi lần thử (px) — tránh "nhảy" qua vật cản mỏng khi khung hình bị giật. */
export const MAX_SUBSTEP = 4

/** Điểm có nằm trong đa giác không (ray casting; điểm đúng trên cạnh có thể ra một trong hai phía). */
export function pointInPolygon([px, py], polygon) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]
    const crosses = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    if (crosses) inside = !inside
  }
  return inside
}

/** Một điểm đơn lẻ có đứng được không: trong sàn và ngoài mọi vật cản. */
export function isWalkablePoint(area, point) {
  if (!pointInPolygon(point, area.walkArea)) return false
  return !(area.obstacles ?? []).some((obstacle) => pointInPolygon(point, obstacle))
}

/** 8 điểm trên viền elip bàn chân + tâm. */
function footSamples([x, y], { rx, ry }) {
  const samples = [[x, y]]
  for (let i = 0; i < 8; i += 1) {
    const angle = (i * Math.PI) / 4
    samples.push([x + Math.cos(angle) * rx, y + Math.sin(angle) * ry])
  }
  return samples
}

/** Cả bàn chân (elip) có nằm trọn trong vùng đi được không. */
export function isFootClear(area, point, foot) {
  return footSamples(point, foot).every((sample) => isWalkablePoint(area, sample))
}

/**
 * Di chuyển từ `position` thêm (dx, dy), có trượt dọc tường:
 * chia thành các bước nhỏ ≤ MAX_SUBSTEP; mỗi bước thử đi cả hai trục, không được thì thử riêng X,
 * rồi riêng Y; cả hai đều chặn -> dừng.
 * @param {(point: number[]) => { rx: number, ry: number }} footAt bàn chân theo vị trí (phối cảnh)
 * @returns {{ x: number, y: number, blocked: boolean }}
 */
export function moveWithSlide(area, position, dx, dy, footAt) {
  const distance = Math.hypot(dx, dy)
  const steps = Math.max(1, Math.ceil(distance / MAX_SUBSTEP))
  const stepX = dx / steps
  const stepY = dy / steps
  let x = position.x
  let y = position.y
  let blocked = false

  for (let i = 0; i < steps; i += 1) {
    const tryMove = (nx, ny) => isFootClear(area, [nx, ny], footAt([nx, ny]))
    if (tryMove(x + stepX, y + stepY)) {
      x += stepX
      y += stepY
    } else if (stepX !== 0 && tryMove(x + stepX, y)) {
      x += stepX
      blocked = true
    } else if (stepY !== 0 && tryMove(x, y + stepY)) {
      y += stepY
      blocked = true
    } else {
      blocked = true
      break
    }
  }
  return { x, y, blocked }
}

/**
 * Điểm đi được gần `point` nhất (tìm theo vòng tròn nở dần). Dùng khi bấm chuột lên đồ đạc
 * hoặc khi dữ liệu đặt nhân vật lỡ nằm trong vật cản.
 * @returns {{ x: number, y: number } | null}
 */
export function nearestClearPoint(area, point, footAt, { step = 4, maxRadius = 400 } = {}) {
  const [px, py] = point
  if (isFootClear(area, point, footAt(point))) return { x: px, y: py }
  for (let radius = step; radius <= maxRadius; radius += step) {
    const samples = Math.max(8, Math.round((2 * Math.PI * radius) / step))
    let best = null
    for (let i = 0; i < samples; i += 1) {
      const angle = (i / samples) * Math.PI * 2
      const candidate = [px + Math.cos(angle) * radius, py + Math.sin(angle) * radius]
      if (isFootClear(area, candidate, footAt(candidate))) {
        best = { x: candidate[0], y: candidate[1] }
        break
      }
    }
    if (best) return best
  }
  return null
}

/** Đoạn thẳng a -> b có đi thẳng được không (lấy mẫu mỗi `step` px). */
export function hasClearLine(area, a, b, footAt, step = 4) {
  const distance = Math.hypot(b.x - a.x, b.y - a.y)
  const steps = Math.max(1, Math.ceil(distance / step))
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps
    const p = [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t]
    if (!isFootClear(area, p, footAt(p))) return false
  }
  return true
}
