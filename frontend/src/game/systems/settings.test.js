import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SETTINGS,
  applySettingChange,
  channelVolume,
  createDefaultSettings,
  dialogueFontSizePx,
  normalizeSettings,
  normalizeVolume,
  settingsEqual,
  textCharDelayMs,
  toSoundManagerState,
} from './settings'

describe('settings — mặc định (DEC-012)', () => {
  it('đúng giá trị đã chốt', () => {
    expect(createDefaultSettings()).toEqual({
      masterVolume: 80,
      musicVolume: 70,
      sfxVolume: 80,
      muteAll: false,
      language: 'vi',
      textSpeed: 'normal',
      autoAdvance: false,
      dialogueTextSize: 'medium',
    })
  })

  it('mỗi lần tạo là object mới, không sửa được bản mặc định', () => {
    const a = createDefaultSettings()
    a.masterVolume = 0
    expect(createDefaultSettings().masterVolume).toBe(80)
    expect(Object.isFrozen(DEFAULT_SETTINGS)).toBe(true)
  })
})

describe('settings — normalizeSettings', () => {
  it('dữ liệu hỏng / không phải object -> mặc định', () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS)
    expect(normalizeSettings('abc')).toEqual(DEFAULT_SETTINGS)
    expect(normalizeSettings([1, 2])).toEqual(DEFAULT_SETTINGS)
  })

  it('giữ giá trị hợp lệ, bỏ khóa lạ, giá trị sai -> mặc định', () => {
    const result = normalizeSettings({
      masterVolume: 40,
      language: 'en',
      textSpeed: 'warp',
      autoAdvance: 'yes',
      resolution: '1920x1080',
    })
    expect(result.masterVolume).toBe(40)
    expect(result.language).toBe('en')
    expect(result.textSpeed).toBe('normal')
    expect(result.autoAdvance).toBe(false)
    expect('resolution' in result).toBe(false)
  })

  it('âm lượng bị kẹp 0–100 và làm tròn bước 5', () => {
    expect(normalizeVolume(-10)).toBe(0)
    expect(normalizeVolume(250)).toBe(100)
    expect(normalizeVolume(42)).toBe(40)
    expect(normalizeVolume(43)).toBe(45)
    expect(normalizeVolume('65')).toBe(65)
    expect(normalizeVolume(Number.NaN)).toBe(null)
    expect(normalizeVolume('')).toBe(null)
  })
})

describe('settings — applySettingChange', () => {
  it('trả object mới, không sửa object cũ', () => {
    const before = createDefaultSettings()
    const after = applySettingChange(before, 'muteAll', true)
    expect(after.muteAll).toBe(true)
    expect(before.muteAll).toBe(false)
  })

  it('giá trị sai -> giữ nguyên; khóa lạ -> lỗi lập trình', () => {
    const before = createDefaultSettings()
    expect(applySettingChange(before, 'language', 'fr')).toBe(before)
    expect(() => applySettingChange(before, 'fps', 60)).toThrow(RangeError)
  })

  it('settingsEqual so theo giá trị', () => {
    expect(settingsEqual(createDefaultSettings(), createDefaultSettings())).toBe(true)
    expect(
      settingsEqual(createDefaultSettings(), { ...createDefaultSettings(), sfxVolume: 5 }),
    ).toBe(false)
  })
})

describe('settings — quy đổi khi áp dụng', () => {
  it('SoundManager: volume tổng 0–1, mute', () => {
    expect(toSoundManagerState(createDefaultSettings())).toEqual({ volume: 0.8, mute: false })
    const muted = { ...createDefaultSettings(), muteAll: true, masterVolume: 0 }
    expect(toSoundManagerState(muted)).toEqual({ volume: 0, mute: true })
  })

  it('âm lượng kênh nhạc nền / hiệu ứng', () => {
    const settings = createDefaultSettings()
    expect(channelVolume(settings, 'music')).toBe(0.7)
    expect(channelVolume(settings, 'sfx')).toBe(0.8)
    expect(() => channelVolume(settings, 'voice')).toThrow(RangeError)
  })

  it('tốc độ chữ: Vừa = 30 ms như cũ, Hiện ngay = 0', () => {
    expect(textCharDelayMs(createDefaultSettings())).toBe(30)
    expect(textCharDelayMs({ textSpeed: 'slow' })).toBe(50)
    expect(textCharDelayMs({ textSpeed: 'fast' })).toBe(15)
    expect(textCharDelayMs({ textSpeed: 'instant' })).toBe(0)
  })

  it('cỡ chữ hội thoại: Vừa 22 px (như cũ), Lớn 26 px', () => {
    expect(dialogueFontSizePx(createDefaultSettings())).toBe(22)
    expect(dialogueFontSizePx({ dialogueTextSize: 'large' })).toBe(26)
  })
})
