import { describe, expect, it } from 'vitest'
import {
  TUTORIAL_EVENTS as E,
  advanceTutorial,
  canExit,
  createTutorialState,
  normalizeTutorialState,
} from './tutorial'

describe('tutorial phòng 201', () => {
  it('đi đúng thứ tự move -> interact -> notebook -> exit -> done', () => {
    let s = createTutorialState()
    expect(s.step).toBe('move')
    s = advanceTutorial(s, E.REACHED_MARKER)
    expect(s.step).toBe('interact')
    s = advanceTutorial(s, E.INSPECTED)
    expect(s.step).toBe('notebook')
    s = advanceTutorial(s, E.NOTEBOOK_CLOSED)
    expect(s.step).toBe('exit')
    expect(canExit(s)).toBe(true)
    s = advanceTutorial(s, E.EXITED)
    expect(s).toEqual({ step: null, status: 'done' })
  })

  it('sự kiện sai bước thì không đổi', () => {
    const s = createTutorialState()
    expect(advanceTutorial(s, E.INSPECTED)).toBe(s)
    expect(canExit(s)).toBe(false)
  })

  it('bỏ qua bất kỳ lúc nào', () => {
    const s = advanceTutorial(createTutorialState(), E.SKIPPED)
    expect(s.status).toBe('skipped')
    expect(canExit(s)).toBe(true)
    expect(advanceTutorial(s, E.REACHED_MARKER)).toBe(s)
  })

  it('đọc từ file lưu hỏng -> trạng thái hợp lệ', () => {
    expect(normalizeTutorialState(null)).toEqual(createTutorialState())
    expect(normalizeTutorialState({ step: 'xyz' })).toEqual(createTutorialState())
    expect(normalizeTutorialState({ status: 'done' }).status).toBe('done')
    expect(normalizeTutorialState({ step: 'notebook', status: 'active' }).step).toBe('notebook')
  })
})
