import { expect, it } from 'vitest'
import { mergeMaintenance, maintenanceView } from './maintenanceStatus'
const origin = Date.parse('2026-11-16T00:00:00Z')
const iso = (delta) => new Date(origin + delta).toISOString()
const schedule = {
  revision: 2,
  serverNow: iso(0),
  startsAt: iso(10000),
  active: false,
  scheduled: true,
  message: 'Scheduled',
}
it('ignores previous revisions and older responses from the same revision', () => {
  const state = mergeMaintenance(null, schedule, origin)
  expect(mergeMaintenance(state, { ...schedule, revision: 1 }, origin + 1000)).toBe(state)
  expect(mergeMaintenance(state, { ...schedule, serverNow: iso(-1000) }, origin + 1000)).toBe(state)
})
it('a slow response cannot undo a reached deadline; a new cancellation can reopen it', () => {
  const state = mergeMaintenance(null, schedule, origin)
  const slow = mergeMaintenance(state, { ...schedule, serverNow: iso(9000) }, origin + 11000)
  expect(maintenanceView(slow, origin + 11000).active).toBe(true)
  const cancelled = mergeMaintenance(
    slow,
    {
      revision: 3,
      serverNow: iso(12000),
      startsAt: null,
      active: false,
      scheduled: false,
      message: '',
    },
    origin + 12000,
  )
  expect(maintenanceView(cancelled, origin + 12000).active).toBe(false)
})
it('uses the server clock when the player clock is different', () => {
  const state = mergeMaintenance(null, schedule, origin + 3600000)
  expect(maintenanceView(state, origin + 3600000).remainingSeconds).toBe(10)
  expect(maintenanceView(state, origin + 3610000).active).toBe(true)
})
it('keeps the last schedule when a response lacks valid metadata', () => {
  const state = mergeMaintenance(null, schedule, origin)
  expect(mergeMaintenance(state, {}, origin)).toBe(state)
  expect(maintenanceView(null, origin)).toEqual({ active: false, scheduled: false })
})
