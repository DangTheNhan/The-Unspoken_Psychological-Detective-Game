import { expect, it } from 'vitest'
import { ROOM_201 } from './room201'
import { ROOM_204, ROOM_204_HOTSPOTS } from './room204'
import { footAt, heightAt, speedFactorAt } from '../../systems/depthScale'
import { buildGrid, findPath, smoothPath } from '../../systems/pathfinding'
import { hasClearLine, isFootClear, moveWithSlide, nearestClearPoint } from '../../systems/walkArea'

const foot = ([, y]) => footAt(ROOM_204.depth, y)
const clear = (point) => isFootClear(ROOM_204, point, foot(point))
const stands = [
  ROOM_204.spawn,
  ...Object.values(ROOM_204_HOTSPOTS).map(({ stand: [x, y] }) => ({ x, y })),
]

it('fits the door and body while keeping room 201 and the relative walking speed unchanged', () => {
  for (const y of [532, 550, 587, 605, 615])
    expect(speedFactorAt(ROOM_204.depth, y)).toBeCloseTo(speedFactorAt(ROOM_201.depth, y), 8)
  const doorRatio =
    heightAt(ROOM_204.depth, ROOM_204_HOTSPOTS.HP_LOCK.stand[1]) /
    ROOM_204_HOTSPOTS.P2_EXIT_CHECK.rect[3]
  expect(doorRatio).toBeGreaterThan(0.8)
  expect(doorRatio).toBeLessThan(0.9)
  const body = ROOM_204.obstacles[0]
  const bodyLength = Math.hypot(
    Math.max(...body.map(([x]) => x)) - Math.min(...body.map(([x]) => x)),
    Math.max(...body.map(([, y]) => y)) - Math.min(...body.map(([, y]) => y)),
  )
  const besideBody = heightAt(ROOM_204.depth, ROOM_204_HOTSPOTS.HP_NECK.stand[1])
  expect(besideBody).toBeGreaterThanOrEqual(bodyLength)
  expect(besideBody).toBeLessThan(bodyLength * 1.15)
  expect(ROOM_201.depth.nearHeight).toBe(330)
  expect(ROOM_204.walkArea.every(([, y]) => y <= ROOM_201.depth.nearY)).toBe(true)
  expect(clear([640, 640])).toBe(false)
  expect(clear([830, 544])).toBe(false)
})

it('reaches every story hotspot exactly from every stand without a smoothed segment crossing the body or wall', () => {
  const grid = buildGrid(ROOM_204, foot)
  for (const from of stands)
    for (const to of stands) {
      if (from === to) continue
      expect(clear([to.x, to.y])).toBe(true)
      const path = findPath(grid, from, to)
      expect(path).not.toBeNull()
      const smooth = smoothPath(ROOM_204, from, path, foot, to)
      expect(smooth.at(-1)).toMatchObject({ x: to.x, y: to.y })
      let previous = from
      for (const step of smooth) {
        expect(hasClearLine(ROOM_204, previous, step, foot)).toBe(true)
        previous = step
      }
    }
})

it('keeps continuous WASD movement in front of the body instead of tunnelling through it', () => {
  let position = { x: 830, y: 600 }
  let blocked = false
  for (let i = 0; i < 70; i++) {
    const next = moveWithSlide(ROOM_204, position, 0, -4, foot)
    blocked ||= next.blocked
    expect(clear([next.x, next.y])).toBe(true)
    position = next
  }
  expect(blocked).toBe(true)
  expect(position.y).toBeGreaterThan(558)
})

it('recovers old foreground/body save positions to clear reachable floor without changing the saved schema', () => {
  const grid = buildGrid(ROOM_204, foot)
  for (const point of [
    [199, 624],
    [156, 630],
    [640, 650],
    [830, 544],
  ]) {
    const restored = nearestClearPoint(ROOM_204, point, foot)
    expect(restored).not.toBeNull()
    expect(clear([restored.x, restored.y])).toBe(true)
    expect(heightAt(ROOM_204.depth, restored.y)).toBeLessThanOrEqual(ROOM_204.depth.nearHeight)
    for (const to of stands) expect(findPath(grid, restored, to)).not.toBeNull()
  }
})
