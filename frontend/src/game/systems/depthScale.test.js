import { describe, expect, it } from 'vitest'
import { footAt, heightAt, speedFactorAt, spriteScaleAt } from './depthScale'

const DEPTH = { nearY: 690, nearHeight: 560, farY: 474, farHeight: 245 }

describe('depthScale — phối cảnh', () => {
  it('đúng 2 mốc và nội suy ở giữa', () => {
    expect(heightAt(DEPTH, 690)).toBe(560)
    expect(heightAt(DEPTH, 474)).toBe(245)
    expect(Math.round(heightAt(DEPTH, 582))).toBe(403)
  })

  it('xa thì nhỏ và chậm hơn', () => {
    expect(speedFactorAt(DEPTH, 474) < speedFactorAt(DEPTH, 690)).toBe(true)
    expect(speedFactorAt(DEPTH, 690)).toBe(1)
  })

  it('hệ số sprite theo chiều cao khung gốc', () => {
    expect(spriteScaleAt(DEPTH, 690, 560)).toBe(1)
  })

  it('bàn chân co giãn theo độ sâu', () => {
    expect(footAt(DEPTH, 474).rx < footAt(DEPTH, 690).rx).toBe(true)
  })
})
