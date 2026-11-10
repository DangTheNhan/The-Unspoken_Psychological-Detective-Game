import { createLogger } from '@/shared/logger/logger'

const log = createLogger('Fonts')

/** Các nét chữ menu cần (khớp @font-face trong src/styles/index.css). */
const UI_FONT_FACES = Object.freeze([
  '700 74px "Playfair Display"',
  '400 16px "Be Vietnam Pro"',
  '500 22px "Be Vietnam Pro"',
  '600 15px "Be Vietnam Pro"',
  '400 13px "JetBrains Mono"',
])

/** Chờ tối đa bao lâu (ms) trước khi vẽ bằng font dự phòng. TẠM. */
export const FONT_LOAD_TIMEOUT_MS = 3000

/**
 * Phaser vẽ chữ lên canvas một lần — nếu font chưa tải xong, chữ sẽ kẹt ở font dự phòng.
 * Gọi trước khi vào menu. Không bao giờ reject: thiếu file / trình duyệt cũ -> vẫn tiếp tục.
 * @returns {Promise<void>}
 */
export function loadUiFonts({ timeoutMs = FONT_LOAD_TIMEOUT_MS } = {}) {
  const fontSet = globalThis.document?.fonts
  if (!fontSet?.load) return Promise.resolve()

  // Chuỗi mẫu có dấu tiếng Việt để trình duyệt tải đúng phần chữ cần dùng
  const missing = []
  const loads = UI_FONT_FACES.map((face) =>
    fontSet.load(face, 'Ván mới ệ ữ ỗ 204').catch(() => missing.push(face)),
  )
  const all = Promise.all(loads).then(() => {
    if (missing.length > 0) {
      log.warn(
        `Thiếu font, dùng font dự phòng: ${missing.join(' · ')} — xem public/assets/fonts/README.md`,
      )
    }
  })
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs))
  return Promise.race([all, timeout]).then(() => undefined)
}
