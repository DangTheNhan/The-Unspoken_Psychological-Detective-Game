const EVENT_KEYS = {
  TL_P1_OPENING: 'opening',
  TL_P1_HOA_DISCOVERY: 'hoaDiscovery',
  TL_P1_LINH_SLEEP: 'linhSleep',
  TL_P1_HAO_ARRIVAL: 'haoArrival',
  TL_P1_MINH_VISIT: 'minhVisit',
  TL_P1_POLICE: 'policeArrival',
  TL_P2_RECEIPT: 'receipt',
  TL_P3_HOA_ENTRY: 'hoaEntry',
  TL_P3_MINH_BEFORE_HOA: 'minhBeforeHoa',
  TL_P3_LINH_THEFT: 'linhTheft',
  TL_P3_LINH_DISTRESS: 'linhDistress',
  TL_P3_HAO_VISIT: 'haoVisit',
  TL_P3_SWAP: 'swap',
}

const SPEAKERS = { HOA: 'Hòa', LINH: 'Linh', HAO: 'Hào', MINH: 'Minh', POLICE: 'Cảnh sát' }
const CLOCK_PRECISIONS = new Set(['clock', 'estimated', 'inscribed', 'inscribed_and_claimed'])

/** Chỉ sắp xếp bản ghi đã có, không suy ra giờ cho các quan hệ trước/sau. */
export function timelineGroups(entries) {
  const groups = { timed: [], relation: [], unknown: [] }
  for (const entry of entries) {
    if (entry.precision === 'relation') groups.relation.push(entry)
    else if (clockMinutes(entry) !== null) groups.timed.push(entry)
    else groups.unknown.push(entry)
  }
  groups.timed.sort((left, right) => clockMinutes(left) - clockMinutes(right))
  return groups
}

function clockMinutes(entry) {
  if (entry.precision && !CLOCK_PRECISIONS.has(entry.precision)) return null
  const match = entry.display_time?.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/)
  return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

export function timelineTitle(entry, t) {
  const key = EVENT_KEYS[entry.id]
  return key
    ? t(`notebook.timeline.event.${key}`)
    : (entry.title ?? entry.name ?? entry.text ?? t('notebook.timeline.eventUnknown'))
}

export function timelineStatus(entry, t, state) {
  const sources = timelineSources(entry, state)
  const replacedClaim =
    entry.status === 'claimed' &&
    sources.length > 0 &&
    sources.every((source) => source.status === 'superseded')
  const key = `notebook.timeline.status.${replacedClaim ? 'superseded' : entry.status}`
  const label = t(key)
  return label === key ? t('notebook.timeline.status.unknown') : label
}

export function timelineSources(entry, state) {
  return (entry.source_ids ?? []).flatMap((id) => {
    const source =
      state?.statements?.[id] ?? state?.evidence_records?.[id] ?? state?.observations?.[id]
    return source ? [source] : []
  })
}

export function timelineSourceLabel(source, t) {
  if (source.speaker) {
    return t('notebook.timeline.statementBy', {
      speaker: SPEAKERS[source.speaker] ?? source.speaker,
    })
  }
  return source.name ?? source.title ?? t('notebook.timeline.recordSource')
}

export function timelineSourceSummary(entry, state, t) {
  const sources = timelineSources(entry, state)
  if (sources.length === 1) return timelineSourceLabel(sources[0], t)
  if (sources.length > 1) return t('notebook.timeline.sourceCount', { count: sources.length })
  return t(
    entry.status === 'observed'
      ? 'notebook.source.observation'
      : 'notebook.timeline.sourceUnavailable',
  )
}
