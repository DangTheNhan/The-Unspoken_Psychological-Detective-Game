import { describe, expect, it } from 'vitest'
import { appearanceFor, facingFromVector } from './facing'

describe('facing', () => {
  it('hướng theo vector, ưu tiên ngang khi đi chéo', () => {
    expect(facingFromVector(-1, 0)).toBe('left')
    expect(facingFromVector(1, 1)).toBe('right')
    expect(facingFromVector(0, -1)).toBe('up')
    expect(facingFromVector(0.2, 1)).toBe('down')
  })

  it('đứng yên giữ hướng cũ', () => {
    expect(facingFromVector(0, 0, 'up')).toBe('up')
  })

  it('đi sang phải = lật gương chu kỳ đi sang trái', () => {
    expect(appearanceFor('right', true)).toEqual({
      anim: 'detective-walk-side',
      frame: null,
      flipX: true,
      bob: false,
    })
    expect(appearanceFor('left', true).flipX).toBe(false)
  })

  it('đi dọc dùng tư thế đứng + nhún (chờ ảnh đi lên/xuống)', () => {
    expect(appearanceFor('up', true)).toEqual({
      anim: null,
      frame: 'idle-back',
      flipX: false,
      bob: true,
    })
    expect(appearanceFor('down', false).frame).toBe('idle-front')
  })
})
