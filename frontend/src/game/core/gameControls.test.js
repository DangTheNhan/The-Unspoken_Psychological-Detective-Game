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
    input: { keyboard: { resetKeys: vi.fn() } },
    sys: {
      settings: { visible: true },
      setVisible(visible) {
        this.settings.visible = visible
      },
      isActive: () => states.get(key) === 'active',
      isPaused: () => states.get(key) === 'paused',
    },
  }))
  let settingsData
  const document = new EventTarget()
  const keyboard = { enabled: true, preventDefault: true, queue: ['pending-key'] }
  const game = {
    canvas: { ownerDocument: document },
    input: { keyboard },
    events: new EventEmitter(),
    scene: {
      getScenes: (active) => scenes.filter((scene) => !active || scene.sys.isActive()),
      getScene: (key) => scenes.find((scene) => scene.scene.key === key),
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
    session: { tutorial: { status: 'active' } },
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
    scenes,
    keyboard,
    escape: (properties = {}) => {
      const event = new Event('keydown', { cancelable: true })
      Object.assign(event, { key: 'Escape', repeat: false, ...properties })
      document.dispatchEvent(event)
      return event
    },
    release: (properties) => {
      const event = new Event('keyup')
      Object.assign(event, properties)
      document.dispatchEvent(event)
    },
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
  const { game, states, send, runtime } = setup()
  send('pause')
  send('menu')
  expect(runtime.menuResumeAvailable).toBe(true)
  expect(states.get(SCENE_KEYS.STORY)).toBe('paused')
  expect(game.scene.getScene(SCENE_KEYS.STORY).sys.settings.visible).toBe(false)
  send('block', 'maintenance')
  send('resume-menu')
  expect(states.get(SCENE_KEYS.STORY)).toBe('paused')
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

it('Escape pauses gameplay once and leaves sublayers and repeated keys to their owner', () => {
  const { states, scenes, send, escape } = setup()
  expect(escape({ repeat: true }).defaultPrevented).toBe(false)
  expect(states.get(SCENE_KEYS.STORY)).toBe('active')
  scenes[0].handlesEscape = () => true
  expect(escape().defaultPrevented).toBe(false)
  scenes[0].handlesEscape = () => false
  expect(escape().defaultPrevented).toBe(true)
  expect(states.get(SCENE_KEYS.STORY)).toBe('paused')
  send('resume')
  expect(states.get(SCENE_KEYS.STORY)).toBe('active')
})

it('pause releases DOM capture, clears held keys and restores only after every form releases input', () => {
  const { send, keyboard, scenes } = setup()
  send('pause')
  expect(keyboard).toMatchObject({ enabled: false, preventDefault: false, queue: [] })
  expect(scenes[0].input.keyboard.resetKeys).toHaveBeenCalled()
  send('lock-input', 'report')
  send('lock-input', 'another-dialog')
  send('resume')
  send('unlock-input', 'report')
  expect(keyboard.enabled).toBe(false)
  send('unlock-input', 'another-dialog')
  expect(keyboard).toMatchObject({ enabled: true, preventDefault: true, queue: [] })
})

it('restores a previously disabled keyboard without enabling capture it did not own', () => {
  const { send, keyboard } = setup()
  keyboard.enabled = false
  keyboard.preventDefault = false
  send('pause')
  send('resume')
  expect(keyboard.enabled).toBe(false)
  expect(keyboard.preventDefault).toBe(false)
})

it('closing a form or pressing Escape cannot unlock maintenance or a revoked session', () => {
  const { send, keyboard, states, escape } = setup()
  send('pause')
  send('lock-input', 'report')
  send('block', 'maintenance')
  send('block', 'session')
  send('unlock-input', 'report')
  send('resume')
  escape()
  send('unblock', 'maintenance')
  expect(keyboard.enabled).toBe(false)
  expect(states.get(SCENE_KEYS.STORY)).toBe('paused')
  send('unblock', 'session')
  expect(states.get(SCENE_KEYS.STORY)).toBe('paused')
  send('resume')
  expect(states.get(SCENE_KEYS.STORY)).toBe('active')
  expect(keyboard.enabled).toBe(true)
})

it('double clicking Settings does not replace its callback or resume gameplay', () => {
  const { send, closeSettings, keyboard, states } = setup()
  send('pause')
  send('settings')
  send('settings')
  expect(keyboard.enabled).toBe(true)
  expect(states.get(SCENE_KEYS.STORY)).toBe('paused')
  closeSettings()
  expect(keyboard.enabled).toBe(false)
  send('resume')
  expect(states.get(SCENE_KEYS.STORY)).toBe('active')
})

it('skip tutorial is only offered for the room paused by this menu and invokes its existing confirmation', () => {
  const { send, states, scenes } = setup()
  states.set(SCENE_KEYS.STORY, 'stopped')
  states.set(SCENE_KEYS.ROOM_INVESTIGATION, 'active')
  const room = scenes.find((scene) => scene.scene.key === SCENE_KEYS.ROOM_INVESTIGATION)
  room.confirmSkipTutorial = vi.fn()
  send('skip-tutorial')
  expect(room.confirmSkipTutorial).not.toHaveBeenCalled()
  send('pause')
  send('skip-tutorial')
  expect(room.confirmSkipTutorial).toHaveBeenCalledOnce()
  expect(states.get(SCENE_KEYS.ROOM_INVESTIGATION)).toBe('active')
})

it('game disposal restores keyboard ownership and removes its native Escape listener', () => {
  const { game, escape, send, keyboard, runtime } = setup()
  send('lock-input', 'form')
  game.events.emit('destroy')
  expect(keyboard.enabled).toBe(true)
  runtime.setPaused.mockClear()
  expect(escape().defaultPrevented).toBe(false)
  expect(runtime.setPaused).not.toHaveBeenCalled()
})

it('a key held inside a form cannot auto-repeat into movement until released', () => {
  const { send, escape, release } = setup()
  send('pause')
  send('lock-input', 'report')
  expect(escape({ key: 'w', code: 'KeyW' }).defaultPrevented).toBe(false)
  send('unlock-input', 'report')
  send('resume')
  expect(escape({ key: 'w', code: 'KeyW', repeat: true }).defaultPrevented).toBe(true)
  release({ key: 'w', code: 'KeyW' })
  expect(escape({ key: 'w', code: 'KeyW' }).defaultPrevented).toBe(false)
})
