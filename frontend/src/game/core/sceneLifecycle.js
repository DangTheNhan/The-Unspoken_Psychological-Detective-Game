/** Phaser emits shutdown on stop and destroy on game disposal; clean up on either, once. */
export function onSceneEnd(scene, cleanup) {
  let ended = false
  const finish = () => {
    if (ended) return
    ended = true
    scene.events.off('shutdown', finish)
    scene.events.off('destroy', finish)
    cleanup()
  }
  scene.events.once('shutdown', finish)
  scene.events.once('destroy', finish)
  return finish
}
