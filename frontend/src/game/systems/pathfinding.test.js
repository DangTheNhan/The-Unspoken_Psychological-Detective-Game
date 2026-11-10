import { describe, expect, it } from 'vitest'
import { buildGrid, findPath, smoothPath } from './pathfinding'
import { hasClearLine, isFootClear } from './walkArea'

/** Phòng thử 200×100 có bức vách giữa chừa khe dưới cùng (x 90..110, y 0..80). */
const AREA = {
  walkArea: [
    [0, 0],
    [200, 0],
    [200, 100],
    [0, 100],
  ],
  obstacles: [
    [
      [90, 0],
      [110, 0],
      [110, 80],
      [90, 80],
    ],
  ],
}
const FOOT = () => ({ rx: 3, ry: 2 })
const grid = buildGrid(AREA, FOOT, 8, 200, 100)

describe('pathfinding', () => {
  it('đi vòng qua vách, mọi đoạn không xuyên vật cản', () => {
    const from = { x: 20, y: 20 }
    const to = { x: 180, y: 20 }
    const path = smoothPath(AREA, from, findPath(grid, from, to), FOOT, to)
    expect(path.length > 1).toBe(true)
    let prev = from
    for (const p of path) {
      expect(hasClearLine(AREA, prev, p, FOOT)).toBe(true)
      prev = p
    }
    const last = path[path.length - 1]
    expect(Math.hypot(last.x - to.x, last.y - to.y) < 1).toBe(true)
    // phải đi xuống khe dưới vách
    expect(path.some((p) => p.y > 80)).toBe(true)
  })

  it('đích nằm trong vật cản -> dừng ở ô đi được gần nhất', () => {
    const path = findPath(grid, { x: 20, y: 20 }, { x: 100, y: 40 })
    const last = path[path.length - 1]
    expect(isFootClear(AREA, [last.x, last.y], FOOT())).toBe(true)
  })

  it('không có lối -> null', () => {
    const closed = buildGrid(
      {
        ...AREA,
        obstacles: [
          [
            [90, 0],
            [110, 0],
            [110, 100],
            [90, 100],
          ],
        ],
      },
      FOOT,
      8,
      200,
      100,
    )
    expect(findPath(closed, { x: 20, y: 20 }, { x: 180, y: 20 })).toBe(null)
  })
})
