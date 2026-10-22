import { hasClearLine, isFootClear } from './walkArea'

/**
 * Tìm đường khi người chơi bấm chuột lên sàn (DEC-013): lưới ô vuông + A* 8 hướng, không cắt góc
 * qua vật cản, rồi làm mượt bằng kiểm tra đường thẳng. Logic thuần -> test được.
 */

/** Kích thước ô lưới (px) — TẠM. */
export const GRID_CELL = 16

/**
 * Dựng lưới ô đi được từ vùng sàn. Ô đi được = bàn chân đặt tại TÂM ô không chạm tường/vật cản.
 * @param {{ walkArea: number[][], obstacles?: number[][][] }} area
 * @param {(point: number[]) => { rx: number, ry: number }} footAt
 */
export function buildGrid(area, footAt, cell = GRID_CELL, width = 1280, height = 720) {
  const cols = Math.ceil(width / cell)
  const rows = Math.ceil(height / cell)
  const open = new Uint8Array(cols * rows)
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const center = [c * cell + cell / 2, r * cell + cell / 2]
      open[r * cols + c] = isFootClear(area, center, footAt(center)) ? 1 : 0
    }
  }
  return { cell, cols, rows, open }
}

function cellOf(grid, { x, y }) {
  return {
    c: Math.min(grid.cols - 1, Math.max(0, Math.floor(x / grid.cell))),
    r: Math.min(grid.rows - 1, Math.max(0, Math.floor(y / grid.cell))),
  }
}

function isOpen(grid, c, r) {
  return c >= 0 && r >= 0 && c < grid.cols && r < grid.rows && grid.open[r * grid.cols + c] === 1
}

function centerOf(grid, c, r) {
  return { x: c * grid.cell + grid.cell / 2, y: r * grid.cell + grid.cell / 2 }
}

/** Ô mở gần nhất (tìm vòng vuông nở dần). */
function nearestOpenCell(grid, start) {
  if (isOpen(grid, start.c, start.r)) return start
  const maxRing = Math.max(grid.cols, grid.rows)
  for (let ring = 1; ring < maxRing; ring += 1) {
    let best = null
    let bestDistance = Infinity
    for (let dr = -ring; dr <= ring; dr += 1) {
      for (let dc = -ring; dc <= ring; dc += 1) {
        if (Math.max(Math.abs(dr), Math.abs(dc)) !== ring) continue
        const c = start.c + dc
        const r = start.r + dr
        if (!isOpen(grid, c, r)) continue
        const d = dc * dc + dr * dr
        if (d < bestDistance) {
          best = { c, r }
          bestDistance = d
        }
      }
    }
    if (best) return best
  }
  return null
}

const NEIGHBORS = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
]

/**
 * A* trên lưới. Đích bị chặn -> đi tới ô mở gần đích nhất.
 * @returns {{ x: number, y: number }[] | null} danh sách điểm (không gồm điểm xuất phát)
 */
export function findPath(grid, from, to) {
  const start = nearestOpenCell(grid, cellOf(grid, from))
  const goal = nearestOpenCell(grid, cellOf(grid, to))
  if (!start || !goal) return null
  const key = (c, r) => r * grid.cols + c
  const startKey = key(start.c, start.r)
  const goalKey = key(goal.c, goal.r)
  const heuristic = (c, r) => Math.hypot(goal.c - c, goal.r - r)

  const gScore = new Map([[startKey, 0]])
  const cameFrom = new Map()
  const open = new Map([[startKey, heuristic(start.c, start.r)]])
  const closed = new Set()

  while (open.size > 0) {
    let currentKey = null
    let currentF = Infinity
    for (const [k, f] of open) {
      if (f < currentF) {
        currentF = f
        currentKey = k
      }
    }
    if (currentKey === goalKey) break
    open.delete(currentKey)
    closed.add(currentKey)
    const c = currentKey % grid.cols
    const r = Math.floor(currentKey / grid.cols)

    for (const [dc, dr, cost] of NEIGHBORS) {
      const nc = c + dc
      const nr = r + dr
      if (!isOpen(grid, nc, nr)) continue
      // Không cắt góc: đi chéo cần cả 2 ô kề cạnh đều mở
      if (dc !== 0 && dr !== 0 && (!isOpen(grid, c + dc, r) || !isOpen(grid, c, r + dr))) continue
      const nKey = key(nc, nr)
      if (closed.has(nKey)) continue
      const tentative = gScore.get(currentKey) + cost
      if (tentative < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, currentKey)
        gScore.set(nKey, tentative)
        open.set(nKey, tentative + heuristic(nc, nr))
      }
    }
  }

  if (!gScore.has(goalKey)) return null
  const cells = []
  for (let k = goalKey; k !== startKey; k = cameFrom.get(k)) {
    cells.push(centerOf(grid, k % grid.cols, Math.floor(k / grid.cols)))
  }
  cells.reverse()
  return cells
}

/**
 * Bỏ các điểm trung gian khi đi thẳng được (đường đi bớt răng cưa). Điểm cuối được thay bằng
 * `target` nếu target đứng được và nối thẳng được từ điểm trước nó.
 */
export function smoothPath(area, from, path, footAt, target = null) {
  if (!path || path.length === 0) return path
  const points = [...path]
  if (target && isFootClear(area, [target.x, target.y], footAt([target.x, target.y]))) {
    const beforeLast = points.length > 1 ? points[points.length - 2] : from
    if (hasClearLine(area, beforeLast, target, footAt)) points[points.length - 1] = target
  }
  const result = []
  let anchor = from
  let i = 0
  while (i < points.length) {
    let furthest = i
    for (let j = points.length - 1; j > i; j -= 1) {
      if (hasClearLine(area, anchor, points[j], footAt)) {
        furthest = j
        break
      }
    }
    result.push(points[furthest])
    anchor = points[furthest]
    i = furthest + 1
  }
  return result
}
