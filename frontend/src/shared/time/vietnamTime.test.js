import { describe, expect, it } from 'vitest'
import {
  formatVietnamDateTime,
  formatVietnamTime,
  parseVietnamTimestamp,
  vietnamDateTimeInput,
  vietnamDateTimeToIso,
} from './vietnamTime'

describe('Vietnamese display and maintenance input', () => {
  it('converts absolute instants across midnight and preserves already-local Admin times', () => {
    for (const input of [
      '2026-11-16T18:00:00Z',
      '2026-11-17T01:00:00+07:00',
      '2026-11-17T01:00:00',
      '2026-11-17 01:00:00',
    ]) {
      expect(formatVietnamDateTime(input)).toBe('17/11/2026 01:00:00')
      expect(formatVietnamTime(input)).toBe('01:00:00')
    }
    expect(formatVietnamDateTime('2026-11-16T23:00:00-05:00')).toBe('17/11/2026 11:00:00')
  })
  it('uses Vietnam for datetime-local input even when the host timezone differs', () => {
    expect(vietnamDateTimeToIso('2026-11-17T01:00')).toBe('2026-11-16T18:00:00.000Z')
    expect(vietnamDateTimeToIso('2028-02-29T07:15:30')).toBe('2028-02-29T00:15:30.000Z')
    expect(vietnamDateTimeInput('2026-11-16T18:00:00Z')).toBe('2026-11-17T01:00:00')
  })
  it('rejects missing, invalid or rolled-over calendar dates instead of inventing a time', () => {
    for (const value of [
      null,
      undefined,
      '',
      'bad',
      '2026-02-29T12:00',
      '2026-04-31T10:00',
      '2026-11-17T24:00',
      '2026-11-17T12:60',
      '2026-02-30T12:00:00Z',
    ]) {
      expect(formatVietnamDateTime(value)).toBe('—')
      expect(vietnamDateTimeToIso(value)).toBeNull()
    }
    expect(vietnamDateTimeToIso('2026-11-17T01:00:00Z')).toBeNull()
  })
  it('handles Date, epoch zero and fractional server seconds without a second conversion', () => {
    expect(formatVietnamTime(0)).not.toBe('—')
    expect(formatVietnamDateTime(new Date('2026-11-16T18:00:00Z'))).toBe('17/11/2026 01:00:00')
    expect(parseVietnamTimestamp('2026-11-17T01:00:00.123456').toISOString()).toBe(
      '2026-11-16T18:00:00.123Z',
    )
  })
})
