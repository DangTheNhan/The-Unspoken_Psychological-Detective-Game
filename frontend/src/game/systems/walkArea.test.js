import { describe, expect, it } from 'vitest'
import {
  hasClearLine,
  isFootClear,
  isWalkablePoint,
  moveWithSlide,
  nearestClearPoint,
  pointInPolygon,
} from './walkArea'

/** Phòng thử: sàn 0..100 × 0..100, một vật cản vuông 40..60 × 40..60 ở giữa. */
const AREA = {
  walkArea: [
    [0, 0],
    [100, 0],
    [100, 100],
    [0, 100],
  ],
  obstacles: [
    [
      [40, 40],
      [60, 40],
      [60, 60],
      [40, 60],
    ],
  ],
}
const FOOT = () => ({ rx: 2, ry: 1 })

describe('walkArea — điểm và bàn chân', () => {
  it('pointInPolygon', () => {
    expect(pointInPolygon([50, 50], AREA.walkArea)).toBe(true)
    expect(pointInPolygon([150, 50], AREA.walkArea)).toBe(false)
  })

  it('không đứng được trong vật cản hay ngoài sàn', () => {
    expect(isWalkablePoint(AREA, [10, 10])).toBe(true)
    expect(isWalkablePoint(AREA, [50, 50])).toBe(false)
    expect(isWalkablePoint(AREA, [-1, 10])).toBe(false)
  })

  it('bàn chân chạm tường thì không đứng được', () => {
    expect(isFootClear(AREA, [10, 10], FOOT())).toBe(true)
    expect(isFootClear(AREA, [1, 10], FOOT())).toBe(false)
    expect(isFootClear(AREA, [39, 50], FOOT())).toBe(false)
  })
})

describe('walkArea — di chuyển có trượt tường', () => {
  it('đi tự do khi không vướng', () => {
    const r = moveWithSlide(AREA, { x: 10, y: 10 }, 20, 0, FOOT)
    expect(Math.round(r.x)).toBe(30)
    expect(r.blocked).toBe(false)
  })

  it('không xuyên tường ngoài', () => {
    const r = moveWithSlide(AREA, { x: 10, y: 10 }, -50, 0, FOOT)
    expect(r.x >= 2).toBe(true)
    expect(r.blocked).toBe(true)
  })

  it('không xuyên vật cản dù bước rất dài (máy giật)', () => {
    const r = moveWithSlide(AREA, { x: 20, y: 50 }, 70, 0, FOOT)
    expect(r.x < 40).toBe(true)
  })

  it('đi chéo vào tường thì trượt dọc tường', () => {
    const r = moveWithSlide(AREA, { x: 10, y: 3 }, 10, -10, FOOT)
    expect(Math.round(r.x)).toBe(20)
    expect(r.y >= 1).toBe(true)
  })
})

describe('walkArea — điểm gần nhất và đường thẳng', () => {
  it('bấm vào vật cản -> điểm đứng được gần nhất', () => {
    const p = nearestClearPoint(AREA, [50, 50], FOOT)
    expect(isFootClear(AREA, [p.x, p.y], FOOT())).toBe(true)
  })

  it('đường thẳng xuyên vật cản bị chặn', () => {
    expect(hasClearLine(AREA, { x: 10, y: 50 }, { x: 90, y: 50 }, FOOT)).toBe(false)
    expect(hasClearLine(AREA, { x: 10, y: 10 }, { x: 90, y: 10 }, FOOT)).toBe(true)
  })
})
