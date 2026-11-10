import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from '../systems/settings'
import { SETTINGS_STORAGE_KEY, createSettingsStore } from './settingsStore'

/** localStorage giả trong bộ nhớ. */
function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    data,
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  }
}

/** localStorage bị chặn: mọi thao tác đều ném lỗi. */
const blockedStorage = {
  getItem() {
    throw new Error('SecurityError')
  },
  setItem() {
    throw new Error('QuotaExceededError')
  },
}

describe('settingsStore', () => {
  it('khóa localStorage theo kế hoạch DEC-012', () => {
    expect(SETTINGS_STORAGE_KEY).toBe('theUnspoken.settings.v1')
  })

  it('chưa có dữ liệu -> mặc định', () => {
    expect(createSettingsStore({ storage: createMemoryStorage() }).get()).toEqual(DEFAULT_SETTINGS)
  })

  it('đọc lại thiết lập đã lưu (đã chuẩn hóa)', () => {
    const storage = createMemoryStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({ language: 'en', masterVolume: 33, junk: 1 }),
    })
    const settings = createSettingsStore({ storage }).get()
    expect(settings.language).toBe('en')
    expect(settings.masterVolume).toBe(35)
    expect('junk' in settings).toBe(false)
  })

  it('JSON hỏng -> mặc định, không ném lỗi', () => {
    const storage = createMemoryStorage({ [SETTINGS_STORAGE_KEY]: '{oops' })
    expect(createSettingsStore({ storage }).get()).toEqual(DEFAULT_SETTINGS)
  })

  it('set ghi xuống storage và gọi onChange', () => {
    const storage = createMemoryStorage()
    const changes = []
    const store = createSettingsStore({ storage, onChange: (s) => changes.push(s) })
    const ok = store.set({ ...store.get(), muteAll: true })
    expect(ok).toBe(true)
    expect(JSON.parse(storage.data.get(SETTINGS_STORAGE_KEY)).muteAll).toBe(true)
    expect(changes.length).toBe(1)
    expect(changes[0].muteAll).toBe(true)
  })

  it('get trả bản sao — sửa bản sao không đổi kho', () => {
    const store = createSettingsStore({ storage: createMemoryStorage() })
    const copy = store.get()
    copy.language = 'en'
    expect(store.get().language).toBe('vi')
  })

  it('localStorage bị chặn -> vẫn chạy bằng bộ nhớ, set trả false', () => {
    const store = createSettingsStore({ storage: blockedStorage })
    expect(store.get()).toEqual(DEFAULT_SETTINGS)
    expect(store.set({ ...store.get(), language: 'en' })).toBe(false)
    expect(store.get().language).toBe('en')
  })

  it('không có localStorage (null) -> mặc định', () => {
    const store = createSettingsStore({ storage: null })
    expect(store.get()).toEqual(DEFAULT_SETTINGS)
    expect(store.set(DEFAULT_SETTINGS)).toBe(false)
  })
})
