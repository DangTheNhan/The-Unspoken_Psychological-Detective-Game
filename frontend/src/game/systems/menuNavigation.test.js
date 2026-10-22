import { describe, expect, it } from 'vitest'
import { ensureValidSelection, firstEnabled, stepSelection } from './menuNavigation'

describe('menuNavigation', () => {
  it('đi xuống / lên và vòng tròn', () => {
    const all = [true, true, true]
    expect(stepSelection(all, 0, 1)).toBe(1)
    expect(stepSelection(all, 2, 1)).toBe(0)
    expect(stepSelection(all, 0, -1)).toBe(2)
  })

  it('bỏ qua mục bị khóa (chưa có bản lưu)', () => {
    const noSave = [true, false, true]
    expect(stepSelection(noSave, 0, 1)).toBe(2)
    expect(stepSelection(noSave, 2, -1)).toBe(0)
  })

  it('không có mục nào bấm được -> -1', () => {
    expect(stepSelection([false, false], 0, 1)).toBe(-1)
    expect(stepSelection([], 0, 1)).toBe(-1)
    expect(firstEnabled([false, false])).toBe(-1)
  })

  it('chưa chọn (-1) -> đi xuống chọn mục đầu', () => {
    expect(stepSelection([true, true], -1, 1)).toBe(0)
  })

  it('ensureValidSelection chuyển khỏi mục vừa bị khóa', () => {
    expect(ensureValidSelection([true, false, true], 1)).toBe(0)
    expect(ensureValidSelection([true, true, true], 1)).toBe(1)
  })
})
