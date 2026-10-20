import { DIALOGUE_FONT_SIZES, TYPEWRITER } from '../constants/gameplay'

/**
 * Thiết lập người chơi — màn Cài đặt (DEC-012): 2 tab Âm thanh / Trò chơi.
 * Logic THUẦN (không Phaser, không localStorage) -> test được. Lưu trữ: core/settingsStore.js.
 * Giá trị mặc định + danh sách lựa chọn là thiết kế đã chốt (DEC-012), không có trong Project.docx.
 */

/** Ngôn ngữ giao diện. Lời thoại vẫn tiếng Việt (DEC-012, Q-M1 hiểu là "chỉ giao diện"). */
export const LANGUAGES = Object.freeze(['vi', 'en'])
export const TEXT_SPEEDS = Object.freeze(['slow', 'normal', 'fast', 'instant'])
export const DIALOGUE_TEXT_SIZES = Object.freeze(['medium', 'large'])

/** Âm lượng: 0–100, bước 5 (khớp thanh trượt). */
export const VOLUME = Object.freeze({ MIN: 0, MAX: 100, STEP: 5 })

export const DEFAULT_SETTINGS = Object.freeze({
  masterVolume: 80,
  musicVolume: 70,
  sfxVolume: 80,
  muteAll: false,
  language: 'vi',
  textSpeed: 'normal',
  autoAdvance: false,
  dialogueTextSize: 'medium',
})

const VOLUME_KEYS = Object.freeze(['masterVolume', 'musicVolume', 'sfxVolume'])
const BOOLEAN_KEYS = Object.freeze(['muteAll', 'autoAdvance'])
const CHOICE_KEYS = Object.freeze({
  language: LANGUAGES,
  textSpeed: TEXT_SPEEDS,
  dialogueTextSize: DIALOGUE_TEXT_SIZES,
})

export function createDefaultSettings() {
  return { ...DEFAULT_SETTINGS }
}

/** Kẹp vào 0–100 và làm tròn theo bước 5. Không phải số -> null. */
export function normalizeVolume(value) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  if (typeof number !== 'number' || !Number.isFinite(number)) return null
  const clamped = Math.min(VOLUME.MAX, Math.max(VOLUME.MIN, number))
  return Math.round(clamped / VOLUME.STEP) * VOLUME.STEP
}

function normalizeValue(key, value) {
  if (VOLUME_KEYS.includes(key)) return normalizeVolume(value)
  if (BOOLEAN_KEYS.includes(key)) return typeof value === 'boolean' ? value : null
  if (key in CHOICE_KEYS) return CHOICE_KEYS[key].includes(value) ? value : null
  return null
}

/**
 * Dữ liệu đọc từ localStorage có thể cũ/hỏng/bị sửa tay -> luôn đưa về object hợp lệ:
 * khóa lạ bị bỏ, giá trị sai kiểu -> mặc định. Không bao giờ ném lỗi.
 * @param {unknown} raw
 */
export function normalizeSettings(raw) {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const result = createDefaultSettings()
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (!(key in source)) continue
    const value = normalizeValue(key, source[key])
    if (value !== null) result[key] = value
  }
  return result
}

/**
 * Trả về object MỚI với một thiết lập đã đổi (giá trị sai -> giữ giá trị cũ).
 * @throws {RangeError} khi khóa không tồn tại (lỗi lập trình, không phải dữ liệu người dùng)
 */
export function applySettingChange(settings, key, value) {
  if (!(key in DEFAULT_SETTINGS)) throw new RangeError(`Thiết lập "${key}" không tồn tại`)
  const normalized = normalizeValue(key, value)
  if (normalized === null) return settings
  return { ...settings, [key]: normalized }
}

export function settingsEqual(a, b) {
  return Object.keys(DEFAULT_SETTINGS).every((key) => a[key] === b[key])
}

/** Trạng thái cho Phaser SoundManager: volume = âm lượng tổng (0–1), mute = tắt toàn bộ. */
export function toSoundManagerState(settings) {
  return { volume: settings.masterVolume / 100, mute: settings.muteAll }
}

/**
 * Âm lượng riêng của từng kênh (0–1) khi phát một âm thanh — nhân thêm volume tổng do SoundManager lo.
 * Chưa có file âm thanh (ISS-27): dùng khi thêm BGM/SFX, ví dụ this.sound.play(key, { volume }).
 * @param {'music'|'sfx'} channel
 */
export function channelVolume(settings, channel) {
  if (channel === 'music') return settings.musicVolume / 100
  if (channel === 'sfx') return settings.sfxVolume / 100
  throw new RangeError(`Kênh âm thanh "${channel}" không tồn tại`)
}

/** ms giữa 2 ký tự khi chữ chạy; 0 = hiện ngay. */
export function textCharDelayMs(settings) {
  return TYPEWRITER.SPEED_DELAYS_MS[settings.textSpeed] ?? TYPEWRITER.CHAR_DELAY_MS
}

/** Cỡ chữ (px) thân khung hội thoại. */
export function dialogueFontSizePx(settings) {
  return DIALOGUE_FONT_SIZES[settings.dialogueTextSize] ?? DIALOGUE_FONT_SIZES.medium
}
