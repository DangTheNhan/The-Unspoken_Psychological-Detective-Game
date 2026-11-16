import Phaser from 'phaser'
import { EventBus } from './EventBus'
import { GAME_EVENTS } from '../constants/gameEvents'
import { SCENE_KEYS } from '../constants/sceneKeys'

/** React controls use EventBus; suspended scenes retain their exact in-memory runner and position. */
export function installGameControls(game, runtime) {
  const reasons = new Set()
  let paused = []
  let sleeping = []
  let menuOpen = false
  let settingsOpen = false
  let disposed = false
  const blocked = () => reasons.has('maintenance') || reasons.has('session')
  const announce = () =>
    EventBus.emit(GAME_EVENTS.CONTROL_STATE, {
      menuOpen,
      settingsOpen,
      playing: runtime.hasStarted,
      blocked: blocked(),
      language: runtime.settings.get().language,
    })
  const freeze = () => {
    if (!reasons.size || disposed) return
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
    for (const key of keys) game.scene.resume(key)
    runtime.setPaused(false)
  }
  const request = ({ action, reason = 'menu' } = {}) => {
    if (disposed) return
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
    } else if (action === 'resume' && !blocked()) {
      reasons.delete('menu')
      menuOpen = false
      thaw()
    } else if (action === 'settings' && !blocked()) {
      menuOpen = false
      settingsOpen = true
      game.scene.start(SCENE_KEYS.SETTINGS, {
        onClose: () => {
          settingsOpen = false
          menuOpen = true
          announce()
        },
      })
    } else if (action === 'menu' && !blocked() && runtime.hasStarted) {
      sleeping = game.scene
        .getScenes(false)
        .filter(
          (scene) =>
            scene.scene.key !== SCENE_KEYS.DEBUG &&
            scene.scene.key !== SCENE_KEYS.MAIN_MENU &&
            (scene.sys.isActive() || scene.sys.isPaused()),
        )
        .map((scene) => ({ key: scene.scene.key, resume: paused.includes(scene.scene.key) }))
      for (const { key } of sleeping) game.scene.sleep(key)
      paused = []
      reasons.delete('menu')
      menuOpen = false
      runtime.menuResumeAvailable = sleeping.length > 0
      game.scene.start(SCENE_KEYS.MAIN_MENU)
    } else if (action === 'resume-menu' && !blocked()) {
      game.scene.stop(SCENE_KEYS.MAIN_MENU)
      for (const { key, resume } of sleeping) {
        game.scene.wake(key)
        if (resume) game.scene.resume(key)
        else game.scene.pause(key)
      }
      sleeping = []
      runtime.menuResumeAvailable = false
      runtime.setPaused(false)
    } else if (action === 'discard-menu') {
      for (const { key } of sleeping) game.scene.stop(key)
      sleeping = []
      runtime.menuResumeAvailable = false
    }
    announce()
  }
  EventBus.on(GAME_EVENTS.CONTROL_REQUEST, request)
  game.events.on(Phaser.Core.Events.POST_STEP, freeze)
  game.events.once(Phaser.Core.Events.DESTROY, () => {
    disposed = true
    EventBus.off(GAME_EVENTS.CONTROL_REQUEST, request)
    game.events.off(Phaser.Core.Events.POST_STEP, freeze)
  })
}
