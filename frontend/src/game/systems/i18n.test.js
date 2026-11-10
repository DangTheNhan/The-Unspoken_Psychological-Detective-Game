import { describe, expect, it } from 'vitest'
import { LANGUAGE_NAMES, UI_TEXT } from '../data/uiText'
import { createTranslator, translate } from './i18n'
import { LANGUAGES } from './settings'

describe('uiText — đủ chuỗi cho mọi ngôn ngữ (DEC-012)', () => {
  it('mỗi ngôn ngữ trong cài đặt đều có bảng chuỗi và tên hiển thị', () => {
    for (const language of LANGUAGES) {
      expect(typeof UI_TEXT[language]).toBe('object')
      expect(typeof LANGUAGE_NAMES[language]).toBe('string')
    }
  })

  it('tiếng Việt và English có CÙNG bộ khóa', () => {
    const viKeys = Object.keys(UI_TEXT.vi).sort()
    expect(Object.keys(UI_TEXT.en).sort()).toEqual(viKeys)
  })

  it('không có chuỗi rỗng', () => {
    for (const language of LANGUAGES) {
      const empty = Object.entries(UI_TEXT[language]).filter(([, value]) => !value.trim())
      expect(empty).toEqual([])
    }
  })

  it('tham số {ten} giống nhau giữa hai ngôn ngữ', () => {
    const params = (text) => (text.match(/\{\w+\}/g) ?? []).sort()
    for (const key of Object.keys(UI_TEXT.vi)) {
      expect([key, ...params(UI_TEXT.en[key])]).toEqual([key, ...params(UI_TEXT.vi[key])])
    }
  })
})

describe('translate', () => {
  const table = {
    vi: { hello: 'Xin chào {name}', onlyVi: 'Chỉ tiếng Việt' },
    en: { hello: 'Hello {name}' },
  }

  it('lấy đúng ngôn ngữ và thay tham số', () => {
    expect(translate('en', 'hello', { name: 'Hòa' }, table)).toBe('Hello Hòa')
    expect(translate('vi', 'hello', { name: 'Hòa' }, table)).toBe('Xin chào Hòa')
  })

  it('thiếu khóa -> tiếng Việt -> trả về chính khóa', () => {
    expect(translate('en', 'onlyVi', {}, table)).toBe('Chỉ tiếng Việt')
    expect(translate('en', 'missing.key', {}, table)).toBe('missing.key')
  })

  it('tham số không truyền thì giữ nguyên {ten}', () => {
    expect(translate('en', 'hello', {}, table)).toBe('Hello {name}')
  })

  it('createTranslator dùng bảng thật', () => {
    expect(createTranslator('vi')('menu.newGame')).toBe('Ván mới')
    expect(createTranslator('en')('preload.loading', { percent: 50 })).toBe('Loading… 50%')
  })
})
