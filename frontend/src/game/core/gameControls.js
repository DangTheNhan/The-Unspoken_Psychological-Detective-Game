import Phaser from 'phaser'
import { EventBus } from './EventBus'
import { GAME_EVENTS } from '../constants/gameEvents'
import { SCENE_KEYS } from '../constants/sceneKeys'

/** React controls use EventBus; suspended scenes retain their exact in-memory runner and position. */
export function installGameControls(game, runtime) {
  const reasons = new Set()
  const inputLocks = new Set()
  const heldKeys = new Set()
  const blockedRepeats = new Set()
  let paused = []
  let sleeping = []
  let menuOpen = false
  let settingsOpen = false
  let disposed = false
  let keyboardState = null
  let settingsChanged = false
  const document = game.canvas?.ownerDocument ?? globalThis.document
  const blocked = () => reasons.has('maintenance') || reasons.has('session')
  const scenes = () => game.scene.getScenes(false)
  const inMainMenu = () =>
    scenes().some((scene) => scene.scene.key === SCENE_KEYS.MAIN_MENU && scene.sys.isActive())
  const canSkipTutorial = () =>
    paused.includes(SCENE_KEYS.ROOM_INVESTIGATION) && runtime.session?.tutorial?.status === 'active'
  const resetKeys = () => {
    for (const scene of scenes()) scene.input?.keyboard?.resetKeys()
    if (game.input?.keyboard) game.input.keyboard.queue = []
  }
  // Pausing scenes does not stop KeyboardManager from preventDefault-ing captured DOM keys.
  const syncInput = () => {
    const keyboard = game.input?.keyboard
    if (!keyboard) return
    const locked = inputLocks.size > 0 || blocked() || (reasons.size > 0 && !settingsOpen)
    if (locked) {
      if (!keyboardState) {
        keyboardState = { enabled: keyboard.enabled, preventDefault: keyboard.preventDefault }
        for (const key of heldKeys) blockedRepeats.add(key)
        resetKeys()
      }
      keyboard.enabled = false
      keyboard.preventDefault = false
    } else if (keyboardState) {
      resetKeys()
      Object.assign(keyboard, keyboardState)
      keyboardState = null
    }
  }
  const announce = () =>
    EventBus.emit(GAME_EVENTS.CONTROL_STATE, {
      menuOpen,
      settingsOpen,
      playing: runtime.hasStarted,
      blocked: blocked(),
      inMainMenu: inMainMenu(),
      canSkipTutorial: canSkipTutorial(),
      language: runtime.settings.get().language,
    })
  const freeze = () => {
    if (disposed) return
    syncInput()
    if (!reasons.size) return
    for (const scene of game.scene.getScenes(true)) {
      const key = scene.scene.key
      if (key === SCENE_KEYS.DEBUG || (key === SCENE_KEYS.SETTINGS && settingsOpen && !blocked()))
        continue
      if (!paused.includes(key)) paused.push(key)
      game.scene.pause(key)
    }
  }
  const thaw = () => {
    if (reasons.size) return
    const keys = paused
    paused = []
    for (const key of keys) game.scene.resume(key, { preserveView: !settingsChanged })
    settingsChanged = false
    runtime.setPaused(false)
  }
  const request = ({ action, reason = 'menu' } = {}) => {
    if (disposed) return
    if (action === 'lock-input' || action === 'unlock-input') {
      if (action === 'lock-input') inputLocks.add(reason)
      else inputLocks.delete(reason)
      syncInput()
      return
    }
    if (action === 'block') {
      runtime.saveLocal(reason)
      reasons.add(reason)
      runtime.setPaused(true)
      freeze()
    } else if (action === 'unblock') {
      reasons.delete(reason)
      if (!blocked() && settingsOpen && reasons.has('menu')) {
        paused = paused.filter((key) => {
          if (key !== SCENE_KEYS.SETTINGS) return true
          game.scene.resume(key)
          return false
        })
      } else thaw()
    } else if (action === 'pause' && !blocked() && !settingsOpen) {
      reasons.add('menu')
      menuOpen = true
      runtime.setPaused(true)
      freeze()
    } else if (action === 'resume' && menuOpen && !settingsOpen && !blocked()) {
      reasons.delete('menu')
      menuOpen = false
      thaw()
    } else if (action === 'settings' && menuOpen && !settingsOpen && !blocked()) {
      menuOpen = false
      settingsOpen = true
      game.scene.start(SCENE_KEYS.SETTINGS, {
        onClose: () => {
          settingsOpen = false
          menuOpen = true
          syncInput()
          announce()
        },
      })
    } else if (action === 'skip-tutorial' && menuOpen && !blocked() && canSkipTutorial()) {
      reasons.delete('menu')
      menuOpen = false
      thaw()
      game.scene.getScene(SCENE_KEYS.ROOM_INVESTIGATION).confirmSkipTutorial()
    } else if (action === 'menu' && menuOpen && !settingsOpen && !blocked() && runtime.hasStarted) {
      sleeping = game.scene
        .getScenes(false)
        .filter(
          (scene) =>
            scene.scene.key !== SCENE_KEYS.DEBUG &&
            scene.scene.key !== SCENE_KEYS.MAIN_MENU &&
            (scene.sys.isActive() || scene.sys.isPaused()),
        )
        .map((scene) => ({
          key: scene.scene.key,
          resume: paused.includes(scene.scene.key) || scene.sys.isActive(),
          slept: scene.sys.isActive(),
          visible: scene.sys.settings?.visible ?? true,
        }))
      for (const { key, slept } of sleeping) {
        // Phaser cannot sleep a paused scene. Hide it without emitting a false resume event.
        if (slept) game.scene.sleep(key)
        else game.scene.getScene(key).sys.setVisible(false)
      }
      paused = []
      reasons.delete('menu')
      menuOpen = false
      runtime.menuResumeAvailable = sleeping.length > 0
      game.scene.start(SCENE_KEYS.MAIN_MENU)
    } else if (action === 'resume-menu' && sleeping.length > 0 && !blocked()) {
      game.scene.stop(SCENE_KEYS.MAIN_MENU)
      for (const { key, resume, slept, visible } of sleeping) {
        if (slept) game.scene.wake(key)
        game.scene.getScene(key).sys.setVisible(visible)
        if (resume) game.scene.resume(key, { preserveView: !settingsChanged })
        else if (slept) game.scene.pause(key)
      }
      sleeping = []
      runtime.menuResumeAvailable = false
      runtime.setPaused(false)
      settingsChanged = false
    } else if (action === 'discard-menu') {
      for (const { key } of sleeping) game.scene.stop(key)
      sleeping = []
      runtime.menuResumeAvailable = false
    }
    syncInput()
    announce()
  }
  const onSettingsChanged = () => {
    if (settingsOpen || sleeping.length) settingsChanged = true
  }
  const onEscape = (event) => {
    const key = event.code || event.key
    heldKeys.add(key)
    if (keyboardState || inputLocks.size) {
      blockedRepeats.add(key)
      return
    }
    if (blockedRepeats.has(key) && event.repeat) {
      event.preventDefault()
      event.stopImmediatePropagation()
      return
    }
    if (!event.repeat) blockedRepeats.delete(key)
    if (
      disposed ||
      event.key !== 'Escape' ||
      event.defaultPrevented ||
      event.repeat ||
      event.isComposing
    )
      return
    if (
      inputLocks.size ||
      menuOpen ||
      blocked() ||
      document?.activeElement?.closest?.('input, textarea, select, [contenteditable="true"]')
    )
      return
    const top = game.scene
      .getScenes(true)
      .filter((scene) => scene.scene.key !== SCENE_KEYS.DEBUG)
      .at(-1)
    if (
      !top ||
      top.dialog ||
      top.handlesEscape?.() ||
      [
        SCENE_KEYS.MAIN_MENU,
        SCENE_KEYS.SETTINGS,
        SCENE_KEYS.NOTEBOOK,
        SCENE_KEYS.DEDUCTION,
      ].includes(top.scene.key)
    )
      return
    if (!runtime.hasStarted) return
    event.preventDefault()
    event.stopImmediatePropagation()
    request({ action: 'pause' })
  }
  const onKeyUp = (event) => {
    const key = event.code || event.key
    heldKeys.delete(key)
    blockedRepeats.delete(key)
  }
  document?.addEventListener('keydown', onEscape, true)
  document?.addEventListener('keyup', onKeyUp, true)
  EventBus.on(GAME_EVENTS.CONTROL_REQUEST, request)
  EventBus.on(GAME_EVENTS.SETTINGS_CHANGED, onSettingsChanged)
  game.events.on(Phaser.Core.Events.POST_STEP, freeze)
  game.events.once(Phaser.Core.Events.DESTROY, () => {
    disposed = true
    inputLocks.clear()
    reasons.clear()
    settingsOpen = false
    syncInput()
    document?.removeEventListener('keydown', onEscape, true)
    document?.removeEventListener('keyup', onKeyUp, true)
    EventBus.off(GAME_EVENTS.CONTROL_REQUEST, request)
    EventBus.off(GAME_EVENTS.SETTINGS_CHANGED, onSettingsChanged)
    game.events.off(Phaser.Core.Events.POST_STEP, freeze)
  })
}
