import { createLogger } from '@/shared/logger/logger'
import { storage } from '@/shared/storage/storage'
import { STORAGE_KEYS } from '@/shared/storage/storageKeys'
import { saveGameProgress } from '../api/gameApi'

const log = createLogger('SaveService')

/**
 * Hybrid Storage — Project.docx §6.3:
 * 1. LUÔN sao lưu bản mới nhất vào localStorage (không phụ thuộc mạng).
 * 2. Đồng bộ lên MySQL qua POST /api/game/save.
 * 3. Mất mạng / server lỗi kết nối -> trả { remote: false, reason: 'offline' }, KHÔNG ném lỗi
 *    (game không được crash, §6.3).
 * PENDING(ISS-18): đồng bộ ngược khi có mạng lại & giải quyết xung đột.
 * PENDING(ISS-29): login không trả userId -> chưa gọi được API save.
 *
 * @param {{ currentChapter: number, credibilityScore: number, saveDataJson: string }} snapshot
 * @param {{ userId?: number|null, username?: string, reason?: string }} context
 */
export async function persistProgress(
  snapshot,
  { userId = null, username, reason = 'unknown' } = {},
) {
  if (!username) throw new Error('Không xác định được tài khoản để lưu tiến trình.')
  const local = storage.set(backupKey(username), {
    ...snapshot,
    reason,
    savedAt: new Date().toISOString(),
  })

  if (userId === null || userId === undefined) {
    if (!local) throw new Error('Không ghi được bản lưu trên trình duyệt.')
    log.warn('Chưa có userId (ISS-29) -> chỉ lưu localStorage')
    return { remote: false, reason: 'missing-user-id' }
  }

  try {
    const data = await saveGameProgress({ userId, ...snapshot })
    log.debug('Đã lưu lên server', reason, data)
    return { remote: true, data }
  } catch (error) {
    if (error.isNetworkError && local) {
      log.warn('Mất kết nối -> chế độ offline, giữ bản localStorage')
      return { remote: false, reason: 'offline' }
    }
    throw error
  }
}

function backupKey(username) {
  return `${STORAGE_KEYS.LOCAL_SAVE_BACKUP}.${encodeURIComponent(username)}`
}

export function readLocalBackup(username) {
  // Bản lưu chung cũ không có chủ sở hữu: không gán nhầm cho tài khoản vừa đăng nhập.
  if (!username) return null
  return storage.get(backupKey(username))
}
