import { describe, expect, it } from 'vitest'
import { footAt } from '../../systems/depthScale'
import { buildGrid, findPath } from '../../systems/pathfinding'
import { isFootClear } from '../../systems/walkArea'
import { ROOM_201 } from './room201'

const foot = ([, y]) => footAt(ROOM_201.depth, y)
const clear = (x, y) => isFootClear(ROOM_201, [x, y], foot([x, y]))

describe('dữ liệu phòng 201 — không kẹt nhân vật', () => {
  it('điểm xuất hiện và vòng sáng tutorial đứng được', () => {
    expect(clear(ROOM_201.spawn.x, ROOM_201.spawn.y)).toBe(true)
    expect(clear(ROOM_201.tutorialMarker.x, ROOM_201.tutorialMarker.y)).toBe(true)
  })

  it('mọi điểm đứng của hotspot đứng được và đi tới được từ điểm xuất hiện (xem thêm rooms.test.js)', () => {
    const grid = buildGrid(ROOM_201, foot)
    for (const hotspot of ROOM_201.hotspots) {
      const [x, y] = hotspot.stand
      expect([hotspot.id, clear(x, y)]).toEqual([hotspot.id, true])
      const path = findPath(grid, ROOM_201.spawn, { x, y })
      expect([hotspot.id, Array.isArray(path)]).toEqual([hotspot.id, true])
    }
  })

  it('mã hotspot không trùng; lời xem đồ vật nằm ở file nội dung riêng (DEC-013 Q-R3)', () => {
    const ids = ROOM_201.hotspots.map((h) => h.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ROOM_201.inspectContent.url).toBe('assets/dialogues/room201-inspect.json')
  })

  it('DEC-014: nhân vật không xuống dải sàn sát camera (y > 615) và không cao quá 330 px', () => {
    expect(ROOM_201.walkArea.every(([, y]) => y <= 615)).toBe(true)
    expect(clear(640, 640)).toBe(false)
    expect(Math.round((footAt(ROOM_201.depth, 615).rx * 2) / 0.18)).toBe(330)
  })
})
