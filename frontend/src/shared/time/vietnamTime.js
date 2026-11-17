export const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh'
export const VIETNAM_TIME_LABEL = 'giờ Việt Nam (UTC+7)'

const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: VIETNAM_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})
const localPattern = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?$/
const partsOf = (date) =>
  Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]))
const epochOf = (p) => Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second)

function calendarParts(text) {
  const match = localPattern.exec(text)
  if (!match) return null
  const [, year, month, day, hour, minute, rawSecond = '00', fraction = ''] = match
  const p = { year, month, day, hour, minute, second: rawSecond }
  if (+year < 1000 || +hour > 23 || +minute > 59 || +rawSecond > 59) return null
  const check = new Date(epochOf(p))
  if (
    check.getUTCFullYear() !== +year ||
    check.getUTCMonth() + 1 !== +month ||
    check.getUTCDate() !== +day
  )
    return null
  return { ...p, milliseconds: Number(fraction.padEnd(3, '0').slice(0, 3)) }
}

/** Interpret an offset-free datetime-local value in Vietnam, never in the browser's zone. */
function localDate(text) {
  const p = calendarParts(text)
  if (!p) return null
  const wall = epochOf(p)
  let instant = wall
  for (let i = 0; i < 2; i++) instant -= epochOf(partsOf(new Date(instant))) - wall
  if (epochOf(partsOf(new Date(instant))) !== wall) return null
  return new Date(instant + p.milliseconds)
}

export function vietnamDateTimeToIso(value) {
  return typeof value === 'string' ? (localDate(value.trim())?.toISOString() ?? null) : null
}

/** Admin LocalDateTime fields are Vietnam wall time; Z/offset fields are absolute instants. */
export function parseVietnamTimestamp(value) {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date || typeof value === 'number') {
    const date = new Date(value)
    return Number.isFinite(date.getTime()) ? date : null
  }
  if (typeof value !== 'string') return null
  const text = value.trim()
  const offset = /^(.*?)(Z|[+-]\d{2}:\d{2})$/i.exec(text)
  if (!offset) return localDate(text)
  if (!calendarParts(offset[1])) return null
  const date = new Date(text.replace(' ', 'T'))
  return Number.isFinite(date.getTime()) ? date : null
}

export function formatVietnamDateTime(value) {
  const date = parseVietnamTimestamp(value)
  if (!date) return '—'
  const p = partsOf(date)
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`
}

export function formatVietnamTime(value) {
  const date = parseVietnamTimestamp(value)
  if (!date) return '—'
  const p = partsOf(date)
  return `${p.hour}:${p.minute}:${p.second}`
}

export function vietnamDateTimeInput(value) {
  const date = parseVietnamTimestamp(value)
  if (!date) return ''
  const p = partsOf(date)
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`
}
