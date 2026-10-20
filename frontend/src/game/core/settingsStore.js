import { createLogger } from '@/shared/logger/logger'
import { normalizeSettings } from '../systems/settings'

const log = createLogger('SettingsStore')

/**
 * Khóa localStorage của thiết lập người chơi (DEC-012). Khai báo ở đây vì `game/` không được
 * import `shared/storage` (docs/ARCHITECTURE.md mục 2); `shared/storage/storageKeys.js` có ghi chú
 * trỏ về khóa này để tránh trùng tên. Đổi cấu trúc dữ liệu -> tăng hậu tố v1 -> v2.
 */
export const SETTINGS_STORAGE_KEY = 'theUnspoken.settings.v1'

function defaultStorage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null // một số trình duyệt ném lỗi ngay khi truy cập localStorage (chặn cookie)
  }
}

/**
 * Kho thiết lập: đọc 1 lần khi tạo, giữ trong bộ nhớ, ghi lại khi đổi.
 * localStorage bị chặn / đầy / dữ liệu hỏng -> KHÔNG ném lỗi, dùng mặc định (game vẫn chạy).
 * @param {{ storage?: Storage|null, onChange?: (settings: object) => void }} [options]
 *   storage  — test truyền bộ nhớ giả; mặc định localStorage
 *   onChange — gọi sau mỗi lần set (runtime nối vào EventBus SETTINGS_CHANGED)
 */
export function createSettingsStore({ storage = defaultStorage(), onChange = () => {} } = {}) {
  let current = normalizeSettings(read(storage))

  return {
    /** Bản sao — sửa object trả về không làm đổi thiết lập. */
    get() {
      return { ...current }
    },
    /** Lưu thiết lập mới (được chuẩn hóa). Trả về true nếu ghi được xuống localStorage. */
    set(next) {
      current = normalizeSettings(next)
      const persisted = write(storage, current)
      onChange({ ...current })
      return persisted
    },
  }
}

function read(storage) {
  if (!storage) return null
  try {
    const raw = storage.getItem(SETTINGS_STORAGE_KEY)
    return raw === null || raw === undefined ? null : JSON.parse(raw)
  } catch (error) {
    log.warn('Không đọc được thiết lập, dùng mặc định', error)
    return null
  }
}

function write(storage, settings) {
  if (!storage) return false
  try {
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    return true
  } catch (error) {
    log.warn('Không ghi được thiết lập (localStorage bị chặn/đầy?)', error)
    return false
  }
}
