import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEYS } from '@/shared/storage/storageKeys'
import { persistProgress, readLocalBackup } from './saveService'

const key = STORAGE_KEYS.LOCAL_SAVE_BACKUP
const snapshot = { currentChapter: 1, credibilityScore: 85, saveDataJson: '{"notebook":{}}' }
let values

beforeEach(() => {
  values = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  })
})

afterEach(() => vi.unstubAllGlobals())

describe('bản lưu thuộc tài khoản hiện tại', () => {
  it('người mới không nhận bản lưu chung cũ hoặc bản lưu của người khác', () => {
    values.set(key, JSON.stringify(snapshot))
    values.set(`${key}.old-player`, JSON.stringify(snapshot))
    expect(readLocalBackup('new-player')).toBeNull()
    expect(readLocalBackup()).toBeNull()
    expect(readLocalBackup('old-player')).toEqual(snapshot)
    expect(values.has(key)).toBe(true)
  })

  it('lưu, đọc lại riêng theo tài khoản và không ghi đè dữ liệu tài khoản khác', async () => {
    values.set(`${key}.old-player`, JSON.stringify(snapshot))
    const next = { ...snapshot, credibilityScore: 100 }
    await persistProgress(next, { username: 'Thám tử mới', reason: 'manual' })
    expect(readLocalBackup('Thám tử mới')).toMatchObject(next)
    expect(values.has(`${key}.${encodeURIComponent('Thám tử mới')}`)).toBe(true)
    expect(readLocalBackup('old-player')).toEqual(snapshot)
    expect(readLocalBackup('another-player')).toBeNull()
    expect(values.has(key)).toBe(false)
  })

  it('thiếu danh tính không tạo thêm bản lưu chung', async () => {
    await expect(persistProgress(snapshot)).rejects.toThrow('Không xác định được tài khoản')
    expect(values.size).toBe(0)
  })
})
