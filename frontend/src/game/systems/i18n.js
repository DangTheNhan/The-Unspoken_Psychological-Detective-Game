import { UI_TEXT } from '../data/uiText'

/** Ngôn ngữ dự phòng khi thiếu khóa — tiếng Việt là ngôn ngữ gốc của nguồn. */
export const FALLBACK_LANGUAGE = 'vi'

/**
 * Lấy chuỗi giao diện theo ngôn ngữ. Thứ tự: ngôn ngữ chọn -> tiếng Việt -> chính `key`
 * (hiện mã khóa thay vì chuỗi rỗng để dễ phát hiện thiếu dịch).
 * @param {string} language 'vi' | 'en'
 * @param {string} key ví dụ 'menu.newGame'
 * @param {Record<string, string|number>} [params] thay {ten} trong chuỗi
 * @param {Record<string, Record<string, string>>} [table] bảng chuỗi (test truyền bảng giả)
 */
export function translate(language, key, params = {}, table = UI_TEXT) {
  const template = table[language]?.[key] ?? table[FALLBACK_LANGUAGE]?.[key] ?? key
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in params ? String(params[name]) : match,
  )
}

/** t = createTranslator('en'); t('menu.newGame') */
export function createTranslator(language, table = UI_TEXT) {
  return (key, params) => translate(language, key, params, table)
}
