/** Public polling and heartbeat may return out of order; older schedules cannot reopen the game. */
export function mergeMaintenance(previous, incoming, receivedAt) {
  const stamp = Date.parse(incoming?.serverNow)
  if (!Number.isFinite(stamp) || !Number.isSafeInteger(incoming?.revision)) return previous
  if (
    previous &&
    (incoming.revision < previous.revision ||
      (incoming.revision === previous.revision && stamp < Date.parse(previous.serverNow)))
  )
    return previous
  const reached =
    previous?.revision === incoming.revision &&
    (previous.active ||
      (previous.scheduled && Date.parse(previous.startsAt) <= receivedAt + previous.offset))
  return {
    ...incoming,
    active: Boolean(incoming.active || reached),
    scheduled: Boolean(incoming.scheduled && !reached),
    offset: stamp - receivedAt,
  }
}
export function maintenanceView(system, now) {
  if (!system) return { active: false, scheduled: false }
  const active = Boolean(
    system.active || (system.scheduled && Date.parse(system.startsAt) <= now + system.offset),
  )
  return {
    ...system,
    active,
    scheduled: system.scheduled && !active,
    remainingSeconds: system.startsAt
      ? Math.max(0, Math.ceil((Date.parse(system.startsAt) - now - system.offset) / 1000))
      : 0,
  }
}
