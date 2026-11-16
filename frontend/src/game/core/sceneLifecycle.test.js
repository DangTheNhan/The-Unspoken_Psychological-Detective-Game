import { EventEmitter } from 'node:events'
import { expect, it, vi } from 'vitest'
import { onSceneEnd } from './sceneLifecycle'

it.each(['shutdown', 'destroy'])(
  'disposes external callbacks on %s without removing another scene',
  (event) => {
    const events = new EventEmitter()
    const bus = new EventEmitter()
    const old = vi.fn()
    const current = vi.fn()
    bus.on('availability', old)
    bus.on('availability', current)
    const dispose = onSceneEnd({ events }, () => bus.off('availability', old))
    events.emit(event)
    events.emit('destroy')
    dispose()
    bus.emit('availability')
    expect(old).not.toHaveBeenCalled()
    expect(current).toHaveBeenCalledOnce()
    expect(events.listenerCount('shutdown') + events.listenerCount('destroy')).toBe(0)
  },
)
