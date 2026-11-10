import { describe, expect, it } from 'vitest'
import { footAt, heightAt } from '../../systems/depthScale'
import { buildGrid, findPath } from '../../systems/pathfinding'
import { isFootClear } from '../../systems/walkArea'
import { HALLWAY } from './hallway'
import { ROOM_201 } from './room201'

const foot = ([, y]) => footAt(HALLWAY.depth, y)
const clear = (x, y) => isFootClear(HALLWAY, [x, y], foot([x, y]))

describe('hành lang tầng 2 (T-024)', () => {
  it('không bước xuống giếng cầu thang, không đi xuyên lan can hay tường sau', () => {
    expect(clear(640, 560)).toBe(false) // giữa giếng cầu thang
    expect(clear(700, 490)).toBe(false) // ngay trước lan can sau (phía giếng)
    expect(clear(640, 430)).toBe(false) // trong tường sau / cửa A204
    expect(clear(80, 600)).toBe(false) // chân tường trái
  })

  it('đi từ cửa A201 ra tới chiếu nghỉ sau lan can (trước A204) và tới đầu cầu thang', () => {
    const grid = buildGrid(HALLWAY, foot)
    const a201 = HALLWAY.entrances.room201
    expect(Array.isArray(findPath(grid, a201, { x: 629, y: 460 }))).toBe(true)
    expect(Array.isArray(findPath(grid, a201, { x: 938, y: 460 }))).toBe(true)
  })

  it('kiểu DEC-014: không xuống sát camera (y ≤ 624) và cao tối đa 330 px như phòng 201', () => {
    expect(HALLWAY.walkArea.every(([, y]) => y <= 624)).toBe(true)
    expect(clear(300, 680)).toBe(false)
    expect(heightAt(HALLWAY.depth, 624)).toBe(330)
    expect(ROOM_201.depth.nearHeight).toBe(330)
  })

  it('cửa A201 <-> cửa phòng 201 nối hai chiều', () => {
    const a201 = HALLWAY.hotspots.find((h) => h.id === 'HALL_A201')
    const door201 = ROOM_201.hotspots.find((h) => h.id === 'R201_DOOR')
    expect(a201.target.roomId).toBe(ROOM_201.id)
    expect(door201.target.roomId).toBe(HALLWAY.id)
  })

  it('lan can luôn che (không baseY); chậu cây xếp theo đáy chậu nằm trong khung ảnh', () => {
    const [railing, ...plants] = HALLWAY.occluders
    expect(railing.baseY).toBeUndefined()
    for (const plant of plants) {
      expect(plant.baseY).toBeGreaterThan(plant.y)
      expect(plant.baseY).toBeLessThanOrEqual(Math.ceil(plant.y + plant.height))
    }
  })
})
