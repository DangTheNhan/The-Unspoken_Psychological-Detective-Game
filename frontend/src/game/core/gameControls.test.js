import { EventEmitter } from 'node:events'
import { afterEach, expect, it, vi } from 'vitest'
vi.mock('phaser', () => ({
  default: { Core: { Events: { POST_STEP: 'poststep', DESTROY: 'destroy' } } },
}))
vi.mock('./EventBus', async () => ({ EventBus: new (await import('node:events')).EventEmitter() }))
import { EventBus } from './EventBus'
import { GAME_EVENTS } from '../constants/gameEvents'
import { SCENE_KEYS } from '../constants/sceneKeys'
import { installGameControls } from './gameControls'

const games = []
afterEach(() => {
  for (const game of games) game.events.emit('destroy')
  games.length = 0
  EventBus.removeAllListeners()
})
function setup() {
  const states = new Map([
    [SCENE_KEYS.STORY, 'active'],
    [SCENE_KEYS.ROOM_INVESTIGATION, 'paused'],
    [SCENE_KEYS.SETTINGS, 'stopped'],
    [SCENE_KEYS.MAIN_MENU, 'stopped'],
  ])
  const scenes = [...states.keys()].map((key) => ({
    scene: { key },
    sys: {
      isActive: () => states.get(key) === 'active',
      isPaused: () => states.get(key) === 'paused',
    },
  }))
  let settingsData
  const game = {
    events: new EventEmitter(),
    scene: {
      getScenes: (active) => scenes.filter((scene) => !active || scene.sys.isActive()),
      pause: (key) => states.set(key, 'paused'),
      resume: (key) => states.set(key, 'active'),
      sleep: (key) => states.set(key, 'sleeping'),
      wake: (key) => states.set(key, 'active'),
      stop: (key) => states.set(key, 'stopped'),
      start: (key, data) => {
        states.set(key, 'active')
        if (key === SCENE_KEYS.SETTINGS) settingsData = data
      },
    },
  }
  const runtime = {
    hasStarted: true,
    settings: { get: () => ({ language: 'vi' }) },
    saveLocal: vi.fn(),
    setPaused: vi.fn(),
  }
  installGameControls(game, runtime)
  games.push(game)
  const send = (action, reason) => EventBus.emit(GAME_EVENTS.CONTROL_REQUEST, { action, reason })
  return {
    game,
    runtime,
    states,
    send,
    closeSettings: () => {
      game.scene.stop(SCENE_KEYS.SETTINGS)
      settingsData.onClose()
    },
  }
}
it('resumes only the scene that was active before the menu', () => {
  const { states, send } = setup()
  send('pause')
  send('resume')
  expect(states.get(SCENE_KEYS.STORY)).toBe('active')
  expect(states.get(SCENE_KEYS.ROOM_INVESTIGATION)).toBe('paused')
})
it('maintenance ending inside Settings restores Settings and keeps gameplay paused', () => {
  const { game, states, send, closeSettings, runtime } = setup()
  send('pause')
  send('settings')
  send('block', 'maintenance')
  game.events.emit('poststep')
  expect(states.get(SCENE_KEYS.SETTINGS)).toBe('paused')
  send('unblock', 'maintenance')
  expect(states.get(SCENE_KEYS.SETTINGS)).toBe('active')
  expect(states.get(SCENE_KEYS.STORY)).toBe('paused')
  closeSettings()
  send('resume')
  expect(states.get(SCENE_KEYS.STORY)).toBe('active')
  expect(runtime.saveLocal).toHaveBeenCalledWith('maintenance')
})
it('keeps a suspended session during maintenance and restores the original scene states', () => {
  const { states, send, runtime } = setup()
  send('pause')
  send('menu')
  expect(runtime.menuResumeAvailable).toBe(true)
  expect(states.get(SCENE_KEYS.STORY)).toBe('sleeping')
  send('block', 'maintenance')
  send('resume-menu')
  expect(states.get(SCENE_KEYS.STORY)).toBe('sleeping')
  send('unblock', 'maintenance')
  send('resume-menu')
  expect(states.get(SCENE_KEYS.STORY)).toBe('active')
  expect(states.get(SCENE_KEYS.ROOM_INVESTIGATION)).toBe('paused')
  expect(runtime.menuResumeAvailable).toBe(false)
})
it('a disposed game cannot receive control requests', () => {
  const { game, send, runtime } = setup()
  game.events.emit('destroy')
  send('block', 'session')
  expect(runtime.saveLocal).not.toHaveBeenCalled()
})
